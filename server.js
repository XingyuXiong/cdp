const EVENTS = require('events');
const HTTP = require("http");
const URL = require("url");
const FS = require("fs");
const WS = require('ws');

////////////////////////////// test /////////////////////////////////////
//                                                                     //
var card_type = ['JB', 'JR'];
['S','H','C','D'].forEach( (s, i) => { 
	['A','2','3','4','5','6','7','8','9','T','J','Q','K'].forEach( (r, j) => {
		card_type.push(s + r); }); });
var card_list = {};
card_type.forEach( (t, i) => {
	card_list['c'+i] = { type:t,
						 loc:{ pile:'desk',
							   pos:{ x:100*Math.random()-10,
									 y:100*Math.random()-10
} } } });
//                                                                     //
/////////////////////////////////////////////////////////////////////////

const hserver = HTTP.createServer( (request, response) => {
	response.writeHead(200, {"Content-Type": "text/html"});
    getHTML(response);
}).listen(8080);
const wsserver = new WS.Server({ server: hserver });


const eventEmitter = new EVENTS.EventEmitter();
wsserver.on('connection', (conn) => {
	console.log("new connection");
	conn.on('message', ((theconn) => {
		return ((msg) => {
			var m = JSON.parse(msg.toString());
			eventEmitter.emit(m['type'], theconn, m['content']);
		});
	})(conn));
	conn.on('close', () => { console.log("connection lost"); });
	conn.on('error', (ev) => { console.log('error' + ev); });
});


eventEmitter.on('login', (conn, username) => {
	console.log(username + " has just logged in!");
	sendScript(conn, "frame\\default.js");
	sendScript(conn, "cards\\default.js");
});
function getHTML(res){
    FS.readFile('script.js', (err, jsdata) => {
        if(err) return console.log(err);
        FS.readFile('cdp.html', (err, htmldata) => {
			if(err) return console.log(err);
			var script = ">\n" + jsdata.toString() + "\n";
			var html = htmldata.toString().replace('src="script.js">', script);
			res.end(html);
		});
    });
}
function sendScript(conn, path){
    FS.readFile(path, (err, text) => {
        if(err) return console.log(err);
		var t = { type:'script', content:text.toString() };
        conn.send(JSON.stringify(t));
    });
}
////////////////////////////// test /////////////////////////////////////
//                                                                     //
eventEmitter.on('ready', (conn, _) => {
	var t = { type:'sync', content:card_list };
	conn.send(JSON.stringify(t));
});
//                                                                     //
/////////////////////////////////////////////////////////////////////////


eventEmitter.on('chat', (conn, text) => {
	var username = "xjp";
	console.log(username + " says: " + text);
	var t = { type:'chat', content:{ username:username, text:text } };
	wsserver.clients.forEach( (cli) => { cli.send(JSON.stringify(t)); });
});

////////////////////////////// test /////////////////////////////////////
//                                                                     //
eventEmitter.on('move', (conn, data) => {
	data.cards.forEach( (id, _) => { card_list[id].loc = data.toloc; });
	var t = { type:'move', content:data };
	wsserver.clients.forEach( (cli) => { cli.send(JSON.stringify(t)); });
});
//                                                                     //
/////////////////////////////////////////////////////////////////////////