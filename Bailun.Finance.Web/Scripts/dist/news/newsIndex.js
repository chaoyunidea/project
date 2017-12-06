
require([js.price, js.newsHead, js.calendar], function (priceBox, newsHead, calendar) {
    //新闻栏目

    //存cookie内容的值 已标题的data-index值为准  1_2_3_4_5

    var cookie = "USERFXMASTER",
        MaxNumber = 6,
        $title = $('.news').find('.l'),
        $content = $('.news').find('.news-content'),
        selectIndex = 0,
        title = { 1: "金十", 2: "华尔街", 4: "fx678", 3: "fx168", 5: "DailyFx" };
    var socketNewsArr = [];
    var tipsOnOff = {
        noticeSelected: [],
        soundSelected: []
    };
    var isSub = true;
    var tabInitTop = $('.news .tab-bar').offset().top;
    //（1：金十；2：华尔街；3：fx168；4：fx678；5：DailyFx;）
    getQueryString();
    noticeOnOffInit();
    //share();

    //钟表转动
    !function (win, doc) {
        win.requestAnimationFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame || win.mozRequestAnimationFrame || window.msRequestAnimationFrame;
        var start = function () {
            // 当前时间
            var now = new Date(),

            // 午夜12点整
            midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0),

            // 当前时间与午夜12的之间的毫秒差
            ms = now.getTime() - midnight.getTime(),

            // 计算时、分、秒
            hh = ms / (1000 * 60 * 60),
                mm = hh * 60,
                ss = mm * 60;
            // 实现时钟旋转
            $(".div-hour").css('transform', "rotate(" + (hh * 30 + hh / 2 + 90) + "deg)");
            $(".div-minute").css('transform', "rotate(" + mm * 6 % 360 + "deg)");
            $(".div-second").css('transform', "rotate(" + ss * 6 % 360 + "deg)");
            //win.requestAnimationFrame(start);
        };
        start();
        setInterval(start, 1000);
    }(window, document);

    var Dom = {
        //标题
        titlelist: function () {
            return $title.find('div');
        },

        ListT: function (i) {
            return $content.children('[data-index="' + i + '"]');
        }
    };

    var Fn = {
        Init: function () {
            if (this.getCookie()) {
                this.exhibition(1);
            } else {
                this.exhibition(0);
            }
        },
        setCookie: function (value) {
            var cok = this.getCookie();
            if (cok) {
                cok = JSON.parse(cok);
                cok.Ca = value;
                setCookie(cookie, JSON.stringify(cok), 'h999');
            }
        },
        getCookie: function () {

            if (getCookie(cookie)) {
                var ck = JSON.parse(getCookie(cookie)).Ca;
                if (ck.length > 0) {
                    return getCookie(cookie);
                }
                return false;
            }
            return false;
        },

        //获取cookie里面新闻的排序
        getTitleSort: function () {
            return cok = JSON.parse(this.getCookie()).Ca.join(',');
        },

        //  赋值
        exhibition: function (type) {
            switch (parseInt(type)) {
                case 0:
                    //没有cookie
                    Dom.titlelist().eq(0).addClass('ct_selected');
                    _HTML.Ajax(3);
                    break;
                case 1:
                    //有cookie
                    _HTML.Ajax(1);
                    Dom.titlelist().eq(0).addClass('ct_selected');
                    break;
                default:
                    break;
            }
        },
        //
        //标题排列上传
        //顺序的值 1_2_3_4_5
        exhibitionAjax: function (data) {
            if (this.getCookie()) {
                $.ajax({
                    url: "/Pages/Ashx/agentApplyForAdd.ashx",
                    data: { data: data },
                    type: "POST",
                    dataType: "json",
                    success: function (data) {}
                });
            }
        }
    };

    var _HTML = {
        _Title: function () {
            var cok = Fn.getTitleSort();
            var html = "";
            if (data.length > 0) {
                for (var i = 0; i < cok.length; i++) {
                    html += '<div data-index="' + cok[i] + '" class="ct" style="cursor: pointer;">' + title[cok[i]] + ' </div>';
                }
            }
            $title.html(html);
            return html;
        },
        // type  1为初次加载
        //（1：金十；2：华尔街；3：fx168；4：fx678；5：DailyFx;）
        _Content: function (data, type) {
            for (var i = 0; i < data.JSNews.length; i++) {
                var dataMain = eval('(' + JSON.stringify(data.JSNews[i]) + ')');
                //侧栏日历更新
                refreshCalendar(dataMain);

                //渲染
                _HTML.updateNews(dataMain, 10000);
            }

            this.setData(2, data.WallStreetcnNews);
            this.setData(3, data.Fx168News);
            this.setData(4, data.Fx678News);
            this.setData(5, data.DailyFxnEews);
            imgViewer();
        },
        updateNews: function (data, type) {
            //即时数据生成
            var $SourceDom = $('.news-list li[data-id="' + data.SourceId + '"]');
            var isFast = type != 10000 ? true : false;

            if (data.Status == 3) {
                //删除
                $SourceDom.remove();
                return;
            }

            if ($SourceDom.length > 0) {
                // 修改 去重
                $SourceDom.replaceWith(this.listItemRender(data, isFast));
                this.removeFreshMark(data);
                imgViewer();
                return;
            }

            //是否是重复推送
            //if (socketNewsArr.indexOf(data.SourceId) == -1 && $SourceDom.length == 0) {
            //    socketNewsArr.push(data.SourceId);
            //} else {
            //    return;
            //}

            //修改 新增  去重 已id为基准 新的替换旧的
            var instantDate = new Date(data.ReleasedDate);
            var instantStr = '';
            var currentItem = Dom.ListT(parseInt(data.Website)).find('.news-data');
            var that = this;

            if (!this.contentRegular(data)) {
                return; //内容有重复
            }

            //新增
            if (instantDate.getDate() != new Date(parseInt(currentItem.find('.news-list li').first().attr('data-date'))).getDate()) {
                //判断是否是当天数据
                if (data.ReleasedDate > parseInt(currentItem.find('.news-list li').first().attr('data-date'))) {
                    instantStr += '<div class="time"><p>' + (instantDate.getMonth() + 1) + '月' + instantDate.getDate() + '日' + '</p></div>';
                    instantStr += this.listItemRender(data, isFast);
                    //钟表移位
                    var clockEle = currentItem.find('.time .clock-border').clone();
                    currentItem.find('.time .clock-border').remove();
                    currentItem.children().first().find('.news-list').prepend(instantStr).find('.time:first').prepend(clockEle);
                }
            } else {
                instantStr = this.listItemRender(data, isFast);
                if (data.ReleasedDate < parseInt(currentItem.find('.news-list li').first().attr('data-date'))) {
                    //推送新闻时间比第一条还早
                    currentItem.find('.news-list li').each(function () {
                        if (data.ReleasedDate >= $(this).attr('data-date')) {
                            $(this).before(instantStr);
                            that.newPushAction(data);
                            return false;
                        }
                    });
                    return;
                } else {
                    currentItem.children().first().find('.news-list').children().first().after(instantStr);
                }
            }

            //新推送消息提醒
            // 10000代表的第一次执行
            if (isFast) {
                this.newPushAction(data);
            }
        },
        contentRegular: function (data) {
            //对比前几条根据内容判断是否重复
            var result = true;
            var currentItem = Dom.ListT(parseInt(data.Website)).find('.news-data');
            currentItem.find('.news-list li:lt(3)').each(function () {
                if ($(this).find('.name,.info').html() == data.Content.replace(/\r\n/g, '<br>')) {
                    result = false;
                    return false;
                }
            });
            return result;
        },
        newPushAction: function (data) {
            this.newPushMark(data);
            //推送消息
            showNotice(data);
            //响铃
            msgRing(data);
            //定时取消新消息背景色
            this.removeFreshMark(data);
            //图片放大
            imgViewer();
        },
        newPushMark: function (data) {
            var targetTab = $('.l [data-index="' + data.Website + '"]');
            if (!targetTab.hasClass('active') && !targetTab.hasClass('new-push')) {
                targetTab.addClass('new-push');
            }
        },
        removeFreshMark: function (data) {
            //定时取消新消息背景色
            setTimeout(function () {
                $('[data-id="' + data.SourceId + '"]').removeClass('fresh');
            }, 30000);
        },
        setData: function (index, data, initDate) {
            var newsAreaStr = '';
            var currentDate = initDate ? new Date(initDate) : new Date(data[0].ReleasedDate);

            for (var i = 0; i < data.length; i++) {
                if (new Date(data[i].ReleasedDate).getDate() != currentDate.getDate()) {
                    currentDate = new Date(data[i].ReleasedDate);
                    newsAreaStr += '<div class="time"><p>' + (currentDate.getMonth() + 1) + '月' + currentDate.getDate() + '日' + '</p></div>';
                }
                newsAreaStr += this.listItemRender(data[i]);
            }

            Dom.ListT(parseInt(index)).find('.news-data .news-list').append(newsAreaStr);

            imgViewer();
        },
        listItemRender: function (obj, isFresh) {
            //渲染li元素
            //var stateArr = ['', '', 'important', 'focus', 'important-plus'];
            var impactArr = ['未公布', '无影响', '影响较小', '利空 美元', '利多 美元'];
            //var colorArr = ['blue', 'blue', 'blue', 'red', 'green'];

            var newsListStr = '';
            switch (obj.Type) {
                case 0:
                    //新闻
                    newsListStr += '<li class="level' + obj.Level + (isFresh ? ' fresh' : '') + '" data-date="' + obj.ReleasedDate + '" data-id="' + obj.SourceId + '"><div class="post-time"><i></i><em>' + ge_time_format(obj.ReleasedDate, 3) + '</em></div><div class="content"><div class="info">' + obj.Content.replace(/\r\n/g, '<br>') + '</div>' + '<div class="share"><span class="share-icon iconfont">&#xe60f;</span><div class="share-box"><i class="shape"></i>' + '<ul class="bdsharebuttonbox "><li><a href="javascript:;" data-bshare=\"{type:\'weixin\',url:\'\',title:\'\',desc:\'' + obj.Title.replace(/<br \/><p ><p \/>/g, '。').replace(/\s/g, '') + '\',summary:\'\',images:\'' + window.location.origin + '/images/public/push.png\'}\" class="weixin">' + '<i class="iconfont">&#xe50a;</i>微信</a></li>' + '<li><a href="javascript:;" data-bshare=\"{type:\'weibo\',url:\'\',title:\'\',desc:\'' + obj.Title.replace(/<br \/><p ><p \/>/g, '。').replace(/\s/g, '') + '\',summary:\'\',images:\'' + window.location.origin + '/images/public/push.png\'}\" class="weibo"><i class="iconfont"}\" >&#xe504;</i>微博</a></li>' + '<li><a href="javascript:;" data-bshare=\"{type:\'qzone\',url:\'\',title:\'\',desc:\'' + obj.Title.replace(/<br \/><p ><p \/>/g, '。').replace(/\s/g, '') + '\',summary:\'\',images:\'' + window.location.origin + '/images/public/push.png\'}\" class="qq"><i class="iconfont">&#xe64e;</i>QQ</a></li></ul></div></div>';
                    break;
                case 1:
                    //日历
                    newsListStr += '<li class="calendar level' + obj.Level + (isFresh ? ' fresh' : '') + '" data-date="' + obj.ReleasedDate + '" data-id="' + obj.SourceId + '"><div class="post-time"><i></i><em>' + ge_time_format(obj.ReleasedDate, 3) + '</em></div><div class="content"><dl><dd class="flag"><img src="/Images/banner/rectangle/' + obj.CountryImg + '" onerror="javascript:this.src=\'/images/banner/rectangle/default_country.png\'"/></dd><dd class="act-time">' + new Date(obj.AddDate).pattern('HH:mm') + '</dd><dd class="title"><p class="name">' + obj.Title + '</p><p class="value">前值：' + obj.Previous + ' 预期：' + obj.Consensus + '</p>' + (obj.Revised != null && obj.Revised != '---' ? '<p class="revised">修正：' + obj.Revised + '（前值）</p>' : '') + '</dd><dd class="star"><div class="star-level ' + (obj.Star > 2 ? '' : 'low') + '"><i style="width:' + obj.Star * 20 + '%"></i></div></dd><dd class="act-val">公布：' + obj.Actual + '</dd><dd class="impact"><span class="impact' + obj.Impact + '">' + impactArr[obj.Impact] + '</span></dd></dl>' + '<div class="share"><span class="share-icon iconfont">&#xe60f;</span><div class="share-box"><i class="shape"></i>' + '<ul class="bdsharebuttonbox "><li><a href="javascript:;" data-bshare=\"{type:\'weixin\',url:\'\',title:\'\',desc:\'' + obj.Title.replace(/<br \/><p ><p \/>/g, '。').replace(/\s/g, '') + '\',summary:\'\',images:\'' + window.location.origin + '/images/public/push.png\'}\" class="weixin">' + '<i class="iconfont" >&#xe50a;</i>微信</a></li><li><a href="javascript:;" data-bshare=\"{type:\'weibo\',url:\'\',title:\'\',desc:\'' + obj.Title.replace(/<br \/><p ><p \/>/g, '。').replace(/\s/g, '') + '\',summary:\'\',images:\'' + window.location.origin + '/images/public/push.png\'}\" class="weibo">' + '<i class="iconfont" >&#xe504;</i>微博</a></li><li><a href="javascript:;" data-bshare=\"{type:\'qzone\',url:\'\',title:\'\',desc:\'' + obj.Title.replace(/<br \/><p ><p \/>/g, '。').replace(/\s/g, '') + '\',summary:\'\',images:\'' + window.location.origin + '/images/public/push.png\'}\" class="qq">' + '<i class="iconfont" >&#xe64e;</i>QQ</a></li></ul></div></div>';
                    break;
            }

            if (obj.SmallImg) {
                var imgObj = eval(obj.SmallImg);
                newsListStr += '<div class="img-place">';
                for (var k = 0; k < imgObj.length; k++) {
                    newsListStr += '<img src="' + imgObj[k].Small + '" data-viewer="' + imgObj[k].Big + '"/>';
                }
                newsListStr += '</div>';
            }

            newsListStr += '</div></li>';

            return newsListStr;
        },
        //type
        // 1 标题 内容 全部加载
        // 2 标题加载
        // 3 内容加载
        Ajax: function (type) {
            var that = this;
            $.ajax({
                url: "/News/GetBrief",
                data: { currentTime: Date.parse(new Date()) },
                type: "POST",
                dataType: "json",
                success: function (data) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        data = data;
                    }
                    data = JSON.parse(data.bodyMessage);
                    console.log(data);
                    switch (parseInt(type)) {
                        case 1:
                            that._Title();
                            that._Content(data, 1);
                            break;
                        case 2:
                            that._Title();
                            break;
                        case 3:
                            that._Content(data, 1);
                            break;
                        default:
                            break;
                    }
                    signalr();
                }
            });
        },
        //排序 a-b输出从小到大排序，b-a输出从大到小排序
        sort: function (data) {
            return data.sort(function (a, b) {
                return a.index - b.index;
            });
        }

        //声音消息初始化
        //if (getCookie('ringStatus') == 'on') {
        //    $('.sound .switch').removeClass('clo');
        //}
        //if (getCookie('msgStatus') == 'on') {
        //    $('.desk .switch').removeClass('clo');
        //}


        //导航栏选中效果
    };if (!$('.header .header-main li').first().hasClass('active')) {
        $('.header .header-main li').first().addClass('active');
    }

    $(".news .l").dragsort({
        dragSelector: ".news .l .ct",
        dragEnd: function () {
            var ck = "";
            for (var i = 0; i < $('.news').find('.l > div').length; i++) {
                ck += $('.news').find('.l > div').eq(i).data('index') + ",";
            }
            ck = ck.slice(0, -1);
            Fn.setCookie(ck);
            Fn.exhibitionAjax(ck);
        },
        dragBetween: false,
        placeHolderTemplate: "<div class='ct'></div>"
    });

    //点击切换选项卡
    $('.news .tab-bar .ct').on('mouseover', function () {
        newsTab($(this));
    });

    //点击加载更多
    $('.news-item .loading-more').on('click', function () {
        var actDataList = $('.news-item.active .news-data .news-list');
        var wholeHeight = actDataList.height() + actDataList.offset().top;
        var lastDateEl = actDataList.children().last();
        var webSite = $('.l .ct.active').attr('data-index');
        var currentDate = parseInt(lastDateEl.attr('data-date'));
        $(this).addClass('loading');
        isSub && getMoreNews(webSite, Date.parse(new Date(currentDate)), $(this));
    });

    //初始化滚动加载次数
    $('.news-item .news-data .news-list').each(function () {
        $(this).data('scroll-load', 0);
    });

    //滚动加载新闻数据 ////前两次有效
    $(window).on('scroll', function () {
        var actDataList = $('.news-item.active .news-data .news-list');
        var wholeHeight = actDataList.height() + actDataList.offset().top;
        var lastDateEl = actDataList.children().last();
        var loadEl = $('.news-item.active .loading-more');
        var webSite = $('.l .ct.active').attr('data-index');
        var currentDate = parseInt(lastDateEl.attr('data-date'));
        if (wholeHeight - ($(window).scrollTop() + $(window).height()) < 300 && isSub && actDataList.data('scroll-load') < 2) {
            loadEl.addClass('loading');
            getMoreNews(webSite, Date.parse(new Date(currentDate)), loadEl);
        }
    });

    function getQueryString() {
        var localUrl = window.location.href;
        var regStr = '#';
        var queryStr;
        if (localUrl.indexOf(regStr) > -1) {
            queryStr = localUrl.slice(localUrl.indexOf(regStr) + regStr.length);
            newsTab($('.news .l .ct[data-index="' + queryStr + '"]'));
        }
    }

    function newsTab(obj) {
        if (!obj.hasClass('active')) {
            //切换新闻平台
            obj.addClass('active').siblings().removeClass('active');
            $('.news-content').children('[data-index="' + obj.attr('data-index') + '"]').addClass('active').siblings().removeClass('active');
            obj.removeClass('new-push');
        }
    }

    //加载更多
    function getMoreNews(website, time, _this) {
        $.ajax({
            type: 'post',
            url: '/news/GetFinanceBrief',
            async: true,
            beforeSend: function () {
                isSub = false;
            },
            data: { website: website, isAfter: false, currentTime: time, topSize: 100 },
            success: function (data) {
                if (data.code == 0) {
                    dataMain = eval('(' + data.bodyMessage + ')');
                    _this.removeClass('loading');
                    addScrollLoadTimes(website);
                    _HTML.setData(website, dataMain, time);
                    isSub = true;
                }
            }

        });
    }

    //图片点击放大效果
    function imgViewer() {
        $(".img-place").Viewer({
            imgSelector: "img", closeBgImg: "/images/public/x.png",
            prevBgImg: "/images/public/imgPrev.png", // 上一张按钮图片
            nextBgImg: "/images/public/imgNext.png"
        });
    }

    //$('body').on('click', '.img-place img', function () {
    //    $("body").height($(window).height()).css({ "overflow-y": "hidden" });
    //    var imgStr = '<div class="mask"><div class="bg"></div><div class="natrual"><img src="' + $(this).attr('src') + '" class="max"/><img src="/images/public/x.png" class="close" /></div></div>';
    //    $('body').append(imgStr);
    //})
    ////关闭图片放大
    //$('body').on('click', '.mask', function (event) {
    //    $("body").height($(window).height()).css({ "overflow-y": "auto" });
    //    if (!$(event.target).hasClass('max')) {
    //        $(this).remove();
    //    }
    //})


    function SignalrFn() {
        $('#news-socket').attr('src', '/Static/Websocket/IndexNewsSignalr.html' + '?v=' + Date.parse(new Date()));
        newsSignalrFn = function (json, isFast) {
            var dataMain = eval('(' + json + ')');
            //侧栏日历更新
            refreshCalendar(dataMain);

            //渲染
            _HTML.updateNews(dataMain, isFast);
        };
    }

    $.post('/News/GetFirstNew', function (json) {
        _HTML._Content(json, 1);

        imgViewer();

        SignalrFn();
    });

    //声音、桌面选择设置
    $('.check-list dd').on('click', function () {
        if (!(window.Notification || window.mozNotification || window.webkitNotification) && $(this).parents('li').hasClass('notice')) {
            layer.msg('不支持该功能，请升级浏览器！');
        };
        noticeCheckFn($(this));
    });

    function noticeCheckFn(obj) {
        if (obj.children('span').hasClass('checked')) {
            //取消选择
            obj.children('span').removeClass('checked');
            var type = obj.parents('li').data('type');
            tipsOnOff[type + 'Selected'].splice(tipsOnOff[type + 'Selected'].indexOf(obj.data('id')), 1);
        } else {
            //选中
            obj.children('span').addClass('checked');
            var type = obj.parents('li').data('type');
            tipsOnOff[type + 'Selected'].push(obj.data('id'));
        }
        setStatusCookie(type, tipsOnOff[type + 'Selected'].join());
    }

    function noticeOnOffInit() {
        var ringCookie = getCookie('soundStatus');
        var msgCookie = getCookie('noticeStatus');
        tipsOnOff.noticeSelected = msgCookie ? msgCookie.split(',').allMap(function (i) {
            return parseInt(i);
        }) : [];
        tipsOnOff.soundSelected = ringCookie ? ringCookie.split(',').allMap(function (i) {
            return parseInt(i);
        }) : [];
        tipsOnOff.noticeSelected.length && $.each(tipsOnOff.noticeSelected, function (i, v) {
            $('.notice [data-id="' + v + '"] span').addClass('checked'); //桌面推送初始化
        });
        tipsOnOff.soundSelected.length && $.each(tipsOnOff.soundSelected, function (i, v) {
            $('.sound [data-id="' + v + '"] span').addClass('checked'); //声音初始化
        });
    }

    function setStatusCookie(type, status) {
        //设置cookie
        setCookie(type + 'Status', status, 'h999');
    }

    function msgRing(data) {
        if (tipsOnOff.soundSelected.indexOf(data.Website) > -1) {
            if (navigator.userAgent.indexOf('MSIE') >= 0) {
                $('#IEmusic').removeAttr('src').attr('src', '/flash/ocs/sound-tip.mp3');
            } else {
                $('#qtmusic').removeAttr('src').attr('src', '/flash/ocs/sound-tip.mp3');
            }
        }
    }

    function showNotice(data) {
        var noticeTitle = HTMLEncode(data.Title);
        if (tipsOnOff.noticeSelected.indexOf(data.Website) > -1) {
            try {
                Notification.requestPermission(function (perm) {
                    if (perm == "granted") {
                        var notification = new Notification("拜仑财经 www.bailun.com", {
                            dir: "auto",
                            lang: "hi",
                            tag: data.SourceId,
                            icon: "/images/public/push.png",
                            body: noticeTitle > 100 ? noticeTitle.substr(0, 100) + '...' : noticeTitle,
                            renotify: false
                        });

                        notification.onclick = function () {
                            window.focus();
                            newsTab($('.news .l .ct[data-index="' + data.Website + '"]'));
                        };

                        setTimeout(function () {
                            notification.close();
                        }, 8000);
                    }
                });
            } catch (ex) {
                console.log(ex);
            }
        }
    }

    //转码
    function HTMLEncode(input) {
        var converter = document.createElement("DIV");
        converter.innerHTML = input;
        var output = converter.innerText;
        converter = null;
        return output;
    }

    function addScrollLoadTimes(index) {
        var actDataList = $('.news-item[data-index="' + index + '"] .news-data .news-list');
        var actLoadTimes = actDataList.data('scroll-load');
        actDataList.data('scroll-load', ++actLoadTimes);
    }

    //分享
    $('body').on('click', '.content .bdsharebuttonbox .iconfont', function (event) {
        event.stopPropagation(); //阻止 <i> 的 click 事件冒泡 
        $(this).parent().trigger('click');
    });

    //设置按钮显示隐藏
    $('.left .set-btn .set-btn-wrap').on('click', function (event) {
        //var targetEl = $(event.target);
        //if (targetEl.parents().hasClass('set-box')) {
        //    return;
        //}
        $(this).parent().toggleClass('active');
    });

    //点击页面其他位置隐藏设置
    $(document).on('click', function (event) {
        var targetEl = $(event.target);
        if (!targetEl.parents().hasClass('set-btn') && $('.set-btn').hasClass('active')) {
            $('.set-btn').removeClass('active');
        }
    });

    //显示隐藏至顶部
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > $(window).height() / 2) {
            $('.to-top').show();
        } else {
            $('.to-top').hide();
        }
    });

    //滚动悬浮新闻切换栏
    $(window).on('scroll', function () {
        if ($(window).scrollTop() > tabInitTop) {
            $('.news .tab-bar').addClass('fixed');
        } else {
            $('.news .tab-bar').hasClass('fixed') && $('.news .tab-bar').removeClass('fixed');
        }
    });

    //至顶部
    $('.to-top').on('click', function () {
        $('body,html').animate({ 'scrollTop': 0 }, 300);
    });

    //时间格式化
    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份         
            "d+": this.getDate(), //日         
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
            "H+": this.getHours(), //小时         
            "m+": this.getMinutes(), //分         
            "s+": this.getSeconds(), //秒         
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
            "S": this.getMilliseconds() //毫秒         
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468" : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return fmt;
    };

    function kkpagerFn(pageId, pageIndex, totalPages) {
        var newPager = kkpagerNews;
        newPager.generPageHtml({
            type: "kkpager",
            pagerid: pageId,
            total: totalPages,
            pno: pageIndex,
            isShowCurrPage: false,
            isGoPage: false,
            lang: {
                firstPageText: "<<",
                lastPageText: ">>",
                prePageText: "<",
                nextPageText: ">"
            },
            mode: 'click',
            click: function (n) {
                this.selectPage(n, { total: totalPages, pagerid: pageId });
                switch (pageId) {
                    case 'kk-jinshi':
                        break;
                    case 'kk-ws':
                        break;
                    case 'kk-fx168':
                        break;
                    case 'kk-fx678':
                        break;
                    case 'kk-dailyfx':
                        break;
                    default:
                        break;
                }
            }
        }, true);
    }

    //分页插件初始化
    //kkpagerFn('kk-jinshi', 1, 10);
    //kkpagerFn('kk-ws', 1, 10);
    //kkpagerFn('kk-fx168', 1, 10);
    //kkpagerFn('kk-fx678', 1, 10);
    //kkpagerFn('kk-dailyfx', 1, 10);


    //Fn.Init();


    //function getPollNews(website, time, _this, isAfter, topSize) {
    //    var isAfter = isAfter || false, topSize = topSize || 100;
    //    $.ajax({
    //        type: 'post',
    //        url: '/news/GetFinanceBrief',
    //        async: true,
    //        beforeSend: function () {
    //            isSub = false;
    //        },
    //        data: { website: website, isAfter: isAfter, currentTime: time, topSize: topSize },
    //        success: function (data) {
    //            if (data.code == 0) {
    //                dataMain = eval('(' + data.bodyMessage + ')');
    //                _this.removeClass('loading');
    //                _HTML.setData(website, dataMain, time);
    //                isSub = true;

    //            }
    //        }

    //    })
    //}

});