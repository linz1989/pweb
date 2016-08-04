$(function(){
    var lang = $("body").attr("data-lang"),
        homeData,
        i = 0;
    
    $.get("../json/home_"+lang+".json",{ "_t" : (+new Date())},function(res){
        homeData = res;

        ////////////////////////////////////////////////////banner
        var silderImgs = homeData.banner,
            htmlStr = "";
        for(i=0;i<silderImgs.length;i++){
            htmlStr +="<div class='swiper-slide'><img src='"+silderImgs[i]+"' /></div>";
        }
        $("div#slider-container>div.swiper-wrapper").html(htmlStr);
        
        /*$("#slider-wrap").flexslider({
            animation: "slide",
            slideshowSpeed : 3000,
            slideshow : true,
            animationLoop : true,
            pauseOnAction : false,
            pauseOnHover : false
        });*/
        
        new Swiper ('#slider-container', {
            direction : 'horizontal',
            loop : true,
            speed : 800,
            autoplay : 3000,
            effect : "coverflow",
            autoplayDisableOnInteraction : false,
            pagination : '.swiper-pagination'
        })

        //////////////////////////////////////////////////////新品推荐
        var newProducts = homeData.newProducts;
        for(i=0,htmlStr = "";i<newProducts.length;i++){
            htmlStr += "<li pid='"+newProducts[i]["id"]+"'>" +
                "<img src='"+newProducts[i]["img"]+"'/>" +
                "<div>" +
                "   <h3>"+newProducts[i]["name"]+"</h3>" +
                "   <h5>"+newProducts[i]["description"]+"</h5>" +
                "</div>" +
                "</li>";
        }
        $("#newProductList").html(htmlStr);

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
})