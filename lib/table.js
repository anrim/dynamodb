var util = require('./util');
var vow = require('vow');

var format = util.format, parse = util.parse;

/**
* Table object
*/
var DynamoTable = Object.create({});
module.exports = DynamoTable;

/**
* Get item
* 
* @param {Object} key Hash and optional range key
* @return {Promise}
*/
DynamoTable.get = function (key) {
  var promise = vow.promise();
  
  var options = {
    TableName: this.name
  };
  
  try {
    options.Key = this.createKey(key);
  } catch (err) {
    promise.reject(err);
  }
  
  var self = this;
  this.db.getItem(options, function (err, res) {
    if (err) {
      // console.error(err);
      promise.reject(new Error(err.message));
    } else {
      if (res && 'Item' in res) {
        promise.fulfill(parse(res.Item, self.schema));
      } else {
        promise.fulfill();
      }
    }
  });
  return promise;
}

/**
* Put item
* 
* @param {Object} obj Object to put
* @return {Promise}
*/
DynamoTable.put = function (obj) {
  if (!(this.key.hash in obj)) {
    throw new TypeError("object must have hash key: "+this.key.hash);
  }
  
  var promise = vow.promise();
  var options = {
    TableName: this.name,
    Item: format(obj)
  };
  
  this.db.putItem(options, function (err, res) {
    if (err) {
      console.error(err);
      promise.reject(new Error(err.message));
    } else {
      promise.fulfill();
    }
  });
  
  return promise;
}

DynamoTable.update = function (key, obj, options) {
  if (!key) {
    throw new TypeError("key is required");
  }
  
  if (!obj) {
    throw new TypeError("object to update is required");
  }
  
  options = options || {};
  
  if (this.key.range && this.key.range in obj) {
    throw new TypeError("can't update range key");
  }
  
  var options2 = {
    TableName: this.name,
    Key: this.createKey(key),
    AttributeUpdates: {},
    ReturnValues: "UPDATED_NEW"
  };
  
  Object.keys(obj).forEach(function(k){
    // Update all but hash & range
    if (k != this.key.hash && k != this.key.range) {
      var value = format(obj[k]);
      options2.AttributeUpdates[k] = {Value: value, Action: "PUT"};
    }
  }, this);

  var promise = vow.promise();
  var self = this;
  this.db.updateItem(options2, function(err, data){
    if (err) {
      promise.reject(new Error(err.message));
    } else {
      if ('getAfterUpdate' in options && options.getAfterUpdate === true) {
        self.get(key).then(function (obj) {
          promise.fulfill(obj);
        }, function (err) {
          promise.reject(new Error(err.message));
        });
      } else {
        promise.fulfill(parse(data.Attributes));
      }
    }
  });
  
  return promise;
}

DynamoTable.delete = function (key) {
  var options = {
    TableName: this.name,
    Key: this.createKey(key)
  };
  
  var promise = vow.promise();
  this.db.deleteItem(options, function (err) {
    if (err) {
      promise.reject(new Error(err));
    } else {
      promise.fulfill();
    }
  });
  return promise;
}

// Helpers
DynamoTable.createKey = function (obj) {
  if(!(this.key.hash in obj)) {
    throw new Error("hash key is required");
  }
  
  // TODO Check hash key is of correct type
  var key = {
    HashKeyElement: format(obj[this.key.hash])
  };
  
  if ('range' in this.key && this.key.range.name in obj) {
    // TODO Check range key is of correct type
    key.RangeKeyElement = format(obj[this.key.range])
  }
  return key;
}

