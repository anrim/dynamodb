var assert = require('assert');
var array = require('array.js');
var format = require('../lib/util').format;
var parse = require('../lib/util').parse;

describe('#format', function () {
  it('should format enumerable', function (){
    var list = [{name: "one"}, {name: "two"}];
    var enumerable = array(list);
    var v = format(enumerable);
    assert.equal(JSON.stringify(v), JSON.stringify({"SS":["{\"name\":\"one\"}","{\"name\":\"two\"}"]}));
  });
  
  it('should not format empty string', function (){
    assert.equal(format(), null);
  });
  
  it('should return null for empty array', function (){
    assert.equal(format([]), null);
  });
  
  it('should return null for empty enumerable', function (){
    assert.equal(format(array([])), null);
  });
  
  it('should format enumerable as SS', function (){
    var v = format(array([{name: "one"}]));
    assert.equal(Array.isArray(v.SS), true);
  });
  
  it('should format object with array', function (){
    assert.deepEqual(format({
      arr: ["one", "two"]
    }),
    {
      "arr": {
        "SS": ["one","two"]
      }
    });
  });
  
  it('should format object with enumerable', function (){
    var value = format({
      arr: array(["one", "two"])
    });
    
    assert.equal(JSON.stringify(value), JSON.stringify({"arr": {"SS": ["one","two"]}}));
  });
})