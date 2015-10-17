'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Bucketlist = mongoose.model('Bucketlist'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, bucketlist;

/**
 * Bucketlist routes tests
 */
describe('Bucketlist CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Bucketlist
		user.save(function() {
			bucketlist = {
				name: 'Bucketlist Name'
			};

			done();
		});
	});

	it('should be able to save Bucketlist instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Bucketlist
				agent.post('/bucketlists')
					.send(bucketlist)
					.expect(200)
					.end(function(bucketlistSaveErr, bucketlistSaveRes) {
						// Handle Bucketlist save error
						if (bucketlistSaveErr) done(bucketlistSaveErr);

						// Get a list of Bucketlists
						agent.get('/bucketlists')
							.end(function(bucketlistsGetErr, bucketlistsGetRes) {
								// Handle Bucketlist save error
								if (bucketlistsGetErr) done(bucketlistsGetErr);

								// Get Bucketlists list
								var bucketlists = bucketlistsGetRes.body;

								// Set assertions
								(bucketlists[0].user._id).should.equal(userId);
								(bucketlists[0].name).should.match('Bucketlist Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Bucketlist instance if not logged in', function(done) {
		agent.post('/bucketlists')
			.send(bucketlist)
			.expect(401)
			.end(function(bucketlistSaveErr, bucketlistSaveRes) {
				// Call the assertion callback
				done(bucketlistSaveErr);
			});
	});

	it('should not be able to save Bucketlist instance if no name is provided', function(done) {
		// Invalidate name field
		bucketlist.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Bucketlist
				agent.post('/bucketlists')
					.send(bucketlist)
					.expect(400)
					.end(function(bucketlistSaveErr, bucketlistSaveRes) {
						// Set message assertion
						(bucketlistSaveRes.body.message).should.match('Please fill Bucketlist name');
						
						// Handle Bucketlist save error
						done(bucketlistSaveErr);
					});
			});
	});

	it('should be able to update Bucketlist instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Bucketlist
				agent.post('/bucketlists')
					.send(bucketlist)
					.expect(200)
					.end(function(bucketlistSaveErr, bucketlistSaveRes) {
						// Handle Bucketlist save error
						if (bucketlistSaveErr) done(bucketlistSaveErr);

						// Update Bucketlist name
						bucketlist.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Bucketlist
						agent.put('/bucketlists/' + bucketlistSaveRes.body._id)
							.send(bucketlist)
							.expect(200)
							.end(function(bucketlistUpdateErr, bucketlistUpdateRes) {
								// Handle Bucketlist update error
								if (bucketlistUpdateErr) done(bucketlistUpdateErr);

								// Set assertions
								(bucketlistUpdateRes.body._id).should.equal(bucketlistSaveRes.body._id);
								(bucketlistUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Bucketlists if not signed in', function(done) {
		// Create new Bucketlist model instance
		var bucketlistObj = new Bucketlist(bucketlist);

		// Save the Bucketlist
		bucketlistObj.save(function() {
			// Request Bucketlists
			request(app).get('/bucketlists')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Bucketlist if not signed in', function(done) {
		// Create new Bucketlist model instance
		var bucketlistObj = new Bucketlist(bucketlist);

		// Save the Bucketlist
		bucketlistObj.save(function() {
			request(app).get('/bucketlists/' + bucketlistObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', bucketlist.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Bucketlist instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Bucketlist
				agent.post('/bucketlists')
					.send(bucketlist)
					.expect(200)
					.end(function(bucketlistSaveErr, bucketlistSaveRes) {
						// Handle Bucketlist save error
						if (bucketlistSaveErr) done(bucketlistSaveErr);

						// Delete existing Bucketlist
						agent.delete('/bucketlists/' + bucketlistSaveRes.body._id)
							.send(bucketlist)
							.expect(200)
							.end(function(bucketlistDeleteErr, bucketlistDeleteRes) {
								// Handle Bucketlist error error
								if (bucketlistDeleteErr) done(bucketlistDeleteErr);

								// Set assertions
								(bucketlistDeleteRes.body._id).should.equal(bucketlistSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Bucketlist instance if not signed in', function(done) {
		// Set Bucketlist user 
		bucketlist.user = user;

		// Create new Bucketlist model instance
		var bucketlistObj = new Bucketlist(bucketlist);

		// Save the Bucketlist
		bucketlistObj.save(function() {
			// Try deleting Bucketlist
			request(app).delete('/bucketlists/' + bucketlistObj._id)
			.expect(401)
			.end(function(bucketlistDeleteErr, bucketlistDeleteRes) {
				// Set message assertion
				(bucketlistDeleteRes.body.message).should.match('User is not logged in');

				// Handle Bucketlist error error
				done(bucketlistDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Bucketlist.remove().exec();
		done();
	});
});