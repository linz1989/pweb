require(["css!../../compressed/css/page/paidCouponDataStatistics.css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        currPage = 1,
        dataListPagination,
        dateRangeSearch = $("#dataListTable>table>thead>tr.search>th>div.dateRange>input"),
        dateBtns = $("#dataListTable>table>thead>tr.search>th>div.dateRange>a");

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("数据统计 >> <a href='#!/paidCouponDataStatistics'>点钟券</a> >> 点钟券使用详情");

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        selectCouponId : "",
        couponSelectData : [],
        countObj : {},
        switchCoupon : function(){
            vm.selectCouponId = this.value;
            queryData();
        },
        doSearch : function(){
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

    //////////////////分页器
    dataListPagination = new Pagination($("#dataListPagination"),{
        switchPage : function(page){
            queryData(page);
        }
    });

    function queryData(page,start,end){
        currPage = page = page || 1;
        var  dateRange = formatDateRangeVal(dateRangeSearch.val()),
            startDate = start || dateRange.start,
            endDate = end || dateRange.end;
        $.ajax({
            url : "club/datastatistics/paidcoupon/useorexpire",
            type : "post",
            data : {
                page : page ,
                pageSize : pageSize,
                startDate : startDate ,
                endDate : endDate,
                actId : vm.selectCouponId ,
                couponStatus : 2,
                userInfo : $("#userTelSearch").val(),
                techName : $("#techNameSearch").val()
            },
            success : function(res){
                if(res.statusCode == 200){
                    vm.dataList = res.respData.records;
                    vm.countObj = res.respData;
                    dataListPagination.refresh({ currPage : page , totalPage : res.pageCount });
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

    ////////限制输入
    $("#userTelSearch").on("input",function(){
        if (/\D/.test(this.value)) {
            this.value = this.value.replace(/\D/g, '');
        }
        if (this.value.length > 11) {
            this.value = this.value.substring(0, 11);
        }
    }).on("keypress",function(event){
        if(event.keyCode == 13){
            vm.doSearch();
        }
    });

    $("#techNameSearch").on("input",function(){
        if (this.value.length > 30) {
            this.value = this.value.substring(0, 30);
        }
    }).on("keypress",function(event){
        if(event.keyCode == 13){
            vm.doSearch();
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