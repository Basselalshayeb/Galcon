const app=require('express')(); // app = express();
const server = require('http').Server(app);//app.listen(server);
const io=require('socket.io')(server),
websocket =require('ws'),
url=require('url'),util = require('util'),
bodyParser = require('body-parser');
const wss = new websocket.Server({ server });
const fs=require('fs');
var roomscounter=0;
var connections={};//roomname +player1name
var websockets={};
//to handle json shit
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//to lunch the server
server.listen(process.env.PORT || 8080,function(){
    console.log("server is listening on 8080 port");
});
 
app.get('/',(req,res)=>{
  console.log("this is the shit");
  res.end("fuck u user");
});
 //websocket shit
wss.on('connection', function connection(ws, req) {
  console.log("new socket \n");
  const location = url.parse(req.url, true);
  // You might use location.query.access_token to authenticate or share sessions
  // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
 
  //use location to send a specific url shit
  ws.on('message', function incoming(message) {
  /*wss.clients.forEach(function each(client){
      if(client!==ws){
        client.send(message);
      }
    });*/
  
    console.log('received: %s', message);
    var parsedmessage=JSON.parse(message);
    var roomname= parsedmessage.fileroomrname+".json";
    if (parsedmessage.header=="Create room"){
      console.log("Create room event \n");
     var roomname="";
     roomname= parsedmessage.fileroomrname.toString()+roomscounter.toString()+".json";
      roomscounter++;
      console.log(roomname+parsedmessage.username);
      //info to be in json object
      var creatorinfo={};
      creatorinfo["player1name"]=parsedmessage.username;
      creatorinfo["player1ip"]=parsedmessage.creatorip;
      creatorinfo["player1loc"]=roomname+parsedmessage.username.toString();
      connections[creatorinfo["player1loc"]]=ws;
      websockets[creatorinfo["player1loc"]]=ws;
      console.log(parsedmessage.fileroomrname);
      fs.writeFile("rooms/"+roomname,JSON.stringify(creatorinfo),function(err){
      if (err){
        console.log(err);
      }else
      console.log("No error in create room \n\n");
      });

      ws.send('{"header":"Set Roomname","message":"'+roomname.substr(0,roomname.length-5)+'"}');
    }
    else if(parsedmessage.header == "Join room"){
    console.log("we are in the join");
      //////////////new 
      var mydata=JSON.parse(fs.readFileSync("rooms/" +roomname));
      for(var i=1;i<=parsedmessage.roomplayerscount;i++){
        if(!mydata.hasOwnProperty("player"+i+"name")){
          console.log("player "+i+" is here");
         mydata["player"+i+"name"]=parsedmessage.username;
         mydata["player"+i+"loc"]=roomname+parsedmessage.username.toString();
         connections[mydata["player"+i+"loc"]]=ws;
         websockets[mydata["player"+i+"loc"]]=ws;
         fs.writeFileSync("rooms/"+roomname,JSON.stringify(mydata));
          var temp=parseInt(i);
         console.log("player 1 location in join : "+mydata["player1loc"]);
         if(temp==parsedmessage.roomplayerscount){
           console.log("all players are here join");
         }else
         console.log("not all players are here"+parsedmessage.roomplayerscount);
         break;
        }
      }

      console.log("end of join room \n");
    //////////old 
      /*fs.readFile("rooms/" +roomname ,function(err,data){
        if (err){
          console.log(err);
          console.log("error in reading files in join");
        }else{
          var mydata=JSON.parse(data);
          //var roomname= parsedmessage.fileroomrname+".json";
          for(var i=1;i<=parsedmessage.roomplayerscount;i++){
             if(!mydata.hasOwnProperty("player"+i+"name")){
               console.log("player "+i+" is here");
              //connections[roomname+parsedmessage.username]=ws;
              mydata["player"+i+"name"]=parsedmessage.username;
              mydata["player"+i+"loc"]=roomname+parsedmessage.username;
              var temp=parseInt(i);
              fs.writeFile("rooms/"+roomname,JSON.stringify(mydata),function(err){
                if(err){
                  console.log("error in adding the player 2");
                }else
                {
                  //connections[mydata["player1loc"]].send("Room joined");
                  console.log("player 1 location in join : "+mydata["player1loc"]);
                  if(temp==parsedmessage.roomplayerscount){
                    console.log("all players are here join");
                  }else
                  console.log("not all players are here"+parsedmessage.roomplayerscount);
                }
                console.log("after the else the break");
              });
              console.log("before the break");
              break; 
              console.log("after the break");
            } 
          }      
        }
      });
      console.log("end of join room \n");*/
    }else if(parsedmessage.header=="Room joined"){
      console.log("we are in Room joined");
      fs.readFile("rooms/"+roomname,function(err,data){
        var mydata=JSON.parse(data);
        connections[mydata["player1loc"]].send('{"header":"Room joined"}');
        });

    }else if(parsedmessage.header=="Startgame"){
      console.log("we are in start game , room requested "+ parsedmessage.fileroomrname);
      fs.readFile("rooms/"+roomname,function(err,data){
        if(err){
          console.log("error in Startgame");
        }else{
        var mydata=JSON.parse(data);
        
        for(var i=1;i<=parsedmessage.roomplayerscount;i++){
          connections[mydata["player"+i+"loc"]].send('{"header":"Startgame"}');
        }
      }
      });
    }else if (parsedmessage.header =="Attack"){
      console.log("we are in the attack\n");
      
        fs.readFile("rooms/"+parsedmessage.fileroomrname+".json",function(err,data){
        
          var mydata=JSON.parse(data);
          for(var i =1 ;i<=parsedmessage.roomplayerscount;i++){
            if(mydata.hasOwnProperty("player"+i+"name")){
              if(connections[mydata["player"+i+"loc"]]!=ws)
          connections[mydata["player"+i+"loc"]].send(message);
        }  
        }
        });
       
     
	}
	else if(parsedmessage.header ==  "Chatting"){
		
      fs.readFile("rooms/"+parsedmessage.fileroomrname+".json",function(err,data){
        
        var mydata=JSON.parse(data);
        //console.log(mydata.player1loc);
        for(var i =1 ;i<=parsedmessage.roomplayerscount;i++){
          if(mydata.hasOwnProperty("player"+i+"name")){
            if(connections[mydata["player"+i+"loc"]]!=ws)
        connections[mydata["player"+i+"loc"]].send(message);
      }  
      }
      });
      
	}else if (parsedmessage.header == "Delete room"){
		fs.unlink(parsedmessage.fileroomrname+".json",function(err){
      if(err){
        console.log("error in deleting room");
      }
    });
	}else if(parsedmessage.header=="Pause"){
      fs.readFile("rooms/"+parsedmessage.fileroomrname+".json",function(err,data){
        
        var mydata=JSON.parse(data);
        //console.log(mydata.player1loc);
        for(var i =1 ;i<=parsedmessage.roomplayerscount;i++){
          if(mydata.hasOwnProperty("player"+i+"name")){
            if(connections[mydata["player"+i+"loc"]]!=ws)
        connections[mydata["player"+i+"loc"]].send(message);
      }  
      }
      });

    //console.log(parsedmessage.message);
  }else if(parsedmessage.header=="Start"){

    fs.readFile("rooms/"+parsedmessage.fileroomrname+".json",function(err,data){
        
      var mydata=JSON.parse(data);
      //console.log(mydata.player1loc);
      for(var i =1 ;i<=parsedmessage.roomplayerscount;i++){
        if(mydata.hasOwnProperty("player"+i+"name")){
          if(connections[mydata["player"+i+"loc"]]!=ws)
          //send all the message or just the header !!
      //connections[mydata["player"+i+"loc"]].send(parsedmessage.header);
      connections[mydata["player"+i+"loc"]].send(message);
    }  
    }
    });
    //console.log(parsedmessage.message);
  }else if (parsedmessage.header=="Get rooms"){
    var filesnames=[];
      fs.readdir("rooms/",function(err,files){
        if(err){
          console.log("err in get rooms");
        }else{
          files.forEach(function each(file){
            filesnames.push(file.substr(0,file.length-5));
          }); 
          
          ws.send(filesnames.toString());
        }
      });
      
  }
    
  });
 
});

//my methodes
app.get('/help',function(req,res){
    var data={"msg":"fuck3","Date":new Date()};
    data =JSON.stringify(data);
	fs.readFile("testing.json",function(err,data){
	if (err){
	console.log(err);
	}
var temp=JSON.parse(data);
	console.log(temp);
	temp["player2"]="ready";
	console.log(temp);
	fs.writeFile("testing.json",temp,function(err){
		if (err){
			console.log(err);
		}
	});
	});

res.end("20");
});
app.get('/help2',function(req,res){
  console.log("help2");
  fs.readFile("rooms/bee00.json",function(err,data){
    var mydata=JSON.parse(data);
    console.log(mydata["player1name"]);
  });
  res.end("20");
});
app.get("/help3",function(req,res){
  fs.readdir("rooms",function(err,files){
    if(err){
      console.log("err in get rooms");
    }else{
      files.forEach(function each(file){
        console.log(file);
      }
    ); 
    }
  });
  res.end("20");
});
app.get("/hibaaaa",function(req,res){
  connections["bassel10.jsonb1"].send("Room joined");
  res.end("20");
});