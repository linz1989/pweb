require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page");

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("营销中心 >> 付费预约");

    var vm = avalon.define({
        $id : vmId,
        paidOrderStartTimeArr : [],
        paidOrderEndTimeArr : [],
        paidOrderUserSwitch : "off",
        paidOrderSysSwitch : "off",
        paidOrderPlatformFree : "",
        paidOrderDownPayment : "",
        paidOrderExpireCommission : "",
        paidOrderTechCommission : "",
        paidOrderStartTime : "",
        paidOrderEndTime : "",
        paidOrderConfId : "",
        doChangeEndTime : function(){
            vm.paidOrderEndTime = this.value;
            $("#paidOrderAllDay").removeClass("active");
        },
        doChangeStartTime : function(){
            vm.paidOrderStartTime = this.value;
            $("#paidOrderAllDay").removeClass("active");
        },
        doClickAllDay : function(){
            if(this.className == "active"){
                this.className = "";
            }
            else{
                this.className = "active";
                vm.paidOrderStartTime = "00:00";
                vm.paidOrderEndTime = "23:59";
                $("#paidOrderStartTime").val(vm.paidOrderStartTime);
                $("#paidOrderEndTime").val(vm.paidOrderEndTime);
            }
        },
        doClickSwitch : function(){
            var isOpen = (this.className == "active");
            this.className = (isOpen ? "" : "active");
            var ele = this;
            $.ajax({
                url : "cluborder/open_or_off",
                data : { status : (isOpen ? "off" : "on") },
                success : function(res){
                    if(res.statusCode == 200){
                        vm.paidOrderUserSwitch = (isOpen ? "off" : "on");
                        if(!isOpen){
                            getPaidOrderConfigInfo();
                        }
                    }
                    else{
                        msgAlert("操作失败！");
                        ele.className = (isOpen ? "active" : "");
                    }
                }
            });
        },
        doSave : function(){
            vm.paidOrderDownPayment = vm.paidOrderDownPayment.replace(/\D/g, '').substring(0,6);
            vm.paidOrderExpireCommission = vm.paidOrderExpireCommission.replace(/\D/g, '').substring(0,6);
            vm.paidOrderTechCommission = vm.paidOrderTechCommission.replace(/\D/g, '').substring(0,6);
            vm.paidOrderDownPayment = vm.paidOrderDownPayment || 0;
            vm.paidOrderExpireCommission = vm.paidOrderExpireCommission || 0;
            vm.paidOrderTechCommission = vm.paidOrderTechCommission || 0;

            if(parseInt(vm.paidOrderTechCommission) != 0 && parseInt(vm.paidOrderTechCommission)>=parseInt(vm.paidOrderDownPayment)){
                msgAlert("核销提成须小于预约定金！");
                return ;
            }

            if(parseInt(vm.paidOrderExpireCommission) != 0 && parseInt(vm.paidOrderExpireCommission)>=parseInt(vm.paidOrderDownPayment)){
                msgAlert("过期提成须小于预约定金！");
                return ;
            }

            var totalFeeOfExpire = parseInt(vm.paidOrderExpireCommission)+(vm.paidOrderPlatformFree.slice(-1)=="元" ? parseFloat(vm.paidOrderPlatformFree) : parseInt(vm.paidOrderPlatformFree)/100*parseInt(vm.paidOrderDownPayment) );
            var totalFeeOfTech = parseInt(vm.paidOrderTechCommission)+(vm.paidOrderPlatformFree.slice(-1)=="元" ? parseFloat(vm.paidOrderPlatformFree) : parseInt(vm.paidOrderPlatformFree)/100*parseInt(vm.paidOrderDownPayment) );
            if((totalFeeOfExpire != 0 && totalFeeOfExpire>parseInt(vm.paidOrderDownPayment))  || (totalFeeOfTech != 0 && totalFeeOfTech>parseInt(vm.paidOrderDownPayment)) ){
                msgAlert("提成+手续费须小于预约定金！");
                return ;
            }
            $.ajax({
                url : "cluborder/save",
                data : {
                    downPayment : vm.paidOrderDownPayment,
                    expireCommission : vm.paidOrderExpireCommission,
                    techCommission : vm.paidOrderTechCommission,
                    startTime : $("#paidOrderStartTime").val(),
                    endTime : $("#paidOrderEndTime").val(),
                    id : vm.paidOrderConfId
                },
                success : function(res){
                    if(res.statusCode == 200){
                        msgAlert(res.msg || "保存成功！",true);
                    }
                }
            });
        }
    });

    function getPaidOrderConfigInfo(){
        $.ajax({
            url : "cluborder/view",
            success : function(res){
                if(res.statusCode == 200){
                    res = res.respData;
                    vm.paidOrderDownPayment = res.downPayment || 0;
                    vm.paidOrderExpireCommission = res.expireCommission || 0;
                    vm.paidOrderTechCommission = res.techCommission || 0;
                    vm.paidOrderStartTime = res.startTime || "00:00";
                    vm.paidOrderEndTime = res.endTime || "23:59";
                    vm.paidOrderConfId = res.id;
                    if(vm.paidOrderStartTime=="00:00" && vm.paidOrderEndTime=="23:59"){
                        $("#paidOrderAllDay").addClass("active");
                    }
                    $("#paidOrderStartTime").val(vm.paidOrderStartTime);
                    $("#paidOrderEndTime").val(vm.paidOrderEndTime);
                }
            }
        });
    }

    /////输入限制
    $("#paidOrderForm").on("input","li>input[type=text]",function(){
        if (/\D/.test(this.value)) {
            this.value = this.value.replace(/\D/g, '');
        }
        if(this.value.length>6) this.value = this.value.substr(0,6);
    });

    $.ajax({
        url : "api/v2/manager/paid_order/open_status",
        success : function(res){
            if(res.statusCode == 200){
                res = res.respData;
                vm.paidOrderSysSwitch = res.payAppointment == "Y" ? "on" : "off";
                vm.paidOrderUserSwitch = res.openStatus;
                vm.paidOrderPlatformFree = (res.platformFee.indexOf("%") > 0 ? res.platformFee : parseFloat(res.platformFee || 0)/100+"元");
                if (vm.paidOrderSysSwitch == "on") {
                    var arr = [];
                    for (var i = 0; i < 24; i++) {
                        arr.push((i < 10 ? "0" + i : i) + ":00");
                        arr.push((i < 10 ? "0" + i : i) + ":30");
                    }
                    vm.paidOrderStartTimeArr = arr;
                    arr.push("23:59");
                    vm.paidOrderEndTimeArr = arr;
                    avalon.scan(thisPage[0]);
                    if(vm.paidOrderUserSwitch == "on") getPaidOrderConfigInfo();//获取付费预约配置
                }
            }
        }
    });
});