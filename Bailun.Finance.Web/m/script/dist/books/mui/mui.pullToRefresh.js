(function(e,t,n){var r="beforeChangeOffset",i="afterChangeOffset",s="pullstart",o="pulling",u=r,a=i,f="dragEndAfterChangeOffset",l=e.className("transitioning"),c=e.className("pull-top-tips"),h=e.className("pull-bottom-tips"),p=e.className("pull-loading"),d=e.className("scroll"),v=e.className("pull-loading")+" "+e.className("icon")+" "+e.className("icon-pulldown"),m=v+" "+e.className("reverse"),g=e.className("pull-loading")+" "+e.className("spinner"),y=e.className("hidden"),b="."+p;e.PullToRefresh=e.Class.extend({init:function(t,n){this.element=t,this.options=e.extend(!0,{down:{height:75,callback:!1},up:{auto:!1,offset:100,show:!0,contentdown:"上拉显示更多",contentrefresh:"正在加载...",contentnomore:"没有更多数据了",callback:!1},preventDefaultException:{tagName:/^(INPUT|TEXTAREA|BUTTON|SELECT)$/}},n),this.stopped=this.isNeedRefresh=this.isDragging=!1,this.state=r,this.isInScroll=this.element.classList.contains(d),this.initPullUpTips(),this.initEvent()},_preventDefaultException:function(e,t){for(var n in t)if(t[n].test(e[n]))return!0;return!1},initEvent:function(){e.isFunction(this.options.down.callback)&&(this.element.addEventListener("touchstart",this),this.element.addEventListener("drag",this),this.element.addEventListener("dragend",this)),this.pullUpTips&&(this.element.addEventListener("dragup",this),this.isInScroll?this.element.addEventListener("scrollbottom",this):t.addEventListener("scroll",this))},handleEvent:function(e){switch(e.type){case"touchstart":this.isInScroll&&this._canPullDown()&&e.target&&!this._preventDefaultException(e.target,this.options.preventDefaultException)&&e.preventDefault();break;case"drag":this._drag(e);break;case"dragend":this._dragend(e);break;case"webkitTransitionEnd":this._transitionEnd(e);break;case"dragup":case"scroll":this._dragup(e);break;case"scrollbottom":this.pullUpLoading(e)}},initPullDownTips:function(){var t=this;e.isFunction(t.options.down.callback)&&(t.pullDownTips=function(){var e=n.querySelector("."+c);return e&&e.parentNode.removeChild(e),e||(e=n.createElement("div"),e.classList.add(c),e.innerHTML='<div class="mui-pull-top-wrapper"><span class="mui-pull-loading mui-icon mui-icon-pulldown"></span></div>',e.addEventListener("webkitTransitionEnd",t)),t.pullDownTipsIcon=e.querySelector(b),n.body.appendChild(e),e}())},initPullUpTips:function(){var t=this;e.isFunction(t.options.up.callback)&&(t.pullUpTips=function(){var e=t.element.querySelector("."+h);return e||(e=n.createElement("div"),e.classList.add(h),t.options.up.show||e.classList.add(y),e.innerHTML='<div class="mui-pull-bottom-wrapper"><span class="mui-pull-loading">'+t.options.up.contentdown+"</span></div>",t.element.appendChild(e)),t.pullUpTipsIcon=e.querySelector(b),e}())},_transitionEnd:function(e){e.target===this.pullDownTips&&this.removing&&this.removePullDownTips()},_dragup:function(t){var n=this;if(n.loading)return;if(t&&t.detail&&e.gestures.session.drag)n.isDraggingUp=!0;else if(!n.isDraggingUp)return;n.isDragging||n._canPullUp()&&n.pullUpLoading(t)},_canPullUp:function(){if(this.removing)return!1;if(this.isInScroll){var r=this.element.parentNode.getAttribute("data-scroll");if(r){var i=e.data[r];return i.y===i.maxScrollY}}return t.pageYOffset+t.innerHeight+this.options.up.offset>=n.documentElement.scrollHeight},_canPullDown:function(){if(this.removing)return!1;if(this.isInScroll){var t=this.element.parentNode.getAttribute("data-scroll");if(t){var r=e.data[t];return r.y===0}}return n.body.scrollTop===0},_drag:function(s){if(this.loading||this.stopped){s.stopPropagation(),s.detail.gesture.preventDefault();return}var o=s.detail;if(!this.isDragging&&o.direction==="down"&&this._canPullDown()){if(n.querySelector("."+c)){s.stopPropagation(),s.detail.gesture.preventDefault();return}this.isDragging=!0,this.removing=!1,this.startDeltaY=o.deltaY,e.gestures.session.lockDirection=!0,e.gestures.session.startDirection=o.direction,this._pullStart(this.startDeltaY)}if(this.isDragging){s.stopPropagation(),s.detail.gesture.preventDefault();var u=o.deltaY-this.startDeltaY;u=Math.min(u,1.5*this.options.down.height),this.deltaY=u,this._pulling(u);var a=u>this.options.down.height?i:r;this.state!==a&&(this.state=a,this.state===i?(this.removing=!1,this.isNeedRefresh=!0):(this.removing=!0,this.isNeedRefresh=!1),this["_"+a](u));if(e.os.ios&&parseFloat(e.os.version)>=8){var f=o.gesture.touches[0].clientY;if(f+10>t.innerHeight||f<10){this._dragend(s);return}}}},_dragend:function(e){var t=this;t.isDragging&&(t.isDragging=!1,t._dragEndAfterChangeOffset(t.isNeedRefresh)),t.isPullingUp&&(t.pullingUpTimeout&&clearTimeout(t.pullingUpTimeout),t.pullingUpTimeout=setTimeout(function(){t.isPullingUp=!1},1e3))},_pullStart:function(t){this.pullStart(t),e.trigger(this.element,s,{api:this,startDeltaY:t})},_pulling:function(t){this.pulling(t),e.trigger(this.element,o,{api:this,deltaY:t})},_beforeChangeOffset:function(t){this.beforeChangeOffset(t),e.trigger(this.element,u,{api:this,deltaY:t})},_afterChangeOffset:function(t){this.afterChangeOffset(t),e.trigger(this.element,a,{api:this,deltaY:t})},_dragEndAfterChangeOffset:function(t){this.dragEndAfterChangeOffset(t),e.trigger(this.element,f,{api:this,isNeedRefresh:t})},removePullDownTips:function(){if(this.pullDownTips)try{this.pullDownTips.parentNode&&this.pullDownTips.parentNode.removeChild(this.pullDownTips),this.pullDownTips=null,this.removing=!1}catch(e){}},pullStart:function(e){this.initPullDownTips(e)},pulling:function(e){this.pullDownTips.style.webkitTransform="translate3d(0,"+e+"px,0)"},beforeChangeOffset:function(e){this.pullDownTipsIcon.className=v},afterChangeOffset:function(e){this.pullDownTipsIcon.className=m},dragEndAfterChangeOffset:function(e){e?(this.pullDownTipsIcon.className=g,this.pullDownLoading()):(this.pullDownTipsIcon.className=v,this.endPullDownToRefresh())},pullDownLoading:function(){if(this.loading)return;if(!this.pullDownTips){this.initPullDownTips(),this.dragEndAfterChangeOffset(!0);return}this.loading=!0,this.pullDownTips.classList.add(l),this.pullDownTips.style.webkitTransform="translate3d(0,"+this.options.down.height+"px,0)",this.options.down.callback.apply(this)},pullUpLoading:function(e){if(this.loading||this.finished)return;this.loading=!0,this.isDraggingUp=!1,this.pullUpTips.classList.remove(y),e&&e.detail&&e.detail.gesture&&e.detail.gesture.preventDefault(),this.pullUpTipsIcon.innerHTML=this.options.up.contentrefresh,this.options.up.callback.apply(this)},endPullDownToRefresh:function(){this.loading=!1,this.pullUpTips&&this.pullUpTips.classList.remove(y),this.pullDownTips.classList.add(l),this.pullDownTips.style.webkitTransform="translate3d(0,0,0)",this.deltaY<=0?this.removePullDownTips():this.removing=!0},endPullUpToRefresh:function(e){e?(this.finished=!0,this.pullUpTipsIcon.innerHTML=this.options.up.contentnomore,this.element.removeEventListener("dragup",this),t.removeEventListener("scroll",this)):this.pullUpTipsIcon.innerHTML=this.options.up.contentdown,this.loading=!1},setStopped:function(e){e!=this.stopped&&(this.stopped=e,this.pullUpTips&&this.pullUpTips.classList[e?"add":"remove"](y))},refresh:function(e){e&&this.finished&&this.pullUpTipsIcon&&(this.pullUpTipsIcon.innerHTML=this.options.up.contentdown,this.element.addEventListener("dragup",this),t.addEventListener("scroll",this),this.finished=!1)}}),e.fn.pullToRefresh=function(t){var n=[];return t=t||{},this.each(function(){var r=this,i=null,s=r.getAttribute("data-pullToRefresh");s?i=e.data[s]:(s=++e.uuid,e.data[s]=i=new e.PullToRefresh(r,t),r.setAttribute("data-pullToRefresh",s)),t.up&&t.up.auto&&i.pullUpLoading(),n.push(i)}),n.length===1?n[0]:n}})(mui,window,document);