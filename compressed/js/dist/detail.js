function isSupportCss3(t){var e,i=["webkit","Moz","ms","o"],a=[],o=document.documentElement.style,s=function(t){return t.replace(/-(\w)/g,function(t,e){return e.toUpperCase()})};for(e in i)a.push(s(i[e]+"-"+t));a.push(s(t));for(e in a)if(a[e]in o)return!0;return!1}function isPC(){for(var t=navigator.userAgent,e=["Android","iPhone","SymbianOS","Windows Phone","iPad","iPod"],i=!0,a=0;a<e.length;a++)if(t.indexOf(e[a])>0){i=!1;break}return i}function ls(t,e){if(localStorage)if(e){if(localStorage.setItem)return localStorage.setItem(t,e)}else if(localStorage.getItem)return localStorage.getItem(t);return!1}function getParam(){var t,e,i={},a=[],o=location.href.split("?")[1];if(o)for(a=o.split("&"),t=0;t<a.length;t++)e=a[t].split("="),2==e.length&&(i[e[0]]=decodeURIComponent(e[1]));return i}$(function(){function t(t){"active"!=t.className?(s.removeClass("active"),t.className="active"):t.className=""}var e,i=$(window),a=!isPC(),o=$("body").attr("data-lang");ls("sunshine-visit-lang",o),$.get("../json/menu_"+o+".json",{_t:+new Date},function(t){var i="",a=t.solutionMenu;for(e=0;e<a.length;e++)i+="<li><a href='solution.html#"+a[e].id+"'>"+a[e].text+"</a></li>";$("#solution-menu").html(i);var o=t.productMenu;for(i="",e=0;e<o.length;e++)i+="<li><a href='product.html#"+o[e].id+"'>"+o[e].text+"</a></li>";$("#product-menu").html(i)}),$("div.top-wrap>ul").on("click","li",function(){location.href="../"+this.getAttribute("lang")+"/index.html"});var s=$("div.menu-wrap>div>ul>li");s[a?"click":"hover"](function(e){t(this),e.stopPropagation()}),a&&$("div.menu-wrap>div>ul>li>a.touch").removeAttr("href");var l=$("body>div.menu-wrap"),n=$("div.side-bar>ul>li.back");i.scroll(function(){var t=i.scrollTop();a||(t>112&&i.width()>=1e3?l.hasClass("fixed")||l.addClass("fixed"):l.hasClass("fixed")&&l.removeClass("fixed")),n[0]&&(t>112?n.removeClass("hide"):n.addClass("hide"))}),i.scrollTop()>112&&(a||l.addClass("fixed"),n.removeClass("hide"))}),$(function(){function t(){var t=o.scrollTop();t>112&&o.width()>=1e3?(a.hasClass("fixed")||(a.addClass("fixed"),a.css("left",s.offset().left+"px")),70+a.height()+102>o.height()&&document.body.scrollHeight-o.height()-$(window).scrollTop()<82?a.addClass("bottomFixed"):a.removeClass("bottomFixed")):(a.hasClass("fixed")&&(a.removeClass("fixed"),a.css("left","0px")),a.hasClass("bottomFixed")&&a.removeClass("bottomFixed"))}var e=$("body").attr("data-lang"),i={},a=$("div.content-wrap>div>div.nav"),o=$(window),s=$("div.content-wrap>div"),l=$("div.path>span"),n=getParam(),r=n.pid;null!=r&&void 0!=r||(location.href="error.html"),$.get("../json/product_"+e+".json",{_t:+new Date},function(a){var s,n,d,c,u,f,h,v,m,g=a.products,p="",C=0;for(s=0;s<g.length;s++)if(h=g[s],h.list){for(i[h.id+""]=C++,p+="<div data-nav-id='"+h.id+"' class='menu",n=0;n<h.list.length;n++)h.list[n].id==r&&(c=h.list[n],u=h.id,f=h.text,p+=" curr");p+="'>"+h.text+"</div>"}else if(h.category){for(p+="<div class='hasSub' data-category-id='"+h.id+"'>"+h.text+"</div><div class='menu-list subList' data-category-id='"+h.id+"'>",d=0;d<h.category.length;d++){for(v=h.category[d],i[v.id+""]=C++,p+="<div data-nav-id='"+v.id+"' class='menu subItem",n=0;n<v.list.length;n++)v.list[n].id==r&&(c=v.list[n],u=v.id,f=v.text,m=h.text,p+=" curr");p+="'>"+v.text+"</div>"}p+="</div>"}c||(location.href="error.html"),l.html((m?m+">> ":"")+"<a href='product.html#"+u+"'>"+f+"</a> >> "+c.title),$("#leftMenu").html(p);var x=$("#leftMenu div.curr");x.hasClass("subItem")&&x.parent().slideDown(150),$.get("../json/product_"+e+"/product_"+r+".html",{_t:+new Date},function(t){$("#productContent").html(t)},"text"),t(),o.scroll(function(){t()})},"json"),$("#leftMenu").on("click","div.menu,div.hasSub",function(){var t=$(this);if(!t.hasClass("curr"))if(t.hasClass("hasSub")){var e=t.attr("data-category-id"),i=$("#leftMenu>div.menu-list[data-category-id="+e+"]");!i.is(":visible");i.slideToggle(150)}else{if(t.hasClass("subItem")){var i=t.parent();i.is(":visible")||i.slideToggle(150)}location.href="product.html#"+t.attr("data-nav-id")}})});