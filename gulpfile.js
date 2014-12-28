// gulp
var gulp = require('gulp');

// plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');

var embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 5000;

// Set up an express server (but not starting it yet)
var server = express();
// Add live reload
server.use(livereload({port: livereloadport}));
// Use our 'dist' folder as rootfolder
server.use(express.static('./dist'));
// Because I like HTML5 pushstate .. this redirects everything back to our index.html
server.all('/*', function(req, res) {
    res.sendfile('index.html', { root: 'dist' });
});

// tasks
gulp.task('lint', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('clean', function() {
    gulp.src('./dist/*')
      .pipe(clean({force: true}));
});

gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    .pipe(minifyCSS(opts))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('minify-js', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
    .pipe(gulp.dest('./dist/'))
});

gulp.task('copy-bower-components', function () {
  gulp.src('./app/bower_components/**')
    .pipe(gulp.dest('dist/bower_components'));
});

gulp.task('copy-html-files', function () {
  gulp.src('./app/**/*.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});

gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});

gulp.task('browserify', function() {
  gulp.src(['app/scripts/main.js'])
  .pipe(browserify({
    insertGlobals: true,
    debug: false
  }))
  .pipe(concat('bundled.js'))
  .pipe(gulp.dest('dist/scripts'))
  .pipe(refresh(lrserver)); // Tell the lrserver to refresh
});

// Views task
gulp.task('views', function() {
  // Get our index.html
  gulp.src('app/index.html')
  // And put it in the dist folder
  .pipe(gulp.dest('dist/'));

  // Any other view files from app/views
  gulp.src('./app/views/**/*')
  // Will be put in the dist/views folder
  .pipe(gulp.dest('dist/views/'))
  .pipe(refresh(lrserver)); // Tell the lrserver to refresh
});

// Views task
gulp.task('styles', function() {

  // Any other css files from app/views
  gulp.src('./app/styles/**/*.css')
  // Will be put in the dist/views folder
  .pipe(gulp.dest('dist/styles/'))
  .pipe(refresh(lrserver)); // Tell the lrserver to refresh
});

gulp.task('watch', ['lint'], function() {
  // Start webserver
  server.listen(serverport);
  // Start live reload
  refresh.listen(livereloadport);

  // Watch our scripts
  gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'],[
    'lint',
    'browserify'
  ]);

  gulp.watch(['app/index.html', 'app/views/**/*.html'], [
  'views'
  ]);

  gulp.watch(['app/styles/**/*.css'], [
  'styles'
  ]);
});

gulp.task('initial-clean', function() {
    return gulp.src('./dist/*')
      .pipe(clean({force: true}));
});

gulp.task('dev', function(callback) {
  runSequence('initial-clean',
              ['views', 'styles', 'copy-bower-components', 'lint', 'browserify'],
              callback);
});

gulp.task('default', ['dev', 'watch']);

// build task
gulp.task('build',
  ['lint', 'minify-css', 'browserify', 'copy-html-files', 'copy-bower-components', 'connectDist']
);