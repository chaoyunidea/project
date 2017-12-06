(function () {

    var chartIdGroup = [];
    var chartTitleGroup = [];
    //var chartObj;
    var chartDataArr = [];
    var idIndex = 0;
    var chartType = 'line';
    var totalData;
    var updateEnabled = true;
    chartIdGroup.push(itemId);
    chartTitleGroup.push(itemTitle);

    //初始化图表
    getChartData($('#start-time').val(), $('#end-time').val(), 'line');

    //右边栏目录展开隐藏
    $('.field .item-header').on('click', function () {
        if (!$(this).parent().hasClass('active')) {
            $(this).parent().addClass('active').siblings().removeClass('active');
        } else {
            $(this).parent().removeClass('active');
        }
    });

    //新指标跳链接
    $('#switch-indicator').on('click', function () {

        //判断是否选择指标
        if (!$(this).siblings('.indicator').find('dd.selected').length) {
            layer.msg('请选择指标');
            return;
        }

        window.location.href = '/indicator/detail/' + $(this).siblings('.indicator').find('dd.selected').data('id');
    });

    //图表类型切换
    $('.chart-control span').on('click', function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active');
            chartType = $(this).data('type');
            chartAction(totalData);
        }
    });

    //导出图表截图
    $('.shortcut').on('click', function () {
        chartObj.exportChartLocal();
    });

    //选框显示隐藏
    $('.select-box .pick').on('click', function () {

        if ($(this).siblings('dl').find('dd').length <= 0) {
            if ($(this).parent().hasClass('indicator')) {
                layer.msg('请选择国家');
            }
        }
        $('.select').removeClass('active');
        if (!$(this).parent().hasClass('active')) {
            $(this).parent().addClass('active');
        }
    });

    //点击页面其他位置隐藏设置
    $(document).on('click', function (event) {
        var targetEl = $(event.target);
        if (!targetEl.parents().hasClass('select') && $('.select').hasClass('active')) {
            $('.select').removeClass('active');
        }
    });

    //选择选项
    $('body').on('click', '.select dl dd', function () {
        if (!$(this).hasClass('selected')) {
            $(this).parents('.select').removeClass('active').find('.pick em').text($(this).text());
            $(this).addClass('selected').siblings().removeClass('selected');
            $(this).parents('.select').hasClass('country') && getIndicatorList($(this).data('id'), $(this));
        }
    });

    //确定生成图表对比
    $('.compare-select .button').on('click', function () {

        //禁止多次提交
        if (updateEnabled) {
            updateEnabled = false;
        } else {
            return;
        }

        //是否选择选项
        if (!$(this).siblings('.country').find('dd.selected').length) {
            layer.msg('请选择国家');
            updateEnabled = true;
            return;
        }

        if (!$(this).siblings('.indicator').find('dd.selected').length) {
            layer.msg('请选择指标');
            updateEnabled = true;
            return;
        }

        initData();
        chartIdGroup[1] = $(this).siblings('.indicator').find('dd.selected').data('id');
        chartTitleGroup[1] = $('.compare-select .country .pick em').text() + '-' + $('.compare-select .indicator .pick em').text() + '(' + $('.compare-select .indicator dd.selected').data('unit') + ')';

        getChartData($('.time-select li:last').hasClass('active') ? '1910/01/01' : $('#start-time').val(), $('#end-time').val());
    });

    //按年查询图表数据
    $('.year li').on('click', function () {
        //禁止多次提交

        if (!$(this).hasClass('active')) {
            //禁止多次提交
            if (updateEnabled) {
                updateEnabled = false;
            } else {
                return;
            }
            $(this).addClass('active').siblings().removeClass('active');
            var endDate = new Date();
            var startDate = new Date();
            startDate = startDate.setFullYear(startDate.getFullYear() - parseInt($(this).data('year')));
            startDate = Highcharts.dateFormat('%Y/%m/%d', startDate);
            endDate = Highcharts.dateFormat('%Y/%m/%d', endDate);

            if ($(this).data('year') != 0) {
                $('#start-time').val(startDate);
                $('#end-time').val(endDate);
            }

            initData();
            getChartData($(this).data('year') != 0 ? startDate : '1910/01/01', endDate);
        }
    });

    //选择日期查询数据
    $('#select-data').on('click', function () {

        //禁止多次提交
        if (updateEnabled) {
            updateEnabled = false;
        } else {
            return;
        }

        var startDate = $('.choice-date').val();
        var endDate = $('.choice-last').val();

        initData();

        getChartData(startDate, endDate);
        $('.year').children().removeClass('active');
    });

    //日期开始结束时间选择
    $('#start-time').on('focus', function () {
        startTime('start-time', 'end-time');
    });

    $('#end-time').on('focus', function () {
        endTime('start-time', 'end-time');
    });

    function startTime(startEl, endEl) {
        WdatePicker({
            isShowClear: false,
            isShowToday: true,
            isShowOK: true,
            qsEnabled: false,
            readOnly: true,
            dateFmt: 'yyyy/MM/dd',
            autoUpdateOnChanged: false,
            maxDate: "#F{$dp.$D(\'" + endEl + "\')||\'%y-%M-%d\'}",
            onpicked: function () {},
            onclearing: function () {}
        });
    }

    function endTime(startEl, endEl) {
        WdatePicker({
            isShowClear: false,
            isShowToday: true,
            isShowOK: true,
            qsEnabled: false,
            readOnly: true,
            dateFmt: 'yyyy/MM/dd',
            autoUpdateOnChanged: false,
            minDate: "#F{$dp.$D(\'" + startEl + "\')}",
            maxDate: "%y-%M-%d",
            autoPickDate: true,
            onpicked: function () {},
            onclearing: function () {}
        });
    }

    //根据国家获取指标列表
    function getIndicatorList(country, obj) {
        $.ajax({
            type: 'post',
            data: { countryId: country },
            url: '/indicator/IndicaByCountryId',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    obj.parents('.country').siblings('.indicator').find('dl').html(renderIndicatorList(dataMain)).end().find('.pick em').html('选择指标');
                }
            }
        });
    }

    //生成指标列表
    function renderIndicatorList(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            if (data[i].Codes == itemId) {
                continue;
            }
            str += '<dd data-id="' + data[i].Codes + '" data-unit="' + data[i].Units + '">' + data[i].Names + '</dd>';
        }
        return str;
    }

    //获取图表数据
    function getChartData(start, end) {
        $.ajax({
            type: 'post',
            data: { uptxttime: start, downtxttime: end, mainitemId: chartIdGroup[idIndex] },
            url: '/indicator/EcoItemDetailsChart',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')').data.items;
                    chartDataArr.push(dataMain);
                }
            }
        }).always(function () {
            idIndex++;
            if (idIndex < chartIdGroup.length) {
                getChartData(start, end);
            } else {
                manageChartData(chartDataArr);
                chartAction(totalData);
                updateEnabled = true;
            }
        });
    }

    //处理图表数据格式
    function manageChartData(dataMain) {
        totalData = [];
        dateVal = [];
        for (var i = 0; i < dataMain.length; i++) {
            var actDataArr = new Object();
            actDataArr.name = chartTitleGroup[i];
            actDataArr.data = [];
            for (var j = 0; j < dataMain[i].length; j++) {
                var timeValueArr = [];
                var date = dataMain[i][j][1] * 1000;
                dateVal.push(date);
                timeValueArr.push(date);
                timeValueArr.push(parseFloat(dataMain[i][j][2]));
                actDataArr.data.push(timeValueArr);
            }
            actDataArr.data.reverse();
            totalData.push(actDataArr);
        }
        dataMain.length > 1 && (dateVal = dateVal.unique().sort(function (a, b) {
            return a - b;
        }));
        //dateArr.reverse();        
    }

    Array.prototype.unique = function () {
        var res = [this[0]];
        for (var i = 1; i < this.length; i++) {
            var repeat = false;
            for (var j = 0; j < res.length; j++) {
                if (this[i] == res[j]) {
                    repeat = true;
                    break;
                }
            }
            if (!repeat) {
                res.push(this[i]);
            }
        }
        return res;
    };

    //图表数据初始化
    function initData() {
        idIndex = 0;
        chartDataArr = [];
    }

    function chartAction(data) {
        //公共图表参数
        var options = {
            colors: ['#329fd9', '#f96b70'], //颜色列表
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
                type: chartType,
                spacing: [10, 10, 0, 20]
            },
            title: {
                text: ''
            },

            xAxis: {
                //categories: dateVal,
                type: 'datetime',
                title: {
                    text: ''
                },
                tickPixelInterval: 100,
                tickWidth: 0,
                minTickInterval: 2,
                tickPositioner: function () {
                    var posArr = [];
                    if (dateVal.length < 20) {
                        posArr = dateVal;
                    } else {
                        posArr.push(dateVal[0]);
                        var dateInterval = (dateVal[dateVal.length - 1] - dateVal[0]) / 18;
                        var firstDate = dateVal[0];
                        for (var i = 0; i < 18; i++) {
                            firstDate += dateInterval;
                            posArr.push(firstDate);
                        }
                        posArr.push(dateVal[dateVal.length - 1]);
                    }
                    return posArr;
                },
                labels: {
                    //rotation:-45,
                    style: {
                        textOverflow: 'none',
                        whiteSpace: 'nowrap'
                    },
                    autoRotationLimit: 200,
                    formatter: function () {
                        return Highcharts.dateFormat('%Y-%m', this.value);
                    },
                    rotation: -45
                }
            },
            yAxis: {
                title: {
                    text: null
                }
                //labels: {
                //    x: -16,
                //    y: -6
                //},
                //endOnTick: true,
                //maxPadding: 0.1,
                //minPadding: 0.1,
                //max: null,
                //min:null
            },
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: true,
                xDateFormat: '%Y年%m月',
                shared: true
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: false // 开启数据标签
                    }, // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                    marker: {
                        radius: 3
                    }
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
                align: 'right',
                squareSymbol: true,
                itemStyle: {
                    color: '#636363'
                }
            },
            series: data
        };

        chartObj = Highcharts.chart('chart', $.extend({}, chartParam, options));
        //初始化图表
    }
})();