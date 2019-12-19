const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));

const APP_PORT = process.env.PORT | 3000;

var group = [ 'General', 'Programming', 'Games', 'Gardening'];
var chatGroup = [];
var messages = [{
    groupName: group[0],
    msgs: []
},
{
    groupName: group[1],
    msgs: []
},{
    groupName: group[2],
    msgs: []
},{
    groupName: group[3],
    msgs: []
}];

app.get('/api/list', (req, res, next)=>{
  console.log('get groups', group);
  res.status(200).json(group);
});

app.get('/api/list-clients', (req, res, next)=>{
    console.log('get all connected clients', connections);
    res.status(200).json(connections);
  });

app.get('/api/list/:groupName', (req, res, next)=>{
    let groupName= req.params.groupName;
    console.log(groupName);    
    console.log('get chat group', chatGroup);
    res.status(200).json(chatGroup);
});


io.on("connection", socket => {
  console.log("user connected");

  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("message", message => {
    console.log("Message Received: " + JSON.stringify(message));
    if(message.type === 'join'){
        joinChat(message);
        console.log("...");
        const result = messages
            .filter(chatMessages => chatMessages.groupName ===  message.groupName);
        console.log("..." + JSON.stringify(result));
        io.emit("message", result[0].msgs);
    }else if(message.type === 'leave'){
        console.log(message);
        leaveChat(message);
    }if(message.type === 'message'){
        emitMessages(message);
    }
  });
});

function emitMessages(message){
    console.log(message);
    const result = messages
    .filter(chatMessages => chatMessages.groupName ===  message.groupName);
    const chatMessagesIndex = messages
    .findIndex(chatMessages => chatMessages.groupName ===  message.groupName);
    console.log(">>>" + JSON.stringify(result));
    console.log(chatMessagesIndex);
    result[0].msgs.push({
        username: message.username,
        data: message.data
    });
    messages[chatMessagesIndex]  = result[0];
    console.log(">>>" + JSON.stringify(messages));
    io.emit("message", result[0].msgs);
}

function joinChat(message){
    let group = {
        groupName:  message.groupName,
        participants: [message.username]
    }
    const result = chatGroup
        .filter(group => group.groupName ===  message.groupName);
    const groupIndex = chatGroup
        .findIndex(group => group.groupName ===  message.groupName);
    console.log(result);
    console.log(result.length);
    if (result.length > 0){
        console.log("join current group !");
        chatGroup[groupIndex].participants.push(message.username)
    }else{
        console.log('new chat group !');
        chatGroup.push(group);
    }
    console.log(chatGroup);
}

function leaveChat(message){
    console.log("Leave chat ...");
    console.log(message.username);
    console.log(message.groupName);
    
    const groupIndex = chatGroup
        .findIndex(group => group.groupName ===  message.groupName);
    console.log(">>> " + groupIndex);
    console.log(">>> >>> " + JSON.stringify(chatGroup));
    let usernameIndex = chatGroup[groupIndex]
        .participants.indexOf(message.username);
    let newArr = chatGroup[groupIndex].participants.splice(usernameIndex, 1);
    console.log(">>> >>> " + newArr);
    if(chatGroup[groupIndex].participants.length == 0){
        console.log("remove group");
        chatGroup.splice(groupIndex, 1);
    }
    console.log(">>> >>> " + JSON.stringify(chatGroup));
}

http.listen(APP_PORT, () => {
  console.log(`started on port ${APP_PORT}`);
});