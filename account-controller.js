
const User = require('./services/User');
const UserService = require('./services/UserService');
const AccountMysqlRepo = require('./account-mysql-repo');

module.exports = function(app){

    const sqlRepo =  new AccountMysqlRepo();
    const userService = new UserService(sqlRepo);

    app.get('/', (req, res)=>{
        return res.send('<h1>Welcome to Banking App</h1>');
    });


    app.post('/api/v1/account/registration', async (req, res)=>{
        const user = new User(null, req.body.name, Number(req.body.balance), req.body.password);
        await userService.addUser(user);
        res.json(user);
    });

}