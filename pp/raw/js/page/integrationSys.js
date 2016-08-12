require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        //techRecordListPagination,
        //userRecordListPagination,
        //searchTel = $("#search-tel"),
        chargeModal,
        chargeAccount = $("#charge-account"),
        chargeValue = $("#charge-value"),
        chargeRemark = $("#charge-remark"),
        creditPerConsume = $("#creditPerConsume"),
        creditPerRegister = $("#creditPerRegister"),
        creditPerExchange = $("#creditPerExchange"),
        creditExchangeLimitation = $("#creditExchangeLimitation");

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("积分系统 >> 积分管理");

    var vm = avalon.define({
        $id : vmId,
        deliverAmount : 0,
        recycleAmount : 0,
        settingSwitch : "off",
        selectedTab : "user",
        chargeType : 'user',
        //userRecordList : [],
        //techRecordList : [],
        //userRecordPageSize : 10,
        //techRecordPageSize : 10,
        changeChargeType : function(type){
            vm.chargeType = type;
        },
        /*doChangeTab : function(type){
            vm.selectedTab = type;
        },*/
        doClickSwitch : function(){
            var distSwitch = (vm.settingSwitch == "on" ? "off" : "on" );
            $.ajax({
                url : "club/credit//system/switch",
                data : { status : distSwitch },
                success : function(res){
                    if(res.statusCode == 200){
                        vm.settingSwitch = distSwitch;
                    }
                    else{
                        msgAlert(res.msg || "操作失败！");
                    }
                }
            });
        },
        /*onChangeUserRecordListPageSize : function(){
            vm.userRecordPageSize = this.value;
            queryRecordList("user");
        },*/
        /*onChangeTechRecordListPageSize : function(){
            vm.techRecordPageSize = this.value;
            queryRecordList("tech");
        },*/
        /*doClickSearchBtn : function(){////点击搜索按钮
            queryRecordList(vm.selectedTab);
        },*/
        doClickChargeBtn : function(){////点击充值按钮
            chargeAccount.val("");
            chargeValue.val("");
            chargeRemark.html("");
            chargeModal.show();
        },
        doClickSaveCfgBtn : function(){////点击保存设置按钮
            if(checkCfgForm()){
                $.ajax({
                    url : "club/credit/settings/save",
                    data : {
                        clubId : $$.clubId,
                        creditExchangeLimitation : creditExchangeLimitation.val(),
                        creditPerConsume : creditPerConsume.val(),
                        creditPerExchange : creditPerExchange.val(),
                        creditPerRegister : creditPerRegister.val()
                    },
                    success : function(res){
                        if(res.statusCode == 200){
                            msgAlert("保存成功！",true);
                        }
                        else{
                            msgAlert(res.msg || "保存失败！");
                        }
                    }
                });
            }
        }
    });

    /*userRecordListPagination = new Pagination($("#userRecordListPagination"),{
        switchPage : function(page){
            queryRecordList('user',page);
        }
    });*/

    /*techRecordListPagination = new Pagination($("#techRecordListPagination"),{
        switchPage : function(page){
            queryRecordList('tech',page);
        }
    });*/

    /*function queryRecordList(type,page){
        page  = page || 1;
        $.ajax({
            url : "club/credit/trade/records",
            data : {
                clubId : $$.clubId,
                page : page,
                pageSize : (type =="user" ? vm.userRecordPageSize : vm.techRecordPageSize),
                searchParam : searchTel.val(),
                userType : type
            },
            success : function(res){
                if(res.statusCode == 200){
                    if(type == "user"){
                        vm.userRecordList = res.respData;
                        userRecordListPagination.refresh({ currPage : page , totalPage : res.pageCount });
                    }
                    else{
                        vm.techRecordList = res.respData;
                        techRecordListPagination.refresh({ currPage : page , totalPage : res.pageCount });
                    }
                }
            }
        });
    }*/

    function checkCfgForm(){
        if(creditPerConsume.val().length==0){
            creditPerConsume.focus();
            msgAlert("请输入每消费1元获取的积分数量！");
            return false;
        }
        if(creditPerRegister.val().length==0){
            creditPerRegister.focus();
            msgAlert("请输入注册赠送积分数量！");
            return false;
        }
        if(creditPerExchange.val().length==0){
            creditPerExchange.focus();
            msgAlert("请输入技师每兑换1元所需积分数量！");
            return false;
        }
        if(creditExchangeLimitation.val().length==0){
            creditExchangeLimitation.focus();
            msgAlert("请输入技师起提积分数量！");
            return false;
        }
        return true;
    }

    ////////////////////////////////////////////////输入限制
    /*searchTel.on("input",function(){
        if(/\D/.test(this.value)){
            this.value=this.value.replace(/\D/g,'');
        }
        if(this.value.length>11){
            this.value = this.value.substring(0,11);
        }
    }).on("keypress",function(event){
        if(event.keyCode == 13){
            vm.doClickSearchBtn();////搜索
        }
    });*/

    $("div#settingCfg").on("input","div.item>input",function(){
        if(/\D/.test(this.value)){
            this.value=this.value.replace(/\D/g,'');
        }
        if(this.value.length>9){
            this.value = this.value.substring(0,9);
        }
    });

    chargeValue.on("input",function(){
        if(/\D/.test(this.value)){
            this.value=this.value.replace(/\D/g,'');
        }
        if(this.value.length>9){
            this.value = this.value.substring(0,9);
        }
    });

    chargeAccount.on("input",function(){
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

    chargeModal = new Modal($("#chargeModal"),{
        doClickOkBtn : function(){
            if(checkChargeForm()){
                chargeModal.loading();
                $.ajax({
                    url : "club/credit/charge",
                    type : "post",
                    data : {
                        userType : vm.chargeType,
                        telephone : chargeAccount.val(),
                        amount :  chargeValue.val(),
                        remark : chargeRemark.text().substr(0,1000)
                    },
                    success : function(res){
                        if(res.statusCode == 200){
                            chargeModal.close();
                            queryClubAmount();
                            //queryRecordList(vm.chargeType);
                            msgAlert(res.msg || "充值成功！",true);
                        }
                        else{
                            chargeModal.showTip(res.msg || "充值失败！");
                        }
                    },
                    complete : function(){
                        chargeModal.loading("hide");
                    }
                });
            }
        }
    });

    function checkChargeForm(){
        if(!chargeAccount.val()){
            chargeAccount.focus();
            chargeModal.showTip("请输入充值账号！");
            return false;
        }
        else if(!/^1[34578]\d{9}$/.test(chargeAccount.val())){
            chargeAccount.focus();
            chargeModal.showTip("请输入正确的手机号码！");
            return false;
        }

        if(!chargeValue.val()){
            chargeValue.focus();
            chargeValue.showTip("请输入充值积分！");
            return false;
        }
        return true;
    }

    function queryClubAmount(){
        $.ajax({
            url : "club/credit/account",
            success : function(res){
                if(res.statusCode == 200){
                    if(res.respData){
                        res = res.respData;
                        vm.deliverAmount = res.deliverAmount;
                        vm.recycleAmount = res.recycleAmount;
                    }
                }
            }
        });
    }

    ////////////////////////////////获取积分系统开关状态
    $.ajax({
        url : "club/credit/switch/status",
        data : { clubId : $$.clubId },
        success : function(res){
            if(res.statusCode==200){
                vm.settingSwitch = (res.respData.clubSwitch=="on" ? "on" : "off");
                if(vm.settingSwitch=="on"){////获取商家积分配置
                    $.ajax({
                        url : "club/credit/settings/get",
                        data : { clubId : $$.clubId },
                        success : function(cfgRes){
                            if(cfgRes.statusCode == 200){
                                cfgRes = cfgRes.respData;
                                if(cfgRes){
                                    creditPerRegister.val(cfgRes.creditPerRegister);
                                    creditExchangeLimitation.val(cfgRes.creditExchangeLimitation);
                                    creditPerConsume.val(cfgRes.creditPerConsume);
                                    creditPerExchange.val(cfgRes.creditPerExchange);
                                }
                            }
                        }
                    });
                }
            }
        }
    });

    queryClubAmount();
    //queryRecordList("user",1);
    //queryRecordList("tech",1);

    avalon.scan(thisPage[0]);
});