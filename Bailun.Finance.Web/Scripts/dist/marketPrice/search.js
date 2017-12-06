require([js.newss, js.controlBar], function (news, controlBar) {
    //news.Fn.Init();
    //controlBar.controlFn();

    var productJson = { 1: ['外汇', 'Forex'], 2: ['大宗商品', 'CommodityFutures'], 3: ['股指', 'Major_indices'], 4: ['债券', 'Bonds'], 5: ['外汇期货', 'cfdindices'], 'ashares': ['沪深', 'ashares'], 'hkstock': ['港股', 'hkstock'], 'usstock': ['美股', 'usstock'], 9: ['比特币', 'BitCon'], 10: ['股指期货', 'IndexFutures'], 11: ['贵金属', 'MetalsFutures'] };

    var keywords = decodeURI(decodeURI(GetQueryString('?keyword')));
    var pagesize = 8;

    $('#loading').openMask({ image: '/Images/1.0.0/Icon/loading.gif', isMask: false, Method: function () {
            $('#loading').height(600);
        } });

    if (keywords) {
        requestSearchList(keywords);
        $('.keywords').val(keywords);
    }

    //点击搜索按钮
    $('.search-btn').on('click', function () {
        var searchVal = $(this).siblings('.keywords').val();
        if (searchVal === '') {
            layer.msg('搜索内容不能为空');
            return false;
        }
        requestSearchList(searchVal);
    });

    $('.search-group').openMask({ image: '/Images/public/loading.gif', isMask: false }).css('height', '800');

    //监听文本框值变化
    $('.keywords').on('input propertychange', function () {
        var searchVal = $(this).val();
        if (searchVal === '') {
            return false;
        }
        //searchFn(searchVal);
        requestSearchList(searchVal);
    });

    //点击页面其他位置隐藏设置
    $(document).on('click', function (event) {
        var targetEl = $(event.target);
        if (!targetEl.parents().hasClass('search-bar') && $('.search-bar').hasClass('active')) {
            $('.search-bar').removeClass('active');
        }
    });

    //获取搜索结果数据
    function requestSearchList(word) {
        $.ajax({
            url: '/marketprice/GetQueryMarketMethod',
            data: { pagesize: 500, pageindex: 1, condition: encodeURIComponent(word) },
            type: "POST",
            success: function (data) {
                if (data.code == 0) {
                    dataMain = eval('(' + data.bodyMessage + ')');
                    searchDataSort(dataMain);
                    $('.search-group').closeMask().css('height', 'auto');
                } else {
                    searchDataSort([]);
                }
            }
        });
    }

    //查询数据分类
    function searchDataSort(data) {
        //no data
        if (!data.length) {
            $('.search-group').html('<div class="no-data"><img src="/Images/public/Nocontent.png" /><p>没有相关内容，换个关键词搜一搜吧。</p></div>');
            return;
        }
        var searchPackage = {};
        for (var i = 0; i < data.length; i++) {
            var product = data[i].ProductId;
            if (!searchPackage[data[i].ProductId]) {
                searchPackage[product] = [];
            }
            searchPackage[product].push(data[i]);
        }

        //清空
        $('.search-group').empty();
        for (var j in searchPackage) {
            searchListRender(j, searchPackage[j]);
        }
    }

    //渲染列表数据
    function searchListRender(index, data) {
        var str = '';
        str += '<div class="area price">' + '<div class="heading clearfix">' + '<h3>' + productJson[index][0] + '</h3>' + '<span>搜索结果：' + data.length + '条</span>' + '</div>' + '<div class="content">' + '<ul class="clearfix">';

        for (var i = 0; i < data.length; i++) {
            str += '<li>' + '<a href="/marketprice/' + (5 < index && index < 9 ? 'stockdetail' : 'detail') + '/' + data[i].MarketId + '" target="_blank" class="clearfix">' + '<h4 class="name">' + data[i].Cn_Name + '</h4>' + '<p class="code">代码 <em>' + data[i].Code + '</em></p>' + '</a>' + '</li>';
        }
        str += '</ul></div><div id="kkpager"></div></div>';
        $('.search-group').append(str);
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
});