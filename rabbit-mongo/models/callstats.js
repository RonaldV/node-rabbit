var db = require('../db');

var collectionType = 'callstats';

exports.all = function (cb) {
  var collection = db.get().collection(collectionType);

  collection.find().toArray(function (err, docs) {
    cb(err, docs);
  });
};

exports.recent = function (cb) {
  var collection = db.get().collection(collectionType);

  collection.find().sort({ 'date': -1 }).limit(100).toArray(function (err, docs) {
    cb(err, docs);
  });
};