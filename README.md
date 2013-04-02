#DynamoDB DAO

A simple [data access object](http://en.wikipedia.org/wiki/Data_access_object) for Amazon's [DynamoDB](http://aws.amazon.com/dynamodb) using promises.
	
	// Create new user
	db.table("users")
		.put({id: "1", name: "Me")
		.then(function (user) {
			console.log(user);
		});


##Features

* Simple chainable syntax
* Uses promises instead of callbacks to simplify building pipelines
* Table schema based on [JSON Schema](http://json-schema.org/latest/json-schema-core.html)
* Type conversion between Dynamo ({S: "dao"}) and JavaScript types (String, Number, Date, Boolean, Array & Object)
    

####Roadmap

* Find - table.find(query) using DDB's Query and Scan.
* Index lookup tables
* Batch commands (get, update, delete many)
* Validate data using table schema (JSON schema validation)


##Installation

	npm install dynamodb-dao

##API


###Create client
####DynamoDB.create(options)
Creates a client aws credentials in options. Returns db client.

	// Create db client
	var db = DynamoDB.create({
    	key: process.env.AWS_KEY,
      	secret: process.env.AWS_SECRET
    });

###Define table
####db.table(name, schema, [options])
Defines a table with schema. Returns DataTable.

	// Define users table
    db.table("users", {hash: "id"}, {
    	id: {type="string", required: true},
    	name: {type="string"},
    	created: {type: "date"},
    	roles: {type: "array"},
    	images: {type: "object"}
    }, {hash: "id"});

###Get table
####db.table(name)
Returns DataTable instance. Returns DataTable.

	var users = db.table("users");

###Create item
####table.put(data)
Saves data to db.  Returns promise.
	
	// Create user
	users.put({
    	id: "1"
    	name: "Me",
    	created: new Date(),
    	roles: ["user"],
    	images: [{url: "http://placehold.it/128x128&text=[img]", type: "thumb"}]
    })
    .then(function (user) {
    	console.log('saved', user);
    }, function (err) {
    	console.error(err);
    });

###Get item
####table.get(key)
Get data by key(hash + [range]). Returns promise.

	// Get user
    users.get({id: "1"})
    .then(function (user) {
    	console.log('fetched', user);
    }, function (err) {
    	console.error(err);
    });

###Update item
####table.update(key, data, options)
Updates data by key (hash + [range]). Returns promise.

**options**

* getAfterUpdate - boolean default false

.
	
	// Update item
	users.update({id: "1"}, {name: "Andy"})
    .then(function (obj) {
    	console.log('updated user with', obj);
    }, function (err) {
    	console.error(err);
    });

###Delete item
####table.delete(key)
Delete item by key (hash + [range]). Returns promise.

	// Delete user
    users.delete({id: "1"})
    .then(function (user) {
    	console.log('deleted', user);
    }, function (err) {
    	console.error(err);
    });

###License

(The MIT License)

Copyright (c) 2013 Andreas Rimbe &lt;a@rimbe.net&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.










