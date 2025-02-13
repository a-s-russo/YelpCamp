import campgrounds from "./routes/campgrounds.js";
import ejsMate from "ejs-mate";
import express from "express";
import flash from "connect-flash";
import methodOverride from "method-override";
import mongoose from "mongoose";
import path from "node:path";
import reviews from "./routes/reviews.js";
import session from "express-session";
import { ExpressError } from "./utils/ExpressError.js";
import { fileURLToPath } from "node:url";

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

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);

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
