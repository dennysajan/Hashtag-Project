import tweepy
from tweepy import OAuthHandler
import twitter_auth

auth = OAuthHandler(twitter_auth.Customer_Token, twitter_auth.Customer_Token_Secret)
auth.set_access_token(twitter_auth.Access_Token, twitter_auth.Access_Token_Secret)

api = tweepy.API(auth)

user = api.get_user('Den__ny')

print(user.screen_name)
print(user.followers_count)
for friend in user.friends():
    print(friend.screen_name)