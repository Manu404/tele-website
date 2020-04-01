"use strict";

const gulp = require("gulp");
const requireDir = require('require-dir');
requireDir('./build');

gulp.task('watchFiles', function () {
    gulp.watch("./scss/**/*.scss", build);
    gulp.watch(["./js/**/*.js", "!./js/**/*.min.js", "!./js/**all.js"], build);
});

const build = gulp.series('clean', 'glyph',
    gulp.parallel('module', 'scss'),
    gulp.parallel('mergeCss', 'mergeJs'),
    gulp.parallel('minifyCss', 'minifyJs'));
const watch = gulp.series(build, 'watchFiles');
const release = gulp.series(build, 'release');
const pack = gulp.series(release, 'mkZip');
const genFav = gulp.series('generate-favicon');
const fav = gulp.series('check-for-favicon-update', genFav, 'inject-favicon-markups');

exports.release = release;
exports.build = build;
exports.watch = watch;
exports.default = build;
exports.pack = pack;
exports.genFav = genFav;
exports.fav = fav;
