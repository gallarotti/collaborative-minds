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
                "MATCH (theList:List) WHERE ID(theList)={listid}",
                "OPTIONAL MATCH (theList)-[tlct:TAIL_CARD]->(currentTail:Card)",
                "OPTIONAL MATCH (theList)-[tltl1:TAIL_CARD]->(theList)-[tltl2:HEAD_CARD]->(theList)",
                "WITH",
                "    theList,",
                "    CASE WHEN currentTail IS NULL THEN [] ELSE [(currentTail)] END AS currentTails,",
                "    currentTail, tlct,",
                "    CASE WHEN tltl1 IS NULL THEN [] ELSE [(theList)] END AS emptyLists,",
                "    tltl1, tltl2",
                "CREATE (newCard:Card { title: {cardTitle}, description: '' })",
                "FOREACH (value IN currentTails | ",
                "    CREATE (theList)-[:TAIL_CARD]->(newCard)",
                "    CREATE (newCard)-[:PREV_CARD]->(currentTail)",
                "    CREATE (currentTail)-[:NEXT_CARD]->(newCard)",
                "    DELETE tlct)",
                "FOREACH (value IN emptyLists |",
                "    CREATE (theList)-[:TAIL_CARD]->(newCard)",
                "    CREATE (theList)-[:HEAD_CARD]->(newCard)",
                "    DELETE tltl1, tltl2)",
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
            console.log("Archiving card with id = " + card.card.id);
            res.send(HTTPStatus.OK,JSON.stringify(card));

            var query = [
                "MATCH (theCard:Card) WHERE ID(theCard)={cardid}",
                "OPTIONAL MATCH (theCard)<-[:NEXT_CARD|HEAD_CARD*]-(theList:List)<-[:NEXT_LIST|HEAD_LIST*]-(theProject:Project)-[:ARCHIVE_LIST]->(theArchive:List)",
                "OPTIONAL MATCH (before:Card)-[btc:NEXT_CARD]->(theCard:Card)-[tca:NEXT_CARD]->(after:Card)", 
                "OPTIONAL MATCH (next:Card)-[ntc:PREV_CARD]->(theCard:Card)-[tcp:PREV_CARD]->(previous:Card)", 
                "OPTIONAL MATCH (listOfOne:List)-[lootc:TAIL_CARD]->(theCard:Card)<-[tcloo:HEAD_CARD]-(listOfOne:List)",
                "OPTIONAL MATCH (listToHead:List)-[lthtc:HEAD_CARD]->(theCard:Card)-[tcs:NEXT_CARD]->(second:Card)-[stc:PREV_CARD]->(theCard:Card)", 
                "OPTIONAL MATCH (listToTail:List)-[ltttc:TAIL_CARD]->(theCard:Card)-[tcntl:PREV_CARD]->(nextToLast:Card)-[ntltc:NEXT_CARD]->(theCard:Card)", 
                "WITH", 
                "    theCard, theList, theProject, theArchive,",
                "    CASE WHEN theArchive IS NULL THEN [] ELSE [(theArchive)] END AS archives,",
                "    CASE WHEN before IS NULL THEN [] ELSE [(before)] END AS befores,", 
                "    before, btc, tca, after,", 
                "    CASE WHEN next IS NULL THEN [] ELSE [(next)] END AS nexts,", 
                "    next, ntc, tcp, previous,", 
                "    CASE WHEN listOfOne IS NULL THEN [] ELSE [(listOfOne)] END AS listsOfOne,", 
                "    listOfOne, lootc, tcloo,", 
                "    CASE WHEN listToHead IS NULL THEN [] ELSE [(listToHead)] END AS listsToHead,", 
                "    listToHead, lthtc, tcs, second, stc,", 
                "    CASE WHEN listToTail IS NULL THEN [] ELSE [(listToTail)] END AS listsToTail,", 
                "    listToTail, ltttc, tcntl, nextToLast, ntltc",
                "FOREACH (value IN befores | CREATE (before)-[:NEXT_CARD]->(after))",
                "FOREACH (value IN befores | CREATE (after)-[:PREV_CARD]->(before))",
                "FOREACH (value IN befores | DELETE btc)",
                "FOREACH (value IN befores | DELETE tca)",
                "FOREACH (value IN nexts | DELETE ntc)",
                "FOREACH (value IN nexts | DELETE tcp)",
                "FOREACH (value IN listsOfOne | CREATE (listOfOne)-[:HEAD_CARD]->(listOfOne))",
                "FOREACH (value IN listsOfOne | CREATE (listOfOne)-[:TAIL_CARD]->(listOfOne))",
                "FOREACH (value IN listsOfOne | DELETE lootc)",
                "FOREACH (value IN listsOfOne | DELETE tcloo)",
                "FOREACH (value IN listsToHead | CREATE (listToHead)-[:HEAD_CARD]->(second))",
                "FOREACH (value IN listsToHead | DELETE lthtc)",
                "FOREACH (value IN listsToHead | DELETE tcs)",
                "FOREACH (value IN listsToHead | DELETE stc)",
                "FOREACH (value IN listsToTail | CREATE (listToTail)-[:TAIL_CARD]->(nextToLast))",
                "FOREACH (value IN listsToTail | DELETE ltttc)",
                "FOREACH (value IN listsToTail | DELETE tcntl)",
                "FOREACH (value IN listsToTail | DELETE ntltc)",
                "WITH", 
                "    theCard,", 
                "    theArchive",
                "OPTIONAL MATCH (theArchive)-[tact:TAIL_CARD]->(currentTail:Card)",
                "OPTIONAL MATCH (theArchive)-[tata1:TAIL_CARD]->(theArchive)-[tata2:HEAD_CARD]->(theArchive)",
                "WITH",
                "    theArchive, theCard,",
                "    CASE WHEN currentTail IS NULL THEN [] ELSE [(currentTail)] END AS currentTails,",
                "    currentTail, tact,",
                "    CASE WHEN tata1 IS NULL THEN [] ELSE [(theArchive)] END AS emptyLists,",
                "    tata1, tata2",
                "FOREACH (value IN currentTails | ",
                "    CREATE (theArchive)-[:TAIL_CARD]->(theCard)",
                "    CREATE (theCard)-[:PREV_CARD]->(currentTail)",
                "    CREATE (currentTail)-[:NEXT_CARD]->(theCard)",
                "    DELETE tact)",
                "FOREACH (value IN emptyLists |",
                "    CREATE (theArchive)-[:TAIL_CARD]->(theCard)",
                "    CREATE (theArchive)-[:HEAD_CARD]->(theCard)",
                "    DELETE tata1, tata2)",
                "RETURN theCard"
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
