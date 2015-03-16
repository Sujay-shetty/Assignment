var appModule = angular.module('MEANCaseStudy.App',
    [
        'MEANCaseStudy.Directives',
        'MEANCaseStudy.Routes',
        'MEANCaseStudy.Infrastructure'
    ]);

appModule.run(
    function() {
        console.log('MEAN Case Study Application Initialized!');
    });

angular.element(document).ready(
    function() {
        angular.bootstrap(document, ['MEANCaseStudy.App']);
    });