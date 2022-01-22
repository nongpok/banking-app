const AdminMongoDBRepo = require("./admin-mongodb-repo");
const AdminService = require("../services/AdminService");
const jwt = require("jsonwebtoken");
const AccountMysqlRepo = require("./account-mysql-repo");

module.exports = function (app) {
  const mongoDbRepo = new AdminMongoDBRepo();
  const mySqlRepo = new AccountMysqlRepo();
  const adminService = new AdminService(mongoDbRepo, mySqlRepo);

  app.post("/api/v1/account/admin/login", async (req, res) => {
    let name = req.body.name;
    let password = req.body.password;
    const admin = await adminService.getAdmin(name);

    if (password == admin.password) {
      const payload = { id: admin.id, name: admin.name, isAdmin: true };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m",
      });
      return res.json({ accessToken: accessToken, payload: payload });
    }
    res.status(500).send("Incorrect Password");
  });

  app.get(
    "/api/v1/account/admin/:name/all-admins",
    authenticateToken,
    async (req, res) => {
      let adminList = await adminService.getAllAdmin();
      res.json(adminList);
    }
  );

  app.get("/api/v1/account/admin/:name/all-users", async (req, res) => {
    let userList = await adminService.getUsers();
    res.json(userList);
  });

  app.get(
    "/api/v1/account/admin/:name/all-transactions",
    authenticateToken,
    async (req, res) => {
      let txnList = await adminService.getAllUsersTransactions();
      res.json(txnList);
    }
  );

  function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) return res.sendStatus(403);
      req.user = payload;

      if (payload.name != req.params.name) return res.sendStatus(401);
      next();
    });
  }
};
