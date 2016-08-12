require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        dateRangeSearch = $("#dataListTable>table>thead>tr.search>th>div.time>input"),
        dataListPagination;
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("数据统计 >> <a href='#!/ordinaryCouponDataStatistics'>优惠券</a> >> 优惠券数据详情");

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        countDataList : [],
        selectCouponId : "",
        couponSelectData : [],
        orderName : "",
        sortType : "",
        switchCoupon : function(){
            vm.selectCouponId = this.value;
            queryData();
        },
        doClickSearch : function(){
            queryData();
        }
    });

    //////////////////日期范围
    var initStartDate = new Date(), initEndDate = new Date();
    initStartDate.setTime(initStartDate.getTime()-30*24*60*60*1000);

    dateRangeSearch.daterangepicker({ startDate : initStartDate, endDate : initEndDate },function(start,end){
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
            url : "club/datastatistics/redpacket_share_use_get_data",
            type : "post",
            data : {
                startDate : startDate ,
                endDate : endDate,
                page : page ,
                pageSize : pageSize,
                actId : vm.selectCouponId,
                orderName : vm.orderName,
                ascDesc : vm.sortType,
                techInfo : $("#techInfoSearch").val(),
                techPhone : $("#techTelSearch").val()
            },
            success : function(res){
                if(res.statusCode == 200){
                    var countList = [], dataList = [], k;
                    for(k=0;k<res.respData.length;k++){
                        if(res.respData[k]["nickNameAndNo"]=="合计:"){
                            countList[1] = res.respData[k];
                        }
                        else if(res.respData[k]["nickNameAndNo"]=="其它方式"){
                            countList[0] = res.respData[k];
                        }
                        else{
                            dataList.push(res.respData[k]);
                        }
                    }

                    vm.dataList = dataList;
                    if(countList[0] && countList[1]) vm.countDataList = countList;
                    else vm.countDataList=[];

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
                    if(res[i].couponTypeName) res[i].actTitle = res[i].actTitle+"("+res[i].couponTypeName+")";
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

    $("#techTelSearch").on("input",function(){
        if (/\D/.test(this.value)) {
            this.value = this.value.replace(/\D/g, '');
        }
        if(this.value.length>11) this.value = this.value.substr(0,11);
    });

    $("#sortHeader>th>a").click(function(){
        vm.sortType = this.getAttribute("sortType")=="desc" ? "asc" : "desc";
        vm.orderName = this.getAttribute("sortName");
        this.setAttribute("sortType",vm.sortType);
        queryData();
    });
    queryData();
});