const router = require("express").Router();
const verify = require("./verifyToken");
const userController = require("../controller/user");
const axios = require("axios");

router.get("/dashboard", verify, userController.invest_get);
router.get("/makeinvest", userController.invest_post);
router.get("/gettransaction", userController.gen_transaction);

module.exports = router;
