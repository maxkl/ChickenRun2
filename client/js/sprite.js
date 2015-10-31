/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

function Sprite(game, img, w, h, scale, animations, frameTime) {
	this.game = game;

	this.img = img;
	this.w = w;
	this.h = h;
	this.scale = scale;
	this.animations = animations || {};
	this.frameTime = frameTime || 0;

	this.frame = 0;
	this.frames = 1;
	this.nextFrameTime = this.game.now + this.frameTime;
	this.x = 0;
	this.y = 0;

	this.sw = this.w * this.scale;
	this.sh = this.h * this.scale;

	if(this.animations["default"]) {
		this.setAnimation("default");
	}
}

Sprite.create = function (game, img, json, scale, frameTime) {
	return new Sprite(
		game,
		img,
		json.width,
		json.height,
		scale,
		json.animations,
		frameTime
	);
};

Sprite.prototype.setAnimation = function (name) {
	if(this.animations[name]) {
		var anim = this.animations[name];

		this.frames = anim.frames;
		this.y = this.h * anim.row;

		this.frame = 0;
		this.x = 0;
		this.nextFrameTime = this.game.now + this.frameTime;
	}
};

Sprite.prototype.render = function (x, y) {
	if(this.frames > 1 && this.game.now >= this.nextFrameTime) {
		this.frame++;
		if(this.frame >= this.frames) {
			this.frame = 0;
		}

		this.x = this.frame * this.w;
		this.nextFrameTime = this.game.now + this.frameTime;
	}

	this.game.ctx.drawImage(
		this.img,
		this.x, this.y,
		this.w, this.h,
		x, y,
		this.sw, this.sh
	);
};
