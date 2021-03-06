collaborativeMindsApp.service("CardsSvc", function($resource) {
    return $resource("http://localhost:3000/cards/:listId", {listId:"@id"},
        {
	        getListCards: {
	            method: "GET", 
	            isArray:true, 
	            url:"http://localhost:3000/cards/:listId", 
	            params:{listId:"@listId"}
	        },            
	        archiveCard: {
	            method: "POST", 
	            isArray:true, 
	            url:"http://localhost:3000/cards/archive"
	        },            
	        moveCard: {
	            method: "POST", 
	            isArray:true, 
	            url:"http://localhost:3000/cards/move"
	        },            
            create: {
            	method:'POST',
            	isArray:true
            }
        }
    );
});