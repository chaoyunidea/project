(function () {
    var onePagesize = 50;
    var allPagesize = 500;
    var totalData = [];
    var enableDate = [];
    var chartData = {
        front: [],
        current: [],
        preval: []
    };
    var chartStartDate,
        chartEndDate;
    var chartType = 'bar';
    var fixedScrollVal = $('.top-wrap').offset().top;
    var cnTitle = ['前值', '今值', '预测'];
    var enTitle = ['front', 'current', 'preval'];
    var legendArr = [];
    var barColorStart = ['rgba(129, 224, 251, 0.9)', 'rgba(150, 208, 255, 0.9)', 'rgba(198, 217, 255, 0.9)'];
    var barColorEnd = ['rgba(46, 183, 240, 0.9)', 'rgba(28, 113, 209, 0.9)', 'rgba(91, 112, 189, 0.9)'];
    var chartColorAct = [];
    var expainData;
    var expainDataTwo;
    var visualMap = [{
        show: true
    }, {
        show: true
    }, {
        show: true
    }];
    var unionChartType = 'bar';
    getDataList(allPagesize, 1, true);
    $('.fix-thead').append($('.main-data thead').clone());

    // 滚动悬浮标题栏
    $(window).on('scroll', function () {
        if ($(window).scrollTop() >= fixedScrollVal) {
            if($('.bar-group dd.active').hasClass('column')){
                $('.top-wrap,.chart-box .top-bar').addClass('fixed');                
        } else {
               $('.top-wrap').addClass('fixed-table'); 
        }
            
        } else {
            $('.top-wrap,.chart-box .top-bar').removeClass('fixed-table fixed');
        }
    })

    //切换表格图表
    $('.bar-group .table,.bar-group .column').on('click', function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active');
            $('.main .' + $(this).data('tab')).addClass('active').siblings().removeClass('active');
            $(window).scrollTop(0);
        }
    })

    


    //点击弹出图表窗口
    $('body').on('click', '.main-data tr td span', function () {
        var type = $(this).data('type');
        var date = $(this).data('date') + '';        
        calcFromTo(dateFormat(date));
        $('#start-time').val(enableDate[chartStartDate]);
        $('#end-time').val(enableDate[chartEndDate]);
        $('.mask').show().find('.title h1').text(mainTitle +(type == 0 ? '': '-' +cnTitle[type -1]) + indicatorUnit);
        chartAction(createSeriesData(type));
        
    })

    //弹窗时间起始日期选择

    $('#start-time').on('focus', function () {
        startTime('end-time')
    });
    $('#end-time').on('focus', function () {
        endTime('start-time')
    });

    $('#change-zone').on('click', function () {
        popChart.dispatchAction({
            type: 'dataZoom',
            startValue: $('#start-time').val().split('/').join('-'),
            endValue: $('#end-time').val().split('/').join('-')
        })
    })
  
    //联动图表更新时间
    $('#union-start').on('focus', function () {
        startTime('union-end');
    });
    $('#union-end').on('focus', function () {
        endTime('union-start');
    });

    $('#change-union').on('click', function () {
        unionChart.dispatchAction({
            type: 'dataZoom',
            startValue: $('#union-start').val().split('/').join('-'),
            endValue: $('#union-end').val().split('/').join('-')
        })
    })


  
    //关闭弹窗
    $('body').on('click', '.chart-pop .close', function () {
        $(this).parents('.mask').hide();
    })

    // 类型报告
    //$(".report-type").on('click', function () {
    //    if ($('.three-values').css("display") == 'none') {
    //        $(".three-values").css({ "display": "block" });
    //    } else {
    //        $(".three-values").css({ "display": "none" });
    //    }

    //})

    $(".report-type").on('click', function () {
        if (!$('.three-values').hasClass('active')) {
            $('.three-values').addClass('active');
        }
    });

    //点击页面其他位置隐藏设置
    $(document).on('click', function (event) {
        var targetEl = $(event.target);
        if (!targetEl.parents().hasClass('report') && $('.three-values').hasClass('active')) {
            $('.three-values').removeClass('active');
        }
    })

    //联动图表显示隐藏该项
    $(".three-values li").on("click", function () {
        if ($(this).hasClass('hide')) {
            $(this).removeClass('hide');
            visualMap[$(this).data('index')].show = true;
        } else {
            $(this).addClass('hide');
            visualMap[$(this).data('index')].show = false;
        };
        unionChart.getOption().series.length && (unionChartType = unionChart.getOption().series[0].type);
        showHideUnionChart();
    });

    //联动图表还原
    $('.restore').on('click', function () {
        unionChart.dispatchAction({
            type:'restore'
        })
    })

    function startTime(endEl) {
        WdatePicker({
            skin: 'default',
            isShowClear: false,
            isShowToday: false,
            isShowOK: false,
            qsEnabled: false,
            readOnly: true,
            dateFmt: 'yyyy/MM/dd',
            autoUpdateOnChanged: false,
            opposite: true,
            disabledDates: enableDate,
            maxDate: "#F{$dp.$D(\'" + endEl + "\')||\'%y-%M-%d\'}",
            onpicked: function () {

            },
        })
    }

    function endTime(startEl) {
        WdatePicker({
            skin: 'default',
            qsEnabled: false,
            isShowClear: false,
            isShowToday: false,
            isShowOK: false,
            readOnly: true,
            dateFmt: 'yyyy/MM/dd',
            autoUpdateOnChanged: false,
            opposite: true,
            disabledDates: enableDate,
            minDate: "#F{$dp.$D(\'" + startEl + "\')}",
            autoPickDate: true,
            onpicked: function () {

            },
            onclearing: function () {

            }
        })
    }

    //计算图表显示范围
    function calcFromTo(date) {
        var index = enableDate.indexOf(date);
        var length = enableDate.length;
        var count = 15;
        chartStartDate = index < count ? 0 : index - count;
        chartEndDate = length - index - 1 < count ? length - 1 : index + count;
    }

    //请求列表数据
    function getDataList(pagesize,pageIndex,unrefresh) {
        $.ajax({
            url: '/indicator/indexbannerdata',
            type: 'post',
            data: { pageSize: pagesize, pageIndex: pageIndex, ctype: dataId, countryId: countryId, valueTime:$('#date-place').val().split('/').join('')},
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    pagesize == allPagesize && (totalData = $.extend([], dataMain), manageData(totalData));
                    !unrefresh && renderDataList(dataMain.slice(0,onePagesize));
                    kkpagerFn(onePagesize, pageIndex, Math.ceil(data.Total / onePagesize));
                    unionChartAction(createSeriesData(0,true));
                }
            }
        })
    }
    // 请求说明数据
    function explian(rctype, rcountryId) {
        if (rctype == 1) {
            $.ajax({
                url: '/indicator/IntroduceInfo',
                type: 'post',
                data: { rctype: rctype, rcountryId: rcountryId },
                success: function (data) {
                    if (data.code == "0") {
                        var dataMain = eval('(' + data.bodyMessage + ')');
                        $(".main").after('<div class="expain-page"><div class="explain-content"><div class="close"><a href="javascript:;"><img class="img" src="../../../images/indicator/close.png"/></a></div><h3 class="expain-title">' + dataMain[0].Itemname + '</h3> <h5 class="Source">数据来源 : <span>' + dataMain[0].Source + '</span></h5></div></div>');
                        $(".Source").after('<h5 class="rate">发布频率 : <span>' + dataMain[0].Pinli + '</span></h5><p class="expound"><span>数据解释 : </span>' + dataMain[0].Shuju + '</p><p class="expound"><span>名词释义 : </span>' + dataMain[0].Mingci + '</p><p class="expound"><span>解读公式 : </span>' + dataMain[0].jiedu + '</p><p class="expound"><span>潜在影响 : </span>' + dataMain[0].Yingxiang + '</p>')
                        $("body").css({ overflow: "hidden" });    //禁用滚动条,禁止滚屏
                        $(".close").on("click", function () {
                            $("body").css({ overflow: "visible" });    //恢复滚动条
                            $(".expain-page").remove();
                           
                        })
                        $(".close").hover(function () {
                            $(".img").attr({ "src": "../../../images/indicator/close2.png" });
                        }, function () {
                            $(".img").attr({ "src": "../../../images/indicator/close.png" });
                        })
                    }
                }
            })
        } else {
            $.ajax({
                url: '/indicator/IntroduceInfo',
                type: 'post',
                data: { rctype: rctype },
                success: function (data) {
                    if (data.code == "0") {
                        var dataMain = eval('(' + data.bodyMessage + ')');
                        $(".main").after('<div class="expain-page"><div class="explain-content"><div class="close"><a href="javascript:;"><img class="img" src="../../../images/indicator/close.png"/></a></div><h3 class="expain-title">' + dataMain[0].Itemname + '</h3> <h5 class="Source">数据来源 : <span>' + dataMain[0].Source + '</span></h5></div></div>');
                        $(".Source").after('<h5 class="rate">发布频率 : <span>' + dataMain[0].Pinli + '</span></h5><p class="expound"><span>数据解释 : </span>' + dataMain[0].Shuju + '</p><p class="expound"><span>名词释义 : </span>' + dataMain[0].Mingci + '</p><p class="expound"><span>解读公式 : </span>' + dataMain[0].jiedu + '</p><p class="expound"><span>潜在影响 : </span>' + dataMain[0].Yingxiang + '</p>')
                        $("body").css({ overflow: "hidden" });    //禁用滚动条,禁止滚屏
                        $(".close").on("click", function () {
                            $("body").css({ overflow: "visible" });   //恢复滚动条
                            $(".expain-page").remove();
                           
                        })
                        $(".close").hover(function () {
                            $(".img").attr({ "src": "../../../images/indicator/close2.png" });
                        }, function () {
                            $(".img").attr({ "src": "../../../images/indicator/close.png" });
                        })
                    }
                }
            })
        }
    }

    $(".info").on("click", function () {
        explian(parseInt(dataId), parseInt(countryId));
    });
     
     
    function manageData(data) {
        //数据整理
        chartData.front = [];
        chartData.current = [];
        chartData.preval = [];
        enableDate = [];
        for (var i = data.length - 1; i >= 0; i--) {
            enableDate.push(dateFormat(data[i].Valuetime));
            chartData.front.push(parseFloat(data[i].Frontvalue));
            chartData.current.push(parseFloat(data[i].Currentvalue));
            chartData.preval.push(parseFloat(data[i].Predvalue));
        }
        addWdatePicker();

    }


    function addWdatePicker() { 
        $('.bar-group .time-select').off('click');
        //日历
        $('.bar-group .time-select').on('click', function () {
            WdatePicker({
                skin:'default',
                isShowClear: false,
                isShowToday: false,
                isShowOK: false,
                qsEnabled: false,
                firstDayOfWeek: 1,
                startDate: "'2017-11-03", 
                opposite: true,
                disabledDates: enableDate,
                dateFmt: 'yyyy/MM/dd',
                autoUpdateOnChanged: false,
                onpicked: function (dp) {
                    //请求当前时间数据
                    getDataList(allPagesize, 1, false);
                    $('#union-start').val(enableDate[enableDate.length - 29].split('-').join('/'))
                    $('#union-end').val($dp.cal.getDateStr().split('-').join('/'));
                }
            });
        })
    }



    //时间格式转换 年-月-日
    function dateFormat(date) {
        return date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6)
    }

    //渲染列表数据
    function renderDataList(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            str += '<tr><td><span data-type="0" data-date="' + data[i].Valuetime + '">' + data[i].Itemname + '</span></td>'
                + '<td class="time">' + data[i].Valuetime + '</td>'
                + '<td><span data-type="1" data-date="' + data[i].Valuetime + '">' + data[i].Frontvalue + '</span></td>'
                + '<td><span data-type="2" data-date="' + data[i].Valuetime + '">' + data[i].Currentvalue + '</span></td>'
                + '<td><span data-type="3" data-date="' + data[i].Valuetime + '">' + data[i].Predvalue + '</span></td>'
                + '</tr>';
        }
        $('.main-data tbody').html(str);
    }
    
    //数据翻页
    function kkpagerFn(pagesize,pageIndex, totalPages) {
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
                getDataList(pagesize,n);

            }
        }, true);
    }

    //生成图表数据
    function createSeriesData(type,union) {
        var seriesData = [];
        var actArr = [];
        var index = 0;
        for (var i in chartData) {
            var obj = {};
            obj.name = cnTitle[index];
            obj.type = chartType;
            obj.data = chartData[i];
            obj.itemStyle = newItemStyle(index);//渐变样式
            union && (obj.xAxisIndex = index, obj.yAxisIndex = index);
            seriesData.push(obj);
            index++;
        }
        
        if (type == 0) {
            actArr = seriesData;
            chartColorAct = barColorStart.slice(0);
            legendArr = cnTitle.slice(0);
        } else {
            actArr.push(seriesData[type - 1]);
            chartColorAct = barColorStart.slice(type - 1, type);
            legendArr = cnTitle.slice(type - 1, type);
        }
        return actArr;
    }

    //组装itemstyle
    function newItemStyle(index) {
        var itemStyle = {
            normal: {
                color: new echarts.graphic.LinearGradient(
                    0, 0, 0, 1,
                    [
                        { offset: 0, color: barColorStart[index] },
                        { offset: 1, color: barColorEnd[index] }
                    ]
                )
            }
        };
        return itemStyle;
    }

    

    function chartAction(series) {

        popChart = echarts.init(document.getElementById('chart-pop'));

        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true,
                    }
                },
                backgroundColor: '#fff',
                padding:0,
                //borderColor: '#ddd',
                //borderWidth:1,
                formatter: function (arg) {
                    var str = '<div class="tooltip-style"><h3>' + arg[0].axisValue + mainTitle + indicatorUnit + '</h3><dl>';
                    for (var i = 0; i < arg.length; i++) {
                        str += '<dd><em>' + arg[i].seriesName + ':</em><em>' + arg[i].value + '</em></dd>';
                    }
                    str += '</dl></div>';
                    return str;
                }
                              
            },
            legend: {
                show: true,
                data: legendArr,
                padding: 8,
                right:150
            },
            toolbox: {
                show: true,
                itemSize: 18,
                itemGap:14,
                feature: {                   
                    magicType: {
                        icon: { bar: "M15 13v12h6V13h-6zM3 7v18h6V7H3zm24-6v24h6V1h-6z M0 29h36v3H0z", line: "M.007 0H3v29h33v3H0L.007 0zm20.977 17.608L31.977 4.465l2.172 1.82-12.857 15.367-8.135-7.16-5.43 6.817-2.15-1.78 7.222-9.132 8.185 7.211z" },
                        show: true, type: ['bar', 'line'],
                        iconStatus: {
                            bar: 'emphasis',
                            line: 'normal'
                        },
                        option: {
                            line: {
                                xAxis: [{
                                    boundaryGap: true
                                }]
                            }
                        }
                    },
                    saveAsImage: {
                        icon: 'path://M 16.28 23.902 a 0.79 0.79 0 0 0 0.331 0.201 a 1.22 1.22 0 0 0 0.747 0 a 0.79 0.79 0 0 0 0.33 -0.2 l 4.538 -5.487 a 0.976 0.976 0 0 0 0.258 -0.674 a 0.877 0.877 0 0 0 -0.258 -0.647 a 0.877 0.877 0 0 0 -0.646 -0.258 a 0.877 0.877 0 0 0 -0.647 0.258 l -3.015 3.648 V 6.727 a 0.883 0.883 0 0 0 -0.273 -0.646 a 0.883 0.883 0 0 0 -0.646 -0.273 a 0.883 0.883 0 0 0 -0.646 0.273 a 0.883 0.883 0 0 0 -0.273 0.646 v 14.045 l -3.045 -3.677 a 0.877 0.877 0 0 0 -0.646 -0.258 a 0.877 0.877 0 0 0 -0.646 0.258 a 0.877 0.877 0 0 0 -0.259 0.647 c 0 0.258 0.087 0.483 0.259 0.674 l 4.538 5.486 Z M 29.75 0 H 4.25 C 3.077 0 2.075 0.415 1.245 1.245 C 0.415 2.075 0 3.077 0 4.25 v 25.5 c 0 1.173 0.415 2.175 1.245 3.005 c 0.83 0.83 1.832 1.245 3.005 1.245 h 25.5 c 1.173 0 2.175 -0.415 3.005 -1.245 c 0.83 -0.83 1.245 -1.832 1.245 -3.005 V 4.25 c 0 -1.173 -0.415 -2.175 -1.245 -3.005 C 31.925 0.415 30.923 0 29.75 0 Z M 31 29 c 0 0.542 -0.198 1.01 -0.594 1.406 A 1.922 1.922 0 0 1 29 31 H 5 c -0.542 0 -1.01 -0.198 -1.406 -0.594 A 1.922 1.922 0 0 1 3 29 V 5 c 0 -0.542 0.198 -1.01 0.594 -1.406 A 1.922 1.922 0 0 1 5 3 h 24 c 0.542 0 1.01 0.198 1.406 0.594 c 0.396 0.396 0.594 0.864 0.594 1.406 v 24 Z m -5 -3 H 8 a 0.961 0.961 0 0 0 -0.703 0.297 A 0.961 0.961 0 0 0 7 27 c 0 0.27 0.099 0.505 0.297 0.703 A 0.961 0.961 0 0 0 8 28 h 18 c 0.27 0 0.505 -0.099 0.703 -0.297 A 0.961 0.961 0 0 0 27 27 a 0.961 0.961 0 0 0 -0.297 -0.703 A 0.961 0.961 0 0 0 26 26 Z',
                        show: true,                        
                    },
                    
                },
                iconStyle: {
                    normal: {
                        color: "#9ca1b3",
                        borderWidth: 0
                    },
                    emphasis: {
                        color: "#00aded"
                    }
                },
                right:'42px'
            },
            color: chartColorAct,
            calculable: true,
            dataZoom: {
                show: true,
                realtime: true,
                startValue: enableDate[chartStartDate],
                endValue: enableDate[chartEndDate],               
                width: "85%",
                left: "center",
                handleStyle: {
                    color: "#969eb1"
            },
                fillerColor: "rgba(150, 158, 177, 0.35)",
                dataBackground: {
                    areaStyle: {
                      color:"#666"
                    }
                }
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    data: enableDate
                }
            ],
            yAxis: [
                {
                    type: 'value',
                }
            ],
            grid:{
                show:false,
                left:40,
                right: 40,
                borderColor: "#e0e0e0",
                bottom:80
            },
            series: series
        };


        popChart.setOption(option, true);
        popChart.on('magictypechanged', function () {
            popChart.setOption({
                xAxis: [
                    {
                        type: 'category',
                        boundaryGap: true,
                        data: enableDate
                    }
                ]
            });
        })
    }

    //联动图表生成
    function unionChartAction(series) {

        unionChart = echarts.init(document.getElementById('chart-union'));
        unionChartOne = echarts.init(document.getElementById('chart-union-one'));

        unionOption = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true,
                    }
                },
                backgroundColor: '#fff',
                padding: 0,
                //borderColor: '#ddd',
                //borderWidth:1,
                formatter: function (arg) {
                    var str = '<div class="tooltip-style"><h3>' + arg[0].axisValue + mainTitle + indicatorUnit + '</h3><dl>';
                    for (var i = 0; i < arg.length; i++) {
                        str += '<dd><em>' + arg[i].seriesName + ':</em><em>' + arg[i].value + '</em></dd>';
                    }
                    str += '</dl></div>';
                    return str;
                }

            },
            legend: {
                show: false,
                data: legendArr,
                padding: 8,
                right: 150
            },
            axisPointer: {
                link: { xAxisIndex: 'all' }
            },
            toolbox: {
                show: true,
                itemSize: 18,
                itemGap: 14,
                feature: {
                    magicType: {
                        icon: { bar: "M15 13v12h6V13h-6zM3 7v18h6V7H3zm24-6v24h6V1h-6z M0 29h36v3H0z", line: "M.007 0H3v29h33v3H0L.007 0zm20.977 17.608L31.977 4.465l2.172 1.82-12.857 15.367-8.135-7.16-5.43 6.817-2.15-1.78 7.222-9.132 8.185 7.211z" },
                        show: true, type: ['bar', 'line'],
                        iconStatus: {
                            bar: 'emphasis',
                            line: 'normal'
                        }
                    },
                    saveAsImage: {
                        show: true,
                        icon: 'path://M 16.28 23.902 a 0.79 0.79 0 0 0 0.331 0.201 a 1.22 1.22 0 0 0 0.747 0 a 0.79 0.79 0 0 0 0.33 -0.2 l 4.538 -5.487 a 0.976 0.976 0 0 0 0.258 -0.674 a 0.877 0.877 0 0 0 -0.258 -0.647 a 0.877 0.877 0 0 0 -0.646 -0.258 a 0.877 0.877 0 0 0 -0.647 0.258 l -3.015 3.648 V 6.727 a 0.883 0.883 0 0 0 -0.273 -0.646 a 0.883 0.883 0 0 0 -0.646 -0.273 a 0.883 0.883 0 0 0 -0.646 0.273 a 0.883 0.883 0 0 0 -0.273 0.646 v 14.045 l -3.045 -3.677 a 0.877 0.877 0 0 0 -0.646 -0.258 a 0.877 0.877 0 0 0 -0.646 0.258 a 0.877 0.877 0 0 0 -0.259 0.647 c 0 0.258 0.087 0.483 0.259 0.674 l 4.538 5.486 Z M 29.75 0 H 4.25 C 3.077 0 2.075 0.415 1.245 1.245 C 0.415 2.075 0 3.077 0 4.25 v 25.5 c 0 1.173 0.415 2.175 1.245 3.005 c 0.83 0.83 1.832 1.245 3.005 1.245 h 25.5 c 1.173 0 2.175 -0.415 3.005 -1.245 c 0.83 -0.83 1.245 -1.832 1.245 -3.005 V 4.25 c 0 -1.173 -0.415 -2.175 -1.245 -3.005 C 31.925 0.415 30.923 0 29.75 0 Z M 31 29 c 0 0.542 -0.198 1.01 -0.594 1.406 A 1.922 1.922 0 0 1 29 31 H 5 c -0.542 0 -1.01 -0.198 -1.406 -0.594 A 1.922 1.922 0 0 1 3 29 V 5 c 0 -0.542 0.198 -1.01 0.594 -1.406 A 1.922 1.922 0 0 1 5 3 h 24 c 0.542 0 1.01 0.198 1.406 0.594 c 0.396 0.396 0.594 0.864 0.594 1.406 v 24 Z m -5 -3 H 8 a 0.961 0.961 0 0 0 -0.703 0.297 A 0.961 0.961 0 0 0 7 27 c 0 0.27 0.099 0.505 0.297 0.703 A 0.961 0.961 0 0 0 8 28 h 18 c 0.27 0 0.505 -0.099 0.703 -0.297 A 0.961 0.961 0 0 0 27 27 a 0.961 0.961 0 0 0 -0.297 -0.703 A 0.961 0.961 0 0 0 26 26 Z'                       
                    }
                },
                right:'42px',
                top: '10px',
                iconStyle: {
                    normal: {
                        color: "#9ca1b3",
                        borderWidth: 0
                    },
                    emphasis: {
                        color: "#00aded"
                    }
                }
            },
           // color: chartColorAct,
            calculable: true,
            dataZoom:[ {
                show: false,
                startValue: $('#union-start').val().split('/').join('-'),
                endValue: $('#union-end').val().split('/').join('-'),
                xAxisIndex: [0,1,2]
            }, {
                show: false,
                startValue: $('#union-start').val().split('/').join('-'),
                endValue: $('#union-end').val().split('/').join('-'),
                xAxisIndex: [0,1,2]
                
            }, {
                show: false,
                startValue: $('#union-start').val().split('/').join('-'),
                endValue: $('#union-end').val().split('/').join('-'),
                xAxisIndex: [0,1,2]
            }],            
            xAxis: [
                {
                    type: 'category',
                    data: enableDate,
                    gridIndex: 0,
                    boundaryGap: true
                },
                {
                    type: 'category',
                    data: enableDate,
                    gridIndex: 1,
                    boundaryGap: true
            },
                {
                    type: 'category',
                    data: enableDate,
                    gridIndex: 2,
                    boundaryGap: true
                }

            ],
            yAxis: [
                {
                    type: 'value',
                    name: cnTitle[0],
                    nameTextStyle:{
                        color: barColorEnd[0],
                        fontSize:18
                    },
                    gridIndex: 0
                },
                {
                    type: 'value',
                    gridIndex: 1,
                    name: cnTitle[1],
                    nameTextStyle: {
                        color: barColorEnd[1],
                        fontSize: 18
                    }
                },
                {
                    type: 'value',
                    gridIndex: 2,
                    name: cnTitle[2],
                    nameTextStyle: {
                        color: barColorEnd[2],
                        fontSize: 18
                    }
                }
            ],
            grid: [{
                left: 40,
                right: 40,
                height: '25%',
                backgroundColor: '#fff',
                show:false
            },{
                left: 40,
                right: 40,
                top: '37%',
                height: '25%'
            }, {
                left: 40,
                right: 40,
                top: '70%',
                height: '25%'
            }],
            series: series
        };


        unionChart.setOption(unionOption, true);
        unionChart.on('magictypechanged', function () {
            unionChart.setOption({
                xAxis: [{ boundaryGap: true, boundaryGap: true, boundaryGap: true}
                ]
            });
        })

        dataZoomOption = {                        
            dataZoom: {
                show: true,
                realtime: true,
                startValue: $('#union-start').val().split('/').join('-'),
                endValue: $('#union-end').val().split('/').join('-'),
                width: "85%",
                left: "center",
                handleStyle: {
                    color: "#969eb1"
                },
                fillerColor: "rgba(150, 158, 177, 0.35)",
                dataBackground: {
                    areaStyle: {
                        color: "#666"
                    }
                },
                textStyle: {
                    top: "top"
                }
            },
            xAxis: [
                {
                    type: 'category',
                    data: enableDate,
                    gridIndex: 0,
                    show:false
                },
                {
                    type: 'category',
                    data: enableDate,
                    gridIndex: 1,
                    show:false
                },
                {
                    type: 'category',
                    data: enableDate,
                    gridIndex: 2,
                    show:false
                }

            ],
            yAxis: [
                {
                    type: 'value',
                    name: cnTitle[0],                    
                    gridIndex: 0,
                    show:false
                },
                {
                    type: 'value',
                    gridIndex: 1,
                    name: cnTitle[1],                    
                    show: false
                },
                {
                    type: 'value',
                    gridIndex: 2,
                    name: cnTitle[2],                    
                    show: false
                }
            ],
            grid: [{
                height: 0,
                show: false
            }, {
                height: 0,
                show: false
            }, {                
                height: 0,
                show: false
            }],
            series: series
        };

        unionChartOne.setOption(dataZoomOption, true);
        echarts.connect([unionChart, unionChartOne]);

    }

    //
    function getChartDataArr() {
        var chartDataArr = [];
        for (var i in chartData) {
            chartDataArr.push(chartData[i]);
        }
        return chartDataArr;
    }

    function showHideUnionChart() {
        var newDataZoom = [];
        var newXAxis = [];
        var newYAxis = [];
        var newGrid = [];
        var newSeries = [];
        var showIndex = 0;
        var indexArr = [0, 1, 2];
        var baseOption = {
            tooltip: unionOption.tooltip,
            toolbox: unionOption.toolbox
        };
        for (var i = 0; i < visualMap.length; i++) {
            if (visualMap[i].show) {
                var newDataZoomItem = {
                    show: false,
                    startValue: $('#union-start').val().split('/').join('-'),
                    endValue: $('#union-end').val().split('/').join('-'),                    
                };
                var newXAxisItem = {
                    type: 'category',
                    data: enableDate,
                    gridIndex: showIndex
                };
                var newYAxisItem = {
                    type: 'value',
                    name: cnTitle[i],
                    nameTextStyle: {
                        color: barColorEnd[i],
                        fontSize: 18
                    },
                    gridIndex: showIndex
                };
                var newGridItem = {
                    left: 40,
                    right: 40,
                    height: '25%',
                    top:(5 + 32 * showIndex) + '%',
                };
                var newSeriesItem = {
                    name: cnTitle[i],
                    type: unionChartType,
                    data: chartData[enTitle[i]],
                    xAxisIndex: showIndex,
                    yAxisIndex: showIndex,
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    { offset: 0, color: barColorStart[i] },
                                    { offset: 1, color: barColorEnd[i] }
                                ]
                            )
                        }
                    }
                };

                newDataZoom.push(newDataZoomItem);
                newXAxis.push(newXAxisItem);
                newYAxis.push(newYAxisItem);
                newGrid.push(newGridItem);
                newSeries.push(newSeriesItem);
                showIndex++;
            }
        }

        for (var j = 0; j < newDataZoom.length; j++) {
            newDataZoom[j].xAxisIndex = indexArr.slice(0, showIndex);
        }

        $('#chart-union').css('height', 430 * showIndex);
        unionChart.setOption($.extend(baseOption,{            
            dataZoom: newDataZoom,
            axisPointer: {
                link: { xAxisIndex: 'all' }
            },
            xAxis: newXAxis,
            yAxis: newYAxis,
            grid: newGrid,
            series: newSeries
        }), true);       

    }
 


    $(window).on('scroll', function () {
        if ($('.WdatePicker')) $('.WdatePicker').hide();
    })
    


})()


