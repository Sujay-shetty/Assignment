var os = require('os');
var http = require('http');
var express = require('express');
var bodyparser = require('body-parser');
var util = require('util');
var socketio = require('socket.io');
var expressjwt = require('express-jwt');
var jwt = require('jsonwebtoken');

var CustomerInfoProvider = require('./DataProvider');

var portNumber = process.env.PORT_NUMBER || 9090;
var customerInfoProvider = new CustomerInfoProvider();
var router = new express.Router();
var globalSecretKey = "Schneider Electric, Bangalore 560025";

router.get('/api/customers', function(request, response) {
    customerInfoProvider.getCustomers(
        function(results) {
            response.json(results);
        });
});
router.get('/api/customers/:customerId', function(request, response) {
    var customerId = request.params.customerId;

    customerInfoProvider.getCustomer(customerId,
        function(customerRecord) {
            response.json(customerRecord);
        });
});
router.post('/api/customers', function(request, response) {
    var customer = request.body;

    customerInfoProvider.addCustomer(customer,
        function(result) {
            var addedRecord = result[0];
            sioimpl.sockets.emit('NewCustomerRecord', addedRecord);
            response.json(addedRecord);
        });
});
router.get('/api/deleteCustomer/:customerId', function(request, response) {
    var customerId = request.params.customerId;

    customerInfoProvider.deleteCustomer(customerId,
        function(result) {
            var deletedRecord = result[0];
            sioimpl.sockets.emit('deletedCustomerRecord', deletedRecord);
            response.json(deletedRecord);
    });
});
router.post('/api/updateCustomer', function(request, response) {
    var customer = request.body;

    customerInfoProvider.updateCustomer(customer,
        function(result) {
            var updatedRecord = result[0];
            sioimpl.sockets.emit('UpdatedCustomerRecord', updatedRecord);
            response.json(updatedRecord);
        });
});
router.post('/authenticate',
    function(request, response) {
        var username = request.body.username;
        var password = request.body.password;
        var users= {"master":"master","caller":"caller"};
        var validation = username === username &&
            password === users[username];

        if(!validation) {
            response.status(401).send(
                "Authorization Failed / Invalid Credentials Specified!");

            return;
        }

        var profile = {
            id: 1,
            name: 'ValidUser',
            email: 'info@assignment.com'
        };

        var encryptedToken = jwt.sign(profile, globalSecretKey, {
            expiresInMinutes: 10
        });

        response.json({
            token: encryptedToken
        });
    });

var app = new express();
var server = http.createServer(app);
var sioimpl = socketio.listen(server);

sioimpl.sockets.on('connection', function(socketClient) {
    console.log('Web Socket Client Connected!');

    socketClient.on('disconnect',
        function() {
            console.log('Web Socket Client Disconnected!');
        });
});

app.use(function(request, response, next) {
    response.header('Access-Control-Allow-Credentials', 'true');
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', '*');
    response.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    next();
});

app.use('/api/customers', expressjwt({
    secret: globalSecretKey
}));

app.use(bodyparser.json());
app.use('/', router);

server.listen(portNumber);

var message = util.format(
    "REST Service is on .. http://%s:%d/api/customers",
    os.hostname(), portNumber);

console.log(message);