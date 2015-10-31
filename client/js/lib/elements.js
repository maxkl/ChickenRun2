/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

/**
 * Get HTML elements
 */
var $ = (function () {
	"use strict";

	var splice = Array.prototype.splice;

	/**
	 * Get multiple elements by CSS selector
	 * @param {string} selector
	 * @param {Element} [context]
	 * @return {Element[]}
	 */
	var $ = function (selector, context) {
		context = context || document;

		return splice.call(context.querySelectorAll(selector));
	};

	/**
	 * Get one element by CSS selector
	 * @param {string} selector
	 * @param {Element} [context]
	 * @return {Element}
	 */
	$.one = function (selector, context) {
		context = context || document;

		return context.querySelector(selector);
	};

	/**
	 * Get one element by ID (You can not supply a context because IDs are unique)
	 * @param {string} id
	 * @return {Element}
	 */
	$.id = function (id) {
		return document.getElementById(id);
	};

	/**
	 * Get multiple elements by class
	 * @param {string} className
	 * @param {Element} [context]
	 * @return {Element[]}
	 */
	$.class = function (className, context) {
		context = context || document;

		return splice.call(context.getElementsByClassName(className));
	};

	/**
	 * Get multiple elements by tag name
	 * @param {string} tagName
	 * @param {Element} [context]
	 * @return {Element[]}
	 */
	$.tag = function (tagName, context) {
		context = context || document;

		return splice.call(context.getElementsByTagName(tagName));
	};

	return $;
})();