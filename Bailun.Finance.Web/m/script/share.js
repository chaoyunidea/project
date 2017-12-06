require(["molieInit", 'IsLoadMethod'], function (init,IsLoadMethod) {

  
    document.getElementById("isload").onclick = function () {
        init.wechatMethod() ? $(".mask").show() : IsLoadMethod.init()
    }
    var sourceid = GetQueryString('SourceId'), addtime = GetQueryString('releaseTime'), webSite = GetQueryString('webSite');
    $.ajax({
        type: 'GET',
        url: config.Bailun + '/api/FinanceNewsApi/GetNewsDetail?sourceId=' + sourceid + '&releaseTime=' + addtime + '&webSite=' + webSite,
        dataType: 'json',
        context: $('body'),
        success: function (data) {
            var d = jsonFn(jsonFn(data).bodyMessage), SmallImg = d.SmallImg ? d.SmallImg : "";
            var imgsrc = SmallImg != "" ? '<img src="' + jsonFn(SmallImg)[0].Big + '"data-preview-src="" data-preview-group="1" style="padding-top: .3rem;max-width:9rem;  margin: auto; display: block;">' : "";
            $('.ct-name-time span').text(ge_time_format(d.AddDate, 1));//时间
            
            $('.ct-c').html(d.Title + imgsrc);//内容
            mui.previewImage();
        },
        error: function (xhr, type) {
            console.log(xhr);
        }
    })


    $('.mask').click(function () { $(this).hide();})
})
/*
"{\"Id\":123123,
\"Title\":\"美元兑菲律宾比索上涨0.5%至51.620，创2006年8月以来最高\",
\"Level\":1,
\"Author\":null,
\"Website\":4,
\"SmallImg\":null,
\"AddDate\":1503024967000,
\"SourceId\":\"201708181056072036\",
\"Status\":1,
\"Clicks\":0,
\"Collects\":0}"
*/