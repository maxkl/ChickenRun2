/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

var registerResources = (function (window, document) {
	"use strict";

	var registeredResources = {};

	function registerResources(type, urls) {
		if(!registeredResources.hasOwnProperty(type)) {
			registeredResources[type] = [];
		}

		registeredResources[type].push.apply(registeredResources[type], urls);
	}

	function getRegisteredResources() {
		return registeredResources;
	}

	registerResources.get = getRegisteredResources;

	return registerResources;
})(window, document);
