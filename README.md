## angular-gulp-bower-browserify-boilerplate

Angular boilerplate using Gulp, Bower, and Browserify.

## References

If you want to create your own boilerplate from scratch that is similar to this one, those were the references that I used:

1. [Creating an Angular seed with Gulp and Bower](http://mherman.org/blog/2014/08/14/kickstarting-angular-with-gulp)
1. [Integrating Browserify](http://mherman.org/blog/2014/08/15/kickstarting-angular-with-gulp-and-browserify-part-2)
1. [Adding a live reload server for development](http://mindthecode.com/lets-build-an-angularjs-app-with-browserify-and-gulp/)
1. [To avoid having to run the clean command before every development and distribution build command](https://www.npmjs.com/package/run-sequence)
1. [Adding javascript optimizations for the distribution build](https://www.npmjs.com/package/gulp-uglify)
1. [Adding html optimizations for the distribution build](https://www.npmjs.com/package/gulp-htmlmin)
1. [Adding css optimizations for the distribution build](https://www.npmjs.com/package/gulp-minify-css)
1. [Adding images optimizations for the distribution build](https://www.npmjs.com/package/gulp-imagemin)


## Quick Start

1. Make sure you have node.js installed;
1. Clone the repo;
1. Install the global requirements: `npm install -g gulp bower browserify`;
1. Install the local requirements: `npm install`;
1. Install the Bower components: `bower install`;
1. Run locally with `gulp` and access it through  `http://localhost:5000/`;
1. Create a build: `gulp build` and preview it through `http://localhost:9999/`.

## Clean

If you want to clean both dist and dev folders you can run: `gulp clean`