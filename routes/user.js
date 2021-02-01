const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/dashboard", verify, (req, res) => {
  res.render("dashboard", { data: { name: "ahmad" } });
});

router.get("/entries", verify, (req, res) => {
  res.send("Successfully Gone Through!");
});

module.exports = router;
