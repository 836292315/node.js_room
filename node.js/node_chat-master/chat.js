var io = require('socket.io')();
var _ = require('underscore');




var userList = [];
io.on('connection',function(socket){
	//login function
	socket.on('login',function(user){
		user.id = socket.id;
		userList.push(user);
		//send the userlist to all client
		io.emit('userList',userList);
		//send the client information to client
		socket.emit('userInfo',user);
		//send login info to all.
		socket.broadcast.emit('loginInfo',user.name+"上线了。");
	});
	//log out
	socket.on('disconnect',function(){
		var user = _.findWhere(userList,{id:socket.id});
		if(user){
			userList = _.without(userList,user);
			//send the userlist to all client
			io.emit('userList',userList);
			//send login info to all.
			socket.broadcast.emit('loginInfo',user.name+"下线了。");
		}
	});
	//send to all
	socket.on('toAll',function(msgObj){
		socket.broadcast.emit('toAll',msgObj);
	});
	//sendImageToALL
	socket.on('sendImageToALL',function(msgObj){
		socket.broadcast.emit('sendImageToALL',msgObj);
	})
	//send to one
	socket.on('toOne',function(msgObj){
		var toSocket = _.findWhere(io.sockets.sockets,{id:msgObj.to});
		console.log(toSocket);
		toSocket.emit('toOne', msgObj);
	});
});
exports.listen = function(_server){
	io.listen(_server);
};