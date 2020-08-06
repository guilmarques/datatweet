import time
from pyspark import SparkConf, SparkContext
from pyspark.sql.functions import col, from_json
from pyspark.sql.types import StringType, StructField, StructType
from pyspark.sql import SparkSession
import happybase
import MySQLdb

DB = MySQLdb.connect(host="localhost",    # your host, usually localhost
                     user="root",         # your username
                     passwd="123db4",  # your password
                     db="sys")

HBASE_HTABLE = "tweets"
HCONN = happybase.Connection(host='localhost', port=9090)
HTABLE = HCONN.table(HBASE_HTABLE)
SCHEMA = StructType(
            [
                StructField("text", StringType(), True),
                StructField("tweet_time", StringType(), True),
                StructField("source", StringType(), True),
            ]
)


def main():
    conf = SparkConf().setMaster("local[2]").setAppName("KAFKAStreaming").set("spark.ui.port", "44040")
    sc = SparkContext(conf=conf)
    spark = SparkSession(sc)
    streaming = stream(spark)
    while streaming.isActive:
        time.sleep(10000)


def save_to_hbase_mysql(df, epoch_id):
    print("Entrooou")
    if not df.rdd.isEmpty():
        df.show()
        line = df.limit(1).collect()
        print(line)
        HTABLE.put((str(epoch_id)), {b'main_tweets:text': line[0][0]})
        HTABLE.put((str(epoch_id)), {b'main_tweets:tweet_time': line[0][1]})
        HTABLE.put((str(epoch_id)), {b'main_tweets:source': line[0][2]})

        cur = DB.cursor()
        cur.execute("INSERT INTO sys.tweets (text, tweet_time, source) VALUES (%s, %s, %s)",
                    (line[0][0].encode('utf8'), str(line[0][1]), line[0][2].encode('utf8')))
        DB.commit()


def stream(spark):
    df = spark \
        .readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", "localhost:9092") \
        .option("subscribe", "TweetsTopic") \
        .load() \
        .select(from_json(col("value").cast("String"), SCHEMA).alias("data"), col("timestamp")) \
        .select("data.*", "timestamp") \
        .select("text", "tweet_time", "source", "timestamp") \
        .writeStream \
        .outputMode("update") \
        .trigger(processingTime='2 seconds') \
        .foreachBatch(save_to_hbase_mysql) \
        .start()
    return df


if __name__ == "__main__":
    main()
