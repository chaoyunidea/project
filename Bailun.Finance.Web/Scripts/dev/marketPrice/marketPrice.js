require([js.newss, js.controlBar,js.calculatePrice,js.calendar], function (news, controlBar,calc,calendar) {

    news.Fn.Init();
    controlBar.controlFn();
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
     
    var chartObjGroup;
            
    

    //排行榜小图表方法（参数DomID、数据）
    function areaChart(id, data) {        
        //比较获取最小最大值
        var minRate = Math.min.apply(Math, data);
        var maxRate = Math.max.apply(Math, data);
        var chartPlotLineArr = [];
        var pieOptions = {        
            chart: {
                spacing: [5,60,5,0],
                height: 54                                
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
                visible:false

            },
            tooltip: {
                valueDecimals:2,
                crosshairs: [true, true],
                formatter: function () {
                    var a, b, color, s;
                    a = '报价';                
                    s = a + ' <span style="color:' + color + '">' + this.y + '</span>';
                    return s;
                }
            
            },
            yAxis: {
                plotLines: [{
                    value: minRate,
                    color: '#14b971',
                    dashStyle: 'dash',
                    width: 1,
                    label: {
                        text: minRate,
                        align: "right",
                        textAlign: "left",
                        verticalAlign: "middle",
                        style: {
                            color: '#14b971'
                        },
                        x: -1,
                        y:3
                    }
                }, {
                    value: maxRate,
                    color: '#ff1a30',
                    dashStyle: 'dash',
                    width: 1,
                    label: {
                        text: maxRate,
                        align: "right",
                        textAlign: "left",
                        verticalAlign: "middle",                        
                        style: {
                            color: '#ff1a30'
                        },
                        x: -1,
                        y:3
                    }
                }],
                labels: {
                    enabled:false
                },
                gridLineWidth: 0

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
                            [0, Highcharts.Color(options.colors[0]).setOpacity(0.5).get('rgba')],
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
                data: data,
                dataLabels: {
                    crop: false,
                    overflow:'none'
                }
            }]
        };
        var t = $.extend({}, pieOptions, options);
        var chart = Highcharts.StockChart(id, t);
        chartPlotLineArr.push(chart);
        chartPlotLineArr.push(t.yAxis[0].plotLines);
        chartObjGroup.push(chartPlotLineArr);
    }

    var initData;
    //标记线颜色切换
    function plotLinesChange() {
        for (var i = 0; i < chartObjGroup.length; i++) {
            var midVal = chartObjGroup[i][1][0].color;
            chartObjGroup[i][1][0].color = chartObjGroup[i][1][1].color;
            chartObjGroup[i][1][0].label.style.color = chartObjGroup[i][1][1].color;
            chartObjGroup[i][1][1].color = midVal;
            chartObjGroup[i][1][1].label.style.color = midVal;
            chartObjGroup[i][0].yAxis[0].update({ plotLines: chartObjGroup[i][1] });
        }
    }

    $('.change-color').on('click', function () {       
        plotLinesChange();
    })
 
    var category = $('.category').val();
    $(function () {
        //for (var i = 0; i < $('.price .content li').length; i++) {
        //    areaChart('chartLine' + i, chartData);
        //}

        //正在加载
        //$('.left .price .content').openMask({ image: '/Images/public/loading.gif', isMask: false });

        
        var requestQueue = { 'forex': 1, 'goods': 2, 'indices': 3, 'bonds': 4, 'cfdindices': 5, 'ashares': 6, 'hkstock': 7, 'usstock': 8, 'bitcoin': 9, 'stockIndex': 10, 'metals' : 11  };
        var QueueId = requestQueue[category];
        var total = '', pageSize = '',totalPage='';

        //获取列表数据
        getPriceList(0,QueueId, 1, 20, category);
    
    })

    function signalrFn() {
        //服务器即时通信
        signalr({
            hubConnection: 'https://ga.fxdata.fx110.com/signalr',
            connHunProxyOn: 'QuoteTimelyReceive',
            createHubProxy: 'QuoteHub',
            invokes:' ',
            cb: function (data) {
                //console.log(data);
                var dataMain = eval('(' + data + ')');
                var initDataArr = eval('(' + initData + ')');
           
                for (var j = 0; j < vm.priceList.length; j++) {
                    if (vm.priceList[j]['MarketId'] == dataMain['m']) {
                        vm.priceList[j].Ask = dataMain['a'];
                        vm.priceList[j].Bid = dataMain['b'];                                     
                    }                    
                }                                      
            }
        });
    }



    //获取列表数据
    function getPriceList(type,QueueId, Pageindex, Pagesize, category) {
        $.ajax({
            type: 'post',
            data: { product: QueueId, pageindex: Pageindex, pagesize: Pagesize },
            url: '/marketprice/QueryPlatByProductMethod',
            success: function (data) {
                if (data.code == 0) {
                    initData = data.bodyMessage;
                    priceSymbolArr = [];
                    var dataMain = eval('(' + data.bodyMessage + ')')
                    total = data.Total;
                    pageSize = data.PageSize;
                    totalPage = Math.ceil(total / pageSize);
                    if (type == 0) {
                        //分页插件初始化
                        kkpagerFn(QueueId, 1, totalPage, category);
                    }
                    //关闭正在加载
                    $('.left .price .content').closeMask();
                    $('#' + category).empty().append(loopRender(dataMain));
                    chartObjGroup = [];
                    for (var i = 0; i < dataMain.length; i++) {
                        var itemArr = [];
                        getPriceItemData(dataMain[i]['MarketId']);
                        priceSymbolArr.push(dataMain[i]['Code']);
                    }

                    //开启即时通讯
                    $('#websocket').attr('src', '/Static/Websocket/Forex.html' + '?v=' + Date.parse(new Date()));
                    
                }
            }
        })
    }

    function loopRender(data) {
        var str = '';
        switch (category) {
            case 'indices': case 'bonds':case 'stockIndex':case 'goods'://股指
                for (var i = 0; i < data.length; i++) {
                    str += indicesListRender(data[i]);
                }
                break;
            case 'bitcoin':
                for (var i = 0; i < data.length; i++) {
                    str += bitListRender(data[i]);
                }
                break;
            default://一般
                for (var i = 0; i < data.length; i++) {
                    str += priceListRender(data[i]);
                }
                break;
        }       
        return str;
    }

    //实时更新数据
    refreshDataFn = function(data) {
        if ($('[data-code="' + data.Code + '"]').length) {
            $('[data-code="' + data.Code + '"] > a .data-area').replaceWith(refreshListRender(data));
        }        
    }

    //即时更新渲染
    function refreshListRender(data) {
        var str = '';
        var ocStr = '';
        var calcVal = calc.calculateUpDown(data);  
        str += '<div class="data-area">'
                    + '<div class="total ' + (priceStatus(calcVal.priceExchange)) + '">'
                    + '<div class="big"><em>' + data.CurrentPrice + '</em>'
                    + '</div><div class="small"><i></i><em>' + calcVal.priceExchange + '</em><em>('
                    + calcVal.priceLimit + ')</em></div></div>'
                    + '<dl class="param">'
                    + ((category == 'forex' || category == 'metals') ? 
                    ('<dd><h5>昨收</h5><p>' + data.ClosePrice + '</p></dd>'
                    + '<dd><h5>今开</h5><p>' + data.OpenPrice + '</p></dd>')
                    : '')
                    + '<dd><h5>最高</h5><p>' + data.HighPrice + '</p></dd>'
                    + '<dd><h5>最低</h5><p>' + data.LowPrice + '</p></dd>'
                    + '</dl>'
                    + '</div>';
        return str;
    }

    //页面渲染
    function priceListRender(data) {
        var str = '';
        var calcVal = calc.calculateUpDown(data);
            str += '<li data-code="' + data.Code + '">'
                + '<a href="/marketprice/chart/' + data.MarketId + '" target="_blank">'
                + '<div class="inside clearfix"><div class="f-l"><div class="name"><h2>' + data.Cn_Name + '</h2><p>' + data.En_Name + '</p></div>'
                + '<div class="data-area">'
                + '<div class="total ' + (priceStatus(calcVal.priceExchange)) + '">'
                + '<div class="big"><em>' + data.CurrentPrice + '</em>'
                + '</div><div class="small"><i></i><em>' + calcVal.priceExchange + '</em><em>('
                + calcVal.priceLimit + ')</em></div></div>'
                + '<dl class="param">'
                + '<dd><h5>昨收</h5><p>' + data.ClosePrice + '</p></dd>'
                + '<dd><h5>今开</h5><p>' + data.OpenPrice + '</p></dd>'
                + '<dd><h5>最高</h5><p>' + data.HighPrice + '</p></dd>'
                + '<dd><h5>最低</h5><p>' + data.LowPrice + '</p></dd>'
                + '</dl></div>'
                + '</div>'
                + '<div class="chart" id="chartLine' + data.MarketId + '">'
                + '</div>'
                + '</div></a></li>';                                                                  
        return str;
    }

    //涨跌状态
    function priceStatus(val) {
        var floatVal = parseFloat(val);
        var status = floatVal > 0 && 'up' || floatVal < 0 && 'down' || floatVal == 0 && 'none';
        return status;
    }

    //股指债券渲染
    function indicesListRender(data) {
        var str = '';
        var calcVal = calc.calculateUpDown(data);
        str += '<li data-code="' + data.Code + '">'
            + '<a href="/marketprice/chart/' + data.MarketId + '" target="_blank">'
            + '<div class="inside clearfix"><div class="f-l"><div class="name"><h2>' + data.Cn_Name + '</h2><p>' + data.En_Name + '</p></div>'
            + '<div class="data-area">'
            + '<div class="total ' + priceStatus(calcVal.priceExchange) + '">'
            + '<div class="big"><em>' + (data.CurrentPrice == '0' ? '0.000' : data.CurrentPrice) + '</em>'
            + '</div><div class="small"><i></i><em>' + (calcVal.priceExchange ? calcVal.priceExchange : '0.00%') + '</em><em>('
            + (calcVal.priceLimit ? calcVal.priceLimit : '0.000') + ')</em></div></div>'
            + '<dl class="param">'
            + '<dd><h5>最高</h5><p>' + (data.HighPrice == '0' ? '0.000' : data.HighPrice) + '</p></dd>'
            + '<dd><h5>最低</h5><p>' + (data.LowPrice == '0' ? '0.000' : data.LowPrice) + '</p></dd>'
            + '</dl></div>'
            + '</div>'
            + '<div class="chart" id="chartLine' + data.MarketId + '">'
            + '</div>'
            + '</div></a></li>';
        return str;        
    }

    //比特币渲染
    function bitListRender(data) {
        var str = '';
        var calcVal = calc.calculateUpDown(data);
        str += '<li data-code="' + data.Code + '" class="bit-list">'
            + '<a href="/marketprice/chart/' + data.MarketId + '" target="_blank">'
            + '<div class="inside clearfix"><div class="f-l"><div class="name"><h2>' + data.Cn_Name + '</h2><p>' + data.En_Name + '</p></div>'
            + '<p class="exchange">' + data.Exchange + '</p>'
            + '<div class="data-area">'
            + '<div class="total ' + priceStatus(calcVal.priceExchange) + '">'
            + '<div class="big"><em>' + (data.CurrentPrice == '0' ? '0.000' : data.CurrentPrice) + '</em>'
            + '</div><div class="small"><i></i><em>' + (calcVal.priceExchange ? calcVal.priceExchange : '0.00%') + '</em><em>('
            + (calcVal.priceLimit ? calcVal.priceLimit : '0.000') + ')</em></div></div>'
            + '<dl class="param">'
            + '<dd><h5>最高</h5><p>' + data.HighPrice + '</p></dd>'
            + '<dd><h5>最低</h5><p>' + data.LowPrice + '</p></dd>'
            + '</dl></div>'
            + '</div>'
            + '<div class="chart" id="chartLine' + data.MarketId + '">'
            + '</div>'
            + '</div></a></li>';
        return str;
    }

    //单独获取外汇报价数据
    function getPriceItemData(marketId) {
        $.ajax({
            type: 'post',
            data: { marketid: marketId },
            url: '/marketprice/GetMinutePriceMethod',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    dataMain = dataMain.allMap(function (a) {
                        return parseFloat(a);
                    })
                    areaChart('chartLine' + marketId, dataMain);
                }
            }
        })
    }

    //数据翻页
    function kkpagerFn(QueueId, pageIndex, totalPages, category) {
        search_list = window.kkpagerNews.deepCopy();        
        search_list.generPageHtml({
            type: "search_list",
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
            click: function (n, config) {
                this.selectPage(n, config);
                getPriceList(1,QueueId, n, 20, category);

            }
        }, true);
    }


  

})
