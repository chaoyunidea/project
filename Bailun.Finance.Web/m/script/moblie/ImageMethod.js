define(['molieInit','touchs'], function (m) {
    //{id:id,MethodName:MethodName}
    //id  图片的父级id
    //MethodName   安卓 Ios 执行的方法名称
  
    var androidFn = function (ImgAry, i) { nativeMethod.ImagePagerStringPath('{ "ImgAry": '+ImgAry+', "i": '+i+' }'); } //安卓手机执行方法
    var IosMethod_7 = function (ImgAry, i) { ImagePagerStringPath('{ "ImgAry": '+ImgAry+', "i": '+i+' }'); } //Ios 系统 7（包括7）一下的执行方法
    var IosMethod = function (ImgAry, i) { window.webkit.messageHandlers.ImagePagerStringPath.postMessage('{ "ImgAry":'+ ImgAry+', "i":'+ i +'s}'); } //Ios  7以上的执行方法
        //根据手机类型执行不同的方法
    function ImgInit(id) {

            var type = m.moblieType();
            switch (type) {
                case Consts._browseType.Android:
                    androidImgClick(id);
                    break;
                case Consts._browseType.Ios:
                    iosImgClick(id);
                    break;
                default: console.log(type);
            }
        }
          //安卓  图片点击执行
    function androidImgClick(id) {
            ImgDom = $('#' + id).find('img');
            var ImgAry = [];
            if (ImgDom.length > 0) {
                ImgDom.each(function (i) {
                    if (this.src.indexOf('icon/loading.gif') < 0) {
                        var src = this.src;
                        var title = this.title;
                        ImgAry.push({ "src": this.src, "title": this.title });
                    $(this).off().on("tap", function () {
                            androidMethod(ImgAry, i);
                    })
                    }
                    //$(this).on("tap", function () {
                    //    androidMethod(this);
                    //})
                })
            }
        }
        //安卓的执行方法
    function androidMethod(ImgAry, i) {
        androidFn(JSON.stringify(ImgAry), i);
        }

       //IOS  图片点击执行
        function iosImgClick(id) {
            ImgDom = $('#' + id).find('img');
            var ImgAry = [];
            if (ImgDom.length > 0) {
                ImgDom.each(function (i) {

                    if (this.src.indexOf('icon/loading.gif') < 0) {
                        var src = this.src;
                        var title = this.title;
                        ImgAry.push({ "src": this.src, "title": this.title });
                        $(this).off().on("tap", function () {
                            iosMethod(ImgAry, i);
                        })
                    }

                })
            }

        }
       //IOS的执行方法
       function iosMethod(ImgAry, i) {
            //   alert(ImgAry+ ":" + i);
            var EditionType = m.IosEdition();
            if (EditionType[0] <= 7) {
               
                IosMethod_7( JSON.stringify(ImgAry), i );
            }
            else {
                IosMethod( JSON.stringify(ImgAry), i );
            }

       }
        //出口方法
        //config   
        //id  图片的父级id
       //MethodName   安卓 Ios 执行的方法名称
       function Init(config) {
           if (config.id) {
               if (config.MethodName)
               {
                   androidFn = function (ImgAry, i) { eval("nativeMethod." + config.MethodName + "('{ \"ImgAry\": " + ImgAry + ", \"i\": \"" + i + "\" }')"); }
                   IosMethod_7 = function (ImgAry, i) { eval(config.MethodName + "('{ \"ImgAry\": " + ImgAry + ", \"i\": \"" + i + "\" }')"); }
                   IosMethod = function (ImgAry, i) { eval("window.webkit.messageHandlers." + config.MethodName + ".postMessage('{ \"ImgAry\": " + ImgAry + ", \"i\": \"" + i + "\" }')"); }
               }
           }
           else {
               alert("必须传入图片的父级id");
               return false;
           }
          

           ImgInit(config.id);
       }

       return {
           //调用方法
           //ImgInit({id:id,MethodName:MethodName})
           //有两个参数
           // id  图片父元素的ID
           // MethodName  执行方法的名称
           ImgInit: Init

       }
})
