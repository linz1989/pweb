require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,/*"daterangepicker",*/"!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageSize = 20,
        currPage = 1,
        dataListPagination,
        rechargeAcct = $('#rechargeAcct'),
        rechargeMoney = $('#rechargeMoney'),
        rechargeRemark = $('#rechargeRemark'),
        rechargeModal,
        oldMoney = '',
        bizTypes = {
            consume:'账户消费',
            user_recharge:'线上充值',
            pay_for_other:'请客核销',
            line_recharge:'线下充值'
        };
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("结算中心 >> 现金充值");

    //注册过滤器
    avalon.filters.bizTypeFilter = function (str) {
        return bizTypes[str] || '';
    };

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        showModal: function () {
            rechargeModal.show();
        }
    });
    //avalon.scan(thisPage[0]);

    //////////////////日期范围
    /*var initStartDate = new Date(), initEndDate = new Date();
    initStartDate.setTime(initStartDate.getTime()-30*24*60*60*1000);

    dateRangeSearch.daterangepicker({ startDate : initStartDate, endDate : initEndDate },function(start,end){
        dateBtns.removeClass("active");
        //queryData(1,start.format("YYYY-MM-DD"),end.format("YYYY-MM-DD"))
    });*/

    //////////////////分页器
    dataListPagination = new Pagination($("#dataListPagination"),{
        switchPage : function(page){
            queryData(page);
        }
    });
    rechargeModal = new Modal($("#rechargeModal"),{
        doClickOkBtn : function(){
            recharge();
        }
    });
    function checkForm(){
        if(!rechargeAcct.val()){
            rechargeModal.showTip("请输入手机号码！");
            rechargeAcct.focus();
            return false;
        }
        else if(!/^1[34578]\d{9}$/.test(rechargeAcct.val())){
            rechargeModal.showTip("请输入正确的手机号码！");
            rechargeAcct.focus();
            return false;
        }
        if(!rechargeMoney.val()){
            rechargeModal.showTip("请输入金额！");
            rechargeMoney.focus();
            return false;
        }else if(!/^([1-9][0-9]*|(([1-9]\d*|0)\.[0-9]{0,2})|0)$/g.test(rechargeMoney.val())){
            rechargeModal.showTip("请输入正确的金额(最多两位小数)！");
            rechargeMoney.focus();
            return false;
        }
        return true;
    }
    function recharge(){
        if(checkForm()){
            $.ajax({
                url:'club/finacial/user/recharge/save',
                type:'post',
                dataType:'json',
                data:{
                    amount:parseFloat(rechargeMoney.val())*100,
                    remark:rechargeRemark.val(),
                    telephone:rechargeAcct.val()
                },
                success: function (response) {
                    if(response.statusCode =='200'){
                        queryData();
                        rechargeMoney.val('');
                        rechargeRemark.val('');
                        msgAlert('充值成功。',true);
                        rechargeModal.close();
                    }else{
                        msgAlert('充值失败：'+response.msg);
                    }
                }
            });
        }
    }

    rechargeAcct.on("input",function(){
        if (/\D/.test(this.value)) {
            this.value = this.value.replace(/\D/g, '');
        }
        if (this.value.length == 1 && this.value != 1) {
            this.value = "";
        }
        if (this.value.length == 2 && !/^1[34578]$/.test(this.value)) {
            this.value = 1;
        }
        if (this.value.length > 11) {
            this.value = this.value.substring(0, 11);
        }
    });

    rechargeMoney.on('input', function () {
        if(rechargeMoney[0].value == ''){
            if(oldMoney.length>1){
                rechargeMoney[0].value = oldMoney;
            }else{
                oldMoney='';
            }
        }else{
            var tmp = rechargeMoney[0].value.match(/\./g);
            if(tmp&&rechargeMoney[0].value.match(/\./g).length>1){
                rechargeMoney[0].value = rechargeMoney[0].value.substring(0,rechargeMoney[0].value.length -1);
            }
            if(!/^([1-9][0-9]*|(([1-9]\d*|0)\.[0-9]{0,2})|0)$/g.test(rechargeMoney[0].value)){
                rechargeMoney[0].value = oldMoney;
            }else{
                oldMoney = rechargeMoney[0].value;
            }
        }
    });

    /*rechargeRemark.on('keypress', function () {

    })*/

    function queryData(page,start,end){
        currPage = page = page || 1;
        /*var  dateRange = formatDateRangeVal(dateRangeSearch.val()),
          startDate = start || dateRange.start,
          endDate = end || dateRange.end;*/
        $.ajax({
            url : "club/finacial/user/deal/list",
            data : { /*startDate : startDate , endDate : endDate,*/ page : page , pageSize : pageSize, 	businessCategory:'line_recharge',showOperator:'Y' },
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
   /* dateBtns.click(function(){
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
    });*/

    queryData();
});