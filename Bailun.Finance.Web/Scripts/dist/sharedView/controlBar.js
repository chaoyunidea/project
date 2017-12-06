define(function () {
    function controlBarFn() {
        var pagesize = 8;

        $('.change-color').on('click', function () {
            if ($(this).parents('.left').hasClass('reverse')) {
                $(this).parents('.left').removeClass('reverse');
                $(this).children('em').text('红涨绿跌');
            } else {
                $(this).parents('.left').addClass('reverse');
                $(this).children('em').text('绿涨红跌');
            }
        });

        $('.keywords').on('input propertychange', function () {
            //$.trim($(this).val()) != '' &&
            searchFn($.trim($(this).val()));
        });

        $('body').on('click', '.search-bar tr', function () {
            if ($(this).attr('data-link')) {
                window.location.href = $(this).attr('data-link');
            }
        });

        $('body').on('click', '.search-bar .more', function () {
            window.location.href = '/marketprice/search?keyword=' + encodeURIComponent($('.keywords').val());
        });

        $('body').on('click', '.search-btn', function () {
            if ($.trim($('.keywords').val()) == '') {
                layer.msg('搜索内容不能为空');
                return;
            }
            window.location.href = '/marketprice/search?keyword=' + encodeURIComponent($('.keywords').val());
        });

        function searchFn(keywords) {
            $.ajax({
                url: '/marketprice/GetQueryMarketMethod',
                data: { pagesize: pagesize, pageindex: 1, condition: encodeURIComponent(keywords) },
                type: "POST",
                success: function (data) {
                    if (data.code == 0) {
                        dataMain = eval('(' + data.bodyMessage + ')');
                        if (dataMain.length > 0) {
                            $('.search-bar tbody').html(searchListRender(dataMain));
                            $('.search-bar').addClass('active');
                        } else {
                            $('.search-bar tbody').html('');
                            $('.search-bar').removeClass('active');
                        }
                    } else {
                        $('.search-bar tbody').html('');
                        $('.search-bar').removeClass('active');
                    }
                }
            });
        }

        //搜索列表生成
        function searchListRender(data) {
            var str = '';
            for (var i = 0; i < data.length; i++) {
                str += '<tr data-link="/marketprice/' + (5 < data[i].ProductId && data[i].ProductId < 9 ? 'stockdetail' : 'detail') + '/' + data[i].MarketId + '"><td>' + data[i].Cn_Name + '</td><td>' + data[i].Code + '</td></tr>';
            }
            str += data.length >= pagesize ? '<tr><td colspan="2" class="more"><a>更多</a></td>' : '';
            return str;
        }

        //点击页面其他位置隐藏设置
        $(document).on('click', function (event) {
            var targetEl = $(event.target);
            if (!targetEl.parents().hasClass('search-bar') && $('.search-bar').hasClass('active')) {
                $('.search-bar').removeClass('active');
            }
        });

        //每分钟更新一次
        setInterval(countTimeAction, 60000);

        countTimeAction();

        //收市倒计时显示隐藏
        $('.left .time-count').on('click', function (event) {
            var targetEl = $(event.target);
            if (targetEl.parents().hasClass('set-box')) {
                return;
            }
            $(this).toggleClass('active');
            event.stopPropagation();
        });

        //点击页面其他位置隐藏设置
        $(document).on('click', function (event) {
            var targetEl = $(event.target);
            if (!targetEl.parents().hasClass('set-box') && $('.time-count').hasClass('active')) {
                $('.time-count').removeClass('active');
            }
        });

        function countTimeAction() {
            ShowCountDown($('.hkstock-status'), '9', '30', '16', '0', 8);
            ShowCountDown($('.nystock-status'), '8', '30', '14', '30', -5);
            ShowCountDown($('.ukstock-status'), '7', '30', '15', '0', 0);
            ShowCountDown($('.sgstock-status'), '9', '0', '17', '0', 8);
            ShowCountDown($('.jpstock-status'), '9', '0', '15', '0', 9);
        }

        function timeZoneDate(offset) {
            var d = new Date(); //创建一个Date对象
            var localTime = d.getTime();
            var localOffset = d.getTimezoneOffset() * 60000; //获得当地时间偏移的毫秒数
            var utc = localTime + localOffset; //utc即GMT时间            
            var currentTime = utc + 3600000 * offset;
            return currentTime;
        }

        function ShowCountDown(el, openHour, openMin, closeHour, closeMin, timeZone) {

            var now = new Date(timeZoneDate(timeZone));
            var openDate = new Date(timeZoneDate(timeZone));
            var closeDate = new Date(timeZoneDate(timeZone));

            openDate.setHours(openHour);
            openDate.setMinutes(openMin);
            openDate = openDate.getTime();
            closeDate.setHours(closeHour);
            closeDate.setMinutes(closeMin);
            closeDate = closeDate.getTime();
            var nowTime = now.getTime();

            switch (true) {//跟据当前时间判断当前状态
                case nowTime < openDate:
                    el.html(leftTimeFormat('reopen', openDate - nowTime));
                    break;
                case openDate < nowTime && nowTime < closeDate:
                    el.html(leftTimeFormat('open', nowTime - openDate));
                    break;
                case closeDate < nowTime:
                    el.html(leftTimeFormat('close', nowTime - closeDate));
                    break;
                default:
                    break;
            }
        }

        function leftTimeFormat(status, leftTime) {
            var hh = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); //计算剩余的小时数
            var mm = parseInt(leftTime / 1000 / 60 % 60, 10); //计算剩余的分钟数
            var statusObj = { 'open': '已开盘 ', 'close': '已收盘 ', 'reopen': '将开始 ' };
            hh = checkTime(hh);
            mm = checkTime(mm);
            return '<img src="/Images/marketPrice/' + status + '.png" /><em>' + statusObj[status] + hh + ' 小时 ' + mm + ' 分  </em>';
        }

        function checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }
    }

    return { controlFn: controlBarFn };
});