define([js.calculatePrice], function (calc) {

    //首页顶部
    Nav = {
        //标题
        titlelist: function () {
            return $('.nav').find('.tab-title').find('div');
        },
        ListT: function (i) {
            return $('.nav').find('.tab-content').children('[data-index="' + i + '"]');
        },
        indexArr: ['1', '2', '3', '4', '9', '10', '11'],
        subscribeSymbol: [],
        marketIdArr: []
    };

    var chartObjGroup = {};
    var chartDataGroup = eval('(' + $('#hiddenmpsd').val() + ')');

    chartActionQueue();

    $('#h-websocket').attr('src', '/Static/Websocket/NewsPriceSignalr.html' + '?v=' + Date.parse(new Date()));

    //移入移出图表颜色修改
    $('.tab-item .nav-link').not('.nodata').on('mouseover', function () {
        chartObjGroup[$(this).find('.chart').attr('id')].update({ colors: ['#fff'] });
    }).on('mouseout', function () {
        chartObjGroup[$(this).find('.chart').attr('id')].update({ colors: ['#ccc'] });
    });

    //图表绘制
    function chartActionQueue() {
        $('.tab-item .nav-link .chart').each(function () {
            var dataMain = chartDataGroup[$(this).data('id')];
            Nav.subscribeSymbol.push($(this).parent().data('code'));
            dataMain = dataMain.allMap(function (a) {
                return parseFloat(a);
            });
            areaChart($(this).attr('id'), dataMain);
        });
    }

    ////顶部数据展示
    //var vm = avalon.define({
    //    $id: 'list',
    //    dataList: []
    //})
    //var initData;

    ////编码过滤器
    //avalon.filters.encode = function (obj) {
    //    obj.href = encodeURI(obj.href);
    //    return obj;
    //}

    //dataMain = [{
    //    'CurrentPrice': 2.2,
    //    'ClosePrice': 1,
    //    'MarketId': '100001',
    //    'Cn_Name': 'csaf',
    //    'PriceDate': '2016.01.02',
    //},
    //{
    //    'CurrentPrice': 2.2,
    //    'ClosePrice': 1,
    //    'MarketId': '100002',
    //    'Cn_Name': 'csaf',
    //    'PriceDate': '2016.01.02',
    //},
    //{
    //    'CurrentPrice': 2.2,
    //    'ClosePrice': 1,
    //    'MarketId': '100002',
    //    'Cn_Name': 'csaf',
    //    'PriceDate': '2016.01.02',
    //},
    //{
    //    'CurrentPrice': 2.2,
    //    'ClosePrice': 1,
    //    'MarketId': '100002',
    //    'Cn_Name': 'csaf',
    //    'PriceDate': '2016.01.02',
    //},
    //{
    //    'CurrentPrice': 2.2,
    //    'ClosePrice': 1,
    //    'MarketId': '100002',
    //    'Cn_Name': 'csaf',
    //    'PriceDate': '2016.01.02',
    //},
    //{
    //    'CurrentPrice': 2.2,
    //    'ClosePrice': 1,
    //    'MarketId': '100002',
    //    'Cn_Name': 'csaf',
    //    'PriceDate': '2016.01.02',
    //}];


    //获取主要展示
    function startGetData() {
        $.ajax({
            type: 'POST',
            url: '/marketprice/GetQuoteQueryImportant',
            data: { pageindex: 1, pagesize: 6 },
            success: function (data) {
                if (data.code == 0) {

                    var dataMain = eval('(' + data.bodyMessage + ')');
                    //关闭正在加载

                    //setData(0, dataMain);
                    for (var i = 0; i < dataMain.length; i++) {
                        getImportantItemData(dataMain[i]['MarketId'], 'chartLineMain');
                        Nav.subscribeSymbol.push(dataMain[i]['Code']);
                        Nav.marketIdArr.push(dataMain[i]['MarketId']);
                    }
                }
            },
            complete: function () {
                getIndexList();
            }
        });
    }

    //产品悬停切换
    $('.tab-title').on('mouseover', '.pre', function (e) {
        var obj = $(e.target);
        var index = obj.attr('data-index');
        if (!obj.hasClass('active')) {
            //切换主要显示
            obj.addClass('active').siblings().removeClass('active');
            Nav.ListT(index).addClass('active').siblings().removeClass('active');
            //$('.nav .tab-content .loading').closeMask();
        }
    });

    //加载各类型列表数据
    //$('.tab-title').children().each(function () {
    //    var index = $(this).attr('data-index');
    //    getIndexList(index);
    //})

    //根据id获取主要数据展示
    function getIndexList() {
        var productId = Nav.indexArr.shift();
        if (productId) {
            $.ajax({
                type: 'POST',
                url: '/marketprice/QueryRecommendByProductShowIndex',
                data: { product: productId, pageindex: 1, pagesize: 6 },
                success: function (data) {
                    if (data.code == 0) {

                        var dataMain = eval('(' + data.bodyMessage + ')');

                        //Nav.indexArr.splice(Nav.indexArr.indexOf(productId), 1);
                        //setData(productId, dataMain);
                        for (var i = 0; i < dataMain.length; i++) {
                            getImportantItemData(dataMain[i]['MarketId'], 'chartLine');
                            Nav.subscribeSymbol.push(dataMain[i]['Code']);
                            Nav.marketIdArr.push(dataMain[i]['MarketId']);
                        }
                    }
                }
            }).always(function () {
                getIndexList();
            });
        } else {
            $('#h-websocket').attr('src', '/Static/Websocket/NewsPriceSignalr.html' + '?v=' + Date.parse(new Date()));

            //移入移出图表颜色修改
            $('.tab-item .nav-link').on('mouseover', function () {
                chartObjGroup[$(this).find('.chart').attr('id')].update({ colors: ['#fff'] });
            }).on('mouseout', function () {
                chartObjGroup[$(this).find('.chart').attr('id')].update({ colors: ['#ccc'] });
            });
        }
    }

    //填充页面内容
    function setData(index, data) {
        var newsAreaStr = '';
        if (data.length > 0) {
            //生成html
            for (var i = 0; i < data.length; i++) {
                var calcVal = calc.calculateUpDown(data[i]);
                newsAreaStr += '<div class="nav-data clearfix ' + priceStatus(calcVal.priceExchange) + (index == 9 ? ' press' : '') + '" data-code="' + data[i].Code + '" data-timezone="' + data[i].Price_TimeZone + '"><a href="' + priceDomain + '/marketprice/detail/' + data[i].MarketId + '" target="_blank"><div class="data-contain clearfix"><p class="title">' + data[i].Cn_Name + '</p><p class="current-price">' + data[i].CurrentPrice + '</p></div>' + (index == 9 ? '<div class="exchange">' + data[i].Exchange + '</div>' : '') + '<div class="data-left"><span class="open-price">' + calcVal.priceExchange + '</span><span class="close-price">(' + calcVal.priceLimit + ')</span><p class="data-time">' + (data[i].PriceDate == "" ? "---" : new Date(transTimezone(data[i].PriceDate, data[i].Price_TimeZone)).pattern('HH:mm')) + '</p></div><div class="chart" id="' + (index == 0 ? 'chartLineMain' : 'chartLine') + data[i].MarketId + '" style="width:55px;height:50px;"></div></a></div>';
            }
        }
        Nav.ListT(parseInt(index)).html(newsAreaStr);
    }

    //涨跌状态
    function priceStatus(val) {
        var floatVal = parseFloat(val);
        var status = floatVal > 0 && 'up' || floatVal < 0 && 'down' || floatVal == 0 && 'none';
        return status;
    }

    //时区转换
    function transTimezone(date, timezone) {
        var utc = new Date(date).getTime() - parseFloat(timezone) * 1000 * 60 * 60;
        var localStamp = utc + 8 * 1000 * 60 * 60;
        return localStamp;
    }

    refreshPriceData = function (data) {
        var str = '';
        var calcVal = calc.calculateUpDown(data);
        str += '<div class="data-left"><span class="open-price">' + calcVal.priceExchange + '</span><span class="close-price">(' + calcVal.priceLimit + ')</span><p class="data-time">' + (data.PriceDate == "" ? "---" : new Date(transTimezone(data.PriceDate, $('.nav-data[data-code="' + data.Code + '"]').attr('data-timezone'))).pattern('HH:mm')) + '</p></div>';
        $('.nav-data[data-code="' + data.Code + '"]').removeClass('up down none').addClass(priceStatus(calcVal.priceExchange)).find('.data-left').replaceWith(str).end().find('.current-price').html(data.CurrentPrice);
    };

    //单独获取品种展示数据
    function getImportantItemData(marketId, type) {
        $.ajax({
            type: 'POST',
            data: { marketId: marketId },
            url: '/marketprice/GetMinutePriceMethod',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');

                    dataMain = dataMain.allMap(function (a) {
                        return parseFloat(a);
                    });
                    areaChart(type + marketId, dataMain);
                }
                //模拟数据
                //var dataMain = [1.0, 1.5, 1.2, 2.5, 3, 1.2, 2.3, 3.6, 1];
                //areaChart('chartLine' + marketId, dataMain);
            }
        });
    }

    //公共图表参数
    var options = {};
    //小图表方法（参数DomID、数据）
    function areaChart(id, data) {
        var pieOptions = {
            colors: ['#ccc', 'red'], //颜色列表
            title: {
                text: null //标题设置为空
            },
            credits: {
                enabled: false //版权隐藏
            },
            chart: {
                backgroundColor: 'rgba(0,0,0,0)',
                spacing: 0
            },
            title: {
                text: ''
            },
            rangeSelector: {
                selected: 0,
                inputEnabled: false,
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                visible: false

            },
            tooltip: {
                enabled: false,
                crosshairs: [false, false]

            },
            yAxis: {
                visible: false

            },
            legend: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            plotOptions: {
                line: {
                    enableMouseTracking: false,
                    marker: {
                        enabled: false
                    }
                }
            },
            tooltip: {
                enabled: false
            },
            series: [{
                type: 'line',
                name: '',
                data: data
            }]
        };
        var t = $.extend({}, pieOptions, options);
        var chart = Highcharts.chart(id, t);
        chartObjGroup[id] = chart;
    }
});