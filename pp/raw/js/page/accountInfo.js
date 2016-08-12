require(["!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        rechargeAcct = $('#rechargeAcct'),
        rechargeMoney = $('#rechargeMoney'),
        rechargeRemark = $('#rechargeRemark'),
        rechargeModal;
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("结算中心 >> 账户金额");

    var vm = avalon.define({
        $id : vmId,
        money : "",
    });


    $.ajax({
        /*url : "api/v2/club/deals/paidcoupon",*/
        url:'club/finacial/account/total',
        type:'post',
        success : function(res){
            if(res.statusCode == 200){
                vm.money = res.respData.accountAmount;
            }
            avalon.scan(thisPage[0]);
        }
    });

});