const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const cookieParser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
let User = require("./model/user");

const ExpressError = require("./utils/ExpressError");

const { wrap } = require("module");

const listingRouter = require("./routes/listing")
const reviewRouter = require("./routes/review");
const userRouter = require("./routes/user");
const { getMaxListeners } = require("events");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust_web");
}

const sessionOptions = {
  secret: "SecretCode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() * 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  }
};

app.get("/", (req, res) => {
  res.send("Hi, i am root!");
});

app.use(session(sessionOptions))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "demo@gmail.com",
//     username: "demo"
//   });
//   let newUser = await User.register(fakeUser, "demo");
//   res.send("registered");
// });


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wron!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(port, () => {
  console.log("listening to port ", port);
});
