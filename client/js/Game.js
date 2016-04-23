/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var Game = (function (window, document) {
	"use strict";

	var TWO_PI = Math.PI * 2;

	registerAssets("audio", [
		"assets/sounds/effects/jump.mp3"
	]);

	function clamp(n, min, max) {
		return n < min ? min : n > max ? max : n;
	}

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
		this._hooks = {};

		// From arguments
		this.canvas = canvas;
		this.ctx = this.canvas.getContext("2d");

		this.animationFrameHandle = null;

		// Constants
		this.scale = 3;
		this.frameTime = 100;
		this.gravity = -2 * 1000;

		// *Managers
		this.assets = new AssetManager(this);
		this.input = new InputManager(this, this.canvas);
		this.audio = new AudioManager(this);

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

	/**
	 *
	 * @param {string} name
	 * @param {function} cb
	 * @param {...*} [args]
	 * @private
	 */
	Game.prototype._callHooks = function (name, cb, args) {
		console.info("Running hooks for '" + name + "'");

		if(this._hooks.hasOwnProperty(name)) {
			var hooks = this._hooks[name];
			var hookCount = hooks.length;

			if(hookCount > 0) {
				var finishedCount = 0;

				var hookArgs = Array.prototype.slice.call(arguments, 1);
				var done = function done() {
					finishedCount++;

					if(finishedCount >= hookCount) {
						cb();
					}
				};
				var asyncHookArgs = hookArgs.concat([done]);

				for(var i = 0; i < hookCount; i++) {
					var hook = hooks[i];

					if(hook.async) {
						hook.fn.apply(null, asyncHookArgs);
					} else {
						hook.fn.apply(null, hookArgs);
						done();
					}
				}

				return;
			}
		}

		cb();
	};

	/**
	 *
	 * @param {string} name
	 * @param {function} fn
	 * @param {boolean} [async]
	 */
	Game.prototype.hook = function (name, fn, async) {
		if(typeof fn === "function") {
			if(!this._hooks[name]) {
				this._hooks[name] = [];
			}

			this._hooks[name].push({
				fn: fn,
				async: !!async
			});
		}
	};

	// Game.prototype.loadAssets = function (callback) {
	// 	var assets = this.assets;
	//
	// 	var registeredResources = registerAssets.get();
	//
	// 	for(var type in registeredResources) {
	// 		if(registeredResources.hasOwnProperty(type)) {
	// 			assets.queue(type, registeredResources[type]);
	// 		}
	// 	}
	//
	// 	assets.loadQueue(callback);
	// };

	Game.prototype._load = function (onProgressUpdate, cb) {
		console.info("Running hooks for 'load'");

		if(this._hooks.hasOwnProperty("load")) {
			var hooks = this._hooks["load"];
			var hookCount = hooks.length;

			if(hookCount > 0) {
				var finishedCount = 0;
				var progress = 0;

				var progresses = [];
				var n = hookCount;
				while(n--) progresses.push(0);

				var updateProgress = function updateProgress(i, newProgress) {
					newProgress = clamp(newProgress, 0, 1);

					progress += newProgress - progresses[i];

					progresses[i] = newProgress;

					onProgressUpdate(progress / hookCount);
				};

				var done = function done(i) {
					finishedCount++;

					updateProgress(i, 1);

					if(finishedCount >= hookCount) {
						cb();
					}
				};

				for(var i = 0; i < hookCount; i++) {
					var hook = hooks[i];

					if(hook.async) {
						hook.fn.call(null, updateProgress.bind(null, i), done.bind(null, i));
					} else {
						hook.fn.call(null, updateProgress.bind(null, i));
						done(i);
					}
				}

				return;
			}
		}

		cb();
	};

	Game.prototype.getNextHayBaleTime = function () {
		return this.now + (this.startSpeed / this.speed) * (Math.random() * 2000 + 2000);
	};

	Game.prototype._startGame = function () {
		this.background = new Background(this);
		this.chicken = new Chicken(this);
		this.badMan = new BadMan(this);

		this.nextHayBaleTime = this.getNextHayBaleTime();

		requestAnimationFrame(this.boundRender);
	};

	Game.prototype.start = function () {
		var self = this;

		this._callHooks("pre-load", function () {
			var $loadingOverlay = document.getElementById("loading-overlay");
			var $loadingPercentage = document.getElementById("loading-percentage");

			$loadingPercentage.innerHTML = 0;

			self._load(function(progress) {
				$loadingPercentage.innerHTML = Math.round(progress * 100);
			}, function (err) {
				if(err) {
					console.error("Loading failed:", err);
					return;
				}

				self._callHooks("post-load", function () {
					$loadingOverlay.classList.add("hidden");

					self._startGame();
				});
			});
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
			this.audio.playSoundEffect("jump");
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
