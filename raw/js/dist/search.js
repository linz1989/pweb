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
        $rightContentList,
        content = $("div.content-wrap>div"),
        pageParam = getParam();

    pageParam.type = pageParam.type || "";
    pageParam.key = pageParam.key || "";
    $("#key-word").html(pageParam.key);

    /////获取产品数据
    $.get("../json/product_"+lang+".json",{ "_t" : (+new Date())},function(res){
        var pdata = res.products,
            contentHtmlStr = "",
            i, k, reg = new RegExp(pageParam.key);

        for(i=0;i<pdata.length;i++){
            if(pdata[i]["id"] == pageParam.type || pageParam.type=="" ){
                contentHtmlStr += "<div id='product_category_"+pdata[i]["id"]+"'>";
                if(pageParam.type != "") $("#product-type").html("<a href='product.html#"+pdata[i]["id"]+"'>"+pdata[i]["text"]+"</a>");
                if(pdata[i].list){
                    contentHtmlStr += generateHtml(pdata[i],reg);
                }
                else if(pdata[i].category){
                    for(k=0;k<pdata[i].category.length;k++){
                        contentHtmlStr += generateHtml(pdata[i].category[k],reg);
                    }
                }
                contentHtmlStr +="</div>";
            }
        }
        if(contentHtmlStr != "") $("#productContent").html(contentHtmlStr);
        $rightContentList = $("#productContent>div");
    },"json");

    $("#productContent").on("click","div>div.item",function(){
        location.href="detail.html?pid="+this.getAttribute("pid");
    });

    function generateHtml(pObj,reg){
        var k, contentHtmlStr = "";
        for(k=0;k<pObj["list"].length;k++){
            if(reg.test(pObj["list"][k].title) || reg.test(pObj["list"][k].description)){
                contentHtmlStr +="<div class='item' pid='"+pObj["list"][k].id+"'>\
                        <img src='"+pObj["list"][k].img+"' />\
                        <h4>"+pObj["list"][k].title+"</h4>\
                        <p>"+pObj["list"][k].description+"</p>\
                    </div>";
            }
        }
        return contentHtmlStr;
    }
})