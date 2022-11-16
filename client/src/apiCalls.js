import Axios from "axios";

export const testPost = (data) =>
  Axios.post("/api", { body: { ...data } })
    .then((res) => [res.data, null])
    .catch((e) => [null, e]);

export const testGet = ({ param, queryParams }) =>
  Axios.get("/api/" + (param ? param : ""), { params: queryParams })
    .then((res) => [res.data, null])
    .catch((e) => [null, e]);

export const setupWallet = ({ name, balance }) =>
  Axios.post("/api/setup", { name, balance })
    .then((res) => [res.data, null])
    .catch((e) => [null, e]);

export const transactWallet = ({ walletID, description, amount }) =>
  Axios.post("/api/transact/" + walletID, { description, amount })
    .then((res) => [res.data, null])
    .catch((e) => [null, e]);

export const getWallet = (walletID) =>
  Axios.get("/api/wallet/" + walletID, {})
    .then((res) => [res.data, null])
    .catch((e) => [null, e]);

export const getTransactions = ({ skip, limit, sort, walletID }) =>
  Axios.get("/api/transactions/" + walletID, { params: { skip, limit, sort } })
    .then((res) => [res.data, null])
    .catch((e) => [null, e]);
