var infrastructureModule = angular.module(
    'MEANCaseStudy.Infrastructure', []);

//infrastructureModule.factory('$exceptionHandler',
//    function() {
//            return function(exception, cause) {
//                console.log('Exception Handled At Global ... ' +
//                exception + ', Cause : ' + cause);
//            };
//        });

infrastructureModule.factory('$log',
    function() {
        var logService = {
            info: function (message) {
                console.info(message);
            },
            warning: function (message) {
                console.warn(message);
            },
            error: function (message) {
                console.error(message)
            }
        };

        return logService;
    });

infrastructureModule.factory('schneiderHttpInterceptor',
    function($q, $window) {
        var interceptor = {
            request: function(config) {
                config.headers = config.headers || {};

                if($window.localStorage.token) {
                    config.headers.Authorization = "Bearer " +
                        $window.localStorage.token;
                }

                return config;
            },
            responseError: function(rejection) {
                if(rejection.status == 401) {
                    return $q.reject("Authorization Failed!");
                }

                return $q.reject(rejection);
            }
        };

        return interceptor;
    });

infrastructureModule.config(
    [
        '$httpProvider',
        function($httpProvider) {
            $httpProvider.interceptors.push('schneiderHttpInterceptor');
        }
    ]);