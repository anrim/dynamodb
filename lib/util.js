exports.type = function (value) {
  var type = typeof value;
  
  // Check for Array & Date
  if (type === "object") {
    if (Array.isArray(value)) {
      type = "array";
    } else if (value.__ArrayLike === true) {
      type = "enumerable";
    } else if (typeof value.getDate !== "undefined") {
      type = "date";
    }
  }
  
  return type;
}

/**
* Parse DynamoDB object e.g {S: "A string"}
*/
function parseObject (obj) {
  // console.log('parse value', value);
  var type = Object.keys(obj)[0];
  var value = obj[type];
  switch(type){
    case "S":
      break;
    case "SS":
      value = value.map(function(i){
        var o;
        try {
          o = JSON.parse(i);
        } catch (ex) {
          o = i;
        }
        return o;
      });
      break;
    case "N":
      value = Number(value);
      break;
    case "NS":
      value = value.map(function(i){return Number(i);});
      break;
    default:
      value = JSON.parse(value);
  }
  return value;
}

exports.parse = function (obj, schema) {
  var result = {};
  var value;
  Object.keys(obj).forEach(function (k) {
    var type = "string";
    if (schema && k in schema && schema[k].type) {
      type = schema[k].type;
    }
    
    value = parseObject(obj[k]);
    result[k] = convert(value, type);
  });
  return result;
}

exports.format = function (obj) {
  var result = {};
  if (typeof obj === "object" && !Array.isArray(obj) && !obj.__ArrayLike) {
    Object.keys(obj).forEach(function(key){
      var value = format(obj[key]);
      if (value != null) {
        result[key] = value;
      }
    });
  } else {
    result = format(obj);
  }
  return result;
}

function format (value) {
  var v = value;
  var type = exports.type(value);
  switch (type) {
    case "enumerable":
      v = v.toArray();
    case "array":
      if (v.length > 0) {
        if (typeof v[0] === "number") {
          v = {NS: v.map(function(i){return i.toString();})};
        } else if(typeof v[0] === "string") { 
          v = {SS: v.map(function(i){return i.toString();})};
        } else {
          v = {SS: v.map(function(i){return JSON.stringify(i);})};
        }
      } else {
        v = null;
      }
      break;
    case "boolean":
      v = (value === true)?{N: "1"}:{N: "0"};
      break;
    case "date":
      v = {N: value.getTime().toString()};
      break;
    case "number":
      v = {N: value.toString()};
      break;
    case "object":
      v = {S: JSON.stringify(value)};
      break;
    default:
      if (typeof value !== "undefined") {
        v = {S: value.toString().replace(/'/g, '\'').replace(/’/g, '\'')};
      } else {
        v = null;
      }
  }
  
  return v;
}

/**
* Convert a value to specified type
* 
* @param {Any} value The value to convert
* @param {String} type The type to convert to
* @return {Any}
*/
function convert (value, type) {
  // console.log('convert %s to %s', value, type);
  var result = value;
  switch (type) {
    case "boolean":
      result = Boolean(value);
      break;
    case "date":
      result = new Date(value);
      break;
    
    case "object":
      result = JSON.parse(value);
      break;
  }
  return result;
}
