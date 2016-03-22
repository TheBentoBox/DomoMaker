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
		age: this.age
	};
};

// Finds domos based on an account ID
DomoSchema.statics.findByOwner = function(ownerId, callback) {
	
	var search = {
		owner: mongoose.Types.ObjectId(ownerId)
	};
	
	return DomoModel.find(search).select("name age").exec(callback);
};

// Apply the schema to the model
DomoModel = mongoose.model('Domo', DomoSchema);

// Export the model and schema
module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;