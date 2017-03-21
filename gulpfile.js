var gulp = require('gulp');
var connect = require('gulp-connect');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var livereload = require ('gulp-livereload')
var autoprefixer = require('gulp-autoprefixer');
var ngAnnotate = require('browserify-ngannotate');
var fs = require('fs');

var config = JSON.parse(fs.readFileSync('./build-config.json'));


gulp.task('connect', function () {
  connect.server({
    root: 'app/',
    port: 8888
  });
});

gulp.task('connect-dist', function () {
  connect.server({
    root: 'dist/',
    port: 8888
  });
});

// Clean Up

gulp.task('clean', function() {
	 gulp.src('./dist/**')
    //  gulp.src('./dist/**/*')
      .pipe(clean({force: true}));
	 gulp.src('./app/js/bundled.js')
      .pipe(clean({force: true}));
});

gulp.task('sass', function () {
  gulp.src('./app/sass/**/*.scss')
    .pipe(sass({
    	outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./app/'))
    .pipe(livereload());
});

gulp.task('concatLibsCss', function() {
     gulp.src( config.css.libs )
        .pipe(concat('libs.css'))
        .pipe(gulp.dest('./app/'))
        .pipe(livereload());
});

gulp.task('hint', function() {
	gulp.src(['./app/js/**/*.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('htmlreload', function () {
	gulp.src(['./app/**/*.html'])
		.pipe(livereload());
});

gulp.task('browserify', function() {
	gulp.src(['app/js/app.js'])
		.pipe(browserify ({
			insertGlobals: true,
			debug: true
		}))
		.pipe(concat('bundle.js'))
		.pipe(gulp.dest('./app'))
		.pipe(livereload());
});

gulp.task('minify-css', function() {
	var opts = {comments: true, spare: true};
	gulp.src(['./app/**/*.css'])
		.pipe(minifyCSS(opts))
		.pipe(gulp.dest('./dist'))
});

gulp.task('copy-html-files', function() {
	gulp.src('./app/**/*.html')
	 .pipe(gulp.dest('./dist'));
});

gulp.task('copy-images', function() {
	gulp.src('./app/images/**/*.*')
	 .pipe(gulp.dest('./dist/images'));
});

gulp.task('browserify-dist', function() {
  gulp.src(['app/js/app.js'])
	  .pipe(browserify({
	    insertGlobals: true,
	    debug: true,
	    transform: [ngAnnotate]
	  }))
  .pipe(concat('bundle.js'))
  // .pipe(uglify())
  .pipe(gulp.dest('./dist/'))
});

gulp.task('buildrun', function() {
	runSequence(
		['clean'],
		['clean','copy-html-files','copy-images', 'sass', 'concatLibsCss', 'minify-css', 'hint', 'browserify-dist', 'connect-dist']
	);
});

gulp.task('default', function() {
	livereload.listen();
	runSequence(
		['clean'],
		['sass','concatLibsCss','browserify','connect']
	);
	gulp.watch('./app/sass/**/*.scss', ['sass']);
	gulp.watch('./app/js/**/*.js', ['hint','browserify']);
	gulp.watch('./app/**/*.html', ['htmlreload']);
});
