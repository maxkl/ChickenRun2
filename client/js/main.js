/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */


var game;
function init() {
	var canvas = document.getElementById("canvas");

	game = new Game(canvas);

	game.start();
}

Util.onReady(init);
