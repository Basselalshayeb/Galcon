var app=require('express')(); // app = express();
var server = require('http').Server(app);//app.listen(server);
var io=require('socket.io')(server),util = require('util'),
bodyParser = require('body-parser');
//to lunch the server
server.listen(8080,function(){
    console.log("server is listening on 8080 port");
});
//to handle json shit
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//my socket shit
io.on('connection', function(client){
    
    
    client.on('message',function(data){
        console.log("on only"+data);
    });
    client.on('data',function(data){
        console.log("data even "+data);
    });
    client.on('disconnect', function(data){
       // console.log("shit he's gone"+data);
    });
    var data="fuck";
    client.emit('data',data);
   
  });
  io.on('message',function incoming(data){
    console.log(" sockets on only"+data);
});
io.on('disconnect', function(data){
    console.log("sockets shit he's gone"+data);
});
//my methodes
app.get('/help',function(req,res){
    var data={"msg":"fuck2","Date":new Date()};
    io.emit('data',data);

res.end("20");
});