(async function init(){
document.body.innerHTML += '<p id="p_init" class="loadingsign">Initializing</p>\n'
						+ '<p id="p_webs" class="loadingsign">Connecting</p>\n';
// initialize data structures
var PLAYERS = [], PLAYER_TEMPLATE = {};
var CARDS = [], CARD_TEMPLATE = {};
var DECKS = [], DECK_TEMPLATE = {};
var MAXID = 65536;

var USERNAME = String.fromCharCode(Math.random()*26+97,Math.random()*26+97,Math.random()*26+97);
if(document.cookie == ''){
	USERNAME = prompt("Username:");
	document.cookie = USERNAME;
} else {
	USERNAME = document.cookie;
}

document.getElementById("p_init").remove();

// initialize websocket connection
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
function onreceive(ev){
	let m = JSON.parse(ev.data.toString());
	if(m['type'] == 'script'){
		//console.log(m['content']);
		(new Function(m['content']))(); //using "eval(m['data']);" is too slow
	} else if(m['type'] == 'data'){
		
		// to be continued...
		
	}
}

var WEBSOCKET, WEBSOCKET_PATH = "ws" + `${(location.protocol === 'https:') ? 's' : ''}` + "://" + `${document.location.hostname}` + ":" + `${document.location.port}`;
document.getElementById("p_webs").innerText = "Connecting to " + WEBSOCKET_PATH;

await retry( () => {
	WEBSOCKET = new WebSocket(WEBSOCKET_PATH);
	WEBSOCKET.onmessage = onreceive;
}, (ex) => {
	console.log(ex);
	//alert("Connection failed!\n");
	document.getElementById("p_webs").innerText = "Unable to connect, retrying...";
}, 3000);

await retry( () => {
	WEBSOCKET.send(`{"type":"login","content":"${USERNAME}"}`);
}, (ex) => {}, 200);

document.getElementById("p_webs").remove();

//test 

document.body.children[0].style.zIndex = 0; // maxz
function gendeck(){
	var WINDOW_WIDTH = document.documentElement.clientWidth;
	var WINDOW_HEIGHT = document.documentElement.clientHeight;
	var CARD_WIDTH = Math.round(Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / 7);
	var CARD_HEIGHT = Math.round(CARD_WIDTH * 1.4992);
	
	let card_list = ['JB', 'JR'];
	['S','H','C','D'].forEach( (s, i) => { 
		['A','2','3','4','5','6','7','8','9','T','J','Q','K'].forEach( (r, j) => {
			card_list.push(s + r); }); });
	card_list.forEach( (c, k) => {
		let card = document.createElement("span");
		card.id = ++MAXID;
		card.classList.add("Card");
		card.classList.add(c);
		card.style.left = Math.random() * (WINDOW_WIDTH - CARD_WIDTH) + "px";
		card.style.top = Math.random() * (WINDOW_HEIGHT - CARD_HEIGHT) + "px";
		card.style.backgroundColor = "hsla(0,0%,90%,0.96)";
		card.style.zIndex = ++document.body.children[0].style.zIndex;
		document.body.appendChild(card);
	});
	return true;
}
retry( () => {
	if(document.getElementById("css_frame") === null
	|| document.getElementById("css_cards") === null)
		throw "not ready";
	gendeck()
}, (ex) => {
}, 100);


})();