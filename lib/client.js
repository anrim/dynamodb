var AWS = require('aws-sdk');
var Table = require('./table');

/**
* DynamoDB client
*/
var DynamoDB = Object.create({});

DynamoDB.createTable = function (name, schema, options) {
  if (!name) {
    throw new TypeError("table name is required");
  }
  
  if (!schema) {
    throw new TypeError("table schema is required");
  }
  
  if (!options.hash) {
    throw new TypeError("hash key is required");
  }
 
  this.tables[name] = {key: {hash: options.hash}, schema: schema};
}

DynamoDB.getTable = function (name) {
  if (!(name in this.tables)) {
    throw new Error("no such table");
  }
  
  var t = this.tables[name];
  var table = Object.create(Table, {
    db: {value: this.db},
    key: {enumerable: true, value: t.key},
    name: {enumerable: true, value: name},
    schema: {enumerable: true, value: t.schema}
  });
  
  return table;
}

DynamoDB.table = function (name, schema, key) {
  if (key) {
    this.createTable(name, schema, key);
  }
  return this.getTable(name);;
}

/**
* Create an instance of DynamoDB client
* 
* @param {object} options AWS options (key, secret, [region])
* @return {Object}
*/
exports.create = function (options) {
  options = options || {};
  
  if (!options.key) {
    throw new TypeError("AWS key is required");
  }
  
  if (!options.secret) {
    throw new TypeError("AWS secret is required");
  }
    
  var db = new AWS.DynamoDB.Client(new AWS.Config({
    accessKeyId: options.key,
    secretAccessKey: options.secret,
    region: options.region || "us-west-2"
  }));
  
  var client = Object.create(DynamoDB, {
    db: {value: db},
    tables: {enumerable: true, value: {}}
  });
  
  return client;
}

