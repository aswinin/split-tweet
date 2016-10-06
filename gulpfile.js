const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');

gulp.task('lint', function() {
  gulp
    .src(["es6/lib/**/*.js", "es6/test/**/*.js"])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('transcompile', function() {
  gulp
    .src("es6/lib/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("lib"));
  gulp
    .src("es6/test/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("test"));
});

gulp.task('test', function() {
  gulp
    .src('test/**/*.js', {read: false})
    .pipe(mocha({ reporter: 'spec', growl: true }))
});
