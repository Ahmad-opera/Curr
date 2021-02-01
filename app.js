const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ejs = require("ejs");
const cookieParser = require("cookie-parser");
const path = require("path");

// Set-up dotenv
dotenv.config();

// Middlewares
app.use(express.json({ extended: false }));
app.set("view engine", "ejs");
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));

//Import routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");

mongoose.connect(
  process.env.DB_URI,
  { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false },
  () => {
    console.log("DB Connnected");
  }
);

app.get("/", (req, res) => {
  res.render("index", { data: { name: "ahmad" } });
});

app.get("/login", (req, res) => {
  res.render("login", { data: { name: "ahmad" } });
});

app.get("/get-cookies", (req, res) => {
  res.json(req.cookies);
});

app.use("/api/user", authRoute);
app.use("/user", userRoute);
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log("Listening on port " + port + "...");
});
