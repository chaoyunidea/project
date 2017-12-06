require([js.newss, js.controlBar], function (news, controlBar) {
    //news.Fn.Init();
    controlBar.controlFn();

    var productJson = { 6: ['沪深', 'ashares'], 7: ['港股', 'hkstock'], 8: ['美股', 'usstock'] };
    var plateTypeArr = ['行业版块', '概念版块', '特有版块'];

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




    //排行榜小图表方法（参数DomID、数据）
    function areaChart(id, data) {
        var pieOptions = {
            chart: {
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
                    s = a + ' <span style="color:' + color + '">$' + this.y + '</span>';
                    return s;
                }

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
                data: data
            }]
        };
        var t = $.extend({}, pieOptions, options);
        var chart = $('#' + id).highcharts('StockChart', t);

    }



    function breadRender() {
        var str = '<span><a href="/marketprice/index">市场报价</a> > </span> <span><a href="/marketprice/' + productJson[productId][1]
            + '">' + productJson[productId][0] + '</a> </span>'
            //+ '<span><a>' + plateTypeArr[parseInt(plateType) + 1] + '</a></span>'
            + '<span class="plate-select"><img src="/Images/marketPrice/slide-down.png" />'
            + '<em>' + '</em>'
            + '<div class="set-box">'
            + '<ul></ul>'
            + '<b class="shape"></b>'
            + '</div></span>';
        $('.left .bread').append(str);
        getQueryPlateName(plateId);
        getPlateList(productId);
    }

    breadRender();
    requestPlateDataFn(1);

    //收市倒计时显示隐藏
    $('.bread .plate-select').on('click', function (event) {
        var targetEl = $(event.target);
        if (targetEl.parents().hasClass('set-box')) {
            return;
        }
        $(this).toggleClass('active');
        event.stopPropagation();
    })

    //点击页面其他位置隐藏设置
    $(document).on('click', function (event) {
        var targetEl = $(event.target);
        if (!targetEl.parents().hasClass('set-box') && $('.plate-select').hasClass('active')) {
            $('.plate-select').removeClass('active');
        }
    })

    function getQueryPlateName(id) {
        $.ajax({
            type: 'post',
            data: { plateId: id },
            url: '/MarketPrice/QueryPlateName',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    $('.plate-select em').text(dataMain.PlateName);
                }
            }
        })
    }

    //获取品种种类列表
    function getPlateList(id) {
        $.ajax({
            type: 'post',
            data: { product: productId, pagesize: 8, pageindex: 1, ClassificationType: 1 },
            url: '/MarketPrice/QueryPlatInfoByProduct',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    $('.plate-select .set-box ul').append(renderPlateList(dataMain));
                    
                }
            }
        })
    }

    //生成品种种类列表
    function renderPlateList(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            str += '<li><a href="/marketprice/stocklist/' + data[i].ProductType + '-' + data[i].AutoId + '">' + data[i].PlateName + '</a></li>';
        }
        if (data.length >= 8) {
            str += '<li><a class="more" href="/marketprice/platelist/' + productId + '">更多</a></li>';
        }
        return str;
    }

    //获取品种列表数据
    function requestPlateDataFn(pageIndex) {
        $.ajax({
            type: 'post',
            data: { plate: plateId, pageindex: pageIndex, pagesize: 20 },
            url: '/MarketPrice/QueryMarketByPlate',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    var totalPage = Math.ceil(data.Total / data.PageSize);
                    $('#stockList').html(renderPlateData(dataMain));
                    
                    kkpagerFn(pageIndex, totalPage);
                    for (var i = 0; i < dataMain.length; i++) {
                        getPriceItemData(dataMain[i]['MarketId']);
                    }
                }
            }
        })
    }

    //生成品种列表数据
    function renderPlateData(data){
        var str = '';
        for (var i = 0; i < data.length; i++) {
            str += '<li>'
                + '<a href="/marketprice/StockDetail/' + productId +'-'+ plateId +'-'+ data[i].MarketId + '" target="_blank">'
                + '<div class="inside clearfix">'
                + '<div class="f-l">'
                + '<h2 class="name">' + data[i].Market_CnName + '</h2>'
                + '<div class="code">'
                + '<em>' + data[i].Market_Code + '</em>'
                + '</div>'
                + '<div class="total ' + (data[i].CurrentPrice - data[i].ClosePrice > 0 ? 'up' : 'down') + '">'
                + '<i></i>'
                + '<em>' + toFixeds(parseFloat(data[i].CurrentPrice), 2) + '</em>'
                + '</div>'
                + '<span></span>'
                + '<dl class="param ' + (data[i].CurrentPrice - data[i].ClosePrice > 0 ? 'up' : 'down') + '">'
                + '<dd><h5>涨跌额</h5><p class="color">' + toFixeds(parseFloat(data[i].CurrentPrice - data[i].ClosePrice), 2) + '</p></dd>'
                + '<dd><h5>涨跌幅</h5><p class="color">' + (data[i].ClosePrice <= 0 ? toFixeds(parseFloat(data[i].ClosePrice), 2) : toFixeds((parseFloat(data[i].CurrentPrice - data[i].ClosePrice) / data[i].ClosePrice * 100), 2)) + '%</p></dd>'
                + '<dd><h5>昨收</h5><p>' + toFixeds(parseFloat(data[i].ClosePrice), 2) + '</p></dd>'
                + '<dd><h5>今开</h5><p>' + toFixeds(parseFloat(data[i].OpenPrice), 2) + '</p></dd>'
                + '<dd><h5>最高</h5><p>' + toFixeds(parseFloat(data[i].HighPrice), 2) + '</p></dd>'
                + '<dd><h5>最低</h5><p>' + toFixeds(parseFloat(data[i].LowPrice), 2) + '</p></dd>'
                + '<dd><h5>成交量/手</h5><p> ' + (data[i].TotalVolume == null ? '---' : parseInt(data[i].TotalVolume)) + '</p></dd>'
                + '<dd><h5>成交额/万</h5><p>' + (data[i].TotalVolume == null ? '---' : parseInt(data[i].TotalVolumePrice)) + '</p></dd>'
                + '</dl>'
                + '</div>'
                + '<div class="chart" id="chartLine' + data[i].MarketId + '"></div>'
                + '</div>'
                + '</a>'
                + '</li>';
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
                    dataMain = dataMain.map(function (a) {
                        return parseFloat(a);
                    })
                    areaChart('chartLine' + marketId, dataMain);
                }
            }
        })
    }

    //数据翻页
    function kkpagerFn(pageIndex, totalPages) {
        search_list = window.kkpagerNews.deepCopy();
        search_list.generPageHtml({
            type: "search_list",
            pagerid: "kkpager",
            total: totalPages,
            pno: pageIndex,
            isShowCurrPage: false,
            //isShowLastPageBtn: true,
            isGoPage: false,
            lang: {
                firstPageText: "<<",
                lastPageText: ">>",
                prePageText: "<",
                nextPageText: ">"
            },
            mode: 'click',
            click: function (n,config) {
                this.selectPage(n, config);
                requestPlateDataFn(n);

            }
        }, true);
    }
   

})