
(function (window) {
    var timer, doc = window.document, docEl = doc.documentElement, dpr = 0, metaEl = doc.querySelector('meta[name="viewport"]');
    function refreshRem() {
        var width = docEl.getBoundingClientRect().width;
        docEl.style.fontSize = width / 10 + 'px';
    }

    if (metaEl) {
        var match = metaEl.getAttribute('content').match(/initial-scale=([\d.]+)/);
        if (match) {
            scale = parseFloat(match[1]);
            dpr = parseInt(1 / scale);
        }
    } else if (!dpr) {
        var isAndroid = window.navigator.appVersion.match(/android/gi);
        var isIPhone = window.navigator.appVersion.match(/iphone/gi);
        //devicePixelRatio这个属性是可以获取到设备的dpr的
        var devicePixelRatio = window.devicePixelRatio;
        if (isIPhone) {
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)) {
                dpr = 2;
            } else {
                dpr = 1;
            }
        } else {
            dpr = 1;
        }
        scale = 1 / dpr;
    }

    doc.documentElement.setAttribute('data-dpr', dpr);

    if (metaEl = doc.createElement("meta"),
            metaEl.setAttribute("name", "viewport"),
            metaEl.setAttribute("content", "initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no"),
            docEl.firstElementChild)
        docEl.firstElementChild.appendChild(metaEl);
    else {
        var createDiv = doc.createElement("div");
        createDiv.appendChild(metaEl),
            doc.write(createDiv.innerHTML)
    }
    refreshRem();

    window.addEventListener("resize", function () {
        clearTimeout(timer),
            timer = setTimeout(refreshRem, 300);
    })
})(window)
