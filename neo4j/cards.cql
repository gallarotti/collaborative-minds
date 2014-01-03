    // old query to insert a new card at the tail of a list
    MATCH (currentList:List)-[currentTailRel:TAIL_CARD]->(currentTail:Card) WHERE ID(currentList) = {listid}
    CREATE (currentList)-[newTailRel:TAIL_CARD]->(newCard:Card { title: {cardTitle}, description: '' })
    CREATE (newCard)-[newPrevRel:PREV_CARD]->(currentTail)
    CREATE (currentTail)-[newNextRel:NEXT_CARD]->(newCard)
    DELETE currentTailRel
    WITH count(newCard) as countNewCard
    WHERE countNewCard = 0
    MATCH (emptyList:List)-[fakeTailRel:TAIL_CARD]->(emptyList),
    (emptyList)-[fakeHeadRel:HEAD_CARD]->(emptyList)
    WHERE ID(emptyList) = {listid}
    WITH emptyList, fakeTailRel, fakeHeadRel
    CREATE (emptyList)-[:TAIL_CARD]->(newCard:Card { title: {cardTitle}, description: '' })
    CREATE (emptyList)-[:HEAD_CARD]->(newCard)
    DELETE fakeTailRel, fakeHeadRel
    RETURN true

    // new query to insert a new card at the tail of a list
    MATCH (theList:List) WHERE ID(theList)=5
    OPTIONAL MATCH (theList)-[tlct:TAIL_CARD]->(currentTail:Card)
    OPTIONAL MATCH (theList)-[tltl1:TAIL_CARD]->(theList)-[tltl2:HEAD_CARD]->(theList)
    WITH
    	theList,
    	CASE WHEN currentTail IS NULL THEN [] ELSE [(currentTail)] END AS currentTails,
    	currentTail, tlct,
    	CASE WHEN tltl1 IS NULL THEN [] ELSE [(theList)] END AS emptyLists,
    	tltl1, tltl2
    CREATE 	(newCard:Card { title: "Card Title", description: "" })
    FOREACH (value IN currentTails | 
    	CREATE (theList)-[:TAIL_CARD]->(newCard)
    	CREATE (newCard)-[:PREV_CARD]->(currentTail)
    	CREATE (currentTail)-[:NEXT_CARD]->(newCard)
    	DELETE tlct)
    FOREACH (value IN emptyLists |
    	CREATE (theList)-[:TAIL_CARD]->(newCard)
    	CREATE (theList)-[:HEAD_CARD]->(newCard)
    	DELETE tltl1, tltl2)
    RETURN newCard

    // first get a hold of the list to which we want to add the new card
    MATCH (theList:List) WHERE ID(theList)=5
    // check if the list already has at least one card
    OPTIONAL MATCH (theList)-[tlct:TAIL_CARD]->(currentTail:Card)
    // check if the list is empty
    OPTIONAL MATCH (theList)-[tltl1:TAIL_CARD]->(theList)-[tltl2:HEAD_CARD]->(theList)
    WITH
    	theList,
    	CASE WHEN currentTail IS NULL THEN [] ELSE [(currentTail)] END AS currentTails,
    	currentTail, tlct,
    	CASE WHEN tltl1 IS NULL THEN [] ELSE [(theList)] END AS emptyLists,
    	tltl1, tltl2
    // create the new card	
    CREATE 	(newCard:Card { title: "Card Title", description: "" })
    // handle the case in which the list already had at least one card
    FOREACH (value IN currentTails | 
    	CREATE (theList)-[:TAIL_CARD]->(newCard)
    	CREATE (newCard)-[:PREV_CARD]->(currentTail)
    	CREATE (currentTail)-[:NEXT_CARD]->(newCard)
    	DELETE tlct)
    // handle the case in which the list was empty
    FOREACH (value IN emptyLists |
    	CREATE (theList)-[:TAIL_CARD]->(newCard)
    	CREATE (theList)-[:HEAD_CARD]->(newCard)
    	DELETE tltl1, tltl2)
    RETURN newCard



	// archive a node in the middle of a doubly-linked list
	MATCH (before:Card)-[n1:NEXT_CARD]->(middle:Card)-[n2:NEXT_CARD]->(after:Card) 
	WHERE ID(middle)=48
	CREATE (before)-[:NEXT_CARD]->(after)
	CREATE (after)-[:PREV_CARD]->(before)
	WITH middle, before, after
	MATCH (middle)-[r]-(n)
	DELETE r
	WITH middle, before, after
	MATCH (before)<-[:NEXT_CARD*]-(c:Card)<-[:HEAD_CARD]-(l:List)<-[:NEXT_LIST*]-(fl:List)<-[:HEAD_LIST]-(p:Project)-[:ArchiveList]->(archive:List)
	CREATE (archive)-[r:Archived { archivedOn : timestamp() }]->(middle)
	RETURN middle

	// archive the head node of a doubly-linked list
	MATCH (list:List)-[h1:HEAD_CARD]->(head:Card)-[n1:NEXT_CARD]->(second:Card) 
	WHERE ID(head)=48
	CREATE (list)-[:HEAD_CARD]->(second)
	WITH head, list
	MATCH (head)-[r]-(n)
	DELETE r
	WITH head, list
	MATCH (list)<-[:NEXT_LIST*]-(fl:List)<-[:HEAD_LIST]-(p:Project)-[:ArchiveList]->(archive:List)
	CREATE (archive)-[r:Archived { archivedOn : timestamp() }]->(head)
	RETURN head

	// archive the tail node of a doubly-linked list
	MATCH (list:List)-[t1:TAIL_CARD]->(tail:Card)-[p1:PREV_CARD]->(nextToLast:Card) 
	WHERE ID(tail)=48
	CREATE (list)-[:TAIL_CARD]->(nextToLast)
	WITH tail, list
	MATCH (tail)-[r]-(n)
	DELETE r
	WITH tail, list
	MATCH (list)<-[:NEXT_LIST*]-(fl:List)<-[:HEAD_LIST]-(p:Project)-[:ArchiveList]->(archive:List)
	CREATE (archive)-[r:Archived { archivedOn : timestamp() }]->(tail)
	RETURN tail

	// archive the one and only node in the doubly-linked list
	MATCH (list:List)-[tc:TAIL_CARD]->(only:Card)<-[hc:HEAD_CARD]-(list:List) 
	WHERE ID(only)=48
	CREATE (list)-[:TAIL_CARD]->(list)
	CREATE (list)-[:HEAD_CARD]->(list)
	WITH only, list
	MATCH (only)-[r]-(n)
	DELETE r
	WITH only, list
	MATCH (list)<-[:NEXT_LIST*]-(fl:List)<-[:HEAD_LIST]-(p:Project)-[:ArchiveList]->(archive:List)
	CREATE (archive)-[r:Archived { archivedOn : timestamp() }]->(only)
	RETURN only



	MATCH (theCard:Card) WHERE ID(theCard)=44
	OPTIONAL MATCH (theCard)<-[:NEXT_CARD|HEAD_CARD*]-(theList:List)<-[:NEXT_LIST|HEAD_LIST*]-(theProject:Project)-[:ARCHIVE_LIST]->(theArchive:List)
	OPTIONAL MATCH (before:Card)-[btc:NEXT_CARD]->(theCard:Card)-[tca:NEXT_CARD]->(after:Card) 
	OPTIONAL MATCH (next:Card)-[ntc:PREV_CARD]->(theCard:Card)-[tcp:PREV_CARD]->(previous:Card) 
	OPTIONAL MATCH (listOfOne:List)-[lootc:TAIL_CARD]->(theCard:Card)<-[tcloo:HEAD_CARD]-(listOfOne:List)
	OPTIONAL MATCH (listToHead:List)-[lthtc:HEAD_CARD]->(theCard:Card)-[tcs:NEXT_CARD]->(second:Card)-[stc:PREV_CARD]->(theCard:Card) 
	OPTIONAL MATCH (listToTail:List)-[ltttc:TAIL_CARD]->(theCard:Card)-[tcntl:PREV_CARD]->(nextToLast:Card)-[ntltc:NEXT_CARD]->(theCard:Card) 
	WITH 
		theCard, theList, theProject, theArchive,
		CASE WHEN theArchive IS NULL THEN [] ELSE [(theArchive)] END AS archives,
		CASE WHEN before IS NULL THEN [] ELSE [(before)] END AS befores, 
		before, btc, tca, after, 
		CASE WHEN next IS NULL THEN [] ELSE [(next)] END AS nexts, 
		next, ntc, tcp, previous, 
		CASE WHEN listOfOne IS NULL THEN [] ELSE [(listOfOne)] END AS listsOfOne, 
		listOfOne, lootc, tcloo, 
		CASE WHEN listToHead IS NULL THEN [] ELSE [(listToHead)] END AS listsToHead, 
		listToHead, lthtc, tcs, second, stc, 
		CASE WHEN listToTail IS NULL THEN [] ELSE [(listToTail)] END AS listsToTail, 
		listToTail, ltttc, tcntl, nextToLast, ntltc
	FOREACH (value IN befores | 
		CREATE (before)-[:NEXT_CARD]->(after)
		CREATE (after)-[:PREV_CARD]->(before)
		DELETE btc, tca)
	FOREACH (value IN nexts | DELETE ntc, tcp)
	FOREACH (value IN listsOfOne | 
		CREATE (listOfOne)-[:HEAD_CARD]->(listOfOne)
		CREATE (listOfOne)-[:TAIL_CARD]->(listOfOne)
		DELETE lootc, tcloo)
	FOREACH (value IN listsToHead | 
		CREATE (listToHead)-[:HEAD_CARD]->(second)
		DELETE lthtc, tcs, stc)
	FOREACH (value IN listsToTail | 
		CREATE (listToTail)-[:TAIL_CARD]->(nextToLast)
		DELETE ltttc, tcntl, ntltc)
	WITH 
		theCard, 
		theArchive
    OPTIONAL MATCH (theArchive)-[tact:TAIL_CARD]->(currentTail:Card)
    OPTIONAL MATCH (theArchive)-[tata1:TAIL_CARD]->(theArchive)-[tata2:HEAD_CARD]->(theArchive)
    WITH
    	theArchive, theCard,
    	CASE WHEN currentTail IS NULL THEN [] ELSE [(currentTail)] END AS currentTails,
    	currentTail, tact,
    	CASE WHEN tata1 IS NULL THEN [] ELSE [(theArchive)] END AS emptyLists,
    	tata1, tata2
    FOREACH (value IN currentTails | 
    	CREATE (theArchive)-[:TAIL_CARD]->(theCard)
    	CREATE (theCard)-[:PREV_CARD]->(currentTail)
    	CREATE (currentTail)-[:NEXT_CARD]->(theCard)
    	DELETE tact)
    FOREACH (value IN emptyLists |
    	CREATE (theArchive)-[:TAIL_CARD]->(theCard)
    	CREATE (theArchive)-[:HEAD_CARD]->(theCard)
    	DELETE tata1, tata2)
    RETURN theCard


	// first let's get a hold of the card we want to archive
	MATCH (theCard:Card) WHERE ID(theCard)=44
	// next, let's get a hold of the correspondent archive list node, since we need to move the card in that list
	OPTIONAL MATCH (theCard)<-[:NEXT_CARD|HEAD_CARD*]-(theList:List)<-[:NEXT_LIST|HEAD_LIST*]-(theProject:Project)-[:ARCHIVE_LIST]->(theArchive:List)
	// let's check if we are in the case where the card to be archived is in the middle of a list
	OPTIONAL MATCH (before:Card)-[btc:NEXT_CARD]->(theCard:Card)-[tca:NEXT_CARD]->(after:Card) 
	OPTIONAL MATCH (next:Card)-[ntc:PREV_CARD]->(theCard:Card)-[tcp:PREV_CARD]->(previous:Card) 
	// let's check if the card to be archived is the only card in the list
	OPTIONAL MATCH (listOfOne:List)-[lootc:TAIL_CARD]->(theCard:Card)<-[tcloo:HEAD_CARD]-(listOfOne:List)
	// let's check if the card to be archived is at the head of the list
	OPTIONAL MATCH (listToHead:List)-[lthtc:HEAD_CARD]->(theCard:Card)-[tcs:NEXT_CARD]->(second:Card)-[stc:PREV_CARD]->(theCard:Card) 
	// let's check if the card to be archived is at the tail of the list
	OPTIONAL MATCH (listToTail:List)-[ltttc:TAIL_CARD]->(theCard:Card)-[tcntl:PREV_CARD]->(nextToLast:Card)-[ntltc:NEXT_CARD]->(theCard:Card) 
	WITH 
		theCard, theList, theProject, theArchive,
		CASE WHEN theArchive IS NULL THEN [] ELSE [(theArchive)] END AS archives,
		CASE WHEN before IS NULL THEN [] ELSE [(before)] END AS befores, 
		before, btc, tca, after, 
		CASE WHEN next IS NULL THEN [] ELSE [(next)] END AS nexts, 
		next, ntc, tcp, previous, 
		CASE WHEN listOfOne IS NULL THEN [] ELSE [(listOfOne)] END AS listsOfOne, 
		listOfOne, lootc, tcloo, 
		CASE WHEN listToHead IS NULL THEN [] ELSE [(listToHead)] END AS listsToHead, 
		listToHead, lthtc, tcs, second, stc, 
		CASE WHEN listToTail IS NULL THEN [] ELSE [(listToTail)] END AS listsToTail, 
		listToTail, ltttc, tcntl, nextToLast, ntltc
	// let's handle the case in which the archived card was in the middle of a list
	FOREACH (value IN befores | 
		CREATE (before)-[:NEXT_CARD]->(after)
		CREATE (after)-[:PREV_CARD]->(before)
		DELETE btc, tca)
	FOREACH (value IN nexts | DELETE ntc, tcp)
	// let's handle the case in which the archived card was the one and only card in the list
	FOREACH (value IN listsOfOne | 
		CREATE (listOfOne)-[:HEAD_CARD]->(listOfOne)
		CREATE (listOfOne)-[:TAIL_CARD]->(listOfOne)
		DELETE lootc, tcloo)
	// let's handle the case in which the archived card was at the head of the list
	FOREACH (value IN listsToHead | 
		CREATE (listToHead)-[:HEAD_CARD]->(second)
		DELETE lthtc, tcs, stc)
	// let's handle the case in which the archived card was at the tail of the list
	FOREACH (value IN listsToTail | 
		CREATE (listToTail)-[:TAIL_CARD]->(nextToLast)
		DELETE ltttc, tcntl, ntltc)
	// finally, let's move the card in the archive	
    // first get a hold of the archive list to which we want to add the card
	WITH 
		theCard, 
		theArchive
    // first get a hold of the list to which we want to add the new card
   	OPTIONAL MATCH (theArchive)-[tact:TAIL_CARD]->(currentTail:Card)
    // check if the list is empty
    OPTIONAL MATCH (theArchive)-[tata1:TAIL_CARD]->(theArchive)-[tata2:HEAD_CARD]->(theArchive)
    WITH
    	theArchive, theCard,
    	CASE WHEN currentTail IS NULL THEN [] ELSE [(currentTail)] END AS currentTails,
    	currentTail, tact,
    	CASE WHEN tata1 IS NULL THEN [] ELSE [(theArchive)] END AS emptyLists,
    	tata1, tata2
    // handle the case in which the list already had at least one card
    FOREACH (value IN currentTails | 
    	CREATE (theArchive)-[:TAIL_CARD]->(theCard)
    	CREATE (theCard)-[:PREV_CARD]->(currentTail)
    	CREATE (currentTail)-[:NEXT_CARD]->(theCard)
    	DELETE tact)
    // handle the case in which the list was empty
    FOREACH (value IN emptyLists |
    	CREATE (theArchive)-[:TAIL_CARD]->(theCard)
    	CREATE (theArchive)-[:HEAD_CARD]->(theCard)
    	DELETE tata1, tata2)
    RETURN theCard

