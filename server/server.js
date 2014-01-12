var application_root = __dirname,
    express = require("express"),
    path = require("path");

// import various routes
var projects = require("./routes/projects.js");
var lists = require("./routes/lists.js");
var cards = require("./routes/cards.js");
var tests = require("./routes/tests.js");

var app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

// Express Config
app.configure(function() {
    app.use(express.logger("dev"));
    app.use(express.urlencoded());
    app.use(express.json())
});

// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});

app.get("/projects", projects.findAll);
app.get("/projects/:id", projects.findById);
app.get("/lists/:id", lists.findAll);
app.get("/cards/:id", cards.findAll);
app.post("/cards", cards.addCard);
app.post("/cards/archive", cards.archiveCard);
app.post("/cards/move", cards.moveCard);

app.post("/cards/tests/createMultiple", tests.addCards);
app.post("/cards/tests/archiveMultiple", tests.archiveCards);

server.listen(3000);
console.log("collaborative-minds server listening on port 3000...");

io.set('log level', 2); // reduce logging
io.sockets.on("connection", function (socket) {
  socket.emit("welcome", { message: "Connected to server socket!" });
  socket.on("newCardMessage", function (data) {
    console.log("Received newCardMessage [" + data.projectId + "] [" + data.listId + "] [" + data.newCard.card.id + "]");
    socket.broadcast.emit("appendCardMessage", { 
      projectId: data.projectId, 
      listId: data.listId,
      newCard: data.newCard
    });
  });
  socket.on("movedCardMessage", function (data) {
    console.log("Received movedCardMessage [" + data.projectId + "] [" + data.moveCardSettings.theCard.id + 
      "] [" + data.moveCardSettings.fromList.id + "] -> [" + data.moveCardSettings.toList.id + "]"); 
    socket.broadcast.emit("removeCardMessage", { 
      projectId: data.projectId, 
      listId: data.moveCardSettings.fromList.id,
      cardId: data.moveCardSettings.theCard.id
    });
    var newCard = {
      card: data.moveCardSettings.theCard
    };
    if(data.moveCardSettings.moveToTail) {
      console.log("Broadcasting appendCardMessage [" + data.projectId + "] [" + 
        data.moveCardSettings.toList.id + "] [" + data.moveCardSettings.theCard.id + "]");
      socket.broadcast.emit("appendCardMessage", { 
        projectId: data.projectId, 
        listId: data.moveCardSettings.toList.id,
        newCard: newCard
      });      
    }
    else {
      console.log("Broadcasting insertCardMessage [" + data.projectId + "] [" + 
        data.moveCardSettings.toList.id + "] [" + data.moveCardSettings.theCard.id + "]");
      socket.broadcast.emit("insertCardMessage", { 
        projectId: data.projectId, 
        listId: data.moveCardSettings.toList.id,
        position: data.moveCardSettings.toCardIndex,
        newCard: newCard
      });      
    }
  });
  socket.on("archivedCardMessage", function (data) {
    console.log("Received archivedCardMessage [" + data.projectId + "] [" + data.listId + "] [" + data.cardId + "]");
    socket.broadcast.emit("removeCardMessage", { 
      projectId: data.projectId, 
      listId: data.listId,
      cardId: data.cardId
    });
  });
});