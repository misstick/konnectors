// Generated by CoffeeScript 1.11.1
var RescueTimeActivity, async, cozydb, localization, log, moment, querystring, request;

cozydb = require('cozydb');

querystring = require('querystring');

request = require('request-json');

moment = require('moment');

async = require('async');

localization = require('../lib/localization_manager');

log = require('printit')({
  date: true,
  prefix: 'rescuetime'
});

RescueTimeActivity = cozydb.getModel('RescueTimeActivity', {
  date: Date,
  duration: Number,
  description: String,
  category: String,
  productivity: Number,
  people: Number
});

RescueTimeActivity.all = function(callback) {
  return RescueTimeActivity.request('byDate', callback);
};

RescueTimeActivity.destroyAll = function(callback) {
  return RescueTimeActivity.requestDestroy('byDate', callback);
};

module.exports = {
  name: "Rescue Time",
  slug: "rescuetime",
  description: 'konnector description rescuetime',
  vendorLink: "https://www.rescuetime.com/",
  category: 'productivity',
  color: {
    hex: '#C23C2F',
    css: '#C23C2F'
  },
  fields: {
    apikey: "text"
  },
  models: {
    activities: RescueTimeActivity
  },
  init: function(callback) {
    var map;
    map = function(doc) {
      return emit(doc.date, doc);
    };
    return RescueTimeActivity.defineRequest('byDate', map, function(err) {
      return callback(err);
    });
  },
  fetch: function(requiredFields, callback) {
    var params;
    params = {
      limit: 1,
      descending: true
    };
    return RescueTimeActivity.request('byDate', params, (function(_this) {
      return function(err, activities) {
        if (err) {
          return callback(err);
        } else {
          return _this.loadActivities(activities, requiredFields, callback);
        }
      };
    })(this));
  },
  loadActivities: function(activities, requiredFields, callback) {
    var apikey, end, params, start;
    apikey = requiredFields.apikey;
    end = moment().add(1, 'days').format('YYYY-MM-DD');
    if (activities.length > 0) {
      start = moment(activities[0].date).format('YYYY-MM-DD');
      params = {
        key: new Date(moment().format('YYYY-MM-DD'))
      };
      return RescueTimeActivity.requestDestroy('byDate', params, (function(_this) {
        return function(err) {
          if (err) {
            return callback(err);
          } else {
            return _this.fetchData(apikey, start, end, callback);
          }
        };
      })(this));
    } else {
      start = moment().subtract(10, 'years').format('YYYY-MM-DD');
      return this.fetchData(apikey, start, end, callback);
    }
  },
  fetchData: function(apikey, start, end, callback) {
    var client, path;
    client = request.createClient('https://www.rescuetime.com/');
    path = 'anapi/data?';
    path += querystring.stringify({
      key: apikey,
      format: "json",
      perspective: 'interval',
      resolution_time: 'day',
      restrict_begin: start,
      restrict_end: end
    });
    return client.get(path, function(err, res, body) {
      if (err) {
        log.error(err);
        return callback('bad credentials');
      } else if (res.statusCode !== 200) {
        log.error(body);
        return callback('request error');
      } else if (body.error != null) {
        log.error(body.error);
        log.debug(body.messages);
        return callback('request error');
      } else if (body.rows == null) {
        log.error('Something went wrong while fetching rescue time data');
        return callback('request error');
      } else {
        return async.eachSeries(body.rows, function(row, cb) {
          var data;
          data = {
            date: row[0],
            duration: row[1],
            people: row[2],
            description: row[3],
            category: row[4],
            productivity: row[5]
          };
          return RescueTimeActivity.create(data, function(err) {
            log.debug('new activity imported');
            log.debug(JSON.stringify(data));
            return cb();
          });
        }, function(err) {
          var localizationKey, notifContent, options, ref;
          notifContent = null;
          if (((ref = body.rows) != null ? ref.length : void 0) > 0) {
            localizationKey = 'notification rescuetime';
            options = {
              smart_count: body.rows.length
            };
            notifContent = localization.t(localizationKey, options);
          }
          return callback(err, notifContent);
        });
      }
    });
  }
};
