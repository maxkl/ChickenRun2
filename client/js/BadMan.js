/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var BadMan = (function (window, document) {
	"use strict";

	registerAssets("json", [
		"assets/sprites/knife-hand.json"
	]);
	registerAssets("img", [
		"assets/img/knife-hand.png"
	]);

	/**
	 *
	 * @param {Game} game
	 * @constructor
	 */
	function BadMan(game) {
		this.game = game;
		var scale = game.scale;
		var json = this.game.assets.get("assets/sprites/knife-hand.json");
		this.sprite = new Sprite(
			game,
			game.assets.get("assets/img/knife-hand.png"),
			json,
			scale,
			game.frameTime
		);

		this.w = this.sprite.sw;
		this.h = this.sprite.sh;
		this.x = 0;
		this.y = game.h - 80 * scale;
	}

	BadMan.prototype.draw = function () {
		this.sprite.render(this.x, this.y);
	};

	return BadMan;
})(window, document);
