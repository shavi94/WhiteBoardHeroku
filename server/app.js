var path = require('path');
var express = require('express');
var app = express();
var socket = require('socket.io');

app.use('/static', express.static('pub'));

//Create HTTP server and listen on port 3000 for requests
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'index.html'));
})

var server = app.listen(3000);

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
    console.log('New Connection: ' + socket.id);

    socket.on('mouse',mouseMsg);
    socket.on('erase',eraseMsg);
    socket.on('eraseline',eraseLineMsg);

    function mouseMsg(data){
        socket.broadcast.emit('mouse',data);
        console.log(data);
    }
    function eraseMsg(data){
        socket.broadcast.emit('erase',data);
        console.log("erase" + data);
    }
    function eraseLineMsg(data){
        socket.broadcast.emit('eraseline',data);
        console.log("eraseLine" + data);
    }

    socket.on('disconnect',function(){
        console.log("Client has disconnected");
    })

}