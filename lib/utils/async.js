  var _ = require("underscore");

  _.async = _.async || {};

  function only_once(fn) {
    var called = false;
    return function () {
      if (called) {
        throw new Error("Callback was already called.");
      }
      called = true;
      fn.apply(root, arguments);
    };
  }

  _.async.each = function (arr, iterator, callback) {
    callback = callback || function () {};
    if (!arr.length) {
      return callback();
    }
    var completed = 0;
    _.each(arr, function (x) {
      iterator(x, only_once(function (err) {
        if (err) {
          callback(err);
          callback = function () {};
        } else {
          completed += 1;
          if (completed >= arr.length) {
            callback(null);
          }
        }
      }));
    });
  };

  var doParallel = function (fn) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      return fn.apply(null, [_.async.each].concat(args));
    };
  };

  var _asyncMap = function (eachfn, arr, iterator, callback) {
    var results = [];
    arr = _.map(arr, function (x, i) {
      return {
        index: i,
        value: x
      };
    });
    eachfn(arr, function (x, callback) {
      iterator(x.value, function (err, v) {
        results[x.index] = v;
        callback(err);
      });
    }, function (err) {
      callback(err, results);
    });
  };

  _.async.map = doParallel(_asyncMap);

  module.exports = _;