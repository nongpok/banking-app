const mysql = require("mysql");
const User = require("../services/User");
const Transaction = require("../services/Transaction");
const uuid = require("uuid");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql512096",
  database: "account_db",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

class AccountMysqlRepo {
  addUser(user) {
    console.log(user);

    con.beginTransaction((err) => {
      if (err) throw err;
      const sql1 = `INSERT INTO USER(id,name,balance,password)VALUES('${user.id}','${user.name}','${user.balance}','${user.password}') `;
      con.query(sql1, (err, res) => {
        if (err) {
          return con.rollback(function () {
            throw err;
          });
        }
      });

      const txnId = uuid.v4();
      const sql2 = `INSERT INTO transaction(id, name, amount, type, date)VALUES('${txnId}','${
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

  getTransactions(name) {
    let txnList = new Array();
    return new Promise((resolve, reject) => {
      let slq = `select * from transaction  WHERE name = '${name}' `;
      con.query(slq, (err, res) => {
        if (err) return reject(err);
        for (let data of res) {
          let transaction = new Transaction(
            data.id,
            data.name,
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

  async deposit(name, amount) {
    const user = await this.getUser(name).then((r) => r);
    console.log(user);
    const txnId = uuid.v4();

    con.beginTransaction((err) => {
      if (err) throw err;
      let sql1 = `INSERT INTO transaction(id,name,amount,type,date)VALUES('${txnId}','${
        user.name
      }','${amount}','D','${new Date()}') `;

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
      console.log("transaction successful");
    });
  }

  async withdraw(name, amount) {
    const user = await this.getUser(name).then((r) => r);
    console.log(user);
    const txnId = uuid.v4();

    con.beginTransaction((err) => {
      if (err) throw err;
      let sql1 = `INSERT INTO Transaction(id, name, amount, type, date) VALUES ('${txnId}','${
        user.name
      }','${amount}','W','${new Date()}') `;

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
      console.log("transaction successful");
    });
  }
}

module.exports = AccountMysqlRepo;
