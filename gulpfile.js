const browserSync = require('browser-sync').create(),    
    beautify = require('gulp-html-beautify'),    
    sequence = require('run-sequence'),
    plumber = require('gulp-plumber'),    
    extname = require("gulp-extname"),
    assemble = require('assemble')(),    
    concat = require('gulp-concat'),
    inject = require('gulp-inject'),    
    watch = require('gulp-watch');
    sass = require('gulp-sass'),
    gulp = require('gulp');

gulp.task('default', function() {
   sequence('sass', 'js', 'bootstrap', 'html', 'html:inject', 'browserSync:watch', 'browserSync:serve');
})

gulp.task('browserSync:serve', function () {
    browserSync.init({
        server: {
            baseDir: "./prod"
        }
    });
});

gulp.task('browserSync:reload', function() {
    browserSync.reload();
})

gulp.task('browserSync:watch', function() {
    watch(['dev/templates/**/*.{hbs,json}','dev/pages/**/*.hbs'], function() { sequence('html', 'html:inject', 'browserSync:reload') });
    watch('dev/assets/sass/**/*.scss', function() { sequence('sass', 'browserSync:reload') });
    watch('dev/assets/js/**/*.js', function() { sequence('js', 'browserSync:reload') });
});

gulp.task('bootstrap', function() {
    gulp.src('./dev/assets/bootstrap/**/*.*', {base: './dev/bootstrap'})
    .pipe(gulp.dest('./prod/bootstrap'))
})

gulp.task('sass', function() {
    return gulp.src('./dev/assets/sass/stylesheet.scss')
    .pipe(sass().on('error', sass.logError))    
    .pipe(gulp.dest('./prod/assets/css'))
})

gulp.task('js', function() {
    return gulp.src('./dev/assets/js/**/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./prod/assets/js'))
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
    .pipe(inject(gulp.src(["./prod/assets/**/*.{css,js}", "./prod/assets/bootstrap/**/*.{css,js}"], {read: false}), {relative: true, removeTags: true}))
    .pipe(gulp.dest('./prod'))
})