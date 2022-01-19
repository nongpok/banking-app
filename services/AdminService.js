
class AdminService{

    constructor(mongoDbRepo, mySqlRepo){
        this.mongoDbRepo = mongoDbRepo;
        this.mySqlRepo = mySqlRepo;
    }

    async getAllAdmin(){
        return this.mongoDbRepo.getAllAdmin();
    }

    async getAdmin(name){
        return this.mongoDbRepo.getAdmin(name);
    }

    async getUsers(){
        return this.mySqlRepo.getUsers();
    }

    async getAllUsersTransactions(){
        return this.mySqlRepo.getAllUsersTransactions();
    }
}

module.exports = AdminService;