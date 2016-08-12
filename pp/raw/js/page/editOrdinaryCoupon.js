require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageParam = getParamObj(),
        i,
        couponTotal = $("#couponTotal"),
        userGetCount = $("#userGetCount"),
        couponName = $("#couponName"),
        actValueOfMoney = $("#actValueOfMoney"),
        actValueOfCoupon = $("#actValueOfCoupon"),
        couponPeriodRange = $("#couponPeriodRange"),
        sellDateRange = $("#sellDateRange"),
        consumeOfMoneyType = $("#consumeOfMoneyType"),
        consumeOfCouponType = $("#consumeOfCouponType"),
        sellDateRangeOfNoEdit = $("#sellDateRangeOfNoEdit"),
        initObjOfEditStatus = {};

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("营销中心 >> <a href='#!/ordinaryCouponSell'>优惠券</a> >> "+(pageParam.id ? "编辑优惠券" : "添加优惠券"));

    /////////////////////////////////////////////////////设置使用说明
    $("#editActContent").html("<ul><li>使用时，请出示手机号码或者优惠码。</li><li>每张券仅限一人使用，仅能使用一张。</li><li>使用此券，不可享受本店其他优惠。</li><li>提供免费WiFi。</li><li>提供免费停车位。</li><li>欢迎提前预约。</li>");

    ////////////////////////////////////////////////////初始化日期选择控件
    var initStartDate = new Date(), initEndDate = new Date();
    initEndDate.setTime(initStartDate.getTime()+30*24*60*60*1000);
    couponPeriodRange.daterangepicker({ startDate : initStartDate, endDate : initEndDate },function(start,end){});
    couponPeriodRange.val("");
    sellDateRange.daterangepicker({ startDate : initStartDate, endDate : initEndDate },function(start,end) {});
    sellDateRange.val("");

    var vm = avalon.define({
        $id : vmId,
        canEdit : true,//////是否可编辑 当新增或者优惠券状态为not_online时
        effectDayArr : [],///生效时间
        effectiveDayArr : [],////有效天数
        useStartTimeArr : [],////使用时间
        useEndTimeArr : [],/////使用时段
        weekArr : [{ name : "周一", value : "1"} , { name : "周二", value : "2"} , { name : "周三", value : "3"}, { name : "周四", value : "4"}, { name : "周五", value : "5"}, { name : "周六", value : "6"},{ name : "周日", value : "0"}],
        sellStyle : "",
        serveArr : [],
        couponObj : {},
        doClickItem : function(){
            this.className = (this.className=="active" ? "" : "active");
        },
        currCouponType : "redpack",
        doSelectCouponType : function(type){
            vm.currCouponType = type;
        },
        currUseType : "money",
        doSelectUseType : function(type){
            vm.currUseType = type;
        },
        currPeriodType : "fixed_time",
        doSelectPeriodType : function(type){
            vm.currPeriodType = type;
        },
        doChangeUseStartTime : function(){
            var useTimeArr = [{ name : "请选择" , value : ""}];
            if(this.value != ""){
                for(i=parseInt(this.value)+1;i<24;i++){
                    useTimeArr.push({ name : i+":00" , value : i});
                }
            }
            vm.useEndTimeArr = useTimeArr;
        },
        doSave : function(saveType){//////保存操作
            if(checkForm()){
                if(vm.canEdit){
                    $.ajax({
                        url : "act/modify",
                        type : "post",
                        data : {
                            operator : pageParam.id ? "modify" : "add",
                            saveType : saveType,
                            actId : pageParam.id || "",
                            actType : "coupon",
                            useType : vm.currUseType,
                            couponType : vm.currCouponType,
                            itemId : getItems().join(","),/////服务项目
                            actTitle : couponName.val(),
                            actValue : (vm.currUseType == "money" ? actValueOfMoney.val() : actValueOfCoupon.val()),
                            consumeMoney : (vm.currUseType == "money" ? consumeOfMoneyType.val() : consumeOfCouponType.val()) || "0",
                            actTotal : couponTotal.val() || "0",
                            userGetCount : (userGetCount.val()=="" ? 1 : userGetCount.val()),
                            commission : vm.currCouponType=="redpack" ? $("#commissionOfRedpackShare").val() : $("#commissionOfOrdinaryShare").val(),
                            startDate : formatDateRangeVal(sellDateRange.val()).start,
                            endDate : formatDateRangeVal(sellDateRange.val()).end,
                            periodType : vm.currPeriodType,
                            longAfterReceive : $("#longAfterReceive").val(),
                            useDay : getUseDayArr().join(","),
                            periodDay : vm.currPeriodType == "after_receive" ? $("#afterReceiveSelect").val() : "",
                            useStartDate : vm.currPeriodType == "fixed_time" ? formatDateRangeVal(couponPeriodRange.val()).start : "",
                            useEndDate : vm.currPeriodType == "fixed_time" ? formatDateRangeVal(couponPeriodRange.val()).end : "",
                            actContent : $("#editActContent").html(),
                            startTime : $("#useStartTime").val(),
                            endTime : $("#useEndTime").val(),
                            actDescription : ""
                        },
                        success : function(res){
                            if(res.statusCode == 200){
                                msgAlert(res.msg,true);
                                location.href = "#!/ordinaryCouponSell";
                            }
                            else{
                                msgAlert(res.msg || "操作失败！");
                            }
                        }
                    });
                }
                else{////////////////不可编辑情况下的保存
                    $.ajax({
                        url: "act/modify",
                        type: "post",
                        data: {
                            operator : "modify",
                            saveType : saveType,
                            actId : pageParam.id,
                            actType : "coupon",
                            useType : vm.couponObj.pa.useType,
                            couponType : vm.couponObj.pa.couponType,
                            itemId : vm.couponObj.pa.itemIds,
                            actTitle : vm.couponObj.pa.actTitle,
                            actValue : vm.couponObj.pa.actValue,
                            consumeMoney : vm.couponObj.pa.consumeMoney,
                            actTotal : vm.couponObj.pa.actTotal,
                            userGetCount : vm.couponObj.pa.userGetCount,
                            commission : vm.couponObj.pa.commission,
                            startDate : formatDateRangeVal(sellDateRangeOfNoEdit.val()).start,
                            endDate : formatDateRangeVal(sellDateRangeOfNoEdit.val()).end,
                            periodType :  vm.couponObj.pa.periodType,
                            longAfterReceive : vm.couponObj.pa.longAfterReceive ,
                            useDay :  vm.couponObj.pa.useDay,
                            periodDay :  vm.couponObj.pa.periodDay,
                            useStartDate :  vm.couponObj.pa.useStartDate,
                            useEndDate :  vm.couponObj.pa.useEndDate,
                            actContent : vm.couponObj.pa.actContent,
                            startTime :  vm.couponObj.pa.startTime,
                            endTime : vm.couponObj.pa.endTime,
                            actDescription : ""
                        },
                        success : function(res){
                            if(res.statusCode == 200){
                                msgAlert(res.msg,true);
                                location.href = "#!/ordinaryCouponSell";
                            }
                            else{
                                msgAlert(res.msg || "操作失败！");
                            }
                        }
                    });
                }
            }
        },

        ////////////////////////////////////////////////////
        initRenderedOfLongAfterReceive : function(){
            if(initObjOfEditStatus.longAfterReceive){
                $("#longAfterReceive").val(initObjOfEditStatus.longAfterReceive);
                delete initObjOfEditStatus.longAfterReceive;
            }
        },
        initRenderedOfAfterReceiveSelect : function(){
            if(initObjOfEditStatus.periodDay){
                //$("#longAfterReceive").val(initObjOfEditStatus.longAfterReceive);
                $("#afterReceiveSelect").val(initObjOfEditStatus.periodDay);
                delete initObjOfEditStatus.periodDay;
            }
        },
        initRenderedOfWeekArr : function(){
            if(initObjOfEditStatus.useDay){
                var k,useDayList = $("div.useTime>div>span");////////////////////////////
                for(k=0;k<useDayList.length;k++){
                    if(initObjOfEditStatus.useDay.indexOf(useDayList[k].getAttribute("weekDay"))>=0){
                        useDayList[k].className = "active";
                    }
                    else{
                        useDayList[k].className = "";
                    }
                }
                delete initObjOfEditStatus.useDay;
            }
        },
        initRenderedOfUseStartTimeArr : function(){
            if(initObjOfEditStatus.startTime){
                $("#useStartTime").val(initObjOfEditStatus.startTime);
                delete initObjOfEditStatus.startTime;
            }
        },
        initRenderedOfUseEndTimeArr : function(){
            if(initObjOfEditStatus.endTime){
                $("#useEndTime").val(initObjOfEditStatus.endTime);
                delete initObjOfEditStatus.endTime;
            }
        },
        initRenderedOfServeArr : function(){
            if(initObjOfEditStatus.items){
                var serviceList = $("div.items ul.item>li"), couponServiceItems = [], k;
                for(k=0;k<initObjOfEditStatus.items.length;k++){
                    couponServiceItems.push(initObjOfEditStatus.items[k].id);
                }
                for(k=0;k<serviceList.length;k++){
                    if(inArr(serviceList[k].getAttribute("itemId"),couponServiceItems)){
                        serviceList[k].className = "active";
                    }
                }
                delete initObjOfEditStatus.items;
            }
        }
    });

    ///////////////////////////生效时间、有效天数
    var effectDayArr = [{ name : "当天" , value : "0"}], effectiveDayArr = [];
    for(i=1;i<=90;i++){
        effectDayArr.push({ name : i+"天后" , value : i});
        effectiveDayArr.push({ name : i+"天" , value : i});
    }
    vm.effectDayArr = effectDayArr;
    vm.effectiveDayArr = effectiveDayArr;

    /////////////////////////////使用时间
    var useTimeArr = [{ name : "请选择" , value : ""}];
    for(i=0;i<24;i++){
        useTimeArr.push({ name : i+":00" , value : i });
    }
    vm.useStartTimeArr = useTimeArr;
    vm.useEndTimeArr = useTimeArr;

    ////////////////////////////////////////////////////表单校验
    function checkForm(){
        if(!vm.canEdit) return true;
        if(!couponName.val()){
            msgAlert("请输入优惠券名称！");
            couponName.focus();
            return false;
        }
        if(vm.currUseType=="money" && !actValueOfMoney.val()){
            msgAlert("请输入减免金额！");
            actValueOfMoney.focus();
            return false;
        }
        if(vm.currUseType=="coupon" && !actValueOfCoupon.val()){
            msgAlert("请输入优惠价格！");
            actValueOfCoupon.focus();
            return false;
        }
        if(getUseDayArr().length==0){
            msgAlert("使用时段请至少选择一天！");
            return false;
        }

        if(vm.currPeriodType == "fixed_time" && couponPeriodRange.val() && sellDateRange.val()){
            var periodDateObj = formatDateRangeVal(couponPeriodRange.val()),
                sellDateObj = formatDateRangeVal(sellDateRange.val());
            if(periodDateObj.start<sellDateObj.start){
                msgAlert("券有效开始时间不能小于活动开始时间！");
                return false;
            }
            if(sellDateObj.end>periodDateObj.end){
                msgAlert("活动时间不能大于券有效时间");
                return false;
            }
        }

        if(vm.currCouponType=="ordinary"){
            if(couponTotal.val() != "" && couponTotal.val()==0){
                msgAlert("发放数量不能为0！");
                couponTotal.focus();
                return false;
            }
            if(userGetCount.val() != "" && userGetCount.val()==0){
                msgAlert("领券限制不能为0！");
                userGetCount.focus();
                return false;
            }
        }
        return true;
    }

    ///////////////////////////////////////////输入限制
    couponName.on("input",function(){
        if(this.value.length>30) this.value = this.value.substr(0,30);
        if(/\s/.test(this.value)) this.value = this.value.replace(/\s/g,"");
    });
    $("#actValueOfMoney,#actValueOfCoupon,#consumeOfMoneyType,#consumeOfCouponType,#commissionOfRedpackShare,#commissionOfOrdinaryShare,#couponTotal,#userGetCount").on("input",function(){
        if (/\D/.test(this.value)) {
            this.value = this.value.replace(/\D/g, '');
        }
        if(this.value.length>6) this.value = this.value.substr(0,6);
    });

    function getUseDayArr(){
        var selectedDays = $("div.useTime>div>span.active"), arr = [];
        for(var k=0;k<selectedDays.length;k++){
            arr.push(selectedDays[k].getAttribute("weekDay"));
        }
        return arr;
    }

    function getItems(){
        var items = [], list = $("div.items li.active");
        for(var k=0;k<list.length;k++){
            items.push(list[k].getAttribute("itemId"));
        }
        return items;
    }

    $.ajax({
        url : "club/service/data",
        data : { select : 1 },
        success : function(res){
            if(res.statusCode == 200){
                vm.serveArr = res.respData;

                if(pageParam.id){///////获取优惠券详情
                    $.ajax({
                        url : "act/get/"+pageParam.id,
                        success : function(couponRes){
                            if(couponRes.statusCode == 200){
                                couponRes = couponRes.respData;
                                vm.canEdit = (couponRes.pa.actStatus == "not_online");

                                if(vm.canEdit){//////////未上线的状态
                                    vm.currUseType = couponRes.pa.useType;
                                    couponName.val(couponRes.pa.actTitle);

                                    if(vm.currUseType == "money"){
                                        actValueOfMoney.val(couponRes.pa.actValue);
                                        consumeOfMoneyType.val(couponRes.pa.consumeMoney);
                                    }
                                    else{
                                        actValueOfCoupon.val(couponRes.pa.actValue);
                                        consumeOfCouponType.val(couponRes.pa.consumeMoney);
                                    }
                                    ////////////////$("#longAfterReceive").val(couponRes.pa.longAfterReceive);/////////////////////
                                    initObjOfEditStatus.longAfterReceive = couponRes.pa.longAfterReceive;

                                    vm.currPeriodType = couponRes.pa.periodType;
                                    if(vm.currPeriodType == "fixed_time"){
                                        if(couponRes.pa.useStartDate && couponRes.pa.useEndDate ){
                                            couponPeriodRange.data('daterangepicker').setStartDate(couponRes.pa.useStartDate);
                                            couponPeriodRange.data('daterangepicker').setEndDate(couponRes.pa.useEndDate);
                                        }
                                        else{
                                            couponPeriodRange.val("");
                                        }
                                    }
                                    else{
                                        initObjOfEditStatus.periodDay = couponRes.pa.periodDay;
                                        /////////////$("#afterReceiveSelect").val(couponRes.pa.periodDay);////////////////////////////
                                    }

                                    ////sellDateRange
                                    if(couponRes.pa.startDate && couponRes.pa.endDate){
                                        sellDateRange.data('daterangepicker').setStartDate(couponRes.pa.startDate);
                                        sellDateRange.data('daterangepicker').setEndDate(couponRes.pa.endDate);
                                    }

                                    initObjOfEditStatus.useDay = couponRes.pa.useDay;
                                    /*var k,useDayList = $("div.useTime>div>span");////////////////////////////
                                    for(k=0;k<useDayList.length;k++){
                                        if(couponRes.pa.useDay.indexOf(useDayList[k].getAttribute("weekDay"))>=0){
                                            useDayList[k].className = "active";
                                        }
                                        else{
                                            useDayList[k].className = "";
                                        }
                                    }*/

                                    initObjOfEditStatus.startTime = couponRes.pa.startTime;
                                    initObjOfEditStatus.endTime = couponRes.pa.endTime;
                                    //////$("#useStartTime").val(couponRes.pa.startTime);///////////////////////
                                    ////$("#useEndTime").val(couponRes.pa.endTime);//////////////////////////

                                    /////////勾选服务项目////////////////////////////////////
                                    /*var serviceList = $("div.items ul.item>li"), couponServiceItems = [];
                                    for(k=0;k<couponRes.items.length;k++){
                                        couponServiceItems.push(couponRes.items[k].id);
                                    }
                                    for(k=0;k<serviceList.length;k++){
                                        if(inArr(serviceList[k].getAttribute("itemId"),couponServiceItems)){
                                            serviceList[k].className = "active";
                                        }
                                    }*/
                                    initObjOfEditStatus.items = couponRes.items;

                                    $("#editActContent").html(couponRes.pa.actContent);
                                    vm.currCouponType = couponRes.pa.couponType;
                                    $("#commissionOfRedpackShare").val(couponRes.pa.commission);
                                    $("#commissionOfOrdinaryShare").val(couponRes.pa.commission);
                                    if(vm.currCouponType == "ordinary"){
                                        couponTotal.val(couponRes.pa.actTotal);
                                        userGetCount.val(couponRes.pa.userGetCount);
                                    }

                                    avalon.scan(thisPage[0]);
                                }
                                else{///////////////////////不可再编辑的状态
                                    var itemArr = [], itemIds = [], k;
                                    for(k=0;k<couponRes.items.length;k++){
                                        itemArr.push(couponRes.items[k]["name"]);
                                        itemIds.push(couponRes.items[k]["id"]);
                                    }
                                    couponRes.pa.items = itemArr.join("、") || "无";
                                    couponRes.pa.itemIds = itemIds.join(",");
                                    vm.couponObj = couponRes;
                                    $("#actContent").html(couponRes.pa.actContent);
                                    ////sellDateRange
                                    if(couponRes.pa.startDate && couponRes.pa.endDate){
                                        sellDateRangeOfNoEdit.daterangepicker({startDate : couponRes.pa.startDate, endDate : couponRes.pa.endDate },function(start,end){});
                                    }
                                    else{
                                        var initStartDate = new Date(), initEndDate = new Date();
                                        initEndDate.setTime(initStartDate.getTime()+30*24*60*60*1000);
                                        sellDateRangeOfNoEdit.daterangepicker({ startDate : initStartDate, endDate : initEndDate },function(start,end){});
                                        sellDateRangeOfNoEdit.val("");
                                    }
                                    avalon.scan(thisPage[0]);
                                }
                            }
                            else{
                                msgAlert(couponRes.msg || "未能获取优惠券信息！");
                                location.href = "#!/ordinaryCouponSell";
                            }
                        }
                    });
                }
                else{
                    vm.useEndTimeArr = [{ name : "请选择" , value : ""}];
                    avalon.scan(thisPage[0]);
                }
            }
        }
    });
});