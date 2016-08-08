$(function(){
    var lang = $("body").attr("data-lang"),
        homeData,
        i = 0;
    
    $.get("../json/home_"+lang+".json",{ "_t" : (+new Date())},function(res){
        homeData = res;
        var htmlStr = "";
        
        ////////////////////////////////////////////////////banner
        var silderImgs = homeData.banner;
        for(i=0;i<silderImgs.length;i++){
            htmlStr +="<div class='swiper-slide'><img src='"+silderImgs[i]+"' /></div>";
        }
        $("div#slider-container>div.swiper-wrapper").html(htmlStr);

        new Swiper ('#slider-container', {
            direction : 'horizontal',
            loop : true,
            speed : 800,
            autoplay : 3000,
            effect : "coverflow",
            autoplayDisableOnInteraction : false,
            pagination : '.swiper-pagination'
        });

        //////////////////////////////////////////////////////新品推荐
        var sellProducts = homeData.sellingProducts;
        for(i=0,htmlStr = "";i<sellProducts.length;i++){
            htmlStr += "<li pid='"+sellProducts[i]["id"]+"'>" +
                "<img src='"+sellProducts[i]["img"]+"'/>" +
                "<div>" +
                "   <h3>"+sellProducts[i]["name"]+"</h3>" +
                "   <h5>"+sellProducts[i]["description"]+"</h5>" +
                "</div>" +
                "</li>";
        }
        $("#sellingProductList").html(htmlStr);

    },"json");

    var sideBarBtns = $("div.side-bar>ul>li"),
        qrCodeDiv = $("div.side-bar>div.qrcode"),
        shareDiv = $("div.side-bar>div.share"),
        searchDiv = $("div.side-bar>div.search"),
        productType = $("#product-type"),
        productName = $("#product-name"),
        productKeyWords = $("#product-keywords");

    $(sideBarBtns[0]).hover(function(){///搜
        searchDiv.addClass("active");
        shareDiv.removeClass("active");
        qrCodeDiv.removeClass("active");
    },function(){});
    $("div.side-bar>div.search>h3>span").click(function(){
        searchDiv.removeClass("active");
    });
    $("div.side-bar>div.search>a").click(function(){///点击搜索

    });

    $(sideBarBtns[2]).hover(function(){///分享
        shareDiv.addClass("active");
        searchDiv.removeClass("active");
        qrCodeDiv.removeClass("active");
    },function(){});
    $("div.side-bar>div.share>span").click(function(){
        shareDiv.removeClass("active");
    });
    $(sideBarBtns[3]).hover(function(){///二维码
        qrCodeDiv.addClass("active");
        searchDiv.removeClass("active");
        shareDiv.removeClass("active");
    },function(){ qrCodeDiv.removeClass("active"); });
    $(sideBarBtns[4]).click(function(){///返回顶部
        $("html,body").animate({ scrollTop : 0 },500);
    });
})