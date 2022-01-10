// frame initializer
document.body.innerHTML += '<p id="p_initframe" class="loadingsign">Loading frame</p>\n';

function init_frame(){
	let WINDOW_WIDTH = document.documentElement.clientWidth;
	let WINDOW_HEIGHT = document.documentElement.clientHeight;
	let CARD_WIDTH, CARD_HEIGHT, PLAYERBOX_WIDTH, PLAYERBOX_HEIGHT, PILE_WIDTH, PILE_HEIGHT;

	let css = "body{overflow:hidden;}";
	CARD_WIDTH = Math.round(Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / 7);
	CARD_HEIGHT = Math.round(CARD_WIDTH * 1.4992);
	let CARD_BORDER = Math.round(CARD_WIDTH * 0.02), CARD_RADIUS = Math.round(CARD_WIDTH * 0.06);
	css += ".Card{position:absolute;width:" + CARD_WIDTH + "px;height:" + CARD_HEIGHT + "px;border:" + CARD_BORDER + "px;border-radius:" + CARD_RADIUS + "px;background-color:lightblue;}";
	PLAYERBOX_WIDTH = PILE_WIDTH = CARD_WIDTH;
	PLAYERBOX_HEIGHT = PILE_HEIGHT = CARD_HEIGHT;
	css += ".Playerbox{position:absolute;width:" + PLAYERBOX_WIDTH + "px;height:" + PLAYERBOX_HEIGHT + "px;border:5px;border-radius:5px;background-color:lightblue;}";
	css += ".Pile{position:absolute;width:" + PILE_WIDTH + "px;height:" + PILE_HEIGHT + "px;border:4px;border-radius:2px;background-color:lightblue;}";
	
	if(document.getElementById("css_frame") === null)
		document.body.innerHTML += "<style id=\"css_frame\"></style>";
	document.getElementById("css_frame").innerText = css;
}

init_frame();
window.onresize = init_frame;

//events
function supress(ev){
	ev.preventDefault();
}
function startmove(elem, xs, ys){
	elem.style.zIndex = ++document.body.children[0].style.zIndex;
	let dx = parseFloat(elem.style.left) - xs,
		dy = parseFloat(elem.style.top) - ys;
	// return function for move event
	return (ev) => {
		elem.style.left = dx + ev.x + "px";
		elem.style.top = dy + ev.y + "px";
	};
}

ondragstart = onpointerstart = onpointermove = onpointerleave = onpointerend = onpointercancel = onpointerout = onpointerup = supress;
onpointerdown = (ev) => {
	ev.preventDefault();
	onpointermove = startmove(ev.target, ev.x, ev.y);
	
	onpointerleave = onpointerend = onpointercancel = onpointerout = onpointerup = (ev) => {
		onpointermove = onpointerleave = onpointerend = onpointercancel = onpointerout = onpointerup = supress;
	};
};

document.getElementById("p_initframe").remove();
