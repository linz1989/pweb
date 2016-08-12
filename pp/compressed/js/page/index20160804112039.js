require.config({baseUrl:"club-admin/compressed/js/",paths:{avalon:"lib/avalon",domReady:"lib/domReady",mmHistory:"lib/mmHistory",mmRouter:"lib/mmRouter",css:"lib/css",jquery:"lib/jquery-1.12.4.min",util:"common/util",jsAddress:"common/jsAddress",moment:"common/moment.min",daterangepicker:"common/daterangepicker",qrcode:"common/jquery.qrcode",jqform:"common/jquery.form.min",highcharts:"common/highcharts",kindeditor:"common/kindeditor/kindeditor-min",kindeditor_zhCn:"common/kindeditor/lang/zh_CN",area:"common/area",dragsort:"common/jquery.dragsort-0.5.2.min",colorbox:"common/jquery.colorbox-min",cropper:"common/cropper.min",amap:"http://webapi.amap.com/maps?v=1.3&key=f71d6fc056a3ab4cab5229aeebef1c0c&plugin=AMap.Geocoder"},shim:{avalon:{exports:"avalon"},mmHistory:{deps:["avalon"]},mmRouter:{deps:["avalon"]},util:{deps:["jquery"]},daterangepicker:{deps:["jquery","moment"]},qrcode:{deps:["jquery"]},jqform:{deps:["jquery"]},highcharts:{deps:["jquery"]},dragsort:{deps:["jquery"]},colorbox:{deps:["jquery"]},kindeditor_zhCn:{deps:["kindeditor"]},cropper:{deps:["jquery"]}}}),window.$$={rootVm:null,currPath:null},require(["mmHistory","mmRouter","util","domReady!"],function(){function e(){var e=d.height()-108;m.height(e+"px"),$("#menu").height(e+"px"),$("#pageContent").height(e-20+"px")}$$.currPath=$("div#info>div.path>span");var t=new Date,a=t.getMonth()+1,o=t.getDate(),i=["日","一","二","三","四","五","六"],n=t.getFullYear()+"年"+(a>9?a:"0"+a)+"月"+(o>9?o:"0"+o)+"日 星期"+i[t.getDay()];$("#menu").on("click","div>div",function(){var e=$(this),t=e.siblings("ul"),a=!t.is(":visible");t.slideToggle(300),a&&e.parent().siblings("div:not(.home)").find("ul:visible").slideUp(),$$.rootVm.integrationExpand="integrationSys"==t.attr("data-menu")&&a}),$$.maskPage=$("#globalMask"),$$.rootVm=avalon.define({$id:"indexCtrl",pageUrl:"./home",page:"home",currTime:t.getTime(),currDateStr:n,sysNoticeCount:0,feedBackCount:0,exchangeAppCount:0,integrationExpand:!1,shopsAdmin:!1,doClickOfToolBtn:function(e){location.href="#!/"+e},doClickLogout:function(){$.ajax({url:"logout",dataType:"text",success:function(){location.href="./login"}})},getMessageCount:function(){$.ajax({url:"messageCount",success:function(e){e&&e.data&&($$.rootVm.sysNoticeCount=e.data.messageCount,$$.rootVm.feedBackCount=e.data.feedbackCount)}}),$.ajax({url:"club/credit/exchange/applications/count",success:function(e){200==e.statusCode&&($$.rootVm.exchangeAppCount=e.respData.submitCount)}})}});var r,s=$("#menu>div>ul>li"),c={orderList:"home",noticeList:"home",feedbackList:"home",messageSellGroups:"messageSell",messageSellGroupDetail:"messageSell",messageSellDetail:"messageSell",messageSellSendDetail:"messageSell",editOrdinaryCoupon:"ordinaryCouponSell",registeredUserList:"registeredDataStatistics",couponGetRecord:"ordinaryCouponDataStatistics",couponRewardDetail:"ordinaryCouponDataStatistics",couponUseRecord:"ordinaryCouponDataStatistics",couponDataDetail:"ordinaryCouponDataStatistics",paidOrderDailyData:"paidOrderDataStatistics",paidCouponCanUseDetail:"paidCouponDataStatistics",paidCouponSellDetail:"paidCouponDataStatistics",paidCouponUseDetail:"paidCouponDataStatistics",paidCouponExpireDetail:"paidCouponDataStatistics",clubServiceDetail:"clubServiceSetting",techDetail:"techList",techEdit:"techList",subAccountList:"accountCenter",clubBriefDetail:"clubBriefSetting",accountDataDetail:"accountDataStatistics",scanPayDataDetail:"scanPayDataStatistics"},u={},l={};for(r=0;r<s.length;r++)u[s[r].getAttribute("nav")]=r;$("#menu").on("click","div>ul>li>a",function(){location.hash="#!/"+$(this).parent().attr("nav")}),avalon.router.get("/*path",function(){var e=this.path;/^(\/|\/index|\/home)$/.test(this.path)&&(e="home");var t=$$.rootVm.page=e.split("&")[0].replace(/\//,"");if(c[t]||void 0!=u[t]){s.removeClass("active");var a=s[u[c[t]||t]];a.className="active";var o=$(a).parent("ul");o.is(":hidden")&&o.siblings("div").click(),l[t]&&"true"==this.query.noRefresh||(l[t]=+new Date),$$.rootVm.pageUrl="club-admin/raw/tpl/"+t+".tpl.html?"+l[t],$$.rootVm.integrationExpand="integrationSys"==o.attr("data-menu")}}),avalon.history.start();var d=$(window),m=$("#content");d.on("resize",function(){e()}),e();var p={},g=getParamObj(),h=g.cid||iSessionStorage("cid")||"";h&&(p.token=h,iSessionStorage("cid",h),$$.rootVm.shopsAdmin=!0),$.ajaxSetup({type:"get",dataType:"json",data:p,cache:!1,complete:function(e){401!=e.status&&302!=e.status||(location.href="./login")}}),$.ajax({url:"profile/data",success:function(e){if(200==e.statusCode){e=e.respData,$$.clubId=e.club.clubId,$("div#info>div.club").text(e.club.name);var t=$("body>header>div.logo>img")[0];t.onerror=function(){this.src="./club-admin/img/common/logo.png"},t.src=e.club.imageUrl}}}),$$.rootVm.getMessageCount(),setTimeout(function(){$$.rootVm.getMessageCount()},12e4),avalon.filters.bizMoneyToYuan=function(e){return((e-0)/100).toFixed(2)},avalon.scan(document.body)});