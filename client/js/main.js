/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

(function () {
	"use strict";

	function init() {
		var canvas = document.getElementById("canvas"),
			backgroundCanvas = document.getElementById("background");

		var game = new Game(canvas, backgroundCanvas);

		game.start();
	}

	Util.onReady(init);

})();