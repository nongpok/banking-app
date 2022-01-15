const User = require("../services/User");
const UserService = require("../services/UserService");
const AccountMysqlRepo = require("./account-mysql-repo");
const uuid = require("uuid");
const bcrypt = require("bcrypt");

module.exports = function (app) {
  const sqlRepo = new AccountMysqlRepo();
  const userService = new UserService(sqlRepo);

  app.get("/", (req, res) => {
    return res.send("<h1>Welcome to Banking App</h1>");
  });

  app.post("/api/v1/account/registration", async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User(
      uuid.v4(),
      req.body.name,
      Number(req.body.balance),
      hashedPassword
    );
    await userService.addUser(user);
    res.json(user);
  });

  app.post('/api/v1/account/login', async (req, res)=>{
    const name = req.body.name;
    const password = req.body.password;

    let user = await userService.getUser(name);

    if(await bcrypt.compare(password, user.password)){
      console.log("logged in successfully");
      res.json(user);
      return;
    }
    console.log("Incorrect password");
    res.status(500).send('Incorrect Password');

  });

  app.get("/api/v1/account/users", async (req, res) => {
    let users = await userService.getUsers();
    res.json(users);
  });

  app.get("/api/v1/account/users/:name", async (req, res) => {
    let user = await userService.getUser(req.params.name);
    res.json(user);
  });
};
