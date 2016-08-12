require(["css!../../compressed/css/page/paidCouponDataStatistics.css?"+$$.rootVm.currTime,"!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        currPage = 1,
        dataListPagination;
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("数据统计 >> <a href='#!/paidCouponDataStatistics'>点钟券</a> >> 点钟券未使用详情");

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

    //////////////////分页器
    dataListPagination = new Pagination($("#dataListPagination"),{
        switchPage : function(page){
            queryData(page);
        }
    });

    function queryData(page){
        currPage = page = page || 1;
        $.ajax({
            url : "club/datastatistics/paidcoupon/canuse",
            type : "post",
            data : {
                page : page ,
                pageSize : pageSize,
                actId : vm.selectCouponId ,
                couponStatus : 1 ,
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

    queryData();
});