/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var HayBale = (function (window, document) {
	"use strict";

	registerAssets("json", [
		"assets/sprites/hay_bale.json"
	]);
	registerAssets("img", [
		"assets/img/hay_bale.png"
	]);

	function HayBale(game) {
		this.game = game;
		var scale = game.scale;
		var json = this.game.assets.get("assets/sprites/hay_bale.json");
		this.sprite = new Sprite(
			game,
			game.assets.get("assets/img/hay_bale.png"),
			json,
			scale,
			game.frameTime
		);

		this.w = this.sprite.sw;
		this.h = this.sprite.sh;
		this.x = game.w;
		this.y = game.h - this.h;

		this.collider = new Collider(this.x + this.w / 2, this.y + this.h / 2, json.collider.radius * scale);

		this.passed = false;
	}

	HayBale.prototype.draw = function (frameDistance) {
		this.x -= frameDistance;

		this.collider.updatePosition(this.x + this.w / 2, this.y + this.h / 2);

		this.sprite.render(this.x, this.y);
	};

	return HayBale;
})(window, document);
