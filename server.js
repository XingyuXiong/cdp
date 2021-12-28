const http = require("http");
const url = require("url");
const fs = require("fs");
const WebSocket = require('ws');

record = "";

function getHTML(res){
    fs.readFile('cdp.js', (err, jsdata) => {
        if(err) return console.log(err);
        fs.readFile('cdp.html', (err, htmldata) => {
			if(err) return console.log(err);
			let script = "<script>\n" + jsdata.toString() + "\n</script>";
			let html = htmldata.toString().replace("<script src=\"cdp.js\"></script>", script);
			res.end(html);
		});
    });
}

const hserver = http.createServer( (request, response) => {
	response.writeHead(200, {"Content-Type": "text/html"});
    getHTML(response);
}).listen(8080);
const wsserver = new WebSocket.Server({ server: hserver });

wsserver.on('connection', (conn) => {
	console.log("new connection");
	conn.on('message', (msg) => {
		console.log('Received text: \"' + msg + "\"");
		let txt = msg.toString() + "\n";
		record += txt;
		wsserver.clients.forEach( (cli) => {
			cli.send(txt);
		});
	})
	conn.on('close', () => {
		console.log("connection lost");
    });
	conn.on('error', (ev) => {
		console.log('error' + ev);
    });
	conn.send(record);
});
