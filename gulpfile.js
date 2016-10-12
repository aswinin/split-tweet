const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
 
gulp.task('lint', function() {
  return gulp
    .src(["es6/lib/**/*.js", "es6/test/**/*.js"])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('clean', function() {
  return gulp
    .src('es5/**/*.js', {read: false})
    .pipe(clean());
});

gulp.task('transcompile', function() {
  return gulp
    .src("es6/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("es5/"));
});

gulp.task('test', function() {
  return gulp
    .src('es5/test/**/*.js', {read: false})
    .pipe(mocha({ growl: true }))
});

gulp.task('default', function() {
  runSequence(
    'clean',
    'transcompile', 
    'test',
    'lint'
  );
});

gulp.task('watch', function() {
  gulp.watch('es6/**/*.js', ['default']);
});
