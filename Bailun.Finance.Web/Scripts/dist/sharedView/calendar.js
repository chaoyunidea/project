//获取分布页财经日历数据
//ca = avalon.define({
//    $id: 'calendar',
//    calendarData: [],
//    starFn: function (star) {
//        var str = '';
//        for (var i = 0; i < star; i++) {
//            str += '<img src="/Images/news/star-on.png" />';
//        }
//        for (var i = 0; i < 5 - star; i++) {
//            str += '<img src="/Images/news/star-off.png" />'
//        }
//        return str;
//    }
//})
//$('.area.calendar .content').openMask({ image: '/Images/public/loading.gif', isMask: false });
//getCalendarData();

//获取分布页财经日历数据
//function getCalendarData() {
//    $.ajax({
//        type: 'post',
//        url: '/Calendar/GetFinanceEconomicsNew',
//        data: { topSize: 4, },
//        success: function (data) {
//            if (data.code == 0) {                
//                var dataMain = JSON.parse(data.bodyMessage);
//                for (var i = 0; i < dataMain.length; i++) {
//                    dataMain[i].Star = ca.starFn(parseInt(dataMain[i].Star));
//                }

//                ca.calendarData = dataMain;
//                $('.area.calendar .content').closeMask();
//            }
//        }
//    })
//}

define(function () {

    //var currentDate = new Date().getDate();
    var calendarId = [];
    //var calendarGroup = currentCalendarData.slice(0, 4);

    function getEconomicData() {
        $.ajax({
            type: 'post',
            data: { topSize: 4 },
            url: '/Calendar/GetFinanceEconomicsNew',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    renderCalendarList(dataMain);
                    //currentCalendarData = dataMain.Economics;
                    //calendarGroup = dataMain.Economics.slice(0, 4);
                    //renderCalendarList(calendarGroup);
                }
            }
        });
    }

    refreshCalendar = function (json) {

        //if (new Date(json.ReleasedDate).getDate() > currentDate) {
        //    getEconomicData(country, state, star, Date.parse(new Date()));            
        //    currentDate = new Date().getDate();
        //    return;
        //}

        if (json.Website == 1 && json.Type == 1) {

            //是否已推送过了
            if (calendarId.indexOf(json.SourceId) == -1) {
                calendarId.push(json.SourceId);
            } else {
                return;
            }

            getEconomicData();
            //var calendarGroupCopy = $.extend([], calendarGroup);
            //for (var i = 0; i < calendarGroup.length; i++) {
            //    if (calendarGroup[i].SourceId == json.SourceId) {
            //        calendarGroupCopy[i] = addUnscrambleId(json);
            //        break;
            //    }

            //    if (i == calendarGroup.length - 1) {
            //        calendarGroupCopy.shift();
            //        calendarGroupCopy.push(addUnscrambleId(json));
            //    }
            //}

            //renderCalendarList(calendarGroupCopy);
            //calendarGroup = $.extend([], calendarGroupCopy);
        }
    };

    function addUnscrambleId(data) {
        for (var i = 0; i < currentCalendarData.length; i++) {
            if (currentCalendarData[i].SourceId == data.SourceId) {
                data.UnscrambleId = currentCalendarData[i].UnscrambleId;
                break;
            }
        }
        return data;
    }

    function renderCalendarList(data) {
        var str = '';
        for (var i = 0; i < data.length; i++) {
            str += '<li><a href="/calendar/unscramble/' + data[i].SourceId + "_" + (data[i].UnscrambleId || '0') + "_" + data[i].ReleasedDate + '" target="_blank">' + '<div class="time clearfix">' + ' <em>' + new Date(data[i].ReleasedDate).pattern("HH:mm") + '</em>' + '<div class="star-union">' + renderStar(data[i].Star) + '</div>' + '</div>' + '<div class="title clearfix">' + '<img src="/images/banner/rectangle/' + data[i].CountryImg + '" class="flag" />' + '<em class="nation">' + data[i].Country + '</em>' + ' <em class="title-con">' + data[i].Title + '</em>' + '</div>' + '<div class="param clearfix">' + '<p>今值: <em>' + data[i].Actual + '</em></p>' + '<p>预测: <em>' + data[i].Consensus + '</em></p>' + '<p>前值: <em>' + (data[i].Revised == "---" ? data[i].Previous : data[i].Revised) + '</em></p>' + '</div></a></li>';
        }
        $('.calendar .calendar-list').html(str);
    }

    function renderStar(star) {
        var str = '';
        for (var i = 0; i < star; i++) {
            str += '<img src="/Images/news/star-on.png" />';
        }
        for (var i = 0; i < 5 - star; i++) {
            str += '<img src="/Images/news/star-off.png" />';
        }
        return str;
    }
});