var display_text = "Removing old frame\n";
document.getElementById('warning').innerText = display_text + document.getElementById('warning').innerText;
REMOVE_FRAME();
document.getElementById('warning').innerText = document.getElementById('warning').innerText.replace(display_text, "");


display_text = "Loading new frame\n";
document.getElementById('warning').innerText = display_text + document.getElementById('warning').innerText;

var WINDOW_WIDTH, WINDOW_HEIGHT, CARD_WIDTH, CARD_HEIGHT, PLAYERBOX_WIDTH, PLAYERBOX_HEIGHT, PILE_WIDTH, PILE_HEIGHT;

// chatbox
var chatbox = document.createElement("span");
chatbox.innerHTML = '<textarea id="cb_txa"></textarea>' + '<input id="cb_inp" class="Widget" placeholder="input text here">' + '<button id="cb_btn">send</button>';
chatbox.id = "chatbox";
document.body.appendChild(chatbox);

function send_chat(){
	var s = document.getElementById('cb_inp').value;
	if(s == '') return;
	document.getElementById('cb_inp').value = "";
	var t = JSON.stringify({ type:"chat", content:s });
	WEBSOCKET.send(t);
}
document.getElementById('cb_btn').onclick = send_chat;
onkeydown = (ev) => { if(ev.keyCode == 13) send_chat(); };

function received_chat(ce){
	var txa = document.getElementById('cb_txa');
	txa.value += `${ce.detail.username}: ${ce.detail.text}\n`;
	txa.scrollTop = txa.scrollHeight;
}
document.addEventListener("_chat", received_chat);

// css
function init_frame(){
	WINDOW_WIDTH = document.documentElement.clientWidth;
	WINDOW_HEIGHT = document.documentElement.clientHeight;
	CARD_WIDTH = Math.round(Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / 7);
	CARD_HEIGHT = Math.round(CARD_WIDTH * 1.4992);
	var CARD_BORDER = Math.round(CARD_WIDTH * 0.02), CARD_RADIUS = Math.round(CARD_WIDTH * 0.06);
	PLAYERBOX_WIDTH = PILE_WIDTH = CARD_WIDTH;
	PLAYERBOX_HEIGHT = PILE_HEIGHT = CARD_HEIGHT;
	var CHATBOX_WIDTH = Math.max(WINDOW_WIDTH*0.34, WINDOW_HEIGHT*0.21), CHATBOX_HEIGHT = Math.max(WINDOW_WIDTH*0.32, WINDOW_HEIGHT*0.6);
	
	var css = "body{overflow:hidden;}"
			+ ".Card{position:absolute;width:" + CARD_WIDTH + "px;height:" + CARD_HEIGHT + "px;border:" + CARD_BORDER + "px;border-radius:" + CARD_RADIUS + "px;background-color:lightblue;}"
			+ ".Playerbox{position:absolute;width:" + PLAYERBOX_WIDTH + "px;height:" + PLAYERBOX_HEIGHT + "px;border:5px;border-radius:5px;background-color:lightblue;}"
			+ ".Pile{position:absolute;width:" + PILE_WIDTH + "px;height:" + PILE_HEIGHT + "px;border:4px;border-radius:2px;background-color:lightblue;}"
			+ "#chatbox{position:absolute;width:" + CHATBOX_WIDTH + "px;height:" + CHATBOX_HEIGHT + "px;left:0px;top:0px;}"
			+ "#cb_txa{position:absolute;width:" + (CHATBOX_WIDTH-6) + "px;height:" + (CHATBOX_HEIGHT-0.15*CARD_HEIGHT) + "px;left:0px;top:0px;}"
			+ "#cb_inp{position:absolute;width:" + (CHATBOX_WIDTH-6) + "px;height:" + (0.15*CARD_HEIGHT) +"px;left:-2px;bottom:0px;}"
			+ "#cb_btn{position:absolute;width:" + (0.4*CARD_WIDTH) + "px;height:" + (0.18*CARD_HEIGHT) +"px;right:0px;bottom:0px;}";
	
	if(document.getElementById("css_frame") === null){
		var css_frame = document.createElement("style");
		css_frame.id = "css_frame";
		document.body.appendChild(css_frame);
	}
	document.getElementById("css_frame").innerText = css;
}
init_frame();
window.onresize = init_frame;
WEBSOCKET.send('{"type":"ready","content":""}');

//sync
function received_situation(ce){
	CARDS = ce.detail;
	for(var id in CARDS){
		if(CARDS[id].loc.pile == 'desk'){
			let celm = document.createElement("span");
			celm.id = id;
			celm.classList.add("Card");
			celm.classList.add(CARDS[id].type);
			celm.style.left = CARDS[id].loc.pos.x + "%";
			celm.style.top = CARDS[id].loc.pos.y + "%";
			celm.style.backgroundColor = "hsla(0,0%,90%,0.96)";
			celm.style.zIndex = ++MAXZ;
			document.body.appendChild(celm);
		}
	}
}
document.addEventListener("_sync", received_situation);


function received_movement(ce){
	var newloc = ce.detail.toloc;
	ce.detail.cards.forEach( (id, _) => { 
		CARDS[id].loc = newloc;
		if(newloc.pile == 'desk'){
			document.getElementById(id).style.left = newloc.pos.x + "%";
			document.getElementById(id).style.top = newloc.pos.y + "%";
		}
	});
}
document.addEventListener("_move", received_movement);

//events
function supress(ev){
	ev.preventDefault();
}
function moving(elem, xs, ys){
	elem.style.zIndex = ++MAXZ;
	var dx = parseFloat(elem.style.left) * WINDOW_WIDTH / 100 - xs,
		dy = parseFloat(elem.style.top) * WINDOW_HEIGHT / 100 - ys;
	// return function for move event
	return (ev) => {
		elem.style.left = 100 * (dx + ev.x) / WINDOW_WIDTH + "%";
		elem.style.top = 100 * (dy + ev.y) / WINDOW_HEIGHT + "%";
		ev.preventDefault();
	};
}
function movend(elem){
	return (ev) => {
		onpointermove = onpointerleave = onpointerend = onpointercancel = onpointerout = onpointerup = supress;
		var t = { type:"move", 
				  content:{ cards:[elem.id], 
							fromloc:'',
							toloc:{ pile:'desk', 
								 pos:{ x:parseFloat(elem.style.left), 
									   y:parseFloat(elem.style.top)
		} } } };
		WEBSOCKET.send(JSON.stringify(t));
	};
}

ondragstart = onpointerstart = onpointermove = onpointerleave = onpointerend = onpointercancel = onpointerout = onpointerup = supress;
onpointerdown = (ev) => {
	var obj = ev.target;
	if(obj.classList.contains("Card")){
		onpointermove = moving(ev.target, ev.x, ev.y);
		onpointerleave = onpointerend = onpointercancel = onpointerout = onpointerup = movend(ev.target);
	} else if(obj.classList.contains("Widget")){
		obj.focus();
	}
	ev.preventDefault();
};



// destructor of this module
REMOVE_FRAME = (() => {
	ondragstart = onpointerstart = onpointermove = onpointerleave = onpointerend = onpointercancel = onpointerout = onpointerup = onpointerdown = null;
	
	window.onresize = null;
	document.body.removeChild(document.getElementById("css_frame"));
	
	document.removeEventListener("_sync", received_situation);
	document.getElementsByClassName('Card').forEach( (e, i) => {
		document.body.removeChild(e);
	});
	
	document.removeEventListener("_chat", received_chat);
	onkeydown = null;
	document.body.removeChild(document.getElementById('chatbox'));
});

document.getElementById('warning').innerText = document.getElementById('warning').innerText.replace(display_text, "");