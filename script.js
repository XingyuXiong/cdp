var PLAYERS = {}, CARDS = {}, DECKS = {},
	WEBSOCKET, WEBSOCKET_PATH, USERNAME,
	MAXZ = 0,
	REMOVE_FRAME = (() => {});

(async function init(){
document.getElementById('warning').innerText = "Initializing";

if(document.cookie == ''){
	USERNAME = prompt("Username:");
	if(USERNAME == '')
		USERNAME = String.fromCharCode(Math.random()*26+97,Math.random()*26+97,Math.random()*26+97);
	document.cookie = USERNAME;
} else {
	USERNAME = document.cookie;
}

async function retry(func, errfunc, time){
	while(true){
		try{
			func();
			break;
		} catch(ex){
			errfunc(ex);
			await new Promise( (resolve) => { setTimeout(resolve, time); } );
		}
	}
}

WEBSOCKET_PATH = "ws" + `${(location.protocol === 'https:') ? 's' : ''}` + "://" + `${document.location.hostname}` + ":" + `${document.location.port}`;

document.getElementById('warning').innerText = "Connecting to " + WEBSOCKET_PATH;
await retry( () => {
	WEBSOCKET = new WebSocket(WEBSOCKET_PATH);
}, (ex) => {
	console.log(ex);
	//alert("Connection failed!\n");
	document.getElementById('warning').innerText = "Unable to connect " + WEBSOCKET_PATH + ", retrying...";
}, 3000);

WEBSOCKET.onmessage = ((ev) => {
	var m = JSON.parse(ev.data.toString());
	var ce = new CustomEvent('_' + m['type'], {"detail":m['content']});
	//console.log(ce);
	document.dispatchEvent(ce);
});
// custom events name begin with '_'
document.addEventListener('_script', (e) => { new Function(e.detail)(); });

await retry( () => {
	document.getElementById('warning').innerText = "";
	WEBSOCKET.send(`{"type":"login","content":"${USERNAME}"}`);
}, (ex) => {
	document.getElementById('warning').innerText = "Logging in...";
}, 200);


})();