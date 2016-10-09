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

gulp.task('clean-lib', function() {
  // Clean previous transcompiled scripts
  return gulp
    .src('lib/**/*.js', {read: false})
    .pipe(clean());
});

gulp.task('clean-test', function() {
  return gulp
    .src('test/**/*.js', {read: false})
    .pipe(clean());
});

gulp.task('transcompile-lib', function() {
  return gulp
    .src("es6/lib/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("lib"));
});

gulp.task('transcompile-test', function() {
  return gulp
    .src("es6/test/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("test"));
});

gulp.task('test', function() {
  return gulp
    .src('test/**/*.js', {read: false})
    .pipe(mocha({ growl: true }))
});

gulp.task('default', function() {
  runSequence(
    ['clean-lib', 'clean-test'],
    ['transcompile-lib', 'transcompile-test'], 
    'test',
    'lint'
  );
});

gulp.task('watch', function() {
  gulp
    .watch('es6/**/*.js', ['default']);
});
