// Gulp Dependencies
var gulp = require('gulp');
var rename = require('gulp-rename');

// Build Dependencies
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

// Style Dependencies
var sass = require('gulp-sass');
// var prefix = require('gulp-autoprefixer');

// Browserify
gulp.task('browserify-src', [], function() {
  return gulp.src('src/js/main.js')
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(rename('bundle.js'))
    // .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/js'));
});


gulp.task('browserify-src2', [], function() {
  return gulp.src('src/js/main.triggers.js')
    .pipe(browserify({
      insertGlobals: true
    }))
    .pipe(rename('bundle.triggers.js'))
    // .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/js'));
});



// Styles

gulp.task('styles', function() {
  return gulp.src('src/sass/styles.scss')
    .pipe(sass())
    // .pipe(prefix({ cascade: true }))
    .pipe(rename('styles.css'))
    // .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/css'));
});


// gulp.task('uglify', ['browserify-src'], function() {
//   return gulp.src('public/js/bundle.js')
//     .pipe(uglify())
//     .pipe(rename('bundle.min.js'))
//     .pipe(gulp.dest('public/js'));
// });



gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['browserify-src', 'browserify-src2']);
  gulp.watch('src/**/*.scss', ['styles']);
});

gulp.task('build');//, ['uglify']);
gulp.task('default', ['build', 'watch']);