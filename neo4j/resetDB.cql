START n = node(*) 
MATCH n-[r]-() 
DELETE n, r 
WITH COUNT(n) AS hack

CREATE 
(mainApp:ApplicationSettings { name: "Collaborative Minds" }),

(headOfProjectsQueue:QueueHead),
(tailOfProjectsQueue:QueueTail),
(mainApp)-[:HEAD_PROJECT]->(headOfProjectsQueue),
(mainApp)-[:TAIL_PROJECT]->(tailOfProjectsQueue),

(project1:Project { name: "My First Project", company: "ABC Inc." }),
(project2:Project { name: "My Second Project", company: "ACME" }),
(project3:Project { name: "My Third Project", company: "XYZ Corp." }),

(headOfProjectsQueue)-[:NEXT_PROJECT]->(project1),
(project1)-[:NEXT_PROJECT]->(project2),
(project2)-[:NEXT_PROJECT]->(project3),
(project3)-[:NEXT_PROJECT]->(tailOfProjectsQueue),

(tailOfProjectsQueue)-[:PREV_PROJECT]->(project3),
(project3)-[:PREV_PROJECT]->(project2),
(project2)-[:PREV_PROJECT]->(project1),
(project1)-[:PREV_PROJECT]->(headOfProjectsQueue),



(project1_HeadOfListsQueue:QueueHead),
(project1_TailOfListsQueue:QueueTail),
(project1)-[:HEAD_LIST]->(project1_HeadOfListsQueue),
(project1)-[:TAIL_LIST]->(project1_TailOfListsQueue),

(project1_Archive:Archive),
(project1)-[:ARCHIVE]->(project1_Archive),

(project1_ToDoList:List { name: "To Do" }),
(project1_InProgressList:List { name: "In Progress" }),
(project1_DoneList:List { name: "Done" }),

(project1_HeadOfListsQueue)-[:NEXT_LIST]->(project1_ToDoList),
(project1_ToDoList)-[:NEXT_LIST]->(project1_InProgressList),
(project1_InProgressList)-[:NEXT_LIST]->(project1_DoneList),
(project1_DoneList)-[:NEXT_LIST]->(project1_TailOfListsQueue),

(project1_TailOfListsQueue)-[:PREV_LIST]->(project1_DoneList),
(project1_DoneList)-[:PREV_LIST]->(project1_InProgressList),
(project1_InProgressList)-[:PREV_LIST]->(project1_ToDoList),
(project1_ToDoList)-[:PREV_LIST]->(project1_HeadOfListsQueue),

(project1_ToDoList_HeadOfCardsQueue:QueueHead),
(project1_ToDoList_TailOfCardsQueue:QueueTail),
(project1_ToDoList)-[:HEAD_CARD]->(project1_ToDoList_HeadOfCardsQueue),
(project1_ToDoList)-[:TAIL_CARD]->(project1_ToDoList_TailOfCardsQueue),
(project1_ToDoList_HeadOfCardsQueue)-[:NEXT_CARD]->(project1_ToDoList_TailOfCardsQueue),
(project1_ToDoList_TailOfCardsQueue)-[:PREV_CARD]->(project1_ToDoList_HeadOfCardsQueue),

(project1_InProgressList_HeadOfCardsQueue:QueueHead),
(project1_InProgressList_TailOfCardsQueue:QueueTail),
(project1_InProgressList)-[:HEAD_CARD]->(project1_InProgressList_HeadOfCardsQueue),
(project1_InProgressList)-[:TAIL_CARD]->(project1_InProgressList_TailOfCardsQueue),
(project1_InProgressList_HeadOfCardsQueue)-[:NEXT_CARD]->(project1_InProgressList_TailOfCardsQueue),
(project1_InProgressList_TailOfCardsQueue)-[:PREV_CARD]->(project1_InProgressList_HeadOfCardsQueue),

(project1_DoneList_HeadOfCardsQueue:QueueHead),
(project1_DoneList_TailOfCardsQueue:QueueTail),
(project1_DoneList)-[:HEAD_CARD]->(project1_DoneList_HeadOfCardsQueue),
(project1_DoneList)-[:TAIL_CARD]->(project1_DoneList_TailOfCardsQueue),
(project1_DoneList_HeadOfCardsQueue)-[:NEXT_CARD]->(project1_DoneList_TailOfCardsQueue),
(project1_DoneList_TailOfCardsQueue)-[:PREV_CARD]->(project1_DoneList_HeadOfCardsQueue),



(project2_HeadOfListsQueue:QueueHead),
(project2_TailOfListsQueue:QueueTail),
(project2)-[:HEAD_LIST]->(project2_HeadOfListsQueue),
(project2)-[:TAIL_LIST]->(project2_TailOfListsQueue),

(project2_Archive:Archive),
(project2)-[:ARCHIVE]->(project2_Archive),

(project2_ToDoList:List { name: "To Do" }),
(project2_InProgressList:List { name: "In Progress" }),
(project2_DoneList:List { name: "Done" }),

(project2_HeadOfListsQueue)-[:NEXT_LIST]->(project2_ToDoList),
(project2_ToDoList)-[:NEXT_LIST]->(project2_InProgressList),
(project2_InProgressList)-[:NEXT_LIST]->(project2_DoneList),
(project2_DoneList)-[:NEXT_LIST]->(project2_TailOfListsQueue),

(project2_TailOfListsQueue)-[:PREV_LIST]->(project2_DoneList),
(project2_DoneList)-[:PREV_LIST]->(project2_InProgressList),
(project2_InProgressList)-[:PREV_LIST]->(project2_ToDoList),
(project2_ToDoList)-[:PREV_LIST]->(project2_HeadOfListsQueue),

(project2_ToDoList_HeadOfCardsQueue:QueueHead),
(project2_ToDoList_TailOfCardsQueue:QueueTail),
(project2_ToDoList)-[:HEAD_CARD]->(project2_ToDoList_HeadOfCardsQueue),
(project2_ToDoList)-[:TAIL_CARD]->(project2_ToDoList_TailOfCardsQueue),
(project2_ToDoList_HeadOfCardsQueue)-[:NEXT_CARD]->(project2_ToDoList_TailOfCardsQueue),
(project2_ToDoList_TailOfCardsQueue)-[:PREV_CARD]->(project2_ToDoList_HeadOfCardsQueue),

(project2_InProgressList_HeadOfCardsQueue:QueueHead),
(project2_InProgressList_TailOfCardsQueue:QueueTail),
(project2_InProgressList)-[:HEAD_CARD]->(project2_InProgressList_HeadOfCardsQueue),
(project2_InProgressList)-[:TAIL_CARD]->(project2_InProgressList_TailOfCardsQueue),
(project2_InProgressList_HeadOfCardsQueue)-[:NEXT_CARD]->(project2_InProgressList_TailOfCardsQueue),
(project2_InProgressList_TailOfCardsQueue)-[:PREV_CARD]->(project2_InProgressList_HeadOfCardsQueue),

(project2_DoneList_HeadOfCardsQueue:QueueHead),
(project2_DoneList_TailOfCardsQueue:QueueTail),
(project2_DoneList)-[:HEAD_CARD]->(project2_DoneList_HeadOfCardsQueue),
(project2_DoneList)-[:TAIL_CARD]->(project2_DoneList_TailOfCardsQueue),
(project2_DoneList_HeadOfCardsQueue)-[:NEXT_CARD]->(project2_DoneList_TailOfCardsQueue),
(project2_DoneList_TailOfCardsQueue)-[:PREV_CARD]->(project2_DoneList_HeadOfCardsQueue),



(project3_HeadOfListsQueue:QueueHead),
(project3_TailOfListsQueue:QueueTail),
(project3)-[:HEAD_LIST]->(project3_HeadOfListsQueue),
(project3)-[:TAIL_LIST]->(project3_TailOfListsQueue),

(project3_Archive:Archive),
(project3)-[:ARCHIVE]->(project3_Archive),

(project3_ToDoList:List { name: "To Do" }),
(project3_InProgressList:List { name: "In Progress" }),
(project3_DoneList:List { name: "Done" }),

(project3_HeadOfListsQueue)-[:NEXT_LIST]->(project3_ToDoList),
(project3_ToDoList)-[:NEXT_LIST]->(project3_InProgressList),
(project3_InProgressList)-[:NEXT_LIST]->(project3_DoneList),
(project3_DoneList)-[:NEXT_LIST]->(project3_TailOfListsQueue),

(project3_TailOfListsQueue)-[:PREV_LIST]->(project3_DoneList),
(project3_DoneList)-[:PREV_LIST]->(project3_InProgressList),
(project3_InProgressList)-[:PREV_LIST]->(project3_ToDoList),
(project3_ToDoList)-[:PREV_LIST]->(project3_HeadOfListsQueue),

(project3_ToDoList_HeadOfCardsQueue:QueueHead),
(project3_ToDoList_TailOfCardsQueue:QueueTail),
(project3_ToDoList)-[:HEAD_CARD]->(project3_ToDoList_HeadOfCardsQueue),
(project3_ToDoList)-[:TAIL_CARD]->(project3_ToDoList_TailOfCardsQueue),
(project3_ToDoList_HeadOfCardsQueue)-[:NEXT_CARD]->(project3_ToDoList_TailOfCardsQueue),
(project3_ToDoList_TailOfCardsQueue)-[:PREV_CARD]->(project3_ToDoList_HeadOfCardsQueue),

(project3_InProgressList_HeadOfCardsQueue:QueueHead),
(project3_InProgressList_TailOfCardsQueue:QueueTail),
(project3_InProgressList)-[:HEAD_CARD]->(project3_InProgressList_HeadOfCardsQueue),
(project3_InProgressList)-[:TAIL_CARD]->(project3_InProgressList_TailOfCardsQueue),
(project3_InProgressList_HeadOfCardsQueue)-[:NEXT_CARD]->(project3_InProgressList_TailOfCardsQueue),
(project3_InProgressList_TailOfCardsQueue)-[:PREV_CARD]->(project3_InProgressList_HeadOfCardsQueue),

(project3_DoneList_HeadOfCardsQueue:QueueHead),
(project3_DoneList_TailOfCardsQueue:QueueTail),
(project3_DoneList)-[:HEAD_CARD]->(project3_DoneList_HeadOfCardsQueue),
(project3_DoneList)-[:TAIL_CARD]->(project3_DoneList_TailOfCardsQueue),
(project3_DoneList_HeadOfCardsQueue)-[:NEXT_CARD]->(project3_DoneList_TailOfCardsQueue),
(project3_DoneList_TailOfCardsQueue)-[:PREV_CARD]->(project3_DoneList_HeadOfCardsQueue),

