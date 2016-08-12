require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        dataListPagination,
          bizTypes = {
              consume:'账户消费',
              user_recharge:'线上充值',
              pay_for_other:'请客核销',
              line_recharge:'线下充值'
          };
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("数据统计 >> <a href='#!/accountDataStatistics'>账户统计</a> >> 充值记录");

    //注册过滤器
    avalon.filters.bizTypeFilter = function (str) {
        return bizTypes[str] || '';
    };

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        selectType : "",
        searchTel:'',
        switchType : function(){
            vm.selectType = this.value;
            queryData();
        },
        doClickSearch : function(){
            queryData();
        }
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
            url : "club/finacial/user/deal/list",
            type : "post",
            data : {
                page : page ,
                pageSize : pageSize,
                showOperator:'N',
                businessCategory : vm.selectType || '',
                userName : $("#userTelSearch").val() || ''
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

    $("#userTelSearch").on("input",function(){
        if (/\D/.test(this.value)) {
            this.value = this.value.replace(/\D/g, '');
        }
        if(this.value.length>11) this.value = this.value.substr(0,11);
    }).on('keypress', function (e) {
        if(e.keyCode == 13){
            queryData();
        }
    });
    queryData();
});