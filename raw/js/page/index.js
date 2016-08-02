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
            htmlStr +="<li><img src='"+silderImgs[i]+"' /></li>";
        }
        $("#slider-wrap>ul.slides").html(htmlStr);
        
        $("#slider-wrap").flexslider({
            animation: "slide",
            slideshowSpeed : 3000,
            slideshow : true,
            animationLoop : true,
            pauseOnAction : false,
            pauseOnHover : false
        });

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