// Gulp
var gulp = require('gulp');

// Plugins
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var browserify = require('gulp-browserify');
var concat = require('gulp-concat');
var runSequence = require('run-sequence');


// Minification plugins
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var pngquant = require('imagemin-pngquant');

// Live reload plugins
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
// Use our 'dev' folder as rootfolder
server.use(express.static('./dev'));
// This redirects everything back to our index.html
server.all('/*', function(req, res) {
    res.sendfile('index.html', { root: 'dev' });
});

// Detect errors and potential problems in javascript code
gulp.task('lint', function() {
  gulp.src(['./app/**/*.js', '!./app/bower_components/**'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

// Global Clean
gulp.task('clean', function() {
    // Clean the dist folder
    gulp.src('./dist/*')
      .pipe(clean({force: true}));

    // Clean the dev folder
    gulp.src('./dev/*')
      .pipe(clean({force: true}));
});

// Clean the dist folder
gulp.task('clean-dist', function() {
    // The return is to ensure it can be used with run sequence
    return gulp.src('./dist/*')
      .pipe(clean({force: true}));
});

// Clean the dev folder
gulp.task('clean-dev', function() {
    // The return is to ensure it can be used with run sequence
    return gulp.src('./dev/*')
      .pipe(clean({force: true}));
});

// Minify all the css files
gulp.task('minify-css', function() {
  var opts = {comments:true,spare:true};
  // Get all the css files
  gulp.src(['./app/**/*.css', '!./app/bower_components/**'])
    // Minify them all
    .pipe(minifyCSS({
      comments:true,
      spare:true
    }))
    // And place them inside the dist folder
    .pipe(gulp.dest('./dist/'))
});

// Minify all the images
gulp.task('minify-images', function () {

  // Get all the png files
  gulp.src('./app/**/*.png')
    // Minify them using the pngquant
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    }))
    // And place them inside in the dist folder
    .pipe(gulp.dest('dist'));

  // Get all the gif and jpg files
  gulp.src('./app/**/*.{gif,jpg}')
    // Minify them
    .pipe(imagemin({
        progressive: true,
    }))
    // And place them inside the dist folder
    .pipe(gulp.dest('dist'));
});

// Minify all the views
gulp.task('minify-views', function () {

  // Get all the html files
  gulp.src('./app/**/*.html')
    // Minify them
    .pipe(htmlmin({collapseWhitespace: true}))
    // And place them inside the dist folder
    .pipe(gulp.dest('dist'));
});

// Copy the bower dependencies to the dev folder
gulp.task('copy-bower-components-dev', function () {
  // Get all the bower directory
  gulp.src('./app/bower_components/**')
    // And place them inside the dev folder;
    .pipe(gulp.dest('dev/bower_components'));
});

// Copy the bower dependecies to the dist folder
gulp.task('copy-bower-components-dist', function () {
  // Get all the bower directory
  gulp.src('./app/bower_components/**')
    // And place them inside the dist folder;
    .pipe(gulp.dest('dist/bower_components'));
});

// Create a server for the dist app to be tested
gulp.task('connectDist', function () {
  connect.server({
    root: 'dist/',
    port: 9999
  });
});

// Browserify app for developemnt
gulp.task('browserify-dev', function() {
  // Get the main.js script
  gulp.src(['app/scripts/main.js'])
    // Broserify it
    .pipe(browserify({
      insertGlobals: true,
      debug: false
    }))
    // Concatenate all of it the bundled.js files
    .pipe(concat('bundled.js'))
    // Place it inside the dev folder
    .pipe(gulp.dest('dev/scripts'))
    .pipe(refresh(lrserver)); // Tell the lrserver to refresh
});

// Browserify app for distribution
gulp.task('browserify-dist', function() {
  // Get the main.js script
  gulp.src(['app/scripts/main.js'])
  // Browserify it
  .pipe(browserify({
    insertGlobals: true,
    debug: false
  }))
  // Concatenate all of it in the bundled.js files
  .pipe(concat('bundled.js'))
  // Minify it
  .pipe(uglify({
      // inSourceMap:
      // outSourceMap: "app.js.map"
    }))
  // And place it inside the dist folder
  .pipe(gulp.dest('dist/scripts'));
});

// Views task for development
gulp.task('views-dev', function() {
  // Get our index.html
  gulp.src('app/index.html')
  // And place it inside the dev folder
  .pipe(gulp.dest('dev/'));

  // Get any other view files from app/views
  gulp.src('./app/views/**/*')
  // Place them inside the dev/views folder
  .pipe(gulp.dest('dev/views/'))
  // And tell the lrserver to refresh
  .pipe(refresh(lrserver));
});

// Views task for distribution
gulp.task('views-dist', function() {
  // Get our index.html
  gulp.src('app/index.html')
  // And place it inside the dist folder
  .pipe(gulp.dest('dist/'));

  // Get any other view files from app/views
  gulp.src('./app/views/**/*')
  // And place them inside the dev/views folder
  .pipe(gulp.dest('dist/views/'));
});

// Style task for development
gulp.task('styles-dev', function() {

  // Get the css files from app/styles
  gulp.src('./app/styles/**/*.css')
  // Place them inside the dev/styles folder
  .pipe(gulp.dest('dev/styles/'))
  // And the lrserver to refresh
  .pipe(refresh(lrserver));
});

// Images task for developement
gulp.task('images-dev', function() {

  // Get any jpg, gif and png files from app/images
  gulp.src('./app/images/**/*.{jpg,gif,png}')
  // Place them inside the dev/images folder
  .pipe(gulp.dest('dev/images/'))
  // And tell the lrserver to refresh
  .pipe(refresh(lrserver));
});

// Watch task for live reload
gulp.task('watch', ['lint'], function() {
  // Start webserver
  server.listen(serverport);
  // Start live reload
  refresh.listen(livereloadport);

  // Watch all the javascript changes
  gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'],[
    'lint',
    'browserify-dev'
  ]);

  //Watch all the html files
  gulp.watch(['app/index.html', 'app/views/**/*.html'], [
  'views-dev'
  ]);

  //Watch all the css files
  gulp.watch(['app/styles/**/*.css'], [
  'styles-dev'
  ]);

  //Watch all the image files
  gulp.watch(['app/images/*.{jpg,gif,png}', 'app/images/**/*.{jpg,gif,png}'],[
    'images-dev'
  ]);
});

//Build the developmenet folder
gulp.task('dev', function(callback) {
  runSequence('clean-dev',
              ['views-dev', 'styles-dev', 'images-dev', 'copy-bower-components-dev', 'lint', 'browserify-dev'],
              callback);
});

//Build the distribution folder
gulp.task('build', function(callback) {
  runSequence('clean-dist',
              ['lint', 'minify-css', 'browserify-dist', 'minify-images', 'minify-views', 'copy-bower-components-dist', 'connectDist'],
              callback);
});

//Build the development folder and start live reload
gulp.task('default', ['dev', 'watch']);