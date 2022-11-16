import React from "react";
import "./home.css";
import { setupWallet, getWallet, transactWallet } from "../apiCalls";
function Home() {
  const [walletData, setWalletData] = React.useState(null);
  const [walletFormShow, setWalletFormShow] = React.useState(false);
  const txnFormamount = React.useRef({});
  const txnFormdescription = React.useRef({});
  const txnFormtype = React.useRef({});

  const [submitErr, setSubmitErr] = React.useState("");
  const [txnErr, setTxnErr] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
    let walletID;
    if (typeof window !== "undefined") {
      walletID = localStorage.getItem("walletID");
    }
    if (walletID) {
      getWallet(walletID).then((resp) => {
        if (resp[1]) {
          setLoading(false);

          return setWalletFormShow(true);
        }

        setWalletData(resp[0].data);
        setLoading(false);
      });
    } else {
      setWalletFormShow(true);
      setLoading(false);
    }
  }, []);
  const resetTxnForm = () => {
    txnFormdescription.current.value = "";
    txnFormamount.current.value = "";
    txnFormtype.current.value = "credit";
  };
  const submitForm = (event) => {
    setLoading(true);

    event.preventDefault();
    const name = event.target?.name?.value;
    const balance = event.target?.balance?.value || 0;
    if (!name || typeof name != "string") return setSubmitErr("err");
    return setupWallet({ name, balance }).then((resp) => {
      if (resp[1]) {
        setLoading(false);

        return setSubmitErr("err");
      }
      localStorage.setItem("walletID", resp[0]?.data.walletID);

      setWalletData(resp[0]?.data);
      setWalletFormShow("");
      setSubmitErr("");
      setTxnErr("");
      setLoading(false);
    });
  };
  const submitFormTxn = (event) => {
    setLoading(true);

    event.preventDefault();
    const description = event.target?.description?.value;
    const amount = event.target?.amount?.value || 0;
    const type = event.target?.type?.value || "credit";
    const amountOutput =
      type === "debit" ? Math.abs(amount) * -1 : Math.abs(amount);

    if (!type || typeof amountOutput != "number") {
      setLoading(false);

      return setTxnErr("err");
    }
    return transactWallet({
      walletID: walletData.walletID,
      description,
      amount: amountOutput,
    }).then((resp) => {
      if (resp[1]) {
        setLoading(false);

        return setTxnErr("err");
      }
      return getWallet(walletData.walletID).then((res) => {
        if (res[1]) {
          setLoading(false);
          return setTxnErr("err");
        }
        setWalletData({ ...walletData, ...resp[0]?.data });
        setLoading(false);

        setSubmitErr("");
        resetTxnForm();
        setTxnErr("");
      });
    });
  };

  if (loading || (!walletFormShow && !walletData)) {
    return (
      <div>
        <p>Loading ... </p>
      </div>
    );
  }

  if (walletFormShow) {
    return (
      <div>
        <h1>Wallet Form</h1>
        <form onSubmit={submitForm}>
          <div>
            <label htmlFor="name">Name</label>
            <input name="name" type="text" id="name" />
          </div>

          <div>
            <label htmlFor="balance">Balance</label>
            <input name="balance" id="balance" step="0.0001" type="number" />
          </div>

          <div>
            <button type="submit">Submit</button>
          </div>
          <div>{submitErr ? "error" : null}</div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <h1>WALLET</h1>
      <p>Wallet Name: {walletData.name}</p>
      <p>Wallet Balance: {walletData.balance}</p>
      <div>
        <h3>Transaction Form</h3>
        <form onSubmit={submitFormTxn}>
          <div>
            <label htmlFor="amount">Amount:</label>
            <input
              name="amount"
              id="amount"
              ref={txnFormamount}
              step="0.0001"
              type="number"
            />
          </div>
          <div>
            <label htmlFor="type">Transaction type:</label>

            <select name="type" ref={txnFormtype} id="type">
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              ref={txnFormdescription}
              type="text"
              id="description"
            />
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
          <div>{txnErr ? "error" : null}</div>
        </form>
      </div>
    </div>
  );
}
export default Home;
