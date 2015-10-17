'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Bucketlist Schema
 */
var BucketlistSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Bucketlist name',
		trim: true
	},
	content: {
		type: String,
		default: '',
		required: 'Please fill Bucketlist description',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Bucketlist', BucketlistSchema);
