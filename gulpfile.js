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
const imagemin = require('gulp-imagemin');
const realFavicon = require('gulp-real-favicon');
const fs = require('fs');

function clean() {
    return del(["./vendor/", "./release/", "./*.zip"]);
}


function module() {
    var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*.min.*').pipe(gulp.dest('./vendor/bootstrap'));
    var fa = gulp.src([
        './node_modules/@fortawesome/fontawesome-free/js/all.min.js',
        './node_modules/@fortawesome/fontawesome-free/css/all.min.css'
    ]).pipe(gulp.dest('./vendor/fa'));
    var wf = gulp.src(['./node_modules/@fortawesome/fontawesome-free/webfonts/**/*']).pipe(gulp.dest('./vendor/webfonts'));
    var jquery = gulp.src([
        './node_modules/jquery/dist/*.min.js',
        '!./node_modules/jquery/dist/core.min.js'
    ]).pipe(gulp.dest('./vendor/jquery'));
    var html5shiv = gulp.src('./node_modules/html5shiv/dist/**/*.min.js').pipe(gulp.dest('./vendor/html5shiv'));
    return merge(bootstrap, jquery, html5shiv, fa, wf);
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

function mergeJs() {
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
    gulp.watch(["./js/**/*.js", "!./js/**/*.min.js", "!./js/**all.js"], build);
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
}

function mkZip() {
    return gulp.src('./release/**/*')
        .pipe(zip(pkg.title + '_' + pkg.version + '.zip'))
        .pipe(gulp.dest('./'))
}


var FAVICON_DATA_FILE = 'faviconData.json';

gulp.task('generate-favicon', function (done) {
    return realFavicon.generateFavicon({
        masterPicture: 'content/img/source/fav/fav.png',
        dest: 'content/img/fav/',
        iconsPath: 'content/img/fav/',
        design: {
            ios: {
                pictureAspect: 'noChange',
                assets: {
                    ios6AndPriorIcons: false,
                    ios7AndLaterIcons: false,
                    precomposedIcons: false,
                    declareOnlyDefaultIcon: true
                },
                appName: 'The Electric Looper Ensemble'
            },
            desktopBrowser: {
                design: 'raw'
            },
            windows: {
                masterPicture: {
                    type: 'inline',
                    content: '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16xZ89tRo0b9xBmCAAAi2LVr19CoT/5vv/22NCcn55Go//egQYPuz8rKeigvL+/x4uLipz799NOf/+EPf/hleXn5z6dOnfrc5MmTn5kwYcLT48aNe7KgoKBvTk7OI/3797/HuYEAAL6nrVu3pkcNAD+9CwgACNSmTZuifhNgVVZW1kM2BAQABKihoeHtqAFgP0AAQKDq6+v7RXn6d3Z2+spdQABAqOrq6t6IEgAdHR3l9gMEAASqpqbmNQEACACImUWLFr0SJQCuX79eYT9AAECg5s+f/2KUALhx44YAAAQAhOqzzz77TZQAuHnz5jT7AQIAAvXHP/7xVwIAEAAQM9OnT38+SgDcunVLAAACAEJVUVHxiygB4HsAAAEAASsrK3suSgB0dXUJAEAAQKimTJnybJQA+O677yrtBwgACNQnn3zyMwEACACImfHjxz8VJQC6u7sFACAAIFSFhYVPCABAAEDMFBQU9BUAgACAmMnNzX1MAAACAGJm5MiRjwoAQABAzOTk5DwiAAABADEzfPjwhwQAIAAgZoYOHfpjAQAIAIiZjIyMPgIAEAAQM4MHD75fAAACAGImLS3tPgEACACImQEDBtybSCSqkg2Anp6emfYDBACELekAuHPnzmy7AQIAYhYAvf/GdoAAAAEAIABAAAAIAPj3dffu3dkCABAAEDO3b9+eKQAAAQAx891331UKAEAAQMzcunVrmgAABADEzI0bNyqiBED//v3vsR8gACBQ169fjxIAiYEDB95rP0AAQMwCoPd3BGwICACIUwAMGjTofvsBAgBiFgDp6el97AcIAIhZAGRmZj5gP0AAQMwCYOjQoT+2HyAAIFAdHR3lUQLgvffeEwCAAIBQXbt2LVIADB8+/CH7AQIAAnXlypWyKAGQlZUlAAABAKH69ttvS6MEQHZ29sP2AwQABKq9vV0AAAIA4ubSpUslAgAQABAzFy9enCQAAAEAAkAAAAIAUt2FCxcEACAAQAAIAEAAgAAQAIAAgNRz/vz5iQIAEAAgAAQAIABAAAgAQABAyvnmm28EACAAQAAIAEAAQMo7d+5csQAABAAIAAEACAAQAAIAEACQctra2gQAIABAAAgAQABAyjt79myRAAAEAAgAAQAIABAAAgAQAJByWltbBQAgAEAACABAAIAAEACAAIDUc+bMmUIBAAgAEAACABAAkOpO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'
                },
                pictureAspect: 'noChange',
                backgroundColor: '#603cba',
                onConflict: 'override',
                assets: {
                    windows80Ie10Tile: false,
                    windows10Ie11EdgeTiles: {
                        small: false,
                        medium: true,
                        big: false,
                        rectangle: false
                    }
                },
                appName: 'The Electric Looper Ensemble'
            },
            androidChrome: {
                pictureAspect: 'noChange',
                themeColor: '#ffffff',
                manifest: {
                    name: 'The Electric Looper Ensemble',
                    display: 'standalone',
                    orientation: 'notSet',
                    onConflict: 'override',
                    declared: true
                },
                assets: {
                    legacyIcon: false,
                    lowResolutionIcons: false
                }
            },
            safariPinnedTab: {
                masterPicture: {
                    type: 'inline',
                    content: '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16xZ89tRo0b9xBmCAAAi2LVr19CoT/5vv/22NCcn55Go//egQYPuz8rKeigvL+/x4uLipz799NOf/+EPf/hleXn5z6dOnfrc5MmTn5kwYcLT48aNe7KgoKBvTk7OI/3797/HuYEAAL6nrVu3pkcNAD+9CwgACNSmTZuifhNgVVZW1kM2BAQABKihoeHtqAFgP0AAQKDq6+v7RXn6d3Z2+spdQABAqOrq6t6IEgAdHR3l9gMEAASqpqbmNQEACACImUWLFr0SJQCuX79eYT9AAECg5s+f/2KUALhx44YAAAQAhOqzzz77TZQAuHnz5jT7AQIAAvXHP/7xVwIAEAAQM9OnT38+SgDcunVLAAACAEJVUVHxiygB4HsAAAEAASsrK3suSgB0dXUJAEAAQKimTJnybJQA+O677yrtBwgACNQnn3zyMwEACACImfHjxz8VJQC6u7sFACAAIFSFhYVPCABAAEDMFBQU9BUAgACAmMnNzX1MAAACAGJm5MiRjwoAQABAzOTk5DwiAAABADEzfPjwhwQAIAAgZoYOHfpjAQAIAIiZjIyMPgIAEAAQM4MHD75fAAACAGImLS3tPgEACACImQEDBtybSCSqkg2Anp6emfYDBACELekAuHPnzmy7AQIAYhYAvf/GdoAAAAEAIABAAAAIAPj3dffu3dkCABAAEDO3b9+eKQAAAQAx891331UKAEAAQMzcunVrmgAABADEzI0bNyqiBED//v3vsR8gACBQ169fjxIAiYEDB95rP0AAQMwCoPd3BGwICACIUwAMGjTofvsBAgBiFgDp6el97AcIAIhZAGRmZj5gP0AAQMwCYOjQoT+2HyAAIFAdHR3lUQLgvffeEwCAAIBQXbt2LVIADB8+/CH7AQIAAnXlypWyKAGQlZUlAAABAKH69ttvS6MEQHZ29sP2AwQABKq9vV0AAAIA4ubSpUslAgAQABAzFy9enCQAAAEAAkAAAAIAUt2FCxcEACAAQAAIAEAAgAAQAIAAgNRz/vz5iQIAEAAgAAQAIABAAAgAQABAyvnmm28EACAAQAAIAEAAQMo7d+5csQAABAAIAAEACAAQAAIAEACQctra2gQAIABAAAgAQABAyjt79myRAAAEAAgAAQAIABAAAgAQAJByWltbBQAgAEAACABAAIAAEACAAIDUc+bMmUIBAAgAEAACABAAkOpO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'
                },
                pictureAspect: 'silhouette',
                themeColor: '#5bbad5'
            }
        },
        settings: {
            compression: 5,
            scalingAlgorithm: 'Mitchell',
            errorOnImageTooSmall: false,
            readmeFile: false,
            htmlCodeFile: true,
            usePathAsIs: false
        },
        markupFile: FAVICON_DATA_FILE
    }, function () {
        done();
    });
});

gulp.task('inject-favicon-markups', function () {
    return gulp.src(['./index.html'])
        .pipe(realFavicon.injectFaviconMarkups(JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).favicon.html_code))
        .pipe(gulp.dest('./'));
});

gulp.task('check-for-favicon-update', function (done) {
    var currentVersion = JSON.parse(fs.readFileSync(FAVICON_DATA_FILE)).version;
    realFavicon.checkForUpdates(currentVersion, function (err) {
        if (err) {
            throw err;
        }
        done();
    });
});

const build = gulp.series(clean, mergeJs, gulp.parallel(module, scss, js));
const watch = gulp.series(build, watchFiles);
const prod = gulp.series(build, release);
const pack = gulp.series(prod, mkZip);
const genFav = gulp.series('generate-favicon');
const fav = gulp.series('check-for-favicon-update', genFav, 'inject-favicon-markups');

// Export tasks
exports.scss = scss;
exports.js = js;
exports.clean = clean;
exports.prod = prod;
exports.build = build;
exports.watch = watch;
exports.default = prod;
exports.pack = pack;
exports.genFav = genFav;
exports.fav = fav;
