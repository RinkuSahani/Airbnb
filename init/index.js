const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main()
  .then((res) => {
    console.log("Mongoose is connected to DataBase.");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

async function initDB() {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:'67fb8d0f349b6f8a114814a2'}))
  await Listing.insertMany(initData.data);
  console.log("Data is saved");
}
initDB();
