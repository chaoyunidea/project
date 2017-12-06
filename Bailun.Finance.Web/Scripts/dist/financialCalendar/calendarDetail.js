$(function () {
    var dateArr;
    var totalData;
    function chartAction(data, type, dateVal) {
        //公共图表参数

        var options = {
            colors: ['#329fd9', '#ffae29'], //颜色列表
            title: {
                text: null //标题设置为空
            },
            credits: {
                enabled: false //版权隐藏
            }
        };
        if (type == 'line') {
            data[0].dataLabels = { align: 'left', color: '#329fd9' };
            data[1].dataLabels = { align: 'right', color: '#ffae29' };
        }

        var chartParam = {
            exporting: {
                enabled: false
            },
            chart: {
                type: type,
                spacing: 0
            },
            title: {
                text: ''
            },
            xAxis: {
                categories: dateVal,
                tickWidth: 0,
                type: 'datetime',
                title: {
                    style: { color: "#000" }
                },
                labels: {
                    autoRotationLimit: 200
                    //rotation: -45
                },
                title: {
                    text: ''

                    //labels: {
                    //    formatter: function () {
                    //        return Highcharts.dateFormat('%m-%d %H:%M', this.value);
                    //    }
                    //}
                } },
            yAxis: {
                title: {
                    text: null
                },
                labels: {
                    x: -16,
                    y: -6
                }
            },
            credits: {
                enabled: false
            },
            tooltip: {
                enabled: true,
                shared: true,
                followPointer: true
                //distance:-50
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true,
                        allowOverlap: true,
                        padding: 10

                        // 开启数据标签
                        // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                    } },
                series: {
                    dataLabels: {
                        enabled: true,
                        color: '#000'
                        //format: '{point.y:.1f}%'
                    }
                }
            },
            legend: {},
            series: data
        };
        chart = Highcharts.chart('container', $.extend({}, chartParam, options));
        //初始化图表
    }
    //vm = avalon.define({
    //    $id: 'detail',
    //    detailData:{}
    //})


    getChartData(0, 0, calendarId, 'line');

    //请求财经日历详情数据
    function getCalendarDetail(id, date, uid) {
        $.ajax({
            type: 'post',
            data: { economicsId: id, releaseDate: date, unscrambleId: uid },
            url: '/Calendar/GetEconomicsUnscramble',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    vm.detailData = dataMain;
                }
            }
        });
    }

    //获取图表数据
    function getChartData(start, end, id, type) {
        $.ajax({
            type: 'post',
            data: { unscrambleId: id, startDate: start, endDate: end },
            url: '/Calendar/GetEconomicsChart',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    manageChartData(dataMain);
                    chartAction(totalData, type, dateArr);
                }
            }
        });
    }

    //处理图表数据格式
    function manageChartData(dataMain) {
        dateArr = [];
        var actDataArr = new Object();
        var preDataArr = new Object();
        totalData = [];
        actDataArr.name = '公布';
        actDataArr.data = [];
        preDataArr.name = '预测';
        preDataArr.visible = false;
        preDataArr.data = [];
        for (var i = 0; i < dataMain.length; i++) {
            dateArr.push(dataMain[i].DateName);
            actDataArr.data.push(parseFloat(dataMain[i].Actual == '---' || dataMain[i].Actual == '' ? 0 : dataMain[i].Actual));
            preDataArr.data.push(parseFloat(dataMain[i].Consensus == '---' || dataMain[i].Consensus == '' ? 0 : dataMain[i].Consensus));
        }
        totalData.push(actDataArr);
        totalData.push(preDataArr);
    }

    //图表类型选择
    $('.chart-type').on('click', function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings('.chart-type').removeClass('active');
            if ($(this).hasClass('line')) {
                chartAction(totalData, 'line', dateArr);
            } else if ($(this).hasClass('column')) {
                chartAction(totalData, 'column', dateArr);
            }
        }
    });

    //选择日期查询数据
    $('#select-data').on('click', function () {
        var startDate = $('.choice-date').val();
        var endDate = $('.choice-last').val();
        var chartType = $('.chart-type.active').hasClass('line') ? 'line' : 'column';
        if (startDate == '') {
            layer.msg('请选择开始日期');
            return;
        } else if (endDate == '') {
            layer.msg('请选择结束日期');
            return;
        }
        getChartData(Date.parse(new Date(startDate)), Date.parse(new Date(endDate)), calendarId, chartType);
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

    //根据时间搜索数据
    //function selectChartData(start, end, id,type) {       
    //    $.ajax({
    //        type: 'post',
    //        data: { unscrambleId: id },
    //        url: '/Calendar/GetEconomicsChart',
    //        success: function (data) {
    //            if (data.code == 0) {
    //                var dataMain = eval('(' + data.bodyMessage + ')');
    //                manageChartData(dataMain);
    //                chartAction(totalData, type, dateArr);
    //            }
    //        }
    //    })       
    //}
});