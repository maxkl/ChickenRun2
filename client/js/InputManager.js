/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var InputManager = (function (window, document) {
	"use strict";

	function InputManager(target) {
		this.target = target;

		this.mouseDown = false;
		this.lastMouseDown = false;
		this.mousePressed = false;
		this.mouseReleased = false;

		this.keyDown = {};

		this.register();
	}

	InputManager.prototype.register = function () {
		var self = this;

		function onMouseDown(evt) {
			evt.preventDefault();

			self.mouseDown = true;
		}

		function onMouseUp(evt) {
			evt.preventDefault();

			self.mouseDown = false;
		}
		
		var target = this.target;

		target.addEventListener("touchstart", onMouseDown);
		target.addEventListener("mousedown", onMouseDown);

		target.addEventListener("touchend", onMouseUp);
		target.addEventListener("touchcancel", onMouseUp);
		target.addEventListener("mouseup", onMouseUp);
		target.addEventListener("mouseleave", onMouseUp);
		target.addEventListener("mouseout", onMouseUp);

		window.addEventListener("keydown", function (evt) {
			self.keyDown[evt.which] = true;
		});

		window.addEventListener("keyup", function (evt) {
			self.keyDown[evt.which] = false;
		});
	};

	InputManager.prototype.tick = function () {
		this.mousePressed = !this.lastMouseDown && this.mouseDown;
		this.mouseReleased = this.lastMouseDown && !this.mouseDown;

		this.lastMouseDown = this.mouseDown;
	};

	return InputManager;
})(window, document);
