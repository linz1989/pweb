require(["css!../../compressed/css/page/dataStatistics.css?"+$$.rootVm.currTime,"css!../../compressed/css/page/accountDataStatistics.css?"+$$.rootVm.currTime,"daterangepicker","highcharts","!domReady"],function(){function a(){$.ajax({url:"club/finacial/user/account/total",success:function(a){200==a.statusCode&&a.respData&&(c.countObj=a.respData,avalon.scan(r[0]))}})}function t(a,t){var e=$("#accountDataChartGroup>div.tool>a.active").attr("type"),r=formatDateRangeVal(s.val()),c=a||r.start,o=t||r.end;$.ajax({url:"club/finacial/user/account/report",data:{startDate:c,endDate:o,type:e},success:function(a){if(200==a.statusCode){a=a.respData;var t={xAxis:{categories:a.days,labels:{step:Math.round(a.days.length/10)<1?1:Math.round(a.days.length/10),staggerLines:1},tickmarkPlacement:"on"},series:function(a){return a.forEach(function(t,e){"订单笔数"!==t.name&&t.data.forEach(function(t,r){a[e].data[r]=(t/100).toFixed(2)-0})}),a}(a.data),yAxis:[{title:{text:null},min:0,allowDecimals:!1}],tooltip:{},colors:["#f5b156","#7cb5ec","#ff7d7d"]};$("#accountDataChartGroup>div.chart").updateChart(t)}}})}var e=$$.rootVm.page+"Ctrl"+ +new Date,r=$("#"+$$.rootVm.page+"Page"),s=$("#accountDataChartGroup>div.tool>div>input");r.attr("ms-controller",e),$$.currPath.html("数据统计 >> 账户统计");var c=avalon.define({$id:e,rechargeList:[],countObj:{totalAmount:"-",usedAmount:"-",orderCount:"-",notUsedAmount:"-"}}),o=new Date;o.setTime(o.getTime()-2592e6),s.daterangepicker({startDate:o,endDate:new Date},function(a,e){$("#accountDataChartGroup>div.tool>div>a").removeClass("active"),t(a.format("YYYY-MM-DD"),e.format("YYYY-MM-DD"))}),$("#accountDataChartGroup>div.tool>a").click(function(){var a=$(this);a.hasClass("active")||(a.siblings().removeClass("active"),a.addClass("active"),t())}),$("#accountDataChartGroup>div.tool>div>a").click(function(){var a=$(this);if(!a.hasClass("active")){a.siblings().removeClass("active"),a.addClass("active");var e=new Date;e.setTime(e.getTime()-24*parseInt(a.attr("type"))*60*60*1e3),s.data("daterangepicker").setStartDate(e),s.data("daterangepicker").setEndDate(new Date),t()}}),a(),t()});