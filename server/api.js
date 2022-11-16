const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const precisionValue = 10000;
const inputPrecise = (val) => Number(val || 0).toFixed(4) * precisionValue;
const outputPrecise = (val) => (Number(val || 0) / precisionValue).toFixed(4);
const transactType = (val) => (outputPrecise(val) < 0 ? "debit" : "credit");

// DB references
const Wallet = require("./models/wallet");
const Transaction = require("./models/transaction");

const getWallet = async (walletID) => await Wallet.findById(walletID).lean();

const transactAmount = async ({
  amount,
  balance,
  type,
  walletID,
  description,
}) => {
  const outputType = type ? type : transactType(amount);
  const transaction = await new Transaction({
    amount,
    balance: Number(amount) + Number(balance),
    type: outputType,
    description,
    walletID,
  }).save();
  const walletUpdate = await Wallet.findByIdAndUpdate(
    walletID,
    {
      balance: Number(amount) + Number(balance),
    },
    { new: true }
  );
  if (!walletUpdate?._id) {
    return {};
  }
  return {
    walletID,
    balance: walletUpdate.balance,
    transactionID: transaction._id,
    date: transaction.date,
  };
};

// router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json()); // support json encoded bodies

router.post("/setup", async (req, res) => {
  const requestData = req.body;
  try {
    const { name, balance } = requestData;
    if (!name) {
      return res.status(400).send({ error: "name not provided" });
    }
    const bal = inputPrecise(balance ? balance : 0);
    const wallet = await new Wallet({
      name: String(name),
      created_date: new Date(),
    }).save();
    const walletID = wallet._id;

    const transaction = await transactAmount({
      walletID,
      amount: bal,
      balance: 0,
      description: "initiate wallet",
    });
    if (!transaction.walletID) {
      throw "no wallet by that id";
    }

    const Output = {
      name: wallet.name,
      date: transaction.date,
      transactionID: transaction.transactionID,
      balance: outputPrecise(transaction.balance),
      walletID: walletID,
    };

    return res.status(200).json({ status: 200, data: Output });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.post("/transact/:walletID", async (req, res) => {
  const requestData = req.body;
  try {
    const { amount, description } = requestData;
    const walletID = req.params.walletID;
    if (!amount) {
      return res.status(400).send({ error: "amount not provided" });
    }
    if (!walletID) {
      return res.status(400).send({ error: "walletID not provided" });
    }
    if (String(walletID).length != 24) {
      return res.status(400).send({ error: "walletID wrong" });
    }
    const type = Number(amount) < 0 ? "debit" : "credit";

    const wallet = await getWallet(walletID);
    if (!wallet || !wallet?.created_date)
      return res.status(400).send({ error: "walletID wrong" });

    const amt = inputPrecise(amount ? amount : 0);

    const transaction = await transactAmount({
      walletID,
      amount: amt,
      type,
      balance: wallet.balance || 0,
      description,
    });
    const Output = {
      transactionID: transaction.transactionID,
      balance: outputPrecise(transaction.balance),
      walletID: walletID,
    };
    return res.status(200).json({ data: Output });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/wallet/:walletID", async (req, res) => {
  const walletID = req?.params?.walletID;
  try {
    if (!walletID) {
      return res.status(400).send({ error: "walletID not provided" });
    }
    if (String(walletID).length != 24) {
      return res.status(400).send({ error: "walletID wrong" });
    }

    const wallet = await getWallet(walletID);
    if (!wallet || !wallet.created_date)
      return res.status(400).send({ error: "walletID wrong" });
    const Output = {
      created_date: wallet.created_date,
      updated_date: wallet.updated_date,
      balance: outputPrecise(wallet.balance),
      name: wallet.name,
      walletID: walletID,
    };
    return res.status(200).json({ data: Output });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/transactions/:walletID", async (req, res) => {
  try {
    const requestQueryParams = req.query;
    const { skip, limit, sort } = requestQueryParams;
    let sortBy = { date: -1 };
    if (sort == "amount") {
      sortBy = { amount: -1 };
    }
    const walletID = req.params.walletID;
    if (!walletID) {
      return res.status(400).send({ error: "walletID not provided" });
    }
    if (String(walletID).length != 24) {
      return res.status(400).send({ error: "walletID wrong" });
    }
    const wallet = await getWallet(walletID);
    if (!wallet || !wallet.created_date)
      return res.status(400).send({ error: "walletID wrong" });

    const transactions = await Transaction.find({ walletID: walletID })
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean();
    let outputTransactions = [];
    for (let i = 0; i < transactions.length; ++i) {
      const each = { ...transactions[i] };
      each.amount = outputPrecise(transactions[i].amount);
      each.balance = outputPrecise(transactions[i].balance);
      delete each.__v;

      outputTransactions.push(each);
    }
    const Output = {
      length: outputTransactions?.length || 0,
      walletID: walletID,
      transactions: outputTransactions,
    };
    return res.status(200).json({ data: Output });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------ping requests -------------------------

router.get("/", (req, res) => {
  const requestData = req.body;
  const requestQueryParams = req.query;
  return res.json({
    message: "ping recieved!",
    ...{ ...requestData, ...requestQueryParams },
  });
});
router.get("/ping", (req, res) => {
  const requestData = req.body;

  return res.json({ message: "ping recieved!", ...{ ...requestData } });
});
router.post("/", (req, res) => {
  const requestData = req.body;

  return res.json({ message: "ping recieved!", ...{ ...requestData } });
});
router.post("/ping", (req, res) => {
  const requestData = req.body;

  return res.json({ message: "ping recieved!", ...{ ...requestData } });
});
module.exports = router;
