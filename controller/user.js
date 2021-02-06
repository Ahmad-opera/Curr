const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const dotenv = require("dotenv");
const Investment = require("../model/investment");
const Notice = require("../model/notice");

dotenv.config();

module.exports.invest_get = async (req, res) => {
  if (!req.cookies.token) res.status(403).send("Access Denied!");
  const decodedJWT = await jwt.decode(req.cookies.token);
  try {
    const userDetails = await User.findOne({ email: decodedJWT.email });
    if (userDetails) {
      res.render("dashboard", { data: userDetails.name });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports.gen_transaction = async (req, res) => {
  if (!req.cookies.token) res.status(403).send("Access Denied!");
  const decodedJWT = await jwt.decode(req.cookies.token);
  try {
    const serverRes = await axios
      .post(`https://coinremitter.com/api/v3/BTC/create-invoice`, {
        api_key: process.env.API_KEY,
        password: process.env.PASSWORD,
        amount: 10,
        name: "Something",
        currency: "USD",
        expire_time: 10,
        description: "Hello there",
        suceess_url: "https://bankereum.herokuapp.com/user/notify",
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        return err;
      });
    const newTransaction = new Investment({
      userEmail: decodedJWT.email,
      invoice: {
        id: serverRes.data.id,
        invoice_id: serverRes.data.invoice_id,
        url: serverRes.data.url,
        status: serverRes.data.status,
        total_amount: serverRes.data.total_amount,
      },
    });
    newTransaction.save();
    res.send(newTransaction);
  } catch (error) {
    res.status(500).send(error);
  }
};

const JSONStream = require("JSONStream");

module.exports.notify_invoice_success = async (req, res) => {
  const serverRes = await req.body;
  res.send(serverRes);
  try {
    console.log(`${serverRes}`);
    const saveNotice = new Notice({
      invoice: serverRes,
    });
    saveNotice.save();
    res.send(saveNotice);
  } catch (error) {
    console.log(error);
  }
};

module.exports.send_req = async (req, res) => {
  const serverRes = await axios
    .post(`http://localhost:3000/user/notify`, {
      id: "5b7650458ebb8306365624a2",
      invoice_id: "BTC002",
      merchant_id: "5bc46fb28ebb8363d2657347",
      url: "https://coinremitter.com/invoice/b7650458ebb8306365624a2",
      total_amount: {
        BTC: "0.00020390",
        USD: "2.21979838",
        EUR: "2",
      },
      paid_amount: {
        BTC: "0.00020390",
        USD: "2.21979838",
        EUR: "2",
      },
      usd_amount: "2.21979838",
      conversion_rate: {
        USD_BTC: "0.00009186",
        BTC_USD: "10886.83",
      },
      base_currency: "EUR",
      coin: "BTC",
      name: "random name",
      description: "Hello world",
      wallet_name: "my-wallet",
      address: "rger54654gsd4h6u7dgsg",
      payment_history: [
        {
          txid: "20879ba9a186030a12d7999ec3aa8d53270cfbf535d124b810bc252712448",
          explorer_url:
            "http://coin-explorer-url/c4b853d4be7586798870a4aa766e3bb78ddb...",
          amount: 2,
          date: "2019-12-02 12:09:02",
          confirmation: 1,
         },
      ],
      status: "Paid",
      status_code: 1,
      notify_url: "http://yourdomain.com/notify-url",
      suceess_url: "http://yourdomain.com/success-url",
      fail_url: "http://yourdomain.com/fail-url",
      expire_on: "2018-12-06 10:35:57",
      invoice_date: "2018-08-17 10:04:13",
      last_updated_date: "2018-08-17 10:04:13",
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      return err;
    });
  res.send(serverRes);
};
