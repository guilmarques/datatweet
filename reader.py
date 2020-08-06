import requests_oauthlib
import json
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
from kafka import KafkaProducer
from datetime import datetime, timedelta

ACCESS_TOKEN = 'CHANGEIT'
ACCESS_SECRET = 'CHANGEIT'
CONSUMER_KEY = 'CHANGEIT'
CONSUMER_SECRET = 'CHANGEIT'
MY_AUTH = requests_oauthlib.OAuth1(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_SECRET)
PRODUCER = KafkaProducer(bootstrap_servers=['localhost:9092'])
SOURCE_DICT = {
    "IPHONE": ['iPhone', 'iOS', 'Iphone', 'IPHONE', 'IPhone'],
    "ANDROID": ['Android', 'android'],
    "IPAD": ['iPad', 'IPAD', 'IPad', 'Ipad'],
    "MAC": ['Mac', 'MAC'],
    "WINDOWS": ['Windows', 'windows'],
    "WEB": ['Web', 'web']
}
FIND_WORDS = ["xp inc"]


class StdOutListener(StreamListener):
    def on_data(self, data):
        my_json = data.replace("'", '"')
        full_tweet = json.loads(str(my_json))
        year = str(datetime.now().year)

        try:
            tweet_text = full_tweet['extended_tweet']['full_text'].replace('\n', ' ').replace('\r', '')
        except:
            tweet_text = full_tweet['text'].replace('\n', ' ').replace('\r', '')

        if [val for val in FIND_WORDS if val.upper() in str(tweet_text).upper()]:
            tweet_time = full_tweet['created_at']
            tweet_time = datetime.strptime(tweet_time[4:10] + " 2020 " + tweet_time[11:19], "%b %d %Y %H:%M:%S") - \
                         timedelta(hours=3, minutes=0)
            tweet_source = full_tweet['source']
            flag_source = False
            tweet_source_res = "Others"
            for source in SOURCE_DICT:
                for name in SOURCE_DICT[source]:
                    flag_source = True if name in str(tweet_source) else False
                    if flag_source:
                        break
                if flag_source:
                    tweet_source_res = str(source)
                    break
            print(f"\n Tweet Text: {tweet_text} posted at {tweet_time} from {tweet_source_res} \n")
            output = {"text": str(tweet_text), "tweet_time": str(tweet_time), "source": str(tweet_source_res)}
            PRODUCER.send(topic='TweetsTopic', value=json.dumps(output).encode('utf-8'))
        return True

    def on_error(self, status):
        print(status)


def get_tweets():
    l = StdOutListener()
    auth = OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(ACCESS_TOKEN, ACCESS_SECRET)
    stream = Stream(auth, l)
    while True:
        try:
            stream.filter(track=FIND_WORDS)
        except:
            pass


if __name__ == "__main__":
    get_tweets()
