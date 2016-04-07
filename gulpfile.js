'use strict';

const fs = require('fs');
const gulp = require('gulp');
const replace = require('gulp-replace');
const ghtmlSrc = require('gulp-html-src');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");
const cssmin = require('gulp-minify-css');
const htmlreplace = require('gulp-html-replace');
const del = require('del');
const argv = require('yargs').argv;
const env = argv.env || 'dev';


/**
 * Delete every file & folder in dist/ folder.
 */
gulp.task('clean', () => del(['dist/**/*']));


/**
 * Copy eveything from src/medias into dist/medias.
 */
gulp.task('copy-medias', ['clean'], () => {
    return gulp
        .src('src/medias/**/*', {base: 'src/'})
        .pipe(gulp.dest('dist/'));
});


/**
 * Copy everything (except medias) in src folder, replaces all media references
 * according to --env parameter, then save them into dist/ folder.
 */
gulp.task('copy-and-replace-medias', ['clean'], () => {
    const medias = require('./src/medias.json');
    const keys = Object.keys(medias);
    let rv = gulp.src([
            'src/**/*',
            '!src/medias/**/*'
        ], {base: 'src/'});

    keys.forEach((key) => {
        if (!medias[key] || !medias[key][env])
            throw new Error(`Environment "${env}" does not exists medias.json (media: ${key})`);
        rv = rv.pipe(replace(new RegExp(`{{\\s*${key}\\s*}}`, 'ig'), medias[key][env]));
    });

    return rv.pipe(gulp.dest('dist/'));
});


/**
 * Scan index.html for all script tags (js files),
 * concat them,
 * if --compile flag defined, uglify it
 * save it to dist/build/ folder.
 */
gulp.task('build-js', ['copy-and-replace-medias'], () => {
    let rv = gulp
        .src('dist/index.html')
        .pipe(ghtmlSrc())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/build/'));

    if (argv.compile !== undefined)
        rv = rv
            .pipe(uglify())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('dist/build/'));

    return rv;
});


/**
 * Scan index.html for all link tags (css files),
 * concat them,
 * if --compile flag defined, minify it
 * save it to dist/build/ folder.
 */
gulp.task('build-css', ['copy-and-replace-medias'], () => {
    let rv = gulp
        .src('dist/index.html')
        .pipe(ghtmlSrc({presets: 'css'}))
        .pipe(concat('app.css'))
        .pipe(gulp.dest('dist/build/'));

    if (argv.compile !== undefined)
        rv = rv
            .pipe(cssmin())
            .pipe(rename({
                suffix: '.min'
            }))
            .pipe(gulp.dest('dist/build/'));

    return rv;
});


/**
 * Inject concated (or compiled) js and css file to index.html as inline.
 */
gulp.task('inject', ['build-js', 'build-css'], () => {
    let cssFile = 'dist/build/app.css';
    let jsFile = 'dist/build/app.js';

    if (argv.compile !== undefined) {
        cssFile = 'dist/build/app.min.css';
        jsFile = 'dist/build/app.min.js';
    }

    return gulp.src('dist/index.html')
        .pipe(htmlreplace({
            'css': `<style>${fs.readFileSync(cssFile, 'utf8')}</style>`,
            'js': `<script>${fs.readFileSync(jsFile, 'utf8')}</script>`
        }))
        .pipe(gulp.dest('dist/'));
});


/**
 * Default `gulp` methold.
 */
gulp.task('default', [
    'clean',
    'copy-medias',
    'copy-and-replace-medias'
]);


/**
 * `gulp watch` method.
 */
gulp.task('watch', () => gulp.watch('src/**/*', ['default']));


/**
 * `gulp build` method.
 */
gulp.task('build', [
    'clean',
    'copy-medias',
    'copy-and-replace-medias',
    'build-js',
    'build-css',
    'inject'
]);

