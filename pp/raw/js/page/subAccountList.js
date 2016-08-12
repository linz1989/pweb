require(["!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        editAccountModal,
        loginName = $("#loginName"),
        loginPassword = $("#loginPassword"),
        accountName = $("#accountName"),
        accountTel = $("#accountTel");

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("资料设置 >> <a href='#!/accountCenter'>会所资料</a> >> 会所子账号管理");

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        modelHeaderStr : "",
        opeType : "",
        currId : "",
        doAddAccount : function(){
            vm.modelHeaderStr = "新增账号";
            vm.opeType = "add";
            vm.currId = "";
            loginName.val("");
            loginPassword.val("");
            accountName.val("");
            accountTel.val("");
            editAccountModal.show();
        },
        doEditAccount : function(index){
            var editObj = vm.dataList[index];
            vm.currId = editObj.id;
            vm.modelHeaderStr = "编辑账号";
            vm.opeType = "edit";
            loginName.val(editObj.loginName);
            loginPassword.val("");
            accountName.val(editObj.name);
            accountTel.val(editObj.phoneNum);
            editAccountModal.show();
        },
        doChangeAccountPw : function(index){
            var editObj = vm.dataList[index];
            vm.currId = editObj.id;
            vm.modelHeaderStr = "修改账号密码";
            vm.opeType = "changePw";
            loginName.val(editObj.loginName);
            loginPassword.val("");
            accountName.val(editObj.name);
            accountTel.val(editObj.phoneNum);
            editAccountModal.show();
        }
    });

    function queryData(){
        $.ajax({
            url : "profile/subuser/list",
            success : function(res){
                if(res.respData){
                    vm.dataList = res.respData;
                    avalon.scan(thisPage[0]);
                }
            }
        });
    }

    editAccountModal = new Modal($("#editAccountModal"),{
        doClickOkBtn : function(){
            if(checkForm()){
                if(vm.opeType=="add" || vm.opeType=="edit"){
                    editAccountModal.loading();
                    $.ajax({
                        url : "profile/subuser/save",
                        type : "post",
                        data : {
                            id : vm.currId,
                            loginName : loginName.val().trim(),
                            name : accountName.val().trim(),
                            phoneNum : accountTel.val(),
                            plainPassword :  loginPassword.val()
                        },
                        success : function(res){
                            editAccountModal.loading("hide");
                            if(res.statusCode == 200){
                                editAccountModal.close();
                                msgAlert(res.msg,true);
                                queryData();
                            }
                            else{
                                editAccountModal.showTip(res.msg);
                            }
                        }
                    })
                }
                else{
                    editAccountModal.loading();
                    $.ajax({
                        url : "profile/subuser/password/update",
                        type : "post",
                        data : {
                            id : vm.currId, plainPassword : loginPassword.val()
                        },
                        success : function(res){
                            editAccountModal.loading("hide");
                            if(res.statusCode == 200){
                                editAccountModal.close();
                                msgAlert(res.msg,true);
                            }
                            else{
                                editAccountModal.showTip(res.msg);
                            }
                        }
                    });
                }
            }
        }
    });

    function checkForm(){
        if(!loginName.val() || !loginName.val().trim() ){
            editAccountModal.showTip("请输入登录名！");
            loginName.focus();
            return false;
        }
        if(vm.opeType!="edit" && !loginPassword.val()){
            editAccountModal.showTip("请输入账号密码！");
            loginPassword.focus();
            return false;
        }
       if(accountTel.val() && !/^1[34578]\d{9}$/.test(accountTel.val())){
            editAccountModal.showTip("请输入正确的手机号码！");
            accountTel.focus();
            return false;
        }
        return true;
    }

    ///////////////////////////////////////////////输入限制
    loginName.on("input",function(){
       if(this.value.length>15) this.value = this.value.substr(0,15);
        if(/\s/.test(this.value)) this.value = this.value.replace(/\s/g,"");
    });
    loginPassword.on("input",function(){
        if(this.value.length>15) this.value = this.value.substr(0,15);
        if(/\s/.test(this.value)) this.value = this.value.replace(/\s/g,"");
    });
    accountName.on("input",function(){
        if(this.value.length>30) this.value = this.value.substr(0,30);
        if(/\s/.test(this.value)) this.value = this.value.replace(/\s/g,"");
    });
    accountTel.on("input",function(){
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

    queryData();
});