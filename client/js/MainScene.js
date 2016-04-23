/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

var MainScene = (function (window, document) {
	"use strict";

	registerScene("main", MainScene);

	function MainScene(game) {
		this.game = game;

		this.hayBales = null;
		this.nextHayBaleTime = 0;
	}

	MainScene.prototype.getNextHayBaleTime = function () {
		var game = this.game;
		return game.now + (game.startSpeed / game.speed) * (Math.random() * 2000 + 2000);
	};

	MainScene.prototype.load = function () {
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
			&& !game.chicken.jumping
		) {
			game.chicken.jump();
			game.audio.playSoundEffect("jump");
		}
	};
	
	MainScene.prototype.render = function () {
		var game = this.game;
		
		// v = a * t + v0
		//game.speed = game.acceleration * game.passedTime + game.startSpeed;
		// s = v * t
		game.frameDistance = game.speed * game.deltaTime;

		this.update();

		// game overwrites the last frame
		game.background.draw();

		var chicken = game.chicken;
		chicken.draw();

		var hayBales = this.hayBales;
		var n = hayBales.length;
		while(n--) {
			var hayBale = hayBales[n];

			if(hayBale.x + hayBale.w < 0) {
				// TODO: prevent gc
				hayBales.splice(n, 1);
			} else {
				hayBale.draw();

				var chickenCollider = chicken.collider;
				var hayBaleCollider = hayBale.collider;
				if(chickenCollider.checkCollision(hayBaleCollider)) {
					game.loadScene("start");

					game.frameDistance = 0;
				}
			}
		}

		game.badMan.draw();
	};

	return MainScene;
})(window, document);
