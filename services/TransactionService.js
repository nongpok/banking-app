
class TransactionService {

  constructor(sqlRepo) {
    this.sqlRepo = sqlRepo;
  }

  performTransaction(transaction){
    if(transaction.type === 'deposit') {
      this.sqlRepo.deposit(transaction.name, transaction.amount);
      return;
    } 

    if(transaction.type === 'withdraw') {
      this.sqlRepo.withdraw(transaction.name, transaction.amount);
    }
  }

  async getTransactions(name){
    return this.sqlRepo.getTransactions(name);
  }
}

module.exports = TransactionService;
