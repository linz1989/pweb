$(function(){
    var lang = $("body").attr("data-lang"),
        defaultNav,
        navStrObj = {},
        $leftNavMenu,
        $leftMenu = $("div.content-wrap>div>div.nav"),
        $rightContentList,
        $win = $(window),
        content = $("div.content-wrap>div");

    /////获取产品数据
    $.get("../json/product_"+lang+".json",{ "_t" : (+new Date())},function(res){
        var pdata = res.products,
            menuHtmlStr = "",
            contentHtmlStr = "",
            i, k;

        for(i=0;i<pdata.length;i++){
            if(i==0) defaultNav = pdata[i]["id"];
            navStrObj[pdata[i]["id"]+""]=i;
            menuHtmlStr += "<li data-nav-id='"+pdata[i]["id"]+"'>"+pdata[i]["text"]+"</li>";
            contentHtmlStr += "<div id='product_category_"+pdata[i]["id"]+"'>";
            for(k=0;k<pdata[i]["list"].length;k++){
                contentHtmlStr +="<div class='item' pid='"+pdata[i]["list"][k].id+"'>\
                        <img src='"+pdata[i]["list"][k].img+"' />\
                        <h4>"+pdata[i]["list"][k].title+"</h4>\
                        <p>"+pdata[i]["list"][k].description+"</p>\
                    </div>";
            }
            contentHtmlStr +="</div>";
        }
        console.log("menuHtmlStr："+menuHtmlStr);
        $("#leftMenu").html(menuHtmlStr);
        $("#productContent").html(contentHtmlStr);
        $leftNavMenu = $("#leftMenu>li");
        $rightContentList = $("#productContent>div");

        if(!location.hash || navStrObj[location.hash.substr(1)] == undefined){
            location.hash = defaultNav;
        }
        else{
            doHashChange();
        }

        window.onhashchange = function(){
            if(!location.hash || navStrObj[location.hash.substr(1)] == undefined){
                location.hash = defaultNav;
            }
            doHashChange();
        };

       doHandlerScroll();

        $win.scroll(function(){
            doHandlerScroll();
        });
    },"json");

    $("#leftMenu").on("click","li",function(){
        if(this.className == "curr") return;
        location.hash = this.getAttribute("data-nav-id");
    })

    function doHashChange(){
        $leftNavMenu.removeClass("curr");
        var navId = location.hash.substr(1),
            navIndex = navStrObj[navId],
            navMenu = $leftNavMenu[navIndex];

        $(navMenu).addClass("curr");
        $rightContentList.removeClass("active");
        $rightContentList[navIndex].className = "active";
    }

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