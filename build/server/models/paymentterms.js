// Generated by CoffeeScript 1.11.1
var PaymentTerms, cozydb;

cozydb = require('cozydb');

module.exports = PaymentTerms = cozydb.getModel('PaymentTerms', {
  vendor: String,
  clientId: String,
  encryptedBankDetails: String,
  balance: Number,
  paymentMeans: String,
  lastPayment: Object,
  billFrequency: String,
  nextBillDate: String,
  paymentSchedules: [Object],
  modifBankDetailsAllowed: Boolean,
  idPayer: String,
  payerDivergent: Boolean,
  docTypeVersion: String
});
