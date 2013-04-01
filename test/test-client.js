var should = require("should");
var DynamoDB = require('../index');

describe('DynamoDB', function () {
  describe('#create', function () {
    it('should create db client with aws credentials', function (done) {
      var db = DynamoDB.create({
        key: process.env.AWS_KEY,
        secret: process.env.AWS_SECRET
      });
      db.should.have.ownProperty('db');
      done();
    });
  });
});

describe('DynamoDB', function () {
  var db;
  before(function () {
    db = DynamoDB.create({
      key: process.env.AWS_KEY,
      secret: process.env.AWS_SECRET
    });
  });
  
  describe('#table', function () {
    it('should create table', function () {
      var table = db.table('test-dynamo', {
        id: {type: "number", required: true},
        name: {type: "string"}
      }, {hash: "id"});
    });
    
    it('should get table', function () {
      var table = db.table("test-dynamo");
      table.should.have.ownProperty("name");
      table.should.have.ownProperty("schema");
    });
  });
});