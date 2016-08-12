require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"qrcode","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        dataListPagination,
        i = 0,
        chargeSuitList,
        inCharge = false,
        chargeModal,
        confirmModal,
        payQrcodeModal,
        quickSendModal,
        remainderTimer,
        remainderCount,
        remainderTimeSpan = $("#messagePayQrcodeModal>div>div.content>span"),
        queryPayedTimer,
        quickSend = $("#confirmQuickSendModal"),
        updateStatusEnableObj={};

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("营销中心 >> 短信营销");

    var vm = avalon.define({
        $id : vmId,
        pageSize : 15,
        currPage : iSessionStorage("messageSell-currPage") || 1,
        messages : [], //短信数据列表
        availableCount : 0, //短信余额
        userCount : 0, //可发送用户数量
        waitingCount : 0, //等待发送短信
        monthSendCount : 0, //本月已发送数目
        totalSendCount : 0, //累计已发送数目
        userMonthLimitCount : 0,//每个用户每月最多发送短信条数
        dicts : {
            status : { "Y" : "启用", "N" : "禁用" },
            sendStatus : { "Y" : "已发送", "N" : "未发送", "I" : "发送中","W": "等待发送" },
            receiverFrom : { "1" : "活跃用户", "2" : "有效用户", "3" : "全部用户", "4" : "指定用户" }
        },
        chargeTotal : 0, //购买金额总数
        messagePlans : [],///套餐列表
        clubId : "",///充值的clubId
        switchMsgStatus : function(id,status,sendTime){//点击启用、禁用
            if(updateStatusEnableObj[id]==true) return;
            updateStatusEnableObj[id] = true;
            if(status=="N"){//启用
                /////////////////判断当前时间
                if(parseTime(sendTime).getTime()>(+new Date())){
                    doUpdateStatus(id,status);
                }
                else{
                    quickSend.attr("mid",id);
                    quickSend.attr("mStatus",status);
                    quickSendModal.show();
                }
            }
            else doUpdateStatus(id,status);
        },
        reSendFailureMsg : function(id){//重发失败短信
            $("#confirmReSendModal>div>div.content").attr("recordId",id);
            confirmModal.show();
        },
        doViewMessageDetail : function(id,editable){
            iSessionStorage("messageSell-currPage",vm.currPage);
            location.href="#!/messageSellDetail?id="+id+"&editable="+editable;
        }
    });

    //////////////////分页器
    dataListPagination = new Pagination($("#dataListPagination"),{
        switchPage : function(page){
            queryMessageData(page);
        }
    });

    quickSendModal = new Modal(quickSend,{
        doClickOkBtn : function(){
            doUpdateStatus(quickSend.attr("mid"),quickSend.attr("mStatus"));
            quickSendModal.close();
        },
        doClickCancelBtn : function(){
            updateStatusEnableObj[quickSend.attr("mid")] = false;
            quickSendModal.close();
        }
    });

    ///////////////////////////////////////////////////////////充值modal
    chargeModal = new Modal($("#messageChargeModal"),{
        doClickOkBtn : function(){
            if(inCharge) return;
            if(!chargeSuitList) chargeSuitList = $("#messageChargeModal>div>div.content>ul>li");
            if(vm.chargeTotal == 0) {
                chargeModal.showTip("当前您选择的套餐总价为0！");
                return;
            }
            var planIdArr = [], planCountArr = [], planCount;
            for(var k=0;k<chargeSuitList.length;k++){
                planCount = chargeSuitList[k].children[2].children[1].value || 0;
                if(planCount != 0){
                    planIdArr.push(chargeSuitList[k].getAttribute("plan-id"));
                    planCountArr.push(planCount);
                }
            }
            chargeModal.loading();
            inCharge = true;
            $.ajax({
                url : "message/recharge/save",
                data : { "PLAN_messagePlanId" : planIdArr , "PLAN_bookCount" : planCountArr , clubId : vm.clubId , totalPrice : vm.chargeTotal  },
                traditional: true,
                success : function(res){
                    inCharge = false;
                    chargeModal.loading("hide");
                    if(res.statusCode == 200){
                        if(res.respData.type == 2){
                            chargeModal.close();
                            $("#messagePayQrcodeModal>div>div.content>div").html("");
                            $("#messagePayQrcodeModal>div>div.content>div").qrcode({width : 256,height : 256,text : res.respData.payUrl});
                            payQrcodeModal.show();
                            remainderCount = 2*60*60;
                            remainderTimeSpan.html("剩余有效时间："+formatTime(remainderCount)+",若已支付请关闭");
                            if(remainderTimer) clearInterval(remainderTimer);
                            remainderTimer = setInterval(function(){
                                remainderCount -- ;
                                if(remainderCount<0){
                                    clearInterval(remainderTimer);
                                    remainderTimeSpan.html("已超过支付有效时间，请重新下单！");
                                }
                                else{
                                    remainderTimeSpan.html("剩余有效时间："+formatTime(remainderCount)+",若已支付请关闭");
                                }
                            },1000);
                            ////////////////////查询是否已支付的定时器
                            if(queryPayedTimer) clearInterval(queryPayedTimer);
                            queryPayedTimer = setInterval(function(){
                                $.ajax({
                                    url : "message/recharge/status",
                                    data : { orderNo : res.respData.orderNo },
                                    success : function(payRes){
                                        if(payRes.statusCode==200){//已成功支付
                                            msgAlert("充值成功！",true);
                                            payQrcodeModal.close();
                                        }
                                    }
                                });
                            },5000)
                        }
                        else{
                            location.href = res.respData.payUrl;
                        }
                    }
                    else{
                        msgAlert(res.msg || "购买请求失败！");
                    }
                }
            });
        }
    });

    payQrcodeModal = new Modal($("#messagePayQrcodeModal"),{
        afterClose : function(){
            if(remainderTimer) clearInterval(remainderTimer);
            if(queryPayedTimer) clearInterval(queryPayedTimer);
            queryCount();
        }
    });

    confirmModal = new Modal($("#confirmReSendModal"),{
        doClickOkBtn : function(){
            confirmModal.close();
            $.ajax({
                url : "message/sendFails",
                data : { messageId : $("#confirmReSendModal>div>div.content").attr("recordId") },
                success : function(res){
                    msgAlert(res.msg,res.statusCode==200);
                    queryMessageData(vm.currPage);
                    queryCount();
                }
            });
        }
    });

    /////////////////////////////pageSize下拉的变化
    $("#messageSendRecord>table>thead>tr:eq(0)>th>div>select").on("change",function(){
        vm.pageSize = this.value;
        queryMessageData();
    });

    ///////////启用、禁用
    function doUpdateStatus(id,status){
        $.ajax({
            url : "message/updateStatus",
            data : { messageId : id, status : (status == "Y" ? "N" : "Y") },
            success : function(res){
                updateStatusEnableObj[id] = false;
                if(res.statusCode == 200){
                    msgAlert(res.msg,true);
                    queryMessageData(vm.currPage);///更新界面
                    queryCount();
                }
                else{
                    msgAlert(res.msg || "操作失败!");
                }
            }
        });
    }

    ////点击充值按钮
    $("#messageChargeBtn").click(function(){
        ///////////////////////////清0表单
        if(!chargeSuitList) chargeSuitList = $("#messageChargeModal>div>div.content>ul>li");
        for(var i=0;i<chargeSuitList.length;i++){
            chargeSuitList[i].children[2].children[1].value = 0;
        }
        vm.chargeTotal = 0;
        inCharge = false;
        chargeModal.show();
    });

    $("#messageChargeModal>div>div.content>ul").on("input","li>div.ope>input",function(){//购买输入限制
        if(/\D/.test(this.value)){
            this.value=this.value.replace(/\D/g,'');
        }
        if(this.value.length>6){
            this.value = this.value.substr(0,6);
        }
        computeChargeTotal();
    }).on("click","li>div.ope>i",function(){//加减操作
        var $this = $(this), currInput = $this.siblings("input");
        if(this.innerHTML == "+"){
            currInput.val(parseInt(currInput.val() || 0)+1 );
        }
        else{
            if(currInput.val().length>0 && currInput.val() != 0){
                currInput.val(parseInt(currInput.val())-1);
            }
        }
        computeChargeTotal();
    });

    function parseTime(str){
        var strArr = str.split(" "), dateArr = strArr[0].split("-"), timeArr = strArr[1].split(":");
        return new Date(parseInt(dateArr[0]),parseInt(dateArr[1])-1,parseInt(dateArr[2]),parseInt(timeArr[0]),parseInt(timeArr[1]),parseInt(timeArr[2]));
    }

    function formatTime(count){
        var h = parseInt(count/3600);
        count = count%3600;
        var m = parseInt(count/60), s = count%60;
        return h+"小时"+(m<10 ? "0"+m : m)+"分钟"+(s<10 ? "0"+s : s)+"秒";
    }

    function computeChargeTotal(){///计算总价
        var total = 0;
        if(!chargeSuitList) chargeSuitList = $("#messageChargeModal>div>div.content>ul>li");
        for(i = 0;i<chargeSuitList.length;i++){
            total += parseFloat(chargeSuitList[i].children[1].innerHTML) * parseInt(chargeSuitList[i].children[2].children[1].value || 0);
        }
        vm.chargeTotal = total.toFixed(2);
    }

    function queryMessageData(page){
        page = page || 1;
        vm.currPage = page;
        $.ajax({
            url : "message/list",
            data: { page : page, pageSize : vm.pageSize },
            success: function (res) {
                if(res.statusCode == 200){
                    res.respData = res.respData.messages || [];
                    vm.messages = res.respData;
                    ////////////////////
                    updateStatusEnableObj = {};
                    dataListPagination.refresh({ currPage : page , totalPage : res.pageCount});
                    avalon.scan(thisPage[0]);
                }
                else{
                    msgAlert(res.msg || "数据查询失败！");
                }
            }
        });
    }

    /////////////////////////////////////////////更新余额
    function queryCount(){
        $.ajax({
            url : "message/count",
            success : function(res){
                if(res.statusCode == 200){
                    res = res.respData;
                    vm.availableCount = res.availableCount || 0;
                    vm.waitingCount = res.waitingCount || 0;
                    vm.userCount = res.userCount || 0;
                    vm.monthSendCount = res.monthSentCount || 0;
                    vm.totalSendCount = res.totalSentCount || 0;
                    vm.userMonthLimitCount = res.userMonthLimitCount || 0;
                }
            }
        });
    }

    ///////////////////////////////////////////////查询初始化数据
    $.ajax({
        url : "message/count",
        success : function(res){
            if(res.statusCode != 200) {
                msgAlert(res.msg || "数据查询失败！");
            }
            else{
                res = res.respData;
                vm.availableCount = res.availableCount || 0;
                vm.waitingCount = res.waitingCount || 0;
                vm.userCount = res.userCount || 0;
                vm.monthSendCount = res.monthSentCount || 0;
                vm.totalSendCount = res.totalSentCount || 0;
                vm.userMonthLimitCount = res.userMonthLimitCount || 0;
                queryMessageData(vm.currPage);
                avalon.scan(thisPage[0]);

                ///////////////////////////////获取短信套餐数据
                $.ajax({
                    url : "message/recharge/edit",
                    success : function(planRes){
                        if(planRes.statusCode == 200){
                            vm.messagePlans = planRes.respData.messagePlans || [];
                            vm.clubId = planRes.respData.clubId;
                        }
                    }
                });
            }
        }});
    iSessionStorage("messageSell-currPage","");
});