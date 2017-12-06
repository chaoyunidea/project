(function(){
    var requestArr = [1, 2, 3, 4];
    var firstTypeId = requestArr[2];
    var countryGroup = [];
    var economicIdGroup = [];
    var tableHeadStr = '';
    var economicChartData = [];
    var usChartData = [];
    var cnChartData = [];
    var indicatorNameArr = [];
    
    requestBannerData(firstTypeId);
    getGlobelEconomicId();
    

    //banner切换
    $('.banner dd').on('click', function () {
        var dataId = $(this).data('id');
        //if (requestArr.indexOf(dataId) >= 0) {
        //    requestBannerData(dataId);
        //}
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active').parents('.content')
                .find('ul[data-index="' + dataId + '"]').addClass('active').siblings().removeClass('active');
        }
       
    })
    //请求banner列表数据
    function requestBannerData(id) {
        $.ajax({
            url: '/indicator/indexbannerdata',
            type: 'post',
            data: { pageSize: 18, pageIndex: 1, ctype: id },
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    renderBannerData(dataMain, id);
                    requestArr.splice(requestArr.indexOf(id), 1);
                    id == firstTypeId && initBannerData();
                }
            }
        })
    }

    function initBannerData() {
        for (var i = 0; i < requestArr.length; i++) {
            requestBannerData(requestArr[i]);
        }
    }


    //渲染banner列表
    function renderBannerData(data,id) {
        var str = '';
        var chartPointData = [];
        var chartIdGroup = [];
        for (var i = 0; i < data.length; i++) {
            if (i < 6) {                
                chartIdGroup.push(data[i].Id);
            }
            chartPointData.push(parseFloat(data[i].Currentvalue));
            //str += '<li class="' + (i < 6 ? 'big ' : '') + (data[i].Currentvalue > data[i].Frontvalue ? 'up' : 'down') + '">'
            //    + '<a href="/indicator/datacenter/' + id + (id == 1 ? '-1' : '') +  '" target="_blank">'
            //    + '<h5>' + data[i].Valuetime.slice(0,4) + '年' + data[i].Valuetime.slice(4,6) + '月' + '</h5>'
            //    + '<h3>' + data[i].Currentvalue + (id == 1 || id == 4 ? '%' : '万') + '</h3>'
            //    + (i < 6 ? ('<div class="chart" id="chart' + data[i].Id + '" style="width:155px;height:40px;"></div>') : '')
            //    + '</a>'
            //    + '</li>';
        }
        //str += '<li class="more"><a href="/indicator/datacenter/' + id + '" target="_blank"><h2>更多</h2></a></li>';
        //$('.data-group ul[data-index="' + id + '"]').html(str);
        chartPointData = chartPointData.reverse();
        $.each(chartIdGroup, function (i) {
            areaChart('chart' + chartIdGroup[i], chartPointData);
        })
    }

    //请求全球经济指数数据
    function getGlobelEconomicData() {
        $.ajax({
            url: '/indicator/IndexGlobelIndicator',
            type: 'post',
            data: {},
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    countryGroup = dataMain.fields;
                    indicatorNameArr = dataMain.names;
                    for (var i = 0; i < dataMain.items.length; i++) {
                        var chartArr = [];                        
                        for (var k = 0; k < dataMain.items[i].length; k++) {
                            chartArr.push(parseFloat(dataMain.items[i][k][0]));
                        }
                        cnUsCompareChart(chartArr, (i + 1));
                    }
                    //$('.main .content').closeMask().find('.scroll-bar').show();
                    //renderCountryLink(countryGroup);
                    //usChartData = dataMain.us;
                    //cnChartData = dataMain.cn;
                    //renderEconomicData(dataMain.data.items);                    
                }
            }
        })
    }

    //请求全球经济指数链接数据
    function getGlobelEconomicId() {
        $.ajax({
            url: '/indicator/indexglobelindicatorid',
            type: 'post',
            data: {},
            success: function (data) {
                if (data.code == 0) {
                    economicIdGroup = eval('(' + data.bodyMessage + ')');
                    getGlobelEconomicData();
                }
            }
        })
    }

    //渲染国家链接、表头列表
    function renderCountryLink(data) {
        var str = '';
        tableHeadStr += '<tr>';
        for (var i = 0; i < data.length; i++) {
            str += '<li><a href="/indicator/country/' + (i + 1) + '" target="_blank">' + data[i] + '</a></li>';
            tableHeadStr += '<th>' + data[i] + '</th>';
        }
        tableHeadStr += '</tr>';
        $('.country-list').append(str);
    }

    //渲染全球经济指数数据
    function renderEconomicData(data) {
        var rightStr = '<dl class="title"><dd></dd></dl>';
        var centerStr = tableHeadStr;
        var leftStr = '<dl class="title"><dd>热门指标</dd></dl>';
        for (var i = 0; i < data.length; i++) {
            centerStr += '<tr>';
            rightStr += '<dl><dd id="chart' + (i + 1) + '" class="compare-chart"></dd></dl>';
            var maxVal = Math.max.apply(Math, data[i].slice(1));
            var minVal = Math.min.apply(Math, data[i].slice(1));
            for (j = 0; j < data[i].length; j++) {
                if (j == 0) {
                    leftStr += '<dl><dd>' + data[i][j] + '</dd></dl>';
                    indicatorNameArr.push(data[i][j]);
                } else {
                    centerStr += '<td class="' + ((data[i][j] == maxVal && 'top') || (data[i][j] == minVal && 'last') || '') + '"><a href="/indicator/detail/' + economicIdGroup[i][j] + '" target="_blank">' + data[i][j] + '</a></td>';
                }
            }
            centerStr += '</tr>';
        }
        $('.table-left').html(leftStr);
        $('.table-center table').html(centerStr);
        $('.table-right').html(rightStr);
        
    }

    //获取经济对比图表数据
    function getEconomicChartData(countryId,typeId) {
        $.ajax({
            url: '/indicator/IndexGlobelIndicatorChart',
            type: 'post',
            data: { country:countryId,type:typeId,sp:0},
            success: function (data) {
                if (data.code == 0) {
                    var chartItemArr = [];
                    var dataMain = eval('(' + data.bodyMessage + ')');                    
                    countryId == 1 && (economicChartData = []);
                    for (var i = 0; i < dataMain.length; i++) {
                        chartItemArr.push(parseFloat(dataMain[i]['Real']));
                    }
                    economicChartData.push(chartItemArr);
                    if (countryId == 2) {
                        cnUsCompareChart(economicChartData, typeId);
                    }
                    countryId++;                    
                    countryId < 3 && getEconomicChartData(countryId, typeId);
                   
                }
            }
        })
    }

    //启动生成图表
    //function chartAction() {
    //    for (var i = 1; i < 12; i++) {
    //        getEconomicChartData(1, i);
    //    }
    //}

    

    //中美数据对比图表生成
    function cnUsCompareChart(chartData,type) {
    //公共图表参数
        var options = {
            colors: ['#d7eeff', '#faa7aa'],//颜色列表
            title: {
                text: null //标题设置为空
            },
            credits: {
                enabled: false //版权隐藏
            }
        }
        var chartParam = {
            exporting: {
                enabled: false
            },
            chart: {
                type: 'area',
                spacing:0
            },
            title: {
                text: ''
            },
            xAxis: {
                visible:false,
                categories: countryGroup,
                labels: {
                    enabled:false
                },
                title: {
                    enabled: false
                }
            },
            yAxis: {
                enabled: false,
                labels: {
                    enabled:false
                },
                title: {
                    enabled:false
                },
                gridLineWidth:0
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
                        fillColor:'#fff',
                        radius:2
                    },
                    threshold:-10
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
                enabled:false
            },
            series: [
                {
                    name: 'all',
                    data:chartData
                }
            ]
        };
        var chart = Highcharts.chart('chart' + type, $.extend({}, chartParam, options));
        //初始化图表        
    }
   
    //表格点击左右滚动效果
    var scroll = {        
        left: document.getElementById('scroll-left'),
        right: document.getElementById('scroll-right'),
        el: document.getElementById('scroll'),
        bar: document.getElementById('scroll-bar'),
        tab: document.getElementById('scroll-table')
    };

    //scroll.stop = function () {
    //    clearInterval(scroll.auto);
    //};

    scroll.jump = function (down) {
        var scrollVal = parseInt($(scroll.tab).css('left')) - 80 * (down || -1);
        if (scrollVal > 0) {
            $(scroll.tab).css('left', 0);
        } else if (scrollVal < -($(scroll.tab).outerWidth() - $(scroll.el).outerWidth())) {
            $(scroll.tab).css('left', -($(scroll.tab).outerWidth() - $(scroll.el).outerWidth()));
        } else {
            $(scroll.tab).css('left',scrollVal);
        }
        
    };

    scroll.dir = function (e, down) {
        if (e.preventDefault) {//IE
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
        scroll.jump(down);
        //scroll.stop();
        //scroll.auto = setInterval(function(){
        //    scroll.jump(down)
        //}, 100);
    };

    scroll.timeout = function (e, down) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }

        scroll.jump(down);
        //scroll.stop();
        //scroll.auto = setTimeout(function () {
        //    scroll.jump(down)
        //}, 100);
    };

    function listen(ele, event_name, fun)
    {
        if (window.attachEvent){
            ele.attachEvent('on' + event_name, fun); //IE浏览器
        }            
        else
        {
            ele.addEventListener(event_name, fun, false); //非IE浏览器
        }
    }

    function scrollFunc(e) {
        e = e || window.event;
        if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件               
            if (e.wheelDelta > 0) { //当滑轮向上滚动时                  
                scroll.timeout(e);
            } else {//当滑轮向下滚动时
                scroll.timeout(e,true);
            }            
        } else if (e.detail) {  //Firefox滑轮事件  
            if (e.detail > 0) { //当滑轮向上滚动时  
                scroll.timeout(e);
            } else {//当滑轮向下滚动时 
                scroll.timeout(e, true);
            }
            
        }
    }
    listen(scroll.el, 'DOMMouseScroll', function (e) {
        scrollFunc(e);
    })

    listen(scroll.el, 'mousewheel', function (e) {
        scrollFunc(e);
    })
    listen(scroll.left, 'mousedown', function (e) {
        scroll.dir(e);
    });
    listen(scroll.right, 'mousedown', function (e) {
        scroll.dir(e, true);
    });
    listen(scroll.bar, 'mousedown', function () {
        listen(document, 'mouseup', scroll.stop);
    });

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
            }],
            colors: ['#fff', 'red'],//颜色列表
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

    //打开弹窗
    $('body').on('click', '.compare-chart', function () {
        renderComparePop($(this).attr('id').substring(5));
        initChartParams();
        getPopChartData($('#start-time').val(), $('#end-time').val());
    })


    //关闭弹窗
    $('body').on('click', '.mask', function (event) {
        var targetEl = $(event.target);
        if (!targetEl.parents().hasClass('compare-pop') || !targetEl.hasClass('compare-pop') || targetEl.parent().hasClass('close')) {
            $('.mask').remove();
        }       
    })

    //导出图表截图
    $('body').on('click', '.shortcut',function () {
        chartObj.exportChartLocal();
    })

    //图表类型切换
    $('body').on('click', '.chart-control span', function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active');
            chartType = $(this).data('type');
            chartAction(totalData);
        }
    })

    //选框显示隐藏
    $('body').on('click', '.select-box .pick', function () {
        if (!$(this).parent().hasClass('active')) {
            $(this).parent().addClass('active');
        }
    })

    //点击页面其他位置隐藏设置
    $(document).on('click', function (event) {
        var targetEl = $(event.target);
        if (!targetEl.parents().hasClass('select') && $('.select').hasClass('active')) {
            $('.select').removeClass('active');
        }        
    })

    //选择选项
    $('body').on('click', '.select dl dd', function () {
        if (!$(this).hasClass('selected')) {
            $(this).parents('.select').removeClass('active').find('.pick em').text($(this).text());
            $(this).addClass('selected').siblings().removeClass('selected');            
        }
    })

    //确定生成图表对比
    $('body').on('click', '.compare-select .button', function () {
     
        //是否选择选项
        if (!$(this).siblings('.country').find('dd.selected').length) {
            layer.msg('请选择国家');
            return;
        }

        if (compareIdGroup.length >= 6) {
            layer.msg('国家数量不能超过6个');
            return;
        }

        var selectedId = $(this).siblings('.country').find('dd.selected').data('id');
        if (compareIdGroup.indexOf(selectedId) > -1) {
            layer.msg('已选择该国家');
            return;
        }

        //禁止多次提交
        if (updateEnabled) {
            updateEnabled = false;
        } else {
            return;
        }
        compareIdGroup.push(selectedId);
        compareTitleGroup.push($('.compare-select .country .pick em').text());

        
        getPopChartData($('.time-select li:last').hasClass('active') ? '1910/01/01' : $('#start-time').val(), $('#end-time').val());

    })

    //按年查询图表数据
    $('body').on('click', '.year li', function () {
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
            
            getPopChartData($(this).data('year') != 0 ? startDate : '1910/01/01', endDate);
        }

    })

    //选择日期查询数据
    $('body').on('click', '#select-data', function () {        
        var startDate = $('.choice-date').val();
        var endDate = $('.choice-last').val();

        //禁止多次提交
        if (updateEnabled) {
            updateEnabled = false;
        } else {
            return;
        }

        getPopChartData(startDate, endDate);
        $('.year').children().removeClass('active');
    })

    //初始化图表参数
    function initChartParams() {
        compareIdGroup = [1, 2];
        compareTitleGroup = ['美国', '中国'];
        chartType = 'line';
        updateEnabled = true;
    }

    //渲染比较图表弹窗
    function renderComparePop(id) {
        var str = '';
        str += '<div class="mask"><div class="compare-pop" data-id="' + id + '">'
           + '<div class="title clearfix">'
           + '<h1>全球经济-' + indicatorNameArr[id - 1] + '对比</h1>'
           + '<div class="chart-control">'
           + '<span class="line active" data-type="line"></span><span class="column" data-type="column"></span></div></div>'
           + '<div class="chart-area">'
           + '<div class="time-select clearfix">'
           + '<div class="date">'
           + '<span class="choice-theme">选择日期：</span>'
           + '<input class="choice-date" type="text" placeholder="起始日期" id="start-time" value="' + Highcharts.dateFormat('%Y/%m/%d', new Date().setFullYear(new Date().getFullYear() - 5)) + '" readonly>'
           + '<span class="need-to">至</span>'
           + '<input class="choice-last" type="text" placeholder="结束日期" id="end-time" value="' + Highcharts.dateFormat('%Y/%m/%d', new Date()) + '" readonly>'
           + '<a href="javascript:;" class="sure" id="select-data">确定</a>'
           + '</div>'
           + '<ul class="year">'
           + '<li data-year="1">1年</li>'
           + '<li data-year="5" class="active">5年</li>'
           + '<li data-year="10">10年</li>'
           + '<li data-year="0">全部</li>'
           + '</ul>'
           + '</div>'
           + '<div class="chart" id="compare-chart">'
           + '</div>'
           + '<div class="compare">'
           + '<div class="item clearfix">'
           + '<h3>添加数据对比</h3>'
           + '</div>'
           + '<div class="compare-select select-box">'
           + '<div class="country select">'
           + '<span class="pick clearfix"><em>选择国家</em><i class="triangle"></i></span>'
           + '<dl>'
           
           + '</dl>'
           + '</div>'
           + '<span class="button">确定</span>'
           + '</div>'
           + '</div></div><div class="close"><img src="/Images/public/x.png" /></div></div></div>';
        $('body').append(str);
        renderCountryList();
            
    }

    //获取弹窗对比数据
    function getPopChartData(start,end) {
        $.ajax({
            type: 'post',
            data: { uptxttime: start, downtxttime: end, mcountry: compareIdGroup.join(), itemId: $('.compare-pop').data('id') },
            url: '/indicator/CountryCompareChart',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    manageChartData(dataMain);
                    chartAction(totalData);                    
                }
            }
        }).always(function () {
            updateEnabled = true;
        })
    }

    //处理图表数据格式
    function manageChartData(dataMain) {
        totalData = [];

        for (var i = 0; i < dataMain.length; i++) {
            var actDataArr = new Object();
            actDataArr.name = compareTitleGroup[i];
            actDataArr.data = [];
            for (var j = 0; j < dataMain[i].length; j++) {
                var timeValueArr = [];
                var date = dataMain[i][j]['publishat'] * 1000;
                timeValueArr.push(date);
                timeValueArr.push(parseFloat(dataMain[i][j]['values']));
                actDataArr.data.push(timeValueArr);
            }
            actDataArr.data.reverse();
            totalData.push(actDataArr);
        }

        //dateArr.reverse();        
    }

    //生成国家列表选框
    function renderCountryList() {
        var str = '';
        for (var i = 0; i < countryGroup.length; i++) {
            str += '<dd data-id="' + (i + 1) + '">' + countryGroup[i] + '</dd>';
        }

        $('.select dl').append(str);
    }

    //日期开始结束时间选择
    $('body').on('focus','#start-time', function () {
        startTime('start-time', 'end-time');
    })

    $('body').on('focus', '#end-time',function () {
        endTime('start-time', 'end-time');
    })

    function startTime(startEl, endEl) {
        WdatePicker({
            isShowClear: false,
            qsEnabled: false,
            readOnly: true,
            dateFmt: 'yyyy/MM/dd',
            autoUpdateOnChanged: false,
            maxDate: "#F{$dp.$D(\'" + endEl + "\')||\'%y-%M-%d\'}",
            onpicked: function () {

            },
            onclearing: function () {

            }
        })
    }

    function endTime(startEl, endEl) {
        WdatePicker({
            isShowClear: false,
            qsEnabled: false,
            readOnly: true,
            dateFmt: 'yyyy/MM/dd',
            autoUpdateOnChanged: false,
            minDate: "#F{$dp.$D(\'" + startEl + "\')}",
            maxDate: "%y-%M-%d",
            autoPickDate: true,
            onpicked: function () {

            },
            onclearing: function () {

            }
        })
    }

    //弹窗图表生成
    function chartAction(data) {
        //公共图表参数
        var options = {
            colors: ['#329fd9', '#f96b70', '#57bddb', '#cb78a1', '#a07ed3', '#3d63d0'],//颜色列表
            title: {
                text: null //标题设置为空
            },
            credits: {
                enabled: false //版权隐藏
            }
        }
        var chartParam = {
            exporting: {
                enabled: false
            },
            chart: {
                type: chartType,
                spacing: 0
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
                labels: {
                    rotation: -60,
                    autoRotationLimit: 200,
                    formatter: function () {
                        return Highcharts.dateFormat('%Y-%m-%d', this.value);
                    }
                }
            },
            yAxis: {
                title: {
                    text: null,
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
                xDateFormat: '%Y-%m-%d',
                shared: true
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: false          // 开启数据标签
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
        chartObj = Highcharts.chart('compare-chart', $.extend({}, chartParam, options));
        //初始化图表

    }




})()