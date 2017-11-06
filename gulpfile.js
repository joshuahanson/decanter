'use strict';

const gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    cleancss = require('gulp-clean-css'),
    stylish = require('jshint-stylish'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    browser = require('browser-sync').create();

const paths = {
    scripts: './assets/js/scripts.js',
    images: './assets/images/**/*',
    styles: './assets/scss/style.scss',
    dist: './assets/dist/**/*'
};

gulp.task('images', function () {
    return gulp.src(paths.images)
        .pipe(imagemin({
            optimizationLevel: 3
        }))
        .pipe(gulp.dest('./assets/dist/img'));
});

gulp.task('scripts', function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('scripts.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./assets/dist/js'));
});

gulp.task('styles', function () {
    return gulp.src(paths.styles)
        .pipe(plumber(function (error) {
            gutil.log(gutil.colors.red(error.message));
            this.emit('end');
        }))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(cleancss({
            compatibility: 'ie11'
        }))
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest('./assets/dist/css/'))
        .pipe(browser.reload({
            stream: true
        }));
});

gulp.task('clean-dist', function () {
    return gulp.src(paths.dist, {
            read: false
        })
        .pipe(clean());
});

gulp.task('browser-sync', ['styles'], function () {
    browser.init({
        server: {
            baseDir: "./"
        }
    });
});

gulp.task('default', function () {
    gulp.start('styles');
    gulp.start('scripts');
    gulp.start('images');
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch('./assets/scss/**/*.scss', ['styles']);
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch("*.html").on('change', browser.reload);
});