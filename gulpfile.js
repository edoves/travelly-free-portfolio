const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const cleanCSS = require("gulp-clean-css");
const sass = require('gulp-sass');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const maps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');



function copyHTML() {
    return gulp.src('./*.html')
        .pipe(gulp.dest('./src'))
        .pipe(gulp.dest('./dist'));
}

function images() {
    return gulp.src('./src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img'));
}

gulp.task('framework', function (cb) {

    // Bootstrap
    gulp.src([
        './node_modules/bootstrap/dist/**/*',
        '!./node_modules/bootstrap/dist/css/bootstrap-grid*',
        '!./node_modules/bootstrap/dist/css/bootstrap-reboot*'

    ])
        .pipe(gulp.dest('./dist/framework/bootstrap'))

    // Font Awesome
    gulp.src([
        './node_modules/@fortawesome/**/*'
    ])
        .pipe(gulp.dest('./dist/framework'))

    // jQuery
    gulp.src([
        './node_modules/jquery/dist/*',
        '!./node_modules/jquery/dist/core.js'
    ])
        .pipe(gulp.dest('./dist/framework/jquery'))

    cb();

});

function styles() {
    return gulp
        .src("./src/scss/*.scss")
        .pipe(maps.init())
        .pipe(sass({
            errLogToConsole: true,
            outputStyle: "expanded"
        }))
        .on("error", sass.logError)
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(cleanCSS())
        .pipe(maps.write('./'))
        .pipe(gulp.dest("./dist/css"))
        .pipe(browserSync.stream());;
}

// JS task
function scripts() {
    return gulp
        .src([
            './src/js/*.js'
            // '!./js/contact_me.js',
            // '!./js/jqBootstrapValidation.js'
        ])
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(maps.init())
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(maps.write('./'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream());;
}


function watch() {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('./*.html', copyHTML);
    gulp.watch('./src/scss/*.scss', styles);
    gulp.watch('./src/js/*.js', scripts);
    gulp.watch('./src/img/*', images);
    gulp.watch('./*.html').on('change', browserSync.reload);
    // gulp.watch(['dist/*.html', 'dist/css/*.css', 'dist/js/*.js', "./**/*.html"]).on('change', browserSync.reload);
}


exports.copyHTML = copyHTML;
exports.images = images;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;


gulp.task("default", gulp.parallel('framework', styles, scripts, images, copyHTML));


gulp.task("dev", gulp.parallel(watch, ['default']));
