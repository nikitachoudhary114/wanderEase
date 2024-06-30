const express = require("express");
const app = express();
const port = 3000;
const cookieParser = require("cookie-parser")
var session = require('express-session')

app.use(session({ secret: "mycode", resave: false, saveUninitialized: true }));
app.use(cookieParser("secretcode"));

app.get("/", (req, res) => {
    res.cookie("hello", "greet");
    res.cookie("india", "jeetaga")
    res.send("hi, i am root");
})
app.get("/home", (req, res) => {
    console.log(req.cookies)
    res.send("home");
})

app.get("/getsignedcookie", (req, res) => {
    res.cookie("made-in", "in", { signed: true })
    res.send("signed");
})
app.get("/verify", (req, res) => {
    console.log(req.signedCookies);
    res.send("verified");
})

app.get("/greet", (req,res)=> {
    res.send(`hi ${ req.cookies.hello }`)
})
app.listen(port, () => {
    console.log("server listening to port", port)
})