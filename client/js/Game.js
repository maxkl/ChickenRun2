/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var Game = (function (window, document) {
	"use strict";

	var TWO_PI = Math.PI * 2;

	function resizeCanvas(canvas, ctx, w, h) {
		canvas.width = w;
		canvas.height = h;

		// We have to do this every time we change the canvas size
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
	}

	function drawDebugCircle(ctx, x, y, r) {
		ctx.beginPath();
		ctx.arc(x, y, r, 0, TWO_PI);
		ctx.strokeStyle = "red";
		ctx.lineWidth = 1;
		ctx.stroke();
	}

	/**
	 * Game
	 * @constructor
	 */
	function Game(canvas) {
		// From arguments
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");

		this.animationFrameHandle = null;

		// Constants
		this.scale = 3;
		this.frameTime = 100;
		this.gravity = -2 * 1000;

		// *Managers
		this.assets = new AssetManager();
		this.input = new InputManager(this.canvas);
		this.audio = new AudioManager();

		// Timing
		this.now = 0;
		this.timeShift = 0;
		this.lastTimestamp = 0;
		this.deltaTime = 0;
		this.startSpeed = 350; // 300 px/s
		this.speed = this.startSpeed;
		// this.acceleration = 1.5 / 1000; // 2 px/s^2

		this.background = null;

		// Entities
		this.chicken = null;
		this.hayBales = [];
		this.badMan = null;

		// Initialization functions
		this.registerListeners();

		this.resize(700, 500);

		var self = this;
		this.boundRender = function (timestamp) {
			self.render(timestamp);
		};
		this.boundRenderNormal = function () {
			self.renderNormal();
		};
		this.boundRenderDead = function () {
			self.renderDead();
		};

		this.currentRender = this.boundRenderNormal;
	}

	Game.prototype.loadAssets = function (callback) {
		var assets = this.assets;

		var registeredResources = registerResources.get();

		for(var type in registeredResources) {
			if(registeredResources.hasOwnProperty(type)) {
				assets.queue(type, registeredResources[type]);
			}
		}

		assets.loadQueue(callback);
	};

	Game.prototype.getNextHayBaleTime = function () {
		return this.now + (this.startSpeed / this.speed) * (Math.random() * 2000 + 2000);
	};

	Game.prototype.start = function () {
		var self = this;

		this.loadAssets(function (err) {
			if(err) {
				console.error("Assets failed to load:", err);
			} else {
				self.audio.play();

				self.background = new Background(self);
				self.chicken = new Chicken(self);
				self.badMan = new BadMan(self);

				self.nextHayBaleTime = self.getNextHayBaleTime();

				requestAnimationFrame(self.boundRender);
			}
		});
	};

	Game.prototype.registerListeners = function () {
		var self = this;

		window.addEventListener("contextmenu", function (evt) {
			evt.preventDefault();
		});
	};

	Game.prototype.resize = function (w, h) {
		this.w = w;//window.innerWidth;
		this.h = h;//window.innerHeight;

		this.hw = w / 2;
		this.hh = h / 2;

		resizeCanvas(this.canvas, this.ctx, this.w, this.h);
	};

	Game.prototype.update = function () {
		if(this.now >= this.nextHayBaleTime) {
			this.nextHayBaleTime = this.getNextHayBaleTime();

			// TODO: prevent gc
			this.hayBales.push(new HayBale(this));
		}

		if(
			(this.input.mousePressed || this.input.keyDown[32])
			&& !this.chicken.jumping
		) {
			this.chicken.jump();
		}
	};

	Game.prototype.renderNormal = function () {
		// v = a * t + v0
		//this.speed = this.acceleration * this.passedTime + this.startSpeed;
		// s = v * t
		this.frameDistance = this.speed * this.deltaTime;

		this.update();

		// This overwrites the last frame
		this.background.draw();

		var chicken = this.chicken;
		chicken.draw();

		var hayBales = this.hayBales;
		var n = hayBales.length;
		while(n--) {
			var hayBale = hayBales[n];

			// Remove hay bale if out of screen
			if(hayBale.x + hayBale.w < 0) {
				// TODO: prevent gc
				hayBales.splice(n, 1);
			} else {
				hayBale.draw();

				var chickenCollider = chicken.collider;
				var hayBaleCollider = hayBale.collider;
				if(chickenCollider.checkCollision(hayBaleCollider)) {
					this.currentRender = this.boundRenderDead;

					this.frameDistance = 0;
				}
			}
		}

		this.badMan.draw();
	};
	
	Game.prototype.renderDead = function () {
		// // This overwrites the last frame
		// this.background.draw();
		//
		// var hayBales = this.hayBales;
		// var n = hayBales.length;
		// while(n--) {
		// 	hayBales[n].draw();
		// }
		//
		// this.badMan.draw();
	};

	Game.prototype.render = function (timestamp) {
		this.animationFrameHandle = requestAnimationFrame(this.boundRender);

		timestamp -= this.timeShift;

		this.now = timestamp;
		if(this.lastTimestamp) {
			this.deltaTime = (timestamp - this.lastTimestamp) / 1000;
		}
		this.lastTimestamp = timestamp;

		this.input.tick();

		this.currentRender();
	};

	return Game;
})(window, document);
