class UserService {
  constructor(sqlRepo) {
    this.sqlRepo = sqlRepo;
  }

  async getUser(accno) {
    return this.sqlRepo.getUser(accno);
  }
  async getUserByName(name) {
    return this.sqlRepo.getUserByName(name);
  }

  async updateUserDetails(user) {
    return this.sqlRepo.updateUserDetails(user);
  }

  async addUser(user) {
    return this.sqlRepo.addUser(user);
  }

  async getUsers() {
    return this.sqlRepo.getUsers();
  }
}

module.exports = UserService;
