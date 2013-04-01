var should = require("should");
var DynamoDB = require('../index');

describe('DynamoTable', function () {
  var db;
  before(function () {
    db = DynamoDB.create({
      key: process.env.AWS_KEY,
      secret: process.env.AWS_SECRET
    });
    
    db.table("test-dynamo", {
      id: {type: "string"},
      string: {type: "string"},
      number: {type: "number"},
      bool: {type: "boolean"},
      date: {type: "date"},
      array: {type: "array"},
      object: {type: "object"}
    }, {hash: "id"});
  });
  
  describe('#key', function () {
    it('should return hash key', function () {
      var key = db.table("test-dynamo").createKey({id: "1"});
      key.should.have.property("HashKeyElement");
      key.HashKeyElement.should.eql({S: "1"});
    });
    
    it.skip('should return hash & range key', function () {
      var table = db.addTable("test-dynamo1", {
        hash: {name: "id"},
        range: {name: "date", type: "number"}
      });
        
      var date = new Date();
      var key = table.createKey({id: "1", date: date});
      key.should.have.property("RangeKeyElement");
      key.HashKeyElement.should.eql({N: date.getTime()});
    });
  });
  
  describe('#put', function () {
    it('should put item with String', function (done) {
      db.table("test-dynamo")
        .put({id: "string", string: "String"})
        .then(function () {
          done();
        });
    });
    
    it('should put item with Number', function (done) {
      db.table("test-dynamo")
        .put({id: "number", number: 1})
        .then(function () {
          done();
        });
    });
    
    it('should put item with Boolean', function (done) {
      db.table("test-dynamo")
        .put({id: "bool", bool: true})
        .then(function () {
          done();
        });
    });
    
    it('should put item with Date', function (done) {
      db.table("test-dynamo")
        .put({id: "date", date: new Date()})
        .then(function () {
          done();
        });
    });
    
    it('should put item with Array', function (done) {
      db.table("test-dynamo")
        .put({id: "array", array: ["user", "admin"]})
        .then(function () {
          done();
        });
    });
    
    it('should put item with Object', function (done) {
      db.table("test-dynamo")
        .put({id: "object", object: {key: "value"}})
        .then(function () {
          done();
        });
    });
  });
  
  describe("#get", function () {
    it('should get null', function (done) {
      db.table("test-dynamo")
        .get({id: "1"})
        .then(function (obj) {
          should.not.exist(obj);
          done();
        });
    });
    
    it('should get item String', function (done) {
      db.table("test-dynamo")
        .get({id: "string"})
        .then(function (obj) {
          obj.should.have.property("string", "String");
          done();
        });
    });
    
    it('should get number', function (done) {
      db.table("test-dynamo")
        .get({id: "number"})
        .then(function (obj) {
          obj.should.have.property("number", 1);
          done();
        });
    });
    
    it('should get bool', function (done) {
      db.table("test-dynamo")
        .get({id: "bool"})
        .then(function (obj) {
          obj.should.have.property("bool", true);
          done();
        });
    });
    
    it('should get date', function (done) {
      db.table("test-dynamo")
        .get({id: "date"})
        .then(function (obj) {
          obj.should.have.property("date");
          done();
        });
    });
    
    it('should get array', function (done) {
      db.table("test-dynamo")
        .get({id: "array"})
        .then(function (obj) {
          obj.should.have.property("array");
          done();
        });
    });
    
    it('should get object', function (done) {
      db.table("test-dynamo")
        .get({id: "object"})
        .then(function (obj) {
          obj.should.have.property("object");
          obj.object.should.eql({key: 'value'});
          done();
        });
    });
  });
  
  describe("#update", function () {
    it('should update string', function (done) {
      db.table("test-dynamo")
        .update({id: "string"}, {string: "string2"})
        .then(function (obj) {
          obj.should.have.property("string", "string2");
          done();
        });
    });
    
    it('should update and get item', function (done) {
      db.table("test-dynamo")
        .update({id: "string"}, {string: "string2"}, {get: true})
        .then(function (obj) {
          obj.should.have.property("string", "string2");
          done();
        });
    });
  });
  
  describe("#delete", function () {
    it('should delete string', function (done) {
      db.table("test-dynamo")
        .delete({id: "string"})
        .then(function () {
          done();
        });
    });
    
    it('should delete number', function (done) {
      db.table("test-dynamo")
        .delete({id: "number"})
        .then(function () {
          done();
        });
    });
    
    it('should delete bool', function (done) {
      db.table("test-dynamo")
        .delete({id: "bool"})
        .then(function () {
          done();
        });
    });
    
    it('should delete date', function (done) {
      db.table("test-dynamo")
        .delete({id: "date"})
        .then(function () {
          done();
        });
    });
    
    it('should delete array', function (done) {
      db.table("test-dynamo")
        .delete({id: "array"})
        .then(function () {
          done();
        });
    });
    
    it('should delete object', function (done) {
      db.table("test-dynamo")
        .delete({id: "object"})
        .then(function () {
          done();
        });
    });
  });
});