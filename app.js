const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./model/listing");

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust_web");
}
app.get("/testListing", async (req, res) => {
    const listing = new Listing({
        title: "My villa",
        description: "tall wind",
        price: 31200,
        location: "goa, India",
        country: "india",
    });
    await listing.save()
    console.log("sample saved");
    res.send("success testing");
    // .then(() => {
    //     console.log("data saved");
    // })
    // .catch((err) => {
    //     console.log(err);
    // });
});



app.get("/", (req, res) => {
    res.send("Hi, i am root!");
});

app.listen(port, () => {
    console.log("listening to port ", port);
});
