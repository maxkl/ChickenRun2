/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var AssetManager = (function (window, document) {
	"use strict";

	var loaders = {
		"json": function (game, url, updateProgress, done) {
			var req = new XMLHttpRequest();

			req.addEventListener("load", function () {
				if(req.status == 200) {
					try {
						var data = JSON.parse(req.responseText);
						done(null, data);
					} catch(e) {
						done(e);
					}
				} else {
					done(new Error("Server error: " + req.statusText + " (" + req.status + ")"));
				}
			});

			req.addEventListener("progress", function (evt) {
				if(evt.lengthComputable) {
					updateProgress(evt.loaded / evt.total);
				}
			});

			req.addEventListener("error", function () {
				done(new Error("Client/network error"));
			});

			req.addEventListener("abort", function () {
				done(new Error("Request aborted"));
			});

			req.open("GET", url);
			req.send();
		},
		"img": function (game, url, updateProgress, done) {
			var req = new XMLHttpRequest();

			req.addEventListener("load", function () {
				if(req.status == 200) {
					var blob = new Blob([req.response]);
					var img = new Image();
					img.onload = function () {
						done(null, img);
					};
					img.onerror = function () {
						done(new Error("Image failed to load"));
					};
					img.src = window.URL.createObjectURL(blob);
				} else {
					done(new Error("Server error: " + req.statusText + " (" + req.status + ")"));
				}
			});

			req.addEventListener("progress", function (evt) {
				if(evt.lengthComputable) {
					updateProgress(evt.loaded / evt.total);
				}
			});

			req.addEventListener("error", function () {
				done(new Error("Client/network error"));
			});

			req.addEventListener("abort", function () {
				done(new Error("Request aborted"));
			});

			req.open("GET", url);
			req.responseType = "arraybuffer";
			req.send();
		},
		"audio": function (game, url, updateProgress, done) {
			var req = new XMLHttpRequest();

			req.addEventListener("load", function () {
				if(req.status == 200) {
					var audioContext = game.audio.context;

					audioContext.decodeAudioData(req.response, function (buffer) {
						done(null, buffer);
					}, done);
				} else {
					done(new Error("Server error: " + req.statusText + " (" + req.status + ")"));
				}
			});

			req.addEventListener("progress", function (evt) {
				if(evt.lengthComputable) {
					updateProgress(evt.loaded / evt.total);
				}
			});

			req.addEventListener("error", function () {
				done(new Error("Client/network error"));
			});

			req.addEventListener("abort", function () {
				done(new Error("Request aborted"));
			});

			req.open("GET", url);
			req.responseType = "arraybuffer";
			req.send();
		}
	};

	var registeredAssets = {};

	window.registerAssets = function registerAssets(type, urls) {
		if(!registeredAssets.hasOwnProperty(type)) {
			registeredAssets[type] = [];
		}

		registeredAssets[type].push.apply(registeredAssets[type], urls);
	};

	function loadAsset(game, type, url, updateProgress, done) {
		if(loaders[type]) {
			loaders[type](game, url, updateProgress, done);
		} else {
			done(new Error("Unrecognized asset type"));
		}
	}

	function StoredAsset(successful, data) {
		this.successful = successful;
		this.data = data;
	}

	function AssetManager(game) {
		this.game = game;

		this._queue = [];
		this._assets = {};

		var self = this;

		game.hook("pre-load", function () {
			for(var type in registeredAssets) {
				if(registeredAssets.hasOwnProperty(type)) {
					self.queue(type, registeredAssets[type]);
				}
			}

			var queue = self._queue;
			var queueLength = queue.length;

			for(var i = 0; i < queueLength; i++) {
				var item = queue.shift();

				game.hook("load", function (item, updateProgress, done) {
					var url = item.url;

					loadAsset(game, item.type, url, updateProgress, function (err, data) {
						self._assets[url] = new StoredAsset(!err, data);

						done();
					});
				}.bind(null, item), true);
			}
		});
	}

	AssetManager.prototype.queue = function (type, urls) {
		if(!Array.isArray(urls)) {
			urls = [urls];
		}

		var count = urls.length;

		for(var i = 0; i < count; i++) {
			var url = urls[i];

			if(!this.has(url)) {
				this._queue.push({
					type: type,
					url: urls[i]
				});
			}
		}

		return this;
	};

	// AssetManager.prototype.loadQueue = function (callback) {
	// 	var count = this._queue.length,
	// 		loaded = 0;
	//
	// 	if(count) {
	// 		for(var i = 0; i < count; i++) {
	// 			var item = this._queue.shift();
	//
	// 			loadAsset(this.game, item.type, item.url, function (url, err, data) {
	// 				this._assets[url] = new StoredAsset(!err, data);
	//
	// 				loaded++;
	//
	// 				if(loaded >= count) {
	// 					if(callback) {
	// 						callback();
	// 					}
	// 				}
	// 			}.bind(this, item.url));
	// 		}
	// 	} else {
	// 		callback();
	// 	}
	//
	// 	return this;
	// };

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
})(window, document);
