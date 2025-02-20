const mongoose = require("mongoose");

let conn = null;

const connectDB = async () => {
  try {
    if (conn === null) {
      conn = await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB");
    }
    return conn;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

module.exports = { connectDB };
