/// <reference path="D:\work\GITLAB\FX110_Master\Stone.Master.Web\Scripts/1.0.0/dev/index.js" />
// Karma configuration
// Generated on Sat Mar 18 2017 11:07:49 GMT+0800 (中国标准时间)
var webpack = require('webpack');
var path = require('path');
module.exports = function(config) {
  config.set({

  　 //basePath 相对目录，这里如果填了，files和exclude里的文件路径都会相对于它
    basePath: '',
    //,'karma-coverage'
plugins : ['karma-mocha', 'karma-chai','karma-mocha-reporter','karma-requirejs','karma-sourcemap-loader','karma-chrome-launcher','karma-webpack','karma-coverage','karma-firefox-launcher','karma-ie-launcher'],

   　 //frameworks 需要用到的断言库，这里我们只用jsamine
frameworks: ['mocha','requirejs'],
      // 'chai',
　　　　 //files 测试时，浏览器需要加载的文件list
    files: [
        { pattern: './gulp/lib/**/*.js', included: false }, //所有外部库
        { pattern: './Scripts/1.0.0/dist/index.js', included: false }, //所有要测试的源代码
        { pattern: './Unittesting/**/*.text.js', included: false }, //所有的测试代码
        // './gulp/lib/**/*.js',
       'test/test-main.js'
        //'./Scripts/1.0.0/dev/index.js',
       // './Unittesting/**/*.text.js'
    ],

  //    client: {
     
  //   },
  //  mocha: {
  //       // change Karma's debug.html to the mocha web reporter 
  //      // reporter: 'html',
  //       // dir:'mocha/',
       
  //          opts: 'mocha.opts' ,
  //     // require specific files after Mocha is initialized 
  //      // require: [require.resolve('bdd-lazy-var/bdd_lazy_var_global')],
 
  //       // custom ui, defined in required file above 
  //       //ui: 'bdd-lazy-var/global',
    
  //     },
   //exclude 测试时，浏览器会忽略掉这个list里面的文件，不加载它们
  exclude: ['karma.conf.js'
        ],

//在将匹配文件提供给浏览器之前对其进行预处理
// available preprocessors：https://npmjs.org/browse/keyword/karma-preprocessors
//,'coverage' ,'sourcemap'
    preprocessors: {'test/test1.js':['webpack','sourcemap']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    //,'coverage'
    reporters: ['mocha','coverage'],
   mochaReporter:{

   },
    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


   //browsers 测试浏览器，有IE，Chrome，ChromeCanary，Firefox，Opera，Safari，PhantomJS
    // available browser launchers: npm install karma-chrome-launcher --save-dev
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    //coverage报告生成的位置
    coverageReporter:{
      type:'html',
      dir:'coverage/',


  //     instrumenters: { isparta : require('isparta') },
  // instrumenter: {
  //   '**/*.js': 'isparta'
  //},
  // instrumenterOptions: {
  //   isparta: { babel : { presets: 'es2015' } }
  // }
    },


 webpack: {
          module: {
              // preLoaders: [{
              //       test: /\.js$/,
              //       exclude: [/node_modules/],
              //       loader: 'isparta-instrumenter'
              //   }],
            //rules: [
            //  {
            //      test: /\.vue$/,
            //      loader: 'vue-loader',
            //      options:{
            //        embedSource: true,
            //        noAutoWrap: true,
                    
            //      babel: {
            //        presets: ['es2015']
            //    }
            // }
            //  },
            //]
        },
       
          //  vue: {
          //     loaders: {
          //       js: 'isparta-loader'
          //     }
          //   },

           plugins: [
             //webpack1跟webpack2更新区别
                  new webpack.LoaderOptionsPlugin({
                    // test: /\.xxx$/, // may apply this only for some modules
                    options: {
                      vue: {
                            loaders: {
                              js: 'isparta-loader'
                            }
                          },
                       babel: {
                              presets: ['es2015']
                          },
                    }
                  })
                ]

          //    isparta: {
          //       embedSource: true,
          //       noAutoWrap: true,
          //       // these babel options will be passed only to isparta and not to babel-loader
          //       // babel: {
          //       //     presets: ['es2015']
          //       // }
          //   }
            //   babel: {
            //     presets: ['es2015']
            // },
        }

    
  })
}

//默认情况下（没设置basePath），里面所有的路径，其实都是相对于 karma.config.js 的所在目录，也就是karma目录
//如果设置了 basePath，那 basePath 就是相对于 karma.config.js 的所在目录（karma目录），而 files 和 exclude 里的路径则相对于 basePath

//因为我要测试baseCls.min.js，所以我的files列表里，包含了它以及所有相关的测试脚本