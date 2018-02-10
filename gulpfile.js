const browserSync = require('browser-sync').create(),    
    imageResize = require('gulp-image-resize'),
    beautify = require('gulp-html-beautify'),
    sassLint = require('gulp-sass-lint'),
    imagemin = require('gulp-imagemin'),
    sequence = require('run-sequence'),
    plumber = require('gulp-plumber'),
    extname = require('gulp-extname'),
    assemble = require('assemble')(),    
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),    
    watch = require('gulp-watch'),
    sass = require('gulp-sass'),
    gulp = require('gulp');

gulp.task('default', function() {
   sequence('dependencies', 'js', 'images', 'images:thumbs', 'sass', 'html', 'html:inject', 'browserSync:watch', 'browserSync:serve');
})

gulp.task('browserSync:serve', function () {
    browserSync.init({
        server: {
            baseDir: './prod'
        }
    });
});

gulp.task('browserSync:reload', function() {
    browserSync.reload();
})

gulp.task('browserSync:watch', function() {
    watch(['dev/templates/**/*.{hbs,json}','dev/pages/**/*.hbs'], function() { sequence('html', 'html:inject', 'browserSync:reload') });
    watch('dev/assets/sass/**/*.scss', function() { sequence('sass', 'browserSync:reload') });
    watch('dev/assets/images/**/*.*', function() { sequence('images', 'browserSync:reload') });
    watch('dev/assets/js/**/*.js', function() { sequence('js', 'browserSync:reload') });
});

gulp.task('dependencies', function() {
    gulp.src(['./dev/assets/bootstrap/**/*.*','./dev/assets/jquery/**/*.*'], {base: './dev'})
    .pipe(gulp.dest('./prod'))
})

gulp.task('sass', function() {
    return gulp.src('./dev/assets/sass/stylesheet.scss')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./prod/assets/css'))
})

gulp.task('js', function() {
    return gulp.src('./dev/assets/js/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./prod/assets/js'))
})

gulp.task('images', function(){
    return gulp.src('./dev/assets/images/**/*.*')
    .pipe(imagemin())
    .pipe(gulp.dest('./prod/assets/images'))
})

gulp.task('images:thumbs', function(){
    return gulp.src('.dev/assets/images/**/*.*')
    .pipe(imageResize({
        upscale: false,
        height: 300,
        width: 300,
        crop: true    
    }))
    .pipe(gulp.dest('./prod/assets/images/thumbs'))
})

gulp.task('html', function() {
    assemble.partials('./dev/templates/partials/**/*.hbs');
    assemble.data('./dev/templates/data/**/*.{json,yml}');
    assemble.layouts('./dev/templates/layouts/**/*.hbs');
    assemble.pages('./dev/pages/**/*.hbs');
    assemble.option('layout', 'default');
    
    return assemble.toStream('pages')
        .pipe(assemble.renderFile())
        .pipe(extname())
        .pipe(beautify())
        .pipe(assemble.dest('./prod'));
});

gulp.task('html:inject', function() {
    return gulp.src('./prod/**/*.html')
    .pipe(inject(gulp.src('./prod/assets/**/*.*{js,css}', {read: false}), {relative: true, removeTags: true}))
    .pipe(gulp.dest('./prod'))
})