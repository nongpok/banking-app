class TransactionService {
  constructor(sqlRepo) {
    this.sqlRepo = sqlRepo;
  }

  performTransaction(transaction) {
    if (transaction.type === "deposit") {
      this.sqlRepo.deposit(transaction.accno, transaction.amount);
      return;
    }

    if (transaction.type === "withdraw") {
      this.sqlRepo.withdraw(transaction.accno, transaction.amount);
    }
  }

  async getTransactions(accno) {
    return this.sqlRepo.getTransactions(accno);
  }
}

module.exports = TransactionService;
