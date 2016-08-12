require(["css!../../compressed/css/page/couponRecord.css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        dateRangeSearch = $("#dataListTable>table>thead>tr.search>th>div.time>input"),
        dateBtns = $("#dataListTable>table>thead>tr.search>th>div.time>a"),
        dataListPagination;
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("数据统计 >> <a href='#!/ordinaryCouponDataStatistics'>优惠券</a> >> 优惠券领取记录");

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        selectCouponId : "",
        couponSelectData : [],
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
        queryData(1,start.format("YYYY-MM-DD"),end.format("YYYY-MM-DD"))
    });

    //////////////////分页器
    dataListPagination = new Pagination($("#dataListPagination"),{
        switchPage : function(page){
            queryData(page);
        }
    });

    function queryData(page,start,end){
        page = page || 1;
        var  dateRange = formatDateRangeVal(dateRangeSearch.val()),
            startDate = start || dateRange.start,
            endDate = end || dateRange.end;
        $.ajax({
            url : "act/coupon_get_data",
            type : "post",
            data : { startDate : startDate , endDate : endDate, page : page , pageSize : pageSize, actId : vm.selectCouponId },
            success : function(res){
                if(res.statusCode == 200){
                    vm.dataList = res.respData;
                    dataListPagination.refresh({ currPage : page , totalPage : res.pageCount });
                    avalon.scan(thisPage[0]);
                }
            }
        });
    }

    $.ajax({
        url : "club/datastatistics/get_club_coupon_ids",
        success : function(res){
            if(res.statusCode == 200){
                var list = [{ actId : "" , actTitle : "全部优惠券" , couponTypeName : ""}];
                res = res.respData;
                for(var i=0;i<res.length;i++){
                    if(res[i].couponTypeName) res[i].actTitle = res[i].actTitle+"("+res[i].couponTypeName+")"
                    list.push(res[i]);
                }
                vm.couponSelectData = list;
            }
            else if(res.msg) msgAlert(res.msg);
        }
    });

    /////////////////////////////pageSize下拉的变化
    $("#dataListTable>table>thead>tr:eq(0)>th>div>select").on("change",function(){
        pageSize = this.value;
        queryData();
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