require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        rawData = [],
        confirmModal,
        confirmModalEle = $("#confirmModal"),
        confirmModalContent = $("#confirmModal>div>div.content"),
        couponDetailModal,
        couponEditModal,
        editActValue = $("#editActValue"),
        editActConsumeMoney = $("#editActConsumeMoney"),
        editActContent = $("#editActContent"),
        editPeriod = $("#editPeriod");

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("营销中心 >> 点钟券");

    var vm = avalon.define({
        $id : vmId,
        couponSwitch : 'off',
        dataList : [],
        statusObj : [{"name":"全部状态","value":""},{"name":"使用中","value":"online"},{"name":"未上线","value":"not_online"},
            {"name":"已下线","value":"downline_can_use"},{"name":"已过期","value":"ne_lose_efficacy"},{"name":"已失效","value":"disable"}],
        currStatus : "",
        couponFee : "",/////平台手续费
        couponFeeStr : "",
        detailObj : {////详情对象
            actValue : "", consumeMoney : "", couponPeriod : "", actContent : "", incomeType : ""
        },
        editObj : {/////编辑对象
            actId : "", actValue : "", consumeMoney : "", couponPeriod : "30", actContent : "", incomeType : "tech"
        },
        dayOptionArr : [
            {"name":"1天","value":"1"},
            {"name":"2天","value":"2"},
            {"name":"3天","value":"3"},
            {"name":"7天","value":"7"},
            {"name":"10天","value":"10"},
            {"name":"30天","value":"30"},
            {"name":"60天","value":"60"},
            {"name":"90天","value":"90"}
        ],
        editModalTitle : "添加点钟券",
        doChangeStatus : function(){//////筛选状态数据列表
            vm.currStatus = this.value;
            filterList();
        },
        doChangeCouponStatus : function(actId,actType,opeType){/////上线
            var opeTypeName = (opeType=="online" ? "上线" : (opeType=="delete" ? "删除" : "下线"));
            confirmModalEle.attr("opeType",opeType);
            confirmModalEle.attr("actId",actId);
            confirmModalEle.attr("actType",actType);
            confirmModalContent.text("确定要"+opeTypeName+"此点钟券？");
            confirmModal.show();
        },
        doCopyCoupon : function(actId,actType){////复制操作
            $.ajax({
                url : "act/copy",
                data : { id : actId, operator : "copy", actType : actType },
                success : function(res){
                    if(res.statusCode == 200){
                        msgAlert(res.msg,true);
                        queryData();
                    }
                    else{
                        msgAlert(res.msg || "操作失败！");
                    }
                }
            });
        },
        doEditViewCoupon : function(index){////查看或者编辑
            if(this.innerHTML == "查看"){
                vm.detailObj = vm.dataList[index];
                $("#detailActContent").html(vm.detailObj.actContent);
                couponDetailModal.show();
            }
            else{/////编辑操作
                vm.editModalTitle = "编辑点钟券";
                vm.editObj.actId = vm.dataList[index].actId;
                vm.editObj.actValue = vm.dataList[index].actValue;
                vm.editObj.consumeMoney = vm.dataList[index].consumeMoney;
                vm.editObj.couponPeriod = parseInt(vm.dataList[index].couponPeriod.substr(5))+"";
                vm.editObj.actContent = vm.dataList[index].actContent;
                vm.editObj.incomeType = vm.dataList[index].incomeType;
                editActContent.html(vm.editObj.actContent);
                couponEditModal.show();
            }
        },
        doAddCoupon : function(){/////添加点钟券
            vm.editModalTitle = "添加点钟券";
            vm.editObj = {
                actId : "", actValue : "", consumeMoney : "", couponPeriod : "30", actContent : "", incomeType : "tech"
            };
            $("#editActContent").html("使用时，出示您的二维码或者优惠码。");
            couponEditModal.show();
        },
        doSaveCoupon : function(saveType){////保存/发布点钟券
            if(checkForm()){
                $.ajax({
                    url : "act/modify",
                    type : "post",
                    data : {
                        operator : (vm.editObj.actId=="" ? "add" : "modify"),
                        saveType : saveType,
                        actId : vm.editObj.actId,
                        actType : "coupon",
                        couponType : "paid",
                        actValue : editActValue.val(),
                        consumeMoney : editActConsumeMoney.val(),
                        periodType : "fixed_time",
                        periodDay : editPeriod.val(),
                        actContent : editActContent.html(),
                        incomeType : vm.editObj.incomeType
                    },
                    success : function(res){
                        if(res.statusCode==200){
                            couponEditModal.close();
                            msgAlert(res.msg,true);
                            queryData();
                        }
                        else{
                            couponEditModal.showTip(res.msg || "操作失败！");
                        }
                    }
                });
            }
        },
        doChangeIncomeType : function(type){//////切换打赏类型incomeType
            if(this.className != "active"){
                vm.editObj.incomeType = type;
            }
        }
    });

    function filterList(){
        if(vm.currStatus == "") vm.dataList = rawData;
        else{
            var filterData = [];
            for(var i=0;i<rawData.length;i++){
                if(rawData[i]["actStatus"] == vm.currStatus){
                    filterData.push(rawData[i]);
                }
                vm.dataList = filterData;
            }
        }
    }

    function checkForm(){
        if(!editActValue.val()){
            couponEditModal.showTip("请输入实际购买金额！");
            editActValue.focus();
            return false;
        }
        if(!editActConsumeMoney.val()){
            couponEditModal.showTip("请输入优惠金额！");
            editActConsumeMoney.focus();
            return false;
        }

        ////////校验购买金额是否小于手续费
        if(vm.couponFee.indexOf("%")<0 && parseInt(editActValue.val())<(vm.couponFee/100)){
            couponEditModal.showTip("购买金额不能小于信息费！");
            return false;
        }

        if(editActContent.html() && editActContent.html().length>1000){
            couponEditModal.showTip("使用说明输入太多了！");
            return false;
        }
        return true;
    }

    confirmModal = new Modal(confirmModalEle,{
        doClickOkBtn : function(){
            $.ajax({
                url : "act/modify",
                data : { actId : confirmModalEle.attr("actId"), operator : confirmModalEle.attr("opeType") , actType : confirmModalEle.attr("actType") },
                success : function(res){
                    if(res.statusCode == 200){
                        msgAlert(res.msg,true);
                        queryData();
                    }
                    else{
                        msgAlert(res.msg || "操作失败！");
                    }
                }
            });
            confirmModal.close();
        }
    });

    couponDetailModal = new Modal($("#couponDetailModal"));
    couponEditModal = new Modal($("#couponEditModal"));

    ///////限制输入
    $("#editActValue,#editActConsumeMoney").on("input",function(){
        if (/\D/.test(this.value)) {
            this.value = this.value.replace(/\D/g, '');
        }
        if(this.value.length>5) this.value = this.value.substr(0,5);
    });

    function queryData(){
        $.ajax({
            url : "act/list",
            success : function(res){
                if(res.statusCode == 200){
                    res = res.respData;
                    if(res.paidCouponsSwitch != "on") rawData = [];
                    else{
                        rawData = res.paidCoupons;
                    }
                    filterList();
                    avalon.scan(thisPage[0]);
                }
            }
        });
    }

    queryData();

    ///////获取手续费
    $.ajax({
        url : "api/v2/manager/paid_order/open_status",
        success : function(res){
            if(res.statusCode == 200){
                vm.couponSwitch = res.respData.couponSwitch;
                var couponPlatformFee = res.respData.couponPlatformFee;
                vm.couponFee = couponPlatformFee;
                if(couponPlatformFee.indexOf("%")>0){
                    vm.couponFeeStr = couponPlatformFee;
                }
                else{
                    vm.couponFeeStr = couponPlatformFee/100+"元";
                }

                if(vm.couponSwitch=="on"){
                    queryData();
                }
            }
        }
    });
});