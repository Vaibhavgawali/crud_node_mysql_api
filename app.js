require("dotenv").config();
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

const userRouter = require("./api/users/user.router");

app.use(express.json());
app.use("/api/users", userRouter);

const PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
