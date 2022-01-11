// cards initializer
document.body.innerHTML = '<p id="p_initcards" class="loadingsign">Drawing cards</p>\n' + document.body.innerHTML;

//simple unicode text style
function init_cards(){
	let WINDOW_WIDTH = document.documentElement.clientWidth,
		WINDOW_HEIGHT = document.documentElement.clientHeight,
		CARD_WIDTH = Math.round(Math.min(WINDOW_WIDTH, WINDOW_HEIGHT) / 7),
		CARD_HEIGHT = Math.round(CARD_WIDTH * 1.4992);
	let css = "";
	let s_p = "position:absolute;font-size:" + CARD_HEIGHT + "px;top:-" + 23 + "%;left:-" + 1 + "%;";
	css += (".BK:after{content:\"\\1f0a0\";color:#000000;" + s_p + "}");
	css += (".JB:after{content:\"\\1f0df\";color:#000000;" + s_p + "}");
	css += (".JR:after{content:\"\\1f0bf\";color:#CC0000;" + s_p + "}");
	let suit_list = ['S','H','C','D'];
	let rank_list = ['N','A','2','3','4','5','6','7','8','9','T','J','C','Q','K'];
	suit_list.forEach( (s, i) => {
		let c = "color:#" + (i<2 ? (i<1 ? "003366" : "CC0000") : (i<3 ? "CC6633" : "000000")) + ";";
		i += 10;
		rank_list.forEach( (r, j) => {
			css += ("." + s + r + ":after{content:\"\\1f0" + i.toString(16) + j.toString(16) + "\";" + c + s_p + "}");
		});
	});
	if(document.getElementById("css_cards") === null)
		document.body.innerHTML += "<style id=\"css_cards\"></style>";
	document.getElementById("css_cards").innerText = css;
}

//simple unicode svg style
// function init_cards(){
	// let css = "";
	// let c1 = "{background:url(\"data:image/svg+xml,%3Csvg width='100' height='150' xmlns='http://www.w3.org/2000/svg'%3E %3Ctext transform='matrix(7.5 0 0 7.2 -9 135)' font-size='24' fill='%23";
	// let c2 = "%3C/text%3E %3C/svg%3E\");background-size:cover;}";
	// css += (".BK" + c1 + "000000'%3E" + String.fromCharCode(55356,56480) + c2);
	// css += (".JB" + c1 + "000000'%3E" + String.fromCharCode(55356,56543) + c2);
	// css += (".JR" + c1 + "CC0000'%3E" + String.fromCharCode(55356,56511) + c2);
	// let suit_list = ['S','H','C','D'];
	// let rank_list = ['N','A','2','3','4','5','6','7','8','9','T','J','C','Q','K'];
	// suit_list.forEach( (s, i) => {
		// let c = (i<2 ? (i<1 ? "003366" : "CC0000") : (i<3 ? "CC6633" : "000000"));
		// rank_list.forEach( (r, j) => {
			// css += ("." + s + r + c1 + c + "'%3E" + String.fromCharCode(55356,56480+16*i+j) + c2);
		// });
	// });
	// if(document.getElementById("css_cards") === null)
		// document.body.innerHTML += "<style id=\"css_cards\"></style>";
	// document.getElementById("css_cards").innerText = css;
// }

init_cards();
document.getElementById("p_initcards").remove();
