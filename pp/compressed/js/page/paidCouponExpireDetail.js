require(["css!../../compressed/css/page/paidCouponDataStatistics.css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){function a(a,t,r){i=a=a||1;var u=formatDateRangeVal(o.val()),l=t||u.start,d=r||u.end;$.ajax({url:"club/datastatistics/paidcoupon/useorexpire",type:"post",data:{page:a,pageSize:n,startDate:l,endDate:d,actId:c.selectCouponId,couponStatus:3,userInfo:$("#userTelSearch").val(),techName:$("#techNameSearch").val()},success:function(t){200==t.statusCode&&(c.dataList=t.respData.records,c.countObj=t.respData,e.refresh({currPage:a,totalPage:t.pageCount}),avalon.scan(s[0]))}})}var e,t=$$.rootVm.page+"Ctrl"+ +new Date,s=$("#"+$$.rootVm.page+"Page"),n=20,i=1,o=$("#dataListTable>table>thead>tr.search>th>div.dateRange>input"),r=$("#dataListTable>table>thead>tr.search>th>div.dateRange>a");s.attr("ms-controller",t),$$.currPath.html("数据统计 >> <a href='#!/paidCouponDataStatistics'>点钟券</a> >> 点钟券过期详情");var c=avalon.define({$id:t,dataList:[],selectCouponId:"",couponSelectData:[],countObj:{},switchCoupon:function(){c.selectCouponId=this.value,a()},doSearch:function(){a()}}),u=new Date,l=new Date;u.setTime(u.getTime()-2592e6),o.daterangepicker({startDate:u,endDate:l},function(e,t){r.removeClass("active"),a(e.format("YYYY-MM-DD"),t.format("YYYY-MM-DD"))}),e=new Pagination($("#dataListPagination"),{switchPage:function(e){a(e)}}),$.ajax({url:"api/v2/club/paidcoupons",success:function(a){200==a.statusCode?c.couponSelectData=a.respData:a.msg&&msgAlert(a.msg)}}),$("#userTelSearch").on("input",function(){/\D/.test(this.value)&&(this.value=this.value.replace(/\D/g,"")),this.value.length>11&&(this.value=this.value.substring(0,11))}).on("keypress",function(a){13==a.keyCode&&c.doSearch()}),$("#techNameSearch").on("input",function(){this.value.length>30&&(this.value=this.value.substring(0,30))}).on("keypress",function(a){13==a.keyCode&&c.doSearch()}),$("#dataListTable>table>thead>tr:eq(0)>th>div>select").on("change",function(){n=this.value,a()}),r.click(function(){var e=$(this);if(!e.hasClass("active")){e.siblings().removeClass("active"),e.addClass("active");var t=e.attr("type");if("all"!=t){var s=new Date;s.setTime(s.getTime()-24*parseInt(t)*60*60*1e3),o.data("daterangepicker").setStartDate(s),o.data("daterangepicker").setEndDate(new Date)}else o.val("");a()}}),a()});