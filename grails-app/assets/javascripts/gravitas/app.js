var gravitasApp = angular.module('gravitasApp', [
    'http-auth-interceptor',
    'ngRoute',
    'ui.bootstrap',
    'events',
    'login',
]);

gravitasApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/myEvents', {
                templateUrl: 'partials/event-list.html',
                controller: 'listEventsController'
            }).
            when('/myEvents/create', {
                templateUrl: 'partials/event-form.html',
                controller: 'createEventController'
            }).
            when('/myEvents/:eventId', {
                templateUrl: 'partials/event-form.html',
                controller: 'editEventController'
            }).
            otherwise({
                redirectTo: '/myEvents'
            });
    }]);

gravitasApp.directive('confirmationNeeded', function () {
    return {
        priority: 1,
        terminal: true,
        link: function (scope, element, attrs) {
            var msg = attrs.confirmationNeeded || "Are you sure?";
            var clickAction = attrs.ngClick;
            element.bind('click', function () {
                if ( window.confirm(msg) ) {
                    scope.$eval(clickAction)
                }
            });
        }
    };
});

gravitasApp.directive('showLogin', function() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {
            var login = element.find('#login-holder');
            var loginError = element.find('#login-error');
            var main = element.find('#content');
            var username = element.find('#username');
            var password = element.find('#password');

            login.hide();
            loginError.hide();

            scope.$on('event:auth-loginRequired', function() {
                console.log('showing login form');
                main.hide();
                username.val('');
                password.val('');
                login.show();
            });
            scope.$on('event:auth-loginFailed', function() {
                console.log('showing login error message');
                username.val('');
                password.val('');
                loginError.show();
            });
            scope.$on('event:auth-loginConfirmed', function() {
                console.log('hiding login form');
                main.show();
                login.hide();
                username.val('');
                password.val('');
            });
        }
    }
});

function getLocalToken() {
   return localStorage["authToken"];
}

function getHttpConfig() {
    return {
        headers: {
            'X-Auth-Token': getLocalToken()
        }
    };
}

function getAuthenticateHttpConfig() {
    return {
        ignoreAuthModule: true
    };
}

console.log('gravitas app load complete');