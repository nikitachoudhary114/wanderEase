const express = require("express");
const app = express();
const port = 8080;
const mongoose = require('mongoose');

main().then(() => {
    console.log("Connected to DB");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wanderlust');
}


app.get("/", (req, res) => {
    res.send("Hi, i am root!");
})

app.listen(port, () => {
    console.log("listening to port ", port);
})