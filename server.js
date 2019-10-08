const mongoose = require("mongoose");
const keys = require("./config/config");
const Twit = require("twit");

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(err => console.log(err));

var T = new Twit({
  consumer_key: keys.key,
  consumer_secret: keys.secret,
  access_token: keys.accessToken,
  access_token_secret: keys.accessTokenSecret
});

//import schemas
const Tweet = require("./models/Tweet_new");
stream = T.stream("statuses/filter", { track: "#metoo" });

stream.on("tweet", tweet => {
  // console.log(tweet);
  // console.log(`hashtags used: ${JSON.stringify(tweet.entities.hashtags)}`);
  Tweet.findOne({ tweet_id: tweet.id })
    .then(exists => {
      if (exists) {
        console.log("tweet exists. skipped.");
        //skip
      } else {
        var re_user = {};
        var retweeted_status = {};

        var user = {
          user_id: tweet.user.id,
          verified: tweet.user.verified
        };
        if (tweet.retweeted_status) {
          re_user = {
            user_id: tweet.retweeted_status.user.id,
            verified: tweet.retweeted_status.user.verified
          };
          retweeted_status = {
            tweet_id: tweet.retweeted_status.id,
            text: tweet.retweeted_status.text,
            re_user
          };
        }
        var newTweet = new Tweet({
          tweet_id: tweet.id,
          text: tweet.text,
          hashtags: tweet.entities.hashtags,
          user,
          retweet_count: tweet.retweet_count,
          favorite_count: tweet.favorite_count,
          lang: tweet.lang,
          retweeted_status,
          ts: tweet.timestamp_ms
        });

        newTweet
          .save()
          .then(tw => {
            console.log(`new tweet. ts: ${tw.ts}`);
          })
          .catch(e => {
            console.log(e);
            process.abort();
          });
      }
    })
    .catch(e => {
      console.log(e);
      process.abort();
    });
});
