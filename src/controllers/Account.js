var models = require('../models');

var Account = models.Account;

var loginPage = function(req, res) {
	res.render('login', { csrfToken: req.csrfToken() });
};

var signupPage = function(req, res) {
	res.render('signup', { csrfToken: req.csrfToken() });
};

var logout = function(req, res) {
	req.session.destroy();
	res.redirect('/');
};

var login = function(req, res) {
	
	// Make sure all fields are filled
	if (!req.body.username || !req.body.pass) {
		return res.status(400).json({error: "RAWR! All fields are required"});
	}
	
	// Authenticate the login
	Account.AccountModel.authenticate(req.body.username, req.body.pass, function(err, account) {
		if (err || !account) {
			return res.status(401).json({error: "Wrong username or password"});
		}
		
		req.session.account = account.toAPI();
		
		res.json({redirect: '/maker'});
	});
};

var signup = function(req, res) {
	
	// Make sure all fields are filled
	if (!req.body.username || !req.body.pass || !req.body.pass2) {
		return res.status(400).json({error: "RAWR! All fields are required"});
	}
	
	// Check if passwords match
	if (req.body.pass !== req.body.pass2) {
		return res.status(400).json({error: "RAWR! Passwords do not match"});
	}
	
	// Generate the account with encrypted salt/hashed password
	Account.AccountModel.generateHash(req.body.pass, function(salt, hash) {
		
		// generate account data from the returned hash/salt
		var accountData = {
			username: req.body.username,
			salt: salt,
			password: hash
		};
		
		// generate the account from the data
		var newAccount = new Account.AccountModel(accountData);
		
		// push account to the database
		newAccount.save(function(err) {
			if (err) {
				console.log(err);
				return res.status(400).json({error: "An error occurred"});
			}
			
			req.session.account = newAccount.toAPI();
			
			// send the user to the maker page
			res.json({redirect: '/maker'});
		});
	});
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signupPage = signupPage;
module.exports.signup = signup;