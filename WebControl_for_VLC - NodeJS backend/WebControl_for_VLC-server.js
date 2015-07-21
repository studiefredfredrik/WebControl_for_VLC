// Configuration:
var PORT = 9999;
var COMMANDLIST_MAX_LENGTH = 10;

console.log('Starting server...');
var http = require('http');
var url = require('url') ;
var querystring = require('querystring');
var commandlist = [];

http.createServer(function(request, response){
	// Allow cross origin
    response.setHeader('Access-Control-Allow-Origin', '*');
	response.writeHead(200, {'Content-Type': 'text/html'});
	
	// Print back commandlist
	if (request.url == '/commandlist') {
		response.write(JSON.stringify(commandlist));
		commandlist = []; // Clear commandlist after sending
		response.end();
	}
		
	// Add commands to list	
	else if(request.url != '/favicon.ico'){ // Disregard requests for favicons, browsers make them by default
		if(commandlist.length <= COMMANDLIST_MAX_LENGTH){ // Avoid flooding the commandlist
			var array = (request.url).split('/')
			//commandlist.push((request.url).replace('/',''));
			console.log(array[1]);
			commandlist.push(array[1]);
			response.write('fine');
			response.end();
		}
		else{
			response.write('limit');
			response.end();
		}
	}
	console.log('Request: ' + request.url);
}).listen(PORT);
console.log('Listening on port ' + PORT);