'use strict';

// Bucketlists controller
angular.module('bucketlists').controller('BucketlistsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Bucketlists',
	function($scope, $stateParams, $location, Authentication, Bucketlists) {
		$scope.authentication = Authentication;

		// Create new Bucketlist
		$scope.create = function() {
			// Create new Bucketlist object
			var bucketlist = new Bucketlists ({
				name: this.name,
				content: this.content
			});

			// Redirect after save
			bucketlist.$save(function(response) {
				$location.path('bucketlists/' + response._id);

				// Clear form fields
				$scope.name = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Bucketlist
		$scope.remove = function(bucketlist) {
			if ( bucketlist ) { 
				bucketlist.$remove();

				for (var i in $scope.bucketlists) {
					if ($scope.bucketlists [i] === bucketlist) {
						$scope.bucketlists.splice(i, 1);
					}
				}
			} else {
				$scope.bucketlist.$remove(function() {
					$location.path('bucketlists');
				});
			}
		};

		// Update existing Bucketlist
		$scope.update = function() {
			var bucketlist = $scope.bucketlist;

			bucketlist.$update(function() {
				$location.path('bucketlists/' + bucketlist._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Bucketlists
		$scope.find = function() {
			$scope.bucketlists = Bucketlists.query();
		};

		// Find existing Bucketlist
		$scope.findOne = function() {
			$scope.bucketlist = Bucketlists.get({ 
				bucketlistId: $stateParams.bucketlistId
			});
		};
	}
]);
