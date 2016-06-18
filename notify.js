var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


module.exports = {

  connect: function() {
    console.log('connecting to user');
    io.on('connection',function(socket){
      socket.emit('announcements',{message:'A new user has joined'})
    });
  },
  recevieMessage:function(){
    
  },
  sendMessage:function(){

  },
}
