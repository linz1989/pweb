require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"jqform","cropper","dragsort","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        confirmModal,
        editModal,
        actTitle = $("#actTitle"),
        imagePreview,
        editForm = $("#editForm");

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("资料设置 >> 首页展示");

    var vm = avalon.define({
        $id : vmId,
        list : [],
        confirmContent : "",
        opeType : "",
        opeId : "",
        editStr : "添加图片",
        currEditOpe : "add",
        currId : "",
        currImageId : "",
        doClickDelBtn : function(id){
            vm.confirmContent = "确认删除此图片？";
            vm.opeType = "delete";
            vm.opeId = id;
            confirmModal.show();
        },
        doClickOfAddNew : function(){
            vm.editStr = "添加图片";
            vm.currEditOpe = "add";
            vm.currId = "";
            vm.currImageId = "";
            actTitle.val("");
            $("#imgLink").val("");
            editForm.removeClass("hasImg");
            imagePreview.clean();
            editModal.show();
        },
        doClickEditBtn : function(index){
            vm.editStr = "编辑图片";
            vm.currEditOpe = "modify";
            vm.currId = vm.list[index].id;
            vm.currImageId = vm.list[index].image;
            $("#imgLink").val(vm.list[index].link || "");
            //vm.list[index].imageUrl = "http://sdcm163.stonebean.com:8489/s/group00/M00/02/25/ooYBAFbiZcKASB3fAAC5sCi7dEI515.jpg?st=1CKFPwQd7Tcp5pT7bL2i0w&e=1469168685";
            imagePreview.load(vm.list[index].imageUrl,{
                autoCropArea : 1, disabled : true
            });
            editForm.addClass("hasImg");
            editModal.show();
        }
    });

    confirmModal = new Modal($("#confirmModal"),{
        doClickOkBtn : function(){
            confirmModal.close();
            $.ajax({
                url: "club/banner/delete/"+vm.opeId,
                success: function (res) {
                    if (res.statusCode == 200) {
                        msgAlert("删除成功！", true);
                        queryData();
                    }
                    else {
                        msgAlert(res.msg || res.message || "操作失败！");
                    }
                }
            });
        }
    });

    editModal = new Modal($("#editModal"),{
        doClickOkBtn : function(){
            if(checkForm()){
                var checkRes = imagePreview.checkSelectionValidate();
                if(checkRes != "OK"){
                    editModal.showTip(checkRes);
                    return;
                }
                editModal.loading("show");
                editForm.ajaxSubmit({
                    url : vm.currEditOpe =="add" ? "club/banner/create" : "club/banner/update",
                    dataType:  'json',
                    success : function(res){
                        if(res.statusCode == 200){
                            msgAlert(vm.currEditOpe =="add" ? "图片添加成功！" : "图片修改成功！",true);
                            editModal.close();
                            queryData();
                        }
                        else{
                            editModal.showTip(res.message || "操作失败！");
                        }
                    },
                    complete : function(xhr){
                        editModal.loading("hide");
                        if(xhr.status == 400){
                            editModal.showTip("您选择的裁剪区域过大！请通过鼠标缩小区域！");
                        }
                    }
                });
            }
        }
    });

    function checkForm(){
        if(vm.currEditOpe=="add" && !$("#imgFileName").val()){
            editModal.showTip("请上传会所图片！");
            return false;
        }
        return true;
    }

    imagePreview = new iCropper({
        imgFile : $("#uploadImgBtn")[0],
        img : $("#editForm>div.img>img")[0],
        imgName : $("#imgFileName")[0],
        imgId : $("#imageId")[0],
        selectionTxt : $("#editForm>div.img>span.selectionTxt")[0],
        maxWidth : 580,
        maxHeight : 300,
        x : $("#x")[0],
        y : $("#y")[0],
        w : $("#w")[0],
        h : $("#h")[0],
        imgWidth : 360,
        imgHeight : 204,
        ratioW : 2,
        ratioH : 1,
        onImgLoad : function(){
            if(!editForm.hasClass("hasImg")){
                editForm.addClass("hasImg");
            }
        }
    });

    function queryData(){
        $.ajax({
            url : "club/banner/data",
            success : function(res){
                if(res && res.data){
                    vm.list= res.data;
                }
                avalon.scan(thisPage[0]);
            }
        });
    }

    $("#imgLink").on("keyup",function(event){
        var value = this.value, keyCode=  event.which;
        value = value.replace(/\s+/g,"");
        if(value.length > 4){
            if(keyCode == 17){
                this.value = value;
                return;
            }
            if(value.substring(0,4) != "http"){
                value = "http://"+value;
            }
        }
        this.value = value;
        return false;
    });

    $("#bannerList").dragsort({
        dragSelector : "li",
        dragSelectorExclude : "div>ul>li",
        dragEnd : function(){
            var $this = $(this), list = $this.parents("ul").children(), ids = [];
            for(var k=0;k<list.length;k++){
                ids.push(list[k].getAttribute("imgId"));
            }
            $.ajax({
                url : "club/banner/sort",
                type : "post",
                data : { ids : ids.join(",") , clubId : vm.list[0].clubId },
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