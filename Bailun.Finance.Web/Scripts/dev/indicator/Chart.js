
require.config({
    paths: {
        echarts: 'http://echarts.baidu.com/build/dist'
    }
});

require(
    [
                'echarts',
                'echarts/chart/bar', // 使用柱状图就加载bar模块，按需加载
                'echarts/chart/line',
                'echarts/chart/pie'
    ],

    function (ec) {

        var myChart2 = ec.init(document.getElementById('main2'));
        var myChart3 = ec.init(document.getElementById('main3'));
        var myChart4 = ec.init(document.getElementById('main4'));
       
             
     // 以下是前值，今值，预测分开的图表
        option2 = {
            title: {
                text: '前值(万人)',
                left: 'center'
            },
            tooltip : {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true
                    }
                }
            },
            //legend: {
            //    data:['前值']
            //},
            toolbox: {
                show : true,
                feature : {
                    mark : {show: true},
                    dataZoom : {show: true},
                    dataView : {show: true},
                    magicType : {show: true, type: [ 'bar','line' ]},
                    restore : {show: true},
                    saveAsImage: { show: true }
                }
            },
            color: ['#3fd1fb', '#7fe1fd', '#00b5e9', '#239abc', '#afedff', '#00a4d3'],
            calculable: true,
            dataZoom: {
                show:false,
                realtime: true,
                start: 20,
                end: 80
            },
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : function (){
                        var list = [];
                        for (var i = 1; i <= 30; i++) {
                            list.push('2013-03-' + i);
                        }
                        return list;
                    }()
                }
            ],
            yAxis: [
                {
                    type : 'value',
                    scale:true,
                    axisLabel : {
                        formatter: '{value} 万'
                    },
                    max: 30,
                    min: 0
                }
            ],
            series: [
                {
                    //name: '前值',
                    type: 'line',
                    data: function () {
                        var list = [];
                        for (var i = 1; i <= 30; i++) {
                            list.push(Math.round(Math.random() * 10));
                        }
                        return list;
                    }()
                }
            ]
        };
        myChart2.setOption(option2);
       
        option3 = {
            title: {
                text: '今值(万人)',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true
                    }
                }
            },
            //legend: {
            //    data: ['今值']
            //},
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataZoom: { show: true },
                    dataView: { show: true },
                    magicType: { show: true, type: ['bar', 'line'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            color: ['#afedff', '#00a4d3', '#3fd1fb', '#7fe1fd'],
            calculable: true,
            dataZoom: {
                show: false,
                realtime: true,
                start: 20,
                end: 80
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: function () {
                        var list = [];
                        for (var i = 1; i <= 30; i++) {
                            list.push('2013-03-' + i);
                        }
                        return list;
                    }()
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        formatter: '{value} 万'
                    },
                    max: 30,
                    min: 0
                }
            ],
            series: [
                {
                    //name: '今值',
                    type: 'line',
                    data: function () {
                        var list = [];
                        for (var i = 1; i <= 30; i++) {
                            list.push(Math.round(Math.random() * 10));
                        }
                        return list;
                    }()
                }
            ]
        };
       
        
        myChart3.setOption(option3);

        option4 = {
            title: {
                text: '预测值(万人)',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow',
                    label: {
                        show: true
                    }
                },
            },
            //legend: {
            //    data: ['预测']
            //},
            toolbox: {
                show: true,
                feature: {
                    mark: { show: true },
                    dataZoom: { show: true },
                    dataView: { show: true },
                    magicType: { show: true, type: ['bar', 'line'] },
                    restore: { show: true },
                    saveAsImage: { show: true }
                }
            },
            color: [  '#00a4d3', '#3fd1fb', '#7fe1fd'],
            calculable: true,
            dataZoom: {
                fillerColor: '#8EE6FF',
                handleColor: '#00b5e9',
                show: true,
                realtime: true,
                start: 20,
                end: 80
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: function () {
                        var list = [];
                        for (var i = 1; i <= 30; i++) {
                            list.push('2013-03-' + i);
                        }
                        return list;
                    }()
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    scale: true,
                    axisLabel: {
                        formatter: '{value} 万人'
                    },
                    max: 30,
                    min: 0
                }
            ],
            series: [
                {
                    //name: '预测',
                    type: 'line',
                    data: function () {
                        var list = [];
                        for (var i = 1; i <= 30; i++) {
                            list.push(Math.round(Math.random() * 10));
                        }
                        return list;
                    }()
                }
            ]
        };

      
        myChart4.setOption(option4);

        myChart2.connect([myChart3, myChart4]);
        myChart3.connect([myChart2, myChart4]);
        myChart4.connect([myChart2, myChart3]);

        setTimeout(function () {
            window.onresize = function () {
                myChart2.resize();
                myChart3.resize();
                myChart4.resize();
            }
        }, 200)

        

    }
);