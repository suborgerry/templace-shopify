'use strict';

const gulp = require('gulp'),
  autoprefixer = require('gulp-autoprefixer'),
  rename = require("gulp-rename"),
  sass = require('gulp-sass')(require('sass')),
  // sourcemaps = require('gulp-sourcemaps'),
  uglify = require('gulp-uglify-es').default,
  scsslint = require('gulp-scss-lint');

/**
 * Asset paths.
 */
const scssSrc = 'scss/**/*.scss';
const jsSrc = 'js/*.js';
const assetsDir = '../assets/';

/**
 * Scss lint
 */
gulp.task('scss-lint', function () {
  return gulp.src(scssSrc)
    .pipe(scsslint());
});

/**
 * SCSS task
 */
gulp.task('css', function () {
  return gulp.src('scss/*.scss.liquid')
    // .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(rename(function (path) {
      path.basename = path.basename.replace('.scss', '');
    }))
    // .pipe(sourcemaps.mapSources(function (sourcePath) {
    //   return '../dev/scss/' + sourcePath;
    // }))
    // .pipe(sourcemaps.write(assetsDir))
    .pipe(gulp.dest(assetsDir));
});

/**
 * JS task
 *
 * Note: you may or may not want to include the 2 below:
 * babel polyfill and jquery
 */
const jsFiles = [
  jsSrc,
];
const jsDest = assetsDir;

gulp.task('js', function () {
  return gulp.src(jsFiles)
    .pipe(gulp.dest(jsDest))
    .pipe(uglify())
    .pipe(rename(function (path) {
      path.basename += '.min';
    }))
    .pipe(gulp.dest(jsDest));
});

/**
 * Watch task
 */
gulp.task('watch', function () {
  gulp.watch(scssSrc, gulp.series('css'));
  gulp.watch(jsSrc, gulp.series('js'));
});

/**
 * Default task
 */
gulp.task('default', gulp.series('css', 'js', 'watch'));