//获取class元素
function getElementsByClassName(element, names) {
    if (element.getElementsByClassName) {
        return element.getElementsByClassName(names);
    } else {
        var elements = element.getElementsByTagName('*');
        var result = [];
        var element,
        classNameStr,
        flag;
        names = names.split(' ');
        for (var i = 0; element = elements[i]; i++) {
            classNameStr = ' ' + element.className + ' ';
            flag = true;
            for (var j = 0, name; name = names[j]; j++) {
                if (classNameStr.indexOf(' ' + name + '') == -1) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                result.push(element);
            }
        }
        return result;
    }
}

var menuEle = getElementsByClassName(document, 'header-main');
var menuLiEle = menuEle[0].getElementsByTagName('li');
var linkMap = {
    'news\.bailun\.com|news|www\.bailun\.com$': 'news',
    'rl\.bailun\.com|calendar': 'calendar',
    'bj\.bailun\.com|marketprice': 'price',
    'shuju\.bailun\.com|indicator': 'data'
};
var localUrl = window.location.href;
var queryString = localUrl.slice(0);
var dataActive = '';
for (var i in linkMap) {
    if (new RegExp(i, 'i').test(queryString)) {
        dataActive = linkMap[i];
        break;
    }
}

for (var i = 0; i < menuLiEle.length; i++) {

    var activeAttr = menuLiEle[i].getAttribute('data-active');
    if (activeAttr == dataActive) {
        menuLiEle[i].className = 'active';
        break;
    }
}