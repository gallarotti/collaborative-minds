collaborativeMindsApp.service("CardsSvc", function($resource) {
    return $resource("http://localhost:3000/cards/:listId", {listId:"@id"},
        {
	        getListCards: {
	            method: "GET", 
	            isArray:true, 
	            url:"http://localhost:3000/cards/:listId", 
	            params:{listId:"@listId"}
	        },            
            save: {
            	method:'POST',
            	isArray:true
            }
        }
    );
});