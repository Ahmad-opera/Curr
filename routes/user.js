const express = require("express");
const router = express.Router();
const verify = require("./verifyToken");
const userController = require("../controller/user");
const axios = require("axios");

 router.get("/dashboard", verify, userController.invest_get);
 // router.get("/makeinvest", verify, userController.invest_post);
  router.get("/gettransaction", userController.gen_transaction);
router.get("/notify", userController.notify_invoice_success);

module.exports = router;
