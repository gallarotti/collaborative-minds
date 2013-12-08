var express = require("express"), 
	cards = require("./routes/cards"),
	workflows = require("./routes/workflows"),
	projects = require("./routes/projects");

var app = express();

app.configure(function() {
	app.use(express.logger("dev"));
	app.use(express.bodyParser());
});

app.get("/cards", cards.findAll);
app.get("/cards/state/:stateid/project/:projectid", cards.findByProjectIdStateId);
app.get("/cards/:id", cards.findById);
app.post("/cards", cards.addCard);
app.put("/cards/:id", cards.updateCard);

app.get("/workflows", workflows.findAll);
app.get("/workflows/:id", workflows.findById);
app.post("/workflows", workflows.addWorkflow);
app.put("/workflows/:id", workflows.updateWorkflow);

app.get("/projects", projects.findAll);
app.get("/projects/:id", projects.findById);
app.post("/projects", projects.addProject);
app.put("/projects/:id", projects.updateProject);

app.listen(3000);
console.log("collaborative-minds server listening on port 3000...");