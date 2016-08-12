require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        currPage = 1,
        dateRangeSearch = $("#dataListTable>table>thead>tr.search>th>div.time>input"),
        dateBtns = $("#dataListTable>table>thead>tr.search>th>div.time>a"),
        dataListPagination,
        bizTypes = {
            paid_order:'付费预约',
            paid_coupon:'点钟券',
            club_charge:'会所充值',
            coupon:'优惠券',
            direct_reward:'直接打赏',
            withdrawal:'提现',
            consume:'扫码支付',
            user_recharge:'用户充值'
        };
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("结算中心 >> 结算记录");

    //注册过滤器
    avalon.filters.bizTypeFilter = function (str) {
        return bizTypes[str] || '';
    };

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        selectType : "",
        switchType : function(){
            vm.selectType = this.value;
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
        currPage = page = page || 1;
        var  dateRange = formatDateRangeVal(dateRangeSearch.val()),
            startDate = start || dateRange.start,
            endDate = end || dateRange.end;
        $.ajax({
            url : "club/finacial/deal/list",
            data : { startDate : startDate , endDate : endDate, page : page , pageSize : pageSize, businessCategory:vm.selectType },
            success : function(res){
                if(res.statusCode == 200){
                    vm.dataList = res.respData;
                    dataListPagination.refresh({ currPage : page , totalPage : res.pageCount });
                    avalon.scan(thisPage[0]);
                }
            }
        });
    }

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