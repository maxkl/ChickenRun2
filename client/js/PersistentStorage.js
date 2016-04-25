/**
 * Copyright: (c) 2016 Max Klein
 * License: MIT
 */

var PersistentStorage = (function (window, document) {
	"use strict";

	var localStorage = window.localStorage;

	function PersistentStorage(prefix) {
		this.prefix = prefix || "";
	}

	PersistentStorage.prototype.has = function (name) {
		var prefixedName = this.prefix + name;

		return localStorage.getItem(prefixedName) !== null;
	};

	PersistentStorage.prototype.get = function (name, def) {
		var prefixedName = this.prefix + name;

		var json = localStorage.getItem(prefixedName);

		if(json === null) {
			return typeof def !== "undefined" ? def : null;
		}

		return JSON.parse(json);
	};

	PersistentStorage.prototype.set = function (name, val) {
		var prefixedName = this.prefix + name;

		localStorage.setItem(prefixedName, JSON.stringify(val));

		return this;
	};

	return PersistentStorage;
})(window, document);
