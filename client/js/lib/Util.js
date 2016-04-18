/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var Util = (function (window, document) {
	"use strict";

	var Util = {};

	/**
	 * Run a function on page load
	 * @param {function} callback
	 */
	Util.onReady = function (callback) {
		// If the page has loaded the DOM, call immediately, else register for DOMContentLoaded
		if(document.readyState == "interactive" || document.readyState == "complete" || document.readyState == "loaded") {
			callback();
		} else {
			document.addEventListener("DOMContentLoaded", callback);
		}
	};

	/**
	 *
	 * @param {Element} elem
	 */
	Util.requestFullscreen = function (elem) {
		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.msRequestFullscreen) {
			elem.msRequestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			elem.webkitRequestFullscreen();
		}
	};

	/**
	 *
	 */
	Util.exitFullscreen = function () {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	};

	/**
	 *
	 * @param {Element} [elem]
	 * @return {boolean}
	 */
	Util.isFullscreen = function (elem) {
		var fullscreenElem = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

		return elem ? (fullscreenElem === elem) : !!fullscreenElem;
	};

	/**
	 *
	 * @param {Element} elem
	 */
	Util.toggleFullscreen = function (elem) {
		if(Util.isFullscreen()) {
			Util.exitFullscreen();
		} else {
			Util.requestFullscreen(elem);
		}
	};

	Util.lcm = function (numbers) {
		if(numbers.length >= 2) {
			var result = Util.lcm2(numbers[0], numbers[1]);

			for(var i = 2; i < numbers.length; i++) {
				result = Util.lcm2(result, numbers[i]);
			}

			return result;
		} else if(numbers.length == 1) {
			return numbers[0];
		} else {
			return NaN;
		}
	};

	Util.lcm2 = function (x, y) {
		return (!x || !y) ? 0 : Math.abs((x * y) / Util.gcd2(x, y));
	};

	Util.gcd2 = function (x, y) {
		x = Math.abs(x);
		y = Math.abs(y);
		while(y) {
			var t = y;
			y = x % y;
			x = t;
		}
		return x;
	};

	return Util;
})(window, document);
