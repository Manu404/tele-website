 "use strict";

const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const merge = require("merge-stream");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const zip = require('gulp-zip');
const pkg = require('./package.json');
const concat = require('gulp-concat');

function clean() {
    return del(["./vendor/", "./release/", "./*.zip"]);
}

function module() {
    var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*.min.*').pipe(gulp.dest('./vendor/bootstrap'));
    var fa = gulp.src([
            './node_modules/@fortawesome/fontawesome-free/js/all.min.js',
            './node_modules/@fortawesome/fontawesome-free/css/all.min.css'
        ]).pipe(gulp.dest('./vendor/fa'));
    var jquery = gulp.src([
            './node_modules/jquery/dist/*.min.js',
            '!./node_modules/jquery/dist/core.min.js'
        ]).pipe(gulp.dest('./vendor/jquery'));
    var html5shiv = gulp.src('./node_modules/html5shiv/dist/**/*.min.js').pipe(gulp.dest('./vendor/html5shiv'));
    return merge(bootstrap, jquery, html5shiv, fa);
}

function scss() {
    return gulp
        .src(["./scss/**/*.scss"])
        .pipe(plumber())
        .pipe(sass({
            outputStyle: "expanded",
            includePaths: "./node_modules",
        }))
        .on("error", sass.logError)
        .pipe(gulp.dest("./css"))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest("./css"));
}


function js() {
    return gulp
        .src([
            './js/*.js',
            '!./js/*.min.js',
        ])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./js'));
}

function mergeJs(){
     return gulp
         .src([
             './js/*.js',
             '!./js/*.min.js',
             '!./js/*all*.js'
         ])
         .pipe(concat('all.js'))
         .pipe(gulp.dest('./js/'));
 }

// Watch files
function watchFiles() {
    gulp.watch("./scss/**/*.scss", build);
    gulp.watch(["./js/**/*.js","!./js/**/*.min.js","!./js/**all.js"], build);
}

function release() {
    var css = gulp.src(['./css/**/*', '!./css/*.css', './css/*.min.css',])
        .pipe(gulp.dest('./release/css/'));
    var js = gulp.src(['./js/all.min.js',])
        .pipe(gulp.dest('./release/js/'));
    var vendor = gulp.src(['./vendor/**/*',
        '!./vendor/**/*.js', './vendor/**/*.min.js',
        '!./vendor/**/*.css', '!./vendor/**/*.map', './vendor/**/*.min.css'])
        .pipe(gulp.dest('./release/vendor/'));
    var index = gulp.src(['./index.html'])
        .pipe(gulp.dest('./release/'));
    var content = gulp.src(['./content/**/*'])
        .pipe(gulp.dest('./release/content/'));
    return merge(css, js, vendor, index, content);
}

function mkZip(){
    return gulp.src('./release/**/*')
        .pipe(zip(pkg.title + '_' + pkg.version + '.zip'))
        .pipe(gulp.dest('./'))
}

const vendor = gulp.series(clean, module);
const build = gulp.series(gulp.parallel(vendor, scss, js), mergeJs);
const watch = gulp.series(build, watchFiles);
const prod = gulp.series(build, release);
const pack = gulp.series(prod, mkZip);

// Export tasks
exports.scss = scss;
exports.js = js;
exports.clean = clean;
exports.prod = prod;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = prod;
exports.pack = pack;
