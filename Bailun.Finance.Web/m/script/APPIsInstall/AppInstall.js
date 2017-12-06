function AppInstall(url, NotFn, toFn) {
    window.location.href = url;
    window.setTimeout(function () {
        NotFn();
    },2000 )



    //var timeout, t = 1000, hasApp = true;
    //setTimeout(function () {
    //    if (hasApp) {
    //        toFn();
    //        // alert('安装了app');
        
    //    } else {
    //      NotFn();
    //        //  alert('未安装app');
    //    }
    //    document.body.removeChild(ifr);
    //}, 2000)

    //var t1 = Date.now();
    //var ifr = document.createElement("iframe");
    //ifr.setAttribute('src', url);
    //ifr.setAttribute('style', 'display:none');
    //document.body.appendChild(ifr);
       
    //timeout = setTimeout(function () {
    //    //   alert(5);
    //    var t2 = Date.now();
    //    if (!t1 || t2 - t1 < t + 100) {
    //        hasApp = false;
    //    }
    //}, t);
}