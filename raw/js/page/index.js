$(function(){
    var lang = $("body").attr("data-lang"),
        homeData,
        i = 0,
        supportTouch = "ontouchend" in document;
    
    $.get("../json/home_"+lang+".json",{ "_t" : (+new Date())},function(res){
        homeData = res;
        var htmlStr = "";
        
        ////////////////////////////////////////////////////banner
        var silderImgs = homeData.banner;
        for(i=0;i<silderImgs.length;i++){
            htmlStr +="<div class='swiper-slide'><img src='"+silderImgs[i]+"' /></div>";
        }
        $("div#slider-container>div.swiper-wrapper").html(htmlStr);

        new Swiper ('#slider-container', {
            direction : 'horizontal',
            loop : true,
            speed : 800,
            autoplay : 3000,
            //effect : "coverflow",
            autoplayDisableOnInteraction : false,
            pagination : '.swiper-pagination'
        });

        //////获取产品数据
        $.get("../json/product_"+lang+".json",{ "_t" : (+new Date())},function(pdata){
            pdata = pdata.products;
            var optionStr = "",htmlStr = "";
            for(var k=0;k<pdata.length;k++){
                optionStr += "<option value='"+pdata[k].id+"'>"+pdata[k]["text"]+"</option>";
                for(i=0;i<pdata[k]["list"].length;i++){
                    if(pdata[k]["list"][i]["isHot"]){
                        htmlStr += "<li pid='"+pdata[k]["list"][i]["id"]+"'>" +
                            "<img src='"+pdata[k]["list"][i]["img"]+"'/>" +
                            "<div>" +
                            "   <h3>"+pdata[k]["list"][i]["title"]+"</h3>" +
                            "</div>" +
                            "</li>";
                    }
                }
            }
            $("#sellingProductList").html(htmlStr);
            $("#product-type").html($("#product-type").html()+optionStr);

            $("#loading").removeClass("active");
        },"json");
    },"json");

    $("#sellingProductList").on("click","li",function(){
        location.href = "detail.html?pid="+this.getAttribute("pid");
    })

    var sideBarBtns = $("div.side-bar>ul>li>i"),
        qrCodeDiv = $("div.side-bar>div.qrcode"),
        shareDiv = $("div.side-bar>div.share"),
        serviceDiv = $("div.side-bar>div.service"),
        searchDiv = $("div.side-bar>div.search"),
        productType = $("#product-type"),
        //productName = $("#product-name"),
        productKeyWords = $("#product-keywords"),
        $win = $(window),
        sideBar = $("div.side-bar");

    function doHandlerSearchBar(){
        searchDiv.addClass("active");
        shareDiv.removeClass("active");
        serviceDiv.removeClass("active");
        qrCodeDiv.removeClass("active");
    }

    function doHandlerServiceBar(){
        serviceDiv.addClass("active");
        searchDiv.removeClass("active");
        qrCodeDiv.removeClass("active");
        shareDiv.removeClass("active");
    }

    function doHandlerShareBar(){
        shareDiv.addClass("active");
        searchDiv.removeClass("active");
        qrCodeDiv.removeClass("active");
        serviceDiv.removeClass("active");
    }

    function doHandlerQrcodeBar(){
        qrCodeDiv.addClass("active");
        searchDiv.removeClass("active");
        shareDiv.removeClass("active");
        serviceDiv.removeClass("active");
    }

    $("div.side-bar>div.search>h3>span").click(function(){
        searchDiv.removeClass("active");
    });
    $("div.side-bar>div.search>a").click(function(){///点击搜索
        location.href="search.html?type="+productType.val()+"&key="+encodeURIComponent(productKeyWords.val());
    });

    $("div.side-bar>div.service>span").click(function(){
        serviceDiv.removeClass("active");
    });

    $("div.side-bar>div.share>span").click(function(){
        shareDiv.removeClass("active");
    });

    $(sideBarBtns[4]).click(function(){///返回顶部
        $("html,body").animate({ scrollTop : 0 },500);
    });

    if(supportTouch){
        $(sideBarBtns[0]).click(function(){
            doHandlerSearchBar();
        });
        $(sideBarBtns[1]).click(function(){
            doHandlerServiceBar();
        });
        $(sideBarBtns[2]).click(function(){
            doHandlerShareBar();
        });
        $(sideBarBtns[3]).click(function(){
            qrCodeDiv.toggleClass("active");
        });
    }
    else{
        $(sideBarBtns[0]).hover(function(){///搜
            doHandlerSearchBar();
        },function(){});

        $(sideBarBtns[1]).hover(function(){///在线客服
            doHandlerServiceBar();
        },function(){});

        $(sideBarBtns[2]).hover(function(){///分享
            doHandlerShareBar();
        },function(){});

        $(sideBarBtns[3]).hover(function(){///二维码
            doHandlerQrcodeBar
        },function(){ qrCodeDiv.removeClass("active"); });
    }

    function doHandleResize(){
        if($win.width()>1600){
            var rightPos = ($win.width()-1440)/2-60;
            sideBar.css("right",rightPos+"px");
        }
    }
    doHandleResize();
    $win.resize(function(){ doHandleResize() });
})