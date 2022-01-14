
const TransactionService = require('../services/TransactionService');
const Transaction = require('../services/Transaction');
const AccountMysqlRepo = require('./account-mysql-repo');
const uuid = require("uuid");



module.exports = function(app){

    const sqlRepo =  new AccountMysqlRepo();
    const transactionService = new TransactionService(sqlRepo);


    app.post('/api/v1/account/:name/transaction', async (req, res)=>{

        const id = uuid.v4();
        const name = req.params.name;
        const amount = Number(req.body.amount);
        const type = req.body.type;
        const date = new Date();
        let transaction = new Transaction(id, name, amount, type, date);

        transactionService.performTransaction(transaction);
        res.json(transaction);
    });

    app.get('/api/v1/account/:name/passbook', async (req, res)=>{
        let transactions = await transactionService.getTransactions(req.params.name);
        res.json(transactions);
    });
    
}