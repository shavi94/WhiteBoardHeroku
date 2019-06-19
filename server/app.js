var path = require('path');
var express = require('express');
var app = express();
var socket = require('socket.io');
var usernames = [];


app.use('/static', express.static('pub'));

app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'index.html'));
});

//Create HTTP server and listen on port 3000 for requests
var server = app.listen(process.env.PORT || 3000);

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log('New Connection: ' + socket.id);

    socket.on('mouse',mouseMsg);
    socket.on('erase',eraseMsg);
    socket.on('eraseline',eraseLineMsg);
    socket.on('sendmessage',sendmessage);
    socket.on('new user',newUser);
    socket.on('file', sharefile);

    //share files
    function sharefile(dataURI,type){
        var name = socket.username;
        socket.broadcast.emit('file', dataURI,type,name);
    }

    //new user connect
    function newUser(data,callback){
        if(usernames.indexOf(data) != -1){
            callback(false);
        }else{
            callback(true);
            socket.username = data;
            usernames.push(socket.username);
            updateUserNames();

        }
    }

    //update online users
    function updateUserNames(){
        io.sockets.emit('usernames',usernames);
    }

    //send chat message
    function sendmessage(data){
        socket.broadcast.emit('sendmessage',{msg: data, user: socket.username});
        console.log('chat: '+data);
    }

    //send drawing
    function mouseMsg(data){
        socket.broadcast.emit('mouse',data);
        console.log(data);
    }

    //send erasing details
    function eraseMsg(data){
        socket.broadcast.emit('erase',data);
        console.log("erase" + data);
    }

    //send line erasing details
    function eraseLineMsg(data){
        socket.broadcast.emit('eraseline',data);
        console.log("eraseLine" + data);
    }


    //disconnect
    socket.on('disconnect',function(data){
        console.log(socket.username +" has disconnected");
        if(!socket.username){
            return;
        }
        usernames.splice(usernames.indexOf(socket.username),1);
        updateUserNames();
    })

}