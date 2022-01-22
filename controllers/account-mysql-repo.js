const mysql = require("mysql");
const User = require("../services/User");
const Transaction = require("../services/Transaction");
const uuid = require("uuid");
const moment = require("moment");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "account_db",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

class AccountMysqlRepo {
  addUser(user) {
    con.beginTransaction((err) => {
      if (err) throw err;
      const sql1 = `INSERT INTO USER (accno, firstName, lastName, balance, email, phone, date, password) VALUES ('${user.accno}','${user.firstName}','${user.lastName}','${user.balance}', '${user.email}','${user.phone}','${user.date}','${user.password}') `;
      con.query(sql1, (err, res) => {
        if (err) {
          return con.rollback(function () {
            throw err;
          });
        }
      });

      const txnId = uuid.v4();
      const dateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      const sql2 = `INSERT INTO transaction(id, accno, firstName, lastName, amount, type, date) VALUES ('${txnId}',
      '${user.accno}', '${user.firstName}', '${user.lastName}', '${user.balance}', 'deposit', '${dateTime}')`;

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
    let userList = new Array();
    return new Promise((resolve, reject) => {
      let slq = "SELECT * FROM USER";
      con.query(slq, (err, res) => {
        if (err) return reject(err);

        for (let u of res) {
          let user = new User(
            u.accno,
            u.firstName,
            u.lastName,
            u.balance,
            u.email,
            u.phone,
            u.date,
            u.password
          );
          userList.push(user);
        }
        resolve(userList);
      });
    });
  }

  updateUserDetails(user) {
    let sql1 = `UPDATE USER SET firstName='${user.firstName}',lastName ='${user.lastName}' ,email='${user.email}' ,phone='${user.phone}'  WHERE accno='${user.accno}'`;
    let sql2 = `UPDATE transaction SET firstName='${user.firstName}',lastName ='${user.lastName}' WHERE accno='${user.accno}'`;
    con.query(sql1, (err, res) => {
      if (err) throw err;
      console.log("succesfully updated");
    });
    con.query(sql2, (err, res) => {
      if (err) throw err;
      console.log("succesfully updated");
    });
  }

  getUser(accno) {
    return new Promise((resolve, reject) => {
      let slq = `SELECT * FROM USER WHERE accno = '${accno}' `;
      con.query(slq, (err, res) => {
        if (err) return reject(err);
        if (res.length != 0) {
          let data = res[0];
          let user = new User(
            data.accno,
            data.firstName,
            data.lastName,
            data.balance,
            data.email,
            data.phone,
            data.date,
            data.password
          );
          resolve(user);
        }
        resolve(res);
      });
    });
  }
  getUserByName(name) {
    return new Promise((resolve, reject) => {
      let slq = `SELECT * FROM USER WHERE firstName = '${name}' `;
      con.query(slq, (err, res) => {
        if (err) return reject(err);
        if (res.length != 0) {
          let data = res[0];
          let user = new User(
            data.accno,
            data.firstName,
            data.lastName,
            data.balance,
            data.email,
            data.phone,
            data.date,
            data.password
          );
          resolve(user);
        }
        resolve(res);
      });
    });
  }

  getAllUsersTransactions() {
    let txnList = new Array();
    return new Promise((resolve, reject) => {
      let sql = "SELECT * FROM TRANSACTION";
      con.query(sql, (err, res) => {
        if (err) return reject(err);

        for (let t of res) {
          let txn = new Transaction(
            t.id,
            t.accno,
            t.firstName,
            t.lastName,
            t.amount,
            t.type,
            t.date
          );
          txnList.push(txn);
        }
        resolve(txnList);
      });
    });
  }

  getTransactions(accno) {
    let txnList = new Array();
    return new Promise((resolve, reject) => {
      let sql = `select * from transaction  WHERE accno = '${accno}' `;
      con.query(sql, (err, res) => {
        if (err) return reject(err);
        for (let data of res) {
          let transaction = new Transaction(
            data.id,
            data.accno,
            data.firstName,
            data.lastName,
            data.amount,
            data.type,
            data.date
          );
          txnList.push(transaction);
        }

        resolve(txnList);
      });
    });
  }

  async deposit(accno, amount) {
    const user = await this.getUser(accno).then((r) => r);
    console.log(user);
    const txnId = uuid.v4();

    con.beginTransaction((err) => {
      if (err) throw err;
      const dateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      let sql1 = `INSERT INTO transaction(id, accno, firstName, lastName, amount, type, date) VALUES ('${txnId}',
      '${user.accno}', '${user.firstName}', '${user.lastName}', '${amount}', 'deposit', '${dateTime}')`;

      let sql2 = `UPDATE USER SET balance = balance + ${amount} WHERE accno ='${accno}'`;
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
      console.log("transaction successful");
    });
  }

  async withdraw(accno, amount) {
    const user = await this.getUser(accno).then((r) => r);
    console.log(user);
    const txnId = uuid.v4();

    con.beginTransaction((err) => {
      if (err) throw err;
      const dateTime = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      let sql1 = `INSERT INTO transaction(id, accno, firstName, lastName, amount, type, date) VALUES ('${txnId}',
      '${user.accno}', '${user.firstName}', '${user.lastName}', '${amount}', 'withdraw', '${dateTime}')`;

      let sql2 = `UPDATE USER SET balance = balance - ${amount} WHERE accno ='${accno}'`;
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
      console.log("transaction successful");
    });
  }
}

module.exports = AccountMysqlRepo;
