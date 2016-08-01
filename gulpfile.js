var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    mincss = require('gulp-mini-css'),
    changed = require('gulp-changed'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    connect=require('gulp-connect'),
    rev = require('gulp-rev'),//对文件名加MD5后缀
    notify = require('gulp-notify'),//控制台输出信息
    runSequence = require('gulp-sequence'),//顺序执行task
    revCollector = require('gulp-rev-collector'),//路径替换
    urlbase64 = require("css-urlbase64"),
    cssnano = require("gulp-minify-css"),
    replace = require('gulp-replace');

///////////语言配置
var language_zhCn = require("./json/zh_cn.json");

//////////////////
var raw_css = 'raw/scss',
    com_css = 'css',
    raw_js = 'raw/js',
    com_js = 'js';

//处理scss
gulp.task('sass',function () {
    return sass(raw_css + '/**/*.scss')
        .pipe(mincss())
        .pipe(rev()) //添加md5后缀
        .pipe(gulp.dest(com_css))//输出到compressed目录
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(rename('css-rev-manifest.json')) //重命名
        .pipe(gulp.dest('manifest')); //- 将 rev-manifest.json 保存到 rev 目录内
});

//处理js
gulp.task('minjs', function () {
    return gulp.src(raw_js + '/**/*.js')
        .pipe(uglify())
        .pipe(rev()) //添加md5后缀
        .pipe(gulp.dest(com_js))
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(rename('js-rev-manifest.json')) //重命名
        .pipe(gulp.dest('manifest')); //- 将 rev-manifest.json 保存到 rev 目录内
});

//启动server
gulp.task('connect', function() {
    connect.server({
        port : 8018
    });
});

//监控改变 
gulp.task('watch', function () {
    gulp.watch(raw_css + '/**/*.scss', ['sass']);
    gulp.watch(raw_js + '/**/*.js', ['minjs']);
    gulp.watch('raw/html/*.html', ['dist_cn']);
});

//默认执行
gulp.task('default',function () {
    gulp.run('sass');
    gulp.run('minjs');
    gulp.run('dist_cn');
    gulp.run('connect');
    gulp.run('watch');
});

gulp.task('dist_cn', function() {
    return gulp.src('raw/html/*.html')
        .pipe(replace(/\{[^}]*\}/g,function(v1){
            return language_zhCn[v1] || v1;
        }))
        .pipe(gulp.dest('zh_cn'));
});
