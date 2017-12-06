var priceMenuEle = getElementsByClassName(document, 'price-nav');
var priceMenuLiEle = priceMenuEle[0].getElementsByTagName('li');
var priceLinkMap = {
    'marketprice\/index|(bj.bailun.com\/$)': 'marketIndex',
    'marketprice\/list\/forex': 'forex',
    'marketprice\/list\/goods': 'goods',
    'marketprice\/list\/indices': 'indices',
    'marketprice\/list\/bonds': 'bonds',
    'marketprice\/list\/cfdindices': 'cfdindices',
    'marketprice\/ashares|stocklist\/6|stockdetail\/6|platelist\/6': 'ashares',
    'marketprice\/hkstock|stocklist\/7|stockdetail\/7|platelist\/7': 'hkstock',
    'marketprice\/usstock|stocklist\/8|stockdetail\/8|platelist\/8': 'usstock',
    'marketprice\/list\/bitcoin': 'bitcoin',
    'marketprice\/list\/stockIndex': 'stockIndex',
    'marketprice\/list\/metals': 'metals'
};
var queryString = localUrl.slice(0);
var dataActive = '';
for (var i in priceLinkMap) {
    if (new RegExp(i, 'i').test(queryString)) {
        dataActive = priceLinkMap[i];
        break;
    }
}

for (var i = 0; i < priceMenuLiEle.length; i++) {
    var activeAttr = priceMenuLiEle[i].getAttribute('data-active');
    if (activeAttr == dataActive) {
        priceMenuLiEle[i].className = 'active';
        break;
    }
}