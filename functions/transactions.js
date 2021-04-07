module.exports = {

  getTotalAmountPlannedOut : function (transactions) {
    var totalPlannedAmount = 0;
    for(transaction of transactions) {
      if((transaction.getLastStage().status == 'planned')&&(transaction.type == "expense")) {
        totalPlannedAmount += transaction.amount ;
      }
    }
    return totalPlannedAmount;
  },

  getTotalAmountPaidOut : function (transactions) {
    var totalPaidAmount = 0;
    for(transaction of transactions) {
      if((transaction.getLastStage().status == 'paid')&&(transaction.type == "expense")) {
        totalPaidAmount += transaction.amount;
      }
    }
    return totalPaidAmount;
  },

  getTotalAmountTransferredOut : function (transactions) {
    var totalTransferredAmount = 0;
    for(transaction of transactions) {
      if((transaction.getLastStage().status == "transferred")&&(transaction.type == "expense")) {
        totalTransferredAmount += transaction.amount;
      }
    }
    return totalTransferredAmount;
  },

  getTotalAmountUntilPaidOut : function (transactions) {
    return this.getTotalAmountPlannedOut(transactions)+this.getTotalAmountPaidOut(transactions);
  },

  getTotalAmountUntilTransferredOut : function (transactions) {
    return this.getTotalAmountUntilPaidOut(transactions)+this.getTotalAmountTransferredOut(transactions);
  }

};