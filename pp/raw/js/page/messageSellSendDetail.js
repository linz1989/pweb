require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        dataListPagination,
        msgId = getParamObj("id");

    if(!msgId){
        msgAlert("页面访问参数错误！");
        history.back();
    }
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("营销中心 >> <a href='#!/messageSell'>短信营销 >> <a href='#!/messageSellDetail?id="+msgId+"&editable=false'>短信详情</a> >> 短信发送详情</a>");

    var vm = avalon.define({
        $id : vmId,
        pageSize : 20,
        currPage : 1,
        messages : [],
        dict : { status : { "S" : '成功', "F" : "失败" , "N" : "未发送","I": "发送中" } },
        successNum : 0,//成功发送条数
        failNum : 0, //失败发送条数
        doChangePageSize : function(){
            vm.pageSize = this.value;
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
        vm.currPage = page = page || 1;
        $.ajax({
            url : "message/details",
            data: { page : page, pageSize : vm.pageSize, messageId : msgId },
            success: function (res) {
                if(res.statusCode == 200){
                    vm.successNum = res.respData.successNum;
                    vm.failNum = res.respData.failNum;
                    vm.messages = res.respData.details || [];
                    dataListPagination.refresh({ currPage : page , totalPage : res.pageCount });
                    console.log("avalon scan....");
                    avalon.scan(thisPage[0]);
                }
                else{
                    msgAlert(res.msg || "数据查询失败！");
                }
            }
        });
    }
    queryData();
});