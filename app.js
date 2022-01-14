
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

const AccountController = require('./controllers/account-controller');
const TransactionController = require('./controllers/transaction-controller');

app.use(express.urlencoded({ 'extended' : true}));
app.use(express.json());
app.use(cors());


new AccountController(app);
new TransactionController(app);

app.listen(port, function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log("Server is up and running on port : " + port);
});