require(["css!../../compressed/css/page/paidCouponDataStatistics.css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){function a(a,e,r){i=a=a||1;var u=formatDateRangeVal(o.val()),l=e||u.start,d=r||u.end;$.ajax({url:"club/datastatistics/paidcoupon/paid",type:"post",data:{page:a,pageSize:n,startDate:l,endDate:d,actId:c.selectCouponId,couponStatus:c.currCouponStatus,userInfo:$("#userTelSearch").val(),techName:$("#techNameSearch").val()},success:function(e){200==e.statusCode&&(c.dataList=e.respData.records,c.countObj=e.respData,t.refresh({currPage:a,totalPage:e.pageCount}),avalon.scan(s[0]))}})}var t,e=$$.rootVm.page+"Ctrl"+ +new Date,s=$("#"+$$.rootVm.page+"Page"),n=20,i=1,o=$("#dataListTable>table>thead>tr.search>th>div.dateRange>input"),r=$("#dataListTable>table>thead>tr.search>th>div.dateRange>a");s.attr("ms-controller",e),$$.currPath.html("数据统计 >> <a href='#!/paidCouponDataStatistics'>点钟券</a> >> 点钟券购买详情");var c=avalon.define({$id:e,dataList:[],selectCouponId:"",couponSelectData:[],countObj:{},currCouponStatus:0,switchCoupon:function(){c.selectCouponId=this.value,a()},doSearch:function(){a()},doChangeOfStatus:function(){c.currCouponStatus=this.value,a()}}),u=new Date,l=new Date;u.setTime(u.getTime()-2592e6),o.daterangepicker({startDate:u,endDate:l},function(t,e){r.removeClass("active"),a(t.format("YYYY-MM-DD"),e.format("YYYY-MM-DD"))}),t=new Pagination($("#dataListPagination"),{switchPage:function(t){a(t)}}),$.ajax({url:"api/v2/club/paidcoupons",success:function(a){200==a.statusCode?c.couponSelectData=a.respData:a.msg&&msgAlert(a.msg)}}),$("#userTelSearch").on("input",function(){/\D/.test(this.value)&&(this.value=this.value.replace(/\D/g,"")),this.value.length>11&&(this.value=this.value.substring(0,11))}).on("keypress",function(a){13==a.keyCode&&c.doSearch()}),$("#techNameSearch").on("input",function(){this.value.length>30&&(this.value=this.value.substring(0,30))}).on("keypress",function(a){13==a.keyCode&&c.doSearch()}),$("#dataListTable>table>thead>tr:eq(0)>th>div>select").on("change",function(){n=this.value,a()}),r.click(function(){var t=$(this);if(!t.hasClass("active")){t.siblings().removeClass("active"),t.addClass("active");var e=t.attr("type");if("all"!=e){var s=new Date;s.setTime(s.getTime()-24*parseInt(e)*60*60*1e3),o.data("daterangepicker").setStartDate(s),o.data("daterangepicker").setEndDate(new Date)}else o.val("");a()}}),a()});