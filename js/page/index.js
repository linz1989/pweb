$(function(){var e,i=$("body").attr("data-lang"),a=0;$.get("../json/home_"+i+".json",{_t:+new Date},function(i){e=i;var t="",o=e.banner;for(a=0;a<o.length;a++)t+="<div class='swiper-slide'><img src='"+o[a]+"' /></div>";$("div#slider-container>div.swiper-wrapper").html(t),new Swiper("#slider-container",{direction:"horizontal",loop:!0,speed:800,autoplay:3e3,autoplayDisableOnInteraction:!1,pagination:".swiper-pagination"});var n=e.sellingProducts;for(a=0,t="";a<n.length;a++)t+="<li pid='"+n[a].id+"'><img src='"+n[a].img+"'/><div>   <h3>"+n[a].name+"</h3>   <h5>"+n[a].description+"</h5></div></li>";$("#sellingProductList").html(t)},"json");var t=$("div.side-bar>ul>li"),o=$("div.side-bar>div.qrcode"),n=$("div.side-bar>div.share"),s=$("div.side-bar>div.search"),r=$("#product-type"),c=$("#product-keywords");$(t[0]).hover(function(){s.addClass("active"),n.removeClass("active"),o.removeClass("active")},function(){}),$("div.side-bar>div.search>h3>span").click(function(){s.removeClass("active")}),$("div.side-bar>div.search>a").click(function(){location.href="search.html?type="+r.val()+"&key="+encodeURIComponent(c.val())}),$.get("../json/product_"+i+".json",{_t:+new Date},function(e){e=e.products;for(var i="",a=0;a<e.length;a++)i+="<option value='"+e[a].id+"'>"+e[a].text+"</option>";$("#product-type").html($("#product-type").html()+i)},"json"),$(t[2]).hover(function(){n.addClass("active"),s.removeClass("active"),o.removeClass("active")},function(){}),$("div.side-bar>div.share>span").click(function(){n.removeClass("active")}),$(t[3]).hover(function(){o.addClass("active"),s.removeClass("active"),n.removeClass("active")},function(){o.removeClass("active")}),$(t[4]).click(function(){$("html,body").animate({scrollTop:0},500)})});