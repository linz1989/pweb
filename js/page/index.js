$(function(){function i(){u.addClass("active"),v.removeClass("active"),d.removeClass("active"),r.removeClass("active")}function e(){d.addClass("active"),u.removeClass("active"),r.removeClass("active"),v.removeClass("active")}function t(){v.addClass("active"),u.removeClass("active"),r.removeClass("active"),d.removeClass("active")}function a(){r.addClass("active"),u.removeClass("active"),v.removeClass("active"),d.removeClass("active")}var o,n=$("body").attr("data-lang"),s=0,c="ontouchend"in document;$.get("../json/home_"+n+".json",{_t:+new Date},function(i){o=i;var e="",t=o.banner;for(s=0;s<t.length;s++)e+="<div class='swiper-slide'><img src='"+t[s]+"' /></div>";$("div#slider-container>div.swiper-wrapper").html(e),new Swiper("#slider-container",{direction:"horizontal",loop:!0,speed:800,autoplay:3e3,autoplayDisableOnInteraction:!1,pagination:".swiper-pagination"}),$.get("../json/product_"+n+".json",{_t:+new Date},function(i){i=i.products;for(var e="",t="",a=0;a<i.length;a++)for(e+="<option value='"+i[a].id+"'>"+i[a].text+"</option>",s=0;s<i[a].list.length;s++)i[a].list[s].isHot&&(t+="<li pid='"+i[a].list[s].id+"'><img src='"+i[a].list[s].img+"'/><div>   <h3>"+i[a].list[s].title+"</h3></div></li>");$("#sellingProductList").html(t),$("#product-type").html($("#product-type").html()+e),$("#loading").removeClass("active")},"json")},"json"),$("#sellingProductList").on("click","li",function(){location.href="detail.html?pid="+this.getAttribute("pid")});var l=$("div.side-bar>ul>li>i"),r=$("div.side-bar>div.qrcode"),v=$("div.side-bar>div.share"),d=$("div.side-bar>div.service"),u=$("div.side-bar>div.search"),p=$("#product-type"),m=$("#product-keywords");$(window),$("div.side-bar");$("div.side-bar>div.search>h3>span").click(function(){u.removeClass("active")}),$("div.side-bar>div.search>a").click(function(){location.href="search.html?type="+p.val()+"&key="+encodeURIComponent(m.val())}),$("div.side-bar>div.service>span").click(function(){d.removeClass("active")}),$("div.side-bar>div.share>span").click(function(){v.removeClass("active")}),$(l[4]).click(function(){$("html,body").animate({scrollTop:0},500)}),c?($(l[0]).click(function(){i()}),$(l[1]).click(function(){e()}),$(l[2]).click(function(){t()}),$(l[3]).click(function(){r.toggleClass("active")})):($(l[0]).hover(function(){i()},function(){}),$(l[1]).hover(function(){e()},function(){}),$(l[2]).hover(function(){t()},function(){}),$(l[3]).hover(function(){a()},function(){r.removeClass("active")}))});