var gulp = require('gulp'),
    clean = require('gulp-clean'),
    browserSync = require('browser-sync').create(),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    uglifycss = require('gulp-uglifycss'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    sourcemaps = require('gulp-sourcemaps'),
    fileInclude = require('gulp-file-include'),
    beautifyCode = require('gulp-beautify-code'),

    imagemin = require('gulp-imagemin'),
    imageminUPNG = require("imagemin-upng"),
    mozjpeg = require('imagemin-mozjpeg'),
    jpegRecompress = require('imagemin-jpeg-recompress'),
    svgo = require('imagemin-svgo'),

    // Source Folder Locations
    src = {
        'root': './src/',

        'rootHtml': ['./src/html/home/*.html', './src/html/elements/*.html', './src/html/shop/*.html', './src/html/blog/*.html', './src/html/courses/*.html', './src/html/others/*.html'],
        'rootPartials': './src/partials/',

        'fontsAll': './src/assets/fonts/**/*',
        'php': './src/assets/php/**/*',

        'rootCss': './src/assets/css/**/*',
        'pluginsCss': './src/assets/css/plugins/**/*',
        'vendorCss': './src/assets/css/vendor/**/*',

        'styleScss': './src/assets/scss/style.scss',
        'scssAll': './src/assets/scss/**/*',

        'rootJs': './src/assets/js/**/*',
        'pluginsJs': './src/assets/js/plugins/**/*',
        'vendorJs': ['./src/assets/js/vendor/modernizr-3.6.0.min.js', './src/assets/js/vendor/jquery-3.4.1.min.js', './src/assets/js/vendor/jquery-migrate-3.1.0.min.js', './src/assets/js/vendor/bootstrap.bundle.min.js', ],

        'images': './src/assets/images/**/*'
    },

    // Destination Folder Locations
    dest = {
        'root': './dest/',
        'fonts': './dest/assets/fonts/',
        'php': './dest/assets/php/',
        'scss': './dest/assets/scss/',

        'rootCss': './dest/assets/css',
        'pluginsCss': './dest/assets/css/plugins/',
        'vendorCss': './dest/assets/css/vendor/',

        'rootJs': './dest/assets/js',
        'vendorJs': './dest/assets/js/vendor/',
        'pluginsJs': './dest/assets/js/plugins/',

        'images': './dest/assets/images/'
    },

    // Separator For Vendor CSS & JS
    separator = '\n\n/*====================================*/\n\n',

    // Autoprefixer Options
    autoPreFixerOptions = [
        "last 4 version",
        "> 1%",
        "ie >= 9",
        "ie_mob >= 10",
        "ff >= 30",
        "chrome >= 34",
        "safari >= 7",
        "opera >= 23",
        "ios >= 7",
        "android >= 4",
        "bb >= 10"
    ];



/*-- 
    Live Synchronise & Reload
--------------------------------------------------------------------*/
function liveBrowserSync(done) {
    browserSync.init({
        server: {
            baseDir: dest.root
        }
    });
    done();
}

function reload(done) {
    browserSync.reload();
    done();
}

/*-- 
    Gulp Custom Notifier
--------------------------------------------------------------------*/
function customPlumber(errTitle) {
    return plumber({
        errorHandler: notify.onError({
            title: errTitle || "Error running Gulp",
            message: "Error: <%= error.message %>",
            sound: "Glass"
        })
    });
}

/*-- 
    Gulp Other Tasks
--------------------------------------------------------------------*/

/*-- Remove Destination Folder Before Starting Gulp --*/
function cleanProject(done) {
    gulp.src(dest.root)
        .pipe(customPlumber('Error On Clean App'))
        .pipe(clean());
    done();
}

/*-- Copy Font Form Source to Destination Folder --*/
function fonts(done) {
    gulp.src(src.fontsAll)
        .pipe(customPlumber('Error On Copy Fonts'))
        .pipe(gulp.dest(dest.fonts));
    done();
}

/*-- Copy PHP Form Source to Destination Folder --*/
function php(done) {
    gulp.src(src.php)
        .pipe(customPlumber('Error On Copy Fonts'))
        .pipe(gulp.dest(dest.php));
    done();
}

/*-- Copy Video & Audio Form Source to Destination Folder --*/
function media(done) {
    gulp.src('./src/assets/media/**/*')
        .pipe(customPlumber('Error On Copy Fonts'))
        .pipe(gulp.dest('./dest/assets/media/'));
    done();
}

/*-- 
    All HTMl Files Compile With Partial & Copy Paste To Destination Folder
--------------------------------------------------------------------*/
function html(done) {
    gulp.src(src.rootHtml)
        .pipe(customPlumber('Error On Compile HTML'))
        .pipe(fileInclude({
            basepath: src.rootPartials
        }))
        .pipe(beautifyCode())
        .pipe(gulp.dest(dest.root));
    done();
}

/*-- 
    CSS & SCSS Task
--------------------------------------------------------------------*/

/*-- Copy All CSS Files Form CSS Folder --*/
function cssCopy(done) {
    gulp.src(src.rootCss)
        .pipe(customPlumber('Error On Copying CSS'))
        .pipe(gulp.dest(dest.rootCss));
    done();
}

function miniVendorCss(done) {
    gulp.src(src.vendorCss)
        .pipe(customPlumber('Error On Minifying Vendor CSS'))
        .pipe(uglifycss())
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(dest.vendorCss));
    done();
}

function miniPluginsCss(done) {
    gulp.src(src.pluginsCss)
        .pipe(customPlumber('Error On Minifying Plugins CSS'))
        .pipe(uglifycss())
        .pipe(concat('plugins.min.css'))
        .pipe(gulp.dest(dest.pluginsCss));
    done();
}

/*-- Gulp Compile Scss to Css Task & Minify --*/
function styleCss(done) {
    gulp.src(src.styleScss)
        .pipe(sourcemaps.init())
        .pipe(customPlumber('Error On Compiling Style Scss'))
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(autoprefixer(autoPreFixerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest.rootCss))
        .pipe(browserSync.stream())
        .pipe(customPlumber('Error On Compiling & Minifying Style Scss'))
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(uglifycss())
        .pipe(concat('style.min.css'))
        .pipe(autoprefixer(autoPreFixerOptions))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(dest.rootCss))
        .pipe(browserSync.stream());
    done();
}

/*-- Copying all Scss files in Destination Assets folder --*/
function scss(done) {
    gulp.src(src.scssAll)
        .pipe(customPlumber('Error On Copying all Scss files in Destination Assets folder'))
        .pipe(gulp.dest(dest.scss));
    done();
}


/*-- 
    JS Task
--------------------------------------------------------------------*/
function jsCopy(done) {
    gulp.src(src.rootJs)
        .pipe(customPlumber('Error On Copying all JS files in Destination Assets folder'))
        .pipe(gulp.dest(dest.rootJs));
    done();
}
/*-- Vendor --*/
function miniVendorJs(done) {
    gulp.src(src.vendorJs)
        .pipe(customPlumber('Error On Combining & Minifying Plugin JS'))
        .pipe(concat('vendor.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dest.vendorJs));
    done();
}
/*-- Plugins --*/
function miniPluginsJs(done) {
    gulp.src(src.pluginsJs)
        .pipe(customPlumber('Error On Combining & Minifying Plugin JS'))
        .pipe(concat('plugins.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dest.pluginsJs));
    done();
}

/*-- 
    Image Optimization
--------------------------------------------------------------------*/
function images(done) {
    gulp.src(src.images)
        .pipe(gulp.dest(dest.images));
    done();
}

function imageOptimize(done) {
    gulp.src(src.images)
        .pipe(imagemin(
            [imageminUPNG(), mozjpeg(), jpegRecompress(), svgo()], {
                verbose: true
            }
        ))
        .pipe(gulp.dest(dest.images));
    done();
}

/*-- 
    All, Watch & Default Task
--------------------------------------------------------------------*/

/*-- All --*/
gulp.task('clean', cleanProject);
gulp.task('imageOptimize', imageOptimize);
gulp.task('allTask', gulp.series(fonts, php, html, media, cssCopy, miniVendorCss, miniPluginsCss, styleCss, scss, jsCopy, miniVendorJs, miniPluginsJs, images));

/*-- Watch --*/
function watchFiles() {
    gulp.watch(src.fontsAll, gulp.series(fonts, reload));
    gulp.watch(src.php, gulp.series(php, reload));
    gulp.watch('./src/assets/media/**/*', gulp.series(media, reload));

    gulp.watch(src.rootHtml, gulp.series(html, reload));
    gulp.watch(src.rootPartials, gulp.series(html, reload));

    gulp.watch(src.rootCss, gulp.series([cssCopy, miniVendorCss, miniPluginsCss], reload));
    gulp.watch(src.scssAll, gulp.series(styleCss));
    gulp.watch(src.scssAll, gulp.series(scss));

    gulp.watch(src.rootJs, gulp.series([jsCopy, miniVendorJs, miniPluginsJs], reload));

    gulp.watch(src.images, gulp.series(images, reload));
}

/*-- Default --*/
gulp.task('default', gulp.series('allTask', gulp.parallel(liveBrowserSync, watchFiles)));