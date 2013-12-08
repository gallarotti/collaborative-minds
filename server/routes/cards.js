var mongo = require("mongodb");
var Server = mongo.Server,
	Db = mongo.Db,
	BSON = mongo.BSONPure;

var server = new Server("localhost", 27017, {auto_reconnect: true});
var db = new Db("mindr", server);
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to mindr database");
        db.collection("cards", {strict:true}, function(err, collection) {
            if (err) {
                console.log("The cards collection doesn't exist.");
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log("Retrieving card: " + id);
    db.collection("cards", function(err, collection) {
        collection.findOne({"_id":new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findByProjectIdStateId = function(req, res) {
    var projectid = req.params.projectid;
    var stateid = parseInt(req.params.stateid);
    projectid = new BSON.ObjectID.createFromHexString(projectid);
    console.log("Retrieving cards for project: " + projectid + " and state: " + stateid);
    db.collection("cards", function(err, collection) {
        collection.find({project: projectid, state: stateid}).sort({order: 1}).toArray(function(err, items) {
            res.send(items);
        });    
    });
};

exports.findAll = function(req, res) {
    db.collection("cards", function(err, collection) {
        collection.find().sort({order: 1}).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addCard = function(req, res) {
    var newCard = req.body;
    newCard.workflow = new BSON.ObjectID.createFromHexString(newCard.workflow);
    newCard.project = new BSON.ObjectID.createFromHexString(newCard.project);
    console.log("Adding card: " + JSON.stringify(newCard));
    db.collection("cards", function(err, collection) {
        collection.insert(newCard, {safe:true}, function(err, result) {
            if (err) {
                res.send({"error":"An error has occurred"});
            } else {
                console.log("Success: " + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateCard = function(req, res) {
    var id = req.params.id;
    var card = req.body;
    console.log("Updating card: " + id);
    console.log(JSON.stringify(card));
    // the following is really a hack... the ID in the card is a string, but the one in the DB
    // is of type BSON.ObjectId, so we need to cast it
    card._id = new BSON.ObjectID.createFromHexString(card._id);
    card.workflow = new BSON.ObjectID.createFromHexString(card.workflow);
    card.project = new BSON.ObjectID.createFromHexString(card.project);
    db.collection("cards", function(err, collection) {
        collection.update({"_id":new BSON.ObjectID(id)}, card, {safe:true}, function(err, result) {
            if (err) {
                console.log("Error updating card: " + err);
                res.send({"error":"An error has occurred"});
            } else {
                console.log(result + " document(s) updated");
                res.send(card);
            }
        });
    });
}

exports.deleteCard = function(req, res) {
    var id = req.params.id;
    console.log("Deleting card: " + id);
    db.collection("cards", function(err, collection) {
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
