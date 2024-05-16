const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const userRouter = require("./routes/userRoutes");
const bcrypt = require("bcrypt");
const indexRouter = require("./routes/navRoutes");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const multer = require("multer");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const bodyParser = require("body-parser");
const fileController = require("./controller/fileController");

// const upload = multer({ dest: "uploads/" });

// require("dotenv").config();
dotenv.config({ path: "./config.env" });

const app = express();

// using body parsing middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Passport config
require("./config/passport")(passport);

// Require static assets from public folder
app.use(express.static(path.join(__dirname, "assets")));
// Set view engine as EJS
app.engine("ejs", require("ejs").renderFile);
app.set("view engine", "ejs");
// Set 'views' directory for any views
// being rendered res.render()
app.set("views", path.join(__dirname, ""));
// app.use("/", express.static(__dirname + "/index.ejs"));
// app.set("view engine", "html");

// Body parser middle ware
app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");

  next();
});
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use(express.urlencoded({ extended: false }));

app.use("/users", userRouter);
app.use("/", indexRouter);

module.exports = app;

const db = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {})
  .then(() => {
    console.log("DB connection successfull");
  })
  .catch((err) => {
    console.log(err);
  });

const port = process.env.PORT || 3004;

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
