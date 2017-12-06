var maskTxt = '<div id="browser-link"><p>亲，你的浏览器版本太低咯！建议更换浏览器进行浏览</p><div id="browser-brand"><img id="three" src="../../../images/news/360.png"/><img id="chrome" src="../../../images/news/chrome.png"/></div><a id="limit" href="http://se.360.cn/" target="_blank">前往360浏览器</a><a id="guge" href="http://www.google.cn/chrome/browser/desktop/" target="_blank">前往谷歌浏览器</a></div>';

var mask = document.createElement("div");
mask.id = "browser-box";
mask.innerHTML = maskTxt;
document.body.appendChild(mask);
browser();

//浏览器版本
function browser() {

    //设置判断浏览器数字变量

    var DEFAULT_VERSION = 8;

    var ua = navigator.userAgent.toLowerCase();

    var isIE = ua.indexOf("msie") > -1;

    var safariVersion;
    var box = document.getElementById("browser-box");

    if (isIE) {

        safariVersion = parseInt(ua.match(/msie ([\d.]+)/)[1]);

        if (safariVersion <= DEFAULT_VERSION) {

            //此时是ie8及ie8一下的浏览器

            box.style.display = "block";
            document.body.style.overflow = 'hidden';
            //createHtml();
        } else {

                //此时是大于ie8以上的浏览器
                //createHtml();
            }
    } else {}

        //不是ie浏览器
        //createHtml();

        //document.getElementById("continue").onclick = function () {
        //    document.body.style.overflow = 'auto';
        //    box.parentNode.removeChild(box);

        //}
};