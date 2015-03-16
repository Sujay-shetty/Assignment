var servicesModule = angular.module('MEANCaseStudy.Services',
    [
        'ngResource',
        'MEANCaseStudy.Configurations'
    ]);

function CustomerService(restService, restUrl, restDeleteUrl, restUpdateUrl) {
    var customerRESTService = restService(restUrl, {}, {
        addNew: {
            method: 'POST'
        }
    });

    var customerRESTDeleteService = restService(restDeleteUrl, {}, {
        deleteCustomerRecord: {
            method: 'DELETE'
        }
    });
    var customerRESTUpdateService = restService(restUpdateUrl, {}, {
        updateCustomerRecord: {
            method: 'POST'
        }
    });

    var service = {
        getAllCustomers: function() {
            return customerRESTService.query().$promise;
        },
        getCustomerDetails: function(id) {
            return customerRESTService.get({
                customerId: id
            }).$promise;
        },
        save: function(customerRecord) {
            return customerRESTService.addNew(
                customerRecord).$promise;
        },
        deleteCustomer: function(id) {
            return customerRESTDeleteService.get({
                customerId: id
            }).$promise;
        },
        updateCustomer: function(updateCustomerRecord) {
            return customerRESTUpdateService.updateCustomerRecord(updateCustomerRecord).$promise;
        }
    };

    return service;
}

servicesModule.factory('CustomerService',
    [
        '$resource',
        'restUrl',
        'restDeleteUrl',
        'restUpdateUrl',
        CustomerService
    ]);