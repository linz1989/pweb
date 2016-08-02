$(function(){
    var homeData,
        i = 0;
    
    $.get("../json/home.json",{ "_t" : (+new Date())},function(res){
        homeData = res;
        var silderImgs = homeData.homeSlider,
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
    },"json");
})