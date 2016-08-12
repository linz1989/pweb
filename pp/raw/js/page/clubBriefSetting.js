require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"dragsort","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        confirmModal;

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("资料设置 >> 会所简介");

    var vm = avalon.define({
        $id : vmId,
        list : [],
        confirmContent : "",
        opeType : "",
        opeId : "",
        doClickDelMenu : function(id){
            vm.confirmContent = "确认删除此简介？";
            vm.opeType = "delete";
            vm.opeId = id;
            confirmModal.show();
        },
        doClickOfAddNew : function(){////新增简介 ---请求ID
            $.ajax({
                url : "club/item/info/-1",
                success : function(res){
                    if(res && res.id){
                        location.href = "#!/clubBriefDetail?id="+res.id+"&ope=add";
                    }
                    else{
                        msgAlert(res.msg || res.message || "数据请求异常！");
                    }
                }
            });
        },
        doClickEditMenu : function(id){////编辑简介
            location.href = "#!/clubBriefDetail?id="+id+"&ope=edit";
        }
    });

    confirmModal = new Modal($("#confirmModal"),{
        doClickOkBtn : function(){
            $.ajax({
                url: "club/item/delete/"+vm.opeId,
                dataType : "text",
                success: function (res,status) {
                    confirmModal.close();
                    if (status == "success") {
                        msgAlert("删除成功！", true);
                        queryData();
                    }
                    else {
                        msgAlert(res.msg || res.message || "删除失败！");
                    }
                }
            });
        }
    });

    function queryData(){
        $.ajax({
            url : "club/item/data",
            success : function(res){
                if(res.statusCode == 200){
                    vm.list= res.respData;
                }
                avalon.scan(thisPage[0]);
            }
        });
    }

    $("#briefItemList").dragsort({
        dragSelector : "li",
        dragSelectorExclude : "div>ul>li",
        dragEnd : function(){
            var $this = $(this), list = $this.parents("ul").children(), ids = [];
            for(var k=0;k<list.length;k++){
                ids.push(list[k].getAttribute("itemId"));
            }
            $.ajax({
                url : "club/item/sort",
                type : "post",
                data : { ids : ids.join(",") },
                success : function(res){
                    if(res.statusCode==200){
                        msgAlert("操作成功！",true);
                    }
                }
            });
        }
    });

    queryData();
});