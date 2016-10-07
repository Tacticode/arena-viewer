'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');

var scripts = [
	'script/tacticode.js',
	'script/*.js',
	'!script/arena-viewer.js',
	'!script/config*.js'
];

gulp.task('default', function() {
  return gulp.src(scripts)
      .pipe(concat('arena-viewer.js'))
      .pipe(gulp.dest('script/'));
});
