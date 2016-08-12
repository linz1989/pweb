require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        currPage = 1,
        dateRangeSearch = $("#dataListTable>table>thead>tr.search>th>div.time>input"),
        dateBtns = $("#dataListTable>table>thead>tr.search>th>div.time>a"),
        dataListPagination;
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("<a href='#!/home'>首页</a> >> 订单列表");

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        statusObj : [
            { "value" : "" , "name" : "所有状态" },
            { "value" : "complete" , "name" : "已完成" },
            { "value" : "submit" , "name" : "待接受" },
            { "value" : "accept" , "name" : "已接受" },
            { "value" : "reject" , "name" : "已拒绝" },
            { "value" : "failure" , "name" : "失效" },
            { "value" : "overtime" , "name" : "超时"}
        ],
        paidOrderSwitch : "off",
        currStatus : "",
        doChangeStatusQuery : function(){////状态改变时触发查询
            vm.currStatus = this.value;
            queryData();
        },
        doSearchQuery : function(){///点击搜索按钮
            queryData();
        },
        doHandlerUsePaidOrder : function(id,type,orderNo){
            $.ajax({
                url : "api/v2/manager/user/paid_order/use",
                data : { id : id , processType : type , orderNo : orderNo },
                success : function(res){
                    if(res.statusCode == 200){
                        msgAlert(type == "verified" ? "使用成功！" : "操作成功！",true);
                        queryData(currPage);
                    }
                    else{
                        msgAlert(res.msg || "操作失败！");
                    }
                }
            });
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
        currPage = page = page || 1;
        var  dateRange = formatDateRangeVal(dateRangeSearch.val()),
            startDate = start || dateRange.start,
            endDate = end || dateRange.end;
        $.ajax({
            url : "info/orderData",
            type : "post",
            data : { startTime : startDate , endTime : endDate, page : page , pageSize : pageSize, serialNo : $("#search-serial").val() , status : vm.currStatus },
            success : function(res){
                if(res.respData){
                    vm.dataList = res.respData;
                    dataListPagination.refresh({ currPage : page , totalPage : res.pageCount });
                    avalon.scan(thisPage[0]);
                }
            }
        });
    }

    $.ajax({
        url : "api/v2/manager/paid_order/open_status",
        success : function(res){
            if(res.statusCode == 200){
                res = res.respData;
                res.payAppointment = res.payAppointment == "Y" ? "on" : "off";
                if (res.payAppointment == "on" && res.openStatus == "on") {
                    vm.paidOrderSwitch = "on";
                }
                queryData();
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
});