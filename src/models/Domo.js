// Import libraries
var mongoose = require('mongoose');
var _ = require('underscore');

// The domo database model
var DomoModel;

// Renames a domo
var setName = function(name) {
	return _.escape(name).trim();
};

// Create the schema to hold domo userdata in the database
var DomoSchema = new mongoose.Schema ({
	name: {
		type: String,
		required: true,
		trim: true,
		set: setName
	},
	
	age: {
		type: Number,
		min: 0,
		required: true
	},
	
	favFood: {
		type: String,
		required: true,
		trim: true,
	},
	
	owner: {
		type: mongoose.Schema.ObjectId,
		required: true,
		ref: 'Account'
	},
	
	createdData: {
		type: Date,
		default: Date.now
	}
});

// API to return a standard domo information object
DomoSchema.methods.toAPI = function() {
	return {
		name: this.name,
		age: this.age,
		favFood: this.favFood
	};
};

// Finds domos based on an account ID
DomoSchema.statics.findByOwner = function(ownerId, callback) {
	
	var search = {
		owner: mongoose.Types.ObjectId(ownerId)
	};
	
	return DomoModel.find(search).select("name age favFood").exec(callback);
};

// Finds an exact matching domo
DomoSchema.statics.findDomo = function(ownerId, domoInfo, callback) {
	
	// create the search query object
	var search = {
		owner: mongoose.Types.ObjectId(ownerId),
		name: domoInfo.name,
		age: domoInfo.age,
		favFood: domoInfo.favFood
	};
	
	// return the exact domo, if one is found
	return DomoModel.findOne(search).select("name age favFood").exec(callback);
};

// Apply the schema to the model
DomoModel = mongoose.model('Domo', DomoSchema);

// Export the model and schema
module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;