/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var Chicken = (function (window, document) {
	"use strict";

	registerResources("json", [
		"assets/sprites/chicken.json"
	]);
	registerResources("img", [
		"assets/img/chicken.png"
	]);

	function Chicken(game) {
		this.game = game;
		var scale = game.scale;
		var json = this.game.assets.get("assets/sprites/chicken.json");
		this.sprite = new Sprite(
			game,
			game.assets.get("assets/img/chicken.png"),
			json,
			scale,
			game.frameTime
		);

		this.sprite.setAnimation("run");

		this.w = this.sprite.sw;
		this.h = this.sprite.sh;
		this.x = game.w / 3 - this.w / 2;
		this.groundY = game.h - this.h;
		this.y = this.groundY;
		
		this.collider = new Collider(this.x + this.w / 2, this.y + this.w / 2, json.collider.radius * scale);

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

		this.collider.updatePosition(this.x + this.w / 2, this.y + this.h / 2);

		this.sprite.render(this.x, this.y);
	};

	return Chicken;
})(window, document);
