var http = require("http");
var MongoClient = require('mongodb').MongoClient;

var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
console.log('Server running at http://127.0.0.1:8081/');

app.get('/products', function (req, res) {
var url = process.env.MONGODB_URI;
    res.end('hello');


//MongoClient.connect(url, function(err, db) {
//  if (err) throw err;
//  var dbo = db.db("groceryapp");
//  dbo.collection("products").find({}).toArray(function(err, result) {
//    if (err) throw err;
//    console.log(result);
//    res.end(JSON.stringify(result));
//    db.close();
//  });
//});
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if(err) throw err;
    console.log("%c Server running", "color: green");
});
// Console will print the message

//admin-admindbtest


