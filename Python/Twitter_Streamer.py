import twitter_auth

from tweepy import OAuthHandler
from tweepy import StreamListener
from tweepy import Stream

import json

"""
For the streamer we will be using Tweepy which is a twitter API wrapper that makes it easier for us to access information on twitter.
Tweepy can be installed by using the command 'pip install tweepy' with the terminal on Pycharm. 
This code will work with Python 3.7.1
"""

class StdOutListener(StreamListener):
    def on_data(self, data):
        print(data)

        return True

    def on_error(self, status_code):
        print(status_code)

if __name__ == "__main__":
    listener = StdOutListener()
    auth = OAuthHandler(twitter_auth.Consumer_API, twitter_auth.Consumer_API_Secret)
    auth.set_access_token(twitter_auth.Access_Token, twitter_auth.Access_Token_Secret)

    stream = Stream(auth, listener)
    stream.filter(track=['#metoo'])
