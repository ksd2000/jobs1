'use strict';

var gulp = require ('gulp'),
    prefixer = require ('gulp-autoprefixer'),
    cache = require ('gulp-cache'),
    imagemin = require ('gulp-imagemin'),
    cssmin = require ('gulp-minify-css'),
    rigger = require ('gulp-rigger'),
    sass = require ('gulp-sass'),
    sourcemaps = require ('gulp-sourcemaps'),
    uglify = require ('gulp-uglify'),
    watch = require ('gulp-watch'),
    pngquant = require ('imagemin-pngquant'),
    rimraf = require ('rimraf'),
    browserSync = require ('browser-sync'),
    reload = browserSync.reload,
    notify = require( 'gulp-notify' );

var path = {
    dist: { //куда складывать готовые после сборки файлы
        html: 'dist/',
        js: 'dist/js/',
        jsInst: 'dist/js/',
        css: 'dist/css/',
        img: 'dist/img/',
        fonts: 'dist/fonts/',
    },
    app: { //откуда брать исходники
        html: 'app/*.html',
        js: 'app/js/*.js',
        jsInst: 'bower_components/jquery/dist/jquery.js',
        style: 'app/style/*.*',
        img: 'app/images/**/*.*',
        fonts: 'app/fonts/**/*.*',
    },
    watch: { //за изменением каких файлов нужно наблюдать
        html: 'app/**/*.html',
        js: 'app/js/**/*.js',
        style: 'app/style/**/*.+(scss|css)',
        img: 'app/images/**/*.*',
        fonts: 'app/fonts/**/*.*',
    },
    clean: './dist'
};

var config = {
    server: {
        baseDir: "./dist"
    },
    tunnel: false,
    host: 'localhost',
    port: 9000,
    logPrefix: "Frontend_Devil"
};

gulp.task('html:dist', function () {  // сборка HTML
    return gulp.src(path.app.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.dist.html))
        .pipe(reload({stream: true}));
});

gulp.task('js:dist', function () {   // cборка Javasxript
    return gulp.src(path.app.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./MAPS'))
        .pipe(gulp.dest(path.dist.js))
        .pipe(reload({stream: true}));
});

gulp.task('jsInst:dist', function () {   // cборка плагинов (js)
    return gulp.src(path.app.jsInst)
        .pipe(rigger())
        .pipe(uglify())
        .pipe(gulp.dest(path.dist.jsInst))
        .pipe(reload({stream: true}));
});

gulp.task('style:dist', function () {  //cборка scss
    return gulp.src(path.app.style)
        .pipe(sourcemaps.init())
        .pipe(sass().on( 'error', notify.onError({  //Скомпилируем
              message: "<%= error.message %>",
              title  : "Sass Error!"
            } ) ))                              
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write('./MAPS'))
        .pipe(gulp.dest(path.dist.css))
        .pipe(reload({stream: true}));
});

gulp.task('images:dist', function () {  //Сборка картинок
    return gulp.src(path.app.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.dist.img))
        .pipe(reload({stream: true}));
});

gulp.task('fonts:dist', function() {  //Сборка шрифтов
    return gulp.src(path.app.fonts)
        .pipe(gulp.dest(path.dist.fonts))
});

gulp.task('dist', gulp.parallel(  // ЕДИНАЯ сборка
    'html:dist',
    'js:dist',
    'jsInst:dist',
    'style:dist',
    'fonts:dist',
    'images:dist'
));

gulp.task('watch', function(){  //контроль изменений
    gulp.watch(path.watch.html, gulp.series('html:dist'));
    gulp.watch(path.watch.style, gulp.series('style:dist'));
    gulp.watch(path.watch.js, gulp.series('js:dist'));
//    gulp. watch(path.watch.img, gulp.series('images:dist'));
    gulp.watch(path.watch.fonts, gulp.series('fonts:dist'));
})

gulp.task('webserver', function () {  //веб сервер
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});
                            //полная сборка по умолчанию
gulp.task('default', gulp.series('dist', gulp.parallel('webserver', 'watch')));
