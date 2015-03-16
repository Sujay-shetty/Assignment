var mysqlMod = require("mysql");
//var dbClient = require('mongodb').MongoClient;

function CustomerInfoProvider() {
    /*this.mongoServerUrl = 'mongodb://localhost:27017';
    this.dbName = 'crmsystem';
    this.collectionName = 'customers';*/
    this.connection = null;
    this.db = 'assignment';
    this.host = 'localhost';
    this.user = 'root';
    this.password = '';
    this.CreateConnection(function(err,res){
        if(err){
            console.log("error in connecting to db...");
            process.exit(1);
        }
        else{
            console.log("connected to Db...");
            //process.exit(0);
        }
    })
}

//MySql Connection management.
CustomerInfoProvider.prototype.CreateConnection = function(callback)
{
    var mysqlInfo = this.CreateMySQLInfo();
    this.connection = mysqlMod.createConnection(mysqlInfo);
    this.ConnectToDB(callback);
    //return this.connection;
}

CustomerInfoProvider.prototype.CreateMySQLInfo = function()
{
    var db = this.db;
    var mysqlInfo={};
    if(db!=null && db!=undefined) {
        mysqlInfo = {
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.db,
            multipleStatements: true
        }
    } else {
        mysqlInfo = {
            host: this.host,
            user: this.user,
            password: this.password,
            multipleStatements: true
        }
    }
    return mysqlInfo;
}

CustomerInfoProvider.prototype.ConnectToDB = function(callback)
{
    var self = this.connection;
    self.connect(function(err) {
        if (err) {
            console.error("Oops !!! Life sucks ! ;( Error connecting, Stack: " + err.stack);
            if(callback!=undefined || callback!=null)
                callback(err,null);
        }
        console.log("Connected to mySQL Admin DB !!! Thread ID : " + self.threadId);
        if(callback!=undefined || callback!=null)
            callback(null,self);//callback(null,connection);
    });
}

CustomerInfoProvider.prototype.CloseDB = function(callback)
{
    console.log("Closing mysql connection...");
    this.connection.end(function(err){
        if(err!=undefined)
        {
            console.error("Oops !!! Life sucks ! ;( Error : " + err);
            console.log("Exiting anyways... Bye !");
        }
        else
            console.log("Connection closed... Bye !");
    });
    if(callback!=undefined || callback!=null)
        callback();
}

CustomerInfoProvider.prototype.getCustomers = function(callback) {
    var self = this;
    var query = "select * from customer_info";
    this.connection.query(query, function(err, rows) {
        if(err!=undefined)
        {
            console.error("Oops !!! Life sucks ! ;( Error : " + err);
            throw err;
            /*if(callback!=undefined || callback!=null)
                callback(err,null);*/
        }
        else
        {
            if(callback!=undefined || callback!=null)
                callback(rows);
        }
        //self.CloseDB();
    });
};

CustomerInfoProvider.prototype.getCustomer = function(id, callback) {
    var self = this;
    var query = "select * from customer_info where id="+parseInt(id);
    this.connection.query(query, function(err, rows) {
        if(err!=undefined)
        {
            console.error("Oops !!! Life sucks ! ;( Error : " + err);
            throw err;
        }
        else
        {
            if(callback!=undefined || callback!=null)
                callback(rows[0]);
        }
        //self.CloseDB();
    });
};

CustomerInfoProvider.prototype.addCustomer = function(customer, callback) {
    //console.log("Customer status : ",customer);
    var insertArray = [];
    var internalArr = [];
    internalArr.push(customer.id);
    internalArr.push(customer.name);
    internalArr.push(customer.address);
    internalArr.push(customer.credit);
    internalArr.push(customer.status);
    insertArray.push(internalArr);
    var self = this;
    var query = "insert into customer_info (id,name,address,credit,status) values ?";
    this.connection.query(query, [insertArray], function(err, rows) {
        if(err!=undefined)
        {
            console.error("Oops !!! Life sucks ! ;( Error : " + err);
            throw err;
            /*if(callback!=undefined || callback!=null)
             callback(err,null);*/
        }
        else
        {
            if(callback!=undefined || callback!=null)
                callback(rows);
        }
        //self.CloseDB();
    });
};

CustomerInfoProvider.prototype.deleteCustomer = function(id,callback) {
    var self = this;
    var query = "delete from customer_info where id="+id;
    this.connection.query(query, function(err, rows) {
        if(err!=undefined)
        {
            console.error("Oops !!! Life sucks ! ;( Error : " + err);
            throw err;
        }
        else
        {
            if(callback!=undefined || callback!=null)
                callback(rows);
        }
    });
};

CustomerInfoProvider.prototype.updateCustomer = function(customer,callback) {
    var self = this;
    var query = "update customer_info set name = '"+customer.name+"' , address = '"+customer.address+"' where id = "+customer.id;
    //console.log("update query : ",query);
    this.connection.query(query, function(err, rows) {
        if(err!=undefined)
        {
            console.error("Oops !!! Life sucks ! ;( Error : " + err);
            throw err;
        }
        else
        {
            if(callback!=undefined || callback!=null)
                callback(rows);
        }
    });
};

module.exports = CustomerInfoProvider;