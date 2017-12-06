
var gulp = require('gulp'), //引入gulp核心文件包 
    plumber = require("gulp-plumber"),//如果通知器返回一个错误，运行不会中断    
	handleErrors = require('./gulp/gulp/util/handleError'),
    concat = require('gulp-concat'),   // 合并文件 
    less = require("gulp-less"),// less 编译
    rename = require("gulp-rename"),//  重命名
    uglify = require('gulp-uglify'),//压缩JS
    jshint = require("gulp-jshint"), //js错误提示  需要装jshint
    cleanCss = require("gulp-clean-css"), //压缩css
    del = require('del'), //删除文件1
    cleans = require("gulp-clean"), //删除文件2
    config = require("./gulp/gulp/Config"),  //配置文件
    optimize = require('requirejs').optimize,  //requirejs
     filter = require('gulp-filter'), //排除某些文件
     builder = require('./gulp/gulp/requireBuilder/builder'),
	 livereload = require('gulp-livereload'),
     babel = require('gulp-babel'),
	 browserSync = require('browser-sync').create(),
     karmaServer = require('karma').Server,
     rev = require('gulp-rev'),
     revCollector = require('gulp-rev-collector'),
      runSequence = require('run-sequence'), //执行顺序，避免
bom = require('gulp-bom'),
parameter = builder.parameter,
item = builder.item,
SrcAll = "**/*",
appDirSrc = [];

// requirejs 的合并
gulp.task('rjsMin', function () {
    var optimizes;
    for (var i = 0; i < item.length; i++) {
        optimizes += requireJs_optimize(item[i])
    }
    optimizes
});

function requireJs_optimize(item) {
    if (parameter[item].appDir && parameter[item].appDir != undefined) {
        appDirSrc.push(parameter[item].appDir + SrcAll);
    }

    return optimize({
        appDir: parameter[item].appDir || 'Scripts/dev',
        baseUrl: parameter[item].baseUrl || './',
        dir: parameter[item].dir || '',
        modules: parameter[item].modules || [],
        shim: parameter[item].shim || {},
        paths: parameter[item].path || {},
        optimize: parameter[item].optimize || "none"
    });
}

gulp.task("less", function () {
    return gulp.src(config.less.dev)
			.pipe(less())
		 	.on('error', handleErrors)
            .pipe(rename({ suffix: '' }))
            .pipe(cleanCss({ compatibility: 'ie7' }))
            .pipe(rev())
            .pipe(gulp.dest(config.less.dist))
            .pipe(rev.manifest())
            .pipe(gulp.dest("./rev_manifest/less/"))
	 .pipe(browserSync.stream());
})

//gulp.task("css",function(){
//	return gulp.src(config.css.dev)
//			.on('error', handleErrors)
//           .pipe(rename({suffix:".min"}))
//           .pipe(cleanCss({ compatibility: "ie7" }))
//            .pipe(rev()) 
//           .pipe(gulp.dest(config.css.dist))
//             .pipe(rev.manifest())
//            .pipe(gulp.dest("./rev_manifest/css/"))
//     .pipe(browserSync.stream());
//})

gulp.task("HreadFooter", function () {
    return gulp.src([config.gulp.HreadFooter.dev])
            .pipe(less())
			.on('error', handleErrors)
            .pipe(rename({ suffix: '' }))
            .pipe(cleanCss({ compatibility: 'ie7' }))
            .pipe(rev())
            .pipe(gulp.dest(config.gulp.HreadFooter.dist))
            .pipe(rev.manifest())
            .pipe(gulp.dest("./rev_manifest/HreadFooter/"))
     .pipe(browserSync.stream());

})

gulp.task("Public", function () {
    return gulp.src([config.gulp.Public.dev])
            .pipe(less())
			.on('error', handleErrors)
            .pipe(rename({ suffix: '' }))
            .pipe(cleanCss({ compatibility: 'ie7' }))
            .pipe(rev())
            .pipe(gulp.dest(config.gulp.Public.dist))
             .pipe(rev.manifest())
            .pipe(gulp.dest("./rev_manifest/Public/"))
     .pipe(browserSync.stream());
})

//压缩js
gulp.task("js", function () {
    return gulp.src("./Scripts/rjs/**/*.js")
            .pipe(babel())
            //.pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest("Scripts/dist"))
            .pipe(rev.manifest())
            .pipe(gulp.dest("./rev_manifest/js/"))
})


//压缩js
gulp.task("jsmin", function () {
    return gulp.src("./Scripts/rjs/**/*.js")
            .pipe(babel())
            .pipe(uglify())
            .pipe(rev())
            .pipe(gulp.dest("Scripts/dist"))
            .pipe(rev.manifest())
            .pipe(gulp.dest("./rev_manifest/js/"))
})

gulp.task("gulpjs", function () {
    return gulp.src(["./Scripts/glup/**/*.js", "./Scripts/glup/**/*.css"])
            .pipe(rev())
            .pipe(rev.manifest())
            .pipe(gulp.dest("./rev_manifest/glup/"))
})


gulp.task("gulpjsmin", function () {
    return gulp.src(["./Scripts/glup/**/*.js"])
            .pipe(rev())
            .pipe(uglify())
            .pipe(gulp.dest("Scripts/gulpmin"))
            .pipe(rev.manifest())
            .pipe(gulp.dest("./rev_manifest/glup/js/"))
})

gulp.task("requireBuilderjsmin", function () {
    return gulp.src(["./gulp/gulp/requireBuilder/jsFileRoute.js"])
            .pipe(rev())
            .pipe(uglify())
            .pipe(gulp.dest("gulp/gulp/requireBuildemin"))
            .pipe(rev.manifest())
            .pipe(gulp.dest("./rev_manifest/requireBuilder/"))
})

gulp.task("gulpcssmin", function () {
    return gulp.src(["./Scripts/glup/**/*.css"])
            .on('error', handleErrors)
            .pipe(rename({ suffix: '' }))
            .pipe(cleanCss({ compatibility: 'ie7' }))
            .pipe(rev())
            .pipe(gulp.dest("Scripts/gulpmin"))
            .pipe(rev.manifest())
            .pipe(gulp.dest("./rev_manifest/glup/css/"))
})

//压缩gulp
gulp.task("gulpmin", function () {
    const jsfilter = filter(['**', '!Scripts/glup/**/*.min.js'], { restore: true });
    return gulp.src("Scripts/glup/**/*.js")
            .pipe(jsfilter)
            .pipe(babel())
            .pipe(uglify())
            .pipe(rename({ suffix: ".min" }))
            .pipe(gulp.dest("Scripts/glup"));
})


gulp.task('clean', function (cb) {
    return del([
          config.clean.csssrc,
          config.clean.jssrc,

    ], cb);

})


// gajsapi.fx110.com/script


gulp.task('devrev', function () {
    return gulp.src(["rev_manifest/**/*.json", "**/*.cshtml", "**/*.html"])
       .pipe(revCollector({
           replaceReved: true,
           dirReplacements: {
               "Scripts/gulpmin": "Scripts/glup",
               "Scripts/dist": "Scripts/dist",  //不加的话，版本号添加不了
               "Styles/dist": "Styles/dist",
               "gulp/gulp/requireBuildemin": "gulp/gulp/requireBuilder"

           }
       }))
         .pipe(bom()) //一定要在输出前引入该包
        //.pipe(minifyHTML({
        //    empty: true,
        //    spare: true
        //}))
       .pipe(gulp.dest("./"))
})

gulp.task('garev', function () {
    return gulp.src(["rev_manifest/**/*.json", "**/*.cshtml", "**/*.html"])
       .pipe(revCollector({
           replaceReved: true,
           dirReplacements: {
               "Scripts/glup": "Scripts/gulpmin",
               "Scripts/dist": "Scripts/dist", //不加的话，版本号添加不了
               "Styles/dist": "Styles/dist",
               "gulp/gulp/requireBuilder": "gulp/gulp/requireBuildemin"
           }
       }))
         .pipe(bom()) //一定要在输出前引入该包
        //.pipe(minifyHTML({
        //    empty: true,
        //    spare: true
        //}))
       .pipe(gulp.dest("./"))
})


gulp.task("gaStart", function (cb) {
    runSequence(
        'clean',
        'buildmin',
        'HreadFooter', 'gulpjsmin', 'gulpcssmin', 'Public', 'less', 'requireBuilderjsmin',
        'garev',
        cb)

})

gulp.task("devStart", function (cb) {
    runSequence(
        'clean',
        'build',
        'HreadFooter', 'gulpjs', 'Public', 'less', 'requireBuilderjsmin',
        'devrev',
        cb)

})


gulp.task('build', ['rjsMin'], function () {
    runSequence('js')
})

gulp.task('buildmin', ['rjsMin'], function () {
    runSequence('jsmin')
})




//   自动化测试

//gulp.task('karma', function (done) {
//    new karmaServer({
//        configFile: __dirname + '/karma.conf.js'
//    }, done).start();
//})


//gulp.task('browser-sync', function () {

//});

//定义监控任务
gulp.task('watch', function () {
    browserSync.init({
        proxy: "http://bailun.fx001.com/"
    });
    //livereload.listen();
    //var watcher =  gulp.watch(config.js.dev, ['js']);
    gulp.watch(config.css.dev, ['css'], browserSync.reload());
    gulp.watch(config.less.dev, ['less'], browserSync.reload()); //当所有less文件发生改变时，调用testLess任务
    // gulp.watch(config.gulp.Public.dev, ['less']);
    // gulp.watch(config.gulp.PublicDefind.dev, ['less']);
    gulp.watch([config.gulp.HreadFooter.dev], ['HreadFooter'], browserSync.reload());
    gulp.watch([config.gulp.Public.dev], ['Public'], browserSync.reload());
    if (appDirSrc.length > 0) {
        gulp.watch(appDirSrc, ['build'], browserSync.reload());
    }

    //    gulp.watch('Styles/1.0.0/dist/**/*.*', function (file) {
    //    	setTimeout(function () {
    //    		livereload.changed(file.path);
    //    	},100)

    //});

});

//定义默认任务
gulp.task('default', ["clean"], function () {
    gulp.start("build", "less", "HreadFooter", "Public", "watch");

});
