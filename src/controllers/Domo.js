// Import libraries/requires
var _ = require('underscore');
var models = require('../models');

// Grab the domo model
var Domo = models.Domo;

// Creates a domo and saves it to the database
var makeDomo = function(req, res) {
	
	// Make sure both fields are filled
	if (!req.body.name || !req.body.age || !req.body.favFood) {
		return res.status(400).json({ error: "RAWR! Both name and age are required" });
	}
	
	// Generate the domo data object
	var domoData = {
		name: req.body.name,
		age: req.body.age,
		favFood: req.body.favFood,
		owner: req.session.account._id
	};
	
	// Create a new domo instance holding our data
	var newDomo = new Domo.DomoModel(domoData);
	
	// Save the new domo to the database
	newDomo.save(function(err) {
		if (err) {
			console.log(err);
			return res.status(400).json({ error: "RAWR! An error occurred while creating a domo" });
		}
		
		res.json({ redirect: '/maker' });
	});
};

// Creates the domo maker page
var makerPage = function(req, res) {
	
	// Attempt to return a page containing the user's domos
	Domo.DomoModel.findByOwner(req.session.account._id, function(err, docs) {
		
		// catch errors creating the page
		if (err) {
			console.log(err);
			return res.status(400).json({ error: "RAWR! An error occurred creating your account page" });
		}
		
		res.render('app', { csrfToken: req.csrfToken(), domos: docs });
	});
};

// Deletes a domo from the database
var deleteDomo =  function(req, res) {
	
	// Need the info of the domo to delete it
	if (!req.body.name || !req.body.age || !req.body.favFood) {
		return res.status(400).json({ error: "RAWR! All domo info is needed to delete it!" });
	}
	
	Domo.DomoModel.findDomo(req.session.account._id, req.body, function(err, doc) {
		
		// catch errors with trying to find the domo
		if (err) {
			console.log(err);
			return res.status(400).json({ error: "RAWR! An error occurred while finding that domo" });
		}
		
		// check if the domo wasn't found
		if (!doc) {
			return res.status(400).json({ error: "RAWR! That domo wasn't found on your account!" });
		}
		
		// delete the domo
		doc.remove(function(err) {
			// catch deletion errors
			if (err) {
				console.log(err);
				return res.status(400).json({ error: "RAWR! An error occurred while deleting a domo" });
			}
		})
		
		res.json({ redirect: '/maker' });
	});
}

module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.deleteDomo = deleteDomo;