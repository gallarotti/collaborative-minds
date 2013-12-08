var mongo = require("mongodb");
var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server("localhost", 27017, {auto_reconnect: true});
var db = new Db("mindr", server);
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to mindr database");
        db.collection("workflows", {strict:true}, function(err, collection) {
            if (err) {
                console.log("The workflows collection doesn't exist.");
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log("Retrieving workflow: " + id);
    db.collection("workflows", function(err, collection) {
        collection.findOne({"_id":new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection("workflows", function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log(items);
            res.send(items);
        });
    });
};

exports.addWorkflow = function(req, res) {
    var newWorkflow = req.body;
    console.log("Adding workflow: " + JSON.stringify(newWorkflow));
    db.collection("workflows", function(err, collection) {
        collection.insert(newWorkflow, {safe:true}, function(err, result) {
            if (err) {
                res.send({"error":"An error has occurred"});
            } else {
                console.log("Success: " + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateWorkflow = function(req, res) {
    var id = req.params.id;
    var workflow = req.body;
    console.log("Updating workflow: " + id);
    console.log(JSON.stringify(workflow));
    // the following is really a hack... the ID in the workflow is a string, but the one in the DB
    // is of type BSON.ObjectId, so we need to cast it
    workflow._id = new BSON.ObjectID.createFromHexString(workflow._id);
    db.collection("workflows", function(err, collection) {
        collection.update({"_id":new BSON.ObjectID(id)}, workflow, {safe:true}, function(err, result) {
            if (err) {
                console.log("Error updating workflow: " + err);
                res.send({"error":"An error has occurred"});
            } else {
                console.log(result + " document(s) updated");
                res.send(workflow);
            }
        });
    });
}

exports.deleteWorkflow = function(req, res) {
    var id = req.params.id;
    console.log("Deleting workflow: " + id);
    db.collection("workflows", function(err, collection) {
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
