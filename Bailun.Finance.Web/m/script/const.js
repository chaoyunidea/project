

var Local =
{
    //开发
    singnalrUrl: 'https://ga.fxchatnews.fx110.com/',
    FXUrl: 'https://devmswebapi.fx110.com/', //主站API接入(商城)
    OKRUrl: 'https://devfxchatapi.fx110.com/', //汇信API
    ForumApi: 'https://devfxchatbbs.fx110.com/',//分享论坛帖子API
    NewsPush: 'https://ga.fxchatquotes.fx110.com/', //新闻、跟单推送API
    BrokerSpread: 'https://gadynamicspread.fx110.com/', //点差表、隔夜利息 signalr
    Rank: 'http://114.55.178.248:8025/',//牛人榜
    Bailun: 'https://testquoteapi.bailun.com/'
}



var Developement =
{
    //测试
    singnalrUrl: 'https://ga.fxchatnews.fx110.com/',
    FXUrl: 'https://testmswebapi.fx110.com/', //主站API接入(商城)
    OKRUrl: 'https://testfxchatapi.fx110.com/', //汇信API
    ForumApi: 'https://testfxchatbbsapi.fx110.com/',//分享论坛帖子API
    NewsPush: 'https://ga.fxchatquotes.fx110.com/', //新闻、跟单推送API
    BrokerSpread: 'https://gadynamicspread.fx110.com/', //点差表、隔夜利息 signalr
    Rank: 'http://114.55.178.248:8025/', //牛人榜
    Bailun: 'https://testquoteapi.bailun.com/'
}

var PreRelease =
{
    //预发布
    singnalrUrl: 'https://ga.fxchatnews.fx110.com/',
    FXUrl: 'https://premswebapi.fx110.com/', //主站API接入(商城)
    OKRUrl: 'https://prefxchatapi.fx110.com/', //汇信API
    ForumApi: 'https://prefxchatbbsapi.fx110.com/',//分享论坛帖子API
    NewsPush: 'https://ga.fxchatquotes.fx110.com/', //新闻、跟单推送API
    BrokerSpread: 'https://gadynamicspread.fx110.com/', //点差表、隔夜利息 signalr
    Rank: 'http://114.55.178.248:8025/', //牛人榜
    Bailun: 'https://testquoteapi.bailun.com/'
}


var Release =
{
    //发布
    singnalrUrl: 'https://ga.fxchatnews.fx110.com/',
    FXUrl: 'https://gamswebapi.fx110.com/', //主站API接入(商城)
    OKRUrl: 'https://gafxchatapi.fx110.com/', //汇信API
    ForumApi: 'https://gafxchatbbsapi.fx110.com/',//分享论坛帖子API
    NewsPush: 'https://ga.fxchatquotes.fx110.com/', //新闻、跟单推送API
    BrokerSpread: 'https://gadynamicspread.fx110.com/', //点差表、隔夜利息 signalr
    Rank: 'http://114.55.178.248:8025/', //牛人榜
    Bailun: 'https://gaapi.bailun.com'

}
function Create(type) {
    switch (parseInt(type)) {
        case 1:
            return Local;
            break;
        case 2:
            return Developement;
            break;
        case 3:
            return PreRelease;
            break;
        case 4:
            return Release;
        default:
            break;
    }

}

 

 	
 
 	
var Consts = 
{ 

	_browseType: { //手机类型枚举
	    Android: 1,
	    Ios: 2
	}, 
	_IosType: {  //苹果手机类型
	    iPhone :1,
	    iPod: 2,
	    iPad: 3
	},
	_AppRoute: { //汇信APP 打开的路径
	    Default: 'com.bailun://',  //安卓App默认地址   首页
	    IosDefault: 'com.bailun://', //Ios App默认地址
	    IosLoadLink: 'https://itunes.apple.com/cn/app/hui-xinpro/id1153918935?mt=8',//Ios汇信版的下载链接
	    AndroidLoadLink: 'https://gafxchatimage.fx110.com/api/bailun/bailunfinance_beta.apk'//安卓版汇信的下载链接
	}
}
    // 1  开发
 	// 2  测试
 	// 3  预发布
 	// 4  发布
 	
 			var config =  Create(4);
 			for(var tem in config){
				Consts[tem]=config[tem];
			}





