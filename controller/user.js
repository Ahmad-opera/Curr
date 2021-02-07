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
  const userInvestments = await Investment.find({ userID: decodedJWT.email });
  console.log(userInvestments);
  try {
    const userDetails = await User.findOne({ email: decodedJWT.email });
    if (userDetails) {
      res.render("dashboard", {
        data: userDetails,
        investments: userInvestments,
      });
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
        description: `Deposit`,
        suceess_url: "https://bankereum.herokuapp.com/user/notify",
      })
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        return err;
      });
    const newTransaction = new Investment({
      userID: decodedJWT.email,
      invoice: serverRes.data,
    });
    newTransaction.save();
    res.send(newTransaction);
  } catch (error) {
    res.status(500).send(error);
  }
};

const JSONStream = require("JSONStream");

module.exports.notify_invoice_success = async (req, res) => {
  const noticeBody = await req.body;
  const getInvestment = await Investment.findOneAndUpdate(
    {
      "invoice.url": noticeBody.url,
    },
    {
      invoice: noticeBody,
    }
  );
  res.send(getInvestment);
  // try {
  //   console.log(`${noticeBody}`);
  //   const saveNotice = new Notice({
  //     invoice: noticeBody,
  //   });
  //   saveNotice.save();
  //   res.send(saveNotice);
  // } catch (error) {
  //   console.log(error);
  // }
};

module.exports.send_req = async (req, res) => {
  const serverRes = await axios
    .post(`http://localhost:3000/user/notify`, {
      id: "5b7650458ebb8306365624a2",
      invoice_id: "BTC10339",
      merchant_id: "6017296e0fc83659122ebdd4",
      url: "https://coinremitter.com/invoice/601f405de1338338f866b7ed",
      total_amount: {
        BTC: "0.00020390",
        USD: "2.21979838",
        EUR: "2",
      },
      paid_amount: {
        BTC: "0.00025038",
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
      description: "Deposit",
      wallet_name: "my-wallet",
      address: "3QJ5iMzKquZSzdecAaCytTNKW9TY2y1mTV",
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
      invoice_date: "2021-02-06 22:06:26",
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
