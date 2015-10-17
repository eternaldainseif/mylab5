'use strict';

(function() {
	// Bucketlists Controller Spec
	describe('Bucketlists Controller Tests', function() {
		// Initialize global variables
		var BucketlistsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Bucketlists controller.
			BucketlistsController = $controller('BucketlistsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Bucketlist object fetched from XHR', inject(function(Bucketlists) {
			// Create sample Bucketlist using the Bucketlists service
			var sampleBucketlist = new Bucketlists({
				name: 'New Bucketlist'
			});

			// Create a sample Bucketlists array that includes the new Bucketlist
			var sampleBucketlists = [sampleBucketlist];

			// Set GET response
			$httpBackend.expectGET('bucketlists').respond(sampleBucketlists);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.bucketlists).toEqualData(sampleBucketlists);
		}));

		it('$scope.findOne() should create an array with one Bucketlist object fetched from XHR using a bucketlistId URL parameter', inject(function(Bucketlists) {
			// Define a sample Bucketlist object
			var sampleBucketlist = new Bucketlists({
				name: 'New Bucketlist'
			});

			// Set the URL parameter
			$stateParams.bucketlistId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/bucketlists\/([0-9a-fA-F]{24})$/).respond(sampleBucketlist);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.bucketlist).toEqualData(sampleBucketlist);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Bucketlists) {
			// Create a sample Bucketlist object
			var sampleBucketlistPostData = new Bucketlists({
				name: 'New Bucketlist'
			});

			// Create a sample Bucketlist response
			var sampleBucketlistResponse = new Bucketlists({
				_id: '525cf20451979dea2c000001',
				name: 'New Bucketlist'
			});

			// Fixture mock form input values
			scope.name = 'New Bucketlist';

			// Set POST response
			$httpBackend.expectPOST('bucketlists', sampleBucketlistPostData).respond(sampleBucketlistResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Bucketlist was created
			expect($location.path()).toBe('/bucketlists/' + sampleBucketlistResponse._id);
		}));

		it('$scope.update() should update a valid Bucketlist', inject(function(Bucketlists) {
			// Define a sample Bucketlist put data
			var sampleBucketlistPutData = new Bucketlists({
				_id: '525cf20451979dea2c000001',
				name: 'New Bucketlist'
			});

			// Mock Bucketlist in scope
			scope.bucketlist = sampleBucketlistPutData;

			// Set PUT response
			$httpBackend.expectPUT(/bucketlists\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/bucketlists/' + sampleBucketlistPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid bucketlistId and remove the Bucketlist from the scope', inject(function(Bucketlists) {
			// Create new Bucketlist object
			var sampleBucketlist = new Bucketlists({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Bucketlists array and include the Bucketlist
			scope.bucketlists = [sampleBucketlist];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/bucketlists\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleBucketlist);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.bucketlists.length).toBe(0);
		}));
	});
}());