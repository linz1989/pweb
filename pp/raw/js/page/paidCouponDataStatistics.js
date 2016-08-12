require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        dateRangeSearch = $("#dataListTable>table>thead>tr.search>th>div.time>input"),
        dateBtns = $("#dataListTable>table>thead>tr.search>th>div.time>a");
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("数据统计 >> 点钟券");

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        selectCouponId : "",
        couponSelectData : [],
        countObj : {},
        switchCoupon : function(){
            vm.selectCouponId = this.value;
            queryData();
        }
    });

    //////////////////日期范围
    var initStartDate = new Date(), initEndDate = new Date();
    initStartDate.setTime(initStartDate.getTime()-30*24*60*60*1000);
    
    dateRangeSearch.daterangepicker({ startDate : initStartDate, endDate : initEndDate },function(start,end){
        dateBtns.removeClass("active");
        queryData(start.format("YYYY-MM-DD"),end.format("YYYY-MM-DD"))
    });

    function queryData(start,end){
        var  dateRange = formatDateRangeVal(dateRangeSearch.val()),
            startDate = start || dateRange.start,
            endDate = end || dateRange.end;
        $.ajax({
            url : "club/datastatistics/paidcoupon/index",
            data : { startDate : startDate , endDate : endDate, actId : vm.selectCouponId },
            success : function(res){
                if(res.statusCode == 200){
                    res = res.respData;
                    vm.dataList = res.records;
                    vm.countObj = res;
                    avalon.scan(thisPage[0]);
                }
            }
        });
    }

    $.ajax({
        url : "api/v2/club/paidcoupons",
        success : function(res){
            if(res.statusCode == 200){
                vm.couponSelectData = res.respData;
            }
            else if(res.msg) msgAlert(res.msg);
        }
    });

    //////////////////////////////日期范围的选择
    dateBtns.click(function(){
        var $this = $(this);
        if(!$this.hasClass("active")){
            $this.siblings().removeClass("active");
            $this.addClass("active");
            var type = $this.attr("type");
            if(type != "all"){
                var initStartDate = new Date();
                initStartDate.setTime(initStartDate.getTime()-parseInt(type)*24*60*60*1000);
                dateRangeSearch.data('daterangepicker').setStartDate(initStartDate);
                dateRangeSearch.data('daterangepicker').setEndDate(new Date());
            }
            else{
                dateRangeSearch.val("");
            }
            queryData();
        }
    });

    queryData();
});