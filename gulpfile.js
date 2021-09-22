const {src, dest, parallel, series, watch} = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const babel = require("gulp-babel");

//sökvägar
const files = {
    htmlPath: "src/**/*.html",
    cssPath: "src/css/*.css",
    jsPath: "src/js/*.js",
    imagePath: "src/images/*",
    sassPath: "src/sass/*"
}

//html-task: kopierar över html
function copyHTML() {
    return src(files.htmlPath)
    .pipe(dest('pub'));
}

//css-task: kopierar, konktainerar och minifierar css
function cssTask() {
    return src(files.cssPath)
    .pipe(sourcemaps.init())
    .pipe(concat('main.css'))
    .pipe(cssnano())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/css'))
    .pipe(browserSync.stream());
}

//sass-task: 
function sassTask() {
    return src(files.sassPath)
        .pipe(sass().on("error", sass.logError))
        .pipe(dest("pub/css"))
        .pipe(browserSync.stream());
}

//js-task: kopierar, konktainerar och minifierar js
function jsTask() {
    return src(files.jsPath)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('../maps'))
    .pipe(dest('pub/js'));
}

//images-task: kopierar och minifierar bilder 
function imageTask() {
    return src(files.imagePath)
    .pipe(imagemin())
    .pipe(dest('pub/images'));
}

//watch-task: läser av ändringar i filerna
function watchTask() {

    browserSync.init({
        server: "./pub"
    });
//files.jsPath,         
    watch([files.htmlPath, files.cssPath, files.jsPath, files.imagePath, files.sassPath], parallel(copyHTML, cssTask, jsTask, imageTask, sassTask)).on('change',browserSync.reload);
}

exports.default = series(
    parallel(copyHTML, cssTask, sassTask, jsTask, imageTask),
    watchTask
);

