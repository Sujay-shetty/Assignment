var routesModule = angular.module ( 'MEANCaseStudy.Routes',
    [
        'ngRoute',
        'MEANCaseStudy.Controllers'
    ]);

function MEANCaseStudyRouteProvider(routeService) {
    routeService.when('/Login', {
        templateUrl: 'partials/login-view.html',
        controller: 'AuthenticationController'
    });

    routeService.when('/Logout', {
        templateUrl: 'partials/login-view.html',
        controller: 'AuthenticationController'
    });

    routeService.when('/Home', {
        templateUrl: 'partials/customers.html',
        controller: 'CustomersController'
    });

    routeService.when('/NewCustomer', {
        templateUrl: 'partials/new-customer.html',
        controller: 'NewCustomersController'
    });

    routeService.otherwise({
        redirectTo: '/Login'
    });
}

routesModule.config(
    [
        '$routeProvider',
        MEANCaseStudyRouteProvider
    ]);