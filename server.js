//Import libraries
const mongoose = require("mongoose");
const keys = require("./config/config");
const Twit = require("twit");

//Get command line arguments for debug preference
var cliArgs = process.argv.slice(2);	//Drop the node command and script location
var logLevel = cliArgs[0];

var logLevelHuman = "";

if (logLevel == "0") {
	logLevelHuman = "0 - Silent";
} else if (logLevel == "1") {
	logLevelHuman = "1 - Print application startup and critical errors only";
} else if (logLevel == "2") {
	logLevelHuman = "2 - Print application activity";
} else if (logLevel == "3") {
	logLevelHuman = "3 - Print verbose application activity";
} else {
	console.log("Log level unknown - exiting");
	process.abort();
}

console.log("Log level " + logLevelHuman)

/*
*  Log levels
*  0 = Silent (Don't print anything)
*  1 = Critical errors only (recommended for running as a service)
*  2 = Debug
*/

//Connect to Mongo backend
mongoose
.connect(keys.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
.then(() => {
	if (logLevel > 0) {
		console.log("Connected to MongoDB");
	}
})
.catch(err => {
	if (logLevel > 0) {
		console.log(err);
	}
	process.abort();	//Abort to let service manager attempt to restart
});

//Setup Twitter client connection parameters
var T = new Twit({
	consumer_key: keys.key,
	consumer_secret: keys.secret,
	access_token: keys.accessToken,
	access_token_secret: keys.accessTokenSecret
});

//Import Tweet model
const Tweet = require("./models/Tweet_new");

//Connect to Twitter stream and set tracked hashtags
stream = T.stream("statuses/filter", { track: "#metoo, #blacklivesmatter, #metooindia, #metoomosque, #metook12, #solidarityisforwomen, #istandwith, #sowhite, #oscarssowhite, #communicationsowhite, #citeblackwomen, #blackgirlmagic, #baltimore, bringbackourgirls, blacktwitter, #yesallwomen, #morethanawoman" });

stream.on("tweet", tweet => {
	if (logLevel > 2) {
		console.log(tweet);
	}
	Tweet.findOne({ tweet_id: tweet.id })
	.then(exists => {
		if (exists) {
			if (logLevel > 1) {
				console.log("Tweet exists in database. Skipped.");
			}
			//Do not create duplicate tweet in database
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
			.save()	//Candygram for Mongo
			.then(tw => {
				if (logLevel > 1) {
					console.log(`New Tweet. ts: ${tw.ts}`);
				}
			})
			.catch(e => {
				if (logLevel > 0) {
					console.log(e);
				}
				process.abort();
			});
		}
	})
	.catch(e => {
		if (logLevel > 0) {
			console.log(e);
		}
		process.abort();
	});
});
