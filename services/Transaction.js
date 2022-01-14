class Transaction {
  constructor(id, name, amount, type, date) {
    this.id = id;
    this.name = name;
    this.amount = amount;
    this.type = type;
    this.date = date;
  }
}

module.exports = Transaction;
