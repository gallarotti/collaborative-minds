var application_root = __dirname,
    express = require("express"),
    path = require("path");

// import various routes
var projects = require("./routes/projects.js");
var lists = require("./routes/lists.js");
var cards = require("./routes/cards.js");

var app = express();

// Express Config
app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get("/projects", projects.findAll);
app.get("/projects/:id", projects.findById);
app.get("/lists/:id", lists.findAll);
app.get("/cards/:id", cards.findAll);

app.listen(3000);
console.log("collaborative-minds server listening on port 3000...");