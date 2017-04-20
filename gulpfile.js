'use strict';

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require("gulp-babel");
const concat = require("gulp-concat");
const rigger = require("gulp-rigger");
const uglify = require("gulp-uglify");
const notify = require("gulp-notify");
const gulpIf = require("gulp-if");
const del = require("del");
const multipipe = require("multipipe");

//const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV == 'development';

var path = {};
path.base = {};

path.base.build = 'public/';
path.base.dev = '';


path.dev ={
    js: [
        path.base.dev + 'js/game/**/*.js',
        path.base.dev + 'js/tools/**/*.js',
        path.base.dev + 'js/main.js'
    ]
};
path.build = {
    js: path.base.build + 'js/',
};
path.watch = {
    js: [
        path.base.dev + 'js/**/*.js'
    ]
};

gulp.task('js', function(){
    return multipipe(
        gulp.src(path.dev.js),
        //gulpIf(isDevelopment, sourcemaps.init()),
        babel({
            presets: ['es2015']
        }),
        concat('main.js'),
        //gulpIf(!isDevelopment, uglify()),
        //gulpIf(isDevelopment, sourcemaps.write()),
        gulp.dest(path.build.js)
    ).on('error', notify.onError());
});


gulp.task('clean', function() {
    return del(path.base.build);
});

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('js')
));

gulp.task('watch', function(){
    gulp.watch(path.watch.js, gulp.series('js'));
});

gulp.task('dev', gulp.series('build', 'watch'));