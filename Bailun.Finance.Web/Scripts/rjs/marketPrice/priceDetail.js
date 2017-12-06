require([js.newss, js.controlBar], function (news, controlBar) {

    news.Fn.Init();
    controlBar.controlFn();
//$(function () {
    var chartData;

    //初始化高度适应屏幕
    $('#highcharts').height($(window).height() - ($('.header').height() + $('#footer').height() + $('.market .data').outerHeight() + $('.market .switch').outerHeight()) - 40);

    //图表类型切换
    $('.chart-type').on('click', function () {
        var chartType = $(this).parent().attr('data-type');
        switch (chartType) {
            case 'area':
                $(this).parent().attr('data-type', 'candlestick').addClass('candle');
                chartAction(chartData, 'candlestick');
                break;
            case 'candlestick':
                $(this).parent().attr('data-type', 'area').removeClass('candle');
                chartAction(chartData, 'area');
                break;
        }                
    })
      

    //滚动条
    //jsScroll('scroll', 4, 'divScrollBar');
    
    //时间间隔选择
    $('.time-search li').on('click', function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active');
            chartGetData(parseInt($(this).attr('data-time')), $(this).parents('.switch').attr('data-type'));
        }
    })

    //初始化信息
    getDetailData(marketId);


    vm = avalon.define({
        $id: 'price',
        detailData: {}
        
    })
    //初始化数据
    function getDetailData(id) {
        $.ajax({
            type: 'post',
            url: '/MarketPrice/GerRealDetailForWeb',
            data: { marketDetailId: id},
            success: function (data) {
                if (data.code == 0) {
                    dataMain = eval('(' + data.bodyMessage + ')');
                    vm.detailData = dataMain;
                    chartGetData(10, 'area');
                }
            }
        })
    }

    //获取chart图表数据
    function chartGetData(historyType, chartType) {
        $.ajax({
            type: 'post',
            data: { marketdetailsid: marketId, datetime: '', leftOrRight: 0, historytype: historyType },
            url: '/marketprice/getquotehistory',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    var totalArr = [];
                    for (var i = 0; i < dataMain.length; i++) {
                        var itemArr = [];
                        delete dataMain[i].M;

                        for (var j in dataMain[i]) {
                            var valueStr = dataMain[i][j];
                            if (j == 'D') {
                                itemArr.push(Date.parse(new Date(valueStr.substring(0, 4) + '/' + valueStr.substring(4, 6) + '/' + valueStr.substring(6))));
                            } else {
                                itemArr.push(parseFloat(dataMain[i][j]));
                            }
                        }
                        totalArr.push(itemArr);
                    }
                    chartData = totalArr.reverse();
                    chartAction(chartData, chartType);                    
                }
            }
        })
            
       
    }

    function chartAction(data, type) {

        //公共图表参数
        var options = {
            colors: ['#329fd9', '#ffba14'],//颜色列表
            title: {
                text: null //标题设置为空
            },
            credits: {
                enabled: false //版权隐藏
            }
        }

        //折线图表参数配置
        var lineChartConfig = {            
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
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                },
                tickWidth: 0

            },
            tooltip: {                
                formatter:function(){
                    var str = '<p class="tooltip-title">' + Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) + '</p><dl class="tooltip">'
                            + '<dd>报价 ' + this.y +'</dd>'
                            + '</dl>';                    
                    return str;
                },
                shared: true,
                crosshairs: [true, true],
                useHTML: true,
                borderWidth: 1,
                borderColor: '#00aded',
                borderRadius: 6,
                backgroundColor: 'rgba(255,255,255,.8)',
                valueDecimals: 2
            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineWidth: 0,
                opposite: false
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
                        stops: [
                            [0, options.colors[0]],
                            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
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

      

        //蜡烛图表参数
        var barChartConfig = {
            rangeSelector: {
                selected: 0,
                inputEnabled: false,
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            tooltip: {
                shared: true,
                useHTML: true,
                //headerFormat: '<p class="tooltip-title">' + Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) + '</p><dl class="tooltip">',
                //pointFormat: '<dd>最高价 {point.high}</dd><dd>最低价 {point.low}</dd><dd>昨收 {point.y}</dd><dd>买价 {point.close}</dd><dd>卖价 {point.close}</dd>',
                //footerFormat: '</dl>',
                formatter: function () {
                    var str = '<p class="tooltip-title">' + Highcharts.dateFormat('%Y-%m-%d %H:%M', this.x) + '</p><dl class="tooltip">'
                            + '<dd>最高价 ' + this.points['0'].point.high + '</dd><dd>最低价 ' + this.points['0'].point.low + '</dd><dd>昨收 ' + this.points['0'].point.close + '</dd><dd>今开 ' + this.points['0'].point.open + '</dd>'
                            + '</dl>';
                    return str;
                },
                valueDecimals: 2,
                borderWidth: 1,
                borderColor: '#00aded',
                borderRadius: 6,
                backgroundColor: 'rgba(255,255,255,.8)',
                crosshairs: [true, true]
            },
            plotOptions: {
                candlestick: {//红涨绿跌
                    color: '#14b971',
                    upColor: '#ff4a68',
                    borderWidth: 1,
                    lineColor: '#14b971',
                    upLineColor: '#ff4a68'
                }
                
            },
            xAxis: {//自定义X轴显示格式
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                },
                tickWidth: 0
            },
            yAxis: {
                title: {
                    text: ''
                },
                gridLineWidth: 0,
                opposite: false,
                tickWidth: 0

            },
            navigator: {
                enabled: false
            },
            series: [{
                type: 'candlestick',
                name: '',
                data: data
            }]
        };

        var lineChart = $.extend({}, lineChartConfig, options);
        var barChart = $.extend({}, barChartConfig, options);

        switch (type) {
            case 'area':
                $('#highcharts').highcharts('StockChart', lineChart);
                break;
            case 'candlestick':
                $('#highcharts').highcharts('StockChart', barChart);
                break;
            default:
                break;
        }
    }

});

