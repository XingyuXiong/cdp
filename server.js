const http = require("http");
const url = require("url");
const fs = require("fs");
const WebSocket = require('ws');

record = "";

function getHTML(res){
    fs.readFile('script.js', (err, jsdata) => {
        if(err) return console.log(err);
        fs.readFile('cdp.html', (err, htmldata) => {
			if(err) return console.log(err);
			let script = "<script>\n" + jsdata.toString() + "\n</script>";
			let html = htmldata.toString().replace("<script src=\"script.js\"></script>", script);
			res.end(html);
		});
    });
}

function sendScript(conn, path){
    fs.readFile(path, (err, text) => {
        if(err) return console.log(err);
		let t = { type:'script', content:text.toString()};
        conn.send(JSON.stringify(t));
    });
}

const hserver = http.createServer( (request, response) => {
	response.writeHead(200, {"Content-Type": "text/html"});
    getHTML(response);
}).listen(8080);
const wsserver = new WebSocket.Server({ server: hserver });

wsserver.on('connection', (conn) => {
	console.log("new connection");
	conn.on('message', ((theconn) => {
		// use closure to reply more easily
		return (msg) => { onreceive(theconn, msg); }; 
	})(conn));
	conn.on('close', () => { console.log("connection lost"); });
	conn.on('error', (ev) => { console.log('error' + ev); });
});

function onreceive(conn, msg){
	let m = JSON.parse(msg.toString());
	if(m['type'] == 'login'){
		console.log(m['content'] + " has just logged in!");
		sendScript(conn, "frame\\default.js");
		sendScript(conn, "cards\\default.js");
	} else if(m['type'] == 'data'){
		
		// to be continued...
		
	}
}
