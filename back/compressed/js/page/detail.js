$(function(){function t(){var t=l.scrollTop();t>112&&l.width()>=1e3?(i.hasClass("fixed")||(i.addClass("fixed"),i.css("left",d.offset().left+"px")),70+i.height()+102>l.height()&&document.body.scrollHeight-l.height()-$(window).scrollTop()<82?i.addClass("bottomFixed"):i.removeClass("bottomFixed")):(i.hasClass("fixed")&&(i.removeClass("fixed"),i.css("left","0px")),i.hasClass("bottomFixed")&&i.removeClass("bottomFixed"))}var o=$("body").attr("data-lang"),e={},i=$("div.content-wrap>div>div.nav"),l=$(window),d=$("div.content-wrap>div"),n=$("div.path>span"),a=getParam(),s=a.pid;console.log("pid："+s),null!=s&&void 0!=s||(location.href="error.html"),$.get("../json/product_"+o+".json",{_t:+new Date},function(i){var d,a,r,c,h,f=i.products,u="";for(d=0;d<f.length;d++)for(e[f[d].id+""]=d,u+="<li data-nav-id='"+f[d].id+"'>"+f[d].text+"</li>",a=0;a<f[d].list.length;a++)f[d].list[a].id==s&&(r=f[d].list[a],c=f[d].id,h=f[d].text);r||(location.href="error.html"),n.html("<a href='product.html#"+c+"'>"+h+"</a> >> "+r.title),$("#leftMenu").html(u),$("#leftMenu>li:eq("+e[c]+")").addClass("curr"),$.get("../json/product_"+o+"/product_"+s+".html",{_t:+new Date},function(t){$("#productContent").html(t)},"text"),t(),l.scroll(function(){t()})},"json"),$("#leftMenu").on("click","li",function(){location.href="product.html#"+this.getAttribute("data-nav-id")})});