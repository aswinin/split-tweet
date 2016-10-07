const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const clean = require('gulp-clean');
 
gulp.task('lint', function() {
  gulp
    .src(["es6/lib/**/*.js", "es6/test/**/*.js"])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('clean', function() {
  // Clean previous transcompiled scripts
  gulp
    .src('lib/**/*.js', {read: false})
    .pipe(clean());
  gulp
    .src('test/**/*.js', {read: false})
    .pipe(clean());
});

gulp.task('transcompile', ['clean'], function() {
  gulp
    .src("es6/lib/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("lib"));
  gulp
    .src("es6/test/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("test"));
});

gulp.task('test', ['transcompile'], function() {
  gulp
    .src('test/**/*.js', {read: false})
    .pipe(mocha({ growl: true }))
});

gulp.task('default', ['test'], function() {});

gulp.task('watch', function() {
  gulp
    .watch('es6/**/*.js', ['default']);
});
