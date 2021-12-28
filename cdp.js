var NAME = document.body.children[0].children[1];
var TXAR = document.body.children[1];
var INPUT = document.body.children[2].children[0];
var BUTTON = document.body.children[2].children[1];
NAME.value = String.fromCharCode(97+Math.random()*26, 97+Math.random()*26, 97+Math.random()*26);
TXAR.value = "waiting for connection...";

var WEBSOCKET_PATH = `ws${location.protocol === 'https:' ? 's' : ''}://${document.location.hostname}:${document.location.port}`;

var WEBSOCKET = new WebSocket(WEBSOCKET_PATH);
WEBSOCKET.onmessage = function(ev){
	TXAR.value += (ev.data.toString());
	TXAR.scrollTop = TXAR.scrollHeight;
};
TXAR.value = "";

function sendText() {
	let txt = INPUT.value;
	if(txt === '') return;
	txt = NAME.value + ": " + txt;
	INPUT.value = "Sending...";
	WEBSOCKET.send(txt);
	INPUT.value = "";
}

BUTTON.onclick = (ev) => { sendText(); };
onkeydown = (ev) => { if(ev.keyCode == 13) sendText(); };