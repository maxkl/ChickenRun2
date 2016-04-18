/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var Chicken = (function (window, document) {
	"use strict";

	function Chicken(game) {
		this.game = game;
		this.sprite = new Sprite(
			this.game,
			this.game.assets.get("assets/img/chicken.png"),
			this.game.assets.get("assets/sprites/chicken.json"),
			this.game.scale,
			this.game.frameTime
		);
		// this.collider =

		this.sprite.setAnimation("run");

		this.w = this.sprite.sw;
		this.h = this.sprite.sh;
		this.x = this.game.hw - this.w / 2;
		this.groundY = this.game.h - this.h;
		this.y = this.groundY;

		this.jumping = false;
		this.jumpSpeed = 0;
	}

	Chicken.prototype.jump = function () {
		if(!this.jumping) {
			this.jumping = true;

			this.jumpSpeed = 700;

			this.sprite.setAnimation("jump");
		}
	};

	Chicken.prototype.draw = function () {
		if(this.jumping) {
			this.jumpSpeed += this.game.gravity * this.game.deltaTime;
			this.y -= this.jumpSpeed * this.game.deltaTime;

			if(this.y > this.groundY) {
				this.y = this.groundY;

				this.jumping = false;

				this.sprite.setAnimation("run");
			}
		}

		this.sprite.render(this.x, this.y);
	};

	return Chicken;
})(window, document);
