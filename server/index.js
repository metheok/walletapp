// Load Node modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const api = require("./api");
const bodyParser = require("body-parser");
const PORT = 4000;
// const PORT = process.env.PORT || 4000;

// const mongoURL = "mongodb://127.0.0.1/walletapp";
const mongoURL =
  "mongodb+srv://studentinok:3CJAqe8buIvo3dPt@cluster0.jjwuycq.mongodb.net/walletapp";

const log = (msg) => console.log(msg || "test message");

const app = express();
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // support json encoded bodies

app.use(express.static(path.resolve(__dirname, "../client/build")));

app.use("/api", api);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log("connected to database"))
  .catch((e) => console.log("Error while connecting", e));

app.listen(PORT, () => {
  log(`Listening to port ${PORT} `);
});
