var neo4j = require('neo4j-js');
var neo4jurl = "http://localhost:7474/db/data/";
var HTTPStatus = require('http-status'); 

exports.findAll = function (req, res){
    var listid = parseInt(req.params.id);
    console.log("Retrieving all cards for list {id:" + listid + "}");
    res.set({'Content-Type': 'text/json'}); // setting content type
    neo4j.connect(neo4jurl, function (err, graph) { //Connecting neo4J
        if(err) {
            res.send(HTTPStatus.INTERNAL_SERVER_ERROR,'Internal Server Error'); 
        }
        else {
            var query = "start n=node(" + listid + ") MATCH n-[:HeadCard|NextCard*]->(card:Card) return card"
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

exports.addCard = function(req, res) {
    var newCard = req.body;
    console.log("Adding card: " + JSON.stringify(newCard));
    res.set({'Content-Type': 'text/json'}); // setting content type
    neo4j.connect(neo4jurl, function (err, graph) { //Connecting neo4J
        if(err) {
            res.send(HTTPStatus.INTERNAL_SERVER_ERROR,'Internal Server Error'); 
        }
        else {
            console.log("Adding card with title = " + newCard.title);
            console.log("Adding card to list id = " + newCard.listId);

            var query = [
                "MATCH (currentList:List)-[currentTailRel:TailCard]->(currentTail:Card) WHERE ID(currentList) = {listid}",
                "CREATE (currentList)-[newTailRel:TailCard]->(newCard:Card { title: {cardTitle}, description: '' })",
                "CREATE (newCard)-[newPrevRel:PreviousCard]->(currentTail)",
                "CREATE (currentTail)-[newNextRel:NextCard]->(newCard)",
                "DELETE currentTailRel",
                "WITH count(newCard) as countNewCard",
                "WHERE countNewCard = 0",
                "MATCH (emptyList:List)-[fakeTailRel:TailCard]->(emptyList),", 
                "(emptyList)-[fakeHeadRel:HeadCard]->(emptyList)", 
                "WHERE ID(emptyList) = {listid}",
                "WITH emptyList, fakeTailRel, fakeHeadRel",
                "CREATE (emptyList)-[:TailCard]->(newCard:Card { title: {cardTitle}, description: '' })",
                "CREATE (emptyList)-[:HeadCard]->(newCard)",
                "DELETE fakeTailRel, fakeHeadRel",
                "RETURN true"
            ];
            graph.query(query.join('\n'), 
                {listid:parseInt(newCard.listId), cardTitle:newCard.title}, 
                function (err, results) {
                    if (err) {
                        console.log(err);
                        console.log(err.stack);
                        res.send(HTTPStatus.INTERNAL_SERVER_ERROR, "Internal Server Error for query:" + query); 
                    }
                    else {
                        console.log(JSON.stringify(results));
                        res.send(HTTPStatus.OK,JSON.stringify(results)); 
                    }       
                }); 
        }
    });
}
