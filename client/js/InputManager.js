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

		this.target.addEventListener("touchstart", onMouseDown);
		this.target.addEventListener("mousedown", onMouseDown);

		this.target.addEventListener("touchend", onMouseUp);
		this.target.addEventListener("touchcancel", onMouseUp);
		this.target.addEventListener("mouseup", onMouseUp);
		this.target.addEventListener("mouseleave", onMouseUp);
		this.target.addEventListener("mouseout", onMouseUp);
	};

	InputManager.prototype.tick = function () {
		this.mousePressed = !this.lastMouseDown && this.mouseDown;
		this.mouseReleased = this.lastMouseDown && !this.mouseDown;

		this.lastMouseDown = this.mouseDown;
	};

	return InputManager;
})(window, document);
