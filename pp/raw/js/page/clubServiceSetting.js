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
        editor,
        addImgBrowserClick = false;

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("资料设置 >> 服务项目");

    var vm = avalon.define({
        $id : vmId,
        items : [],
        categories : [],
        opeType : "",
        opeId : "",
        confirmContent : "",
        units : ["分钟" , "小时" , "天" ,"次"],
        addPlus : false,
        currEditId : "",
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
        doClickOfEdit : function(index){
            var itemObj = vm.items[index];///categoryId
            vm.currEditId = itemObj.id;
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
            initkindEditor(itemObj.categoryId);
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
            confirmModal.close();
            if(vm.opeType == "del"){
                $.ajax({
                    url : "club/service/item/delete",
                    data : { id : vm.opeId },
                    success : function(res){
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
            else{
                $.ajax({
                    url : "club/service/item/devaluation",
                    data : { recommended : 'Y' , id : vm.opeId },
                    success : function(res){
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
                var checkRes = imagePreview.checkSelectionValidate();
                if(checkRes != "OK"){
                    editItemModal.showTip(checkRes);
                    return;
                }
                editItemModal.loading();
                editForm.ajaxSubmit({
                    dataType:  'json',
                    success : function(res){
                        if(res.statusCode == 200){
                            msgAlert("修改成功！",true);
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
        if($("#editForm>div.img>img")[0].src=="" && !$("#imgFileName").val()){
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
            url : "club/service/dataList",
            success : function(res){
                if(res.statusCode == 200){
                    vm.items = res.respData.items;
                    vm.categories = res.respData.sort;
                    avalon.scan(thisPage[0]);
                }
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
                url : "club/service/top/sort",
                type : "post",
                data : { ids : ids.join(",") },
                success : function(res){
                    if(res.statusCode==200){
                        msgAlert("排序成功！",true);
                    }
                }
            });
        }
    });

    function initkindEditor(categoryId){
        if(editor) editor.remove();
        editor= KindEditor.editor({
            fileManagerJson : "club/service/photoGallery/data?id="+categoryId,
            allowFileManager : true
        });

        if(addImgBrowserClick==false){
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
            addImgBrowserClick = true;
        }
    }
    queryData();
});