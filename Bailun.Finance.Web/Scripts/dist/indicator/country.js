(function () {
    var indicatorList = [];
    var indicatorIndex = 1;
    var chartTime = [];
    var tabChartData = [];

    $('.main .table-group').openMask({ image: '/Images/public/loading.gif', isMask: false }).css({ 'height': 600 });
    getIndicatorMenu();
    getBannerList();

    //切换指标项目
    $('body').on('click', '.item-tab dl dd', function () {
        if (!$(this).hasClass('active')) {
            if (indicatorIdArr.indexOf($(this).data('id')) > -1) {
                tabChartLoop(tabChartDataGroup[$(this).data('id')]);
            }
            $(this).addClass('active').siblings().removeClass('active');
            $('.table-group .table-item[data-id="' + $(this).data('id') + '"]').addClass('active').siblings().removeClass('active');
        }
    });

    //获取banner指标列表
    function getBannerList() {
        $.ajax({
            type: 'post',
            data: {},
            url: '/indicator/CountryBannerList',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    renderBannerList(dataMain);
                }
            }
        });
    }

    //渲染banner列表
    function renderBannerList(data) {
        for (var i = 0; i < data.length; i++) {
            var str = '';
            var chartData = data[i].nvalues;
            str += '<li class="' + (chartData[0] > chartData[1] ? 'up' : 'down') + '">' + '<a href="/indicator/detail/' + data[i].id + '" target="_blank">' + '<h5>' + data[i].name + '</h5>' + '<h3>' + chartData[0] + '</h3>' + '<div class="chart" id="chartLine' + i + '" style="width:155px;height:40px;">' + '</div></a></li>';
            $('.banner .data-group ul').append(str);
            bannerChart('chartLine' + i, chartData.reverse());
        }
    }

    //获取指标目录
    function getIndicatorMenu() {
        $.ajax({
            type: 'post',
            data: { country: countryId },
            url: '/indicator/IndicatorSubitem',
            success: function (data) {
                if (data.code == 0) {
                    indicatorList = eval('(' + data.bodyMessage + ')');
                    renderTabTitle(indicatorList);
                    getIndicatorData();
                }
            }
        });
    }

    //渲染切换头部
    function renderTabTitle(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            str += '<dd data-id="' + data[i].main_indicator.id + '" class="' + (i == 0 ? 'active' : '') + '">' + data[i].main_indicator.name + '</dd>';
        }
        $('.item-tab dl').html(str);
    }
    var tabChartDataGroup = {};
    var indicatorIdArr = [];
    //请求各列表项数据
    function getIndicatorData() {
        $.ajax({
            type: 'post',
            data: { country: countryId, indicator: indicatorIndex },
            url: '/indicator/requestIndicatorItem',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    tabChartData = [];
                    renderTableData(dataMain, indicatorIndex);

                    chartTime = dataMain.fields.slice(2);

                    indicatorIndex !== 1 && indicatorIdArr.push(indicatorIndex);
                    tabChartDataGroup[indicatorIndex] = tabChartData;

                    //生成图表
                    indicatorIndex == 1 && tabChartLoop(tabChartData);
                }
            }
        }).always(function () {
            indicatorIndex == 1 && $('.main .table-group').closeMask().css({ 'height': 'auto' });
            indicatorIndex++;
            indicatorIndex < 11 && getIndicatorData();
        });
    }

    function tabChartLoop(data) {
        for (var i = 0; i < data.length; i++) {
            tabChartAction(data[i]);
        }
    }

    //渲染表格数据
    function renderTableData(data, id) {
        var indicatorMenu = [];
        var str = '';
        //获取指标详情
        for (var i = 0; i < indicatorList.length; i++) {
            if (indicatorList[i].main_indicator.id == id) {
                indicatorMenu = indicatorList[i].itemsub;
                break;
            }
        }

        str += '<table class="table-item ' + (id == 1 ? 'active' : '') + '" data-id="' + id + '">';
        str += '<thead><tr><th class="type-column">全部指标 </th>';
        //头部
        for (var i = 0; i < data.fields.length; i++) {
            if (i > 1) {
                str += '<th>' + fomatterDate(data.fields[i]) + '</th>';
            }
        }

        str += '<th class="chart-column"></th></thead><tbody>';

        //主体
        for (var i = 0; i < indicatorMenu.length; i++) {
            var detailId = indicatorMenu[i].Codes;
            var chartDataItem = new Object();
            chartDataItem.code = detailId;
            chartDataItem.chartData = data.items[i];
            tabChartData.push(chartDataItem);
            str += '<tr><td><a href="/indicator/detail/' + detailId + '">' + indicatorMenu[i].Names + '(' + indicatorMenu[i].Units + ')</a></td>';
            for (var j = 0; j < data.items[i].length; j++) {
                if (j > 1) {
                    str += '<td class="' + indicatorStatus(parseFloat(data.items[i][j]), parseFloat(data.items[i][j - 1])) + '"><a href="/indicator/detail/' + detailId + '">' + (data.items[i][j] == '' ? '---' : data.items[i][j]) + '</a></td>';
                }
            }
            str += '<td class="chart" id="chart' + detailId + '" style="width:150px;height:100%;"></td></tr>';
        }

        str += '</tbody></table>';

        $('.table-group').append(str);
    }

    function indicatorStatus(arg1, arg2) {
        var str = '';
        str = arg1 > 0 && arg1 > arg2 && 'up' || arg1 < 0 && 'down' || 'gray';
        return str;
    }

    //时间格式
    function fomatterDate(date) {
        var arr = date.split('-');
        return arr[0].slice(2) + '/' + arr[1];
    }

    //中美数据对比图表生成
    function tabChartAction(data) {
        data.chartTime = [];
        chartDataTransform(data);
        //公共图表参数
        var options = {
            colors: ['#d7eeff', '#faa7aa'], //颜色列表
            title: {
                text: null //标题设置为空
            },
            credits: {
                enabled: false //版权隐藏
            }
        };
        var chartParam = {
            exporting: {
                enabled: false
            },
            chart: {
                type: 'area',
                spacing: 0
            },
            title: {
                text: ''
            },
            xAxis: {
                visible: false,
                categories: data.chartTime,
                labels: {
                    enabled: false
                },
                title: {
                    enabled: false
                }
            },
            yAxis: {
                enabled: false,
                labels: {
                    enabled: false
                },
                title: {
                    enabled: false
                },
                gridLineWidth: 0
            },
            credits: {
                enabled: false
            },
            tooltip: {
                shared: true,
                useHTML: true,
                formatter: function () {
                    return '<table><tr><td style="padding:0">' + this.x + ':</td><td style="padding:0"><b>' + this.y + '</b></td></tr>';
                }
            },
            plotOptions: {
                area: {
                    fillColor: '#d7eeff',
                    lineColor: '#6ebbf3',
                    lineWidth: 1,
                    marker: {
                        lineColor: '#98cff7',
                        lineWidth: 1,
                        fillColor: '#fff',
                        radius: 2
                    },
                    threshold: -10
                },
                series: {
                    dataLabels: {
                        enabled: false,
                        color: '#000'
                        //format: '{point.y:.1f}%'
                    }
                }
            },
            legend: {
                enabled: false
            },
            series: [{
                name: 'all',
                data: data.chartData
            }]
        };
        var chart = Highcharts.chart('chart' + data.code, $.extend({}, chartParam, options));
        //初始化图表        
    }

    //图表数据处理
    function chartDataTransform(data) {
        var arr = [];
        var newChartData = data.chartData.slice(2);
        for (var i = 0; i < newChartData.length; i++) {
            if (newChartData[i] == '') {
                continue;
            }
            arr.push(parseFloat(newChartData[i]));
            data.chartTime.push(chartTime[i]);
        }
        data.chartData = arr;
    }

    //排行榜小图表方法（参数DomID、数据）
    function bannerChart(id, data) {
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
            }],
            colors: ['#fff', 'red'], //颜色列表
            title: {
                text: null //标题设置为空
            },
            credits: {
                enabled: false //版权隐藏
            }
        };
        var t = pieOptions;
        var chart = Highcharts.chart(id, t);
    }
})();