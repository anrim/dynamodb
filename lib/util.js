exports.type = function (value) {
  var type = typeof value;
  
  // Check for Array & Date
  if (type === "object") {
    if (Array.isArray(value)) {
      type = "array";
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
    case "SS":
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
  if (!obj) {
    throw new TypeError("obj is required");
  }
  
  var result = {};
  if (typeof obj === "object") {
    Object.keys(obj).forEach(function(key){
      result[key] = format(obj[key]);
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
    case "array":
      if (v.length > 0) {
        if (typeof value[0] === "number") {
          v = {NS: value.map(function(i){return i.toString();})};
        } else if(typeof value[0] === "string") { 
          v = {SS: value.map(function(i){return i.toString();})};
        } else {
          v = {SS: value.map(function(i){return JSON.stringify(i);})};
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
      v = {S: value.toString().replace(/'/g, '\'').replace(/’/g, '\'')};
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
