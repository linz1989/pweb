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

    /////获取左侧菜单
    $.get("../json/home_"+lang+".json",{ "_t" : (+new Date())},function(res){
        var menus = res.solutionMenu,
            menuHtmlStr = "",
            contentHtmlStr = "",
            i;
        for(i=0;i<menus.length;i++){
            if(i==0) defaultNav = menus[i]["id"];
            navStrObj[menus[i]["id"]+""]=i;
            menuHtmlStr += "<li data-nav-id='"+menus[i]["id"]+"'>"+menus[i]["text"]+"</li>";
            contentHtmlStr += "<div id='solution_"+menus[i]["id"]+"'></div>"
        }
        $("#leftMenu").html(menuHtmlStr);
        $("#solutionContent").html(contentHtmlStr);
        $leftNavMenu = $("#leftMenu>li");
        $rightContentList = $("#solutionContent>div");

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
    });

    function doHashChange(){
        $leftNavMenu.removeClass("curr");
        var navId = location.hash.substr(1),
            navIndex = navStrObj[navId],
            navMenu = $leftNavMenu[navIndex];

        $(navMenu).addClass("curr");
        $rightContentList.removeClass("active");
        if($rightContentList[navIndex].innerHTML.length==0){
            loading.addClass("active");
            $.get("../json/solution_"+lang+"/solution_"+navId+".html",{"_t":(+new Date())},function(res){
                $rightContentList[navIndex].innerHTML = res;
                loading.removeClass("active");
            },"text");
        }
        $rightContentList[navIndex].className = "active";
        path.html("<a>"+navMenu.innerHTML+"</a>");
    }

    function doHandlerScroll(){
        var scrollTop = $win.scrollTop();
        if(scrollTop>112 && $win.width()>=1000){
            if(!$leftMenu.hasClass("fixed")){
                $leftMenu.addClass("fixed");
                $leftMenu.css("left",content.offset().left+"px");
            }
        }
        else{
            if($leftMenu.hasClass("fixed")){
                $leftMenu.removeClass("fixed");
                $leftMenu.css("left","0px");
            }
        }
    }
})