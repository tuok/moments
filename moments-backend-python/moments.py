import datetime
from flask import Flask, request
from flask_cors import CORS
from database import Database, Entry

DEBUG = True

app = Flask(__name__, static_url_path="")
CORS(app)

db = Database("/Users/tuok/Downloads/home/tuok/moments/data", debug=DEBUG)
db.populate_db()


def entry_from_request() -> Entry:
    data = request.json
    entry = Entry(**data)

    return entry


def serialize_entries(entries: list[Entry]) -> list[dict]:
    return [entry.to_dict() for entry in entries]


@app.route("/")
def root():
    return app.send_static_file("index.html")
    # return redirect(url_for("static", filename="index.html"))


@app.route("/tags")
def get_tags():
    return db.all_tags


@app.route("/entries")
def get_entries():
    return serialize_entries(db.entries)


@app.route("/entries/search", methods=["POST"])
def search_entries():
    data = request.json

    id_ = data.get("id")
    search_term = data.get("searchTerm")
    begin = data.get("begin")
    end = data.get("end")
    start_date_str = data.get("startDate")
    end_date_str = data.get("endDate")
    search_tags = data.get("tags")
    desc = data.get("desc")

    if begin is None or end is None:
        begin = 0
        end = 20

    if id_ is not None and (entry := db.get_entry(id_)) is not None:
        results = [entry]
    else:
        results = db.entries

    if search_tags:
        results = filter(
            lambda entry: all(search_tag in entry.tags for search_tag in search_tags),
            results,
        )

    if search_term:
        search_term = search_term.lower()
        results = filter(lambda entry: search_term in entry.text.lower(), results)

    def parse_str_timestamp(str_timestamp) -> datetime:
        return datetime.strptime(str_timestamp, "%Y-%m-%dT%H:%M:%S.%fZ")

    if start_date_str:
        start_date = parse_str_timestamp(start_date_str)
        results = filter(lambda entry: start_date <= entry.start_time, results)

    if end_date_str:
        end_date = parse_str_timestamp(end_date_str)
        results = filter(lambda entry: end_date >= entry.start_time, results)

    results = sorted(results, key=lambda entry: entry.start_time, reverse=desc)

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
    app.run(port=3000, debug=DEBUG, use_reloader=DEBUG)
