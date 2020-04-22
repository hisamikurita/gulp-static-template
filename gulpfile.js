// JavaScript Document
const gulp = require('gulp'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  csscomb = require('gulp-csscomb'),
  autoprefixer = require('autoprefixer'),
  flexBugsFixies = require('postcss-flexbugs-fixes'),
  imagemin = require('gulp-imagemin'),
  imageminPngquant = require('imagemin-pngquant'),
  imageminMozjpeg = require('imagemin-mozjpeg'),
  plumber = require('gulp-plumber'),
  webpackStream = require("webpack-stream"),
  webpack = require("webpack"),
  webpackConfig = require("./webpack.config");

//cssコンパイル//////////////////
gulp.task('sass', () => {
  return gulp.src('./src/scss/style.scss')
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'compressed' }))
    .pipe(postcss([autoprefixer()]))
    .pipe(postcss([flexBugsFixies()]))
    .pipe(csscomb())
    .pipe(gulp.dest('dist/css'))
});
//JS圧縮//////////////////
gulp.task("webpack", () => {
  webpackStream(webpackConfig, webpack)
    .pipe(gulp.dest('dist/js'));
});
//画像圧縮//////////////////
gulp.task('imagemin', (done) => {
  gulp.src('dist/images/**/*')
    .pipe(imagemin(
      [
        imageminPngquant({ quality: '65-80' }),
        imageminMozjpeg({ quality: 80 }),
        imagemin.svgo(),
        imagemin.gifsicle()
      ]
    ))
    .pipe(gulp.dest('dist/images/'));
  done();
});
// ファイルを常に監視//////////////////
gulp.task('watch', () => {
  gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
  gulp.watch('./src/js/**/*.js', gulp.series('webpack'));
});
// タスクの実行の順番//////////////////
gulp.task('default', gulp.series('watch'));