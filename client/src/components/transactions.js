import React from "react";
import "./transactions.css";
import { useNavigate } from "react-router-dom";
import { CSVLink } from "react-csv";
import { getTransactions, getWallet } from "../apiCalls";
function Transactions() {
  const navigate = useNavigate();
  const [walletData, setWalletData] = React.useState(null);
  const [txnsArray, setTxnsArray] = React.useState([]);
  const [sortBy, setSort] = React.useState("");
  const [pageNo, setPage] = React.useState(1);
  const [Err, setErr] = React.useState("");
  const csvRef = React.useRef();

  const [fullCSVData, setFullCSVData] = React.useState([{}]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    let walletID;
    if (typeof window !== "undefined") {
      walletID = localStorage.getItem("walletID");
    }
    if (walletID) {
      setLoading(true);
      getWallet(walletID).then((resp) => {
        if (resp[1]) {
          setLoading(false);

          return navigate("/");
        }

        setWalletData(resp[0].data);
        getTransactions({
          walletID: resp[0].data.walletID,
          sort: "",

          limit: 10,
        }).then((res) => {
          if (res[1]) {
            setLoading(false);

            return setErr("err");
          }
          setErr("");

          setTxnsArray(res[0].data);
          setLoading(false);
        });
      });
    } else {
      setErr("");
      setLoading(false);

      return navigate("/");
    }
  }, [navigate]);
  React.useEffect(() => {
    if (fullCSVData.length > 0) {
      setLoading(true);

      csvRef?.current?.link?.click();
      setFullCSVData([]);
      setLoading(false);
    }
  }, [fullCSVData]);
  const fetchTxns = (event, type) => {
    if (type === "sort") {
      setLoading(true);

      setSort(event?.target?.value || "");
      getTransactions({
        walletID: walletData.walletID,
        sort: event?.target?.value || "",
        skip: 10 * ((pageNo || 1) - 1),
        limit: 10,
      }).then((res) => {
        if (res[1]) {
          setLoading(false);

          return setErr("err");
        }
        setErr("");

        setTxnsArray(res[0].data);
        setLoading(false);
      });
    } else if (type === "page") {
      setLoading(true);

      setPage(event.target.value ? event.target.value : 1);

      getTransactions({
        walletID: walletData.walletID,
        sort: sortBy,
        skip: 10 * ((event?.target?.value || 1) - 1),
        limit: 10,
      }).then((res) => {
        if (res[1]) {
          setLoading(false);

          return setErr("err");
        }
        if (res[0]?.data?.length === 0 && txnsArray.length > 0) {
          setLoading(false);

          return;
        }
        setErr("");
        setTxnsArray(res[0].data);
        setLoading(false);
      });
    }
  };

  const exportCSV = () => {
    setLoading(true);
    getTransactions({
      walletID: walletData.walletID,
      sort: sortBy,
    }).then((res) => {
      if (res[1]) {
        setLoading(false);
        return setErr("err");
      }
      setErr("");
      const data = res[0].data?.transactions?.map((each) => {
        return { ...each, amount: Math.abs(each.amount) };
      });
      if (data.length > 0) {
        setFullCSVData(data);
        console.log(fullCSVData);
        setLoading(false);
      }
    });
  };
  if (!txnsArray || !walletData?.name || loading) {
    return (
      <div>
        <p>Loading ... </p>
      </div>
    );
  }
  if (Err) {
    return (
      <div>
        <p>Error occured </p>
      </div>
    );
  }
  return (
    <div>
      <h1>Transactions </h1>
      <p>Wallet Name: {walletData.name}</p>
      <p>Wallet Balance: {walletData.balance}</p>
      <div>
        <h3>Transactions </h3>
        <select
          name="sort"
          onChange={(event) => fetchTxns(event, "sort")}
          value={sortBy}
          id="type"
        >
          <option value="">Date</option>
          <option value="amount">Amount</option>
        </select>
        <select
          name="pageNo"
          onChange={(event) => fetchTxns(event, "page")}
          value={pageNo}
          id="type"
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
          <option value="11">11</option>
          <option value="12">12</option>
          <option value="13">13</option>
          <option value="14">14</option>
          <option value="15">15</option>
          <option value="16">16</option>
          <option value="17">17</option>
          <option value="18">18</option>
          <option value="19">19</option>
          <option value="20">20</option>
        </select>
        <button onClick={exportCSV} type="button">
          Export CSV
        </button>
        <CSVLink
          data={fullCSVData}
          className="hidden"
          filename={"transactions"}
          ref={csvRef}
          target="_blank"
        ></CSVLink>

        <div className="txContainer">
          {txnsArray && txnsArray.length > 0 ? (
            txnsArray?.transactions?.map((each, idx) => (
              <div className="eachTx" key={idx}>
                <div>Type: {each.type}</div>
                <div>Amt: {Math.abs(each.amount)}</div>
                <div>Bal: {each.balance}</div>
                {each.description ? (
                  <div>Description: {each.description}</div>
                ) : null}
              </div>
            ))
          ) : (
            <p> No txns for the wallet. </p>
          )}
        </div>
      </div>
    </div>
  );
}
export default Transactions;
