$(function(){function t(){s.removeClass("curr");var t=location.hash.substr(1),i=l[t],o=s[i];h.html("<a href='product.html#"+t+"'>"+o.innerHTML+"</a>"),$(o).addClass("curr"),a.removeClass("active"),a[i].className="active"}function i(){var t=d.scrollTop();t>112&&d.width()>=1e3?(n.hasClass("fixed")||(n.addClass("fixed"),n.css("left",c.offset().left+"px")),70+n.height()+102>d.height()&&document.body.scrollHeight-d.height()-$(window).scrollTop()<82?n.addClass("bottomFixed"):n.removeClass("bottomFixed")):(n.hasClass("fixed")&&(n.removeClass("fixed"),n.css("left","0px")),n.hasClass("bottomFixed")&&n.removeClass("bottomFixed"))}var o,s,a,e=$("body").attr("data-lang"),l={},n=$("div.content-wrap>div>div.nav"),d=$(window),c=$("div.content-wrap>div"),h=$("div.path>span");$.get("../json/product_"+e+".json",{_t:+new Date},function(e){var n,c,h=e.products,r="",v="";for(n=0;n<h.length;n++){for(0==n&&(o=h[n].id),l[h[n].id+""]=n,r+="<li data-nav-id='"+h[n].id+"'>"+h[n].text+"</li>",v+="<div id='product_category_"+h[n].id+"'>",c=0;c<h[n].list.length;c++)v+="<div class='item' pid='"+h[n].list[c].id+"'>                        <img src='"+h[n].list[c].img+"' />                        <h4>"+h[n].list[c].title+"</h4>                        <p>"+h[n].list[c].description+"</p>                    </div>";v+="</div>"}$("#leftMenu").html(r),$("#productContent").html(v),s=$("#leftMenu>li"),a=$("#productContent>div"),location.hash&&void 0!=l[location.hash.substr(1)]?t():location.hash=o,window.onhashchange=function(){location.hash&&void 0!=l[location.hash.substr(1)]||(location.hash=o),t()},i(),d.scroll(function(){i()})},"json"),$("#leftMenu").on("click","li",function(){"curr"!=this.className&&(location.hash=this.getAttribute("data-nav-id"))})});