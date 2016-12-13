// Generated by CoffeeScript 1.10.0
var MaifUser, cozydb;

cozydb = require('cozydb');

module.exports = MaifUser = cozydb.getModel('MaifUser', {
  password: String,
  profile: Object,
  date: String
});

MaifUser.updateOrCreate = function(data, callback) {
  return MaifUser.first(function(err, maifUser) {
    if (maifUser) {
      return maifUser.updateAttributes(data, callback);
    } else {
      return MaifUser.create(data, callback);
    }
  });
};
