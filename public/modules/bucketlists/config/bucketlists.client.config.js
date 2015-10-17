'use strict';

// Configuring the Articles module
angular.module('bucketlists').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Bucketlists', 'bucketlists', 'dropdown', '/bucketlists(/create)?');
		Menus.addSubMenuItem('topbar', 'bucketlists', 'List Bucketlists', 'bucketlists');
		Menus.addSubMenuItem('topbar', 'bucketlists', 'New Bucketlist', 'bucketlists/create');
	}
]);