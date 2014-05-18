'use strict';

/* Controllers */

angular.module('angular-client-side-auth')
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);
angular.module('angular-client-side-auth')
.controller('ProfileCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Users', function($rootScope, $scope, $location, Auth, Users) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.loadProfileDetails = function() {                
        $scope.loading = true;
        $scope.userRoles = Auth.userRoles;

        Users.getProfileDetails(function(res) {            
            if(res.success==true) {
                if(res.response.profilePicUrl.length>0) {
                    $scope.profilePicUrl=res.response.profilePicUrl;
                    $scope.name=res.response.userName;
                    $scope.specialization=res.response.collegeName;
                    //console.log($scope.profilePicUrl);
                }                
            } else {
                //not able to load profile data;
            }
            $scope.loading = false;
        }, function(err) {
            $rootScope.error = "Failed to fetch users.";
            $scope.loading = false;
        }); 
    };
}]);
angular.module('angular-client-side-auth')
.controller('FeedCtrl', ['$rootScope', '$scope', '$location', 'Auth', 'Feeds', function($rootScope, $scope, $location, Auth, Feeds) {
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    $scope.loadFeedDetails = function() {                
        $scope.loading = true;
        $scope.userRoles = Auth.userRoles;        
        Feeds.getFeedList(function(res) {            
            if(res.success==true) {
                $scope.feeds=res.response;                
                console.log($scope.feeds);
                //if(res.response.profilePicUrl.length>0) {
                    
                    //$scope.profilePicUrl=res.response.profilePicUrl;
                    //$scope.name=res.response.userName;
                    //$scope.specialization=res.response.collegeName;
                    //console.log($scope.profilePicUrl);
                //}                
            } else {
                //not able to load feed list;
            }
            $scope.loading = false;
        }, function(err) {
            $rootScope.error = "Failed to fetch users.";
            $scope.loading = false;
        }); 
    };
}]);
angular.module('angular-client-side-auth')
.controller('LoginCtrl',
['$rootScope', '$scope', '$location', '$window', 'Auth', function($rootScope, $scope, $location, $window, Auth) {

    $scope.rememberme = true;
    $scope.login = function() {
        Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberme: $scope.rememberme
            },
            function(res) {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = "Failed to login";
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
}]);

angular.module('angular-client-side-auth')
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                role: $scope.role
            },
            function() {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);

angular.module('angular-client-side-auth')
.controller('AdminCtrl',
['$rootScope', '$scope', 'Users', 'Auth', function($rootScope, $scope, Users, Auth) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;

    Users.getAll(function(res) {
        $scope.users = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });

}]);

