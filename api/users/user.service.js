const e = require("express");
const pool = require("../../config/dbConnect");

module.exports = {
  createUser: (data, callback) => {
    pool.query(
      `insert into registration (fname,lname,gender,email,password,phone) values (?,?,?,?,?,?)`,
      [
        data.first_name,
        data.last_name,
        data.gender,
        data.email,
        data.password,
        data.phone,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getUsers: (callback) => {
    pool.query(
      `select id,fname,lname,gender,email,phone from registration`,
      [],
      (error, results, fields) => {
        if (error) {
          console.error("Error in getUsers service:", error);
          return callback(error);
        }
        console.log("Results from getUsers service:", results);
        return callback(null, results);
      }
    );
  },
  getUserById: (id, callback) => {
    pool.query(
      `select fname,lname,gender,email,phone from registration where id=?`,
      [id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results[0]);
      }
    );
  },
  updateUser: (data, callback) => {
    pool.query(
      `Update registration set fname=?,lname=?,gender=?,email=?,password=?,phone=? where id=?`,
      [
        data.first_name,
        data.last_name,
        data.gender,
        data.email,
        data.password,
        data.phone,
        data.id,
      ],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  deleteUser: (data, callback) => {
    pool.query(
      `delete from registration where id=?`,
      [data.id],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
  getUserByEmail: (email, callback) => {
    pool.query(
      `select id,fname,lname,gender,email,phone,password from registration where email =?`,
      [email],
      (error, results, fields) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      }
    );
  },
};
