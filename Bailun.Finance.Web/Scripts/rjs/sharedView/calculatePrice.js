define(function () {

    //统一涨跌幅涨跌额
    function calculateUpDown(data) {
        var priceLimit, priceExchange;
        if (data.PriceLimit != "") {
            priceLimit = data.PriceLimit ? data.PriceLimit : '0.000';
            priceExchange = data.PriceExchange ? data.PriceExchange : '0.00%';
        } else {
            priceLimit = subtr(data.CurrentPrice,data.OpenPrice);
            priceExchange = (data.OpenPrice == 0 ? '0.00' : toFixeds((parseFloat(data.CurrentPrice - data.OpenPrice) / Math.abs(data.OpenPrice) * 100), 2));
            priceLimit = (priceLimit > 0 ? '+' : '') + priceLimit;
            priceExchange = (priceLimit > 0 ? '+' : '') + priceExchange + '%';
        };
        return {
            priceLimit: priceLimit,
            priceExchange: priceExchange
        }
    }
    //小数点精度
    function subtr(arg1, arg2) {
        var r1, r2, m, n;
        try{
            r1 = arg1.toString().split('.')[1].length;
        } catch (e) {
            r1 = 0;
        }
        try {
            r2 = arg2.toString().split('.')[1].length;
        } catch (e) {
            r2 = 0;
        }
        m = Math.pow(10, Math.max(r1, r2));
        n = r1 > r2 ? r1 : r2;
        return ((arg1 * m - arg2 * m) / m).toFixed(n);
    }

    //数组map方法兼容处理
    Array.prototype.allMap = function (callback, context) {
        context = context || window;
        if ('map' in Array.prototype) {
            return this.map(callback, context);
        }
        //兼容低版本IE
        var newArr = [];
        for (var i = 0; i < this.length; i++) {
            if (typeof callback == 'function') {
                var val = callback.call(context, this[i]);
                newArr.push(val);
            }
        }
        return newArr;
    }

    return { calculateUpDown: calculateUpDown };
})