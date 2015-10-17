'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var bucketlists = require('../../app/controllers/bucketlists.server.controller');

	// Bucketlists Routes
	app.route('/bucketlists')
		.get(bucketlists.list)
		.post(users.requiresLogin, bucketlists.create);

	app.route('/bucketlists/:bucketlistId')
		.get(bucketlists.read)
		.put(users.requiresLogin, bucketlists.hasAuthorization, bucketlists.update)
		.delete(users.requiresLogin, bucketlists.hasAuthorization, bucketlists.delete);

	// Finish by binding the Bucketlist middleware
	app.param('bucketlistId', bucketlists.bucketlistByID);
};
