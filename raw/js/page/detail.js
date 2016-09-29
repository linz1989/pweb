$(function(){
    var lang = $("body").attr("data-lang"),
        navStrObj = {},
        $leftMenu = $("div.content-wrap>div>div.nav"),
        $win = $(window),
        content = $("div.content-wrap>div"),
        path = $("div.path>span"),
        pageParam = getParam(),
        pid = pageParam.pid;

    if(pid == null || pid==undefined){
        location.href="error.html";
    }

    /////获取产品数据
    $.get("../json/product_"+lang+".json",{ "_t" : (+new Date())},function(res){
        var pdata = res.products,
            menuHtmlStr = "",
            i,k,m,
            productObj,typeId,typeName, itemObj, indexCount = 0, categoryObj, categoryName;

        for(i=0;i<pdata.length;i++){
            itemObj = pdata[i];
            if(itemObj.list){
                navStrObj[itemObj["id"]+""] = indexCount++;
                menuHtmlStr += "<div data-nav-id='"+itemObj["id"]+"' class='menu";
                for(k=0;k<itemObj["list"].length;k++){
                    if(itemObj["list"][k].id == pid){
                        productObj = itemObj["list"][k];
                        typeId = itemObj["id"];
                        typeName = itemObj["text"];
                        menuHtmlStr +=" curr";
                    }
                }
                menuHtmlStr += "'>"+itemObj["text"]+"</div>";
            }
            else if(itemObj.category){
                menuHtmlStr += "<div class='hasSub' data-category-id='"+itemObj["id"]+"'>"+itemObj["text"]+"</div><div class='menu-list subList' data-category-id='"+itemObj["id"]+"'>";
                for(m=0;m<itemObj.category.length;m++){
                    categoryObj = itemObj.category[m];
                    navStrObj[categoryObj["id"]+""] = indexCount++;
                    menuHtmlStr += "<div data-nav-id='"+categoryObj["id"]+"' class='menu subItem";
                    for(k=0;k<categoryObj["list"].length;k++){
                        if(categoryObj["list"][k].id == pid){
                            productObj = categoryObj["list"][k];
                            typeId = categoryObj["id"];
                            typeName = categoryObj["text"];
                            categoryName = itemObj["text"];
                            menuHtmlStr += " curr";
                        }
                    }
                    menuHtmlStr += "'>"+categoryObj["text"]+"</div>";
                }
                menuHtmlStr += "</div>";
            }
        }

        if(!productObj) location.href = "error.html";
        path.html((categoryName ? categoryName+">> " : "")+"<a href='product.html#"+typeId+"'>"+typeName+"</a> >> "+productObj.title);
        $("#leftMenu").html(menuHtmlStr);

        var currMenu = $("#leftMenu div.curr");
        if(currMenu.hasClass("subItem")){
            currMenu.parent().slideDown(150);
        }

        /////////////////////加载内容
        $.get("../json/product_"+lang+"/product_"+pid+".html",{ "_t" : (+new Date())},function(htmlRes){
            $("#productContent").html(htmlRes);
        },"text");

        doHandlerScroll();
        $win.scroll(function(){ doHandlerScroll() });
    },"json");

    $("#leftMenu").on("click","div.menu,div.hasSub",function(){
        var $this = $(this);
        if($this.hasClass("curr")) return;
        if($this.hasClass("hasSub")){
            var categoryId = $this.attr("data-category-id"),
                menuList = $("#leftMenu>div.menu-list[data-category-id="+categoryId+"]"),
                isSlideDown = !menuList.is(":visible");
            menuList.slideToggle(150);
            if(isSlideDown){
                //menuList.siblings("div.menu-list").slideUp();
            }
        }
        else{
            if($this.hasClass("subItem")){
                var menuList = $this.parent();
                if(!menuList.is(":visible")){
                    menuList.slideToggle(150);
                    //menuList.siblings("div.menu-list").slideUp();
                }
            }
            location.href = "product.html#"+$this.attr("data-nav-id");
        }
    })

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