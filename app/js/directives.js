var directivesModule = angular.module('MEANCaseStudy.Directives',
    [
        'MEANCaseStudy.Configurations'
    ]);

function MEANCaseStudyHeader(appHeaderUrl) {
    return {
        templateUrl: appHeaderUrl,
        restrict: 'AE'
    };
}

function MEANCaseStudyFooter(appFooterUrl) {
    return {
        templateUrl: appFooterUrl,
        restrict: 'AE'
    };
}

function CustomerProfileViewer(customerViewerUrl) {
    return {
        templateUrl: customerViewerUrl,
        restrict: 'E',
        scope: {
            profile: '='
        },
        link: function(scope, element, attributes) {
            scope.$watch("profile",
                function(newValue, oldValue, model) {
                    if(newValue) {
                        scope.imageUrl = 'img/' + newValue.id + '.jpg';
                    }
                });
        }
    };
}

directivesModule.directive('meanCaseStudyHeader',
    [
        'appHeaderUrl',
        MEANCaseStudyHeader
    ]);

directivesModule.directive('meanCaseStudyFooter',
    [
        'appFooterUrl',
        MEANCaseStudyFooter
    ]);

directivesModule.directive('customerProfileViewer',
    [
        'customerViewerUrl',
        CustomerProfileViewer
    ]);