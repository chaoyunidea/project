(function(e,t){var n='<div id="{{id}}" class="mui-slider mui-preview-image mui-fullscreen" style="disply:none"><div class="mui-preview-header">{{header}}</div><div class="mui-slider-group"></div><div class="mui-preview-footer mui-hidden">{{footer}}</div><div class="mui-preview-loading"><span class="mui-spinner mui-spinner-white"></span></div></div>',r='<div class="mui-slider-item mui-zoom-wrapper {{className}}"><div class="mui-zoom-scroller"><img src="{{src}}" data-preview-lazyload="{{lazyload}}" style="{{style}}" class="mui-zoom"></div></div>',i="__DEFAULT",s=document.createElement("div"),o=0,u=function(t){this.options=e.extend(!0,{id:"__MUI_PREVIEWIMAGE",zoom:!0,header:'<span class="mui-preview-indicator"></span>',footer:""},t||{}),this.init(),this.initEvent()},a=u.prototype;a.init=function(){var t=this.options,r=document.getElementById(this.options.id);r||(s.innerHTML=n.replace(/\{\{id\}\}/g,this.options.id).replace("{{header}}",t.header).replace("{{footer}}",t.footer),document.body.appendChild(s.firstElementChild),r=document.getElementById(this.options.id)),this.element=r,this.scroller=this.element.querySelector(e.classSelector(".slider-group")),this.indicator=this.element.querySelector(e.classSelector(".preview-indicator")),this.loader=this.element.querySelector(e.classSelector(".preview-loading")),t.footer&&this.element.querySelector(e.classSelector(".preview-footer")).classList.remove(e.className("hidden")),this.addImages()},a.initEvent=function(){var t=this;e(document.body).on("tap","img[data-preview-src]",function(){return t.open(this),!1});var n=null,r=function(){!n&&(n=e.later(function(){t.loader.removeEventListener("tap",r),t.scroller.removeEventListener("tap",r),t.close()},300))};this.scroller.addEventListener("doubletap",function(){n&&(n.cancel(),n=null)}),this.element.addEventListener("webkitAnimationEnd",function(){t.element.classList.contains(e.className("preview-out"))?(t.element.style.display="none",t.element.classList.remove(e.className("preview-out")),t.element.classList.remove(e.className("preview-in")),n=null):(t.loader.addEventListener("tap",r),t.scroller.addEventListener("tap",r))}),this.element.addEventListener("slide",function(n){if(t.options.zoom){var r=t.element.querySelector(".mui-zoom-wrapper:nth-child("+(t.lastIndex+1)+")");r&&e(r).zoom().setZoom(1)}var i=n.detail.slideNumber;t.lastIndex=i,t.indicator&&(t.indicator.innerText=i+1+"/"+t.currentGroup.length),t._loadItem(i)})},a.addImages=function(e,t){this.groups={};var n=[];e?e===i?n=document.querySelectorAll("img[data-preview-src]:not([data-preview-group])"):n=document.querySelectorAll("img[data-preview-src][data-preview-group='"+e+"']"):n=document.querySelectorAll("img[data-preview-src]");if(n.length)for(var r=0,s=n.length;r<s;r++)this.addImage(n[r])},a.addImage=function(e){var t=e.getAttribute("data-preview-group");t=t||i,this.groups[t]||(this.groups[t]=[]);var n=e.getAttribute("src");if(e.__mui_img_data&&e.__mui_img_data.src===n)this.groups[t].push(e.__mui_img_data);else{var r=e.getAttribute("data-preview-src");r||(r=n);var s={src:n,lazyload:n===r?"":r,loaded:n===r?!0:!1,sWidth:0,sHeight:0,sTop:0,sLeft:0,sScale:1,el:e};this.groups[t].push(s),e.__mui_img_data=s}},a.empty=function(){this.scroller.innerHTML=""},a._initImgData=function(n,r){if(!n.sWidth){var i=n.el;n.sWidth=i.offsetWidth,n.sHeight=i.offsetHeight;var s=e.offset(i);n.sTop=s.top,n.sLeft=s.left,n.sScale=Math.max(n.sWidth/t.innerWidth,n.sHeight/t.innerHeight)}r.style.webkitTransform="translate3d(0,0,0) scale("+n.sScale+")"},a._getScale=function(e,t){var n=e.width/t.width,r=e.height/t.height,i=1;return n<=r?i=e.height/(t.height*n):i=e.width/(t.width*r),i},a._imgTransitionEnd=function(t){var n=t.target;n.classList.remove(e.className("transitioning")),n.removeEventListener("webkitTransitionEnd",this._imgTransitionEnd.bind(this))},a._loadItem=function(t,n){var r=this.scroller.querySelector(e.classSelector(".slider-item:nth-child("+(t+1)+")")),i=this.currentGroup[t],s=r.querySelector("img");this._initImgData(i,s);if(n){var o=this._getPosition(i);s.style.webkitTransitionDuration="0ms",s.style.webkitTransform="translate3d("+o.x+"px,"+o.y+"px,0) scale("+i.sScale+")",s.offsetHeight}if(!i.loaded&&s.getAttribute("data-preview-lazyload")){var u=this;u.loader.classList.add(e.className("active")),s.style.webkitTransitionDuration="0.5s",s.addEventListener("webkitTransitionEnd",u._imgTransitionEnd.bind(u)),s.style.webkitTransform="translate3d(0,0,0) scale("+i.sScale+")",this.loadImage(s,function(){i.loaded=!0,s.src=i.lazyload,u._initZoom(r,this.width,this.height),s.classList.add(e.className("transitioning")),s.addEventListener("webkitTransitionEnd",u._imgTransitionEnd.bind(u)),s.setAttribute("style",""),s.offsetHeight,u.loader.classList.remove(e.className("active"))})}else i.lazyload&&(s.src=i.lazyload),this._initZoom(r,s.width,s.height),s.classList.add(e.className("transitioning")),s.addEventListener("webkitTransitionEnd",this._imgTransitionEnd.bind(this)),s.setAttribute("style",""),s.offsetHeight;this._preloadItem(t+1),this._preloadItem(t-1)},a._preloadItem=function(t){var n=this.scroller.querySelector(e.classSelector(".slider-item:nth-child("+(t+1)+")"));if(n){var r=this.currentGroup[t];if(!r.sWidth){var i=n.querySelector("img");this._initImgData(r,i)}}},a._initZoom=function(t,n,r){if(!this.options.zoom)return;if(t.getAttribute("data-zoomer"))return;var i=t.querySelector(e.classSelector(".zoom"));if(i.tagName==="IMG"){var s=this,o=s._getScale({width:t.offsetWidth,height:t.offsetHeight},{width:n,height:r});e(t).zoom({maxZoom:Math.max(o,1)})}else e(t).zoom()},a.loadImage=function(e,t){var n=function(){t&&t.call(this)},r=new Image;r.onload=n,r.onerror=n,r.src=e.getAttribute("data-preview-lazyload")},a.getRangeByIndex=function(e,t){return{from:0,to:t-1}},a._getPosition=function(e){var n=e.sLeft-t.pageXOffset,r=e.sTop-t.pageYOffset,i=(t.innerWidth-e.sWidth)/2,s=(t.innerHeight-e.sHeight)/2;return{left:n,top:r,x:n-i,y:r-s}},a.refresh=function(n,i){this.currentGroup=i;var s=i.length,o=[],u=this.getRangeByIndex(n,s),a=u.from,f=u.to+1,l=n,c="",h="",p=t.innerWidth,d=t.innerHeight;for(var v=0;a<f;a++,v++){var m=i[a],g="";m.sWidth&&(g="-webkit-transform:translate3d(0,0,0) scale("+m.sScale+");transform:translate3d(0,0,0) scale("+m.sScale+")"),h=r.replace("{{src}}",m.src).replace("{{lazyload}}",m.lazyload).replace("{{style}}",g),a===n?(l=v,c=e.className("active")):c="",o.push(h.replace("{{className}}",c))}this.scroller.innerHTML=o.join(""),this.element.style.display="block",this.element.classList.add(e.className("preview-in")),this.lastIndex=l,this.element.offsetHeight,e(this.element).slider().gotoItem(l,0),this.indicator&&(this.indicator.innerText=l+1+"/"+this.currentGroup.length),this._loadItem(l,!0)},a.openByGroup=function(e,t){e=Math.min(Math.max(0,e),this.groups[t].length-1),this.refresh(e,this.groups[t])},a.open=function(e,t){if(this.isShown())return;typeof e=="number"?(t=t||i,this.addImages(t,e),this.openByGroup(e,t)):(t=e.getAttribute("data-preview-group"),t=t||i,this.addImages(t,e),this.openByGroup(this.groups[t].indexOf(e.__mui_img_data),t))},a.close=function(n,r){if(!this.isShown())return;this.element.classList.remove(e.className("preview-in")),this.element.classList.add(e.className("preview-out"));var i=this.scroller.querySelector(e.classSelector(".slider-item:nth-child("+(this.lastIndex+1)+")")),s=i.querySelector("img");if(s){s.classList.add(e.className("transitioning"));var o=this.currentGroup[this.lastIndex],u=this._getPosition(o),a=u.left,f=u.top;f>t.innerHeight||a>t.innerWidth||f<0||a<0?(s.style.opacity=0,s.style.webkitTransitionDuration="0.5s",s.style.webkitTransform="scale("+o.sScale+")"):(this.options.zoom&&e(s.parentNode.parentNode).zoom().toggleZoom(0),s.style.webkitTransitionDuration="0.5s",s.style.webkitTransform="translate3d("+u.x+"px,"+u.y+"px,0) scale("+o.sScale+")")}var l=this.element.querySelectorAll(e.classSelector(".zoom-wrapper"));for(var c=0,h=l.length;c<h;c++)e(l[c]).zoom().destroy();e(this.element).slider().destroy()},a.isShown=function(){return this.element.classList.contains(e.className("preview-in"))};var f=null;e.previewImage=function(e){return f||(f=new u(e)),f},e.getPreviewImage=function(){return f}})(mui,window);