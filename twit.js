var Twit = require("twit");
var fs = require("fs");
const keys = require("./config/twKeys");

//configuration with twitter app keys
var T = new Twit({
  consumer_key: keys.key,
  consumer_secret: keys.secret,
  access_token: keys.accessToken,
  access_token_secret: keys.accessTokenSecret
});

T.get(
  //request type
  "search/tweets",

  //parameters
  {
    q: "#metoo",
    count: 20
  },

  //response
  (err, data, res) => {
    if (err) console.log(err);
    else {
      //write to file
      json = JSON.stringify(data);
      fs.writeFile("twitterdata.json", json, "utf8", err => {
        if (err) console.log(err);
        else console.log("data written");
      });
    }
  }
);
