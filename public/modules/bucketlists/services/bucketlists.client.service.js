'use strict';

//Bucketlists service used to communicate Bucketlists REST endpoints
angular.module('bucketlists').factory('Bucketlists', ['$resource',
	function($resource) {
		return $resource('bucketlists/:bucketlistId', { bucketlistId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);