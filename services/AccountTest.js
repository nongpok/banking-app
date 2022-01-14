const AccountRepo = require("../account-mysql-repo");
const Bank = require("./Transaction");
const User = require("./User");
const repo = new AccountRepo();

// repo.addUser(new User(null, "ankit", "10000", 1234));
// repo.deposit("ankit", 500);
// repo.withdrwal("ankit", 500);

repo.getTransaction("ankit").then((res) => console.log(res));
// repo.getUser("ankit").then((res) => console.log(res));
