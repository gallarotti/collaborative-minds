collaborativeMindsApp.service("TestsSvc", function($resource) {
    return $resource("http://localhost:3000/cards/:listId", {listId:"@id"},
        {
            createMultiple: {
            	method:'POST',
            	isArray:false,
	            url:"http://localhost:3000/cards/tests/createMultiple"
            },
            archiveMultiple: {
            	method:'POST',
            	isArray:false,
	            url:"http://localhost:3000/cards/tests/archiveMultiple"
            }
        }
    );
});