import json
import time
import csv
from kafka import KafkaProducer
from datetime import datetime, timedelta


PRODUCER = KafkaProducer(bootstrap_servers=['localhost:9092'])
SOURCE_DICT = {
    "IPHONE": ['iPhone', 'iOS', 'Iphone', 'IPHONE', 'IPhone'],
    "ANDROID": ['Android', 'android'],
    "IPAD": ['iPad', 'IPAD', 'IPad', 'Ipad'],
    "MAC": ['Mac', 'MAC'],
    "WINDOWS": ['Windows', 'windows'],
    "WEB": ['Web', 'web']
}


def get_tweets():
    with open("tweets.csv", "r") as f:
        reader = csv.reader(f, delimiter=",")
        for i, line in enumerate(reader):
            tweet_source_res = line[2]
            tweet_time = line[1]
            tweet_text = line[0]
            print(f"\n Tweet Text: {tweet_text} posted at {tweet_time} from {tweet_source_res} \n")
            output = {"text": str(tweet_text), "tweet_time": str(tweet_time), "source": str(tweet_source_res)}
            PRODUCER.send(topic='TweetsTopic', value=json.dumps(output).encode('utf-8'))
            time.sleep(3)


if __name__ == "__main__":
    get_tweets()
