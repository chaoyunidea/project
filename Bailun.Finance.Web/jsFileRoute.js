/// <reference path="D:\work\GITLAB\FX110_Master\Stone.Master.Web\Scripts/1.0.0/glup/avalon_two/avalon.js" />
var isPaths = true;
try { var paths = require('path'); } catch (e) {isPaths = false }
var dev = "Scripts/dev/",
    dist = "Scripts/dist/",
    gulp = "./../../../Scripts/glup/",
    devjs = "./../../../Scripts/dev/",
    jsApiVal = "//gajsapi.fx110.com/script/public/"
    
function pathsUrl(url1,url2) {
    try {
        return paths.normalize(__dirname + url1)
    }
    catch (e){
        return url2
    }
}

var  js = {
    dev: dev,
    dist: dist,
    gulp: gulp,
    jsApiVal:jsApiVal,
    //avalon: path.normalize(__dirname + gulpSrc + '/avalon_two/avalon'),
    //ind: path.normalize(__dirname + devSrc + 'index'),
    newss: pathsUrl(dist + 'sharedView/news', "/Scripts/dist/sharedView/news.js?v=87114e95f0"),
    controlBar: pathsUrl(dist + 'sharedView/controlBar', "/Scripts/dist/sharedView/controlBar.js?v=551229a15d"),
    calculatePrice: pathsUrl(dist + 'sharedView/calculatePrice', "/Scripts/dist/sharedView/calculatePrice.js?v=d149e6c2e7"),
    price: pathsUrl(dist + 'sharedView/price', "/Scripts/dist/sharedView/price.js?v=9e9e46db96"),
    newsHead: pathsUrl(dist + 'news/newsImportant', "/Scripts/dist/news/newsImportant.js?v=5f32f2e34f"),
    jsScroll: jsApiVal + 'jsScroll/jsScroll.js',
    Compatible: jsApiVal + '/Compatible/Compatible.min.js',
    avalon: pathsUrl(gulp + '/avalon_two/avalon', "/Scripts/glup/avalon_two/avalon.js")    
}

try { module.exports = js; }
catch (e) { }
