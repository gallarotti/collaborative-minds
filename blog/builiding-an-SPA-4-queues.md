# Building a SPA with AngularJS and Neo4J - Data Structure (Second Try)

At the end of [last post](http://1000linesofcode.wordpress.com/2014/01/03/building-a-spa-with-angularjs-and-neo4j-data-structure-first-try/) I quoted the eye-opening comment that Graph Grandmaster [Wes Freeman](https://twitter.com/wefreema) left on [one of my questions](http://stackoverflow.com/questions/20792518/how-to-handle-a-queue-in-neo4j) on Stack Overflow. Following his advice I decided to change the way each of the queues in my application was handled, adding two extra nodes, the **head** and the **tail**.

![new queue structure](http://1000linesofcode.files.wordpress.com/2014/01/new-queue.png)

### Inserting a New Card 

Moving the concepts of **head** and **tail** from simple relationships to nodes allows to have a single case when inserting a new card. Even in the special case of an empty queue…

![new queue structure](http://1000linesofcode.files.wordpress.com/2014/01/empty-queue.png)

all we have to do to add a new card to the tail of the queue is:

- find the (previous) node connected by a [PREV_CARD] and a [NEXT_CARD] relationships to the (tail) node of the queue
- create a (newCard) node
- connect the (newCard) node to the (tail) node with both a [PREV_CARD] and a [NEXT_CARD] relationships  
- connect the (newCard) node to the (previous) node with both a [PREV_CARD] and a [NEXT_CARD] relationships  
- finally delete the original [PREV_CARD] and a [NEXT_CARD] relationships that connected the (previous) node to the (tail) node of the queue

![new queue structure](http://1000linesofcode.files.wordpress.com/2014/01/new-card.png)

which translates into the following cypher query:

    MATCH (theList:List)-[tlt:TAIL_CARD]->(tail)-[tp:PREV_CARD]->(previous)-[pt:NEXT_CARD]->(tail) 
    WHERE ID(theList)={{listId}}
    WITH theList, tail, tp, pt, previous
    CREATE (newCard:Card { title: "Card Title", description: "" })
    CREATE (tail)-[:PREV_CARD]->(newCard)-[:NEXT_CARD]->(tail)
    CREATE (newCard)-[:PREV_CARD]->(previous)-[:NEXT_CARD]->(newCard)
    DELETE tp,pt
    RETURN newCard 

### Archiving a Card
    
Now let's reconsider the use case in which we want to archive a card. Let's review the architecture:

![new queue structure](http://1000linesofcode.files.wordpress.com/2014/01/new-architecture.png)

We have:

- each **project** has a queue of **lists**
- each **project** has an **archive** queue to store all archived cards
- each **list** has a queue of **cards**

In the previous queue architecture I had 4 different scenarios, depending in whether the card to be archived was the head, the tail, or a card in between or if it was the last card left in the quee. 

Now, with the introduction of the **head** and **tail** nodes, there is only one scenario, because the head and the tail node are there to stay, even in the case in which the queue is empty:

- we need to find the (previous) and the (next) nodes, immediately before and after (theCard) node, which is the node that we want to archive
- then, we need to connect (previous) and (next) with both a [NEXT_CARD] and a [PREV_CARD] relationship
- then, we need to delete all the relationships that were connecting (theCard) to the (previous) and (next) nodes

The resulting cypher query can be subdivided in three distinct parts. The first part is in charge of finding (theArchive) node, given the ID of (theCard) node: 

    MATCH (theCard)<-[:NEXT_CARD|HEAD_CARD*]-(l:List)<-[:NEXT_LIST*]-(h)<-[:HEAD_LIST]-(p:Project)-[:ARCHIVE]->(theArchive:Archive) 
    WHERE ID(theCard)={{cardId}}
    
Next, we execute the logic that I described few lines earlier:    
    
    WITH theCard, theArchive
    MATCH (previous)-[ptc:NEXT_CARD]->(theCard)-[tcn:NEXT_CARD]->(next)-[ntc:PREV_CARD]->(theCard)-[tcp:PREV_CARD]->(previous)
    WITH theCard, theArchive, previous, next, ptc, tcn, ntc, tcp
    CREATE (previous)-[:NEXT_CARD]->(next)-[:PREV_CARD]->(previous)
    DELETE ptc, tcn, ntc, tcp

Finally, we insert (theCard) at the tail of the archive queue:
    
    WITH theCard, theArchive
    MATCH (theArchive)-[tat:TAIL_CARD]->(archiveTail)-[tp:PREV_CARD]->(archivePrevious)-[pt:NEXT_CARD]->(archiveTail) 
    WITH theCard, theArchive, archiveTail, tp, pt, archivePrevious
    CREATE (archiveTail)-[:PREV_CARD]->(theCard)-[:NEXT_CARD]->(archiveTail)
    CREATE (theCard)-[:PREV_CARD]->(archivePrevious)-[:NEXT_CARD]->(theCard)
    DELETE tp,pt
    RETURN theCard
    
### Performance

I am very satisfied with how much simpler the new queries are, both to write and to understand, when compared to the older one discussed in the previous post of this series. At this point Wes suggested to run some performance tests. The results can be found below. Not much of a difference from a performance point of view - especially because this was an end-to-end performance test, calling N times the server, executing one insertion/archival at a time.
I ran each test three times, with the individual times in columns **TIME 1**, **TIME 2** and **TIME 3**.

#### Using the New Architecture
##### TEST #1: INSERT (n) CARDS (in the same list)
<table>
<tr><td># CARDS</td><td>TIME 1 (ms)</td><td>TIME 2 (ms)</td><td>TIME 3 (ms)</td></tr>
<tr><td>10</td><td>77</td><td>56</td><td>58</td></tr>
<tr><td>100</td><td>552</td><td>534</td><td>526</td></tr>
<tr><td>1000</td><td>5133</td><td>4978</td><td>4903</td></tr>
<tr><td>10000</td><td>51342</td><td>51454</td><td>54709</td></tr>
</table>

##### TEST #2: ARCHIVE (n) CARDS (from the same list)
<table>
<tr><td># CARDS</td><td>TIME 1 (ms)</td><td>TIME 2 (ms)</td><td>TIME 3 (ms)</td></tr>
<tr><td>10</td><td>54</td><td>56</td><td>55</td></tr>
<tr><td>100</td><td>509</td><td>402</td><td>377</td></tr>
<tr><td>1000</td><td>3395</td><td>3508</td><td>2903</td></tr>
<tr><td>10000</td><td>27675</td><td>23381</td><td>22312</td></tr>
</table>

#### Using the Old Queries
##### TEST #3: INSERT (n) CARDS (in the same list)
<table>
<tr><td># CARDS</td><td>TIME 1 (ms)</td><td>TIME 2 (ms)</td><td>TIME 3 (ms)</td></tr>
<tr><td>10</td><td>116</td><td>118</td><td>111</td></tr>
<tr><td>100</td><td>1019</td><td>996</td><td>899</td></tr>
<tr><td>1000</td><td>7673</td><td>6262</td><td>6200</td></tr>
<tr><td>10000</td><td>62680</td><td>55663</td><td>58081</td></tr>
</table>

##### TEST #4: ARCHIVE (n) CARDS (from the same list)
<table>
<tr><td># CARDS</td><td>TIME 1 (ms)</td><td>TIME 2 (ms)</td><td>TIME 3 (ms)</td></tr>
<tr><td>10</td><td>148</td><td>133</td><td>124</td></tr>
<tr><td>100</td><td>954</td><td>784</td><td>676</td></tr>
<tr><td>1000</td><td>4958</td><td>3950</td><td>3539</td></tr>
<tr><td>10000</td><td>26921</td><td>23908</td><td>22942</td></tr>
</table>

### Conclusions
I hope you find this post interesting as I found working through this exercise. I want to thank again Wes for his remote help (via Twitter and Stack Overflow) in this interesting (at least to me) experiment.