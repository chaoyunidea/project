/// <reference path="../../glup/charting_library/static/bundles/objecttreedialog.59da05613e39f35457d5.js" />
/// <reference path="../../glup/charting_library/static/bundles/objecttreedialog.59da05613e39f35457d5.js" />

function tvAction() {
    TradingView.onready(function () {
        var widget = window.tvWidget = new TradingView.widget({
            // 如果背景是黑色  文字是白色的就修改
            //65098行   修改成上升的时候的杠杠颜色  
            //61973行   图的杠杠颜色
            //92768行   errorMessage赋值
            //27723行   蜡烛图颜色赋值
            //25724行   设置开收高低颜色
            //新添加的  回调
            //Varieties 品种
            //Callback  品种发生变化回调
            ParentWindowCallback: {
                Varieties: "",
                resolution: "",
                Ticker:"",
                //bol 是否满屏 浏览器的F11效果   
                //isScreen  默认情况是满屏还是   正常情况     true 为满屏    false 为正常情况
                //Callback  如果不是满屏的时候的回调  isFullscreen  true 为放大执行   false为缩小执行
                fullscreen: {
                    bol: false,
                    isScreen: false,
                    Callback: function (isFullscreen) {
                        var iframe = $('#tv_chart_container').find('iframe');
                        if (!isFullscreen) {
                            iframe.css({ 'position': 'fixed', 'top': '0', 'left': '0' });
                        } else {
                            iframe.css({ 'position': 'relative', 'top': 'auto', 'left': 'auto' });
                        }
                    }
                },
                Callback: function (name, resolution, ticker) {
                    // name  品种名称  time
                    if (window.frames["ChartLine"]) {
                        try {
                            window.frames["ChartLine"].connHunProxy(name, resolution, ticker);
                        } catch (e) { }
                    } else {
                        iframeSignalr(name, resolution, ticker);
                    }
                }
            },
            fullscreen: false, //满屏
            autosize: true,
            //默认选择,通过传递
            symbol: codeName, //code名称
            interval: productId == 4 ? "1D" : 1, //间隔   productId 4 是债券
            container_id: "tv_chart_container", //渲染id
            //	BEWARE: no trailing slash is expected in feed URL
            //datafeed: new Datafeeds.UDFCompatibleDatafeed("http://localhost:1598/api/"),
            //datafeed: new Datafeeds.UDFCompatibleDatafeed("https://demo_feed.tradingview.com"),
            datafeed: new Datafeeds.UDFCompatibleDatafeed("/chartdata", 60000),
            library_path: "/scripts/glup/charting_library/", //插件库地址
            //选择中文
            locale: getParameterByName('lang') || "zh", //语言
            //	Regression Trend-related functionality is not implemented yet, so it's hidden for a while
            drawings_access: { type: 'black', tools: [{ name: "Regression Trend" }] },
            disabled_features: [ 'timeframes_toolbar', 'header_saveload', 'header_screenshot', 'header_compare', 'header_interval_dialog_button', 'use_localstorage_for_settings', 'display_market_status'],
            enabled_features: ["compare_symbol", "chart_scroll", "side_toolbar_in_fullscreen_mode"],
            charts_storage_url: 'http://saveload.tradingview.com',
            charts_storage_api_version: "1.1",
            client_id: 'bailun.com',
            user_id: 'public_user_id',
            custom_css_url: '/Styles/dist/Public/tradingView.css?v=1',
            study_access: {
                type: 'black',
                tools: [{
                    name: 'MACD',
                    grayed: true
                }]
            },
            height: 600,
            width: '100%',
            logo: { 'image': '/images/public/chart-logo.png', 'link': 'javascript:;' },
            debug: false,
            overrides: {
                //  在library的19813行  TradingView.defaultProperties里面的所有设置
                'mainSeriesProperties.candleStyle.upColor': '#000',
                "mainSeriesProperties.candleStyle.borderUpColor": '#00b149',
                "mainSeriesProperties.candleStyle.downColor": "#d9ead3",
                "mainSeriesProperties.candleStyle.borderDownColor": "#00b149",
                "mainSeriesProperties.candleStyle.wickUpColor": "#00ff00",
                "mainSeriesProperties.candleStyle.wickDownColor": "#00ff00",
                "paneProperties.background": "#000",
                "paneProperties.vertGridProperties.color": "rgba(20,20,20,0)",
                "paneProperties.horzGridProperties.color": "rgba(20,20,20,0)",
                "paneProperties.crossHairProperties.style": 0,
                "paneProperties.legendProperties.showSeriesTitle": false,
                "scalesProperties.textColor": "rgba(255, 255, 255, 0.8)",
                "symbolWatermarkProperties.color": 'rgba( 0, 0, 0, 0)' //背景里面的货币对文字的颜色和透明度
            },
            timezone: "Asia/Hong_Kong"

            // snapshot_url: 'https://fxchatimage.fx110.com/',
            //"hide_side_toolbar":true

        });

        widget.onChartReady(function () {

            widget.chart().createStudy('Moving Average', false, false, [5, 'close', 0], null, { "Plot.color": "red" });
            widget.chart().createStudy("Moving Average", false, false, [10, 'close', 0], null, { "Plot.color": "yellow" });
            widget.chart().createStudy("Moving Average", false, false, [20, 'close', 0], null, { "Plot.color": "blue" });
            widget.chart().createStudy("MACD", false, false, [10 + parseInt(Math.random() * 10), 3 + parseInt(Math.random() * 3)], null, {
                "Histogram.color": "#00b149",
                "MACD.color": "#52f9fa",
                "Signal.color": "rgba(255,26,48,1)"
            });

            widget.createButton().text('MT4风格').on('click', function () {
                widget.applyOverrides({
                    'symbolWatermarkProperties.color': 'rgba(66, 66, 66, 0.08)',
                    'mainSeriesProperties.candleStyle.upColor': '#000',
                    "mainSeriesProperties.candleStyle.borderUpColor": '#00b149',
                    "mainSeriesProperties.candleStyle.downColor": "#d9ead3",
                    "mainSeriesProperties.candleStyle.borderDownColor": "#00b149",
                    "mainSeriesProperties.candleStyle.wickUpColor": "#00ff00",
                    "mainSeriesProperties.candleStyle.wickDownColor": "#00ff00",
                    "paneProperties.background": "rgba(0,0,0,1)",
                    "paneProperties.vertGridProperties.color": "rgba(20,20,20,0)",
                    "paneProperties.horzGridProperties.color": "rgba(20,20,20,0)",
                    "paneProperties.crossHairProperties.style": 0,
                    "scalesProperties.textColor": "rgba(255, 255, 255, 0.8)",
                    "symbolWatermarkProperties.color": 'rgba( 0, 0, 0, 0)' //背景里面的货币对文字的颜色和透明度
                });

                $('#tv_chart_container').find('iframe').contents().find('.pane-legend').css('color', 'rgba(255, 255, 255, 0.8)');
            });
            widget.createButton().text('普通风格').on('click', function () {
                widget.applyOverrides({
                    'mainSeriesProperties.candleStyle.upColor': 'rgba(255,26,48,1)',
                    "mainSeriesProperties.candleStyle.borderUpColor": 'rgba(255,26,48,1)',
                    "mainSeriesProperties.candleStyle.downColor": "#00b149",
                    "mainSeriesProperties.candleStyle.borderDownColor": "#00b149",
                    "mainSeriesProperties.candleStyle.wickUpColor": "rgba(0, 0, 0, 0.3)",
                    "mainSeriesProperties.candleStyle.wickDownColor": "rgba(0, 0, 0, 0.3)",
                    "paneProperties.background": "rgba(255,255,255,1)",
                    "paneProperties.vertGridProperties.color": "rgba(230,230,230,1)",
                    "paneProperties.horzGridProperties.color": "rgba(230,230,230,1)",
                    "scalesProperties.textColor": "rgba(0,0,0,.7)",
                    "symbolWatermarkProperties.color": 'rgba( 0, 0, 0, 0)' //背景里面的货币对文字的颜色和透明度
                });
                $('#tv_chart_container').find('iframe').contents().find('.pane-legend').css('color', 'rgba(0,0,0,.7)');
            });

            //widget.createButton().text('用户实时的图表跟报价存在一定延迟').css({ 'border': 'none', 'background': 'transparent' }).parent().css('float', 'right');
        });
        function iframeSignalr(Varieties, resolution, ticker) {
            var iframe = document.createElement('iframe');
            iframe.setAttribute('height', '0');
            iframe.setAttribute('width', '0');
            iframe.setAttribute('block', 'none');
            iframe.name = "ChartLine";
            iframe.id = "ChartLine";
            iframe.src = "/static/websocket/ChartLine.html?Varieties=" + Varieties + "&resolution=" + resolution + '&Ticker=' + ticker + '&v=' + Date.parse(new Date());
            document.body.appendChild(iframe);
            return iframe;
        }
    });
}
//TradingView
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

tvAction();