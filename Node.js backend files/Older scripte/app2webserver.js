var app=require('express')(); // app = express();
var server = require('http').Server(app);//app.listen(server);
var io=require('socket.io')({
	transports: ['websocket'],
}),util = require('util'),
bodyParser = require('body-parser');

io.listen(server);
//to lunch the server
server.listen(8080,function(){
    console.log("server is listening on 8080 port 2");
});
//to handle json shit
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
//my socket shit
io.on('connection', function(client){
    var data="fuck";
    //client.emit("data",data);
     //io.emit("data",data);
    client.emit('data',data);
    client.send("fuck u ");
    //io.emit('data',data);
    client.on('beep', function(){
		socket.emit('boop');
	});

    client.on('message',function(data){
        console.log("on only"+data);
    })
    client.on('data',function(data){
        console.log("data even "+data);
    })
    client.on('event', function(data){
        console.log("event event");
    });
    client.on('disconnect', function(){
        console.log("shit he's gone");
    });
    
   
  });
  io.sockets.on('message',function(data){
    console.log("io on only"+data);
})
io.sockets.on('data',function(data){
    console.log("io data even "+data);
})
io.sockets.on('event', function(data){
    console.log("io event event");
});
io.sockets.on('disconnect', function(){
    console.log("io shit he's gone");
});
//my methodes
app.get('/help',function(req,res){
    var data={"msg":"fuck2","Date":new Date()};
    io.sockets.on('beep', function(){
		socket.emit('boop');
	});
    io.emit('data',data);

res.end("20");
});