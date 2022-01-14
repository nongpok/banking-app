class TransactionService {
  constructor(repo) {
    this.repo = repo;
  }
  addUser(user) {
    this.repo.addUser(user);
  }
  addUserToBank(bank) {
    this.repo.addUserToBank(bank);
  }
  async getUser() {
    return this.repo.getUser();
  }
}
