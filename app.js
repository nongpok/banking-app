
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 8000;

const AccountController = require('./controllers/account-controller');
const TransactionController = require('./controllers/transaction-controller');
const AdminController = require('./controllers/admin-controller');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const adminController = require('./controllers/admin-controller');

// Swagger Configuration
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Banking App Api',
            version: '1.0.0'
        }
    },
    apis: ['./controllers/account-controller.js', './controllers/transaction-controller.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

app.use(express.urlencoded({ 'extended' : true}));
app.use(express.json());
app.use(cors());

new AdminController(app);
new AccountController(app, swaggerDocs);
new TransactionController(app, swaggerDocs);

app.listen(port, function(err){
    if(err){
        console.log(err);
        return;
    }
    console.log("Server is up and running on port : " + port);
});