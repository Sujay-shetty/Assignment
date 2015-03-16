var configurationModule = angular.module('MEANCaseStudy.Configurations', []);

configurationModule.constant('appHeaderUrl', 'partials/header.html');
configurationModule.constant('appFooterUrl', 'partials/footer.html');
configurationModule.constant('customerViewerUrl',
    'partials/customer-viewer.html');

configurationModule.constant('restUrl',
    'http://localhost:9090/api/customers/:customerId');
configurationModule.constant('restDeleteUrl',
    'http://localhost:9090/api/deleteCustomer/:customerId');
configurationModule.constant('restUpdateUrl',
    'http://localhost:9090/api/updateCustomer');
configurationModule.constant('webSocketUrl',
    'http://localhost:9090');

configurationModule.constant('authenticationUrl',
    'http://localhost:9090/authenticate');