import campgroundRoutes from "./routes/campgrounds.js";
import ejsMate from "ejs-mate";
import express from "express";
import flash from "connect-flash";
import LocalStrategy from "passport-local";
import methodOverride from "method-override";
import mongoose from "mongoose";
import passport from "passport";
import path from "node:path";
import reviewRoutes from "./routes/reviews.js";
import session from "express-session";
import userRoutes from "./routes/users.js";
import { ExpressError } from "./utils/ExpressError.js";
import { fileURLToPath } from "node:url";
import { User } from "./models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const db = mongoose.connection;
const port = 3000;
const sesssionConfig = {
  secret: "mysecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

mongoose.connect("mongodb://localhost:27017/yelp-camp");

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(methodOverride("_method"));
app.use(session(sesssionConfig));

app.use(passport.initialize());
app.use(passport.session()); // Must use before session()
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh no, something went wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
