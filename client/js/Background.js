/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var Background = (function (window, document) {
	"use strict";

	function Background(game) {
		this.game = game;

		this.pos = 0;

		this.img1 = this.game.assets.get("assets/img/background.png");
		this.tile1W = this.img1.width;
		this.tile1H = this.img1.height;
		this.tile1WScaled = this.tile1W * this.game.scale;
		this.tile1HScaled = this.tile1H * this.game.scale;

		this.img2 = this.game.assets.get("assets/img/background2.png");
		this.tile2W = this.img2.width;
		this.tile2H = this.img2.height;
		this.tile2WScaled = this.tile2W * this.game.scale;
		this.tile2HScaled = this.tile2H * this.game.scale;

		this.leastMultipleWidth = Util.lcm([
			this.tile1WScaled * 4,
			//this.tile2WScaled * 2,
			this.tile2WScaled
		]);
	}

	Background.prototype.draw = function () {
		this.pos += this.game.frameDistance;

		if(this.pos > this.leastMultipleWidth) {
			this.pos %= this.leastMultipleWidth;
		}

		var pos1 = this.pos / 4,
		//pos3 = this.pos / 2,
			pos2 = this.pos / 1;

		var x, y;
		for(y = 0; y < this.game.h; y += this.tile1HScaled) {
			for(x = -pos1; x < this.game.w; x += this.tile1WScaled) {
				this.game.ctx.drawImage(
					this.img1,
					0, 0,
					this.tile1W, this.tile1H,
					x, y,
					this.tile1WScaled, this.tile1HScaled
				);
			}
		}

		//for(y = this.game.h - this.tile2HScaled; y < this.game.h; y += this.tile2HScaled) {
		//	for(x = -pos3; x < this.game.w; x += this.tile2WScaled) {
		//		this.game.ctx.drawImage(
		//			this.img2,
		//			0, 0,
		//			this.tile2W, this.tile2H,
		//			x, y,
		//			this.tile2WScaled, this.tile2HScaled
		//		);
		//	}
		//}

		for(y = this.game.h - this.tile2HScaled; y < this.game.h; y += this.tile2HScaled) {
			for(x = -pos2; x < this.game.w; x += this.tile2WScaled) {
				this.game.ctx.drawImage(
					this.img2,
					0, 0,
					this.tile2W, this.tile2H,
					x, y,
					this.tile2WScaled, this.tile2HScaled
				);
			}
		}
	};

	return Background;
})(window, document);
