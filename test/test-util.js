var assert = require('assert');
var array = require('array.js');
var format = require('../lib/util').format;
var parse = require('../lib/util').parse;

describe('#format', function () {
  it('should format enumerable', function (){
    var list = [{name: "one"}, {name: "two"}];
    var enumerable = array(list);
    var v = format(enumerable);
    assert.deepEqual(v["SS"], list.map(JSON.stringify));
  });
})