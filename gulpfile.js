/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

var path = require("path");
var gulp = require("gulp"),
	runSequence = require("run-sequence"),
	del = require("del"),
	uglify = require("gulp-uglify"),
	rename = require("gulp-rename"),
	autoprefixer = require("gulp-autoprefixer"),
	minifyCss = require("gulp-minify-css"),
	imagemin = require("gulp-imagemin");

var srcDir = "client",
	dstDir = "client-build";

gulp.task("clean", function () {
	return del([dstDir]);
});

gulp.task("js", function () {
	return gulp.src(srcDir + "/**/*.js")
		.pipe(uglify())
		.pipe(rename({
			extname: ".min.js"
		}))
		.pipe(gulp.dest(dstDir));
});

gulp.task("css", function () {
	return gulp.src(srcDir + "/**/*.css")
		.pipe(autoprefixer())
		.pipe(minifyCss({
			processImport: false
		}))
		.pipe(rename({
			extname: ".min.css"
		}))
		.pipe(gulp.dest(dstDir));
});

gulp.task("html", function () {
	return gulp.src(srcDir + "/**/*.html")
		.pipe(gulp.dest(dstDir));
});

gulp.task("fonts", function () {
	return gulp.src(srcDir + "/**/*.{woff,woff2,ttf}")
		.pipe(gulp.dest(dstDir));
});

gulp.task("json", function () {
	return gulp.src(srcDir + "/**/*.json")
		.pipe(gulp.dest(dstDir));
});

gulp.task("img", function () {
	return gulp.src(srcDir + "/**/*.{png,jpg,jpeg,svg,gif}")
		.pipe(imagemin())
		.pipe(gulp.dest(dstDir));
});

gulp.task("sounds", function () {
	// TODO: more formats
	return gulp.src(srcDir + "/**/*.{mp3,wav}")
		.pipe(gulp.dest(dstDir));
});

gulp.task("build", function (callback) {
	runSequence(
		"clean",
		["js", "css", "html", "fonts", "json", "img", "sounds"],
		callback
	);
});

gulp.task("watch", ["build"], function () {
	//gulp.watch(srcDir + "/**/*.js", ["js"]);
	//gulp.watch(srcDir + "/**/*.css", ["css"]);
	//gulp.watch(srcDir + "/**/*.html", ["html"]);
	gulp.watch(srcDir + "/**/*.*", ["build"]);
});

gulp.task("default", ["build"]);