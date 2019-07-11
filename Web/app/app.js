'use strict';

angular.module('SiispApp', ['Core', 'Login', 'Layout', 'Researchers', 'Parametrics', 'Convocatories', 'Projects'])
    .config(function($mdThemingProvider, $stateProvider, $urlRouterProvider) {
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();
        $urlRouterProvider.otherwise("/login");
        $stateProvider
            .state('home', {
                url: "/",
                templateUrl: "researchers/index.html"
            });
    })
    .run(['$rootScope', '$state', '$stateParams', '$cookies', '$http',
        function($rootScope, $state, $stateParams, $cookies, $http) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;

            $rootScope.globals = $cookies.get('globals') || {};
            if ($rootScope.globals.currentUser) {
                $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
            }
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
                var restrictedPage = toState.name != 'login';
                var loggedIn = $rootScope.globals.currentUser;
                if (restrictedPage && !loggedIn) {
                    event.preventDefault();
                    $state.go('login');
                }
            });
        }
    ]);