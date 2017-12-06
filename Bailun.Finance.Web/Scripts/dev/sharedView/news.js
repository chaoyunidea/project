define([js.jsScroll], function (jScroll) {

    //新闻栏目

    //存cookie内容的值 已标题的data-index值为准  1_2_3_4_5

    var cookie = "USERFXMASTER",
        MaxNumber = 6,
        $title = $('.news').find('.l'),
        $content = $('.express').find('.news-content'),
        selectIndex = 0,
        title = ["金十", "华尔街", "fx678", "fx168", "DailyFx"];
    var socketNewsArr = [];
    //（1：金十；2：华尔街；3：fx168；4：fx678；5：DailyFx;）

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

            //正在加载
           // $('.news-content').openMask({ image: '/Images/public/loading.gif', isMask: false });

            //栏目切换
            //$('.express .content').FXtab('index', 'active');

            $('.express .content .tab dd').on('mouseover', function () {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings().removeClass('active');
                    $(this).parents('.content').find('.news-content').children('[data-index="' + $('.tab dd.active').attr('data-index') + '"]').addClass('active').siblings().removeClass('active');
                }
            });

            $('#news-websocket').attr('src', '/Static/Websocket/newsPartSignalr.html');

            jsScroll('scroll', 5, 'divScrollBar');
            //if (this.getCookie()) {
            //    this.exhibition(1);
            //} else {
            //    this.exhibition(0);
            //}

        },

        //获取cookie里面新闻的排序
        getTitleSort: function () {
            return cok = JSON.parse(this.getCookie()).Ca.join(',');
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
                    success: function (data) { }
                });
            }
        }
    };

    _HTML = {
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
            if (type == 1) {
                this.setData(1, data.JSNews);
                this.setData(2, data.WallStreetcnNews);
                this.setData(4, data.Fx678News);
                this.setData(3, data.Fx168News);
                this.setData(5, data.DailyFxnEews);
                Dom.ListT(parseInt(Dom.titlelist().eq(0).data('index'))).show();
                
            } else {
                var $SourceDom = $('.news-list li[data-id="' + data.SourceId + '"]');
                if (data.Status == 3) { //删除
                    $SourceDom.remove();
                    return;
                } else {
                    //修改 新增  去重 已id为基准 新的替换旧的
                    var instantDate = new Date(data.ReleasedDate);
                    var instantStr = '';
                    var currentItem = Dom.ListT(parseInt(data.Website)).find('.news-data .news-list');
                    var lastDate = new Date(Number(currentItem.children('.news-cell').first().attr('data-date')));
                    if ($SourceDom.length > 0) {  // 修改 去重
                        instantStr += renderDataLi();
                        $SourceDom.replaceWith(instantStr);

                    } else {//新增
                        //即时数据生成

                        if (instantDate.getDate() != lastDate.getDate()) {
                            if (instantDate.getMonth() >= lastDate.getMonth()) {
                                //判断是否是当天数据
                                instantStr += '<li data-date="' + instantDate + '"><h3>' + (instantDate.getMonth() + 1) + '月' + instantDate.getDate() + '日' + '</h3></li>';
                                instantStr += renderDataLi();
                                //instantStr += '</ul></div>';
                                currentItem.prepend(instantStr);
                            }
                        } else {
                            //如果是当天数据

                            if (data.ReleasedDate < lastDate.getTime()) {//推送新闻时间比第一条还早
                                currentItem.find('li.news-cell').each(function () {
                                    if (data.ReleasedDate >= $(this).attr('data-date')) {
                                        $(this).before(instantStr);
                                        return false;
                                    }
                                })
                                return;
                            } else {
                                instantStr += renderDataLi();
                                currentItem.children().first().after(instantStr);
                            }
                            
                        }
                    }
                }






                //替换标题和删除新闻
                //if (data.Status == 2) {
                //    $('.news-list li[data-id="' + data.SourceId + '"]').find('.content p').text(data.Title);
                //    return;
                //} else if (data.Status == 3) {
                //    $('.news-list li[data-id="' + data.SourceId + '"]').remove();
                //    return;
                //}

                //先判断是否重复数据
                //if (socketNewsArr.indexOf(data.SourceId) == -1 && $('[data-id="' + data.SourceId + '"]').length == 0) {
                //    socketNewsArr.push(data.SourceId);
                //} else {
                //    return;
                //}



                function renderDataLi() {
                    var strLi = '<li data-id="' + data.SourceId + '" data-date="' + data.ReleasedDate + '" class="news-cell"><em class="send-time">' + new Date(data.ReleasedDate).pattern('HH:mm') + '</em><div class="main-content">' + data.Content.replace(/\r\n/g, '<br>') + '</div></li>';
                    return strLi;
                }
            }
        },
        setData: function (index, data) {

            var splitArr = [];
            var resultArr = [];
            var newsAreaStr = '';
            resultArr.push(data);
          
            if (data.length > 0) {
                //生成html
                for (var i = 0; i < resultArr.length; i++) {
            
                    var currentDate = new Date(resultArr[i][0].ReleasedDate);
                    newsAreaStr += '<div class="news-area" data-date="' + currentDate.getDate() + '" ' + 'data-month="' + (currentDate.getMonth() + 1) + '" data-year="' + currentDate.getFullYear() + '" ><h3>' + (currentDate.getMonth() + 1) + '月' + currentDate.getDate() + '日' + '</h3><ul class="news-list">';
                    for (var j = 0; j < resultArr[i].length; j++) {
                        var content = resultArr[i][j].Content || resultArr[i][j].Title;
                        newsAreaStr += '<li data-id="' + resultArr[i][j].SourceId + '" data-date="' + resultArr[i][j].ReleasedDate + '"><em class="send-time">' + new Date(resultArr[i][j].ReleasedDate).pattern('HH:mm') + '</em><div class="main-content">' + content.replace(/\r\n/g, '<br>') + '</div></li>';
                    }
                    newsAreaStr += '</ul></div>';
                }
            } else {
                newsAreaStr += '<h5>今日暂无数据<h5>';
            }
            Dom.ListT(parseInt(index)).find('.news-data').append(newsAreaStr).append('<a class="more" href="' + newsDomain + '/news/index#' + index + '">查看更多</a>');
        },
        //type
        // 1 标题 内容 全部加载
        // 2 标题加载
        // 3 内容加载
        Ajax: function (type) {
            var that = this;
            $.ajax({
                url: "/News/GetFinanceAllBriefNew",
                data: { topSize: 50 },
                type: "POST",
                dataType: "json",
                success: function (data) {
                    try {
                        data = JSON.parse(data);
                    } catch (e) {
                        data = data;
                    }
                    data = JSON.parse(data.bodyMessage);

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
                    // signalr();
                    //$('.news-content').closeMask();
                    //滚动条
                    
                }
            });
        },
        //排序 a-b输出从小到大排序，b-a输出从大到小排序
        sort: function (data) {
            return data.sort(function (a, b) {
                return a.index - b.index;
            });
        }

        //滚动加载新闻数据
        //$('#scroll').on('scroll', function () {
        //    var actDataList = $('.news-item.active .news-data');
        //    var wholeHeight = actDataList.height() + actDataList.offset().top;
        //    var lastDateEl = actDataList.children().last();
        //    var webSite = $('.tab dd.active').attr('data-index');
        //    var currentDate = lastDateEl.attr('data-year') + '.' + lastDateEl.attr('data-month') + '.' + (lastDateEl.attr('data-date') - 1);
        //    if (wholeHeight - ($(window).scrollTop() + $(window).height()) < 200) {
        //        getMoreNews(webSite, Date.parse(new Date(currentDate)));
        //    }
        //})


    };

    function getMoreNews(website, time) {
        $.ajax({
            type: 'post',
            url: '/news/getbriefbywebsite',
            async: true,
            data: { website: website, currentTime: time },
            success: function (data) {
                if (data.code == 0) {
                    dataMain = JSON.parse(data.bodyMessage);
                    _HTML.setData(website, dataMain);
                }
            }
        });
    }

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

    return { Fn: Fn };
});