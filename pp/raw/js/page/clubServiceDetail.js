require(["css!../../compressed/css/page/clubService.css?"+$$.rootVm.currTime,"css!../../compressed/css/common/kindeditor.css","kindeditor","kindeditor_zhCn","jqform","cropper","dragsort","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        confirmModal,
        editItemModal,
        imagePreview,
        editForm = $("#editForm"),
        itemName = $("#itemName"),
        itemPrice0 = $("#itemPrice0"),
        itemTime0 = $("#itemTime0"),
        durationUnit = $("#durationUnit"),
        itemPrice1 = $("#itemPrice1"),
        itemTime1 = $("#itemTime1"),
        durationUnitPlus = $("#durationUnitPlus"),
        itemDescription = $("#itemDescription"),
        itemDescriptionContent = $("#itemDescriptionContent"),
        currEditImageId = $("#currEditImageId"),
        pageParam = getParamObj(),
        editor;

    if(!pageParam.id){
        msgAlert("地址栏访问参数错误！");
        history.back();
    }

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("资料设置 >> <a href='#!/clubServiceSetting'>服务项目</a>");

    var vm = avalon.define({
        $id : vmId,
        items : [],
        categoryId : pageParam.id,
        itemName : "",
        opeType : "",
        opeId : "",
        confirmContent : "",
        units : ["分钟" , "小时" , "天" ,"次"],
        addPlus : false,
        currEditId : "",
        currEditTitle : "添加项目",
        doClickOfDel : function(id){
            vm.opeId = id;
            vm.opeType = "del";
            vm.confirmContent = "确认删除此项目？";
            confirmModal.show();
        },
        doClickOfRemoveIndex : function(id){
            vm.opeId = id;
            vm.opeType = "removeIndex";
            vm.confirmContent = "确定要将此项目移除出首页吗？";
            confirmModal.show();
        },
        doClickOfAddIndex : function(id){
            vm.opeId = id;
            vm.opeType = "addIndex";
            vm.confirmContent = "确定要将此项目推荐到首页吗？";
            confirmModal.show();
        },
        doClickOfAdd : function(){/////增加项目
            vm.currEditId = "";
            vm.currEditTitle = "添加项目";
            currEditImageId.val("");
            itemName.val("");
            itemPrice0.val("");
            itemTime0.val("");
            durationUnit.val("分钟");
            itemDescription.val("");
            itemDescriptionContent.html("");
            vm.addPlus = false;
            itemPrice1.val("");
            itemTime1.val("");
            durationUnitPlus.val("分钟");
            imagePreview.clean();
            editForm.removeClass("hasImg");
            editItemModal.show();
        },
        doClickOfEdit : function(index){
            var itemObj = vm.items[index];
            vm.currEditId = itemObj.id;
            vm.currEditTitle = "编辑项目";
            currEditImageId.val(itemObj.image);
            itemName.val(itemObj.name);
            itemPrice0.val(itemObj.price);
            itemTime0.val(itemObj.duration);
            durationUnit.val(itemObj.durationUnit);
            itemDescription.val(itemObj.description);
            itemDescriptionContent.html(itemObj.description);
            if(itemObj.pricePlus!= ""){
                vm.addPlus = true;
                itemPrice1.val(itemObj.pricePlus);
                itemTime1.val(itemObj.durationPlus);
                durationUnitPlus.val(itemObj.durationUnitPlus);
            }
            else{
                vm.addPlus = false;
                itemPrice1.val("");
                itemTime1.val("");
            }
            if(itemObj.imageUrl){
                imagePreview.load(itemObj.imageUrl,{
                    autoCropArea : 1, disabled : true
                });
                editForm.addClass("hasImg");
            }
            else{
                imagePreview.clean();
                editForm.removeClass("hasImg");
            }
            editItemModal.show();
        },
        doClickAddPlus : function(){
            vm.addPlus = true;
        },
        doClickRemovePlus : function(){
            vm.addPlus = false;
        }
    });

    confirmModal = new Modal($("#confirmModal"),{
        doClickOkBtn : function(){
            if(vm.opeType == "del"){
                $.ajax({
                    url : "club/service/item/delete",
                    data : { id : vm.opeId },
                    success : function(res){
                        confirmModal.close();
                        if(res.statusCode == 200){
                            msgAlert("删除成功！",true);
                            queryData();
                        }
                        else{
                            msgAlert(res.message);
                        }
                    }
                });
            }
            else {
                $.ajax({
                    url : "club/service/item/devaluation",
                    data : { recommended : vm.opeType == "removeIndex" ? 'Y' : 'N' , id : vm.opeId },
                    success : function(res){
                        confirmModal.close();
                        if(res.statusCode == 200){
                            msgAlert(res.msg,true);
                            queryData();
                        }
                        else{
                            msgAlert(res.msg);
                        }
                    }
                });
            }
        }
    });

    editItemModal = new Modal($("#editItemModal"),{
        doClickOkBtn : function(){
            if(checkForm()){
                itemDescription.val(itemDescriptionContent.html());
                if($("#editForm>div.img>img")[0] && $("#editForm>div.img>img")[0].width!=0 && $("#uploadImgBtn")[0].files[0]){
                    var checkRes = imagePreview.checkSelectionValidate();
                    if(checkRes != "OK"){
                        editItemModal.showTip(checkRes);
                        return;
                    }
                }
                editItemModal.loading();
                editForm.ajaxSubmit({
                    url : vm.currEditId=="" ? "club/service/serviceItem/create" : "club/service/serviceItem/update",
                    dataType:  'json',
                    success : function(res){
                        if(res.statusCode == 200){
                            msgAlert(vm.currEditId=="" ? "添加成功！" : "修改成功！",true);
                            editItemModal.close();
                            queryData();
                        }
                        else{
                            editItemModal.showTip(res.message || "操作失败！");
                        }
                    },
                    complete : function(xhr){
                        editItemModal.loading("hide");
                        if(xhr.status == 400){
                            editItemModal.showTip("您选择的裁剪区域过大！请通过鼠标缩小区域！");
                        }
                    }
                });
            }
        }
    });

    function checkForm(){
        if($("#editForm>div.img>img")[0] && $("#editForm>div.img>img")[0].width==0 && !$("#imgFileName").val()){
            editItemModal.showTip("请上传项目图片！");
            return false;
        }
        if(!itemName.val()){
            itemName.focus();
            editItemModal.showTip("请输入项目名称！");
            return false;
        }
        if($("#imgFileName").val()){
            currEditImageId.val("");
        }
        return true;
    }

    //////////////////////////限制输入
    $("#editForm").on("input","div.price>input",function(){
        if(/\D/.test(this.value)){
            this.value = this.value.replace(/\D/g,"");
        }
        if(this.value.length>6){
            this.value = this.value.substr(0,6);
        }
    });

    imagePreview = new iCropper({
        imgFile : $("#uploadImgBtn")[0],
        img : $("#editForm>div.img>img")[0],
        imgName : $("#imgFileName")[0],
        imgId : $("#currEditImageId")[0],
        selectionTxt : $("#editForm>div.img>span.selectionTxt")[0],
        maxWidth : 580,
        maxHeight : 230,
        x : $("#x")[0],
        y : $("#y")[0],
        w : $("#w")[0],
        h : $("#h")[0],
        imgWidth : 324,
        imgHeight : 324,
        ratioW : 1,
        ratioH : 1,
        onImgLoad : function(){
            if(!editForm.hasClass("hasImg")){
                editForm.addClass("hasImg");
            }
        }
    });

    function queryData(){
        $.ajax({
            url : "club/service/itemList/"+pageParam.id,
            success : function(res){
                if(res.title && res.list){
                    vm.itemName = res.title;
                    $$.currPath.html("资料设置 >> <a href='#!/clubServiceSetting'>服务项目</a> >>"+res.title);
                    vm.items = res.list;
                }
                avalon.scan(thisPage[0]);
            }
        });
    }

    $("#serviceItemList").dragsort({
        dragSelector : "li",
        dragSelectorExclude : "div>ul>li",
        dragEnd : function(){
            var $this = $(this), list = $this.parents("ul").children(), ids = [];
            for(var k=0;k<list.length;k++){
                ids.push(list[k].getAttribute("itemId"));
            }
            $.ajax({
                url : "club/service/sort",
                type : "post",
                data : { ids : ids.join(","), categoryId : pageParam.id },
                success : function(res){
                    if(res.statusCode==200){
                        msgAlert("排序成功！",true);
                    }
                }
            });
        }
    });

    function initkindEditor(categoryId){
        editor= KindEditor.editor({
            fileManagerJson : "club/service/photoGallery/data?id="+categoryId,
            allowFileManager : true
        });

        KindEditor('#fileManager').click(function() {
            editor.loadPlugin('filemanager', function() {
                editor.plugin.filemanagerDialog({
                    viewType : 'VIEW',
                    dirName : 'image',
                    clickFn : function(id) {
                        //console.log("click fun id"+id);
                        imagePreview.clean();
                        imagePreview.load("updateImageInfo/imageView/" + id,{
                            autoCropArea : 1, disabled : true
                        });
                        editForm.addClass("hasImg");
                        currEditImageId.val(id);
                        editor.hideDialog();
                    }
                });
            });
        });
    }

    initkindEditor(pageParam.id);
    queryData();
});