const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var user_count = 0;
var ObjectId = require('mongodb').ObjectId;

//var items;
var bodyParser = require('body-parser')

  app.use(bodyParser.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const { Socket } = require('dgram');
const { read } = require('fs');
var uri = "mongodb+srv://admin:test123@cluster0.zyzxb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    var myobj = { name: "Prudhvi", email: "prudhviraj038@gmail.com",phone:"7382223117",active:true };
   // await client.db("dinnero").collection("users").insertOne(myobj).then();
    //await client.db("dinneroasasas").collection("users").insertOne(myobj).then();

    // items =  await client.db("dinnero").collection('users').find({}).toArray();
    // console.log(items);
  }catch(error){
    console.log(error);
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}

run().catch(console.dir);

  


io.on('connection', (socket) => {
  
  //console.log('a user connected'+ socket.id);

  socket.on('disconnect', () => {
    sockets.map((item)=> {
      if(item.id==socket.id){
        var winner_email = '';
        sockets.map((item)=>{
        if(item.id!=socket.id){
          winner_email = item.email;
        }
        });
        console.log('user disconnected');
        clearTimeout(timer);
        players = [];
        sockets = [];
        player_selected_number = [];
        io.sockets.emit('winner', {winner_email});
      }
    });
  
    });
    
    socket.on('chat message', (msg) => {
    //console.log('message: ' + msg);
        io.sockets.emit('chat message', msg);
    });

    socket.on('new message', (msg) => {
    console.log('new message: ' + msg);
    });

    socket.on('start_game', (msg) => {
      console.log('start_game: ' + msg);
      if(players.length==0){
        players.push(msg.username);
        sockets.push({"id":socket.id,"email":msg.email});
        io.sockets.emit('wait', msg);
      }else if(players.length==1){
        players.push(msg.username);
        sockets.push({"id":socket.id,"email":msg.email});
        io.sockets.emit('connected', players);
        if(timer!=null)
        clearTimeout(timer);
        user_count++;
        if(numbers.length!=90){
        for (let i = 0; numbers.length<90; i++) {
        numbers[i]=i+1;
        }
      }
      //if(user_count==1){
      generateRandomNumber();
      //}


      }else if(players.length==2){

      }
      });

      socket.on('winner', (msg) => {
        io.sockets.emit('winner', msg);
        clearTimeout(timer);

        });

        socket.on('player_selected_number', (number) => {
          if(player_selected_number.length==0){
          player_selected_number=number;
          console.log("players_number_"+number);
          }
          });
  });

  app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  });


  app.get("/users", function(req, res) {

  client.db("dinnero").collection("users").find({}).toArray().then(
      (data)=>{
        console.log(data);
        res.send(data);
      }
    );
  });

  app.post("/users/add", function(req, res) {
    console.log(req.body);
  var myobj = { name: req.body.name, email: req.body.email,phone:req.body.phone,active:true };

  client.db("dinnero").collection("users").find({"email": req.body.email}).toArray().then((data)=>{
    console.log(data);
    if(data.length==0){
      client.db("dinnero").collection("users").insertOne(myobj).then((data)=>{
        if(data.acknowledged){
          res.send({"status":true,"message":"Account created successfully, Password will be sent to your mail id."});
        }else{
          res.send({"status":false,"message":"Account creation failed, Please try again."});
        }
    });
  }else{
      res.send({"status":false,"message":"User with this email  already exist. Please try again with new email"})
  }
  });
});
  
  


  app.post("/users/login", function(req, res) {
    console.log(req.body);
  var query = { email: req.body.email};
  client.db("dinnero").collection("users").find(query).toArray().then((data)=>{
    console.log(data);
    if(data==null || data.length!=1){
      res.send({"status":false,"message":"login failed"})
    }else{
      res.send({"status":true,"message":"success","user_id":data})
    }
    
  }
  );
  });



  app.get("/groups", function(req, res) {

    client.db("dinnero").collection("groups").find({}).toArray().then(
        (data)=>{
          console.log(data);
          res.send(data);
        }
      );
    });

  app.post("/groups/add", function(req, res) {
    console.log(req.body);

  var myobj = { name: req.body.name, created_by: req.body.created_by,selected_users: req.body.selected_users,active:true };


  if(req.body.group_id==""){
  client.db("dinnero").collection("groups").insertOne(myobj).then((data)=>{
    if(data.acknowledged){
      res.send({"status":true,"message":"Group created successfully."});
    }else{
      res.send({"status":false,"message":"Group creation failed, Please try again."});
    }
  }
  );
  }else{
    client.db("dinnero").collection("groups").updateOne({"_id":new ObjectId(req.body.group_id)},{"$set":myobj}).then((data)=>{
      if(data.acknowledged){
        res.send({"status":true,"message":"Group updated successfully."});
      }else{
        res.send({"status":false,"message":"Group update failed, Please try again."});
      }
    }
    );
  }

  });


  app.post("/groups/delete", function(req, res) {
    console.log(req.body);
    client.db("dinnero").collection("groups").deleteOne({"_id":new ObjectId(req.body.group_id)}).then((data)=>{
      if(data.acknowledged){
        res.send({"status":true,"message":"Group deleted successfully."});
      }else{
        res.send({"status":false,"message":"Group delete failed, Please try again."});
      }
    }
    );
  });

  app.post("/groups/addUserToGroup", function(req, res) {
    console.log(req.body);
  var myobj = { user_id: req.body.user_id, group_id: req.body.group_id,active:true };
  client.db("dinnero").collection("users_groups_mapping").insertOne(myobj).then(
    res.send({"status":true})
  );
  });



server.listen(process.env.PORT || 3000, () => {
  console.log('listening on '+ server.address().port);
  });

  function checkIndex(val) {
    return val==player_selected_number[0];
  }
  var tempSelectednumber = 0;
  function checkIndextemp(val) {
    return val==tempSelectednumber;
  }
  const generateRandomNumber = () => {
    if(numbers.length>0){
    var temp;
    if(numbers.length>84 || player_selected_number.length==0){
    temp = Math.floor(Math.random() * numbers.length);
    } else{
      console.log('to else');
    temp = numbers.findIndex(checkIndex);
    player_selected_number.splice(0, 1); 
    }
    var selectedNumber = numbers[temp];
    tempSelectednumber = selectedNumber;
    if(player_selected_number.indexOf(checkIndextemp)!=-1){

      player_selected_number.splice(checkIndextemp,1);
      console.log('player_selectd_number_emove_'+player_selected_number);

    }
    numbers.splice(temp, 1); 
    io.sockets.emit('number_selected', {number:selectedNumber});
    timer = setTimeout(generateRandomNumber,1000*5,'test');
    }
    else{
    console.log('all numbers completed');
    io.sockets.emit('number_selected', {number:0});
    }
  }

var player_selected_number = [];
var numbers = [];
var timer = null;
var sockets = [];
var players = [];
for (let i = 0; numbers.length<90; i++) {
    numbers[i]=i+1;
  }