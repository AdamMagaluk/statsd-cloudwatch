var url = require('url');
// some.key?dimension1=test&dimension2=abc -> { key: 'some.key', dimensions: { dimension1: 'test', dimension2: 'abc'} }
function parseKey(key) {
  var parsed = url.parse(key, true);
  return { key: parsed.pathname, dimensions: parsed.query};
}

function extend(obj1, obj2) {
  Object.keys(obj2).forEach(function(k) {
    if (!obj1.hasOwnProperty(k)) {
      obj1[k] = obj2[k];
    }
  });
}

var counters = function (key, value, ts, bucket) {
  var parsed = parseKey(key);
  var obj = {
    key: parsed.key,
    val: value,
    "@timestamp": ts
  };
  extend(obj, parsed.dimensions);
  bucket.push(obj);
  return 1;
}

var timers = function (key, series, ts, bucket) {
  var parsed = parseKey(key);
  for (keyTimer in series) {
    var obj = {
      key: parsed.key,
      val: series[keyTimer],
      "@timestamp": ts
    };
    extend(obj, parsed.dimensions);
    bucket.push(obj);
  }
  return series.length;
}

var timer_data = function (key, value, ts, bucket) {
  var parsed = parseKey(key);
  var obj = {
    key: parsed.key,
    "@timestamp": ts,
    val: value
  };
  extend(obj, parsed.dimensions);
  bucket.push(obj);
}

exports.counters   = counters;
exports.timers     = timers;
exports.timer_data = timer_data;
exports.gauges     = counters;
