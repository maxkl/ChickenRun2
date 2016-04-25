/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

var MainScene = (function (window, document) {
	"use strict";

	registerScene("main", MainScene);

	registerAssets("audio", [
		"assets/sounds/effects/short-chicken-gack.mp3",
		"assets/sounds/effects/badum-tss.mp3"
	]);

	// TODO: credits & github link on start screen

	/**
	 * 
	 * @param {Game} game
	 * @constructor
	 */
	function MainScene(game) {
		this.game = game;

		this.$gameoverOverlay = document.getElementById("gameover-overlay");
		this.$gameoverScore = document.getElementById("gameover-score");
		this.$gameoverHighscore = document.getElementById("gameover-highscore");

		this.running = true;
		
		this.startSpeed = 120;
		this.speed = 0;

		this.hayBales = null;
		this.nextHayBaleTime = 0;

		this.background = null;

		// Entities
		this.chicken = null;

		this.$score = document.getElementById("score");
		this.$highscore = document.getElementById("highscore");
		this.score = 0;
		this.highscore = 0;

		this.registerListeners();
	}

	MainScene.prototype.registerListeners = function () {
		var game = this.game;

		var $back = document.getElementById("gameover-back");
		$back.addEventListener("click", function () {
			game.loadScene("start");
		});

		var $retry = document.getElementById("gameover-retry");
		$retry.addEventListener("click", function () {
			game.loadScene("main");
		});
	};

	MainScene.prototype.getNextHayBaleTime = function () {
		return this.game.now + (this.startSpeed / this.speed) * (Math.random() * 2000 + 2000);
	};

	MainScene.prototype.load = function () {
		var game = this.game;

		this.running = true;

		this.speed = this.startSpeed;

		this.background = new Background(game);

		this.chicken = new Chicken(game);

		this.hayBales = [];
		this.nextHayBaleTime = this.getNextHayBaleTime();

		this.score = 0;
		this.$score.innerHTML = this.score;
		this.$score.classList.add("visible");
		this.highscore = game.storage.get("highscore", 0);
		this.$highscore.innerHTML = this.highscore;
		this.$highscore.classList.add("visible");
	};

	MainScene.prototype.unload = function () {
		this.$score.classList.remove("visible");
		this.$highscore.classList.remove("visible");
		this.$gameoverOverlay.classList.remove("visible");
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
		}
	};

	MainScene.prototype.gameOver = function () {
		this.running = false;

		game.audio.playSoundEffect("badum-tss");

		this.$score.classList.remove("visible");
		this.$highscore.classList.remove("visible");

		this.$gameoverOverlay.classList.add("visible");
		this.$gameoverScore.innerHTML = this.score;
		this.$gameoverHighscore.innerHTML = this.highscore;
	};

	MainScene.prototype.incrementScore = function () {
		var game = this.game;

		game.audio.playSoundEffect("short-chicken-gack");

		this.score++;
		this.$score.innerHTML = this.score;
		
		if(this.score > this.highscore) {
			this.highscore = this.score;
			game.storage.set("highscore", this.highscore);
			this.$highscore.innerHTML = this.highscore;
		}
	};
	
	MainScene.prototype.render = function () {
		if(this.running) {
			var game = this.game;

			var scale = game.scale;

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

					if(!hayBale.passed) {
						if(hayBale.x + hayBale.w < chicken.x) {
							hayBale.passed = true;
							this.incrementScore();
						}

						var chickenCollider = chicken.collider;
						var hayBaleCollider = hayBale.collider;
						if(chickenCollider.checkCollision(hayBaleCollider)) {
							this.gameOver();
						}
					}
				}
			}
		}
	};

	return MainScene;
})(window, document);
