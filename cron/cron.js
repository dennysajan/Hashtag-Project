const mongoose = require("mongoose");
const cron = require("node-cron");
const keys = require("../config/config");

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(err => console.log(err));

//import schemas
const Tweet = require("./models/Tweet_new");
const Cache = require("./models/DailyCache");

//cron tasks
cron.schedule("59 23 * * *", () => {
  console.log("======= CRON JOB START =======");
  Cache.find()
    .sort({ last_ts: -1 })
    .limit(1)
    .then(res => {
      console.log(`response`);
      const date = new Date();
      const latest = res[0];
      if (!latest) {
        last_ts = 0;
      } else {
        last_ts = latest.last_ts;
      }
      Tweet.countDocuments({
        ts: { $gt: last_ts }
      }).then(count => {
        if (count > 0) {
          const cache = new Cache({
            date,
            count,
            last_ts: date.getTime()
          });
          console.log(cache);
          cache.save().then(() => {
            console.log(
              `Cron Job finished. Cached ${count} on ${date.toString()}\n======= CRON JOB END =======`
            );
          });
        } else {
          console.log(
            `Cron finished. No new tweets (${count}) to cache on ${date.toString()}\n======= CRON JOB END =======`
          );
        }
      });
    });
});
