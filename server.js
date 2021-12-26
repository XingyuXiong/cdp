const http = require("http");
const url = require("url");
const fs = require("fs");
const ws = require('nodejs-websocket')

record = "";

var wss = ws.createServer( (connection) => {
	connection.on('connect', (msg) => {
		console.log(msg.toString());
	});
	connection.on('text', (msg) => {
		console.log('Received text: ' + msg);
		record += (msg + "\n");
		wss.connections.forEach( (conn) => {
			conn.sendText(record);
		});
	})
	connection.on('error', (msg) => {
		console.log('error' + msg);
    });
});

wss.listen(888);

function getHTML(res){
    fs.readFile('cdp.js', (err, jsdata) => {
        if(err) return console.log(err);
        fs.readFile('cdp.html', (err, htmldata) => {
			if(err) return console.log(err);
			let script = "<script>\n" + jsdata.toString() + "\n</script>";
			let html = htmldata.toString().replace("<script src=\"cdp.js\"></script>", script);
			res.end(html);
			return html;
		});
    });
}

http.createServer( (request, response) => {
	response.writeHead(200, {"Content-Type": "text/html"});
    let h = getHTML(response);
}).listen(8888);