/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

var Collider = (function (window, document) {
	"use strict";

	/**
	 *
	 * @param {number} n
	 * @return {number}
	 */
	function sqr(n) {
		return n * n;
	}

	/**
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} radius
	 * @constructor
	 */
	function Collider(x, y, radius) {
		this.radius = radius;
		this.x = x;
		this.y = y;
	}

	/**
	 *
	 * @param {number} x
	 * @param {number} y
	 */
	Collider.prototype.updatePosition = function (x, y) {
		this.x = x;
		this.y = y;
	};

	/**
	 *
	 * @param {Collider} other
	 * @return {boolean}
	 */
	Collider.prototype.checkCollision = function (other) {
		var dst = Math.sqrt(sqr(other.x - this.x) + sqr(other.y - this.y));

		return dst < this.radius + other.radius;
	};

	return Collider;
})(window, document);
