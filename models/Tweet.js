const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
    tweet_id:{
        type: String,
        required:true
    },
    text:{
        type: String
    },
    hashtags:[{
        text:{
            type: String
        }
    }],
    user:{
        user_id:{
            type: String,
            required: true
        },
        verified:{
            type: Boolean
        }
    },
    retweet_count:{
        type: Number
    },
    favorite_count:{
        type: Number
    },
    lang:{
        type: String
    },
    retweeted_status:{
        tweet_id:{
            type: String
        },
        text:{
            type: String
        },
        user:{
            user_id:{
                type: String
            },
            verified:{
                type: Boolean
            }
        }
    }
});

module.exports = Tweet = mongoose.model("tweet", TweetSchema);