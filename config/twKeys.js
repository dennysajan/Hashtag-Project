const dotenv = require("dotenv");
dotenv.config();
module.exports = {
  key: process.env.KEY,
  secret: process.env.SECRET,
  accessToken: process.env.ACCESSTOKEN,
  accessTokenSecret: process.env.ACCESSTOKENSECRET
};
