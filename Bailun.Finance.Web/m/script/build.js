////CMD 命令   node r.js -o ./build.js
({

    //应用程序的最顶层目录。可选的，如果设置了的话，r.js会认为脚本在这个路径的子目录中，应用程序的文件都会被拷贝到输出目录（dir 定义的路径）。如果不设置，则使用下面的 baseUrl 路径。
    appDir: './', //需要优化的路径  只能用相对路径

    //默认情况下，所有的模块都是相对于这个路径的。如果没有设置，则模块的加载是相对于 build 文件所在的目录。另外，如果设置了appDir，那么 baseUrl 应该定义为相对于 appDir 的路径。
    baseUrl: './',

    //压缩 合并后 文件放的文职  输出目录的路径
    dir: './dist/books',

    //定义要被优化的模块数组
    modules: [{
        name: 'share', //模块 
        include: [], //将 Basic_Information和 App 的模块打包成一个文件   （文件不依赖App但是还是把App打包进去）
        exclude: [] //  // 将 Basic_Information 及其依赖项一并打包，但不包括 []里面的
        // 排除指定模块，但若该模块对所打包文件有级联依赖关系，则仍会被打包进去
        // excludeShallow: ["App"]
    }

    ],
    // JS 文件优化方式，目前支持以下几种：
    //   uglify: （默认） 使用 UglifyJS 来压缩代码
    //   closure: 使用 Google‘s Closure Compiler 的简单优化模式
    //   closure.keepLines: 使用 closure，但保持换行
    //   none: 不压缩代码
    //optimize: "uglify",
    optimize: "uglify",

    removeCombined: false, //删除之前压缩合并的文件，默认值 false。

    fileExclusionRegExp: /^(r|build)\.js$/, //要排除的文件的正则匹配的表达式。

    // CSS 优化方式，目前支持以下几种：
    // none: 不压缩，仅合并
    // standard: 标准压缩，移除注释、换行，以及可能导致 IE 解析出错的代码
    // standard.keepLines: 除标准压缩外，保留换行
    // standard.keepComments: 除标准压缩外，保留注释 (r.js 1.0.8+)
    // standard.keepComments.keepLines: 除标准压缩外，保留注释和换行 (r.js 1.0.8+)
    optimizeCss: 'none',
    //removeCombined: true,   //如果为true，优化器（optimizer）将从输出目录中删除已合并的文件。
    paths: {
        //页面js
        share: "./share",

        //插件
        //mui: "../../gulp/mui/mui",
        //zoom: "../../gulp/mui/mui.zoom", //图片放大
        //previewimage: "../../gulp/mui/mui.previewimage",//图片放大
        //vue: "../../gulp/vue/vue.min",//数据绑定
        //getQueryString: "../../gulp/getQueryString/GetQueryString",//获取参数
        //consts: "../../gulp/consts/const",//api请求地址
        //ImageMethod: "../../Gulp/moblie/ImageMethod",// 图片放大原生
        zepto: "./zepto/zepto",
        onLine: "./onLine/onLine",
        IsLoadMethod: "./moblie/IsLoadMethod", //是下载还是打开
        molieInit: "./moblie/molieInit",
        Ios: "./moblie/Ios",
        Android: "./moblie/Android",
        APPIsInstall: "./APPIsInstall/AppInstall",
        mui: "./mui/mui.min",
        zoom: "./mui/mui.zoom",
        previewimage: "./mui/mui.previewimage"
    },
    shim: {
        "share": ['mui', 'zepto', 'APPIsInstall','zoom', 'previewimage']
    }

})