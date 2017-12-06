function variableFn(appDir,baseUrl,dir,optimize,modules,shim,path)
{
     return new variable(appDir,baseUrl,dir,optimize,modules,shim,path)
}

function variable(appDir,baseUrl,dir,optimize,modules,shim,path){
    this.appDir =appDir;
    this.baseUrl = baseUrl;
    this.dir = dir;        //生成后的路径
    this.optimize = optimize; //JS是否加密  none  uglify
    this.modules = modules;//定义要被优化的模块数组
    this.shim = shim;
    this.path = path;
   
}
exports.variableFn =variableFn;

//   appDir: parameter[item].appDir || 'www',
//     baseUrl: parameter[item].baseUrl || 'js',
//     dir: parameter[item].dir || '',
//     modules: parameter[item].modules || [],
//     shim: parameter[item].shim || {},
//     paths: parameter[item].path || {},
//     optimize:  parameter[item].optimize || "none"