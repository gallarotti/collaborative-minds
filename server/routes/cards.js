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
            var query = "MATCH n-[:HEAD_CARD|NEXT_CARD*]->(card:Card) WHERE ID(n)=" + listid + " RETURN card"
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
                "MATCH (theList:List)-[tlt:TAIL_CARD]->(tail)-[tp:PREV_CARD]->(previous)-[pt:NEXT_CARD]->(tail)",
                "WHERE ID(theList)={listid}",
                "WITH theList, tail, tp, pt, previous",
                "CREATE (newCard:Card { title: {cardTitle}, description: '' })",
                "CREATE (tail)-[:PREV_CARD]->(newCard)-[:NEXT_CARD]->(tail)",
                "CREATE (newCard)-[:PREV_CARD]->(previous)-[:NEXT_CARD]->(newCard)",
                "DELETE tp,pt",
                "RETURN newCard"
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

exports.archiveCard = function(req, res) {
    var card = req.body;
    console.log("Archiving card: " + JSON.stringify(card));
    res.set({'Content-Type': 'text/json'}); // setting content type
    neo4j.connect(neo4jurl, function (err, graph) { //Connecting neo4J
        if(err) {
            res.send(HTTPStatus.INTERNAL_SERVER_ERROR,'Internal Server Error'); 
        }
        else {
            var query = [
                "MATCH (theCard)<-[:NEXT_CARD|HEAD_CARD*]-(l:List)<-[:NEXT_LIST*]-(h)<-[:HEAD_LIST]-(p:Project)-[:ARCHIVE]->(theArchive:Archive)", 
                "WHERE ID(theCard)={cardid}",
                "WITH theCard, theArchive",
                "MATCH (previous)-[ptc:NEXT_CARD]->(theCard)-[tcn:NEXT_CARD]->(next)-[ntc:PREV_CARD]->(theCard)-[tcp:PREV_CARD]->(previous)",
                "WITH theCard, theArchive, previous, next, ptc, tcn, ntc, tcp",
                "CREATE (previous)-[:NEXT_CARD]->(next)-[:PREV_CARD]->(previous)",
                "DELETE ptc, tcn, ntc, tcp",
                "WITH theCard, theArchive",
                "MATCH (theArchive)-[tat:TAIL_CARD]->(archiveTail)-[tp:PREV_CARD]->(archivePrevious)-[pt:NEXT_CARD]->(archiveTail)", 
                "WITH theCard, theArchive, archiveTail, tp, pt, archivePrevious",
                "CREATE (archiveTail)-[:PREV_CARD]->(theCard)-[:NEXT_CARD]->(archiveTail)",
                "CREATE (theCard)-[:PREV_CARD]->(archivePrevious)-[:NEXT_CARD]->(theCard)",
                "DELETE tp,pt"
            ];
            graph.query(query.join('\n'), 
                {cardid:parseInt(card.card.id)}, 
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

exports.moveCard = function(req, res) {
    var moveCardSettings = req.body;
    console.log("Moving card: " + JSON.stringify(moveCardSettings));
    res.set({'Content-Type': 'text/json'}); // setting content type
    neo4j.connect(neo4jurl, function (err, graph) { //Connecting neo4J
        if(err) {
            res.send(HTTPStatus.INTERNAL_SERVER_ERROR,'Internal Server Error'); 
        }
        else {
            var query = [
                "MATCH (previous)-[ptc:NEXT_CARD]->(theCard)-[tcn:NEXT_CARD]->(next)-[ntc:PREV_CARD]->(theCard)-[tcp:PREV_CARD]->(previous)",
                "WHERE ID(theCard)={theCardId}",
                "WITH theCard, previous, next, ptc, tcn, ntc, tcp",
                "CREATE (previous)-[:NEXT_CARD]->(next)-[:PREV_CARD]->(previous)",
                "DELETE ptc, tcn, ntc, tcp",
                "WITH theCard",
                "MATCH (prev)-[pn:NEXT_CARD]->(next)-[np:PREV_CARD]->(prev)", 
                "WHERE ID(prev)={prevCardId}",
                "WITH theCard, prev, next, np, pn",
                "CREATE (prev)-[:NEXT_CARD]->(theCard)-[:PREV_CARD]->(prev)",
                "CREATE (next)-[:PREV_CARD]->(theCard)-[:NEXT_CARD]->(next)",
                "DELETE pn,np"
            ];            
            if(moveCardSettings.moveToHead) {
                query = [
                    "MATCH (previous)-[ptc:NEXT_CARD]->(theCard)-[tcn:NEXT_CARD]->(next)-[ntc:PREV_CARD]->(theCard)-[tcp:PREV_CARD]->(previous)",
                    "WHERE ID(theCard)={theCardId}",
                    "WITH theCard, previous, next, ptc, tcn, ntc, tcp",
                    "CREATE (previous)-[:NEXT_CARD]->(next)-[:PREV_CARD]->(previous)",
                    "DELETE ptc, tcn, ntc, tcp",
                    "WITH theCard",
                    "MATCH (toList:List)-[tlh:HEAD_CARD]->(head)-[hn:NEXT_CARD]->(next)-[nh:PREV_CARD]->(head)", 
                    "WHERE ID(toList)={toListId}",
                    "WITH theCard, toList, head, next, tlh, hn, nh",
                    "CREATE (head)-[:NEXT_CARD]->(theCard)-[:PREV_CARD]->(head)",
                    "CREATE (next)-[:PREV_CARD]->(theCard)-[:NEXT_CARD]->(next)",
                    "DELETE hn,nh"
                ];
                moveCardSettings.prevCard = moveCardSettings.theCard;
            }
            graph.query(query.join('\n'), 
                {
                    theCardId:parseInt(moveCardSettings.theCard.id),
                    toListId:parseInt(moveCardSettings.toList.id),
                    prevCardId:parseInt(moveCardSettings.prevCard.id)
                }, 
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
