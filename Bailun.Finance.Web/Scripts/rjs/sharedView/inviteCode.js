$(function () {

    // 判断移动端还是web的方法
      function IsPC() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone",
                        "SymbianOS", "Windows Phone",
                        "iPad", "iPod"];
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
       }

      if (!IsPC()) {  $("#entry-code").css({"position":"relative","top":"-1280px"}) }

    //对用户进行cookie操作
    function getCookie(name) {
        try {
            var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if (arr = document.cookie.match(reg)) {
                //  return unescape(arr[2]);
                return decodeURIComponent(arr[2]);
            } else {
                return null;
            }
        } catch (e) { return null; }
    }
    // 存入Cookie
    function setCookie(name, value, time) {
        var strsec = getsec(time);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec * 1);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
    }
    //转换时间格式
    function getsec(str) {
        var str1 = str.substring(1, str.length) * 1;
        var str2 = str.substring(0, 1);
        switch (str2) {
            case "s": return str1 * 1000;
            case "m": return str1 * 60 * 1000;
            case "h": return str1 * 60 * 60 * 1000;
            default: return str1 * 24 * 60 * 60 * 1000;
        }
    }
    var timeCount = 60, timer;
    // 倒计时
    function Countdown(timeCount) {
        if (timeCount == 0) {
            $(".mask").text("获取验证码");
            $("#ver-code").attr("disabled", false)
            $("#close-page").css({ "display": "block" })
            $(".mask").css({ "backgroundColor": "#fff", "cursor": "pointer"});
            clickFn(0);
            return;
        } else {
            $(".mask").css({ "cursor": "default" });
            $(".mask").text(timeCount + '秒后重发');
            timeCount--;
        }
        timer = setTimeout(function () {
            Countdown(timeCount);
        }, 1000);
    }
    
    var mobile;
    //获取验证码
    function getInvitationeCode(invitationCode) {
        $.ajax({
            url: '/OpenBeta/CheckInvitationCode',
            type: 'post',
            data: { invitationCode: invitationCode },
            success: function (data) {
                if (data.code == "0") {
                    mobile = eval('(' + data.bodyMessage + ')');
                    $("#error").css({ "color": "#3cc75d" });
                    $("#error").text("验证码已发送到您手机");
                    $('#invite').attr("disabled", false);
                    $('#mask').css({ 'backgroundColor': '#fff' })
                    
                    return mobile;
                } else {
                    //恢复文本框禁用，恢复禁用样式
                    $('#invite').attr('disabled', true);
                    $('#close-num').css({ 'display': 'none' });
                    $('#mask').css({ 'backgroundColor': '#efefef' })
                    $('#invite').val('');
                    $("#invite-error").text("");
                    $("#ValCode").css({ "backgroundColor": "#69d2ff", "cursor": "default" });
                    //输入邀请码后提示,解除倒计时
                    $("#error").css({ 'color': "rgba(225,9,28,.7)" })
                    $("#error").text("您输入的邀请码不正确");
                    clearTimeout(timer);
                    Countdown(0);
                    //$('.mask').text('获取验证码');
                    //$('#ver-code').attr('disabled', false);
                    //$('#close-page').css({ "display": "block" });
                    //$('.mask').css({ 'backgroundColor': "#fff" });
   
                }
            }
        })
    }
    // 点击进入拜仑财经页面      
    function getInviteCode(mobile, smsCode, invitationCode) {
        $.ajax({
            //url: '/OpenBeta/CheckInvitationCode',
            url: '/OpenBeta/CheckSmsCode',
            type: 'post',
            data: { mobile: mobile, smsCode: smsCode, invitationCode: invitationCode },
            success: function (data) {
                if (data.code == "0" && data.subCode == "32100") {
                    // 提交成功跳转页面
                    $("#invite-error").text("");
                    document.location.href = urlRedirect;

                    //setCookie("userName", "888", "h30000000000");
                } else {
                    $("#invite-error").text("您输入的验证码有误");

                }
            }
        })
    }
    // 按钮以及开关的样式设置
    $('#invite').attr('disabled', true);
    $('#mask').css({ 'backgroundColor': '#efefef'})


    $("#close-page").hover(function () {
        $("#close").attr("src", "../../../Images/news/cloesPage.png");
    }, function () {
        $("#close").attr("src", "../../../Images/news/hui.png");
    });
    $("#close-num").hover(function () {
        $("#close-img").attr("src", "../../../Images/news/cloesPage.png");
    }, function () {
        $("#close-img").attr("src", "../../../Images/news/hui.png");
    });
    if ($("#ver-code").val() != "" && $("#ver-code").val() != "邀请码") {
        $(".mask").css({ "color": "#09acf3", "cursor": "pointer" });
    } else {
        $("#error").text('');
    }
    if ($("#invite").val() != ''&&$("#invite").val() !='验证码') {
        $("#ValCode").css({ "backgroundColor": "#09acf3", "cursor": "pointer" });
    } else {
        $("invite-error").text('');
    }
    // 邀请码
    $('#ver-code').on('keyup', function () {
        var codeValue = $(this).val();
        if (codeValue == '') {
            $('#close-page').css({ "display": "none" });
            $('.mask').css({ "color": "#69d2ff", "cursor": "default" });
            $("#error").text('');
        } else {
            $('#close-page').css({ "display": "block" });
            $(".mask").css({ "color": "#09acf3", "cursor": "pointer" });

        }
    });
    $('#close-page').on('click', function () {
        $('#ver-code').val('');
        $('#error').text('');
        $(this).css({ "display": "none" });
        $('.mask').css({ "cursor": "default", "color": "#69d2ff" })
    })
    // 检查验证码的input值
    $('#invite').on('keyup', function () {
        var codeValue = $(this).val();
        if (codeValue == '') {
            $('#close-num').css({ "display": "none" });
            $('#ValCode').css({ "backgroundColor": "#69d2ff", "cursor": "default" });
            $("#invite-error").text('');
        } else {
            $('#close-num').css({ "display": "block" });
            $("#ValCode").css({ "backgroundColor": "#09acf3", "cursor": "pointer" });
        }
    });
    $('#close-num').on('click', function () {
        $('#invite').val('');
        $('#invite-error').text('');
        $(this).css({ "display": "none" });
        $('#ValCode').css({ "cursor": "default", "backgroundColor": "#69d2ff" })
    });
    clickFn(0)
    // 点击获取验证码时禁止再次点击
    function clickFn(type) {
        switch (type) {
            case 0:
                $('.mask').on('click', function () {
                    var invitationCode = $('#ver-code').val();
                    // 兼容ie9
                    if (invitationCode != '' && invitationCode!='邀请码') {
                        // 检测邀请码是否输入小写字母
                        var patrn = /[a-z]/;
                        if (patrn.exec(invitationCode)) {
                            $("#error").css({ 'color': "rgba(225,9,28,.7)" })
                            $("#error").text("您输入的邀请码不正确(区分大小写)");
                            $('#invite').attr('disabled', true);
                            $('#close-num').css({ 'display': 'none' });
                            $('#mask').css({ 'backgroundColor': '#efefef' })
                            $('#invite').val('');
                            $("#invite-error").text("");
                            $("#ValCode").css({ "backgroundColor": "#69d2ff", "cursor": "default" });
                            return;
                        }
                        // 输入格式正确
                        Countdown(timeCount);
                        $(this).css({ "backgroundColor": "#efefef" })
                        clickFn(1);
                        $('#ver-code').attr('disabled', true);
                        $('#close-page').css({ "display": "none" });
                        getInvitationeCode(invitationCode);
                    } else {
                        //$("#error").text("");
                        $('.mask').off('click');
                        clickFn(0);
                        $('#ver-code').attr('disabled', false);
                    }

                });
                break;
            case 1:
                $('.mask').off('click');
                break;
            default:
                break;
        }
    }

    $('#ValCode').on('click', function () {
        var smsCode = $('#invite').val();
        var invitationCode = $('#ver-code').val();
        if (smsCode != '' && smsCode != '验证码') {
            getInviteCode(mobile, smsCode, invitationCode);
        } else {
            //$("#invite-error").text("");

        }
    })

})