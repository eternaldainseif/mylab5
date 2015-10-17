'use strict';

//Setting up route
angular.module('bucketlists').config(['$stateProvider',
	function($stateProvider) {
		// Bucketlists state routing
		$stateProvider.
		state('listBucketlists', {
			url: '/bucketlists',
			templateUrl: 'modules/bucketlists/views/list-bucketlists.client.view.html'
		}).
		state('createBucketlist', {
			url: '/bucketlists/create',
			templateUrl: 'modules/bucketlists/views/create-bucketlist.client.view.html'
		}).
		state('viewBucketlist', {
			url: '/bucketlists/:bucketlistId',
			templateUrl: 'modules/bucketlists/views/view-bucketlist.client.view.html'
		}).
		state('editBucketlist', {
			url: '/bucketlists/:bucketlistId/edit',
			templateUrl: 'modules/bucketlists/views/edit-bucketlist.client.view.html'
		});
	}
]);