

class UserService{

    constructor(sqlRepo){
        this.sqlRepo = sqlRepo;
    }

    async getUsers(){
        return this.sqlRepo.getUsers();
    }


    async getUser(userName){
        return this.sqlRepo.getUser(userName);
    }


    async addUser(user){
        return this.sqlRepo.addUser(user);
    }

}

module.exports = UserService;