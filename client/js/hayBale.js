/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

function HayBale(game) {
	this.game = game;
	this.sprite = Sprite.create(
		this.game,
		this.game.assets.get("assets/img/pumpkin.png"),
		this.game.assets.get("assets/sprites/pumpkin.json"),
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
