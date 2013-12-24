collaborativeMindsApp.service("CardsSvc", function($resource) {
    return $resource("http://localhost:3000/cards/:listId", {listId:"@id"},
        {
            query: {method: "GET", isArray:true},
	        getListCards: {
	            method: "GET", 
	            isArray:true, 
	            url:"http://localhost:3000/cards/:listId", 
	            params:{listId:"@listId"}
	        },            
	        get: {method: "GET", isArray:true},
            update: {method: "PUT"}
        }
    );
});