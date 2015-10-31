/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

function Background(game, canvas, ctx) {
	this.game = game;

	this.canvas = canvas;
	this.ctx = ctx;

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
}

Background.prototype.draw = function () {
	var pos1 = (this.game.passedTime / 20) % this.tile1WScaled,
		pos2 = (this.game.passedTime / 5) % this.tile2WScaled;

	var x, y;
	for(y = 0; y < this.game.h; y += this.tile1HScaled) {
		for(x = -pos1; x < this.game.w; x += this.tile1WScaled) {
			this.ctx.drawImage(
				this.img1,
				0, 0,
				this.tile1W, this.tile1H,
				x, y,
				this.tile1WScaled, this.tile1HScaled
			);
		}
	}

	for(y = this.game.h - this.tile2HScaled; y < this.game.h; y += this.tile2HScaled) {
		for(x = -pos2; x < this.game.w; x += this.tile2WScaled) {
			this.ctx.drawImage(
				this.img2,
				0, 0,
				this.tile2W, this.tile2H,
				x, y,
				this.tile2WScaled, this.tile2HScaled
			);
		}
	}
};
