var path = require('path');
var express = require('express');
var app = express();
var socket = require('socket.io');
var usernames = [];
var voting = [];
var labels = [];

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
    socket.on('create poll',createPoll);
    socket.on('vote categorize',voteCategorize);
    socket.on('vote result',voteResults);

    function createroom(room){
        
        socket.join(room);
    }

    function voteResults(id){
        var lab1;
        var lab2;
        var lab3;

        var countlab1=0;
        var countlab2=0;
        var countlab3=0;

        for(var y=0;y<labels.length;y++){
            if(labels[y][0]==id){
                lab1 = labels[y][1].label1;
                lab2 = labels[y][1].label2;
                lab3 = labels[y][1].label3;
            }
        }

        for(var x=0; x<voting.length;x++){
            if(voting[x][0]==id){
                if(voting[x][1].vote==lab1){
                    countlab1++;
                }else if(voting[x][1].vote==lab2){
                    countlab2++;
                }else if(voting[x][1].vote==lab3){
                    countlab3++;
                }
            }
        }

        console.log(id+" counts: "+lab1+" : "+countlab1+"  "+
        lab2+" : "+countlab2+"  "+lab3+" : "+countlab3);
    }

    function voteCategorize(vote,nid){
        var arrdata = [nid, {
            vote: vote,
            user: socket.username
        }];

        voting.push(arrdata);
        console.log(arrdata);
    }


    function createPoll(quiz,opt1,opt2,opt3,id){
        var name = socket.username;
        var roomid = socket.room;
        var dataArr = [id, {
            label1 : opt1,
            label2 : opt2,
            label3 : opt3
        }];
        labels.push(dataArr);
        socket.broadcast.to(roomid).emit('pollonchat',quiz,opt1,opt2,opt3,name,id);
    }

    //share files
    function sharefile(dataURI,type){
        var name = socket.username;
        var id = socket.room;
        socket.broadcast.to(id).emit('file', dataURI,type,name);
    }

    //new user connect
    function newUser(data,nroom,callback){
        console.log(data+' and '+nroom);
        if(usernames.indexOf(data) != -1){
            callback(false);
        }else{
            callback(true);
            socket.username = data;
            socket.room = nroom;
            var dataArr = [socket.username, {
                room : socket.room
            }];
            usernames.push(dataArr);
            console.log(usernames);
            createroom(nroom);
            updateUserNames(nroom);

        }
    }

    //update online users
    function updateUserNames(room){
        var chatusers = [];
        for(var x=0; x<usernames.length;x++){
            if(usernames[x][1].room==room){
                chatusers.push(usernames[x][0]);
            }
        }
        io.sockets.in(room).emit('usernames',chatusers);
    }

    //send chat message
    function sendmessage(data){
        var id = socket.room;

        socket.broadcast.to(id).emit('sendmessage',{msg: data, user: socket.username});
        console.log('chat: '+data);
    }

    //send drawing
    function mouseMsg(data){
        var id = socket.room;
        socket.broadcast.to(id).emit('mouse',data);
        console.log(data);
    }

    //send erasing details
    function eraseMsg(data){
        var id = socket.room;
        socket.broadcast.to(id).emit('erase',data);
        console.log("erase" + data);
    }

    //send line erasing details
    function eraseLineMsg(data){
        var id = socket.room;
        socket.broadcast.to(id).emit('eraseline',data);
        console.log("eraseLine" + data);
    }


    //disconnect
    socket.on('disconnect',function(data){
        console.log(socket.username +" has disconnected");
        if(!socket.username){
            return;
        }
        // usernames.splice(usernames.indexOf(socket.username),1);
        for(var x=0;x<usernames.length;x++){
            if(usernames[x][0]==socket.username){
                usernames.splice(x,1);
            }
        }
        updateUserNames(socket.room);
    })

}