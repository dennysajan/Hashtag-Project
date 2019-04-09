const express = require("express");
const uuid = require("uuid/v4");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const axios = require("axios");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const Twit = require("twit");
const keys = require("./config/config");

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
const User = require("./models/User");
const Tweet = require("./models/Tweet");

//passport config
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    //TODO: find user in DB
    axios
      .get(`http://localhost:5050/users?email=${email}`)
      .then(res => {
        const user = res.data[0];
        if (!user) {
          return done(null, false, { message: "invalid credentials" });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "invalid password" });
        }
        return done(null, user);
      })
      .catch(error => done(error));
  })
);
//serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  axios
    .get(`http://localhost:5050/users/${id}`)
    .then(res => done(null, res.data))
    .catch(err => done(err, false));
});

const app = express();

//configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    genid: req => {
      console.log("Inside session middleware");
      console.log(req.sessionID);
      return uuid(); // use UUIDs for session IDs
    },
    store: new FileStore(),
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

////////////
// ROUTES //
////////////

app.get("/", (req, res) => {
  res.send(`hit home page`);
});

app.get("/login", (req, res) => {
  res.send(`You got the login page!\n`);
});

app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (info) {
      return res.send(info.message);
    }
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/");
    }
    req.login(user, err => {
      if (err) {
        return next(err);
      }
      return res.redirect("/protected");
    });
  })(req, res, next);
});

app.get("/protected", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("you are in");
  } else {
    res.redirect("/");
  }
});

app.get("/api/gettw", (_req, _res) => {
  T.get(
    //request type
    "search/tweets",

    //parameters
    {
      q: "#metoo",
      count: 100
    },

    //response
    (err, data, res) => {
      if (err) console.log(err);
      else {
        data.statuses.forEach(tw => {
          Tweet.findOne({ tweet_id: tw.id }).then(exists => {
            if (exists) {
              //skip
            } else {
              var re_user = {};
              var retweeted_status = {};

              var user = {
                user_id: tw.user.id,
                verified: tw.user.verified
              };
              if (tw.retweeted_status) {
                re_user = {
                  user_id: tw.retweeted_status.user.id,
                  verified: tw.retweeted_status.user.verified
                };
                retweeted_status = {
                  tweet_id: tw.retweeted_status.id,
                  text: tw.retweeted_status.text,
                  re_user
                };
              }
              var newTweet = new Tweet({
                tweet_id: tw.id,
                text: tw.text,
                hashtags: tw.entities.hashtags,
                user,
                retweet_count: tw.retweet_count,
                favorite_count: tw.favorite_count,
                lang: tw.lang,
                retweeted_status
              });

              newTweet.save().then(tw => {});
            }
          });
        });
        _res.status(200).json("tweets saved");
      }
    }
  );
});

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const stream = T.stream("statuses/filter", { track: "#metoo" });

stream.on("tweet", tweet => {
  console.log(tweet);
  console.log(`hashtags used: ${JSON.stringify(tweet.entities.hashtags)}`);
});
