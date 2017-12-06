
define([ 'molieInit'], function (init) {
    var btnMethod = {
        clickType: function () { //判断手机类型
            var type = init.moblieType();
            switch (type) {
                case Consts._browseType.Android:
                    btnMethod.adrState();
                    break;
                case Consts._browseType.Ios:
                    btnMethod.iosState();
                    break;
                default:
                    console.log(type);
            }
        },
        adrState: function () {//安卓执行
            btnMethod.stateFn(Consts._AppRoute.Default, function () { location.href = Consts._AppRoute.AndroidLoadLink });
        },

        iosState: function () {//ios 执行
            init.moblieTypeFn(function () {

            })
            var EditionType = init.IosEdition();
            if (EditionType[0] <= 7) {

            }
            else {

            }
            btnMethod.stateFn(Consts._AppRoute.IosDefault, function () { location.href = Consts._AppRoute.IosLoadLink });
        },
        stateFn: function (url, NotFn) {//状态判断是下载还是打开
            AppInstall(url, NotFn, function () { window.close() });
        },
        clickEv: function (url) { //点击链接
            var that = this;
            $('#download').on('tap', function () {
                window.location = url;
            })
        },
        init: function () {
            btnMethod.clickType();
        }
    }

    return {
        init: btnMethod.init
    }
})