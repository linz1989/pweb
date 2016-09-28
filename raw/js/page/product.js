$(function(){
    var lang = $("body").attr("data-lang"),
        defaultNav,
        navStrObj = {},
        $leftNavMenu,
        $leftMenu = $("div.content-wrap>div>div.nav"),
        $rightContentList,
        $win = $(window),
        content = $("div.content-wrap>div"),
        path = $("div.path>span"),
        loading = $("#loading");

    /////获取产品数据
    $.get("../json/product_"+lang+".json",{ "_t" : (+new Date())},function(res){
        var pdata = res.products,
            menuHtmlStr = "",
            contentHtmlStr = "",
            i, k, resObj,indexCount=0;
        for(i=0;i<pdata.length;i++){
            if(pdata[i].list){
                resObj = genertateHtml(pdata[i],indexCount);
                menuHtmlStr += resObj.menuHtmlStr;
                contentHtmlStr += resObj.contentHtmlStr;
                indexCount++;
            }
            else if(pdata[i].category){
                menuHtmlStr +="<div class='hasSub' data-category-id='"+pdata[i]["id"]+"'>"+pdata[i]["text"]+"</div><div class='menu-list subList' data-category-id='"+pdata[i]["id"]+"'>";
                for(k=0;k<pdata[i].category.length;k++){
                    resObj = genertateHtml(pdata[i].category[k],indexCount,pdata[i]["id"]);
                    menuHtmlStr += resObj.menuHtmlStr;
                    contentHtmlStr += resObj.contentHtmlStr;
                    indexCount++;
                }
                menuHtmlStr +="</div>";
            }
        }
        //console.log("menuHtmlStr："+menuHtmlStr);
        $("#leftMenu").html(menuHtmlStr);
        $("#productContent").html(contentHtmlStr);
        $leftNavMenu = $("#leftMenu div.menu,#leftMenu div.hasSub");
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

        loading.removeClass("active");
    },"json");

    $("#leftMenu").on("click","div.menu,div.hasSub",function(){
        var $this = $(this);
        if($this.hasClass("curr")) return;
        if($this.hasClass("hasSub")){
            var categoryId = $this.attr("data-category-id"),
                menuList = $("#leftMenu>div.menu-list[data-category-id="+categoryId+"]"),
                isSlideDown = !menuList.is(":visible");
            menuList.slideToggle(300);
            if(isSlideDown){
                menuList.siblings("div.menu-list").slideUp();
            }
        }
        else{
            if($this.hasClass("subItem")){
                var menuList = $this.parent();
                if(!menuList.is(":visible")){
                    menuList.slideToggle(300);
                    menuList.siblings("div.menu-list").slideUp();
                }
            }
            location.hash = $this.attr("data-nav-id");
        }
    })

    $("#productContent").on("click","div>div.item",function(){
        location.href="detail.html?pid="+this.getAttribute("pid");
    })

    function genertateHtml(pObj,index,categoryId){
        var menuHtmlStr, contentHtmlStr;
        var isSub = categoryId != undefined;

        if(!defaultNav) defaultNav = pObj["id"];
        navStrObj[pObj["id"]+""]=index;
        menuHtmlStr = "<div class='"+(isSub ? "subItem " : "")+"menu' data-nav-id='"+pObj["id"]+"'>"+pObj["text"]+"</div>";
        contentHtmlStr = "<div id='product_category_"+pObj["id"]+"'>";
        for(var k=0;k<pObj["list"].length;k++){
            contentHtmlStr +="<div class='item' pid='"+pObj["list"][k].id+"'>\
                       <img src='"+pObj["list"][k].img+"' />\
                       <h4>"+pObj["list"][k].title+"</h4>\
                        <p>"+pObj["list"][k].description+"</p>\
                   </div>";
        }
        contentHtmlStr +="</div>";

        return {
            menuHtmlStr : menuHtmlStr,
            contentHtmlStr : contentHtmlStr
        }
    }

    function doHashChange(){
        $leftNavMenu.removeClass("curr");
        var navId = location.hash.substr(1),
            navIndex = navStrObj[navId],
            navMenu = $leftNavMenu[navIndex];

        path.html("<a href='product.html#"+navId+"'>"+navMenu.innerHTML+"</a>");
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
            if(70+$leftMenu.height()+102>$win.height() && document.body.scrollHeight-$win.height()-$(window).scrollTop()<82){
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