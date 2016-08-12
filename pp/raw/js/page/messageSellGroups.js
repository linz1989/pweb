require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"jqform","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        dataListPagination,
        confirmModal,
        addModal,
        $groupNameInput = $("#groupNameInput"),
        $groupFileInput = $("#groupFileInput");

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("营销中心 >> <a href='#!/messageSell'>短信营销 >> 分组管理</a>");

    var vm = avalon.define({
        $id : vmId,
        pageSize : 20,
        currPage : 1,
        groups : [],
        delGroup : function(groupId,name){////////////////////删除分组
            $("#confirmDelGroupModal>div>div.confirmDel").text("确定要删除名称为'"+name+"'的分组？").attr("groupId",groupId);
            confirmModal.show();
        },
        addGroup : function(){
            $groupNameInput.val("");
            $groupFileInput.val("");
            $("#groupFileNameSpan").text("");
            addModal.show();
        },
        doChangePageSize : function(){
            vm.pageSize = this.value;
            queryGroupData();
        }
    });

    //////////////////分页器
    dataListPagination = new Pagination($("#dataListPagination"),{
        switchPage : function(page){
            queryGroupData(page);
        }
    });

    ////////////////////////////////////////////////////确认删除modal
    confirmModal = new Modal($("#confirmDelGroupModal"),{
        doClickOkBtn : function(){
            confirmModal.close();
            $.ajax({
                url : "contact/delete",
                data : {
                    groupId : $("#confirmDelGroupModal>div>div.confirmDel").attr("groupId")
                },
                success : function(res){
                    if(res.statusCode == 200){
                        msgAlert(res.msg || "删除成功！",true);
                        queryGroupData();////刷新数据
                    }
                    else{
                        msgAlert(res.msg || "删除失败！");
                    }
                }
            });
        }
    });

    ////////////////////////////////////////////////////增加modal
    addModal = new Modal($("#addNewGroupModal"),{
        doClickOkBtn : function(){
            if($groupNameInput.val().length==0){
                addModal.showTip("请您输入分组名！");
                $groupNameInput.focus();
                return;
            }
            if($groupFileInput[0].files.length == 0){
                addModal.showTip("请您上传文件！");
                return;
            }
            var uploadFile = $groupFileInput[0].files[0];
            if(uploadFile.size>5*1024*1024){
                addModal.showTip("您上传的文件不能大于5M！");
                return;
            }
            var dotIndex = uploadFile.name.lastIndexOf("."), type="";
            if(dotIndex>=0){
                type = uploadFile.name.substring(dotIndex+1);
            }
            if (!/^(xls|xlsx)$/i.test(type)) {
                addModal.showTip("请您上传excel文件！");
                return;
            }
            addModal.loading();
            //////////////////////submit
            $("#addGroupForm").ajaxSubmit({
                url : "contact/save",
                type : "post",
                dataType : "json",
                success : function(res){
                    addModal.loading("hide");
                    msgAlert((res.msg || "分组创建成功！"),res.statusCode == 200);
                    if(res.statusCode == 200){
                        addModal.close();
                        queryGroupData();
                    }
                },
                error : function(res){
                    addModal.loading("hide");
                    msgAlert((res.msg || "分组创建失败！"));
                }
            });
        }
    });

    $groupFileInput.on("change",function(){//////change
        if($groupFileInput[0].files.length == 0){
            addModal.showTip("请您上传文件！");
            $("#groupFileNameSpan").text("");
            return;
        }
        var uploadFile = $groupFileInput[0].files[0];
        $("#groupFileNameSpan").text(uploadFile.name);
        if(uploadFile.size>5*1024*1024){
            addModal.showTip("您上传的文件不能大于5M！");
            return;
        }
        var dotIndex = uploadFile.name.lastIndexOf("."), type="";
        if(dotIndex>=0){
            type = uploadFile.name.substring(dotIndex+1);
        }
        if (!/^(xls|xlsx)$/i.test(type)) {
            addModal.showTip("请您上传excel文件！");
        }
    });
    $("#groupNameInput").on("input",function(){
        if(this.value.length>15) this.value = this.value.substr(0,15);
    });

    ////////////////////////////////////////////////
    function queryGroupData(page){
        vm.currPage = page = page || 1;
        $.ajax({
            url : "contact/list",
            data: { page : page, pageSize : vm.pageSize },
            success: function (res) {
                if(res.statusCode == 200){
                    res.respData = res.respData.groups || [];
                    vm.groups = res.respData;
                    dataListPagination.refresh({ currPage : page, totalPage : res.pageCount });
                    avalon.scan(thisPage[0]);
                }
                else{
                    msgAlert(res.msg || "数据查询失败！");
                }
            }
        });
    }
    queryGroupData();
});