var neo4j = require('neo4j-js');
var neo4jurl = "http://localhost:7474/db/data/";
var HTTPStatus = require('http-status'); 

exports.findAll = function (req, res){
    var projectid = parseInt(req.params.id);
    console.log("Retrieving all lists for project {id:" + projectid + "}");
    res.header("Access-Control-Allow-Origin", "*");
    res.set({'Content-Type': 'text/json'}); // setting content type
    neo4j.connect(neo4jurl, function (err, graph) { //Connecting neo4J
        if(err) {
            res.send(HTTPStatus.INTERNAL_SERVER_ERROR,'Internal Server Error'); 
        }
        else {
            var query = "start n=node(" + projectid + ") MATCH n-[:LatestList|PreviousList*]->(list:List) return list"
            graph.query(query, {id:0}, function (err, results) {
                if (err) {
                    res.send(HTTPStatus.INTERNAL_SERVER_ERROR, "Internal Server Error for query:" + query); 
                }
                else {
                    console.log(JSON.stringify(results));
                    res.send(HTTPStatus.OK,JSON.stringify(results)); 
                }       
            }); 
        }
    });
};

