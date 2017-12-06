$(function () {
  
    //时间格式化
    Date.prototype.pattern = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份         
            "d+": this.getDate(), //日         
            "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时         
            "H+": this.getHours(), //小时         
            "m+": this.getMinutes(), //分         
            "s+": this.getSeconds(), //秒         
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度         
            "S": this.getMilliseconds() //毫秒         
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[this.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    }

    //日历联动
    var cells = document.getElementById('monitor').getElementsByTagName('li');
    var clen = cells.length;
    var currentFirstDate;
    var weekDay = new Date().getDay();
    var selectDate = new Date();
    var dataMain = {};
    var eData = [];
    var formatDate = function (date) {
        var year = date.getFullYear();
        var month = (date.getMonth() + 1);
        var day = date.getDate();
        var week =  ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];

        return  '<em>' + week + '</em><b>' + month + '/' + day +'</b><i></i>';
    };

    var addDate = function (date, n) {
        date.setDate(date.getDate() + n);
        return date;
    };

    var selectType = 'B';
    var defaultName = '美元';
    var setDate = function (date) {
        week = date.getDay() - 1;
        week = week == -1 ? 6 : week;
        date = addDate(date, week * -1);
        currentFirstDate = new Date(date);        
        weekDateStr = '';
        for (var i = 0; i < clen; i++) {
            var currentDate = (i == 0 ? date : addDate(date, 1));
            weekDateStr += '<li data-date="'+ currentDate.pattern('yyyy/MM/dd')  +'">' + formatDate(currentDate) + '</li>';
        }
        $('.week-date').empty().append(weekDateStr);
        //选中日期效果
        $('.week-date li').eq(weekDay == 0 ? 6 : weekDay - 1).addClass('active').siblings().removeClass('active');
       
    };

    //周日期点击选中
    $('body').on('click', '.week-date li', function () {
        if (!$(this).hasClass('active')) {
            var curDate = $(this).attr('data-date');
            $(this).addClass('active').siblings().removeClass('active');
            weekDay = new Date(curDate).getDay();
            $('#date-place').val(curDate);
            getEconomicData('', -1, -1, Date.parse(new Date(curDate)));
            selectDate = new Date(curDate);
            searchInit();

        }
    })

    //上周、下周点击
    document.getElementById('prev-week').onclick = function () {
        setDate(addDate(currentFirstDate, -7));
        selectDate = new Date($('.week-date li.active').attr('data-date'));
        //请求数据
        getEconomicData('', -1, -1, Date.parse(selectDate));
        //日历日期调整
        $('#date-place').val($('.week-date li.active').attr('data-date'));
        searchInit();
        
    };

    document.getElementById('next-week').onclick = function () {
        setDate(addDate(currentFirstDate, 7));
        //请求数据
        selectDate = new Date($('.week-date li.active').attr('data-date'));
        getEconomicData('', -1, -1, Date.parse(selectDate));
        //日历日期调整
        $('#date-place').val($('.week-date li.active').attr('data-date'));
        searchInit();
    };  

    //初始化周日期
    setDate(new Date());
    $('.date-picker input').val(selectDate.pattern('yyyy/MM/dd'));

    //日历
    $('.date-picker').on('click', function () {
        
        WdatePicker({
            isShowClear: false,
            qsEnabled:false,
            firstDayOfWeek: 1,
            dateFmt:'yyyy/MM/dd',
            onpicked: function (dp) {
                var actDate = new Date($dp.cal.getDateStr().split('-').join('/'));
                selectDate = new Date($dp.cal.getDateStr().split('-').join('/'));
                weekDay = actDate.getDay();
                
                getEconomicData('', -1, -1, Date.parse(selectDate));
                setDate(actDate);
                searchInit();
              
            }
        });
    })
    //初始化数据
    getEconomicData('', -1, -1, Date.parse(new Date()));

    //正在加载
    $('.loading').openMask({ image: '/Images/public/loading.gif', isMask: false });

    //avalon.filters.impactFn = function (a) {
    //    return eco.impact[a];
    //}

    //avalon.filters.impactColor = function (a) {
    //    return eco.color[a];
    //}
     
    

    var socketNewsArr = [];
    var economicDataArr = [];

    //overall = avalon.define({
    //    $id: 'overall',
    //    overallData: [],
    //    noData:false
    //})

    //holiday = avalon.define({
    //    $id: 'holiday',
    //    holidayData: [],
    //    noData:false
    //})
    //初始化检索
    function searchInit() {
        $('.country .item dd').eq(0).addClass('active').siblings().removeClass('active');
        $('.level .item dd').eq(0).addClass('active').siblings().removeClass('active');
    }
    // 影响导航点击弹窗
    function currency() {
        $.getJSON('../Scripts/dev/financialCalendar/effect.json', function (data) {
            $(".effect").append('<h2 class="profit">利多利空品种选择</h2><div class="variety-a"><h5 class="title-a">' + data.genre[0] + '</h5><ul class="type-a"></ul></div><div class="variety-b"><h5 class="title-b">' + data.genre[1] + '</h5><ul class="type-b"></ul></div>');
            for (var i = 0; i < data['A类'].length; i++) {
                $(".type-a").append('<li class="coin"  data-name="' + data['A类'][i].name + '"><span><img src="../../../Images/calendar/goo.png"/></span><em>' + data['A类'][i].type + '</em></li>');
            }
            for (var n = 0; n < data['B类'].length; n++) {
                $(".type-b").append('<li class="coin-a" data-name="' + data['A类'][n].name + '"><span><img src="../../../Images/calendar/goo.png"/></span><em>' + data['B类'][n].type + '</em></li>');
            }
            $('.coin-a').eq(0).children().addClass('brisk');
            var count = 0, countIndex = 1;
            choose(count, countIndex);
        })
    }
    // 兼容浏览器
    var DEFAULT_VERSION = 8;

    var ua = navigator.userAgent.toLowerCase();

    var isIE = ua.indexOf("msie") > -1;
    var safariVersion;
    function browser() {

        if (isIE) {

            safariVersion = parseInt(ua.match(/msie ([\d.]+)/)[1]);

            if (safariVersion <= DEFAULT_VERSION) {

                //此时是ie8及ie8一下的浏览器

                confirm('不能跨品种选择');

            } else {

                //此时是大于ie8以上的浏览器
                layer.msg('不能跨品种选择');
            }

        } else {

            //不是ie浏览器
            layer.msg('不能跨品种选择');
        }

    };
    function browserOne() {
        if (isIE) {

            safariVersion = parseInt(ua.match(/msie ([\d.]+)/)[1]);

            if (safariVersion <= DEFAULT_VERSION) {

                //此时是ie8及ie8一下的浏览器

                confirm('最多只能选择两个品种');

            } else {

                //此时是大于ie8以上的浏览器
                layer.msg('最多只能选择两个品种');
            }

        } else {

            //不是ie浏览器
            layer.msg('最多只能选择两个品种');
        }
    }
    // 选择交易品种

    function choose(count, countIndex) {
      
        $(".coin").on("click", function () {
            var coinTxt = $(this).text();
            selectType = 'A';
            
            if ($('.coin-a').children().hasClass('brisk')) {
                browser();
            } else {
               
                  //  从B类切换选择A类
                if (count == 0 && $('.coin-a').text().indexOf($('.green').eq(0).text().slice(3, 5)) >= 0 && $('.coin-a').text().indexOf($('.red').eq(0).text().slice(3, 5)) >= 0) {

                    var greenPart = $('.green').eq(0).text().slice(0, 3);
                    var redPart = $('.red').eq(0).text().slice(0, 3);
                    // 只有green 类或者 red 类
                    if (greenPart == '') {
                        greenPart = $('.red').eq(0).text().slice(0, 3) == '利空 ' ? '利多 ' : '利空 ';
                       
                    }
                    if (redPart == '') {
                        redPart = $('.green').eq(0).text().slice(0, 3) == '利多 ' ? '利空 ' : '利多 ';
                     
                    }

                    $('.red').text(greenPart + coinTxt);
                    $('.green').text(redPart + coinTxt);
                    // 修改样式
                    var modify = $(".trend .green"), vary = $('.greater .green');
                    $(".trend .red").removeClass('red').addClass('green');
                    $(modify).removeClass('green').addClass('red');
                    $(".greater .red").removeClass('red').addClass('green');
                    $(vary).removeClass('green').addClass('red');
                    defaultName = $('.green').eq(0).text().substr(3) == '' ? $('.red').eq(0).text().substr(3) : $('.green').eq(0).text().substr(3);
                }
                var green = $('.green').eq(0).text();
                var red = $('.red').eq(0).text();

                if (count < 2) {
                    if (!$(this).children().hasClass('brisk')) {
                        $(this).children().addClass('brisk')
                          // 没有选择任何选项时
                          if (count == 0 && (green.indexOf(coinTxt) < 0 || red.indexOf(coinTxt)<0)) {
                            $('.green').text(green.slice(0, 3) + coinTxt);
                            $('.red').text(red.slice(0, 3) + coinTxt);
                            defaultName = $('.green').eq(0).text().substr(3) == '' ? $('.red').eq(0).text().substr(3) : $('.green').eq(0).text().substr(3);
                            count++
                            return count;
                           }
                           // 已经选择一种
                          if ((green.slice(3, 5) != coinTxt&&green.length<6)||(red.slice(3, 5) != coinTxt&&red.length<6)) {
                            $('.green').text(green +" "+ coinTxt);
                            $('.red').text(red +" "+ coinTxt)
                          }
                          defaultName = $('.green').eq(0).text().substr(3) == '' ? $('.red').eq(0).text().substr(3) : $('.green').eq(0).text().substr(3);
                          count++;
                           return count;
                    } else {
                        // 取消选择
                        $(this).children().removeClass('brisk');
                          // 判断是否选择了两种产品 
                          if (green.length > 6||red.length>6) {
                            $('.green').text(green.replace(" "+coinTxt, ""));
                            $('.red').text(red.replace(" "+coinTxt, ""));
                          } else {
                            $('.green').text(green);
                            $('.red').text(red);
                          }
                          defaultName = $('.green').eq(0).text().substr(3) == '' ? $('.red').eq(0).text().substr(3) : $('.green').eq(0).text().substr(3);
                         count--;
                         return count;
                      }
                } else {
                    //已经存在2种选项
                    if ($(this).children().hasClass('brisk')) {
                        $(this).children().removeClass('brisk');
                        if (green.length > 6 || red.length > 6) {
                            $('.green').text(green.replace(" " + coinTxt, ""));
                            $('.red').text(red.replace(" " + coinTxt, ""));
                        } else {
                            $('.green').text(green);
                            $('.red').text(red);
                        }
                        defaultName = $('.green').eq(0).text().substr(3) == '' ? $('.red').eq(0).text().substr(3) : $('.green').eq(0).text().substr(3);
                        count--;
                        return count;
                    } else {
                        browserOne();
                    }

                }
            }
                        
        });
       
        $(".coin-a").on("click", function () {
            var AcoinTxt = $(this).text();
            selectType = 'B';
            if ($('.coin').children().hasClass('brisk')) {
                browser();
            } else {

                if (countIndex == 0 && $('.coin').text().indexOf($('.green').eq(0).text().slice(3, 5)) >= 0&&$('.coin').text().indexOf($('.red').eq(0).text().slice(3, 5)) >= 0) {
                    var greenPart = $('.green').eq(0).text().slice(0, 3);
                    var redPart = $('.red').eq(0).text().slice(0, 3);
                    // 只有green 类或者 red 类
                    if (greenPart == '') {
                        greenPart = $('.red').eq(0).text().slice(0, 3) == '利空 ' ? '利多 ' : '利空 ';

                    }
                    if (redPart == '') {
                        redPart = $('.green').eq(0).text().slice(0, 3) == '利多 ' ? '利空 ' : '利多 ';

                    }
                    $('.red').text(greenPart + AcoinTxt);
                    $('.green').text(redPart + AcoinTxt);
                    var modify = $(".trend .green"), vary = $('.greater .green');
                    $(".trend .red").removeClass('red').addClass('green');
                    $(modify).removeClass('green').addClass('red');
                    $(".greater .red").removeClass('red').addClass('green');
                    $(vary).removeClass('green').addClass('red');
                    defaultName = $('.green').eq(0).text().substr(3) == '' ? $('.red').eq(0).text().substr(3) : $('.green').eq(0).text().substr(3);
                 }

                var green = $('.green').eq(0).text();
                var red = $('.red').eq(0).text();
                if (countIndex < 2) {

                    if (!$(this).children().hasClass('brisk')) {
                        $(this).children().addClass('brisk');

                        if ((countIndex == 0 && green.indexOf(AcoinTxt) < 0) || (countIndex == 0 && red.indexOf(AcoinTxt) < 0)) {
                            $('.green').text(green.slice(0, 3) + AcoinTxt);
                            $('.red').text(red.slice(0, 3) + AcoinTxt);
                            defaultName = $('.green').eq(0).text().substr(3) == '' ? $('.red').eq(0).text().substr(3) : $('.green').eq(0).text().substr(3);
                            countIndex++
                            return countIndex;
                        }

                        //点击时添加货币种类
                        if (green.slice(3, 5) != AcoinTxt || red.slice(3, 5) != AcoinTxt) {
                            $('.green').text(green +" "+ AcoinTxt);
                            $('.red').text(red + " " + AcoinTxt)
                            defaultName = $('.green').eq(0).text().substr(3) == '' ? $('.red').eq(0).text().substr(3) : $('.green').eq(0).text().substr(3);
                        }
                        countIndex++;
                        return countIndex;
                    } else {
                        $(this).children().removeClass('brisk');
                        // 判断是否已经存在2中交易品种
                        if (green.length > 6 || red.length > 6) {
                            $('.green').text(green.replace(" "+AcoinTxt, ""));
                            $('.red').text(red.replace(" " + AcoinTxt, ""));
                        } else {
                            $('.green').text(green);
                            $('.red').text(red);
                        }
                        defaultName = $('.green').eq(0).text().substr(3) == '' ? $('.red').eq(0).text().substr(3) : $('.green').eq(0).text().substr(3);
                        countIndex--;
                        return countIndex;
                    }
                } else {
                    if ($(this).children().hasClass('brisk')) {
                        $(this).children().removeClass('brisk');
                        if (green.length > 6 || red.length > 6) {
                            $('.green').text(green.replace(" "+ AcoinTxt, ""));
                            $('.red').text(red.replace(" " + AcoinTxt, ""));
                        } else {
                            $('.green').text(green);
                            $('.red').text(red);
                        }
                        defaultName = $('.green').eq(0).text().substr(3) == '' ? $('.red').eq(0).text().substr(3) : $('.green').eq(0).text().substr(3);
                        countIndex--;
                        return countIndex;
                    } else {
                        browserOne();
                    }

                }
            }

        });
    }

    $("#effect").on("click", function () {
        if (!$('.effect').hasClass('active')) {
            $('.effect').addClass('active');
            $('#effect img').attr('src',"../../../Images/calendar/top.png");

        } else {
            $('.effect').removeClass('active');
            $('#effect img').attr('src', "../../../Images/calendar/xia.png" );

        }
    })
      // 点击页面其他地方隐藏
        $(document).on('click', function (event) {
        var targetEve = $(event.target);
        if (!targetEve.hasClass('affect') && $('.effect').hasClass('active') && !targetEve.parents().hasClass('effect') && !targetEve.hasClass('icon')) {
            $('.effect').removeClass('active');
            $('#effect img').attr('src', "../../../Images/calendar/xia.png");
        }
        })

       
    //点击国家检索
        $('.country .item dd').on('click', function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active');
            if ($(this).index() == 0) {
                //eco.economicData = dataRowspan(dataMain.Economics);
                getEconomicData('', -1, -1, Date.parse(selectDate));                
            } else {
                //var ecoData = filterEconomicData('Country', $(this).text(), dataMain.Economics);
                //eco.economicData = dataRowspan(ecoData);
                getEconomicData($(this).text(), -1, -1, Date.parse(selectDate));                
            }
            $('.level .item dd').removeClass('active');
        }
    })

    //点击状态检索
    $('.level .item dd').on('click', function () {
        if (!$(this).hasClass('active')) {
            $(this).addClass('active').siblings().removeClass('active');            
            switch ($(this).attr('data-select')) {
                case 'all':
                    //eco.economicData = dataRowspan(dataMain.Economics);
                    getEconomicData('', -1, -1, Date.parse(selectDate));
                    break;
                case 'today':
                    getEconomicData('', -1, -1, Date.parse(selectDate));
                    break;
                case 'impact':
                    //var ecoData = filterEconomicData('Impact', 0, eData);
                    //eco.economicData = dataRowspan(ecoData);
                    getEconomicData('', 0, -1, Date.parse(selectDate));
                    break;
                case 'important':
                    //var ecoData = filterEconomicData('Star', 3, dataMain.Economics);
                    //eco.economicData = dataRowspan(ecoData);
                    getEconomicData('', -1, 3, Date.parse(selectDate));
                    break;
                default:
                    break;
            }
            $('.country .item dd').removeClass('active');
        }
    })
   
    //获取经济数据
    function getEconomicData(country,state,star,date) {
        $.ajax({
            type: 'post',
            data: { countrys: country, releaseState: state, importance: star, releasedDate: date },
            url: '/Calendar/GetCalendarList',
            success: function (data) {
                if (data.code == 0) {
                    dataMain = eval('(' + data.bodyMessage + ')');

                    //if (dataMain.Event.length != 0) {
                    //    overall.noData = false;                       
                    //} else {
                    //    overall.noData = true;                        
                    //}

                    //if (dataMain.Holiday.length != 0) {
                    //     holiday.noData = false;
                    //} else {

                    //    holiday.noData = true;
                    //}
                    
                    //if (dataMain.Economics.length != 0) {
                    //    eco.noData = false;
                    //} else {
                    //    eco.noData = true;
                    //}
                    economicDataArr=dataMain.Economics;

                    //eco.economicData = [];
                    //overall.overallData = [];
                    //holiday.holidayData = [];
                    //关闭正在加载
                    $('.loading').remove();
                    //overall.overallData = dataMain.Event;
                    //holiday.holidayData = dataMain.Holiday;                    
                    //eco.economicData = dataRowspan(dataMain.Economics);
                    economicListRender(dataRowspan(dataMain.Economics));
                    overallListRender(dataMain.Event);
                    holidayListRender(dataMain.Holiday);
                }
            }
        })
    }

    //经济日历渲染
    function economicListRender(data) {
        var str = '';
        var eco = selectType == 'B' ? {
            impact: ['---', '影响较小', '影响较小', '利空 ' + defaultName, '利多 ' + defaultName],
            color: ['blue', 'yellow', 'yellow', 'green', 'red']
        } : {
            impact: ['---', '影响较小', '影响较小', '利多 ' + defaultName, '利空 ' + defaultName],
            color: ['blue', 'yellow', 'yellow', 'red', 'green']
        };
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                str += '<tr>'
                    + (data[i].showSpan ? ('<td class="time" rowspan="' + data[i].RowSpan + '">' + ge_time_format(data[i].AddDate, 3).slice(0, 5) + '</td>') : '')
                    + (data[i].showSpan ? ('<td class="ensign" rowspan="' + data[i].RowSpan + '"><img src="/images/banner/square/' + data[i].CountryImg + '" onerror="javascript:this.src=\'/images/banner/square/default_country.png\'"/></td>') : '')
                    + '<td align="left">' + data[i].Title + '</td>'
                    + '<td>'
                    + '<div class="star-level ' + (data[i].Star > 2 ? '' : 'low') + '">'
                    + '<i style="width:' + (data[i].Star * 20) + '%"></i>'
                    + '</div>'
                    + '</td>'
                    + ((data[i].Revised == '---' || data[i].Revised == 0) ? ('<td>' + data[i].Previous + '</td>') : '')
                    + ((data[i].Revised != '---' && data[i].Revised != 0) ? ('<td><div class="front-val">' + data[i].Revised + '<span>修正前 <br />' + data[i].Previous + '</span></div></td>') : '')
                    + '<td>' + data[i].Consensus + '</td>'
                    + '<td class="highlight">' + (data[i].Actual == '---' ? '未公布' : data[i].Actual) + '</td>'
                    + '<td class="trend ' + (data[i].Star > 2 ? 'greater' : '') + '">'
                    + '<span class="' + eco.color[data[i].Impact] + '">'
                    // 没修改前
                    //+ '<em>' + eco.impact[data[i].Impact] + '</em>'
                     + eco.impact[data[i].Impact]
                    + '</span>'
                    + '</td>'
                    + '<td class="detail">'
                    + '<a href=' + (data[i].UnscrambleId == null ? '"javascript:;' : '"/calendar/unscramble/' + data[i].SourceId + '_' + data[i].UnscrambleId + '_' + data[i].ReleasedDate) + '" target="_blank">'
                    + '<img src="/Images/calendar/detail-link.png" />'
                    + '</a></td></tr>';
            }
        } else {
            str += '<tr>'
                + '<td colspan="9" class="no-data">'
                + '<img src="/Images/calendar/no-info.png" />'
                + '<em>今日无' + ($('.level .item dd:gt(0)').hasClass('active') ? $('.level .item dd.active').text() : '') + '财经数据</em></td></tr>';
        }
        $('#economic').html(str);
    }
    currency();
    //财经大事数据渲染
    function overallListRender(data) {
        var str = '';
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                str += '<tr>'
                    + (data[i].IsDetermine ? '<td class="time">待定</td>' : '<td class="time">' + ge_time_format(data[i].AddDate, 3).slice(0, 5) + '</td>')
                    + '<td class="ensign">' + data[i].Country + '</td>'
                    + '<td>' + data[i].City + '</td>'                   
                    + '<td>'   
                    + '<div class="star-level ' + (data[i].Star > 2 ? '' : 'low') + '">'
                    + '<i style="width:' + (data[i].Star * 20) + '%"></i>'
                    + '</div>'
                    + '</td>'
                    + '<td align="left" class="content">'
                    + (data[i].PeopleImg.length ? '<img src="//' + data[i].PeopleImg + '"/>' : '')
                    + '<p>' + data[i].EventContent + '</p>'
                    + '</td>'
                    + '</tr>';
            }
        } else {
            str += '<tr>'
                + '<td colspan="5" class="no-data">'
                + '<img src="/Images/calendar/no-event.png" />'
                + '<em>今日无财经大事</em></td></tr>';
        }

        $('#overall').html(str);
    }

    //假期信息数据渲染
    function holidayListRender(data) {
        var str = '';
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                str += '<tr>'
                    + '<td class="time">' + new Date(data[i].AddDate).pattern('yyyy-MM-dd') + '</td>'
                    + '<td class="ensign">' + data[i].Country + '</td>'
                    + '<td>' + data[i].Exchange + '</td>'
                    + '<td>' + data[i].HolidayName + '</td>'
                    + '<td>' + data[i].Note + '</td>'
                    + '</tr>';
            }
        } else {
            str += '<tr>'
                + '<td colspan="5" class="no-data">'
                + '<img src="/Images/calendar/no-holiday.png" />'
                + '<em>今日无假期休市安排</em></td></tr>';
        }

        $('#holiday').html(str);
    }

    //实时数据更新
    $('#calendar-socket').attr('src', '/Static/Websocket/Calendar.html' + '?v=' + Date.parse(new Date()));

    signalrFn = function(json) {
       

            var dataMain = eval('(' + json + ')');
            var instantDate = new Date(dataMain.ReleasedDate);        
            if ((new Date(dataMain.ReleasedDate).pattern('yyyy/MM/dd') == $('#date-place').val()) && $('.country .item dd').first().hasClass('active')) {
                if (dataMain.Type == 1 && dataMain.Website == 1) {
                    var SourceId = dataMain.SourceId;
                    var Length = economicDataArr.length;
                    for (var i = 0; i < Length; i++) {
                        if (economicDataArr[i].SourceId == SourceId) {
                            economicDataArr.splice(i, 1, dataMain);
                            break;
                            
                        } else {
                            //如果没有找到
                            if (economicDataArr[i].AddDate > dataMain.AddDate) {
                                //economicDataArr.splice(i, 0, dataMain);
                                break;
                            }
                        }
                    }
                    //重新渲染页面
                    economicListRender(dataRowspan(economicDataArr));
                }
            }
            
       
    }

    //过滤经济数据
    function filterEconomicData(key, val, data) {
        var ecoDataArr = [];
        if (key == 'Star') {
            for (var i = 0; i < data.length; i++) {
                if (data[i][key] >= val) {
                    ecoDataArr.push(data[i]);
                }
            }
            return ecoDataArr;
        }
        for (var i = 0; i < data.length; i++) {
            if (data[i][key] == val) {
                ecoDataArr.push(data[i]);
            }
        }
        return ecoDataArr;
    }
  
    //合并表格数据处理
    function dataRowspan(data) {
        var referDate;
        var referCountry;
        var referIndex;
        for (var i = 0; i < data.length; i++) {

            //删除表格属性
            delete data[i].showSpan;
            delete data[i].RowSpan;
            delete data[i].rowIndex;

            if (i == 0) {
                referDate = new Date(data[i].AddDate).pattern('HH:mm');
                referCountry = data[i].Country;
                data[i].RowSpan = 1;
                data[i].showSpan = true;
                referIndex = i;
                data[i].rowIndex = 0;
            } else {
                if (new Date(data[i].AddDate).pattern('HH:mm') == referDate) {
                    if (data[i].Country == referCountry) {
                        data[referIndex].RowSpan++;
                        data[i].showSpan = false;
                        data[i].rowIndex = data[referIndex].RowSpan - 1;
                    } else{
                        //往前找是否时间国家匹配
                        for (var j = i - 1; j > -1; j--) {
                            if (new Date(data[j].AddDate).pattern('HH:mm') == new Date(data[i].AddDate).pattern('HH:mm')) {
                                if (data[j].Country == data[i].Country) {
                                    data[i].showSpan = false;                                    
                                    data[j - data[j].rowIndex].RowSpan++;
                                    data[i].rowIndex = data[j - data[j].rowIndex].RowSpan - 1;
                                    data.splice(j + 1, 0, data.splice(i, 1)[0]);
                                    referIndex++;
                                    break;
                                } 
                                if (j == 0) {
                                    referIndex = i;
                                    referDate = new Date(data[i].AddDate).pattern('HH:mm');
                                    referCountry = data[i].Country;
                                    data[i].RowSpan = 1;
                                    data[i].showSpan = true;
                                    data[i].rowIndex = 0;
                                }
                            } else {
                                referIndex = i;
                                referDate = new Date(data[i].AddDate).pattern('HH:mm');
                                referCountry = data[i].Country;
                                data[i].RowSpan = 1;
                                data[i].showSpan = true;
                                data[i].rowIndex = 0;
                                break;
                            }
                        }
                    }
                                        
                } else {
                    referIndex = i;
                    referDate = new Date(data[i].AddDate).pattern('HH:mm');
                    referCountry = data[i].Country;
                    data[i].RowSpan = 1;
                    data[i].showSpan = true;
                    data[i].rowIndex = 0;
                }
            }
        }
        return data;
    }

    



    //function dataRowspan(data) {
    //    var referDate;
    //    var referCountry;
    //    var referIndex;
    //    for (var i = 0; i < data.length; i++) {
    //        if (i == 0) {
    //            referDate = new Date(data[i].AddDate).pattern('HH:mm');
    //            referCountry = data[i].Country;
    //            data[i].RowSpan = 1;
    //            data[i].showSpan = true;
    //            referIndex = i;
    //        } else {
    //            if (new Date(data[i].AddDate).pattern('HH:mm') == referDate && data[i].Country == referCountry) {
    //                data[referIndex].RowSpan++;
    //                data[i].showSpan = false;
    //            } else {
    //                referIndex = i;
    //                referDate = new Date(data[i].AddDate).pattern('HH:mm');
    //                referCountry = data[i].Country;
    //                data[i].RowSpan = 1;
    //                data[i].showSpan = true;
    //            }
    //        }
    //    }
    //    return data;
    //}
    
   
})



