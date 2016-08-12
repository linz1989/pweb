require(["!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        currPage = 1,
        dataListPagination;
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("积分系统 >> 积分兑换申请");

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        statusObj : { approve : "已同意" , reject : "已拒绝" },
        doHandlerApply : function(id,status){////处理积分兑换申请
            $.ajax({
                url : "club/credit/exchange/approve",
                data : {
                    applicationId : id,
                    status : status
                },
                success : function(res){
                    if(res.statusCode == 200){
                        $$.rootVm.getMessageCount();
                        queryData(currPage);///更新列表
                        msgAlert(res.msg || "操作成功！",true);
                    }
                    else{
                        msgAlert(res.msg || "操作失败！");
                    }
                }
            });
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
            url : "club/credit/exchange/applications",
            data : {  page : page , pageSize : pageSize },
            success : function(res){
                if(res.respData){
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