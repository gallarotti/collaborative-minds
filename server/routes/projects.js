var mongo = require("mongodb");
var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server("localhost", 27017, {auto_reconnect: true});
var db = new Db("mindr", server);
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to mindr database");
        db.collection("projects", {strict:true}, function(err, collection) {
            if (err) {
                console.log("The projects collection doesn't exist.");
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log("Retrieving project: " + id);
    db.collection("projects", function(err, collection) {
        collection.findOne({"_id":new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection("projects", function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log(items);
            res.send(items);
        });
    });
};

exports.addProject = function(req, res) {
    var newProject = req.body;
    console.log("Adding project: " + JSON.stringify(newProject));
    db.collection("projects", function(err, collection) {
        collection.insert(newProject, {safe:true}, function(err, result) {
            if (err) {
                res.send({"error":"An error has occurred"});
            } else {
                console.log("Success: " + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateProject = function(req, res) {
    var id = req.params.id;
    var project = req.body;
    console.log("Updating project: " + id);
    console.log(JSON.stringify(project));
    // the following is really a hack... the ID in the project is a string, but the one in the DB
    // is of type BSON.ObjectId, so we need to cast it
    project._id = new BSON.ObjectID.createFromHexString(project._id);
    db.collection("projects", function(err, collection) {
        collection.update({"_id":new BSON.ObjectID(id)}, project, {safe:true}, function(err, result) {
            if (err) {
                console.log("Error updating project: " + err);
                res.send({"error":"An error has occurred"});
            } else {
                console.log(result + " document(s) updated");
                res.send(project);
            }
        });
    });
}

exports.deleteProject = function(req, res) {
    var id = req.params.id;
    console.log("Deleting project: " + id);
    db.collection("projects", function(err, collection) {
        collection.remove({"_id":new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({"error":"An error has occurred - " + err});
            } else {
                console.log(result + " document(s) deleted");
                res.send(req.body);
            }
        });
    });
}
