 "use strict";

// Load plugins
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const cleanCSS = require("gulp-clean-css");
const del = require("del");
const gulp = require("gulp");
const merge = require("merge-stream");
const header = require("gulp-header");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const zip = require('gulp-zip');
var addsrc = require('gulp-add-src');
const pkg = require('./package.json');
 var concat = require('gulp-concat');

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
    done();
}

// BrowserSync reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean vendor
function clean() {
    return del(["./vendor/", "./release/", "./*.zip"]);
}

function modules() {
    var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*.min.*').pipe(gulp.dest('./vendor/bootstrap'));
    var jquery = gulp.src([
        './node_modules/jquery/dist/*.min.js',
        '!./node_modules/jquery/dist/core.min.js'
    ]).pipe(gulp.dest('./vendor/jquery'));
    var html5shiv = gulp.src('./node_modules/html5shiv/dist/**/*.min.js').pipe(gulp.dest('./vendor/html5shiv'));
    return merge(bootstrap, jquery, html5shiv);
}

function mergeCoreJs(){
    return gulp
        .src([
            './js/*.js',
            '!./js/*.min.js',
            '!./js/*all*.js'
        ])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./js/'));
}

function css() {
    return gulp
        .src(["./css/**/*.css", "!./css/**/*.min.css"])
        .pipe(plumber())
        .pipe(gulp.dest("./css"))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(cleanCSS())
        .pipe(gulp.dest("./css"))
        .pipe(browsersync.stream());
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
        .pipe(gulp.dest("./css"))
        .pipe(browsersync.stream());
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
        .pipe(gulp.dest('./js'))
        .pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
    gulp.watch("./**/*.css", browserSyncReload);
    gulp.watch("./**/*.html", browserSyncReload);
}

gulp.task('buildProd', () => {
    var css = gulp.src(['./css/**/*', '!./css/*.css', './css/*.min.css',])
        .pipe(gulp.dest('./release/css/'));
    var img = gulp.src(['./img/**/*'], {allowEmpty: true})
        .pipe(gulp.dest('./release/img/'));
    var js = gulp.src(['./js/all.min.js',])
        .pipe(gulp.dest('./release/js/'));
    var vendor = gulp.src(['./vendor/**/*',
        '!./vendor/**/*.js', './vendor/**/*.min.js',
        '!./vendor/**/*.css', '!./vendor/**/*.map', './vendor/**/*.min.css',
        './vendor/**/aos.css', './vendor/**/aos.js'])
        .pipe(gulp.dest('./release/vendor/'));
    var index = gulp.src(['./index.html'])
        .pipe(gulp.dest('./release/'));
    var loc = gulp.src(['./content/*'])
        .pipe(gulp.dest('./release/content/'));
    return merge(css, img, js, vendor, index, loc);
});

gulp.task('mkZip', () =>
    gulp.src('./release/**/*')
        .pipe(zip(pkg.title + '_' + pkg.version + '.zip'))
        .pipe(gulp.dest('./'))
);

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, mergeCoreJs, gulp.parallel(scss, js));
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));
const prod = gulp.series(build, 'buildProd');
const pack = gulp.series(prod, 'mkZip');

// Export tasks
exports.css = css;
exports.scss = scss;
exports.js = js;
exports.clean = clean;
exports.prod = prod;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = prod;
exports.pack = pack;
