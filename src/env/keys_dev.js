require("dotenv").config();

module.exports = {
  MONGO_URI_WEB: process.env.MONGO_URI_WEB,
  TOKEN_MAILRELAY: process.env.TOKEN_MAILRELAY,
  URL_MAILRELAY: process.env.URL_MAILRELAY,
};
