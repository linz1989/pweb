require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"jqform","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        dataListPagination,
        confirmModal,
        editModal,
        $groupNameInput = $("#groupNameInput"),
        $telInput = $("#telInput"),
        groupId = getParamObj("id");

    if(!groupId){
        msgAlert("页面访问参数错误！");
        history.back();
    }
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("营销中心 >> <a href='#!/messageSell'>短信营销 >> <a href='#!/messageSellGroups'>分组管理</a> >> 分组详情</a>");

    var vm = avalon.define({
        $id : vmId,
        pageSize : 20,
        currPage : 1,
        records : [],
        groupName : "",//分组名
        delRecord : function(tel){////////////////////删除操作
            $("#confirmDelTelModal>div>div.confirmDel").text("确定要删除这个手机号码：'"+tel+"'？").attr("tel",tel);
            confirmModal.show();
        },
        doChangePageSize : function(){
            vm.pageSize = this.value;
            queryGroupDetailData();
        }
    });

    //////////////////分页器
    dataListPagination = new Pagination($("#dataListPagination"),{
        switchPage : function(page){
            queryGroupDetailData(page);
        }
    });

    ///////////////////////////////////////////////////////输入限制
    $groupNameInput.on("input",function(){
        if(this.value.length>15) this.value = this.value.substr(0,15);
    });
    $("#telInput").on("input",function(){
        if(/\D/.test(this.value)){
            this.value=this.value.replace(/\D/g,'');
        }
        if(this.value.length>11){
            this.value = this.value.substring(0,11);
        }
        if(this.id == "telInput"){
            /^1[34578]\d{9}$/.test(this.value) ? $("#groupAddTelBtn").removeClass("disabled") : $("#groupAddTelBtn").addClass("disabled");
        }
    });
    $("#groupAddTelBtn").click(function(){////新增手机号码
        if($telInput.val().length==0){
            $telInput.focus();
            return;
        }
        if(!/^1[34578]\d{9}$/.test($telInput.val())){
            msgAlert("新增的手机号码不正确！");
            $telInput.focus();
            return;
        }
        $.ajax({
            url : "contact/addPhone",
            data : {
                groupId : groupId , phoneNum : $telInput.val()
            },
            success : function(res){
                if(res.statusCode == 200){
                    msgAlert(res.msg || "操作成功！",true);
                    $telInput.val("");
                    queryGroupDetailData();
                }
                else{
                    msgAlert(res.msg || "操作失败！");
                }
            }
        });
    });
    $("#groupSearchTelBtn").click(function(){///模糊搜索
        queryGroupDetailData();
    });
    $("#groupNameEditBtn").click(function(){///修改分组名
        $groupNameInput.val(vm.groupName);
        editModal.show();
    });

    ////////////////////////////////////////////////////确认删除modal
    confirmModal = new Modal($("#confirmDelTelModal"),{
        doClickOkBtn : function(){
            confirmModal.close();
            $.ajax({
                url : "contact/deletePhone",
                data : {
                    groupId : groupId , phoneNum : $("#confirmDelTelModal>div>div.confirmDel").attr("tel")
                },
                success : function(res){
                    if(res.statusCode == 200){
                        msgAlert(res.msg || "删除成功！",true);
                        queryGroupDetailData();
                    }
                    else{
                        msgAlert(res.msg || "删除失败！");
                    }
                }
            });
        }
    });
    //////////////////////////////////////////////////修改分组名modal
    editModal = new Modal($("#editGroupNameModal"),{
        doClickOkBtn : function(){
            if($groupNameInput.val().length==0){
                $groupNameInput.focus();
                return;
            }
            editModal.loading();
            $.ajax({
                url : "contact/update",
                type : "post",
                data : { groupId : groupId , groupName : $groupNameInput.val() },
                success : function(res){
                    editModal.loading("hide");
                    if(res.statusCode == 200){
                        msgAlert(res.msg || "保存成功！",true);
                        vm.groupName = $groupNameInput.val();
                        editModal.close();
                        $groupNameInput.val("");
                    }
                    else{
                        msgAlert(res.msg || "保存失败！");
                    }
                }
            });
        }
    });

    function queryGroupDetailData(page){
        vm.currPage = page = page || 1;
        $.ajax({
            url : "contact/details",
            data: { page : page, pageSize : vm.pageSize, groupId : groupId , phoneNum : $("#telInput").val() },
            success: function (res) {
                if(res.statusCode == 200){
                    vm.groupName = res.respData.group.name;
                    res.respData = res.respData.details || [];
                    vm.records = res.respData;
                    dataListPagination.refresh({ currPage : page , totalPage : res.pageCount });
                    avalon.scan(thisPage[0]);
                }
                else{
                    msgAlert(res.msg || "数据查询失败！");
                }
            }
        });
        avalon.scan(thisPage[0]);
    }
    queryGroupDetailData();
});