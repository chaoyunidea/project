require([js.newss, js.controlBar], function (news, controlBar) {

    //news.Fn.Init();
    controlBar.controlFn();
//$(function () {
    var chartData;
    var productJson = { 6: ['沪深', 'ashares'], 7: ['港股', 'hkstock'], 8: ['美股', 'usstock'] };

    //初始化高度适应屏幕
    $('#highcharts').height($(window).height() - ($('.header').height() + $('#footer').height() + $('.market .data').outerHeight() + $('.market .switch').outerHeight()) - 40);

    //滚动条
    //jsScroll('scroll', 4, 'divScrollBar');
    
    //时间间隔选择
    $('.time-search li').on('click', function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active');
            chartGetData(parseInt($(this).attr('data-time')), $(this).parents('.switch').attr('data-type'));
        }
    })

    vm = avalon.define({
        $id: 'price',
        detailData: {}

    })

    //初始化信息
    getDetailData(marketId,0);
    getDealData(marketId);
    
    //初始化数据
    function getDetailData(id,type) {
        $.ajax({
            type: 'post',
            url: '/MarketPrice/QueryMarketDetail',
            data: { marketId: id },
            success: function (data) {
                if (data.code == 0) {
                    dataMain = eval('(' + data.bodyMessage + ')');
                    if (type == 0) {
                        $('#marketData').append(DetailListRender(dataMain));
                        $('#stock').append(RightListRender(dataMain));
                    }
                    if (type == 1) {
                        $('#stockName').text(dataMain.Cn_Name);
                    }
                    //chartGetData(10, 'area');
                }
            }
        })
    }

    function getDealData(id) {
        $.ajax({
            type: 'post',
            url: '/MarketPrice/GetStockDealMethod',
            data: { marketId: id },
            success: function (data) {
                if (data.code == 0) {
                    dataMain = eval('(' + data.bodyMessage + ')');
                    $('#deal').append(DealListRender(dataMain));
                }
            }
        })
    }

    //详情渲染
    function DetailListRender(data) {
        var nowTime = new Date().getTime();
        var lastTime = new Date(data.LastPriceTime).getTime();
        var str = '';
        str += '<div class="title"><div class="name"><h2>' + data.Cn_Name + '</h2><p> · (' + data.Code +')'
            + '</p></div><div class="digital ' + (data.CurrentPrice - data.ClosePrice > 0 ? 'up' : 'down') + '"><h2>' + toFixeds(parseFloat(data.CurrentPrice), 2)
            + '<i></i></h2><p class="updowns"><em>'+ toFixeds(parseFloat((data.CurrentPrice - data.ClosePrice)),2)
            + '</em><em class="percent">' + (data.ClosePrice <= 0 ? toFixeds(parseFloat(data.ClosePrice), 2) : toFixeds((parseFloat(data.CurrentPrice - data.ClosePrice) / data.ClosePrice * 100), 2))
            + '%</em></p><p class="status"><em>' + (nowTime > lastTime ? '已收盘' : '已开盘') + ' </em><em class="time">' + data.LastPriceTime
            + '</em></p></div></div><div class="content">'
            + '<dl class="compares">'
            + '<dd><p>今开:</p><em>' + toFixeds(parseFloat(data.OpenPrice), 2) + '</em></dd>'
            + '<dd><p>最高:</p><em>' + toFixeds(parseFloat(data.HighPrice), 2) + '</em></dd>'
            + '<dd class="line3"><p>成交额:</p><em>' + toFixeds(parseFloat(data.TotalVolumePrice), 2) + '</em></dd>'
            + '<dd ><p>市值:</p><em>' + toFixeds(parseFloat(data.FuturesSettlementPrice), 2) + '</em></dd>'
            + '</dl>'
            + '<dl class="compares">'
            + '<dd><p>昨收:</p><em>' + toFixeds(parseFloat(data.ClosePrice), 2) + '</em></dd>'
            + '<dd><p>最低:</p><em>' + toFixeds(parseFloat(data.LowPrice), 2) + '</em></dd>'
            + '<dd class="line3"><p>成交量:</p><em>' + toFixeds(parseFloat(data.TotalVolume / 10000), 2) + '万股</em></dd>'
            + '<dd><p>振幅:</p><em>' + toFixeds(parseFloat(data.LowPrice), 2) + '%</em></dd>'
            + '</dl>'
            + '<dl class="compares">'
            + '<dd><p>市盈率:</p><em>' + toFixeds(parseFloat(data.ClosePrice), 2) + '</em></dd>'
            + '<dd><p>市净率:</p><em>' + toFixeds(parseFloat(data.OpenPrice), 2) + '</em></dd>'
            + '<dd class="line3"><p>换手率:</p><em>' + toFixeds(parseFloat(data.HighPrice), 2) + '%</em></dd>'
            + '<dd><p>委比:</p><em>' + toFixeds(parseFloat(data.LowPrice), 2) + '%</em></dd>'
            + '</dl></div>';
        return str;
    }

    //右边五档盘口页面渲染
    function RightListRender(data) {
        var str = '';
        str += '<div class="thead"><p class="tleft">委比<em>' + toFixeds(parseFloat(data.ClosePrice), 2) + '%</em></p><p class="tright">委差<em>' + parseInt(data.ClosePrice) + '</em></p></div><ul>'
            + '<li class="bgf"><p class="tleft">卖⑤<em>' + toFixeds(parseFloat(data.SP5), 2) + '</em></p><p class="tright">' + parseInt(data.SV5) + '</p></li>'
            + '<li><p class="tleft">卖④<em>' + toFixeds(parseFloat(data.SP4), 2) + '</em></p><p class="tright">' + parseInt(data.SV4) + '</p></li>'
            + '<li class="bgf"><p class="tleft ">卖③<em>' + toFixeds(parseFloat(data.SP3), 2) + '</em></p><p class="tright">' + parseInt(data.SV3) + '</p></li>'
            + '<li><p class="tleft">卖②<em>' + toFixeds(parseFloat(data.SP2), 2) + '</em></p><p class="tright">' + parseInt(data.SV2) + '</p></li>'
            + '<li class="bgf"><p class="tleft ">卖①<em>' + toFixeds(parseFloat(data.SP1), 2) + '</em></p><p class="tright">' + parseInt(data.SV1) + '</p></li>'
            + '<li><p class="tleft">成交<em>' + toFixeds(parseFloat(data.ClosePrice), 1) + '</em></p><p class="tright deal"> <em>升级十档盘口 </em></p></li>'
            + '<li class="bgf"><p class="tleft ">买①<em>' + toFixeds(parseFloat(data.BP1), 2) + '</em></p><p class="tright">' + parseInt(data.BV1) + '</p></li>'
            + '<li><p class="tleft">买②<em>' + toFixeds(parseFloat(data.BP2), 2) + '</em></p><p class="tright">' + parseInt(data.BV2) + '</p></li>'
            + '<li class="bgf"><p class="tleft ">买③<em>' + toFixeds(parseFloat(data.BP3), 2) + '</em></p><p class="tright">' + parseInt(data.BV3) + '</p></li>'
            + '<li><p class="tleft">买④<em>' + toFixeds(parseFloat(data.BP4), 2) + '</em></p><p class="tright">' + parseInt(data.BV4) + '</p></li>'
            + '<li class="bgf"><p class="tleft ">买⑤<em>' + toFixeds(parseFloat(data.BP5), 2) + '</em></p><p class="tright">' + parseInt(data.BV5) + '</p></li>'
            + '<li><p class="tleft outside">外盘<em>' + parseInt(data.ClosePrice) + '手</em></p><p class="tright inside">内盘<em>' + parseInt(data.ClosePrice) + '手</em></p></li>'
            + '</ul>';
        return str;
    }

    //右边分时数据页面渲染
    function DealListRender(data) {
        var str = '';
        var strHead = '';
        strHead +='<div class="thead"><p class="tleft">时间</p><p class="tmiddle">成交价(元)</p><p class="tright">成交量(股)</p></div><ul>';
        for (var i = 0; i < data.length; i++) {
            if (i % 2 == 0) {
                str += '<li class="bgf">'
                + '<p class="tleft">' + (data[i].Date).substr(11, 5) + '</p><p class="tmiddle">' + data[i].NewPrice + '</p><p class="tright">' + toFixeds(parseFloat(data[i].amountOf / 10000), 2)
                + '万</p></li>';
            } else {
                str += '<li>'
                + '<p class="tleft">' + (data[i].Date).substr(11, 5) + '</p><p class="tmiddle">' + data[i].NewPrice + '</p><p class="tright">' + toFixeds(parseFloat(data[i].amountOf / 10000), 2)
                + '万</p></li>';
            }
        }
        return strHead + str +'</ul>';
    }

    //显示TradingView图表
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    TradingView.onready(function () {
        var widget = window.tvWidget = new TradingView.widget({
            fullscreen: true,
            //默认选择,通过传递
            symbol: 'FXUSDJPY',
            interval: 'm',
            container_id: "tv_chart_container",

            //	BEWARE: no trailing slash is expected in feed URL
            //datafeed: new Datafeeds.UDFCompatibleDatafeed("http://localhost:1598/api/"),
            //datafeed: new Datafeeds.UDFCompatibleDatafeed("http://localhost:11472/api/"),
            datafeed: new Datafeeds.UDFCompatibleDatafeed("http://114.55.253.250:10001/api/"),
            library_path: "/scripts/glup/charting_library/",
            //选择中文
            locale: getParameterByName('lang') || "zh",
            //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
            drawings_access: { type: 'black', tools: [{ name: "Regression Trend" }] },
            disabled_features: ["use_localstorage_for_settings"],
            enabled_features: ["study_templates"],
            charts_storage_url: 'http://saveload.tradingview.com',
            charts_storage_api_version: "1.1",
            client_id: 'bailun.com',
            user_id: 'public_user_id',
        });
        widget.onChartReady(function () {
            //$("iframe").contents().find(".getimage").css("display", "none");
            //$("iframe").contents().find(".chart-status-picture").css("display", "none");
            console.log("123123");

        });
    });

    //生成面包导航
    function breadRender() {
        var str = '<p><a href="/marketprice/index">市场报价</a> > </p> <p><a href="/marketprice/' + productJson[productId][1]
            + '">' + productJson[productId][0] + '</a>  > </p>'
            + '<p id="stockType"><a href="/marketprice/stocklist/' + productId + '-' + plateId + '"></a> > </p>'
            + '<p id="stockName"></p>';
        $('.left .bread').append(str);
        console.log(str);
        getQueryPlateName(plateId);
        getDetailData(marketId, 1);
        //getPlateList(productId);
    }

    breadRender();

    //查询类别名称
    function getQueryPlateName(id) {
        $.ajax({
            type: 'post',
            data: { plateId: id },
            url: '/MarketPrice/QueryPlateName',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    $('#stockType a').text(dataMain.PlateName);
                }
            }
        })
    }

});

