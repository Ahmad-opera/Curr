const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports.register = async (req, res) => {
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");
  const user = new User({
    username: req.body.username,
    Firstname: req.body.Firstname,
    Lastname: req.body.Lastname,
    email: req.body.email,
    country: req.body.country,
    account_type: "personal",
    password: req.body.password,
  });
  try {
    user.save();
    res.send(user);
  } catch (error) {
    res.send(error);
  }
};

module.exports.login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("User not found!");
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Email or password is wrong!");
  const token = await jwt.sign(
    { email: user.email, password: user.password },
    process.env.TOKEN_SECRET
  );
  return res
    .cookie("token", token, {
      maxAge: 10000 * 10 * 10 * 24,
      secure: false, // set to true if your using https
      httpOnly: true,
    })
    .send();
};
