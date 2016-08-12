require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        currPage = 1,
        dataListPagination;
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("数据统计 >> <a href='#!/registeredDataStatistics'>注册用户</a> >> 注册用户列表");

    var vm = avalon.define({
        $id : vmId,
        userTotal : 0,
        countObj : {},
        userType : {
            "temp" : "领券用户",
            "temp-tech" : "领券用户",
            "weixin" : "微信用户",
            "tech" : "粉丝用户",
            "user" : "粉丝用户"
        },
        dataList : []
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
            url : "club/datastatistics/register/list",
            data : {  page : page , pageSize : pageSize },
            success : function(res){
                if(res.respData){
                    vm.userTotal = res.respData.row;
                    vm.dataList = res.respData.users;
                    vm.countObj = res.respData.userCounts;
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