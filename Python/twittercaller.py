from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

# This contains all out twitter api keys
import twitter_creds

class StdOutListener(StreamListener):
    def on_data(self, raw_data):
        print(raw_data)
        return True

    def on_error(self, status_code):
        print(status_code)

if(__name__ == "__main__"):
    listener = StdOutListener()
    auth = OAuthHandler(twitter_creds.Customer_Token, twitter_creds.Customer_Token_Secret)
    auth.set_access_token(twitter_creds.Access_Token, twitter_creds.Access_Token_Secret)

    stream = Stream(auth, listener)

    stream.filter(track=['#metoo'])
