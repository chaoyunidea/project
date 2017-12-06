require([js.newss, js.controlBar], function (news, controlBar) {
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

    requestPlateFn(8, 1);
    requestPlateFn(10, 3);

    //获取板块数据
    function requestPlateFn(pagesize, plateType) {
        $.ajax({
            type: 'post',
            data: { product: productId, pageindex: 1, pagesize: pagesize, ClassificationType: plateType },
            url: '/MarketPrice/QueryPlatInfoByProduct',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    switch (plateType) {
                        case 1:
                            for (var i = 0; i < dataMain.length; i++) {
                                getIndustryList(dataMain[i]);
                            }
                            break;
                        case 3:
                            if (dataMain.length) {
                                for (var i = 0; i < dataMain.length; i++) {
                                    getSpecialList(dataMain[i]);
                                }
                            }
                    }

                }
            }
        })
    }

    //获取行业板块列表
    function getIndustryList(obj) {
        $.ajax({
            type: 'post',
            data: { plate: obj.AutoId, pageindex: 1, pagesize: 1 },
            url: '/MarketPrice/QueryMarketByPlate',
            success: function (data) {
                if (data.code == 0) {
                    var industryList = eval('(' + data.bodyMessage + ')')[0];
                    industryList.PlateName = obj.PlateName;
                    renderIndustryList(industryList);
                    getPriceItemData(industryList.MarketId);
                }
            }
        })
    }

    //生成行业品种列表
    function renderIndustryList(data) {
        var str = '';
        str += '<li>'
                + '<a href="/marketprice/stockdetail/' + productId +'-'+data.MarketId + '">'
                + '<div class="params ' + (data.CurrentPrice - data.ClosePrice > 0 ? 'up' : 'down') + '">'
                + '<h5 class="name">' + data.PlateName + '</h5>'
                + '<h3 class="current">' + toFixeds(parseFloat(data.CurrentPrice), 2) + '<i></i></h3>'
                + '<p class="stock-name">' + data.Market_CnName + '</p>'
                + '<p class="updowns"><em class="percent">' + (data.ClosePrice <= 0 ? toFixeds(parseFloat(data.ClosePrice), 2) : toFixeds((parseFloat(data.CurrentPrice - data.ClosePrice) / data.ClosePrice * 100), 2)) + '%</em><em>'
                + toFixeds(parseFloat((data.CurrentPrice - data.ClosePrice)), 2) + '</em></p>'
                + '</div>'
                + '<div class="chart" id="chartLine' + data.MarketId + '">'
                + '</div>'
                + '</a>'
                + '</li>';
        $('#industryData').append(str);
    }

    //行业板块K线图数据获取
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

    //获取特有板块列表
    function getSpecialList(obj) {
        $.ajax({
            type: 'post',
            data: { plate: obj.AutoId, pageindex: 1, pagesize: 10 },
            url: '/MarketPrice/QueryMarketByPlate',
            success: function (data) {
                if (data.code == 0) {
                    var specialList = eval('(' + data.bodyMessage + ')');
                    if (specialList.length) {
                        renderSpecialList(specialList, obj.PlateName, obj.AutoId);
                    }
                }
            }
        })
    }

    //生成特有板块
    function renderSpecialList(data, plateName, autoId) {
        var str = '<div class="special-box">'
                + '<div class="heading clearfix">'
                + '<h3>' + plateName + '</h3>'
                + '<span><a href="/marketprice/stocklist/' +productId + '-' + autoId + '">更多></a></span>'
                + '</div>'
                + '<table>'
                + '<thead>'
                + '<tr><th>代码</th><th>名称</th><th>最新价</th><th>涨跌幅</th><th>涨跌额</th></tr>'
                + '</thead>'
                + '<tbody>';
        for (var i = 0; i < data.length; i++) {
            str += '<tr class="' + (data[i].CurrentPrice - data[i].ClosePrice > 0 ? 'up' : 'down') + '"><td>' + data[i].Market_Code + '</td><td>'
                + data[i].Market_CnName + '</td><td class="color">' + toFixeds(parseFloat(data[i].CurrentPrice), 2)
                + '</td><td class="color">' + toFixeds(parseFloat((data[i].CurrentPrice - data[i].ClosePrice)), 2) + '</td><td class="color">'
                + (data[i].ClosePrice <= 0 ? toFixeds(parseFloat(data[i].ClosePrice), 2) : toFixeds((parseFloat(data[i].CurrentPrice - data[i].ClosePrice) / data[i].ClosePrice * 100), 2)) + '%</td></tr>';
        }
        str += '</tbody></table></div>';
        $('.special-group').append(str);
    }

})