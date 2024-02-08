const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserByEmail,
} = require("./user.service");

require("dotenv").config();

const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { NULL } = require("mysql/lib/protocol/constants/types");

module.exports = {
  createUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    createUser(body, (err, results) => {
      if (err) {
        console.log(err);
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(500).json({
            success: 0,
            message: "User already exists with email id !",
          });
        }
        return res.status(500).json({
          success: 0,
          message: "Database connection error",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getUsers: (req, res) => {
    // console.log("inside controller");
    getUsers((err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results || results.length === 0) {
        return res.status(404).json({
          success: 0,
          message: "Records not found",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  getUserById: (req, res) => {
    const id = req.params.id;
    getUserById(id, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }
      if (!results) {
        return res.status(404).json({
          success: 0,
          message: "Record not found",
        });
      }
      return res.status(200).json({
        success: 1,
        data: results,
      });
    });
  },
  updateUser: (req, res) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);
    updateUser(body, (err, results) => {
      //   if (err) {
      //     console.log(err);
      //     return;
      //   }
      //   console.log(results);
      if (!results) {
        return res.json({
          success: 0,
          message: "Failed to update user !",
        });
      }
      if (results && results.affectedRows > 0) {
        return res.json({
          success: 1,
          message: "User updated successfully",
        });
      } else if (results && results.message.includes("Rows matched: 0")) {
        return res.json({
          success: 0,
          message: "User not found",
        });
      } else if (results && results.changedRows === 0) {
        return res.json({
          success: 0,
          message: "User data is already up to date",
        });
      }
    });
  },
  deleteUser: (req, res) => {
    const data = req.body;
    deleteUser(data, (err, results) => {
      if (err) {
        console.log(err);
        return;
      }

      if (results && results.affectedRows > 0) {
        return res.json({
          success: 1,
          message: "User deleted successfully",
        });
      }
      return res.json({
        success: 0,
        message: "Record not found",
      });
    });
  },
  login: (req, res) => {
    const data = req.body;

    getUserByEmail(data.email, (err, results) => {
      if (!results || results === undefined || results.length === 0) {
        return res.json({
          success: 0,
          message: "Invalid email or password !",
        });
      }

      const result = compareSync(data.password, results[0].password);
      if (result) {
        results.password = undefined;
        const jwtoken = sign({ result: results[0] }, process.env.JWT_KEY, {
          expiresIn: "1h",
        });

        return res.json({
          success: 1,
          message: "Logged in ",
          token: jwtoken,
        });
      }
      return res.json({
        success: 0,
        message: "Invalid email or password !",
      });
    });
  },
};
