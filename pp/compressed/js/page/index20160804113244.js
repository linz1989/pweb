require.config({
    baseUrl : "club-admin/compressed/js/",
    paths : {
        avalon : "lib/avalon",
        domReady : "lib/domReady",
        mmHistory : "lib/mmHistory",
        mmRouter : "lib/mmRouter",
        css : "lib/css",
        jquery : "lib/jquery-1.12.4.min",
        util : "common/util",
        jsAddress : "common/jsAddress",
        moment : "common/moment.min",
        daterangepicker : "common/daterangepicker",
        //qrcode : "common/jquery.qrcode.min",
        qrcode : "common/jquery.qrcode",
        jqform : "common/jquery.form.min",
        highcharts : "common/highcharts",
        kindeditor:"common/kindeditor/kindeditor-min",
        kindeditor_zhCn:"common/kindeditor/lang/zh_CN",
        area : "common/area",
        dragsort : "common/jquery.dragsort-0.5.2.min",
        colorbox : "common/jquery.colorbox-min",
        cropper : "common/cropper.min",
        amap : "http://webapi.amap.com/maps?v=1.3&key=f71d6fc056a3ab4cab5229aeebef1c0c&plugin=AMap.Geocoder"
    },
    shim : {
        avalon : { exports : "avalon" },
        mmHistory : { deps : ["avalon"] },
        mmRouter : { deps : ["avalon"] },
        util : { deps : ["jquery"] },
        daterangepicker : { deps : ["jquery","moment"] },
        qrcode : { deps : ["jquery"] },
        jqform : { deps : ["jquery"] },
        highcharts : { deps : ["jquery"] },
        dragsort : { deps : ["jquery"] },
        colorbox : { deps : ["jquery"] },
        kindeditor_zhCn : { deps : ["kindeditor"] },
        cropper : { deps : ["jquery"] }
    }
});

///////////////////全局变量的存储
window.$$= {
    rootVm : null, /////顶层vm
    currPath : null //////用于设置当前访问的位置
};

require(["mmHistory","mmRouter","util","domReady!"], function() {

    /////////////////////////////////////////////设置当前路径
    $$.currPath = $("div#info>div.path>span");

    /////////////////////////////////////////////当前日期
    var currDate = new Date(),
        month = currDate.getMonth()+ 1,
        date = currDate.getDate(),
        weekObj = ['日', '一', '二', '三', '四', '五', '六'],
        currDateStr = currDate.getFullYear()+"年"+(month>9 ? month : "0"+month)+"月"+(date>9 ? date : "0"+date )+"日 星期"+weekObj[currDate.getDay()];

    //////////////////////////////////////////////////左侧菜单点击伸展、收缩
    $("#menu").on("click","div>div",function(){
        var $this = $(this),
            $list = $this.siblings("ul"),
            isSlideDown = !$list.is(":visible");
        $list.slideToggle(300);
        if(isSlideDown){///////其他区域需要slideUp
            $this.parent().siblings("div:not(.home)").find("ul:visible").slideUp();
        }
        $$.rootVm.integrationExpand = ($list.attr("data-menu")=="integrationSys" && isSlideDown);
    });

    ///////////////////////////////////////////define RootVM
    $$.maskPage = $("#globalMask");
    $$.rootVm = avalon.define({
        $id : "indexCtrl",
        pageUrl : "./home",
        page : "home",
        currTime : currDate.getTime(),
        currDateStr : currDateStr,
        sysNoticeCount : 0,
        feedBackCount : 0,
        exchangeAppCount : 0,////积分兑换申请数量
        integrationExpand : false,////积分系统模块是否展开
        shopsAdmin : false,/////多店查看的进入浏览
        doClickOfToolBtn : function(pageUrl){
            location.href= "#!/"+pageUrl;
        },
        doClickLogout : function(){////退出系统
            $.ajax({
                url : "logout",
                dataType : "text",
                success : function(){
                    location.href = "./login";//////跳转到登录
                }
            });
        },
        getMessageCount : function(){
            $.ajax({
                url : "messageCount",
                success : function(res){
                    if(res && res.data){
                        $$.rootVm.sysNoticeCount = res.data.messageCount;
                        $$.rootVm.feedBackCount = res.data.feedbackCount;
                    }
                }
            });
            ///////////////////////积分兑换申请
            $.ajax({
                url : "club/credit/exchange/applications/count",
                success : function(appRes){
                    if(appRes.statusCode==200){
                        $$.rootVm.exchangeAppCount = appRes.respData.submitCount;
                    }
                }
            });
        }
    });
    var i,
        allMenu = $("#menu>div>ul>li"),
        pageMenu = {////配置各个页面对应的主菜单
            orderList : "home", ///订单列表---首页
            noticeList : "home", ///系统通知---首页
            feedbackList : "home", ///用户反馈---首页
            messageSellGroups : "messageSell", ////短信营销--分组管理
            messageSellGroupDetail : "messageSell", ////短信营销--分组详情
            messageSellDetail : "messageSell", ////短信营销--短信详情
            messageSellSendDetail : "messageSell", ////短信营销--短信发送记录
            editOrdinaryCoupon : "ordinaryCouponSell", /////优惠券编辑或者添加
            registeredUserList : "registeredDataStatistics",//////数据统计-注册用户列表
            couponGetRecord : "ordinaryCouponDataStatistics",////////优惠券领取记录
            couponRewardDetail : "ordinaryCouponDataStatistics",////////优惠券提现记录
            couponUseRecord : "ordinaryCouponDataStatistics", ///优惠券使用记录
            couponDataDetail : "ordinaryCouponDataStatistics", ////优惠券数据详情
            paidOrderDailyData : "paidOrderDataStatistics", ////付费预约--每日数据
            paidCouponCanUseDetail : "paidCouponDataStatistics",/////点钟券未使用详情
            paidCouponSellDetail : "paidCouponDataStatistics",//////点钟券购买详情
            paidCouponUseDetail : "paidCouponDataStatistics",//////点钟券使用详情
            paidCouponExpireDetail : "paidCouponDataStatistics",//////点钟券过期详情
            clubServiceDetail : "clubServiceSetting",//////服务项目详情
            techDetail : "techList",//////服务项目详情
            techEdit : "techList",//////技师编辑
            subAccountList : "accountCenter",//////会所子账号
            clubBriefDetail : "clubBriefSetting",//////会所简介的新建或者编辑
            //integrationUserRecord : "integrationDataStatistics",/////用户积分记录
            //integrationTechRecord : "integrationDataStatistics",/////技师积分记录
            //integrationExchangeList : "integrationDataStatistics",/////技师兑换申请
            accountDataDetail:"accountDataStatistics",//////充值记录详情
            scanPayDataDetail:"scanPayDataStatistics"/////扫码支付详情
        },
        pageMapping = {},
        pageTimestamp = {};

    for(i=0;i<allMenu.length;i++){
        pageMapping[allMenu[i].getAttribute("nav")] = i;
    }
    $("#menu").on("click","div>ul>li>a",function(){
        location.hash = "#!/"+$(this).parent().attr("nav");
    });
    avalon.router.get("/*path", function(){//劫持url hash并触发回调
        var currPath = this.path;
        if(/^(\/|\/index|\/home)$/.test(this.path)){
            currPath = "home";
        }
        var page = $$.rootVm.page = currPath.split("&")[0].replace(/\//, "");
        if(!pageMenu[page] && pageMapping[page]==undefined) return;
        allMenu.removeClass("active");
        var thisMenu = allMenu[pageMapping[(pageMenu[page] || page)]];
        thisMenu.className = "active";
        var pMenu = $(thisMenu).parent("ul");
        if(pMenu.is(":hidden")){
            pMenu.siblings("div").click();
        }
        if(!pageTimestamp[page] || this.query.noRefresh !="true") pageTimestamp[page] = (+new Date());
        $$.rootVm.pageUrl = "club-admin/raw/tpl/"+page + ".tpl.html?"+pageTimestamp[page];  //动态修改pageUrl属性值

        /////////////////////////////////////////////////////其他业务逻辑
        $$.rootVm.integrationExpand = (pMenu.attr("data-menu")=="integrationSys");
    });
    avalon.history.start(); //历史记录堆栈管理

    ////////////////////////////////////////////////调整内容高度
    var $win = $(window),
        $content = $("#content");
    $win.on("resize",function(){ doResize() });
    function doResize(){
        var h = $win.height()-108;
        $content.height(h+"px");
        $("#menu").height(h+"px");
        $("#pageContent").height((h-20)+"px");
    }
    doResize();

    /////////////////////////////////////////////////ajax全局设置
    var paramObj = {}, pageParam = getParamObj();
    var paramToken = pageParam["cid"] || iSessionStorage("cid") || "";
    if(paramToken){
        paramObj.token = paramToken;
        iSessionStorage("cid",paramToken);
        ////////////////////////////////////////屏蔽一些菜单
        $$.rootVm.shopsAdmin = true;
    }
    $.ajaxSetup({
        type : "get",
        dataType : "json",
        data : paramObj,
        cache : false,
        complete : function(xhr){/////全局的处理
            if(xhr.status == 401 || xhr.status == 302){
                location.href = "./login";//////跳转到登录
            }
        }
    });

    ///////////////////////////////////////////获取当前会所信息
    $.ajax({
        url : "profile/data",
        success : function(res){
            if(res.statusCode == 200){
                res = res.respData;
                $$.clubId = res.club.clubId;
                $("div#info>div.club").text(res.club.name);
                var logoImg = $("body>header>div.logo>img")[0];
                logoImg.onerror = function(){
                    this.src = "./club-admin/img/common/logo.png";
                };
                logoImg.src = res.club.imageUrl;
            }
        }
    });

    $$.rootVm.getMessageCount();
    setTimeout(function(){ $$.rootVm.getMessageCount() },120*1000);////定时查询

    //==== 注册一过滤器：分转元，保留两位小数 ====
    avalon.filters.bizMoneyToYuan = function (str) {
        return ((str - 0)/100).toFixed(2);
    };


    /////////////////////////////////////////////////scan
    avalon.scan(document.body);
});