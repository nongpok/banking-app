const mysql = require("mysql");
const User = require("./User");
const Bank = require("./Bank");
const uuid = require("uuid");
const { get } = require("express/lib/response");

// const ContactService = require("./ContactServices");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "transection",
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

class AcountMysqlRepo {
  addUser(user) {
    console.log(user);

    con.beginTransaction((err) => {
      if (err) throw err;
      let userId = uuid.v4();
      const sql1 = `INSERT INTO USER(id,name,balance,password)VALUES('${userId}','${user.name}','${user.balance}','${user.password}') `;
      con.query(sql1, (err, res) => {
        if (err) {
          return con.rollback(function () {
            throw err;
          });
        }
      });
      const trnxId = uuid.v4();
      const sql2 = `INSERT INTO BankTransection(id,name,amount,type,date)VALUES('${trnxId}','${
        user.name
      }','${user.balance}','D','${new Date()}')`;
      con.query(sql2, (err, res) => {
        if (err) {
          return con.rollback(function () {
            throw err;
          });
        }
      });
      con.commit((err) => {
        if (err) {
          return con.rollback(function () {
            throw err;
          });
        }
      });
    });
  }

  getUsers() {
    console.log("get user called");
    let userList = new Array();
    return new Promise((resolve, reject) => {
      let slq = "select *from USER ";
      con.query(slq, (err, res) => {
        if (err) return reject(err);

        for (let u of res) {
          let user = new User(u.id, u.name, u.balance, u.password);

          userList.push(user);
        }
        resolve(userList);
      });
    });
  }

  getUser(name) {
    return new Promise((resolve, reject) => {
      let slq = `select * from USER WHERE name = '${name}' `;
      con.query(slq, (err, res) => {
        if (err) return reject(err);
        let data = res[0];
        let user = new User(data.id, data.name, data.balance, data.password);
        resolve(user);
      });
    });
  }
  async deposit(name, amount) {
    const user = await this.getUser(name).then((r) => r);
    console.log(user);
    const trnxId = uuid.v4();
    con.beginTransaction((err) => {
      if (err) throw err;
      let sql1 = `INSERT INTO BankTransection(id,name,amount,type,date)VALUES('${trnxId}','${
        user.name
      }','${user.balance + amount}','D','${new Date()}') `;

      let sql2 = `UPDATE USER SET balance = balance + ${amount} WHERE name ='${name}'`;
      con.query(sql1, (err, res) => {
        if (err) {
          return con.rollback(function () {
            throw err;
          });
        }
      });
      con.query(sql2, (err, res) => {
        if (err) {
          return con.rollback(function () {
            throw err;
          });
        }
      });
      con.commit((err) => {
        if (err) {
          return con.rollback(function () {
            throw err;
          });
        }
      });
      console.log("transection succesfull");
    });
  }
  async withdrwal(name, amount) {
    const user = await this.getUser(name).then((r) => r);
    console.log(user);
    const trnxId = uuid.v4();
    con.beginTransaction((err) => {
      if (err) throw err;
      let sql1 = `INSERT INTO BankTransection(id,name,amount,type,date)VALUES('${trnxId}','${
        user.name
      }','${user.balance - amount}','W','${new Date()}') `;

      let sql2 = `UPDATE USER SET balance = balance - ${amount} WHERE name ='${name}'`;
      con.query(sql1, (err, res) => {
        if (err) {
          return con.rollback(function () {
            throw err;
          });
        }
      });
      con.query(sql2, (err, res) => {
        if (err) {
          return con.rollback(function () {
            throw err;
          });
        }
      });
      con.commit((err) => {
        if (err) {
          return con.rollback(function () {
            throw err;
          });
        }
      });
      console.log("transection succesfull");
    });
  }
}
module.exports = AcountMysqlRepo;
