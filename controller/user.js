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

module.exports.notify_invoice_success = async (req, res) => {
  const serverRes = await req.body;
  console.log(serverRes);
  const saveNotice = new Notice({
    invoice: { serverRes },
  });
  saveNotice.save();
  res.send("Success");
};
