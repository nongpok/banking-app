require("dotenv").config();
const nodemailer = require("nodemailer");

const User = require("../services/User");
const UserService = require("../services/UserService");
const AccountMysqlRepo = require("./account-mysql-repo");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const swaggerUI = require("swagger-ui-express");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ankitkmonocept@gmail.com",
    pass: "monocept13@1998",
  },
});

module.exports = function (app, swaggerDocs) {
  const sqlRepo = new AccountMysqlRepo();
  const userService = new UserService(sqlRepo);

  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

  app.get("/", (req, res) => {
    return res.send("<h1>Welcome to Banking App</h1>");
  });

  /**
   * @swagger
   *  tags:
   *       name: Account Controller
   *       description: The Account managing API
   */

  /**
   * @swagger
   * /api/v1/account/registration:
   *  post:
   *     summary: Create an account
   *     description: Create an account with name, password, balance
   *     tags: [Account Controller]
   *     requestBody:
   *          required: true
   *          content:
   *              application/x-www-form-urlencoded:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          name:
   *                            type: string
   *                          password:
   *                            type: string
   *                          balance:
   *                            type: integer
   *                      required:
   *                          -name
   *                          -password
   *                          -balance
   *
   *     responses:
   *       201:
   *         description: Success
   *
   */
  app.post("/api/v1/account/registration", async (req, res) => {
    const allUsers = await userService.getUsers();
    const accno = "ACC00" + (allUsers.length + 1);
    const date = moment(new Date()).format("YYYY-MM-DD");
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User(
      accno,
      req.body.firstName,
      req.body.lastName,
      Number(req.body.balance),
      req.body.email,
      req.body.phone,
      date,
      hashedPassword
    );
    await userService.addUser(user);
    let mailOption = {
      from: "ankitkmonocept@gmail.com",
      to: `${req.body.email}`,
      subject: "Successfully Registered",
      text: ` Account No :${accno}
              firstName: ${req.body.firstName}   
              lastName : ${req.body.lastName}
              balance  :${req.body.balance}
              password :${req.body.password}
      `,
    };

    transporter.sendMail(mailOption, (err, data) => {
      if (err) {
        console.log("error occur");
      } else {
        console.log("email send");
      }
    });
    res.json(user);
  });

  /**
   * @swagger
   * /api/v1/account/login:
   *  post:
   *     summary: Login to an account
   *     description: Login to an account with name and password
   *     tags: [Account Controller]
   *     requestBody:
   *          required: true
   *          content:
   *              application/x-www-form-urlencoded:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          name:
   *                            type: string
   *                          password:
   *                            type: string
   *                      required:
   *                          -name
   *                          -password
   *
   *     responses:
   *       201:
   *         description: Success
   *
   */
  app.post("/api/v1/account/login", async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;

    let user = await userService.getUserByName(name);

    if (user.length == 0) {
      res.status(500).send("Invalid user");
      return;
    }
    //authenticate user
    if (await bcrypt.compare(password, user.password)) {
      const payload = { id: user.accno, name: user.firstName, isAdmin: false };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "20m",
      });
      res.json({ accessToken: accessToken, payload: payload });
      return;
    }

    res.status(500).send("Incorrect Password");
  });

  app.post("/api/v1/account/update/:name", async (req, res) => {
    const date = moment(new Date()).format("YYYY-MM-DD");
    const user = new User(
      req.body.accno,
      req.body.firstName,
      req.body.lastName,
      Number(req.body.balance),
      req.body.email,
      req.body.phone,
      date,
      req.body.password
    );
    await userService.updateUserDetails(user);
    res.json(user);
  });

  app.get("/api/v1/account/user/:name", async (req, res) => {
    const user = await userService.getUser(req.params.name);
    res.json(user);
  });

  app.get("/api/v1/account/image", async (req, res) => {
    const src = await userService.getUserDocs("ACC001");
    res.send(`<img src=${src}>`);
  });

  app.post("/api/v1/account/user/:id/upload-docs", async (req, res) => {
    const data = await userService.uploadUsrDocs(req.params.id, req.body.path);
    res.json(data);
  });
};
//
