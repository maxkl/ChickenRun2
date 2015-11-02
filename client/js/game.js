/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

/**
 * Game
 * @constructor
 */
function Game(canvas, bgCanvas) {
	// From arguments
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");
	this.bgCanvas = bgCanvas;
	this.bgCtx = this.bgCanvas.getContext("2d");

	// Constants
	this.scale = 3;
	this.frameTime = 100;
	this.gravity = -2 / 1000;
	this.speedIncreasePerSecond = 5;

	// *Managers
	this.assets = new AssetManager();
	this.input = new InputManager(this.canvas);
	this.audio = new AudioManager();

	// Timing
	this.now = 0; // DOMAYBE: as prototype properties?
	this.lastFrameTime = 0;
	this.deltaTime = 0;
	this.startTime = 0;
	this.startSpeed = 350 / 1000; // 300 px/s
	this.acceleration = 1.5 / (1000 * 1000); // 2 px/s^2

	// Entities
	this.chicken = null;
	this.hayBales = [];

	// Initialization functions
	this.registerListeners();

	this.resize(700, 500);

	// Better performance
	this.boundRender = this.render.bind(this);
}

Game.prototype.loadAssets = function (callback) {
	this.assets.queue("json", [
		"assets/sprites/chicken-halloween.json",
		"assets/sprites/pumpkin.json"
	]);

	this.assets.queue("img", [
		"assets/img/chicken-skeleton.png",
		"assets/img/pumpkin.png",
		"assets/img/background.png",
		"assets/img/background2.png"
	]);

	this.assets.loadQueue(callback);
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

			self.now = Date.now();
			self.startTime = self.now;
			self.passedTime = 0;
			self.deltaTime = 0;
			self.lastFrameTime = self.now;
			self.speed = self.startSpeed;

			self.background = new Background(self, self.bgCanvas, self.bgCtx);

			self.chicken = new Chicken(self);

			self.nextHayBaleTime = self.getNextHayBaleTime();

			self.boundRender();
		}
	});
};

Game.prototype.registerListeners = function () {
	var self = this;

	window.addEventListener("contextmenu", function (evt) {
		evt.preventDefault();
	});
};

function resizeCanvas(canvas, ctx, w, h) {
	canvas.width = w;
	canvas.height = h;

	// We have to do this every time we change the canvas size
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.msImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;
}

Game.prototype.resize = function (w, h) {
	this.w = w;//window.innerWidth;
	this.h = h;//window.innerHeight;

	this.hw = w / 2;
	this.hh = h / 2;

	resizeCanvas(this.canvas, this.ctx, this.w, this.h);
	resizeCanvas(this.bgCanvas, this.bgCtx, this.w, this.h);
};

Game.prototype.update = function () {
	if(this.now >= this.nextHayBaleTime) {
		this.nextHayBaleTime = this.getNextHayBaleTime();

		this.hayBales.push(new HayBale(this));
	}

	if(this.input.mousePressed && !this.chicken.jumping) {
		this.chicken.jump();
	}
};

Game.prototype.render = function () {
	requestAnimationFrame(this.boundRender);

	this.now = Date.now();
	this.deltaTime = this.now - this.lastFrameTime;
	this.lastFrameTime = this.now;
	this.passedTime = this.now - this.startTime;

	// v = a * t + v0
	this.speed = this.acceleration * this.passedTime + this.startSpeed;
	// s = v * t
	this.frameDistance = this.speed * this.deltaTime;

	this.input.tick();

	this.update();

	//this.ctx.fillStyle = "#fff";
	//this.ctx.fillRect(0, 0, this.w, this.h);
	this.ctx.clearRect(0, 0, this.w, this.h);

	// On separate canvas
	this.background.draw();

	this.chicken.draw();

	var n = this.hayBales.length;
	while(n--) {
		// Remove hay bale if out of screen
		if(this.hayBales[n].x + this.hayBales[n].w < 0) {
			this.hayBales.splice(n, 1);
		} else {
			this.hayBales[n].draw();
		}
	}
};