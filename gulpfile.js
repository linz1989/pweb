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
    runSequence = require('run-sequence'),
    revCollector = require('gulp-rev-collector'),
    base64 = require('gulp-base64'),
    replace = require('gulp-replace');

///////////语言配置
var language_zhCn = require("./json/zh_cn.json");

require('gulp-awaitable-tasks')(gulp);

//////////////////
var raw_css = 'raw/scss',
    com_css = 'compressed/css',
    raw_js = 'raw/js',
    com_js = 'compressed/js';

//处理scss
gulp.task('sass',function* () {
    yield sass(raw_css + '/**/*.scss')
        .pipe(mincss())
        .pipe(rev()) //添加md5后缀
        .pipe(gulp.dest(com_css))//输出到compressed目录
        .pipe(rev.manifest()) //- 生成一个rev-manifest.json
        .pipe(rename('css-rev-manifest.json')) //重命名
        .pipe(gulp.dest('manifest')); //- 将 rev-manifest.json 保存到 rev 目录内

    ////转换小图标成base64
    yield gulp.src(com_css+'/**/*.css')
        .pipe(base64({
            extensions: ['svg', 'png', /\.jpg#datauri$/i],
            maxImageSize: 8*1024, // 8K
            debug: false
        }))
        .pipe(gulp.dest(com_css));
});

//处理js
gulp.task('minjs', function* () {
    
    ////合并index
    yield gulp.src([raw_js+"/common/swiper-3.3.1.jquery.min.js",raw_js+"/page/public.js",raw_js+"/page/index.js"])
        .pipe(concat('index.js'))
        .pipe(gulp.dest(raw_js+"/dist/"))

    ////合并solution
    yield gulp.src([raw_js+"/page/public.js",raw_js+"/page/solution.js"])
        .pipe(concat('solution.js'))
        .pipe(gulp.dest(raw_js+"/dist/"))

    ////合并product
    yield gulp.src([raw_js+"/page/public.js",raw_js+"/page/product.js"])
        .pipe(concat('product.js'))
        .pipe(gulp.dest(raw_js+"/dist/"))

    ////合并search
    yield gulp.src([raw_js+"/page/public.js",raw_js+"/page/search.js"])
        .pipe(concat('search.js'))
        .pipe(gulp.dest(raw_js+"/dist/"))

    ////合并detail
    yield gulp.src([raw_js+"/page/public.js",raw_js+"/page/detail.js"])
        .pipe(concat('detail.js'))
        .pipe(gulp.dest(raw_js+"/dist/"))

    ////合并contact
    yield gulp.src([raw_js+"/common/SHA1.js",raw_js+"/page/public.js",raw_js+"/page/contact.js"])
        .pipe(concat('contact.js'))
        .pipe(gulp.dest(raw_js+"/dist/"))

    ////合并about
    yield gulp.src([raw_js+"/page/public.js",raw_js+"/page/about.js"])
        .pipe(concat('about.js'))
        .pipe(gulp.dest(raw_js+"/dist/"))

    yield gulp.src(raw_js + '/**/*.js')
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
gulp.task('default',function (callback) {
    runSequence(['minjs', 'sass'],'dist_cn','watch', 'connect',callback);
});

gulp.task('dist_cn', function() {
    return gulp.src(['manifest/*-rev-manifest.json', 'raw/html/*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(replace(/\{[^}]*\}/g,function(v1){
            return language_zhCn[v1] || v1;
        }))
        .pipe(gulp.dest('zh_cn'));

    /*return gulp.src('raw/html/!*.html')
        .pipe(replace(/\{[^}]*\}/g,function(v1){
            return language_zhCn[v1] || v1;
        }))
        .pipe(gulp.dest('zh_cn'));*/
});

//*********************************************************
//生成英文版html页面
/*var language_en = require("./json/en.json");
gulp.task('dist_en', function() {
    return gulp.src('raw/html/!*.html')
        .pipe(replace(/\{[^}]*\}/g,function(v1){
            return language_en[v1] || v1;
        }))
        .pipe(gulp.dest('en'));
});*/
//*********************************************************

//*********************************************************
//生成俄文版html页面
/*var language_rus = require("./json/rus.json");
gulp.task('dist_rus', function() {
    return gulp.src('raw/html/!*.html')
        .pipe(replace(/\{[^}]*\}/g,function(v1){
            return language_rus[v1] || v1;
        }))
        .pipe(gulp.dest('rus'));
});*/
//*********************************************************

