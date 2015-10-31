/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var Util = (function () {
	"use strict";

	var exports = {};

	/**
	 * Run a function on page load
	 * @param {function} callback
	 */
	exports.onReady = function (callback) {
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
	exports.requestFullscreen = function (elem) {
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
	exports.exitFullscreen = function () {
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
	exports.isFullscreen = function (elem) {
		var fullscreenElem = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

		return elem ? (fullscreenElem === elem) : !!fullscreenElem;
	};

	/**
	 *
	 * @param {Element} elem
	 */
	exports.toggleFullscreen = function (elem) {
		if(exports.isFullscreen()) {
			exports.exitFullscreen();
		} else {
			exports.requestFullscreen(elem);
		}
	};

	return exports;

})();
