$(function(){
    var lang = $("body").attr("data-lang"),
        navStrObj = {},
        $leftMenu = $("div.content-wrap>div>div.nav"),
        $win = $(window),
        content = $("div.content-wrap>div"),
        path = $("div.path>span"),
        pageParam = getParam(),
        pid = pageParam.pid;

    console.log("pid："+pid);
    if(pid == null || pid==undefined){
        location.href="error.html";
    }

    /////获取产品数据
    $.get("../json/product_"+lang+".json",{ "_t" : (+new Date())},function(res){
        var pdata = res.products,
            menuHtmlStr = "",
            i,k,
            productObj,typeId,typeName;

        for(i=0;i<pdata.length;i++){
            navStrObj[pdata[i]["id"]+""]=i;
            menuHtmlStr += "<li data-nav-id='"+pdata[i]["id"]+"'>"+pdata[i]["text"]+"</li>";
            for(k=0;k<pdata[i]["list"].length;k++){
                if(pdata[i]["list"][k].id == pid){
                    productObj = pdata[i]["list"][k];
                    typeId = pdata[i]["id"];
                    typeName = pdata[i]["text"];
                }
            }
        }
        if(!productObj) location.href = "error.html";
        path.html("<a href='product.html#"+typeId+"'>"+typeName+"</a>");
        $("#leftMenu").html(menuHtmlStr);
        $("#leftMenu>li:eq("+navStrObj[typeId]+")").addClass("curr");

        /////////////////////加载内容
        $.get("../json/product_"+lang+"/product_"+pid+".html",{ "_t" : (+new Date())},function(htmlRes){
            $("#productContent").html(htmlRes);
        },"text");

        doHandlerScroll();
        $win.scroll(function(){ doHandlerScroll() });
    },"json");

    $("#leftMenu").on("click","li",function(){
        location.href = "product.html#"+this.getAttribute("data-nav-id");
    })

    function doHandlerScroll(){
        var scrollTop = $win.scrollTop();
        if(scrollTop>112 && $win.width()>=1000){
            if(!$leftMenu.hasClass("fixed")){
                $leftMenu.addClass("fixed");
                $leftMenu.css("left",content.offset().left+"px");
            }
            if(document.body.scrollHeight-$win.height()-$(window).scrollTop()<82){
                $leftMenu.addClass("bottomFixed");
            }
            else{
                $leftMenu.removeClass("bottomFixed");
            }
        }
        else{
            if($leftMenu.hasClass("fixed")){
                $leftMenu.removeClass("fixed");
                $leftMenu.css("left","0px");
            }
            if($leftMenu.hasClass("bottomFixed")){
                $leftMenu.removeClass("bottomFixed");
            }
        }
    }
})