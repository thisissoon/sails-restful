'use strict';
/**
 * Module Dependencies
 */
var Connection = {},
    url = require('url');

/**
 * @constructs ApiError
 * @param {Number} status  HTTP status code
 * @param {String} message Error message
 * @param {Object} errors
 */
var ApiError = function ApiError(status, message, errors) {
  var code = this.code;
  switch(true) {
    case (code === 400 || code === 422) :
      this.code = 'E_VALIDATION';
      break;
    default:
      this.code = 'E_UNKNOWN';
      break;
  }

  this.status = status;
  this.message = message || 'API Error';
  this.errors = errors;
}

ApiError.prototype = new Object();
ApiError.prototype.constructor = ApiError;


/**
 * Find record(s) by issuing an HTTP GET request.
 *
 * @param {Object} connection Connection configuration object
 * @param {Object} collection Collection configuration object
 * @param {Object} options    Query options object. Contains query conditions (`where`), sort, limit etc. as per Waterline's API.
 * @param {Function} cb       Function to call with query results
 * @returns {Request}
 */
Connection.find = function find (connection, collection, options, cb) {

  var req = connection.service,
      url = connection.collections[collection].url,
      headers = connection.headers || {},
      query = options.where;

  if (query.id) {
    url = url + "/" + query.id;
    delete query.id;
  } else {
    query.page = options.where.page || options.skip / options.limit;
  }

  req.get(url, {
    headers: headers,
    query: query
  })
    .on('success', function (data, response) {
      return cb(null, data);
    })
    .on('fail', function (data, response) {
      var err = new ApiError(response.statusCode, data.message);
      return cb(err);
    })
    .on('error', function (err) {
      return cb(err);
    });
};

/**
 * Create record(s) by issuing an HTTP POST request
 *
 * @param {Object}        connection Connection configuration object
 * @param {Object}        collection Collection configuration object
 * @param {Array<Object>} values     Values of records to create
 * @param {Function}      cb         Function to call with query results
 * @returns {Request}
 */
Connection.create = function create (connection, collection, values, cb) {

  var req = connection.service,
      url = connection.collections[collection].url,
      headers = connection.headers || {};

  var data = JSON.stringify(values);

  req.post(url, {
    data: data,
    headers: headers
  })
    .on('success', function (data, response) {

      if (!data.id && response.headers.location) {
        // Retrieve created object from location
        var url = response.headers.location.replace(/https?:\/\/((?!\/).)*/, '');

        req.get(url, {
          headers: headers
        })
          .on('success', function (created, response) {
            return cb(null, created);
          })
          .on('fail', function (created, response) {
            // just return data from post instead
            return cb(null, data);
          })
          .on('error', function (err) {
            // return data from post instead
            return cb(err, data);
          });

      } else {
        // return data from POST
        return cb(null, data);
      }

    })
    .on('fail', function (data, response) {
      var err = new ApiError(response.statusCode, data.message, data.errors);
      return cb(err);
    })
    .on('error', function (err) {
      return cb(err);
    });
};

/**
 * Update record(s) by issuing an HTTP PUT request.
 *
 * @param {Object}        connection Connection configuration object
 * @param {Object}        collection Collection configuration object
 * @param {Object}        options    Query options object. contains query conditions (`where`), sort, limit etc. as per Waterline's API.
 * @param {Array<Object>} values     Values of records to create.
 * @param {Function}      cb         Function to call with query results.
 * @returns {Request}
 */
Connection.update = function update (connection, collection, options, values, cb) {

  var req = connection.service,
      url = connection.collections[collection].url + "/" + options.where.id,
      headers = connection.headers;

  var data = JSON.stringify(values);

  req.post(req.url, {
    data: JSON.stringify(data),
    headers: headers
  })
    .on('success', function (data, response) {
      return cb(null, data);
    })
    .on('fail', function (data, response) {
      var err = new ApiError(response.statusCode, data.message, data.errors);
      return cb(err);
    })
    .on('error', function (err) {
      return cb(err);
    });
};

/**
 * Destroy record(s) by issuing an HTTP DELETE request.
 *
 * @param {Object}   connection Connection configuration object
 * @param {Object}   collection Collection configuration object
 * @param {Object}   options    Query options object. contains query conditions (`where`), sort, limit etc. as per Waterline's API.
 * @param {Function} cb         Function to call with query results.
 * @returns {Request}
 */
Connection.destroy = function destroy (connection, collection, options, cb) {

  var req = connection.service,
      url = connection.collections[collection].url + "/" + options.where.id;

  req.del(url, {
    headers: connection.headers
  })
    .on('success', function (data, response) {
      return cb(null, data);
    })
    .on('fail', function (data, response) {
      var err = new ApiError(response.statusCode, data.message);
      return cb(err);
    })
    .on('error', function (err) {
      return cb(err);
    });
};

module.exports = Connection;
