const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.set('useCreateIndex', true);

mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((e) => {
    console.error("Connection error", e.message);
  });

const db = mongoose.connection;

module.exports = db;
