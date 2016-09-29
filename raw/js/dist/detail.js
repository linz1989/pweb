//*********************************************************************
// 检测是否支持某个CSS3样式的方法
//*********************************************************************
function isSupportCss3(style) {
    var prefix = ['webkit', 'Moz', 'ms', 'o'],
        i,
        humpString = [],
        htmlStyle = document.documentElement.style,
        _toHumb = function (string) {
            return string.replace(/-(\w)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
        };

    for (i in prefix) {
        humpString.push(_toHumb(prefix[i] + '-' + style));
    }
    humpString.push(_toHumb(style));

    for (i in humpString)
        if (humpString[i] in htmlStyle) return true;
    return false;
}

function isPC() {
    var userAgentInfo = navigator.userAgent,
        Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"],
        flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

//********************************************************************
//对localStorage的封装
//*******************************************************************
function ls(key,value){
    if(localStorage){
        if(value){
            if(localStorage.setItem) return localStorage.setItem(key,value);
        }
        else if(localStorage.getItem){
            return localStorage.getItem(key);
        }
    }
    return false;
}

//********************************************************************
//获取地址栏参数
//*******************************************************************
function getParam(){
    var paramObj = {},
        paramArr = [],
        i,
        arr,
        paramUrl = location.href.split("?")[1];
    if(paramUrl){
        paramArr = paramUrl.split("&");
        for(i=0;i<paramArr.length;i++){
            arr = paramArr[i].split("=");
            if(arr.length==2){
                paramObj[arr[0]] = decodeURIComponent(arr[1]);
            }
        }
    }
    return paramObj;
}

$(function () {
    var $win = $(window), supportTouch = !isPC();
    
    //////////////////////////////////////////////////////////menu
    var lang = $("body").attr("data-lang"),i;
    ls("sunshine-visit-lang",lang);
    $.get("../json/menu_"+lang+".json",{ "_t" : (+new Date())},function(res) {
        var htmlStr = "";
        ////////////////////////////////////////////////////solution menu
        var solutionMenuData = res.solutionMenu;
        for(i=0;i<solutionMenuData.length;i++){
            htmlStr += "<li><a href='solution.html#"+solutionMenuData[i]["id"]+"'>"+solutionMenuData[i]["text"]+"</a></li>";
        }
        $("#solution-menu").html(htmlStr);

        ////////////////////////////////////////////////////product menu
        var productMenuData = res.productMenu;
        htmlStr = "";
        for(i=0;i<productMenuData.length;i++){
            htmlStr += "<li><a href='product.html#"+productMenuData[i]["id"]+"'>"+productMenuData[i]["text"]+"</a></li>";
        }
        $("#product-menu").html(htmlStr);
    });

    ////////////////////////////////////////////////////////////语言
    $("div.top-wrap>ul").on("click","li",function(){
       location.href="../"+this.getAttribute("lang")+"/index.html";
    });

    ///////////////////////////////////////////////////////////点击菜单弹出
    var menuListArr = $("div.menu-wrap>div>ul>li");
    menuListArr[supportTouch ? "click" : "hover"](function(event){ doHandlerMenu(this); event.stopPropagation(); });
    if(supportTouch){
        $("div.menu-wrap>div>ul>li>a.touch").removeAttr("href");
    }
    function doHandlerMenu(menu){
        if(menu.className != "active"){
            menuListArr.removeClass("active");
            menu.className = "active";
        }
        else menu.className = "";
    }

    ////////////////////////////////////////////////////////////滚动条的监听
    var menu = $("body>div.menu-wrap"),
        backBtn = $("div.side-bar>ul>li.back");

    $win.scroll(function(){
        var scrollTop = $win.scrollTop();
        if(!supportTouch){
            if(scrollTop>112 && $win.width()>=1000){
                if(!menu.hasClass("fixed")){
                    menu.addClass("fixed");
                }
            }
            else{
                if(menu.hasClass("fixed")){
                    menu.removeClass("fixed");
                }
            }
        }

        if(backBtn[0]){
            if(scrollTop>112){
                backBtn.removeClass("hide");
            }
            else{
                backBtn.addClass("hide");
            }
        }
    });

    if($win.scrollTop()>112 ){
        if(!supportTouch) menu.addClass("fixed");
        backBtn.removeClass("hide");
    }
});
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