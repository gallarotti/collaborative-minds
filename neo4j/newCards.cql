    // new query to insert a new card at the tail of a list
    MATCH (theList:List)-[tlt:TAIL_CARD]->(tail)-[tp:PREV_CARD]->(previous)-[pt:NEXT_CARD]->(tail) 
    WHERE ID(theList)=197
    WITH theList, tail, tp, pt, previous
    CREATE (newCard:Card { title: "Card Title", description: "" })
    CREATE (tail)-[:PREV_CARD]->(newCard)-[:NEXT_CARD]->(tail)
    CREATE (newCard)-[:PREV_CARD]->(previous)-[:NEXT_CARD]->(newCard)
    DELETE tp,pt
    RETURN newCard


    MATCH (theCard)<-[:NEXT_CARD|HEAD_CARD*]-(l:List)<-[:NEXT_LIST*]-(h)<-[:HEAD_LIST]-(p:Project)-[:ARCHIVE]->(theArchive:Archive) 
    WHERE ID(theCard)=170
    WITH theCard, theArchive
    MATCH (previous)-[ptc:NEXT_CARD]->(theCard)-[tcn:NEXT_CARD]->(next)-[ntc:PREV_CARD]->(theCard)-[tcp:PREV_CARD]->(previous)
    WITH theCard, theArchive, previous, next, ptc, tcn, ntc, tcp
    CREATE (previous)-[:NEXT_CARD]->(next)-[:PREV_CARD]->(previous)
    DELETE ptc, tcn, ntc, tcp
    WITH theCard, theArchive
    MATCH (theArchive)-[tat:TAIL_CARD]->(archiveTail)-[tp:PREV_CARD]->(archivePrevious)-[pt:NEXT_CARD]->(archiveTail) 
    WITH theCard, theArchive, archiveTail, tp, pt, archivePrevious
    CREATE (archiveTail)-[:PREV_CARD]->(theCard)-[:NEXT_CARD]->(archiveTail)
    CREATE (theCard)-[:PREV_CARD]->(archivePrevious)-[:NEXT_CARD]->(theCard)
    DELETE tp,pt
    RETURN theCard


