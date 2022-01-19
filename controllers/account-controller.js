require('dotenv').config();

const User = require("../services/User");
const UserService = require("../services/UserService");
const AccountMysqlRepo = require("./account-mysql-repo");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const swaggerUI = require('swagger-ui-express');

module.exports = function (app, swaggerDocs) {
  const sqlRepo = new AccountMysqlRepo();
  const userService = new UserService(sqlRepo);

  app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(swaggerDocs));

  app.get("/", (req, res) => {
    return res.send("<h1>Welcome to Banking App</h1>");
  }) ;

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
  app.post('/api/v1/account/login', async (req, res)=>{
    const name = req.body.name;
    const password = req.body.password;

    let user = await userService.getUser(name);
    
    if(user.length == 0){
      res.status(500).send('Invalid user');
      return;
    }
    //authenticate user
    if(await bcrypt.compare(password, user.password)){
      const payload = {id: user.id, name: user.name};
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'});
      res.json({accessToken: accessToken});
      return;
    }

    res.status(500).send('Incorrect Password');
  });


  /** 
  * @swagger 
  * /api/v1/account/users/{username}: 
  *  get:
  *     summary: Get a user
  *     description: Get a user by username
  *     tags: [Account Controller]
  *     parameters:
  *           - in: path
  *             name: username
  *             schema:
  *               type: string
  *             required: true
  *                          
  *     responses:  
  *       201: 
  *         description: Success
  *   
  */
  app.get("/api/v1/account/users/:name", async (req, res) => {
    let user = await userService.getUser(req.params.name);
    res.json(user);
  });

};
