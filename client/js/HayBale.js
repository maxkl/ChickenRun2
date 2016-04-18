/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var HayBale = (function (window, document) {
	"use strict";

	function HayBale(game) {
		this.game = game;
		this.sprite = new Sprite(
			this.game,
			this.game.assets.get("assets/img/hay_bale.png"),
			this.game.assets.get("assets/sprites/hay_bale.json"),
			this.game.scale,
			this.game.frameTime
		);

		this.w = this.sprite.sw;
		this.h = this.sprite.sh;
		this.x = this.game.w;
		this.y = this.game.h - this.h;
	}

	HayBale.prototype.draw = function () {
		this.x -= this.game.frameDistance;

		this.sprite.render(this.x, this.y);
	};

	return HayBale;
})(window, document);
