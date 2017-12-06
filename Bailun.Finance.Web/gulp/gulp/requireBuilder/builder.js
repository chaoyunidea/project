var variableFn = require('./requireConfig').variableFn,
    jsFileRoute = require('./jsFileRoute'),
     path = jsFileRoute,
	dev = path.dev,
	dist = 'Scripts/rjs/',
    gulpSrc = path.gulp,
    devSrc = path.devjs,
    jsApiSrc = path.jsApiVal;
    

//所有的路径
//Scriptsdev/**  默认的位置是在dev下面层
  
 optimize = 'none',
 //删除的顺序
    // this.appDir =appDir;
    // this.baseUrl = baseUrl;
    // this.dir = dir;        //生成后的路径
    // this.optimize = optimize; //JS是否加密  none  uglify
    // this.modules = modules;//定义要被优化的模块数组
    // this.shim = shim;
    // this.path = path;
    parameter = {
        Index: variableFn(dev, '', dist, optimize, [{ name: 'ind', include: [], exclude: [] }], { 'ind': ['avalon'] }, path),
        //lib: variableFn('', '', 'wwwbuilt', dist, optimize, [{ name: 'page', include: ['app/main1'], exclude: ['common'] }], '', path)
        News: variableFn(dev + 'news', '', dist + 'news', optimize, [], {}, path),
        MarketPrice: variableFn(dev + 'marketPrice', '', dist + 'marketPrice', optimize, [], {}, path),
        Calendar: variableFn(dev + 'financialCalendar', '', dist + 'financialCalendar', optimize, [], {}, path),
        SharedView: variableFn(dev + 'sharedView', '', dist + 'sharedView', optimize, [], {
            "news": [path.Compatible]
        }, path),
        Indicator: variableFn(dev + 'indicator', '', dist + 'indicator', optimize, [], {}, path),
},

     item = ["Calendar","News","MarketPrice","SharedView","Indicator"];

exports.parameter = parameter;
exports.item = item;


