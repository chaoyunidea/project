define(["molieInit"],function(e){var t={clickType:function(){var n=e.moblieType();switch(n){case Consts._browseType.Android:t.adrState();break;case Consts._browseType.Ios:t.iosState();break;default:console.log(n)}},adrState:function(){t.stateFn(Consts._AppRoute.Default,function(){location.href=Consts._AppRoute.AndroidLoadLink})},iosState:function(){e.moblieTypeFn(function(){});var n=e.IosEdition();n[0]<=7,t.stateFn(Consts._AppRoute.IosDefault,function(){location.href=Consts._AppRoute.IosLoadLink})},stateFn:function(e,t){AppInstall(e,t,function(){window.close()})},clickEv:function(e){var t=this;$("#download").on("tap",function(){window.location=e})},init:function(){t.clickType()}};return{init:t.init}});