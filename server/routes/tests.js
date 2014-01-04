var neo4j = require('neo4j-js');
var neo4jurl = "http://localhost:7474/db/data/";
var HTTPStatus = require('http-status'); 

exports.addCards = function(req, res) {
    var testResult = {};
    testResult.initialTimestamp = new Date().getTime();
    var newCard = req.body;
    console.log("Adding " + newCard.copies + " copies of card: " + JSON.stringify(newCard));
    res.set({'Content-Type': 'text/json'}); // setting content type
    neo4j.connect(neo4jurl, function (err, graph) { //Connecting neo4J
        if(err) {
            res.send(HTTPStatus.INTERNAL_SERVER_ERROR,'Internal Server Error'); 
        }
        else {
            var newQuery = [
                "MATCH (theList:List)-[tlt:TAIL_CARD]->(tail)-[tp:PREV_CARD]->(previous)-[pt:NEXT_CARD]->(tail)",
                "WHERE ID(theList)={listid}",
                "WITH theList, tail, tp, pt, previous",
                "CREATE (newCard:Card { title: {cardTitle}, description: '' })",
                "CREATE (tail)-[:PREV_CARD]->(newCard)-[:NEXT_CARD]->(tail)",
                "CREATE (newCard)-[:PREV_CARD]->(previous)-[:NEXT_CARD]->(newCard)",
                "DELETE tp,pt",
                "RETURN newCard"
            ];

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


            var iteration = 0;
            (function loop() {
                if (iteration < newCard.copies) {
                graph.query(query.join('\n'), 
                    {listid:parseInt(newCard.listId), cardTitle:newCard.title},  
                    function (err, results) {
                        if (err) {
                            console.log(err);
                            console.log(err.stack);
                            res.send(HTTPStatus.INTERNAL_SERVER_ERROR, "Internal Server Error for query:" + query); 
                        }
                        else {
                            var ts = new Date().getTime();
                            var elapsed = ts - testResult.initialTimestamp;
                            results.message = "elapsed: " + elapsed + "ms";
                            console.log(JSON.stringify(results));
                            iteration++;
                            loop();
                        }       
                    }); 
                }
                else {
                    testResult.finalTimestamp = new Date().getTime();
                    testResult.totalExecutionTime = testResult.finalTimestamp - testResult.initialTimestamp;
                    testResult.message = "Completed in: " + testResult.totalExecutionTime + "ms";
                    res.send(HTTPStatus.OK,JSON.stringify(testResult));                    
                }
            }());
        }
    });
}

exports.archiveCards = function(req, res) {
    var testResult = {};
    testResult.initialTimestamp = new Date().getTime();
    var querySettings = req.body;
    console.log("Archiving " + querySettings.copies + " cards from list: " + querySettings.listId);
    res.set({'Content-Type': 'text/json'}); // setting content type

    neo4j.connect(neo4jurl, function (err, graph) { //Connecting neo4J
        if(err) {
            res.send(HTTPStatus.INTERNAL_SERVER_ERROR,'Internal Server Error'); 
        }
        else {
            var newQuery = [
                "MATCH (theList:List)-[:HEAD_CARD]->(h)-[:NEXT_CARD]->(theCard) WHERE ID(theList)={listid}",
                "WITH theCard",
                "MATCH (theCard)<-[:NEXT_CARD|HEAD_CARD*]-(l:List)<-[:NEXT_LIST*]-(h)<-[:HEAD_LIST]-(p:Project)-[:ARCHIVE]->(theArchive:Archive)", 
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
                "DELETE tp,pt",
                "RETURN theCard"
            ];

            var query = [
                "MATCH (theList:List)-[:HEAD_CARD]->(h)-[:NEXT_CARD]->(theCard) WHERE ID(theList)={listid}",
                "WITH theCard",
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


            var iteration = 0;
            (function loop() {
                if (iteration < querySettings.copies) {
                graph.query(query.join('\n'), 
                    {listid:parseInt(querySettings.listId)},  
                    function (err, results) {
                        if (err) {
                            console.log(err);
                            console.log(err.stack);
                            res.send(HTTPStatus.INTERNAL_SERVER_ERROR, "Internal Server Error for query:" + query); 
                        }
                        else {
                            var ts = new Date().getTime();
                            var elapsed = ts - testResult.initialTimestamp;
                            results.message = "elapsed: " + elapsed + "ms";
                            console.log(JSON.stringify(results));
                            iteration++;
                            loop();
                        }       
                    }); 
                }
                else {
                    testResult.finalTimestamp = new Date().getTime();
                    testResult.totalExecutionTime = testResult.finalTimestamp - testResult.initialTimestamp;
                    testResult.message = "Completed in: " + testResult.totalExecutionTime + "ms";
                    res.send(HTTPStatus.OK,JSON.stringify(testResult));                    
                }
            }());
        }
    });
}


