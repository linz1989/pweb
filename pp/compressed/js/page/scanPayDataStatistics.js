require(["css!../../compressed/css/page/dataStatistics.css?"+$$.rootVm.currTime,"css!../../compressed/css/page/scanPayDataStatistics.css?"+$$.rootVm.currTime,"daterangepicker","highcharts","!domReady"],function(){function a(){$.ajax({url:"club/finacial/account/scanpay/total",success:function(a){200==a.statusCode&&a.respData&&(r.countObj=a.respData,avalon.scan(s[0]))}})}function t(a,t){var e=$("#scanPayChartGroup>div.tool>a.active").attr("type"),s=formatDateRangeVal(c.val()),r=a||s.start,o=t||s.end;$.ajax({url:"club/finacial/account/scanpay/report",data:{startDate:r,endDate:o,type:e},success:function(a){if(200==a.statusCode){a=a.respData;var t={xAxis:{categories:a.days,labels:{step:Math.round(a.days.length/10)<1?1:Math.round(a.days.length/10),staggerLines:1},tickmarkPlacement:"on"},series:function(a){return a.forEach(function(t,e){"订单笔数"!=t.name&&t.data.forEach(function(t,s){a[e].data[s]=(t/100).toFixed(2)-0})}),a}(a.data),yAxis:[{title:{text:null},min:0,allowDecimals:!1}],tooltip:{},colors:["#f5b156","#7cb5ec"]};$("#scanPayChartGroup>div.chart").updateChart(t)}}})}var e=$$.rootVm.page+"Ctrl"+ +new Date,s=$("#"+$$.rootVm.page+"Page"),c=$("#scanPayChartGroup>div.tool>div>input");s.attr("ms-controller",e),$$.currPath.html("数据统计 >> 账户统计");var r=avalon.define({$id:e,currSelectCouponId:"",couponList:[],countObj:{totalAmount:"-",orderCount:"-"}}),o=new Date;o.setTime(o.getTime()-2592e6),c.daterangepicker({startDate:o,endDate:new Date},function(a,e){$("#scanPayChartGroup>div.tool>div>a").removeClass("active"),t(a.format("YYYY-MM-DD"),e.format("YYYY-MM-DD"))}),$("#scanPayChartGroup>div.tool>a").click(function(){var a=$(this);a.hasClass("active")||(a.siblings().removeClass("active"),a.addClass("active"),t())}),$("#scanPayChartGroup>div.tool>div>a").click(function(){var a=$(this);if(!a.hasClass("active")){a.siblings().removeClass("active"),a.addClass("active");var e=new Date;e.setTime(e.getTime()-24*parseInt(a.attr("type"))*60*60*1e3),c.data("daterangepicker").setStartDate(e),c.data("daterangepicker").setEndDate(new Date),t()}}),$.ajax({url:"club/datastatistics/get_club_coupon_ids",success:function(a){200==a.statusCode&&(r.couponList=a.respData)}}),a(),t()});