/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var AudioManager = (function (window, document) {
	"use strict";

	registerAssets("audio", [
		"assets/sounds/Pixelland.mp3"
	]);

	function createAudioContext() {
		var AudioContext = window.AudioContext || window.webkitAudioContext;

		if(typeof AudioContext !== "function") {
			throw new Error("Web Audio API not supported");
		}

		return new AudioContext();
	}

	/**
	 *
	 * @param {Game} game
	 * @constructor
	 */
	function AudioManager(game) {
		this.game = game;

		// this.player = new Audio("assets/sounds/soundtrack1.mp3");
		// this.player.loop = true;

		this.context = createAudioContext();
		this.musicEnabled = false;
		this.musicNode = null;

		var self = this;

		game.hook("post-load", function () {
			self.enableMusic();
		});
	}

	AudioManager.prototype.enableMusic = function () {
		if(this.musicNode) {
			this.musicNode.stop(0);
		}

		this.musicNode = this.context.createBufferSource();
		this.musicNode.buffer = this.game.assets.get("assets/sounds/Pixelland.mp3");
		this.musicNode.connect(this.context.destination);
		this.musicNode.loop = true;
		this.musicNode.start(0);

		this.musicEnabled = true;
	};

	AudioManager.prototype.disableMusic = function () {
		if(this.musicNode) {
			this.musicNode.stop(0);
			this.musicNode = null;
		}

		this.musicEnabled = false;
	};

	AudioManager.prototype.playSoundEffect = function (name) {
		var url = "assets/sounds/effects/" + name + ".mp3";

		var buffer = this.game.assets.get(url);
		if(buffer) {
			var node = this.context.createBufferSource();
			node.buffer = buffer;
			node.connect(this.context.destination);
			node.start(0);
		} else {
			console.warn("Sound effect '" + name + "' not loaded");
		}
	};

	return AudioManager;
})(window, document);
