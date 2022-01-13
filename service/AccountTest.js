const AccountRepo = require("./AcountMysqlRepo");
const Bank = require("./Bank");
const User = require("./User");
const repo = new AccountRepo();

// repo.addUser(new User(null, "ankit", "10000", 1234));
repo.deposit("ankit", 500);
// repo.getUser("ankit").then((res) => console.log(res));
