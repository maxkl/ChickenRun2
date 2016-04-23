/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

var StartScene = (function (window, document) {
	"use strict";

	registerScene("start", StartScene);

	/**
	 *
	 * @param {Game} game
	 * @constructor
	 */
	function StartScene(game) {
		this.game = game;

		this.speed = 50;

		this.background = null;

		this.$overlay = document.getElementById("start-overlay");
		this.$startButton = document.getElementById("start-button");
	}

	StartScene.prototype.load = function () {
		var game = this.game;

		this.background = new Background(game);

		this.$overlay.classList.remove("hidden");

		this.$startButton.onclick = function () {
			game.loadScene("main");
		}
	};

	StartScene.prototype.unload = function () {
		this.$overlay.classList.add("hidden");
		this.$startButton.onclick = null;
	};
	
	StartScene.prototype.render = function () {
		var game = this.game;

		var scale = game.scale;

		// background overwrites the last frame
		this.background.draw(this.speed * game.deltaTime * scale);
	};

	return StartScene;
})(window, document);
