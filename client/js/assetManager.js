/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var AssetManager = (function () {
	"use strict";

	var loaders = {
		"json": function (url, callback) {
			var xhr = new XMLHttpRequest();

			xhr.addEventListener("load", function () {
				if(xhr.status == 200) {
					try {
						var data = JSON.parse(xhr.responseText);
						callback(null, data);
					} catch(e) {
						callback(e);
					}
				} else {
					callback(new Error("HTTP status code: " + xhr.status + "(" + xhr.statusText + ")"));
				}
			});

			xhr.addEventListener("error", function () {
				callback(new Error("Connection error"));
			});

			xhr.addEventListener("abort", function () {
				callback(new Error("Request aborted"));
			});

			xhr.open("GET", url);
			xhr.send();
		},
		"img": function (url, callback) {
			var img = new Image();

			img.onload = function () {
				callback(null, img);
			};

			img.onerror = function () {
				callback(new Error("Failed"));
			};

			img.src = url;
		}
	};

	function loadAsset(type, url, callback) {
		if(loaders[type]) {
			loaders[type](url, callback);
		} else {
			callback(new Error("Unrecognized asset type"));
		}
	}

	function StoredAsset(successful, data) {
		this.successful = successful;
		this.data = data;
	}

	function AssetManager() {
		this._queue = [];
		this._assets = {};
	}

	AssetManager.prototype.queue = function (type, urls) {
		if(Array.isArray(urls)) {
			var count = urls.length;

			for(var i = 0; i < count; i++) {
				this._queue.push({
					type: type,
					url: urls[i]
				});
			}
		} else {
			this._queue.push({
				type: type,
				url: urls
			});
		}

		return this;
	};

	AssetManager.prototype.loadQueue = function (callback) {
		var count = this._queue.length,
			loaded = 0;

		if(count) {
			for(var i = 0; i < count; i++) {
				var item = this._queue.shift();

				loadAsset(item.type, item.url, function (url, err, data) {
					this._assets[url] = new StoredAsset(!err, data);

					loaded++;

					if(loaded >= count) {
						if(callback) {
							callback();
						}
					}
				}.bind(this, item.url));
			}
		} else {
			callback();
		}

		return this;
	};

	AssetManager.prototype.has = function (name) {
		return !!this._assets[name];
	};

	AssetManager.prototype.succeeded = function (name) {
		return this.has(name) && this._assets[name].successful;
	};

	AssetManager.prototype.get = function (name) {
		return this.succeeded(name) ? this._assets[name].data : null;
	};

	return AssetManager;

})();
