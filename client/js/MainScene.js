/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

var MainScene = (function (window, document) {
	"use strict";

	registerScene("main", MainScene);

	function MainScene(game) {
		this.game = game;
		
		this.startSpeed = 120;
		this.speed = 0;
		// this.acceleration = 1.5 / 1000; // 2 px/s^2

		this.hayBales = null;
		this.nextHayBaleTime = 0;

		this.background = null;

		// Entities
		this.chicken = null;
		// this.badMan = null;
	}

	MainScene.prototype.getNextHayBaleTime = function () {
		return this.game.now + (this.startSpeed / this.speed) * (Math.random() * 2000 + 2000);
	};

	MainScene.prototype.load = function () {
		var game = this.game;

		this.speed = this.startSpeed;

		this.background = new Background(game);

		this.chicken = new Chicken(game);
		// this.badMan = new BadMan(game);

		this.hayBales = [];

		this.nextHayBaleTime = this.getNextHayBaleTime();
	};

	MainScene.prototype.update = function () {
		var game = this.game;
		
		if(game.now >= this.nextHayBaleTime) {
			this.nextHayBaleTime = this.getNextHayBaleTime();

			// TODO: prevent gc
			this.hayBales.push(new HayBale(game));
		}

		if(
			(game.input.mousePressed || game.input.keyDown[32])
			&& !this.chicken.jumping
		) {
			this.chicken.jump();
			game.audio.playSoundEffect("jump");
		}
	};
	
	MainScene.prototype.render = function () {
		console.log("render");

		var game = this.game;

		var scale = game.scale;
		
		// v = a * t + v0
		//this.speed += this.acceleration * game.deltaTime;
		// s = v * t
		var frameDistance = this.speed * game.deltaTime * scale;

		this.update();

		// background overwrites the last frame
		this.background.draw(frameDistance);

		var chicken = this.chicken;
		chicken.draw();

		var hayBales = this.hayBales;
		var n = hayBales.length;
		while(n--) {
			var hayBale = hayBales[n];

			if(hayBale.x + hayBale.w < 0) {
				// TODO: prevent gc
				hayBales.splice(n, 1);
			} else {
				hayBale.draw(frameDistance);

				var chickenCollider = chicken.collider;
				var hayBaleCollider = hayBale.collider;
				if(chickenCollider.checkCollision(hayBaleCollider)) {
					game.loadScene("start");
					console.log("dead");
				}
			}
		}

		// this.badMan.draw();
	};

	return MainScene;
})(window, document);
