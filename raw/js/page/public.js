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
    var $win = $(window), supportTouch = "ontouchend" in document;
    
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
        if(!supportTouch){
            var scrollTop = $win.scrollTop();
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

    if($win.scrollTop()>112 && !supportTouch ){
        menu.addClass("fixed");
    }
});