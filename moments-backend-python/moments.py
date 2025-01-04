import datetime
import os
from typing import cast

from flask import Flask, request, send_from_directory
from flask_cors import CORS
from database import Database, Entry
from dotenv import load_dotenv

load_dotenv("../.env")
DEBUG = os.environ.get("DEBUG_MOMENTS", False) == "1"
PORT = os.environ.get("BACKEND_PORT", 8000)
ENTRY_DIR = os.environ.get("ENTRY_DIR")

if not ENTRY_DIR:
    raise ValueError("ENTRY_DIR environment variable needs to be specified")

app = Flask(__name__, static_url_path="")
CORS(app)
db = Database(ENTRY_DIR, debug=DEBUG)
db.populate_db()


def entry_from_request() -> Entry:
    data = request.json
    entry = Entry(**data)

    return entry


def serialize_entries(entries: list[Entry]) -> list[dict]:
    return [cast(dict, entry.to_dict()) for entry in entries]


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


@app.route("/tags")
def get_tags():
    return db.all_tags


@app.route("/entries")
def get_entries():
    return serialize_entries(db.entries)


@app.route("/entries/search", methods=["POST"])
def search_entries():
    data = request.json

    if DEBUG:
        print(f"Search data: {data}")

    id_ = data.get("id")
    search_term = data.get("searchTerm")
    begin = data.get("begin")
    end = data.get("end")
    start_date_str = data.get("startDate")
    end_date_str = data.get("endDate")
    search_tags = data.get("tags")
    reverse = data.get("desc", True)

    if begin is None or end is None:
        begin = 0
        end = 20

    if id_ is not None and (entry := db.get_entry(id_)) is not None:
        results = [entry]
    else:
        results = db.entries

    if search_tags:
        results = filter(
            lambda e: all(search_tag in e.tags for search_tag in search_tags),
            results,
        )

    if search_term:
        search_term = search_term.lower()
        results = filter(lambda e: search_term in e.text.lower(), results)

    def parse_str_timestamp(str_timestamp) -> datetime:
        return datetime.datetime.strptime(str_timestamp, "%Y-%m-%dT%H:%M:%S.%fZ")

    if start_date_str:
        start_date = parse_str_timestamp(start_date_str)
        results = filter(lambda e: start_date <= e.start_time, results)

    if end_date_str:
        end_date = parse_str_timestamp(end_date_str)
        results = filter(lambda e: end_date >= e.start_time, results)

    results = sorted(results, key=lambda e: e.start_time, reverse=reverse)

    if begin < 0:
        begin = 0
    if end > len(results):
        end = len(results)

    return serialize_entries(results[begin:end])


@app.route("/entries", methods=["POST"])
def add_entry():
    db.add_entry(entry_from_request())


@app.route("/entries", methods=["DELETE"])
def remove_entry():
    db.remove_entry(entry_from_request())


@app.route("/init", methods=["GET"])
def init_entries():
    db.populate_db()


if __name__ == "__main__":
    app.run(port=PORT, debug=DEBUG, use_reloader=False)
