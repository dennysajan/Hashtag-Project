const express = require("express");
const router = express.Router();

const Tweet = require("../../models/Tweet_new");

router.get("/tw", (req, res) => {
  const data = {};
  Tweet.countDocuments()
    .then(resp => {
      data.count = resp;
    })
    .then(
      Tweet.countDocuments({ lang: "en" })
        .then(resp => {
          data.count_english = resp;
        })
        .then(
          Tweet.countDocuments({
            ts: { $gt: new Date().getTime() - 1000 * 60 * 60 * 24 }
          })
            .then(resp => {
              data.count_24h = resp;
            })
            .then(
              Tweet.countDocuments({
                ts: { $gt: new Date().getTime() - 1000 * 60 * 60 * 24 * 7 }
              })
                .then(resp => {
                  data.count_7d = resp;
                })
                .then(
                  Tweet.countDocuments({
                    ts: {
                      $gt: new Date().getTime() - 1000 * 60 * 60 * 24 * 7 * 30
                    }
                  })
                    .then(resp => {
                      data.count_30d = resp;
                    })
                    .then(() => {
                      res.status(200).json(data);
                    })
                )
            )
        )
    );
});

module.exports = router;
