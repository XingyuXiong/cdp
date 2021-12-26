var TXAR = document.body.children[0];
var INPUT = document.body.children[1].children[0];
var BUTTON = document.body.children[1].children[1];
TXAR.value = "waiting for connection...";

let WEBSOCKET_PATH = "ws://localhost:888";
var WEBSOCKET = new WebSocket(WEBSOCKET_PATH);
WEBSOCKET.onmessage = function(ev){
	TXAR.value = ev.data;
};
TXAR.value = "";

BUTTON.onclick = (ev) => {
	let txt = INPUT.value;
	INPUT.value = "Sending...";
	WEBSOCKET.send(txt);
	INPUT.value = "";
};