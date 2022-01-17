
const TransactionService = require('../services/TransactionService');
const Transaction = require('../services/Transaction');
const AccountMysqlRepo = require('./account-mysql-repo');
const uuid = require("uuid");

const swaggerUI = require('swagger-ui-express');

module.exports = function(app, swaggerDocs){

    const sqlRepo =  new AccountMysqlRepo();
    const transactionService = new TransactionService(sqlRepo);

    app.use('/api-docs', swaggerUI.serve,swaggerUI.setup(swaggerDocs));

    /**
    * @swagger
    *  tags:
    *       name: Transaction Controller
    *       description: The transactions managing API
    */

    /** 
    * @swagger 
    * /api/v1/account/{username}/transaction: 
    *  post:
    *     summary: Perform a transaction 
    *     description: Perform a transaction with amount and transaction type as "deposit" or "withdraw"
    *     tags: [Transaction Controller]
    *     requestBody:
    *          required: true
    *          content: 
    *              application/x-www-form-urlencoded:
    *                  schema:
    *                      type: object
    *                      properties:
    *                          amount:
    *                            type: integer
    *                          transactionType:
    *                            type: string
    *                      required:
    *                          -amount
    *                          -transactionType
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
    app.post('/api/v1/account/:name/transaction', async (req, res)=>{

        const id = uuid.v4();
        const name = req.params.name;
        const amount = Number(req.body.amount);
        const type = req.body.transactionType;
        const date = new Date();
        let transaction = new Transaction(id, name, amount, type, date);

        transactionService.performTransaction(transaction);
        res.json(transaction);
    });


    /** 
    * @swagger 
    * /api/v1/account/{username}/passbook: 
    *  get:
    *     summary: Get all the transactions
    *     description: Get all the transactions for a particular user
    *     tags: [Transaction Controller]
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
    app.get('/api/v1/account/:name/passbook', async (req, res)=>{
        let transactions = await transactionService.getTransactions(req.params.name);
        res.json(transactions);
    });
    
}
