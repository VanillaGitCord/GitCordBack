const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const userRouter = require("./routes/userRouter");
const roomRouter = require("./routes/roomRouter");
const documentRouter = require("./routes/documentRouter");

const app = express();

require("dotenv").config();
require("./database");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({
  origin: process.env.FRONT_URL,
  credentials: true
}));

require("./socket")(app);

app.use("/user", userRouter);
app.use("/room", roomRouter);
app.use("/document", documentRouter);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json("error");
});

module.exports = app;
