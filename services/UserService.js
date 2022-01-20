

class UserService{

    constructor(sqlRepo){
        this.sqlRepo = sqlRepo;
    }

    async getUser(userName){
        return this.sqlRepo.getUser(userName);
    }


    async addUser(user){
        return this.sqlRepo.addUser(user);
    }

    async getUsers(){
        return this.sqlRepo.getUsers();
    }

}

module.exports = UserService;