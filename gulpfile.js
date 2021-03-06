const gulp = require('gulp');
const requireDir = require('require-dir');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync');
const reload = browserSync.reload;

const $ = require('./gulp/plugins');
const DIR = require('./gulp/conf').DIR;

requireDir('./gulp/tasks');

gulp.task('predefault', cb => {
  runSequence(
    'cleanDest',
    ['pug', 'sass', 'watchify', 'copyToDest'],
    'serve',
    cb
  );
});

gulp.task('default', ['predefault'], () => {
  $.watch(
    [`./${DIR.SRC}/**/*.{scss,sass}`],
    () => {
      gulp.start(['sass'])
    }
  ).on('change', reload);

  $.watch(
    [`./${DIR.SRC}/**/*.pug`]
  ).on('change', reload);

  $.watch(
    [`./${DIR.DEST}/**/*.js`]
  ).on('change', reload);

  $.watch(
    [
      `./${DIR.SRC}/img/**/*.*`,
      `./${DIR.SRC}/font/**/*.*`
    ],
    () => {
      gulp.start(['copyToDest'])
    }
  ).on('change', reload);
});

gulp.task('build', cb => {
  runSequence(
    'cleanDest',
    ['pug', 'sass', 'browserify', 'copyToDest'],
    'cleanBuild',
    'replaceHtml',
    'cleanCss',
    'imagemin',
    'uglify',
    'copyToBuild',
    cb
  );
});
