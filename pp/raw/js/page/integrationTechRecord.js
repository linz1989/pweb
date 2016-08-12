require(["css!../../compressed/css/page/integrationSys.css?"+$$.rootVm.currTime,"!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        currPage = 1,
        dataListPagination,
        searchTel = $("#search-tel");

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("积分系统 >> 技师积分记录");

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        doClickSearchBtn : function(){
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
            url : "club/credit/trade/records",
            data : {
                clubId : $$.clubId,
                page : page ,
                pageSize : pageSize,
                userType : 'tech',
                searchParam : searchTel.val()
            },
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

    ////////////////////////////////////////////////输入限制
    searchTel.on("input", function () {
        if (/\D/.test(this.value)) {
            this.value = this.value.replace(/\D/g, '');
        }
        if (this.value.length > 11) {
            this.value = this.value.substring(0, 11);
        }
    }).on("keypress", function (event) {
        if (event.keyCode == 13) {
            queryData();
        }
    });

    queryData();
});