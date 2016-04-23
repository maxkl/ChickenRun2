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
	}

	StartScene.prototype.load = function () {
		//
	};
	
	StartScene.prototype.render = function () {
		var game = this.game;

		if(game.input.mouseReleased) {
			game.loadScene("main");
			return;
		}

		// v = a * t + v0
		//game.speed = game.acceleration * game.passedTime + game.startSpeed;
		// s = v * t
		game.frameDistance = game.speed * game.deltaTime;

		// game overwrites the last frame
		game.background.draw();

		var chicken = game.chicken;
		chicken.draw();
	};

	return StartScene;
})(window, document);
