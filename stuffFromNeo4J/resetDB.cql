// Even better, before running this, stop neo4j and delete the current
// data folder. This way everything will be reset, including node IDs:
// -------------------------------------------------------------------
	// cd /usr/local/Cellar/neo4j/2.0.0/libexec/data
	// neo4j stop
	// rm -rf graph.db/
	// neo4j start
// -------------------------------------------------------------------

START n = node(*) 
MATCH n-[r]-() 
DELETE n, r 
WITH COUNT(n) AS hack
CREATE 
// create main application node
(mainApp:CollaborativeMinds { name: "Collaborative Minds" }),
// add 3 test projects
(proj1:Project { name: "My First Project", company: "ABC Inc." }),
(proj2:Project { name: "My Second Project", company: "ACME" }),
(proj3:Project { name: "My Third Project", company: "XYZ Corp." }),
(mainApp)-[:HEAD_PROJECT]->(proj1),
(mainApp)-[:TAIL_PROJECT]->(proj3),
(proj1)-[:NEXT_PROJECT]->(proj2),
(proj2)-[:NEXT_PROJECT]->(proj3),
(proj3)-[:PREV_PROJECT]->(proj2),
(proj2)-[:PREV_PROJECT]->(proj1),
// add 3 lists + archive list to the first project
(proj1ToDoList:List { name: "To Do" }),
(proj1InProgressList:List { name: "In Progress" }),
(proj1DoneList:List { name: "Done" }),
(proj1ArchiveList:List { name: "Archive" }),
(proj1)-[:ARCHIVE_LIST]->(proj1ArchiveList),
(proj1)-[:HEAD_LIST]->(proj1ToDoList),
(proj1)-[:TAIL_LIST]->(proj1DoneList),
(proj1ToDoList)-[:NEXT_LIST]->(proj1InProgressList),
(proj1InProgressList)-[:NEXT_LIST]->(proj1DoneList),
(proj1DoneList)-[:PREV_LIST]->(proj1InProgressList),
(proj1InProgressList)-[:PREV_LIST]->(proj1ToDoList),
(proj1ToDoList)-[:HEAD_CARD]->(proj1ToDoList),
(proj1ToDoList)-[:TAIL_CARD]->(proj1ToDoList),
(proj1InProgressList)-[:HEAD_CARD]->(proj1InProgressList),
(proj1InProgressList)-[:TAIL_CARD]->(proj1InProgressList),
(proj1DoneList)-[:HEAD_CARD]->(proj1DoneList),
(proj1DoneList)-[:TAIL_CARD]->(proj1DoneList),
// add 3 lists + archive list to the 2nd project
(proj2ToDoList:List { name: "To Do" }),
(proj2InProgressList:List { name: "In Progress" }),
(proj2DoneList:List { name: "Done" }),
(proj2ArchiveList:List { name: "Archive" }),
(proj2)-[:ARCHIVE_LIST]->(proj2ArchiveList),
(proj2)-[:HEAD_LIST]->(proj2ToDoList),
(proj2)-[:TAIL_LIST]->(proj2DoneList),
(proj2ToDoList)-[:NEXT_LIST]->(proj2InProgressList),
(proj2InProgressList)-[:NEXT_LIST]->(proj2DoneList),
(proj2DoneList)-[:PREV_LIST]->(proj2InProgressList),
(proj2InProgressList)-[:PREV_LIST]->(proj2ToDoList),
(proj2ToDoList)-[:HEAD_CARD]->(proj2ToDoList),
(proj2ToDoList)-[:TAIL_CARD]->(proj2ToDoList),
(proj2InProgressList)-[:HEAD_CARD]->(proj2InProgressList),
(proj2InProgressList)-[:TAIL_CARD]->(proj2InProgressList),
(proj2DoneList)-[:HEAD_CARD]->(proj2DoneList),
(proj2DoneList)-[:TAIL_CARD]->(proj2DoneList),
// add 3 lists + archive list to the 3rd project
(proj3ToDoList:List { name: "To Do" }),
(proj3InProgressList:List { name: "In Progress" }),
(proj3DoneList:List { name: "Done" }),
(proj3ArchiveList:List { name: "Archive" }),
(proj3)-[:ARCHIVE_LIST]->(proj3ArchiveList),
(proj3)-[:HEAD_LIST]->(proj3ToDoList),
(proj3)-[:TAIL_LIST]->(proj3DoneList),
(proj3ToDoList)-[:NEXT_LIST]->(proj3InProgressList),
(proj3InProgressList)-[:NEXT_LIST]->(proj3DoneList),
(proj3DoneList)-[:PREV_LIST]->(proj3InProgressList),
(proj3InProgressList)-[:PREV_LIST]->(proj3ToDoList),
(proj3ToDoList)-[:HEAD_CARD]->(proj3ToDoList),
(proj3ToDoList)-[:TAIL_CARD]->(proj3ToDoList),
(proj3InProgressList)-[:HEAD_CARD]->(proj3InProgressList),
(proj3InProgressList)-[:TAIL_CARD]->(proj3InProgressList),
(proj3DoneList)-[:HEAD_CARD]->(proj3DoneList),
(proj3DoneList)-[:TAIL_CARD]->(proj3DoneList)