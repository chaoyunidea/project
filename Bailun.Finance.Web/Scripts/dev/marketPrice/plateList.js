require([js.newss, js.controlBar,js.calendar], function (news, controlBar,calendar) {
    //news.Fn.Init();
    controlBar.controlFn();

    var productJson = { 6: ['沪深', 'ashares'], 7: ['港股', 'hkstock'], 8: ['美股', 'usstock'] };

    function breadRender() {
        var str = '<span><a href="/marketprice/index">市场报价</a> > </span> <span><a href="/marketprice/' + productJson[productId][1]
            + '">' + productJson[productId][0] + '</a> </span>';
        $('.left .bread').append(str);
    }

    breadRender();
    getPlateList(productId);

    //点击页面其他位置隐藏设置
    $(document).on('click', function (event) {
        var targetEl = $(event.target);
        if (!targetEl.parents().hasClass('set-box') && $('.plate-select').hasClass('active')) {
            $('.plate-select').removeClass('active');
        }
    })

    //获取品种种类列表
    function getPlateList(id) {
        $.ajax({
            type: 'post',
            data: { product: productId, pagesize:100, pageindex: 1, ClassificationType: 1 },
            url: '/MarketPrice/QueryPlatInfoByProduct',
            success: function (data) {
                if (data.code == 0) {
                    var dataMain = eval('(' + data.bodyMessage + ')');
                    $('.plateList').append(renderPlateList(dataMain));
                }
            }
        })
    }

    //生成品种种类列表
    function renderPlateList(data) {
        var str = '';
        var count = 0;
        str += '<li class="clearfix">';
        for (var i = 0; i < data.length; i++) {
            if (count < 8) {
                str += '<a href="/marketprice/stocklist/' + data[i].ProductType  + '-' + data[i].AutoId + '" title="' + data[i].PlateName + '">' + data[i].PlateName + '</a>';
                count++;
            } else {
                str += '</li><li class="clearfix">';
                count = 0;
            }
        }
        return str;
    }


    //数据翻页
    function kkpagerFn(pageIndex, totalPages) {
        kkpager.generPageHtml({
            type: "kkpager",
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
            click: function (n) {
                this.selectPage(n);
                requestPlateDataFn(n);

            }
        }, true);
    }

})