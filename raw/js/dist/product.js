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