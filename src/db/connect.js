const { MONGO_URI_WEB } = require("../env/keys_dev.js");
const mongoose = require("mongoose");

let conn = null;

const connectDB = async () => {
  try {
    if (conn === null) {
      conn = await mongoose.connect(MONGO_URI_WEB);
      console.log("Connected to MongoDB");
    }
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

module.exports = { connectDB };
