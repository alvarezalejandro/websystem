'use strict';

angular.module('Core').factory('authenticationService', ['$http', '$cookies', '$rootScope', '$timeout', 'userService',
    function ($http, $cookies, $rootScope, $timeout, userService) {
        return {
            login: function (username, password, onSuccess, onError) {
                $timeout(function () {
                    userService.login(username, password)
                        .then(onSuccess)
                        .catch(onError);
                }, 1000);
            },
            setCredentials: function (username, password) {
                var authdata = Base64.encode(username + ':' + password);
                $rootScope.globals = {
                    currentUser: {
                        username: username,
                        authdata: authdata
                    }
                };
                $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
                $cookies.put('globals', $rootScope.globals);
            },
            clearCredentials: function () {
                $rootScope.globals = {};
                $cookies.remove('globals');
                $http.defaults.headers.common.Authorization = 'Basic';
            },
            logout: function () {
                var self = this;
                self.clearCredentials();
            },
            isAuthenticated: function () {
                var currentUser = $rootScope.globals.currentUser;
                return (currentUser != null);
            },
            getCurrentUsername: function () {
                var currentUser = $rootScope.globals.currentUser;
                return (currentUser != null && currentUser.username) ? currentUser.username : '';
            }
        }
    }
]);