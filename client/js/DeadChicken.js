/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var DeadChicken = (function (window, document) {
	"use strict";

	registerAssets("img", [
		"assets/img/blood-stain.png"
	]);

	function DeadChicken(game) {
		this.game = game;
		var scale = game.scale;
		var img = this.game.assets.get("assets/img/blood-stain.png");
		this.img = img;

		this.w = img.width * scale;
		this.h = img.height * scale;
		this.x = 0;
		this.y = 0;
	}

	DeadChicken.prototype.draw = function () {
		this.game.ctx.drawImage(
			this.img,
			this.x, this.y,
			this.w, this.h
		);
	};

	return DeadChicken;
})(window, document);
