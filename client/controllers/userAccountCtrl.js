var app = angular.module("ecommerce");

//controller for user settings
app.controller("userAccountCtrl", ["$scope", "requests", 'Authentication', function($scope, requests, Authentication){
	$scope.passwords = {};
	$scope.user = Authentication.currentUser();
	$scope.states = ["AK","AL","AR","AZ","CA","CO","CT","DC","DE","FL","GA","GU","HI","IA","ID", "IL","IN","KS","KY","LA","MA","MD","ME","MH","MI","MN","MO","MS","MT","NC","ND","NE","NH","NJ","NM","NV","NY", "OH","OK","OR","PA","PR","PW","RI","SC","SD","TN","TX","UT","VA","VI","VT","WA","WI","WV","WY"];

	//change password
	$scope.changePassword = function(passwords){
		requests.changePassword(passwords).then(function(res){
			swal("Password Changed!", "Congrats, your password has been successfully changed!", "success");
		},
		function(err){
			console.log(err);
			swal("Error Occurred!", err, "error")
		});
	};


	//save changed user info
	$scope.saveUserInfo = function(user){
		requests.saveUserInfo(user).then(function(res){
			swal("Success", "Your user information was successfully changed", "success");
			Authentication.saveToken(res.data.token);
			$scope.user = Authentication.currentUser();
		},
		function(err){
			swal("Error", err, "error");
		});
	};


}]);