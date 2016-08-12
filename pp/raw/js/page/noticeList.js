require(["!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        currPage = 1,
        dataListPagination;
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("<a href='#!/home'>首页</a> >> 系统通知");

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        statusObj : { accept : "已同意" , reject : "已拒绝" , cancel : "已取消"},
        doHandlerNotice : function(id,tips){
            if(tips=="已同意"){
                $.ajax({
                    url : "tech/audit/accept",
                    data : { id : id },
                    success : function(res){
                        if(res.statusCode){
                            queryData(currPage);
                            $$.rootVm.getMessageCount();
                        }
                    }
                });
            }
            else{
                $.ajax({
                    url : "tech/audit/reject",
                    data : { id : id },
                    success : function(res){
                        if(res.statusCode){
                            queryData(currPage);
                            $$.rootVm.getMessageCount();
                        }
                    }
                });
            }
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
            url : "tech/audit/data",
            type : "post",
            data : {  page : page , pageSize : pageSize },
            success : function(res){
                if(res.respData){
                    vm.dataList = res.respData.audits;
                    dataListPagination.refresh({ currPage : page , totalPage : res.respData.pageCount });
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