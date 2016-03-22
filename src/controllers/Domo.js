// Import libraries/requires
var _ = require('underscore');
var models = require('../models');

// Grab the domo model
var Domo = models.Domo;

// Creates a domo and saves it to the database
var makeDomo = function(req, res) {
	
	// Make sure both fields are filled
	if (!req.body.name || !req.body.age) {
		return res.status(400).json({ error: "RAWR! Both name and age are required" });
	}
	
	// Generate the domo data object
	var domoData = {
		name: req.body.name,
		age: req.body.age,
		owner: req.session.account._id
	};
	
	// Create a new domo instance holding our data
	var newDomo = new Domo.DomoModel(domoData);
	
	// Save the new domo to the database
	newDomo.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).json({ error: "An error occurred" });
		}
		
		res.json({ redirect: '/maker' });
	});
};

// Creates the domo maker page
var makerPage = function(req, res) {
	
	// Attempt to return a page containing the user's domos
	Domo.DomoModel.findByOwner(req.session.account._id, function(err, docs) {
		
		if (err) {
			console.log(err);
			return res.status(400).json({ error: "An error occurred" });
		}
		
		res.render('app', { domos: docs });
	});
};

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;