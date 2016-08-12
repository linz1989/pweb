require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        couponVerificationModal,
        searchTel = $("#search-tel-input"),
        searchCouponNo = $("#search-couponNo-input"),
        couponPagination,
        couponArr = [],
        searchOrder = $("#search-order-input"),
        orderVerificationModal,
        treatVerificationModal,
        treatCodeInput = $('#treatCodeInput'),
        moneyInput = $('#moneyInput'),
        oldMoney = '';

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("首页");

    var vm = avalon.define({
        $id : vmId,
        paidOrderSwitch : 'off',
        couponSwitch : 'off',
        orders : [],
        freeCount : 0,
        inProgressCount : 0,
        coupons : [],
        couponsPage : 1,
        verifyCouponSuaId : "",
        selectCoupon : {
            consumeMoneyDescription : "",
            getDate : "",
            useTimePeriod : "",
            actContent : "",
            couponNo : ""
        },
        selectOrder : {
            id : "",
            customerName : "",
            phoneNum : "",
            appointTime : "",
            createdAt : "",
            techName : "",
            downPayment : "",
            statusName : "",
            status : "reject",
            isExpire : false
        },
        doPaidOrderVerify : function(){
            clearOrderSearch();
            orderVerificationModal.show();
        },
        doSearchOrder : function(){///搜索预付费订单
            if(!/\d{12}/.test(searchOrder.val())){
                orderVerificationModal.showTip("请输入正确的12位订单预约号码！");
                searchOrder.focus();
                return ;
            }
            $.ajax({
                url : "api/v2/manager/user/paid_order/view",
                data : { orderNo : searchOrder.val() },
                success : function(res){
                    if(res.statusCode == 200){
                        vm.selectOrder = res.respData;
                    }
                    else{
                        msgAlert(res.msg || "未能查询到预付费订单！");
                        clearOrderSearch();
                    }
                }
            });
        },
        doUsePaidOrder : function(type){///核销/过期预付费订单
            if(vm.selectOrder.id){
                $.ajax({
                    url : "api/v2/manager/user/paid_order/use",
                    data : { id : vm.selectOrder.id , processType : type , orderNo : searchOrder.val() },
                    success : function(res){
                        if(res.statusCode == 200){
                            msgAlert(type == "verified" ? "使用成功！" : "操作成功！",true);
                            orderVerificationModal.close();
                        }
                        else{
                            msgAlert(res.msg || "操作失败！");
                        }
                    }
                });
            }
        },
        doCouponVerify : function(){
            //////还原到初始值
            clearCouponSearch();
            couponVerificationModal.show();
        },
        couponVerifyType : "tel",
        doSearchCoupon : function(showMsg){
            if(vm.couponVerifyType == "tel"){////以手机号码搜索
                if(!/^1[34578]\d{9}$/.test(searchTel.val())){
                    searchTel.focus();
                    couponVerificationModal.showTip("请输入正确的手机号码！");
                    return;
                }
                $.ajax({
                    url : "api/v2/manager/user/coupons",
                    data : { phoneNum : searchTel.val() },
                    success : function(res){
                        //////还原到初始值
                        clearCouponSearch();

                        if(res.statusCode == 200){
                            handlerGetCoupon(res.respData);
                        }
                        else if(res.msg && showMsg){
                            msgAlert(res.msg);
                        }
                    }
                });
            }
            else{
                if(!/^\d{12}$/.test(searchCouponNo.val())){////以券优惠码搜索
                    searchCouponNo.focus();
                    couponVerificationModal.showTip("请输入12位券优惠码！");
                    return;
                }
                $.ajax({
                    url : "api/v2/manager/user/coupon/view",
                    data : { couponNo : searchCouponNo.val()},
                    success : function(res){
                        //////还原到初始值
                        clearCouponSearch();

                        if(res.statusCode == 200){
                            handlerGetCoupon([res.respData.userAct]);
                        }
                        else if(res.msg && showMsg){
                            msgAlert(res.msg);
                        }
                    }
                });
            }
        },
        deSelectVerifyCoupon : function(suaId,index){
            vm.verifyCouponSuaId = suaId;
            /////当前选中对象
            vm.selectCoupon.consumeMoneyDescription = vm.coupons[index].consumeMoneyDescription;
            vm.selectCoupon.getDate = vm.coupons[index].getDate;
            vm.selectCoupon.useTimePeriod = vm.coupons[index].useTimePeriod;
            vm.selectCoupon.actContent = vm.coupons[index].actContent;
            vm.selectCoupon.couponNo = vm.coupons[index].couponNo;
        },
        doTreatVerify: function () {
            treatCodeInput.val('');
            moneyInput.val('');
            treatVerificationModal.show();
        }
    });

    function handlerGetCoupon(resCoupons){
        var pIndex;
        for(var i=0;i<resCoupons.length;i++){
            pIndex = parseInt(i/4);///页索引
            if(couponArr[pIndex] == undefined) couponArr[pIndex] = [];
            couponArr[pIndex].push(resCoupons[i]);
        }
        vm.coupons = couponArr[0] || [];
        if(couponArr.length>0) couponPagination.refresh({ currPage : 1 , totalPage : couponArr.length });
        vm.couponsPage = couponArr.length;
    }

    function clearCouponSearch(){
        couponArr = [];
        vm.coupons = [];
        vm.couponsPage = 1;
        vm.verifyCouponSuaId = "";
        vm.selectCoupon.consumeMoneyDescription = "";
        vm.selectCoupon.getDate = "";
        vm.selectCoupon.useTimePeriod = "";
        vm.selectCoupon.actContent = "";
        vm.selectCoupon.couponNo = "";
    }

    function clearOrderSearch(){
        vm.selectOrder.id = "";
        vm.selectOrder.customerName = "";
        vm.selectOrder.phoneNum = "";
        vm.selectOrder.appointTime = "";
        vm.selectOrder.createdAt = "";
        vm.selectOrder.techName = "";
        vm.selectOrder.downPayment = "";
        vm.selectOrder.statusName ="";
        vm.selectOrder.status ="reject";
        vm.selectOrder.isExpire = false;
    }

    $.ajax({
        url : "api/v2/manager/paid_order/open_status",
        success : function(res){
            if(res.statusCode == 200){
                res = res.respData;
                res.payAppointment = res.payAppointment == "Y" ? "on" : "off";
                if (res.payAppointment == "on" && res.openStatus == "on") {
                    vm.paidOrderSwitch = "on";
                }
                vm.couponSwitch = res.couponSwitch;
                queryHomeData();
            }
        }
    });

    function queryHomeData(){
        $.ajax({
            url : "info/data",
            type : "post",
            success : function(res){
                if(res.statusCode == 200){
                    res = res.respData;
                    vm.orders = res.orders;
                    vm.banners = res.data.banners;
                    vm.freeCount = res.data.free || 0;
                    vm.inProgressCount = res.data.inProgress || 0;
                    avalon.scan(thisPage[0]);
                }
            }
        });
    }

    couponVerificationModal = new Modal($("#couponVerificationModal"),{
        doClickOkBtn : function(){/////核销
            if(vm.verifyCouponSuaId != ""){
                $.ajax({
                    url : "api/v2/manager/user/coupon/use",
                    data : { suaId : vm.verifyCouponSuaId , couponNo : vm.selectCoupon.couponNo },
                    success : function(res){
                        if(res.statusCode == 200){
                            msgAlert(res.msg,true);
                            vm.doSearchCoupon(false);
                        }
                        else{
                            msgAlert(res.msg || "核销失败！");
                        }
                    }
                });
            }
        }
    });

    couponPagination = new Pagination($("#couponPagination"),{///分页
        switchPage : function(page){
            vm.coupons = couponArr[page-1];
            couponPagination.refresh({ currPage : page , totalPage : couponArr.length });
        }
    });

    $("#couponSearchTypeSelect").on("change",function(){
        vm.couponVerifyType = this.value;
    });

    searchTel.on("input",function(){//////输入限制
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
    }).on("keypress",function(event){
        if(event.keyCode == 13){
            vm.doSearchCoupon(true);
        }
    });

    searchCouponNo.on("input",function(){///////输入限制
        if (/\D/.test(this.value)) {
            this.value = this.value.replace(/\D/g, '');
        }
        if (this.value.length > 12) {
            this.value = this.value.substring(0, 12);
        }
    }).on("keypress",function(event){
        if(event.keyCode == 13){
            vm.doSearchCoupon(true);
        }
    });

    orderVerificationModal = new Modal($("#orderVerificationModal"));

    searchOrder.on("input",function(){///////预付费订单输入限制
        if (/\D/.test(this.value)) {
            this.value = this.value.replace(/\D/g, '');
        }
        if (this.value.length > 12) {
            this.value = this.value.substring(0, 12);
        }
    }).on("keypress",function(event){
        if(event.keyCode == 13){
            vm.doSearchOrder();
        }
    });

    treatVerificationModal = new Modal($("#treatVerificationModal"),{
        doClickOkBtn : function(){/////核销
            verifiedTreat();
        }
    });

    treatCodeInput.on('input', function () {
       this.value = this.value.match(/^[\d\s]*/g)[0].replace(/\s*/g,'');
    }).on("keypress",function(event){
        if(event.keyCode == 13){
            moneyInput[0].focus();
        }
    });

    moneyInput.on('input', function () {
        if(moneyInput[0].value == ''){
            if(oldMoney.length>1){
                moneyInput[0].value = oldMoney;
            }else{
                oldMoney='';
            }
        }else{
            var tmp = moneyInput[0].value.match(/\./g);
            if(tmp&&moneyInput[0].value.match(/\./g).length>1){
                moneyInput[0].value = moneyInput[0].value.substring(0,moneyInput[0].value.length -1);
            }
            if(!/^([1-9][0-9]*|(([1-9]\d*|0)\.[0-9]{0,2})|0)$/g.test(moneyInput[0].value)){
                moneyInput[0].value = oldMoney;
            }else{
                oldMoney = moneyInput[0].value;
            }
        }
    }).on("keypress",function(event){
        if(event.keyCode == 13){
            verifiedTreat();
        }
    });

    //=== 核销授权码 ===
    function verifiedTreat(){
        if(treatCodeInput.val() == ''){
            return treatVerificationModal.showTip('授权码不能为空');
        }
        if(treatCodeInput.val().length<14){
            return treatVerificationModal.showTip('请输入14位授权码');
        }
        if(moneyInput.val() == ''){
            return treatVerificationModal.showTip('消费金额不能为空');
        }
        $.ajax({
            url:'api/v2/finacial/account/payforother/check',
            type:'post',
            data:{
                code:treatCodeInput.val(),
                usedAmount:parseFloat(moneyInput.val())*100
            },
            success: function (result) {
                if(result.statusCode == '200'){
                    msgAlert('核销成功',true);
                    treatCodeInput.val('');
                    moneyInput.val('');
                    treatVerificationModal.close();
                }else{
                    msgAlert(result.msg || '核销失败，请检查授权码或金额是否出错后再次核销');
                }
            }
        });
    }
});