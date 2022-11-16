var mongoose = require("mongoose");
var WalletSchema = new mongoose.Schema({
  walletID: String,
  name: String,
  balance: Number,
  created_date: { type: Date },
  updated_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Wallet", WalletSchema);
