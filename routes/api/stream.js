const express = require("express");
const router = express.Router();
const Twit = require("twit");
const keys = require("../../config/config");

var collect = false;

var T = new Twit({
  consumer_key: keys.key,
  consumer_secret: keys.secret,
  access_token: keys.accessToken,
  access_token_secret: keys.accessTokenSecret
});

//import schemas
const Tweet = require("../../models/Tweet_new");
stream = T.stream("statuses/filter", { track: "#metoo" });

router.get("/on", (req, res) => {
  c();
  // stream.start();
  return res.status(200).json("stream turned on");
});

router.get("/off", (req, res) => {
  stream.stop();
  return res.status(200).json("stream turned off");
});

function c() {
  stream.on("tweet", tweet => {
    // console.log(tweet);
    // console.log(`hashtags used: ${JSON.stringify(tweet.entities.hashtags)}`);
    Tweet.findOne({ tweet_id: tweet.id }).then(exists => {
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
        // console.log(newTweet);
        newTweet.save().then(tw => {
          console.log(`new tweet. ts: ${tw.ts}`);
        });
      }
    });
  });
}

module.exports = router;
