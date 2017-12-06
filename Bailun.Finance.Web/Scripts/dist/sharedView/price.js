define([js.calculatePrice], function (calc) {

    rightPriceCodeArr = [];
    var chartTimer = null;
    var chartDataJson = {};

    rightPriceListRefresh = function (data) {
        var str = '';
        var calcVal = calc.calculateUpDown(data);
        str += '<td class="td2">' + data.CurrentPrice + '</td><td class="td3">' + calcVal.priceLimit + '</td><td class="td4">' + calcVal.priceExchange + '</td>';
        $('.quote tr[data-code="' + data.Code + '"]').removeClass('red green none').addClass(priceStatus(calcVal.priceExchange)).children('td:gt(0)').remove().end().append(str);
    };

    $('#chartLine').openMask({ image: '/Images/public/loading.gif', isMask: false });

    getPriceList();

    //涨跌状态
    function priceStatus(val) {
        var floatVal = parseFloat(val);
        var status = floatVal > 0 && 'up' || floatVal < 0 && 'down' || floatVal == 0 && 'none';
        return status;
    }

    //鼠标移入生成对应的图表
    $('body').on('mouseover', '.quote table tr', function () {
        var that = $(this);
        if (!that.hasClass('active')) {
            chartTimer = setTimeout(function () {
                that.addClass('active').siblings().removeClass('active');
                areaChart(chartDataJson[that.attr('data-id')]);
            }, 500);
        }
    }).on('mouseout', function () {
        clearTimeout(chartTimer);
    });

    //鼠标点击跳页面
    $('body').on('click', '.quote table tr', function () {
        window.open(priceDomain + '/marketprice/chart/' + $(this).attr('data-id'));
    });

    //获取报价列表数据
    function getPriceList() {
        $.ajax({
            type: 'post',
            data: {},
            url: '/MarketPrice/GetChatIndexForBailun',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    for (var i = 0; i < dataMain.length; i++) {
                        if (i == 0) {
                            chartGetData(dataMain[i].MarketId, true);
                        } else {
                            chartGetData(dataMain[i].MarketId, false);
                        }
                        rightPriceCodeArr.push(dataMain[i].Code);
                    }
                    $('#r-websocket').attr('src', '/Static/Websocket/IndexPriceSignalr-r.html' + '?v=' + Date.parse(new Date()));
                }
            }
        });
    }

    //获取chart图表数据
    function chartGetData(marketId, bool) {
        var stamp = Date.parse(new Date()) / 1000;
        $.ajax({
            type: 'Get',
            data: { symbol: marketId, resolution: 'D', from: stamp - 3600 * 24 * 30, to: stamp },
            url: '/chartdata/history',
            success: function (data) {
                var dataMain = JSON.parse(eval('(' + data + ')'));
                var totalArr = [];
                for (var i = 0; i < dataMain.t.length; i++) {
                    var itemArr = [];
                    itemArr.push(dataMain.t[i]);
                    itemArr.push(parseFloat(dataMain.c[i]));

                    totalArr.push(itemArr);
                }
                chartDataJson[marketId] = totalArr;

                if (bool) {
                    //初始化图表
                    $('#chartLine').closeMask();
                    areaChart(chartDataJson[marketId]);
                }
            }
        });
    }

    //公共图表参数
    var options = {
        colors: ['#329fd9', '#ffba14'], //颜色列表
        title: {
            text: null //标题设置为空
        },
        credits: {
            enabled: false //版权隐藏
        }

        //排行榜小图表方法（参数DomID、数据）
    };function areaChart(data) {
        var pieOptions = {
            chart: {
                spacing: 0
            },
            credits: {
                enabled: false //版权隐藏
            },
            rangeSelector: {
                selected: 0,
                inputEnabled: false,
                enabled: false
            },
            xAxis: {
                type: 'datetime',
                tickWidth: 0,
                labels: {
                    formatter: function () {
                        return Highcharts.dateFormat('%m-%d', this.value * 1000);
                    }
                }
            },
            yAxis: {
                labels: {
                    enabled: false
                },
                title: {
                    text: ''
                }
            },
            tooltip: {
                valueDecimals: 2,
                crosshairs: [true, true],
                formatter: function () {
                    var a, b, color, s;
                    a = '报价';
                    s = Highcharts.dateFormat('%Y-%m-%d', this.x * 1000) + '<br>' + a + ' <span style="color:' + color + '">' + this.y + '</span>';
                    return s;
                }

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
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [[0, options.colors[0]], [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]]
                    },
                    marker: {
                        radius: 0
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            series: [{
                type: 'area',
                name: '',
                data: data
            }]
        };
        var t = $.extend({}, pieOptions, options);
        var chart = Highcharts.chart('chartLine', t);
    }
});