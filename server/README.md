# collaborative-minds

This is the server side of the project.
The server side runs using ExpressJS, on top of Node.js. 
The backend uses a Neo4j graph DB -- TBD

With Node.js installed, the **server/package.json** defines the needed dependencies:

    "dependencies": {
        "express": "3.x",
        "neo4j-js": "0.0.7",
        "http-status": "0.1.4"
    }

To install those dependencies, CD to the **server** and run:

	npm install -d

Once npm finishes you'll have a localized Express 3.x dependency in the **server/node_modules** directory. 
To make sure that all dependencies are installed correctly, you can run:

    npm ls

and you should see **express**, **http-status** and **neo4j-js** all correctly installed

To start the server app, defined in **server/server.js**, simply CD to the **server** folder and run:

    node server.js

You should see some output and, at the end, the following message:

    Express server listening on port 3000...

