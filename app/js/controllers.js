var controllersModule = angular.module ( 'MEANCaseStudy.Controllers',
    [
        'MEANCaseStudy.Services'
    ]);

function CustomersController(rootModel, viewModel, logService, customerService, webSocketUrl) {
    viewModel.editingData = [];
    if(customerService) {
        customerService.getAllCustomers().then(
            function (data) {
                viewModel.customers = data;
                console.log("logged User : ",rootModel.loggedUser);
                if(viewModel.loggedUser === 'caller'){
                    var tableContent = document.getElementById('mainTable');
                    var cells = tableContent.find("th, td").filter(":nth-child(" + 3 + ")");
                    cells.hide();
                    console.log("print : ", tableContent);

                }
                for (var i = 0, length = viewModel.customers.length; i < length; i++) {
                    viewModel.editingData[viewModel.customers[i].id] = false;
                    /*var col = 3;
                    //col = parseInt(col, 10);
                    //col = col - 1;
                    for (var i = 0; i < tableContent.rows.length; i++) {
                        for (var j = 0; j < tableContent.rows[i].cells.length; j++) {
                            tableContent.rows[i].cells[j].style.display = "";
                            if (j == col)
                                tableContent.rows[i].cells[j].style.display = "none";
                        }
                    }*/
                }
            },
            function (error) {
                viewModel.errorMessage = error.toString();
            });
    }
    viewModel.modify = function(customer){
        viewModel.editingData[customer.id] = true;
    };
    viewModel.loadDetails = function(id) {
        if(id && customerService) {
            customerService.getCustomerDetails(id).then(
                function(details) {
                    viewModel.details = details;
                },
                function(error) {
                    viewModel.errorMessage = error.toString();
                });
        }
    };

    viewModel.updateDetails = function(customer) {
        if(customerService) {
            viewModel.editingData[customer.id] = false;
            customerService.updateCustomer(customer).then(
                function(details) {
                    viewModel.details = details;
                },
                function(error) {
                    viewModel.errorMessage = error.toString();
                });
        }
    };

    viewModel.deleteDetails = function(id) {
        if(id && customerService) {
            customerService.deleteCustomer(id).then(
                function(details) {
                    viewModel.details = details;
                },
                function(error) {
                    viewModel.errorMessage = error.toString();
                });
        }
    };

    var socketClient = io.connect(webSocketUrl);

    socketClient.on('NewCustomerRecord',
        function(data) {
            if(data) {
                viewModel.$apply(function() {
                    viewModel.customers.push(data);
                });
            }
        });
    socketClient.on('UpdatedCustomerRecord',
        function(data) {
            if(data) {
                viewModel.$apply(function() {
                    viewModel.customers.push(data);
                });
            }
        });
    socketClient.on('deletedCustomerRecord',
        function(data) {
            if(data) {
                viewModel.$apply(function() {
                    viewModel.customers.splice(data.id);
                });
            }
        });

    logService.info("Customers Controller Initialization with WS Completed!");
}

function NewCustomersController(viewModel, exceptionHandler, customerService) {
    var MIN_NUMBER = 1;
    var MAX_NUMBER = 50000;

    function generateId() {
        return Math.floor(
            Math.random() * (MAX_NUMBER - MIN_NUMBER) + MIN_NUMBER);
    }

    viewModel.newCustomer = {
        id: generateId()
    };
    viewModel.status = false;
    viewModel.saveCustomer = function(newCustomer) {
        var validationStatus = newCustomer && customerService &&
            viewModel.customerForm.$valid;

        if(validationStatus) {
            customerService.save(newCustomer).then(
                function(savedCustomerRecord) {
                    viewModel.status =
                        "Customer Record Successfully Processed!";
                },
                function(error) {
                    viewModel.errorMessage = error.toString();

                    exceptionHandler(error.toString(), "Controller Processing");
                });
        } else throw new Error("Invalid Input Details Specified!");
    }
    viewModel.phoneExpression = /^\d{10}$/;
}

function AuthenticationController(
    rootModel, viewModel, globalViewModel, userAgent, httpService, authUrl) {

    globalViewModel.authenticationStatus = false;

    viewModel.login = function(userName, password) {

        delete userAgent.localStorage.token;

        httpService.post(authUrl, {
            username: userName,
            password: password
        }).success(function(status) {
            if(status) {
                userAgent.localStorage.token = status.token;
                rootModel.loggedUser = userName;
                if(userName == 'caller') {
                    var newCustomerContent = document.getElementById('newCustomer');console.log("im here .... ");
                    newCustomerContent.style.display = 'none';
                }
                globalViewModel.authenticationStatus = true;
                //location.path("#/Home");
            }
        }).error(function(message) {
            globalViewModel.authenticationStatus = false;
            viewModel.message = "Login Failed";
        });
    };

    viewModel.logout = function() {
        delete userAgent.localStorage.token;
        globalViewModel.authenticationStatus = false;
    };
}

controllersModule.controller('CustomersController',
    [
        '$rootScope',
        '$scope',
        '$log',
        'CustomerService',
        'webSocketUrl',
        CustomersController
    ]);

controllersModule.controller('NewCustomersController',
    [
        '$scope',
        '$exceptionHandler',
        'CustomerService',
        NewCustomersController
    ]);

controllersModule.controller('AuthenticationController',
    [
        '$rootScope',
        '$scope',
        '$rootScope',
        '$window',
        '$http',
        'authenticationUrl',
        AuthenticationController
    ])