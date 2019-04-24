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

const keys = require("./config/config");

const stats = require("./routes/api/stats");
const stream = require("./routes/api/stream");

mongoose
  .connect(keys.mongoURI, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log("connected to mongodb");
  })
  .catch(err => console.log(err));

//import schemas
const User = require("./models/User");
const Tweet = require("./models/Tweet_new");

//passport config

// passport.use(
//   new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
//     //TODO: find user in DB
//     axios
//       .get(`http://localhost:5050/users?email=${email}`)
//       .then(res => {
//         const user = res.data[0];
//         if (!user) {
//           return done(null, false, { message: "invalid credentials" });
//         }
//         if (!bcrypt.compareSync(password, user.password)) {
//           return done(null, false, { message: "invalid password" });
//         }
//         return done(null, user);
//       })
//       .catch(error => done(error));
//   })
// );

//serialize user

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser((id, done) => {
//   axios
//     .get(`http://localhost:5050/users/${id}`)
//     .then(res => done(null, res.data))
//     .catch(err => done(err, false));
// });

const app = express();

//configure middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(
//   session({
//     genid: req => {
//       console.log("Inside session middleware");
//       console.log(req.sessionID);
//       return uuid(); // use UUIDs for session IDs
//     },
//     store: new FileStore(),
//     secret: "secret",
//     resave: false,
//     saveUninitialized: true
//   })
// );
app.use(passport.initialize());
app.use(passport.session());

////////////
// ROUTES //
////////////

app.use("/api/stats", stats);
app.use("/api/stream", stream);

app.get("/", (req, res) => {
  res.send(`hit home page`);
});

// app.get("/login", (req, res) => {
//   res.send(`You got the login page!\n`);
// });

// app.post("/login", (req, res, next) => {
//   passport.authenticate("local", (err, user, info) => {
//     if (info) {
//       return res.send(info.message);
//     }
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.redirect("/");
//     }
//     req.login(user, err => {
//       if (err) {
//         return next(err);
//       }
//       return res.redirect("/protected");
//     });
//   })(req, res, next);
// });

// app.get("/protected", (req, res) => {
//   if (req.isAuthenticated()) {
//     res.send("you are in");
//   } else {
//     res.redirect("/");
//   }
// });

const port = process.env.port || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
