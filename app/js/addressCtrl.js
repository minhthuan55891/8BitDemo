(function(){
	'use strict';

	module.exports = function ($scope, $firebaseArray, API) {

		require ('firebase');

		var console = window.console;

		console.log('Address Controller Loaded..');
	    var ref = new Firebase(API);

	    $scope.addressList = $firebaseArray(ref);

	    $scope.addAddress = function() {
	        console.log('Adding address');
	        $scope.addressList.$add({
	            street: $scope.street,
	            ward: $scope.ward,
	            district: $scope.district,
	            city: $scope.city,
	            country: $scope.country
	        }).then(function(ref){
	            var id = ref.key();
	            console.log('Added address ' + id);
	            $scope.street = '';
	            $scope.ward = '';
	            $scope.district = '';
	            $scope.city = '';
	            $scope.country = '';
	        });
	    };

	    $scope.editAddress = function() {
	        var id = $scope.id;
	        var record = $scope.addressList.$getRecord(id);

	        record.street = $scope.street;
	        record.ward = $scope.ward;
	        record.district = $scope.district;
	        record.city = $scope.city;
	        record.country = $scope.country;

	        $scope.addressList.$save(record).then(function(ref){
	            console.log(ref.key);

	            $scope.street = '';
	            $scope.ward = '';
	            $scope.district = '';
	            $scope.city = '';
	            $scope.country = '';

				$scope.showAddNewForm();
	        });
	    };

	    $scope.removeAddress = function(address) {
	        $scope.addressList.$remove(address);
	    };

	    $scope.addFormShow = true;
	    $scope.editFormShow = false;

	    $scope.showEditForm = function(address) {
	        $scope.addFormShow = false;
	        $scope.editFormShow = true;
			$scope.id = address.$id;
	        $scope.street = address.street;
	        $scope.ward = address.ward;
	        $scope.district = address.district;
	        $scope.city = address.city;
	        $scope.country = address.country;
	    };

		$scope.showAddNewForm = function(address) {
		   $scope.addFormShow = true;
		   $scope.editFormShow = false;
		   resetData();
	   };
	};
})();
