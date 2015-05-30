var AWS  = require('aws-sdk'),
    fmt = require('fmt'),
    util = require('util'),
    _    = require('underscore')

var Backend = require('./backend')

exports.init = function(startupTime, config, emitter, logger) {
  config = _.defaults(config.cloudwatch || {}, {
    debug: config.debug,
    dumpMessages: config.dumpMessages,
    dimensions: { 'InstanceId': '' }
  })

  if (!config.namespace) {
    logger.log('cloudwatch config is missing "namespace"')
    return false
  }

  AWS.config.update(config);
  AWS.config.apiVersions = {
    cloudwatch: '2010-08-01',
  };

  getRegion(config, function(err, region) {
    if (err) {
      if (config.debug) {
        logger.log('cloudwatch backend could not access meta-data service');
      }
    }

    AWS.config.update({region: region });
    startup(config, startupTime, emitter, logger);
  });

  return true;
}

function getRegion(options, callback) {
  if (options.region) {
    return callback(null, region);
  }

  var metadata = new AWS.MetadataService()
  metadata.request('/latest/meta-data/placement/availability-zone', function(err, data) {
    if (err) {
      return callback(err);
    }
    
    var x = data.split('-');
    x[2] = x[2][0];
    return callback(null, x.join('-'));
  });
}

function startup(config, time, emitter, logger) {
  new Backend(config, time, function(flush, status) {
    if (flush) emitter.on('flush', flush)
    if (status) emitter.on('status', status)
  }, logger)
}
