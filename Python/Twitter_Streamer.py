from tweepy import OAuthHandler
from tweepy import StreamListener
from tweepy import Stream
import json
import os

CA = os.environ['CA']
CAS = os.environ['CAS']
AT = os.environ['AT']
ATS = os.environ['ATS']
"""
For the streamer we will be using Tweepy which is a twitter API wrapper that makes it easier for us to access information on twitter.
Tweepy can be installed by using the command 'pip install tweepy' with the terminal on Pycharm. 
This code will work with Python 3.7.1
"""

class StdOutListener(StreamListener):
    def on_data(self, data):
        print(data)
        print()
        return True

    def on_error(self, status_code):
        print(status_code)

if __name__ == "__main__":
    listener = StdOutListener()
    auth = OAuthHandler(CA, CAS)
    auth.set_access_token(AT, ATS)

    stream = Stream(auth, listener)
    stream.filter()
