require(["daterangepicker","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        dataListPagination;
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("数据统计 >> <a href='#!/scanPayDataStatistics'>扫码支付</a> >> 支付记录");

    var vm = avalon.define({
        $id : vmId,
        dataList : []
    });

    //////////////////分页器
    dataListPagination = new Pagination($("#dataListPagination"),{
        switchPage : function(page){
            queryData(page);
        }
    });

    function queryData(page,start,end){
        page = page || 1;
        $.ajax({
            url : "club/finacial/deal/list",
            type : "post",
            data : {
                page : page ,
                pageSize : pageSize,
                businessCategory : 'consume'
            },
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

    queryData();
});