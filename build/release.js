"use strict";

const gulp = require("gulp");
const merge = require("merge-stream");
const zip = require('gulp-zip');
const pkg = require('../package.json');
const imagemin = require('gulp-imagemin');

gulp.task('release', function () {
    var css = gulp.src(['./css/all.min.css'])
        .pipe(gulp.dest('./release/css/'));
    var js = gulp.src(['./js/all.min.js',])
        .pipe(gulp.dest('./release/js/'));
    var vendor = gulp.src(['./vendor/**/*',
        '!./vendor/**/*.js', './vendor/**/*.min.js',
        '!./vendor/**/*.css', '!./vendor/**/*.map', './vendor/**/*.min.css'])
        .pipe(gulp.dest('./release/vendor/'));
    var index = gulp.src(['./index.html'])
        .pipe(gulp.dest('./release/'));
    var htaccess = gulp.src(['./.htaccess'])
        .pipe(gulp.dest('./release/'));
    var content = gulp.src(['./content/**/*', '!./content/img/**/*'])
        .pipe(gulp.dest('./release/content/'));
    var jpg = gulp.src(['./content/img/**/*.jpg', '!./content/img/source/**/*', '!./content/img/fav/**/*'])
        .pipe(imagemin())
        .pipe(gulp.dest('./release/content/img/'));
    var png = gulp.src(['./content/img/**/*.png', '!./content/img/source/**/*', '!./content/img/fav/**/*'])
        .pipe(gulp.dest('./release/content/img/'));
    var fav = gulp.src(['./content/img/fav/**/*'])
        .pipe(gulp.dest('./release/content/img/fav'));
    return merge(css, js, vendor, index, content, jpg, png, htaccess, fav);
});

gulp.task('mkZip', function (done) {
    return gulp.src('./release/**/*')
        .pipe(zip(pkg.title + '_' + pkg.version + '.zip'))
        .pipe(gulp.dest('./'))
});
