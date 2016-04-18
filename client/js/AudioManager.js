/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var AudioManager = (function (window, document) {
	"use strict";

	function AudioManager() {
		this.player = new Audio("assets/sounds/soundtrack1.mp3");
		this.player.loop = true;
	}

	AudioManager.prototype.play = function () {
		this.player.play();
	};

	AudioManager.prototype.pause = function () {
		this.player.pause();
	};

	return AudioManager;
})(window, document);
