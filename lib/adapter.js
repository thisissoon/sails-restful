'use strict';
/**
 * Module Dependencies
 */
var url = require('url'),
    rest = require('restler'),
    Connection = require('./connection');


/**
 * sails-restful
 *
 * Most of the methods below are optional.
 */
module.exports = (function () {


  /**
   * Reference to each configured connection
   * @propety {Object} connections
   */
  var connections = {};

  /**
   * @property {Object} adapter
   */
  var adapter = {

    syncable: false,

    identity: 'sails-restful',

    /**
     * Default configuration for connections
     * @property {Object} defaults
     */
    defaults: {
      port: 80,
      host: '',
      protocol: 'http',
      pathname: '',
      headers: {
        'Content-Type': 'application/json'
      }
    },



    /**
     * This method runs when a model is initially registered
     * at server-start-time.  This is the only required method.
     *
     * @param  {Object}   connection  Connection configuraiton options
     * @param  {Object}   collections Registered collections
     * @param  {Function} cb          callback
     */
    registerConnection: function(connection, collections, cb) {

      if(!connection.identity) return cb(new Error('Connection is missing an identity.'));
      if(connections[connection.identity]) return cb(new Error('Connection is already registered.'));

      if (!connection.port) return cb('No port specified (e.g. 80');
      if (!connection.host || connection.host === '') return cb('No host specified (e.g. api.example.com');

      var baseURL = url.format({ protocol: connection.protocol, hostname: connection.host, port: connection.port, pathname: connection.pathname });

      /**
       * FM API Service
       * @description :: Service for communicating with FM API
       */
      var FM = rest.service(function(){}, {
        baseURL: baseURL
      });

      // Save reference to connection
      connections[connection.identity] = {
        service: new FM(),
        headers: connection.headers,
        collections : collections
      };

      cb();
    },


    /**
     * Fired when a model is unregistered, typically when the server
     * is killed. Useful for tearing-down remaining open connections,
     * etc.
     *
     * @param  {Function} cb [description]
     * @return {[type]}      [description]
     */
    teardown: function (conn, cb) {

      if (typeof conn == 'function') {
        cb = conn;
        conn = null;
      }
      if (!conn) {
        connections = {};
        return cb();
      }
      if(!connections[conn]) return cb();
      delete connections[conn];
      cb();
    },


    /**
     * Return attributes
     *
     * @method describe
     * @param   {String}   connection Connection identifier
     * @param   {String}   collection Model identifier
     * @param   {Function} cb         Callback cb(err, data)
     */
    describe: function describe (connection, collection, cb) {
      // Add in logic here to describe a collection (e.g. OPTIONS)
      return cb();
    },

    /**
     * REQUIRED method if users expect to call Model.find(), Model.findOne(),
     * or related.
     *
     * @method find
     * @param   {String}   connection Connection identifier
     * @param   {String}   collection Model identifier
     * @param   {Object}   options    Query options from call to Model.find(options)
     * @param   {Function} cb         Callback cb(err, data)
     */
    find: function find (connection, collection, options, cb) {
      return Connection.find(connections[connection], collection, options, cb);
    },

    /**
     * @method create
     * @param   {String}   connection Connection identifier
     * @param   {String}   collection Model identifier
     * @param   {Object}   values     Data values parsed from call to Model.create(values)
     * @param   {Function} cb         Callback cb(err, data)
     */
    create: function create (connection, collection, values, cb) {
	  return Connection.create(connections[connection], collection, values, cb);
    },

    /**
     * @method update
     * @param   {String}   connection Connection identifier
     * @param   {String}   collection Model identifier
     * @param   {Object}   options    Query options from call to Model.update(options, values)
     * @param   {Object}   values     Data values parsed from call to Model.update(options, values)
     * @param   {Function} cb         Callback cb(err, data)
     */
    update: function update (connection, collection, options, values, cb) {
      return Connection.update(connections[connection], collection, options, cb);
    },

    /**
     * @method destroy
     * @param   {String}   connection Connection identifier
     * @param   {String}   collection Model identifier
     * @param   {Object}   options    Query options from call to Model.destroy(options)
     * @param   {Function} cb         Callback cb(err, data)
     */
    destroy: function destroy (connection, collection, options, cb) {
      return Connection.destroy(connections[connection], collection, options, cb);
    }

  };

  // Expose adapter definition
  return adapter;

})();



