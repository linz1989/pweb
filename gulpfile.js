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
    cssnano = require("gulp-minify-css");

var raw_css = 'raw/css',
    com_css = 'compressed/css',
    raw_js = 'raw/js',
    com_js = 'compressed/js',
    raw_html_public ='raw/html/public';

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

//替换html中的js、css文件名，并输出到当前根目录下面
gulp.task('rev', function() {
    return gulp.src(['manifest/*-rev-manifest.json',raw_html_public+'/*.html'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector())                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('./'))                                   //- 替换后的文件输出的目
});

//清理
gulp.task('clean', function() {
    return gulp.src(['manifest/*'], { read : false })
        .pipe(clean());
});

gulp.task('cleanHtml', function() {
    return gulp.src(['*.html'], { read : false })
        .pipe(clean());
});

gulp.task('cleanJs', function() {
    return gulp.src(['compressed/js/*'], { read : false })
        .pipe(clean());
});

gulp.task('cleanCss', function() {
    return gulp.src(['compressed/css/*'], { read : false })
        .pipe(clean());
});

//启动server
gulp.task('connect', function() {
    connect.server({
        port:8013
    });
});

var list=[
    { name : 'index' , list : [ raw_js+'/tools/idangerous.swiper.min.js' , raw_js+'/public/common.js', raw_js+'/public/index.js'] },
    { name : 'article' , list : [ raw_js+'/public/common.js', raw_js+'/public/article.js'] },
    { name : 'article.list' , list : [ raw_js+'/public/common.js', raw_js+'/public/article.list.js'] },
    { name : 'consult' , list : [ raw_js+'/public/common.js', raw_js+'/public/consult.js'] },
    { name : 'economicIndex' , list : [ raw_js+'/public/common.js', raw_js+'/public/economicIndex.js'] },
    { name : 'search' , list : [ raw_js+'/public/common.js', raw_js+'/public/search.js'] },
    { name : 'subject' , list : [ raw_js+'/public/common.js', raw_js+'/public/subject.js'] }
], currfile , fileList;

gulp.task("concat",function(){
    var count = 0;
    doCon();
    
    function doCon(){
        currfile = list[count].name;
        fileList = list[count].list;
        gulp.run("doConcate");
        count++;
        if(count<list.length){
            setTimeout(function(){
                doCon();
            },500)
        }
    }
})

//合并scanimg、iscroll、easemob.im
gulp.task('doConcate', function() {
    gulp.src(fileList)
        .pipe(concat(currfile+'.js'))
        .pipe(gulp.dest(raw_js+"/dist/"))
});

//监控改变 
gulp.task('watch', function () {
    gulp.watch(raw_css + '/**/*.scss', ['sass']);
    gulp.watch(raw_js + '/**/*.js', ['minjs']);
    gulp.watch(raw_html_public + '/*.html', ['prodHtml']);
});

//顺序执行任务
gulp.task('prod', function(cb) {
    runSequence(['sass', 'minjs'],  cb);
});

gulp.task('prodHtml', function(cb) {
    runSequence('cleanHtml','rev', cb);
});


gulp.task('default',function () {
    gulp.run('prod');
    gulp.run('connect');
    gulp.run('watch');
});

gulp.task("dist",function(){
    gulp.run("rev");
    gulp.run("toBase64");
});

//////////////////////////////////////////////////////
var fileName = "", fileList = ["article.list","article","consult","economicIndex","index","organization","search","statisticsService"];
gulp.task('toBase64', function () {
    var count = 0;
    doConvert();

    function doConvert() {
        if (count > fileList.length - 1) return;
        fileName = fileList[count];
        gulp.run('doBase64');
        setTimeout(function(){
            gulp.run('miniCss');//再次压缩css
            count++;
            setTimeout(doConvert,200);
        }, 400);
    }
});

gulp.task('miniCss', function () {
    return gulp.src(com_css + "/public/"+fileName+".css")
        .pipe(cssnano())
        .pipe(gulp.dest(com_css + '/public/'));
});

gulp.task('doBase64', function () {
    urlbase64(com_css + "/public/"+fileName+".css");
});

///////////////////////////////////////////copy file
var fs = require( 'fs' ),
    stat = fs.stat;

/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
var copy = function( src, dst ){
    // 读取目录中的所有文件/目录
    fs.readdir( src, function( err, paths ){
        if( err ){
            throw err;
        }
        paths.forEach(function( path ){
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;
            stat( _src, function( err, st ){
                if( err ){
                    throw err;
                }
                // 判断是否为文件
                if( st.isFile() ){
                    // 创建读取流
                    readable = fs.createReadStream( _src );
                    // 创建写入流
                    writable = fs.createWriteStream( _dst );
                    // 通过管道来传输流
                    readable.pipe( writable );
                }
                // 如果是目录则递归调用自身
                else if( st.isDirectory() ){
                    exists( _src, _dst, copy );
                }
            });
        });
    });
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function( src, dst, callback ){
    fs.exists( dst, function( exists ){
        // 已存在
        if( exists ){
            callback( src, dst );
        }
        // 不存在
        else{
            fs.mkdir( dst, function(){
                callback( src, dst );
            });
        }
    });
};

gulp.task('publishSrc',function(){
    exists( 'raw', '/opt/apache-tomcat-8.0.32/webapps/GztjjWeb/raw', copy );
});

gulp.task('publishCom',function(){
    exists( 'compressed', '/opt/apache-tomcat-8.0.32/webapps/GztjjWeb/compressed', copy );
});

gulp.task('publishImg',function(){
    exists( 'img', '/opt/apache-tomcat-8.0.32/webapps/GztjjWeb/img', copy );
});

gulp.task('copyFile', function (v) {
    fs.writeFileSync('D:/software/tomcat7/wtpwebapps/spa-manager-2.2.1/spa2/'+process.argv[4]+'.html', fs.readFileSync(process.argv[4]+'.html'));
});
