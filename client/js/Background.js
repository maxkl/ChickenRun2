/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var Background = (function (window, document) {
	"use strict";

	registerResources("img", [
		"assets/img/sky.png",
		"assets/img/hills.png",
		"assets/img/grass.png"
	]);

	/**
	 *
	 * @param {Game} game
	 * @constructor
	 */
	function Background(game) {
		this.game = game;

		var scale = game.scale;

		this.img1 = game.assets.get("assets/img/sky.png");
		this.tile1W = this.img1.width;
		this.tile1H = this.img1.height;
		this.tile1WScaled = this.tile1W * scale;
		this.tile1HScaled = this.tile1H * scale;
		this.pos1 = 0;

		this.img2 = game.assets.get("assets/img/hills.png");
		this.tile2W = this.img2.width;
		this.tile2H = this.img2.height;
		this.tile2WScaled = this.tile2W * scale;
		this.tile2HScaled = this.tile2H * scale;
		this.pos2 = 0;

		this.img3 = game.assets.get("assets/img/grass.png");
		this.tile3W = this.img3.width;
		this.tile3H = this.img3.height;
		this.tile3WScaled = this.tile3W * scale;
		this.tile3HScaled = this.tile3H * scale;
		this.pos3 = 0;
	}

	Background.prototype.draw = function () {
		var game = this.game;
		var ctx = game.ctx;

		var frameDistance = game.frameDistance;

		var x, y;

		// Sky
		this.pos1 += frameDistance / 4;
		if(this.pos1 > this.tile1WScaled) this.pos1 -= this.tile1WScaled;
		for(y = 0; y < game.h; y += this.tile1HScaled) {
			for(x = -this.pos1; x < game.w; x += this.tile1WScaled) {
				ctx.drawImage(
					this.img1,
					0, 0,
					this.tile1W, this.tile1H,
					x, y,
					this.tile1WScaled, this.tile1HScaled
				);
			}
		}

		// Hills
		this.pos2 += frameDistance / 2;
		if(this.pos2 > this.tile2WScaled) this.pos2 -= this.tile2WScaled;
		y = game.h - this.tile2HScaled;
		for(x = -this.pos2; x < game.w; x += this.tile2WScaled) {
			ctx.drawImage(
				this.img2,
				0, 0,
				this.tile2W, this.tile2H,
				x, y,
				this.tile2WScaled, this.tile2HScaled
			);
		}

		// Grass
		this.pos3 += frameDistance;
		if(this.pos3 > this.tile3WScaled) this.pos3 -= this.tile3WScaled;
		y = game.h - this.tile3HScaled;
		for(x = -this.pos3; x < game.w; x += this.tile3WScaled) {
			ctx.drawImage(
				this.img3,
				0, 0,
				this.tile3W, this.tile3H,
				x, y,
				this.tile3WScaled, this.tile3HScaled
			);
		}
	};

	return Background;
})(window, document);
