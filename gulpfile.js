var gulp = require('gulp'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('cssnano'),
    bower = require('gulp-bower'),
    concat = require('gulp-concat'),
    path = require('path'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    uglify = require('gulp-uglifyjs'),
    partialify = require('partialify'),
    notify = require("gulp-notify"),
    postcss = require('gulp-postcss'),
    envify = require('envify/custom');

// Dotenv init
require('dotenv').config();

var config = {
    lessPath: path.join('resources', 'less'),
    bowerDir: 'bower_components',
    nodeDir: 'node_modules',
    appPath: path.join('.', 'tanya-bomoh')
}

/**
 * CSS Tasks
 */
gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(config.bowerDir))
});

var fontPaths = [
    path.join(config.bowerDir, 'fontawesome', 'fonts', '**.*'),
    path.join(config.bowerDir, 'bootstrap', 'fonts', '**.*'),
];

gulp.task('icons', function() {
    return gulp.src(fontPaths)
        .pipe(gulp.dest('./public/fonts'));
});

var assetsPath = [
];

gulp.task('assets', function() {
    return gulp.src(assetsPath)
        .pipe(gulp.dest('./public/assets'));
});

var imagesPath = [
];

gulp.task('images', function() {
    return gulp.src(imagesPath)
        .pipe(gulp.dest('./public/images'));
});

gulp.task('css', function() {
    gulp.src(path.join('resources','less','application.less'))
        .pipe(sourcemaps.init())
        .pipe(less({
            paths: [
                path.join(config.bowerDir, 'bootstrap', 'less'),
                path.join(config.bowerDir, 'fontawesome', 'less')
            ]
        }))
        .pipe(autoprefixer())
        .pipe(postcss([cssnano({discardComments: {removeAll: true}})]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.join('public','css')))
        .pipe(notify("Successfully compiled CSS"));
});

gulp.task('build-css', ['bower', 'icons', 'assets', 'css', 'images']); 

/**
 * JS Tasks
 */
 var jsPaths = [
    path.join(config.bowerDir, 'jquery', 'dist', 'jquery.js'),
    path.join(config.bowerDir, 'bootstrap', 'dist', 'js', 'bootstrap.js'),
    path.join('resources', 'js', 'main.js')
 ];

gulp.task('browserify', function() {
    return browserify(path.join(config.appPath,'main.js'))
        .transform(partialify)
        .transform(envify(process.env))
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest(path.join('.', 'resources', 'js')));
})

gulp.task('build-js', ['browserify'], function() {
    var gulpSrc = gulp.src(jsPaths)
      .pipe(concat('application.js'));

      if(typeof process.env.APP_ENV != 'undefined' && process.env.APP_ENV == 'production') {
            gulpSrc = gulpSrc.pipe(uglify());
      }
      
      gulpSrc.pipe(gulp.dest(path.join('.','public','js')))
      .pipe(notify("Successfully compiled JS"));
});

gulp.task('watch', function() {
    gulp.watch(path.join(config.lessPath, '**', '*.less'), ['css']);
    gulp.watch(path.join(config.appPath, '**', '*.*'), ['build-js']);
    gulp.watch(path.join(config.appPath, '**', '**', '**', '*.*'), ['build-js']);
});

gulp.task('dev', ['watch']);
gulp.task('setup', ['build-css', 'build-js'], function() {
    gulp.src('').pipe(notify("Successfully setup all the assets."));
});