var Bookings = require('./model/bookings');
var ChatMessage = require('./model/chatmessage');
var mailer = require('../mailerservice');
var nodemailer = require('nodemailer');
var fs = require('fs');
var ejs = require('ejs');
module.exports = function(app, passport) {

// normal routes ===============================================================

	// show the home page (will also have our login links)
	/*app.get('/', function(req, res) {
		res.render('index.ejs');
	});*/

	// PROFILE SECTION =========================
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile.ejs', {
			user : req.user
		});
	});

	app.get('/listBookings', isLoggedIn, function (req, res) {
		var returnvalue;
		console.log(req.user.id);
		var profileId = req.user.id;
		/*Bookings.find({ profileId: profileId }).sort({
			'created_at': 'desc'
		}).exec( function (err, lists) {
			if (err) throw err;
			// object of the user
			res.render('listings.ejs', {
				booklist: lists,
				user: req.user
			});
			//console.log(user);
		});*/
		Bookings.find({ profileId: profileId }).sort({
			'created_at': 'desc'
		}).then( function (lists) {
			if (err) throw err;
			// object of the user
			res.render('listings.ejs', {
				booklist: lists,
				user: req.user
			}).catch((err) => {
				if (err) throw err;
				//catch error
			  });
			//console.log(user);
		});

	});

	app.get('/admin/listings', isLoggedIn, function (req, res) {
		var returnvalue;
		console.log(req.user.id);
		var profileId = req.user.id;
		/*Bookings.find().sort({
			'created_at': 'desc'
		}).exec( function (err, lists) {
			if (err) throw err;
			// object of the user
			res.render('adminlistings.ejs', {
				booklist: lists,
				user: req.user
			});
			//console.log(user);
		});*/
		Bookings.find().sort({
			'created_at': 'desc'
		}).then( function (lists) {
			// object of the user
			res.render('adminlistings.ejs', {
				booklist: lists,
				user: req.user
			});
			//console.log(user);
		}).catch((err) => {
			if (err) throw err;
			//catch error
		  });

	});

	// BOOKING SECTION =========================
	app.get('/bookings', isLoggedIn, function (req, res) {
		res.render('bookings.ejs', {
			selectedProduct : req.query.id || null,
			user: req.user,
			profileId: req.user.id,
			name: req.user.twitter.displayName.toString().trim() || req.user.facebook.name || req.user.google.name,
			email: req.user.facebook.email || req.user.google.email || null
		});
	});

	app.post('/bookings', isLoggedIn,function (req, res){
		var newBookings = new Bookings();
		var currentDate = new Date();
		console.log(req.body);
		var books= req.body;
		var mdata = {
			to: 'segxy2708@hotmail.com, esther@seekerslocus.com, esther.okoloeze@gmail.com,' + books.email,
			from: 'bookings@seekerslocus.com',
			subject: books.product + ' Bookings',
			plainbody: 'Thanks for requesting for ' + books.product + ' service',
			name: books.name,
			product: books.product,
			details: books.details,
			location: books.location
		};
		newBookings.profileId = books.profileId;
		newBookings.email =books.email,
		newBookings.name = books.name,
		newBookings.phoneNumber= books.phoneNumber,
		newBookings.sex = books.sex,
		newBookings.location= books.location,
		newBookings.details=books.details,
		newBookings.updated_at = currentDate,
		newBookings.created_at = currentDate,
		newBookings.product=books.product,

		/*Bookings.pre('save', function(next) {
			var currentDate = new Date();
			this.updated_at = currentDate;
			if (!this.created_at)
			this.created_at = currentDate;
			next();
		});*/

		
			//sendmail(mdata);
		newBookings.save(function (err) {
			if (err) throw err;
			sendmail(mdata);
			console.log('new bookings ' + newBookings.profileId +' created!');
			res.json(newBookings);
		});
		res.json(newBookings);
	});

	app.get('/chatmessage', function (req, res) {
		var returnvalue;
		console.log(req.query.id);
		var receiverId = req.query.id;
		var author = req.query.author;
		/*ChatMessage.find({$or:[{ receiver: receiverId },{author:receiverId, receiver:author}]}).sort({
			'created_at': 'asc'
		}).exec(function (err, lists) {
			if (err) throw err;
			// object of the user
			res.json(lists);
			//console.log(user);
		});*/
		ChatMessage.find({$or:[{ receiver: receiverId },{author:receiverId, receiver:author}]}).sort({
			'created_at': 'asc'
		}).then(function (lists) {
			
			// object of the user
			res.json(lists);
			//console.log(user);
		}).catch((err) => {
			if (err) throw err;
			//catch error
		  });
	});

	app.get('/adminchatmessage', function (req, res) {
		var returnvalue;
		console.log(req.query.id);
		var receiverId = req.query.id;
		var author = req.query.author;
		/* ChatMessage.find({$or:[{ receiver: receiverId , author: author },{ receiver: author , author: receiverId }]}).sort({
			'created_at': 'asc'
		}).exec(function (err, lists) {
			if (err) throw err;
			// object of the user
			res.json(lists);
			//console.log(user);
		}) ;*/
		ChatMessage.find({$or:[{ receiver: receiverId , author: author },{ receiver: author , author: receiverId }]}).sort({
			'created_at': 'asc'
		}).then(function (lists) {
			// object of the user
			res.json(lists);
			//console.log(user);
		}).catch((err) => {
			if (err) throw err;
			//catch error
		  })
	});

	app.post('/chatmessage', function (req, res) {
		var newMessage = new ChatMessage();
		var currentDate = new Date();
		console.log(req.body);
		var message = req.body;
		
		newMessage.receiver = message.receiver;
		newMessage.body = message.body,
			newMessage.author = message.author,
			newMessage.deleted = false,
			newMessage.updated_at = currentDate,
			newMessage.created_at = currentDate,

			/*Bookings.pre('save', function(next) {
				var currentDate = new Date();
				this.updated_at = currentDate;
				if (!this.created_at)
				this.created_at = currentDate;
				next();
			});*/


			//sendmail(mdata);
			newMessage.save(function (err) {
				if (err) throw err;
			console.log('new chat ' + newMessage.receiver + ' created!');
			res.json(newMessage);
			});
		res.json(newMessage);
	});

	// LOGOUT ==============================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

	// locally --------------------------------
		// LOGIN ===============================
		// show the login form
		/*app.get('/login', function(req, res) {
			res.render('login.ejs', { message: req.flash('loginMessage') });
		});*/

		// process the login form
		app.post('/login', passport.authenticate('local-login', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

		// SIGNUP =================================
		// show the signup form
		app.get('/signup', function(req, res) {
			res.render('signup.ejs', { message: req.flash('loginMessage') });
		});

		// process the signup form
		app.post('/signup', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

		// handle the callback after facebook has authenticated the user
		app.get('/auth/facebook/callback',
			passport.authenticate('facebook', {
				//successRedirect : '/login',
				failureRedirect : '/'
			}), function (req, res) {
				res.redirect(req.session.returnTo || '/profile');
				delete req.session.returnTo;
			});

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/auth/twitter', passport.authenticate('twitter', { scope : 'email' }));

		// handle the callback after twitter has authenticated the user
		app.get('/auth/twitter/callback',
			passport.authenticate('twitter', {
				//successRedirect : '/profile',
				failureRedirect : '/'
			}), function (req, res) {
				res.redirect(req.session.returnTo || '/profile');
				delete req.session.returnTo;
			});


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

		// the callback after google has authenticated the user
		app.get('/auth/google/callback',
			passport.authenticate('google', {
				//successRedirect : '/profile',
				failureRedirect : '/'
			}), function (req, res) {
				res.redirect(req.session.returnTo || '/profile');
				delete req.session.returnTo;
			});

// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
// =============================================================================

	// locally --------------------------------
		app.get('/connect/local', function(req, res) {
			res.render('connect-local.ejs', { message: req.flash('loginMessage') });
		});
		app.post('/connect/local', passport.authenticate('local-signup', {
			successRedirect : '/profile', // redirect to the secure profile section
			failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		}));

	// facebook -------------------------------

		// send to facebook to do the authentication
		app.get('/connect/facebook', passport.authorize('facebook', { scope : 'email' }));

		// handle the callback after facebook has authorized the user
		app.get('/connect/facebook/callback',
			passport.authorize('facebook', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

	// twitter --------------------------------

		// send to twitter to do the authentication
		app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

		// handle the callback after twitter has authorized the user
		app.get('/connect/twitter/callback',
			passport.authorize('twitter', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));


	// google ---------------------------------

		// send to google to do the authentication
		app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

		// the callback after google has authorized the user
		app.get('/connect/google/callback',
			passport.authorize('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
			}));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

	// local -----------------------------------
	app.get('/unlink/local', function(req, res) {
		var user            = req.user;
		user.local.email    = undefined;
		user.local.password = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// facebook -------------------------------
	app.get('/unlink/facebook', function(req, res) {
		var user            = req.user;
		user.facebook.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// twitter --------------------------------
	app.get('/unlink/twitter', function(req, res) {
		var user           = req.user;
		user.twitter.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});

	// google ---------------------------------
	app.get('/unlink/google', function(req, res) {
		var user          = req.user;
		user.google.token = undefined;
		user.save(function(err) {
			res.redirect('/profile');
		});
	});


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
        return next();
        console.log(req.isAuthenticated());

	//res.redirect('/');
	res.redirect(`/login?origin=${req.originalUrl}`);
}

function sendmail(data) {
	// Create the transporter with the required configuration for Gmail
	// change the user and pass !
	var transporter = nodemailer.createTransport({
		host: 'smtp.zoho.com',
		port: 465,
		secure: true, // use SSL
		auth: {
			user: 'bookings@seekerslocus.com',
			pass: 'SL@Bookings123'
		}
	});

	// setup e-mail data, even with unicode symbols
	/*var mailOptions = {
		from: data.from, // sender address (who sends)
		to: data.to,//'mymail@mail.com, mymail2@mail.com', // list of receivers (who receives)
		subject: data.subject, // Subject line
		text: data.plainbody, // plaintext body
		html: data.htmbody // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			return console.log(error);
		}

		console.log('Message sent: ' + info.response);
	});*/
console.log(data);
	ejs.renderFile(__dirname + "/mails.ejs", { name: data.name, data: data }, function (err, _data) {
		if (err) {
			console.log(err);
		} else {

			var mailOptions = {
				from: data.from, // sender address (who sends)
				to: data.to,//'mymail@mail.com, mymail2@mail.com', // list of receivers (who receives)
				subject: data.subject, // Subject line
				text: data.plainbody, // plaintext body
				html: _data // html body
			};
			
			console.log("html data ======================>", mailOptions.html);
			transporter.sendMail(mailOptions, function (err, info) {
				if (err) {
					console.log(err);
				} else {
					console.log('Message sent: ' + info.response);
				}
			});
		}

	});
}