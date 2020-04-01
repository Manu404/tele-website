const gulp = require("gulp");
const del = require("del");
const merge = require("merge-stream");

gulp.task('clean', function () {
    return del(["./vendor/", "./release/", "./*.zip"]);
});

gulp.task('module', function () {
    var bootstrap = gulp.src('./node_modules/bootstrap/dist/**/*.min.*').pipe(gulp.dest('./vendor/bootstrap'));
    var jquery = gulp.src([
        './node_modules/jquery/dist/*.min.js',
        '!./node_modules/jquery/dist/core.min.js'
    ]).pipe(gulp.dest('./vendor/jquery'));
    var html5shiv = gulp.src('./node_modules/html5shiv/dist/**/*.min.js').pipe(gulp.dest('./vendor/html5shiv'));
    return merge(bootstrap, jquery, html5shiv);
});