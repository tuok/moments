import dataclasses
import functools
import json
import pickle


import re
import time
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

y_re = re.compile(r"^\d{4}$")
my_re = re.compile(r"^\d{1,2}\/\d{4}$")
dmy_re = re.compile(r"^\d{1,2}\.\d{1,2}\.\d{4}$")
dmyh_re = re.compile(r"^\d{1,2}\.\d{1,2}\.\d{4} \d{1,2}:xx$")
dmyhm_re = re.compile(r"^\d{1,2}\.\d{1,2}\.\d{4} \d{1,2}:\d{1,2}$")


def convert_to_serializable(obj: Any) -> Any:
    if dataclasses.is_dataclass(obj):
        return {
            field.name: convert_to_serializable(getattr(obj, field.name))
            for field in dataclasses.fields(obj)
        }
    elif isinstance(obj, datetime):
        return obj.isoformat()
    elif isinstance(obj, Path):
        return str(obj)
    elif isinstance(obj, set):
        return list(obj)
    else:
        return obj


@functools.total_ordering
@dataclass
class Entry:
    id: int
    author: str | None
    tags: set[str]
    links_to: set[int]
    start_readable_timestamp: str
    end_readable_timestamp: str | None
    title: str | None
    text: str
    private: bool  # Can this be removed?
    start_time: datetime
    end_time: datetime | None
    path: Path

    def __lt__(self, other) -> bool:
        return self.start_time < other.start_time

    def generate_timestamp_path(self) -> Path:
        year = 9999
        month = 1
        day = 1
        hour = 0
        minute = 0

        if y_re.match(self.start_readable_timestamp):
            year = int(self.start_readable_timestamp)

        elif my_re.match(self.start_readable_timestamp):
            month, year = [int(x) for x in self.start_readable_timestamp.split("/")]

        elif dmy_re.match(self.start_readable_timestamp):
            day, month, year = [
                int(x) for x in self.start_readable_timestamp.split(".")
            ]

        elif dmyh_re.match(self.start_readable_timestamp) or dmyhm_re.match(
            self.start_readable_timestamp
        ):
            dmy_raw, hm_raw = self.start_readable_timestamp.split(" ")
            hour_raw, min_raw = hm_raw.split(":")

            day, month, year = [int(x) for x in hm_raw.split(".")]

            hour = int(hour_raw)

            try:
                minute = int(min_raw)
            except:
                minute = 0

        file_name = (
            f"{year:04}{month:02}{day:02}-{hour:02}{minute:02}_{self.id:06}.json"
        )
        entry_path = Path(f"{year:04}", f"{month:02}", file_name)

        return entry_path

    @staticmethod
    def parse_datetime(datetime_str: str | None) -> datetime | None:
        if datetime_str is None:
            return None

        return datetime(*map(int, re.findall("\d+", datetime_str)))

    @classmethod
    def from_json(cls, json_data: dict, path: Path) -> "Entry":
        mandatory_fields = ["id", "start_readable_timestamp", "text", "start_time"]

        for field in mandatory_fields:
            if field not in json_data:
                raise ValueError(f"Field '{field}' is mandatory.")

        json_data["path"] = path
        json_data["id"] = int(json_data["id"])
        json_data["start_time"] = cls.parse_datetime(json_data["start_time"])
        json_data["tags"] = (
            set(json_data["tags"]) if "tags" in json_data and json_data["tags"] else {}
        )
        json_data["links_to"] = (
            set(json_data["links_to"])
            if "links_to" in json_data and json_data["links_to"]
            else {}
        )
        json_data["end_time"] = cls.parse_datetime(json_data["end_time"])

        entry = cls(**json_data)

        return entry

    def to_dict(self) -> str:
        return convert_to_serializable(self)


class Database:
    entry_regex = re.compile("^[0-9]{8}-[0-9]{4}_[0-9]{6}[.]json$")
    max_id = 1

    def __init__(self, path: str, debug: bool = False) -> None:
        self.debug = debug
        self.all_tags = {}
        self.all_entries = {}

        if debug:
            self.debug_dir = Path(".", "debug")
            self.all_tags_debug_path = self.debug_dir / "all_tags_debug"
            self.all_entries_debug_path = self.debug_dir / "all_entries_debug"

        if path[-1] != "/":
            path += "/"

        self.root_dir = Path(path)

        if not self.root_dir.exists():
            raise RuntimeError(
                f"Specified path {path} doesn't exist. Cannot load entries."
            )

    def debug_data_exists(self) -> bool:
        return (
            self.all_tags_debug_path.exists() and self.all_entries_debug_path.exists()
        )

    def dump_debug_db(self) -> None:
        self.debug_dir.mkdir(parents=True, exist_ok=True)

        with open(self.all_tags_debug_path, "wb") as all_tags_handle:
            pickle.dump(self.all_tags, all_tags_handle)

        with open(self.all_entries_debug_path, "wb") as all_entries_handle:
            pickle.dump(self.all_entries, all_entries_handle)

    def load_debug_db(self) -> None:
        with open(self.all_tags_debug_path, "rb") as all_tags_handle:
            self.all_tags = pickle.load(all_tags_handle)

        with open(self.all_entries_debug_path, "rb") as all_entries_handle:
            self.all_entries = pickle.load(all_entries_handle)

        print("Loaded debug DB from pickle files.")

    @staticmethod
    def validate_entry(entry: Entry) -> None:
        if entry.end_time and entry.start_time > entry.end_time:
            raise ValueError("Entry start time must come before end time.")

    @property
    def entries(self) -> list[Entry]:
        return list(self.all_entries.values())

    def get_entry(self, id_: int) -> Entry | None:
        return self.all_entries.get(id_)

    def add_or_update_entry(self, entry: Entry) -> None:
        if entry.id in self.all_entries:
            self.modify_entry(entry)
        else:
            self.add_entry(entry)

    def add_entry(self, entry: Entry) -> None:
        self.validate_entry(entry)

        while Database.max_id in self.all_entries:
            Database.max_id += 1

        entry.id = Database.max_id
        self.all_entries[entry.id] = entry

        for tag in entry.tags:
            self.add_tag(tag)

        self.update_links_to_entries(entry)
        self.save_entry(entry)

    def modify_entry(self, entry: Entry) -> None:
        if entry.id not in self.all_entries:
            raise RuntimeError(f"Could not found entry with id {entry.id}")

        self.validate_entry(entry)

        old_entry = self.all_entries[entry.id]

        # Update tags
        for old_tag in old_entry.tags:
            if old_tag not in entry.tags:
                self.remove_tag(old_tag)

        for new_tag in entry.tags:
            if new_tag not in old_entry.tags:
                self.add_tag(new_tag)

        entry.path = old_entry.path
        entry.private = old_entry.private

        self.all_entries[entry.id] = entry
        self.save_entry(entry)

    def save_entry(self, entry: Entry) -> None:
        if entry.path.exists():
            entry.path.unlink(missing_ok=True)

        entry.path = self.root_dir / entry.generate_timestamp_path()
        entry.path.mkdir(exist_ok=True)

        file_content = json.dumps(entry, indent=4)
        entry.path.write_text(file_content, encoding="utf-8")
        print(f"Entry #{entry.id} was saved successfully in {entry.path}")

    def remove_entry(self, entry: Entry) -> None:
        removable_entry = self.all_entries.get(entry.id)

        if not removable_entry:
            raise ValueError(f"Could not found entry with id {entry.id}")

        entry.path.unlink(missing_ok=True)

        for tag in removable_entry.tags:
            self.remove_tag(tag)

        del self.all_entries[removable_entry.id]
        print(f"Entry #{entry.id} was removed successfully ({entry.path})")

    def populate_db(self) -> None:
        if self.debug and self.debug_data_exists():
            self.load_debug_db()
            return

        entry_files, ignored_files = self.get_entry_files()
        entry_files = sorted(entry_files)

        self.all_entries.clear()
        self.all_tags.clear()

        self.parse_entries(entry_files)
        self.update_links_to_entries_all()

        if self.debug and not self.debug_data_exists():
            self.dump_debug_db()

    def get_entry_files(self) -> tuple[list[Path], list[Path]]:
        entry_files = []
        ignored_files = []

        print(f"Browsing through root directory '{self.root_dir}' for entries...")

        for json_path in self.root_dir.glob("**/*.json"):
            if self.entry_regex.match(json_path.name):
                entry_files.append(json_path)
            else:
                ignored_files.append(json_path)

        print(f"Browsing finished. Found {len(entry_files)} entry candidates.")

        if ignored_files:
            print(
                "Ignored following files as their name didn't match expected pattern:"
            )
            print("\n".join(ignored_files))

        return entry_files, ignored_files

    def add_tag(self, tag: str) -> None:
        if tag in self.all_tags:
            self.all_tags[tag] += 1
        else:
            self.all_tags[tag] = 1

    def remove_tag(self, tag: str) -> None:
        if tag in self.all_tags:
            self.all_tags[tag] -= 1

            if self.all_tags[tag] <= 0:
                del self.all_tags[tag]

    def parse_entries(self, entry_files: list[Path]):
        loaded_count = 0

        for entry_file in entry_files:
            json_data = json.loads(entry_file.read_text(encoding="utf-8"))

            try:
                entry = Entry.from_json(json_data, entry_file)
            except Exception as ex:
                print(f"Ignoring '{entry_file}' because of error: {ex}")
                continue

            self.max_id = max(entry.id, self.max_id)

            for tag in entry.tags:
                self.add_tag(tag)

            if entry.id not in self.all_entries:
                self.all_entries[entry.id] = entry

            loaded_count += 1

            if loaded_count % 100 == 0:
                print(f"Loaded {loaded_count} entries so far...")

        print(f"Loaded total of {loaded_count} entries.")

    def update_links_to_entries(self, entry: Entry) -> None:
        for linked_id in entry.links_to:
            linked_entry: Entry = self.all_entries.get(linked_id)

            if linked_entry is None:
                print(f"Warning: entry #{entry.id} links to missing entry #{linked_id}")
                continue

            linked_entry.links_to.add(entry.id)

    def update_links_to_entries_all(self) -> None:
        print("Updating links for all entries...")

        for entry in self.all_entries.values():
            self.update_links_to_entries(entry)
