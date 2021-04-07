const TYPES = {
  OUT : "expense",
  IN : "income"
}

class Transaction {

  constructor(type, category, description, amount) {
    this.type = type;
    this.category = category;
    this.description = description;
    this.amount = amount;
    this.stages = [];
  }

  getLastStage() {
    return this.stages[this.stages.length-1];
  }

  get() {
    return {
      'type' : this.type,
      'category' : this.category,
      'description' : this.description,
      'amount' : this.amount,
      'last-stage' : this.getLastStage()
    }
  }

}

const STATUS = {
  PLANNED : "planned",
  PAID : "paid",
  TRANSFERRED : "transferred",
  CANCELED : "canceled",
  ADVANCED : "advanced",
  REFUNDED : "refunded"
}

class Stage {
  constructor(date, status) {
    this.date = date;
    this.status = status;
  }
}

exports.TYPES = TYPES;
exports.Transaction = Transaction;
exports.STATUS = STATUS;
exports.Stage = Stage;