from flask import jsonify
from flask import Flask
from flask import render_template
import happybase
import itertools
from datetime import datetime, timedelta

HBASE_TABLE = "tweets"
HCONN = happybase.Connection(host='localhost', port=9090)
HTABLE = HCONN.table(HBASE_TABLE)

app = Flask(__name__)


@app.route("/")
def chart():
    return render_template('chart.html')


@app.route("/refresh")
def hbase_to_json():
    one_hour_from_now = datetime.now() + timedelta(minutes=-3)
    print(format(one_hour_from_now, '%Y-%m-%d %H:%M:%S'))
    result = {}
    for key, data in HTABLE.scan(row_start=format(one_hour_from_now, '%Y-%m-%d %H:%M:%S')):
        result[key.decode("utf-8")] = data[b'main_tweets:source'].decode("utf-8")
    result = [(k, len(list(v))) for k, v in itertools.groupby(sorted(result.values()))]
    print(result)
    return jsonify(result)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)
