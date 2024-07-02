const mongoose = require("mongoose");
const Listing = require("../model/listing");
const initData = require("./data");

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust_web");
}


const initDb = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((el) => ({ ...el, owner: '6683e21ead4af80ac6de9b4a' }))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDb();
