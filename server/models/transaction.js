var mongoose = require("mongoose");
var TransactionSchema = new mongoose.Schema({
  walletID: String,
  description: String,
  type: String,
  amount: Number,
  balance: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
