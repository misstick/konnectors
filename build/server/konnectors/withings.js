// Generated by CoffeeScript 1.10.0
var BloodPressure, HeartBeat, Sleep, Steps, Weight, accountUrl, activityUrl, aggregateUrl, async, authUrl, cozydb, crypto, fetchAndSaveSleepMeasures, hashMeasuresByDate, hexMd5, localization, log, measureUrl, moment, request, saveActivityMeasures, saveBodyMeasures, saveSleepMeasures;

cozydb = require('cozydb');

request = require('request');

moment = require('moment');

crypto = require('crypto');

async = require('async');

localization = require('../lib/localization_manager');

log = require('printit')({
  date: true,
  prefix: 'withings'
});

hexMd5 = function(name) {
  var error;
  if (name != null) {
    try {
      return crypto.createHash('md5').update(name).digest('hex');
    } catch (error) {
      return '';
    }
  } else {
    return '';
  }
};

authUrl = 'https://auth.withings.com/fr/';

accountUrl = 'https://healthmate.withings.com/index/service/account';

measureUrl = 'https://healthmate.withings.com/index/service/measure';

activityUrl = 'https://healthmate.withings.com/index/service/v2/activity';

aggregateUrl = 'https://healthmate.withings.com/index/service/v2/aggregate';

Weight = cozydb.getModel('Weight', {
  date: Date,
  weight: Number,
  leanWeight: Number,
  fatWeight: Number,
  user: String,
  vendor: {
    type: String,
    "default": 'Withings'
  }
});

HeartBeat = cozydb.getModel('HeartBeat', {
  date: Date,
  value: Number,
  user: String,
  vendor: {
    type: String,
    "default": 'Withings'
  }
});

BloodPressure = cozydb.getModel('BloodPressure', {
  date: Date,
  systolic: Number,
  diastolic: Number,
  user: String,
  vendor: {
    type: String,
    "default": 'Withings'
  }
});

Steps = require('../models/steps');

Sleep = require('../models/sleep');

Weight.all = function(callback) {
  return Weight.request('byDate', callback);
};

HeartBeat.all = function(callback) {
  return HeartBeat.request('byDate', callback);
};

BloodPressure.all = function(callback) {
  return BloodPressure.request('byDate', callback);
};

module.exports = {
  name: "Withings",
  slug: "withings",
  description: 'konnector description withings',
  vendorLink: "www.withings.com/",
  category: 'health',
  color: {
    hex: '#0D9EE3',
    css: '#0D9EE3'
  },
  fields: {
    email: "text",
    password: "password"
  },
  models: {
    scalemeasure: Weight,
    heartbeat: HeartBeat,
    bloodpressure: BloodPressure,
    steps: Steps,
    sleep: Sleep
  },
  init: function(callback) {
    var map;
    map = function(doc) {
      return emit(doc.date, doc);
    };
    return async.series([
      function(done) {
        return Weight.defineRequest('byDate', map, done);
      }, function(done) {
        return HeartBeat.defineRequest('byDate', map, done);
      }, function(done) {
        return BloodPressure.defineRequest('byDate', map, done);
      }
    ], callback);
  },
  fetch: function(requiredFields, callback) {
    var email, end, params, password, start;
    params = {
      limit: 1,
      descending: true
    };
    log.info('import started');
    email = requiredFields.email;
    password = requiredFields.password;
    end = Math.ceil((new Date).getTime() / 1000);
    start = moment();
    start = start.year(2008);
    start = start.month(0);
    start = start.date(1);
    start = Math.ceil(start.valueOf() / 1000);
    return this.fetchData(email, password, start, end, function(err) {
      log.info('import finished');
      return callback(err);
    });
  },
  fetchData: function(email, password, start, end, callback) {
    var data, onceUrl;
    data = {
      action: 'get',
      appliver: 2014011713,
      appname: 'wiscale',
      apppfm: 'web',
      sessionid: null
    };
    onceUrl = 'https://auth.withings.com/index/service/once/';
    return request.post(onceUrl, {
      form: data
    }, function(err, res, body) {
      var once;
      if (err) {
        return callback(err);
      }
      body = JSON.parse(body);
      once = body.body.once;
      data = {
        email: email,
        password: password,
        passClear: password,
        hash: hexMd5(email + ":" + hexMd5(password) + ":" + once),
        once: once
      };
      return request.post(authUrl, {
        form: data
      }, function(err, res, body) {
        var options, sessionid;
        if (err) {
          return callback(err);
        }
        if (res.headers['set-cookie'] == null) {
          log.error('Authentification error');
          return callback('bad credentials');
        }
        sessionid = res.headers['set-cookie'][1].split(';')[0].split('=')[1];
        options = {
          strictSSL: false,
          form: {
            action: 'getuserslist',
            appliver: '20140428120105',
            appname: 'my2',
            apppfm: 'web',
            listmask: '5',
            recurse_devtype: '1',
            recurse_use: '1',
            sessionid: sessionid
          }
        };
        return request.post(accountUrl, options, function(err, res, body) {
          var user, userid, username;
          if (err) {
            return callback(err);
          }
          body = JSON.parse(body);
          user = body.body.users[0];
          userid = user.id;
          username = user.firstname + " " + user.lastname;
          options = {
            strictSSL: false,
            form: {
              action: 'getmeas',
              appliver: '20140428120105',
              appname: 'my2',
              apppfm: 'web',
              category: 1,
              limit: 2000,
              offset: 0,
              meastype: '12,35',
              sessionid: sessionid,
              startdate: 0,
              enddate: end,
              userid: userid
            }
          };
          return request.post(measureUrl, options, function(err, res, body) {
            var measures;
            if (err) {
              return callback(err);
            }
            measures = JSON.parse(body);
            if (measures.body == null) {
              log.error("Measures have no body");
              return callback();
            }
            return saveBodyMeasures(measures.body.measuregrps, function(err) {
              var onMeasures, startDate;
              if (err) {
                return callback(err);
              }
              startDate = moment().year(2014).month(0).date(1).format('YYYY-MM-DD');
              options = {
                strictSSL: false,
                form: {
                  sessionid: sessionid,
                  userid: userid,
                  range: '1',
                  meastype: '36,40',
                  appname: 'my2',
                  appliver: '20140428120105',
                  apppfm: 'web',
                  action: 'getbyuserid',
                  startdateymd: startDate,
                  enddateymd: moment().format('YYYY-MM-DD')
                }
              };
              onMeasures = function(err, res, body) {
                if (err) {
                  return callback(err);
                }
                measures = JSON.parse(body);
                return saveActivityMeasures(measures, function() {
                  options = {
                    sessionid: sessionid,
                    userid: userid
                  };
                  return fetchAndSaveSleepMeasures(options, callback);
                });
              };
              return request.post(aggregateUrl, options, onMeasures);
            });
          });
        });
      });
    });
  }
};

fetchAndSaveSleepMeasures = function(options, callback) {
  var opts;
  opts = {
    strictSSL: false,
    form: {
      sessionid: options.sessionid,
      userid: options.userid,
      subcategory: 37,
      startdateymd: '2013-12-24',
      enddateymd: moment().format('YYYY-MM-DD'),
      appname: 'my2',
      appliver: '36871d49',
      apppfm: 'web',
      action: 'getbyuserid'
    }
  };
  log.info('Fetching sleep data...');
  return request.post(activityUrl, opts, function(err, res, body) {
    var measures;
    if (err) {
      return callback(err);
    }
    log.info('Fetching sleep data done.');
    measures = JSON.parse(body);
    return saveSleepMeasures(measures.body.series, callback);
  });
};

saveSleepMeasures = function(measures, callback) {
  var i, len, measure, sleepsMeasures;
  sleepsMeasures = [];
  for (i = 0, len = measures.length; i < len; i++) {
    measure = measures[i];
    sleepsMeasures.push(new Sleep({
      vendor: 'Withings',
      date: moment(measure.date, 'YYYY-MM-DD'),
      awakeDuration: measure.data.wakeupduration,
      lightSleepDuration: measure.data.lightsleepduration,
      deepSleepDuration: measure.data.deepsleepduration,
      awakeTime: measure.data.wakeupcount,
      sleepDuration: measure.data.lightsleepduration + measure.data.deepsleepduration
    }));
  }
  log.info(measures.length + " found");
  return Sleep.all(function(err, sleeps) {
    var SleepsToSave, date, j, len1, sleep, sleepMap;
    if (err) {
      return callback(err);
    }
    sleepMap = {};
    for (j = 0, len1 = sleeps.length; j < len1; j++) {
      sleep = sleeps[j];
      date = moment(sleep.date).format('YYYY-MM-DD');
      sleepMap[date] = true;
    }
    SleepsToSave = sleepsMeasures.filter(function(measure) {
      date = moment(measure.date).format('YYYY-MM-DD');
      return sleepMap[date] == null;
    });
    log.info("Saving sleeps...");
    return async.eachSeries(sleepsToSave, function(sleep, next) {
      return Sleep.create(sleep, next);
    }, function(err) {
      log.info(sleepsToSave.length + " new sleep measures saved.");
      return callback();
    });
  });
};

hashMeasuresByDate = function(measures) {
  var date, hash, i, len, measure;
  hash = {};
  for (i = 0, len = measures.length; i < len; i++) {
    measure = measures[i];
    date = moment(measure.date);
    hash[date] = true;
  }
  return hash;
};

saveBodyMeasures = function(measures, callback) {
  var processData;
  processData = function(scaleMeasures, heartBeats, bloodPressures) {
    var bloodPressure, bloodPressureHash, bloodPressuresToSave, date, heartBeat, heartBeatHash, heartBeatsToSave, i, j, len, len1, measure, measuregrp, measuresToSave, ref, saveAll, scaleMeasure, scaleMeasureHash;
    scaleMeasureHash = hashMeasuresByDate(scaleMeasures);
    heartBeatHash = hashMeasuresByDate(heartBeats);
    bloodPressureHash = hashMeasuresByDate(bloodPressures);
    log.debug('analyse new measures');
    measuresToSave = [];
    heartBeatsToSave = [];
    bloodPressuresToSave = [];
    for (i = 0, len = measures.length; i < len; i++) {
      measuregrp = measures[i];
      date = moment(measuregrp.date * 1000);
      scaleMeasure = new Weight;
      scaleMeasure.date = date;
      heartBeat = new HeartBeat;
      heartBeat.date = date;
      bloodPressure = new BloodPressure;
      bloodPressure.date = date;
      ref = measuregrp.measures;
      for (j = 0, len1 = ref.length; j < len1; j++) {
        measure = ref[j];
        switch (measure.type) {
          case 1:
            scaleMeasure.weight = measure.value;
            break;
          case 5:
            scaleMeasure.leanWeight = measure.value;
            break;
          case 8:
            scaleMeasure.fatWeight = measure.value;
            break;
          case 9:
            bloodPressure.diastolic = measure.value;
            break;
          case 10:
            bloodPressure.systolic = measure.value;
            break;
          case 11:
            heartBeat.value = measure.value;
        }
      }
      if ((scaleMeasure.weight != null) && (scaleMeasureHash[date] == null)) {
        measuresToSave.push(scaleMeasure);
      }
      if ((heartBeat.value != null) && (heartBeatHash[date] == null)) {
        heartBeatsToSave.push(heartBeat);
      }
      if ((bloodPressure.systolic != null) && (bloodPressureHash[date] == null)) {
        bloodPressuresToSave.push(bloodPressure);
      }
    }
    log.info(measuresToSave.length + " weight measures to save");
    log.info(heartBeatsToSave.length + " heartbeat measures to save");
    log.info(bloodPressuresToSave.length + " blood pressure measures to save");
    saveAll = function(modelClass, models, done) {
      return async.eachSeries(models, function(model, callback) {
        return modelClass.create(model, callback);
      }, function(err) {
        return done(err);
      });
    };
    log.info('Save weights...');
    return saveAll(Weight, measuresToSave, function(err) {
      log.info('Weights saved...');
      if (err) {
        return callback(err);
      }
      log.info('Save heartbeats...');
      return saveAll(HeartBeat, heartBeatsToSave, function(err) {
        log.info('Heartbeats saved...');
        if (err) {
          return callback(err);
        }
        log.info('Save blood pressures...');
        return saveAll(BloodPressure, bloodPressuresToSave, function(err) {
          var localizationKey, notifContent, options;
          log.info('Blood pressures saved...');
          if (err) {
            return callback(err);
          }
          notifContent = null;
          if (measuresToSave.length > 0) {
            localizationKey = 'notification measures';
            options = {
              smart_count: measuresToSave.length
            };
            notifContent = localization.t(localizationKey, options);
          }
          return callback(null, notifContent);
        });
      });
    });
  };
  log.debug('fetch old measures');
  return Weight.all(function(err, scaleMeasures) {
    if (err) {
      return callback(err);
    }
    return HeartBeat.all(function(err, heartBeats) {
      if (err) {
        return callback(err);
      }
      return BloodPressure.all(function(err, bloodPressures) {
        if (err) {
          return callback(err);
        }
        return processData(scaleMeasures, heartBeats, bloodPressures);
      });
    });
  });
};

saveActivityMeasures = function(measures, callback) {
  var processData;
  log.info('Processing activity measures...');
  processData = function(stepsMeasures) {
    var date, dateAsMom, newDistances, newSteps, ref, ref1, ref2, ref3, saveInstance, stepMeasure, steps, stepsHash, stepsToSave, valueObj;
    stepsHash = hashMeasuresByDate(stepsMeasures);
    newSteps = (ref = measures.body) != null ? (ref1 = ref.series) != null ? ref1.type_36 : void 0 : void 0;
    newDistances = (ref2 = measures.body) != null ? (ref3 = ref2.series) != null ? ref3.type_40 : void 0 : void 0;
    if ((newSteps == null) && (newDistances == null)) {
      return callback();
    } else {
      stepsToSave = [];
      for (date in newSteps) {
        valueObj = newSteps[date];
        dateAsMom = moment(date);
        steps = valueObj.sum;
        if (stepsHash[dateAsMom] == null) {
          stepMeasure = new Steps;
          stepMeasure.date = dateAsMom;
          stepMeasure.steps = steps;
          stepMeasure.vendor = 'Withings';
          if (newDistances[date] != null) {
            stepMeasure.distance = newDistances[date].sum;
          }
          stepsToSave.push(stepMeasure);
        }
      }
      log.info("Found " + stepsToSave.length + " new steps measures to save!");
      saveInstance = function(model, cb) {
        return Steps.create(model, cb);
      };
      return async.forEach(stepsToSave, saveInstance, function(err) {
        var localizationKey, notifContent, options;
        if (err != null) {
          return callback(err);
        }
        log.info('Steps measures saved.');
        notifContent = null;
        if (stepsToSave.length) {
          localizationKey = 'notification withings';
          options = {
            smart_count: stepsToSave.length
          };
          notifContent = localization.t(localizationKey, options);
        }
        return callback(null, notifContent);
      });
    }
  };
  log.debug('Fetching former activity measures...');
  return Steps.all(function(err, stepsMeasures) {
    if (err) {
      return callback(err);
    }
    return processData(stepsMeasures);
  });
};

fetchAndSaveSleepMeasures = function(options, callback) {
  var opts;
  opts = {
    strictSSL: false,
    form: {
      sessionid: options.sessionid,
      userid: options.userid,
      subcategory: 37,
      startdateymd: '2013-12-24',
      enddateymd: moment().format('YYYY-MM-DD'),
      appname: 'my2',
      appliver: '36871d49',
      apppfm: 'web',
      action: 'getbyuserid'
    }
  };
  log.info('Fetching sleep data...');
  return request.post(activityUrl, opts, function(err, res, body) {
    var measures;
    if (err) {
      return callback(err);
    }
    log.info('Fetching sleep data done.');
    measures = JSON.parse(body);
    return saveSleepMeasures(measures.body.series, callback);
  });
};

saveSleepMeasures = function(measures, callback) {
  var i, len, measure, sleepsMeasures;
  sleepsMeasures = [];
  for (i = 0, len = measures.length; i < len; i++) {
    measure = measures[i];
    sleepsMeasures.push(new Sleep({
      vendor: 'Withings',
      date: moment(measure.date, 'YYYY-MM-DD'),
      awakeDuration: measure.data.wakeupduration,
      lightSleepDuration: measure.data.lightsleepduration,
      deepSleepDuration: measure.data.deepsleepduration,
      awakeTime: measure.data.wakeupcount,
      sleepDuration: measure.data.lightsleepduration + measure.data.deepsleepduration
    }));
  }
  log.info(measures.length + " found");
  return Sleep.all(function(err, sleeps) {
    var date, j, len1, sleep, sleepMap, sleepsToSave;
    if (err) {
      return callback(err);
    }
    sleepMap = {};
    for (j = 0, len1 = sleeps.length; j < len1; j++) {
      sleep = sleeps[j];
      date = moment(sleep.date).format('YYYY-MM-DD');
      sleepMap[date] = true;
    }
    sleepsToSave = sleepsMeasures.filter(function(measure) {
      date = moment(measure.date).format('YYYY-MM-DD');
      return sleepMap[date] == null;
    });
    log.info("Saving sleeps...");
    return async.eachSeries(sleepsToSave, function(sleep, next) {
      return Sleep.create(sleep, next);
    }, function(err) {
      log.info(sleepsToSave.length + " new sleep measures saved.");
      return callback();
    });
  });
};
