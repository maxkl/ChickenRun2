/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var Chicken = (function (window, document) {
	"use strict";

	registerAssets("json", [
		"assets/sprites/chicken.json"
	]);
	registerAssets("img", [
		"assets/img/chicken.png"
	]);

	/**
	 *
	 * @param {Game} game
	 * @constructor
	 */
	function Chicken(game) {
		this.game = game;

		var scale = game.scale;

		var json = game.assets.get("assets/sprites/chicken.json");

		var sprite = this.sprite = new Sprite(
			game,
			game.assets.get("assets/img/chicken.png"),
			json,
			scale,
			game.frameTime
		);
		sprite.setAnimation("run");

		var w = this.w = sprite.sw;
		var h = this.h = sprite.sh;
		var x = this.x = game.w / 3 - w / 2;
		var groundY = this.groundY = game.h - h;
		var y = this.y = groundY;

		this.collider = new Collider(x + w / 2, y + h / 2, json.collider.radius * scale);
		
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
