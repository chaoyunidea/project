require([js.newss, js.controlBar, js.calculatePrice, js.calendar], function (news, controlBar, calc, calendar) {

    news.Fn.Init();
    controlBar.controlFn();
    //公共图表参数
    var options = {
        colors: ['#ccc', '#ffba14'], //颜色列表
        title: {
            text: null //标题设置为空
        },
        credits: {
            enabled: false //版权隐藏
        }
    };

    Nav = {
        subscribeSymbol: [],
        marketIdArr: []
    };
    var chartObjGroup = {};

    //排行榜小图表方法（参数DomID、数据）
    function areaChart(id, data) {
        var pieOptions = {
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
                valueDecimals: 2,
                crosshairs: [true, true],
                formatter: function () {
                    var a, b, color, s;
                    a = '报价';
                    s = a + ' <span style="color:' + color + '">' + this.y + '</span>';
                    return s;
                },
                enabled: false

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

    var initData;
    //不同类别请求列表
    var requestQueue = { 1: 'forex', 2: 'goods', 3: 'indices', 4: 'bonds', 9: 'bitcoin', 10: 'stockIndex', 11: 'metals' };
    var requestArr = [1, 11, 2, 3, 10, 4, 9];

    //正在加载
    //$('.left .price .content').openMask({ image: '/Images/public/loading.gif', isMask: false });

    //获取列表数据
    //getPriceList();

    //请求列表数据

    var chartObjGroup = {};
    var chartDataGroup = eval('(' + $('#hiddenmpsd').val() + ')');

    chartActionQueue();

    $('body').append($('<iframe style="display:none;opacity:0">').attr('src', '/Static/Websocket/IndexPriceSignalr.html?v=' + Date.parse(new Date())));

    //移入移出图表颜色修改
    $('.price-item li').on('mouseover', function () {
        chartObjGroup[$(this).find('.chart').attr('id')].update({ colors: ['#fff'] });
    }).on('mouseout', function () {
        chartObjGroup[$(this).find('.chart').attr('id')].update({ colors: ['#ccc'] });
    });

    //图表绘制
    function chartActionQueue() {
        $('.price-item li .chart').each(function () {
            var dataMain = chartDataGroup[$(this).data('id')];
            Nav.subscribeSymbol.push($(this).parent().data('code'));
            dataMain = dataMain.allMap(function (a) {
                return parseFloat(a);
            });
            areaChart($(this).attr('id'), dataMain);
        });
    }

    function signalrFn() {
        //服务器即时通信
        signalr({
            hubConnection: 'https://ga.fxdata.fx110.com/signalr',
            connHunProxyOn: 'QuoteTimelyReceive',
            createHubProxy: 'QuoteHub',
            invokes: ' ',
            cb: function (data) {
                //console.log(data);
                var dataMain = eval('(' + data + ')');
                var initDataArr = eval('(' + initData + ')');

                for (var j = 0; j < vm.priceList.length; j++) {
                    if (vm.priceList[j]['SubscriberId'] == dataMain['m']) {
                        vm.priceList[j].Ask = dataMain['a'];
                        vm.priceList[j].Bid = dataMain['b'];
                    }
                }
            }
        });
    }

    //获取列表数据
    function getPriceList() {
        var productId = requestArr.shift();
        if (productId) {
            requestPriceFn(productId, requestQueue[productId]);
        } else {

            //$('#h-websocket').attr('src', '/Static/Websocket/IndexPriceSignalr.html');
            //移入移出图表颜色修改
            $('.price-item li').on('mouseover', function () {
                chartObjGroup[$(this).find('.chart').attr('id')].update({ colors: ['#fff'] });
            }).on('mouseout', function () {
                chartObjGroup[$(this).find('.chart').attr('id')].update({ colors: ['#ccc'] });
            });
        }
    }

    function requestPriceFn(productId, dataName) {
        $.ajax({
            type: 'post',
            data: { product: productId, pageindex: 1, pagesize: 8 },
            url: '/MarketPrice/QueryRecommendByProduct',
            success: function (data) {
                if (data.code == 0) {
                    initData = data.bodyMessage;
                    var dataMain = eval('(' + data.bodyMessage + ')');

                    //$('#' + dataName + 'Data').append(priceListRenderDetail(dataMain,productId));
                    Nav.subscribeSymbol = [];
                    for (var i = 0; i < dataMain.length; i++) {
                        getPriceItemData(dataMain[i]['MarketId']);
                        Nav.subscribeSymbol.push(dataMain[i]['Code']);
                        Nav.marketIdArr.push(dataMain[i]['MarketId']);
                    }

                    $('body').append($('<iframe style="display:none;opacity:0">').attr('src', '/Static/Websocket/IndexPriceSignalr.html?subArr=' + encodeURIComponent(Nav.subscribeSymbol.join()) + '&v=' + Date.parse(new Date())));
                }
            }
        }).always(function () {
            getPriceList();
        });
    }

    //即时数据更新
    refreshPriceData = function (data) {
        var str = '';
        var calcVal = calc.calculateUpDown(data);
        str += '<div class="data-area"><h3 class="current">' + data.CurrentPrice + '<i></i></h3>' + '<p class="updowns"><em class="percent">' + calcVal.priceExchange + '</em><em>' + calcVal.priceLimit + '</em></p></div>';
        $('[data-code="' + data.Code + '"]').removeClass('up down none').addClass(priceStatus(calcVal.priceExchange)).find('.data-area').replaceWith(str);
    };

    function priceListRenderDetail(data, type) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            var calcVal = calc.calculateUpDown(data[i]);
            str += '<li data-code="' + data[i].Code + '" class="' + priceStatus(calcVal.priceExchange) + '">' + '<div class="params">' + '<div class="name clearfix"><h5>' + data[i].Cn_Name + '</h5>' + (type == 9 ? '<h6>' + data[i].Exchange + '</h6>' : '') + '</div>' + '<div class="data-area"><h3 class="current">' + parseFloat(data[i].CurrentPrice) + '<i></i></h3>' + '<p class="updowns"><em class="percent">' + calcVal.priceExchange + '</em><em>' + calcVal.priceLimit + '</em></p></div>' + '</div>' + '<div class="chart" id="chartLine' + data[i].MarketId + '">' + '</div>' + '<a href="/marketprice/detail/' + data[i].MarketId + '" target="_blank">' + '</a>' + '</li>';
        }
        return str;
    }

    //涨跌状态
    function priceStatus(val) {
        var floatVal = parseFloat(val);
        var status = floatVal > 0 && 'up' || floatVal < 0 && 'down' || 'none';
        return status;
    }

    function priceListRenderStock(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            str += '<li>' + '<a href="/marketprice/stockdetail/' + data[i].MarketId + '" target="_blank">' + '<div class="params ' + (data[i].CurrentPrice - data[i].OpenPrice > 0 ? 'up' : 'down') + '">' + '<h5 class="name">' + data[i].Cn_Name + '</h5>' + '<h3 class="current">' + toFixeds(parseFloat(data[i].CurrentPrice), 2) + '<i></i></h3>' + '<p class="updowns"><em class="percent">' + (data[i].OpenPrice <= 0 ? toFixeds(parseFloat(data[i].OpenPrice), 2) : toFixeds(parseFloat(data[i].CurrentPrice - data[i].OpenPrice) / data[i].OpenPrice * 100, 2)) + '%</em><em>' + toFixeds(parseFloat(data[i].CurrentPrice - data[i].OpenPrice), 2) + '</em></p>' + '</div>' + '<div class="chart" id="chartLine' + data[i].MarketId + '">' + '</div>' + '</a>' + '</li>';
        }
        return str;
    }

    //单独获取外汇报价数据
    function getPriceItemData(marketId) {
        $.ajax({
            type: 'post',
            data: { marketId: marketId },
            url: '/marketprice/GetMinutePriceMethod',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    dataMain = dataMain.allMap(function (a) {
                        return parseFloat(a);
                    });
                    areaChart('chartLine' + marketId, dataMain);
                }
            }
        });
    }

    function smartChart(id, data) {
        var ctx = document.getElementById(id).getContext("2d");
        var myNewChart = new Chart(ctx).line(data);
        var data = {
            dataset: [{
                data: data,
                borderWidth: 0
            }]
        };
    }

    //评论翻页
    function kkpagerFn(pageIndex, totalPages) {
        kkpager.generPageHtml({
            type: "kkpager",
            pagerid: "kkpager",
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
                this.selectPage(n);
            }
        }, true);
    }
});