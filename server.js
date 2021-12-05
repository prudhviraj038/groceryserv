var http = require("http");
var MongoClient = require('mongodb').MongoClient;

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));

app.get('/products', function (req, res) {
//var url = "mongodb://localhost:27017/";
//MongoClient.connect(url, function(err, db) {
  //if (err) throw err;
  //var dbo = db.db("testdb");
  //dbo.collection("products").find({}).toArray(function(err, result) {
    //if (err) throw err;
    //console.log(result);
    //res.end(JSON.stringify(result));
    //db.close();
  //});
//});
})
app.listen(80);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');

//admin-admindbtest


