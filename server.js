var http = require("http");
var MongoClient = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var Razorpay = require('razorpay')

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
console.log('Server running at http://127.0.0.1:8081/');


app.get('/banners', function (req, res) {
  var url = process.env.MONGODB_URI;    
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("groceryapp");
    dbo.collection("banners").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
      db.close();
    });
  });
})

app.get('/categories', function (req, res) {
  var url = process.env.MONGODB_URI;    
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("groceryapp");
    dbo.collection("categories").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
      db.close();
    });
  });
})

app.get('/products', function (req, res) {
var url = process.env.MONGODB_URI;
    var id = req.query.id;
    if(id){
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("groceryapp");

            dbo.collection("products").aggregate([
              {
            $lookup: {
                    from: "kart",
                    pipeline: [
                      { $match: { "user_id": id } }
                   ],
                    localField: "id",
                    foreignField: "product_id",
                    as: "kart_details"
                } 
              }
          ]).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.end(JSON.stringify(result));
            db.close();
          });
        });
        
    }
    else{ 
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("groceryapp");
  dbo.collection("products").find({}).toArray(function(err, result) {
    if (err) throw err;
    console.log(result);
    res.end(JSON.stringify(result));
    db.close();
  });
});
    }
})

app.get('/users', function (req, res) {
  var url = process.env.MONGODB_URI;
      var id = req.query.id;
      if(id){
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("groceryapp");
              dbo.collection("users").find({"id": mongodb.ObjectId(id)}).toArray(function(err, result) {
              if (err) throw err;
              console.log(result);
              res.end(JSON.stringify(result));
              db.close();
            });
          });
          
      }
      else{
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("groceryapp");
    dbo.collection("users").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.end(JSON.stringify(result));
      db.close();
    });
  });
      }
  })
app.get('/kart', function (req, res) {
var url = process.env.MONGODB_URI;
    var id = req.query.id;
    var user_id = req.query.user_id;
    if(id){
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("groceryapp");
            dbo.collection("kart").find({"id": parseInt(id)}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.end(JSON.stringify(result));
            db.close();
          });
        });
        
    }else if(user_id){
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("groceryapp");
          dbo.collection("kart").aggregate([
            {
           $match: {
            "user_id": user_id
           } 
          },{
          $lookup: {
                  from: "products",
                  localField: "product_id",
                  foreignField: "id",
                  as: "product_details"
              } 
            }
        ]).toArray(function(err, result) {
          if (err) throw err;
          console.log(result);
          res.end(JSON.stringify(result));
          db.close();
        });
      });
      
  } else{
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("groceryapp");
  dbo.collection("kart").find({}).toArray(function(err, result) {
  if (err) throw err;
  console.log(result);
  res.end(JSON.stringify(result));
  db.close();
});
});
    }
})

app.post('/kart/add', function (req, res) {
var quser_id = req.body.user_id;
var qproduct_id = req.body.product_id;
var qqty = req.body.qty;

var url = process.env.MONGODB_URI;
    if(true){
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("groceryapp");
            var myobj = { product_id: qproduct_id, user_id: quser_id, qty: qqty };
            dbo.collection("kart").insertOne(myobj,function(err, result) {
            if (err) throw err;
            console.log(result);
            res.end(JSON.stringify(result));
            db.close();
          });
        });
        
    }
})

app.post('/kart/delete', function (req, res) {
  var q_id = req.body._id;
  var url = process.env.MONGODB_URI;
  var myobj = { _id: new mongodb.ObjectId(q_id)};
      if(true){
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("groceryapp");
              dbo.collection("kart").deleteOne(myobj,function(err, result) {
              if (err) throw err;
              res.end(JSON.stringify(result));
              db.close();
            });
          });         
      }
  })

  app.post('/kart/update', function (req, res) {
    //var q_id = req.body._id;
    var url = process.env.MONGODB_URI;
    //var myobj = { _id: new mongodb.ObjectId(q_id)};
        if(true){
            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("groceryapp");
                dbo.collection("kart").updateOne({product_id:req.body.product_id,user_id:req.body.user_id},{ $set:{qty:req.body.qty}},function(err, result) {
                if (err) throw err;
                res.end(JSON.stringify(result));
                db.close();
              });
            });         
        }
    })
app.get('/orders', function (req, res) {
    var url = process.env.MONGODB_URI;
        var id = req.query.id;
        var user_id = req.query.user_id;
        if(id){
            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("groceryapp");
                dbo.collection("orders").find({"_id": mongodb.ObjectId(id)}).toArray(function(err, result) {
                if (err) throw err;
                console.log(result);
                res.end(JSON.stringify(result));
                db.close();
              });
            });
            
        }else if(user_id){
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("groceryapp");
              dbo.collection("orders").find({"user_id": user_id}).toArray(function(err, result) {
              if (err) throw err;
              console.log(result);
              res.end(JSON.stringify(result));
              db.close();
            });
          });
        }
        else{
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("groceryapp");
      dbo.collection("orders").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        res.end(JSON.stringify(result));
        db.close();
      });
    });
        }
  })
    
  app.post('/orders/add', function (req, res) {
    var quser_id = req.body.user_id;
    var qproducts = req.body.products;
    var qprice = req.body.price;
    var address_id = req.body.address_id;

    var url = process.env.MONGODB_URI;
        if(true){
            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("groceryapp");
                var myobj = { products: qproducts, user_id: quser_id, price: qprice, address_id:address_id };
                dbo.collection("orders").insertOne(myobj,function(err, result) {
                if (err) throw err;
                console.log(result);
                res.end(JSON.stringify(result));
                db.close();
              });
            });
            
        }
    })


  app.post('/orders/test', function (req, res) {
    var price = req.body.price;

    console.log(req.body);

    var instance = new Razorpay({ key_id:'rzp_live_Jb39VzSTksL2aU', key_secret:'3C19y3YhhUbbD2bmaz6r6Sdi'})

    instance.orders.create({
      amount: price*100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        key1: "value3",
        key2: "value2"
      }
    })
    .then(response => {
      res.end(JSON.stringify(response));
    })
    .catch(error => {
      res.end(JSON.stringify(error));
    });

  })

app.post('/users/add', function (req, res) {
     
      console.log(req.body);
  
      var url = process.env.MONGODB_URI;
          if(true){
              MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("groceryapp");
                  var myobj = req.body;
                  dbo.collection("users").insertOne(myobj,function(err, result) {
                  if (err) throw err;
                  console.log(result);
                  res.end(JSON.stringify(result));
                  db.close();
                });
              });
              
          }
  })
  
app.post('/users/login', function (req, res) {
     
        console.log(req.body);
    
        var url = process.env.MONGODB_URI;
            if(true){
                MongoClient.connect(url, function(err, db) {
                  if (err) throw err;
                  var dbo = db.db("groceryapp");
                    var myobj = req.body;
                    dbo.collection("users").findOne(myobj,function(err, result) {
                    if (err) throw err;
                    console.log(result);
                    res.end(JSON.stringify(result));
                    db.close();
                  });
                });
                
            }
        })

app.get('/address', function (req, res) {
var url = process.env.MONGODB_URI;
    var id = req.query.id;
    if(id){
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("groceryapp");
            dbo.collection("address").find({"_id": mongodb.ObjectId(id)}).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            res.end(JSON.stringify(result));
            db.close();
          });
        });
        
    }
    else{
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("groceryapp");
  dbo.collection("address").find({}).toArray(function(err, result) {
  if (err) throw err;
  console.log(result);
  res.end(JSON.stringify(result));
  db.close();
});
  // dbo.collection("kart").find({}).toArray(function(err, result) {
  //   if (err) throw err;
  //   console.log(result);
  //   res.end(JSON.stringify(result));
  //   db.close();
  // });
});
    }
})

app.post('/address/add', function (req, res) {
var quser_id = req.body.user_id;
var qproduct_id = req.body.product_id;
var qqty = req.body.qty;

var url = process.env.MONGODB_URI;
    if(true){
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("groceryapp");
           // var myobj = { product_id: qproduct_id, user_id: quser_id, qty: qqty };
             var myobj = req.body;
             console.log(JSON.stringify(myobj));
            dbo.collection("address").insertOne(myobj,function(err, result) {
            if (err) throw err;
            console.log(result);
            res.end(JSON.stringify(result));
            db.close();
          });
        });
        
    }
})

app.post('/address/delete', function (req, res) {
  var q_id = req.body._id;
  var url = process.env.MONGODB_URI;
  var myobj = { _id: new mongodb.ObjectId(q_id)};
      if(true){
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("groceryapp");
              dbo.collection("address").deleteOne(myobj,function(err, result) {
              if (err) throw err;
              res.end(JSON.stringify(result));
              db.close();
            });
          });         
      }
  })


  app.post('/patients/add', function (req, res) {
     
    console.log(req.body);

    var url = process.env.MONGODB_URI;
        if(true){
            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db("groceryapp");
                var myobj = req.body;
                dbo.collection("demo_patients").insertOne(myobj,function(err, result) {
                if (err) throw err;
                console.log(result);
                res.end(JSON.stringify(result));
                db.close();
              });
            });
            
        }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, err => {
    if(err) throw err;
    console.log("%c Server running", "color: green");
});
// Console will print the message

//admin-admindbtest
