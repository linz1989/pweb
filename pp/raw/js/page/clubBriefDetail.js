require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"kindeditor","kindeditor_zhCn","jqform","cropper","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        briefTitle = $("#briefTitle"),
        briefInfo = $("#briefInfo"),
        detailContent = $("#detailContent"),
        imagePreview,
        uploadImgModal,
        imgModalContent = $("#uploadImgModal>div>div.content"),
        editImg = $("#editImg"),
        pageParam = getParamObj();

    if(!pageParam.ope || !pageParam.id){
        msgAlert("页面访问参数错误！");
        history.back();
        return;
    }

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("资料设置 >> <a href='#!/clubBriefSetting'>会所简介</a> >> "+(pageParam.ope=="add" ? "新增简介" : "编辑简介"));

    var vm = avalon.define({
        $id : vmId,
        currEditOpe : pageParam.ope,
        currId : pageParam.id,
        currImageId : "",
        uploadBtnStr : "上传图片",
        doClickOfUploadImg : function(){////点击上传图片按钮
            /////////清空uploadImgModal
            imagePreview.clean();
            imgModalContent.removeClass("hasImg");
            uploadImgModal.show();
        },
        doClickSaveBtn : function(){
            if(checkForm()){
                $.ajax({
                    url : "club/item/create",
                    type : "post",
                    data : {
                        id : vm.currId,
                        image : vm.currImageId,
                        title : briefTitle.val().trim(),
                        intro : briefInfo.val().trim(),
                        description : detailContent.val()
                    },
                    success : function(res){
                        if(res.statusCode == 200){
                            msgAlert(vm.currEditOpe=="add" ? "新增成功！" : "修改成功！",true);
                            location.href="#!/clubBriefSetting";
                        }
                        else{
                            msgAlert(res.msg || "操作失败！");
                        }
                    }
                });
            }
        }
    });

    uploadImgModal = new Modal($("#uploadImgModal"),{
        doClickOkBtn : function(){
            if($("#imgForm>div>img")[0] && $("#imgForm>div>img")[0].width !=0 ){
                if(!$("#uploadImgBtn")[0].files[0]){
                    uploadImgModal.close();
                }
                else{
                    var checkRes = imagePreview.checkSelectionValidate();
                    if(checkRes != "OK"){
                        uploadImgModal.showTip(checkRes);
                        return;
                    }
                    uploadImgModal.loading();
                    $("#imgForm").ajaxSubmit({
                        dataType:  'json',
                        success : function(res){
                            if(res && res.image){
                                uploadImgModal.close();
                                vm.currImageId = res.image;
                                //////////////////////////获取图片的url
                                editImg.show();
                                editImg[0].src = "updateImageInfo/imageView/"+vm.currImageId;
                                vm.uploadBtnStr = "修改图片";
                                $("#clubBriefForm>div.img").addClass("hasImg");
                            }
                            else{
                                uploadImgModal.showTip("图片上传失败！");
                            }
                        },
                        complete : function(xhr){
                            uploadImgModal.loading("hide");
                            if(xhr.status == 400){
                                uploadImgModal.showTip("您选择的裁剪区域过大！请通过鼠标缩小区域！");
                            }
                        }
                    });
                }
            }
            else{
                uploadImgModal.showTip("请您上传图片！");
            }
        }
    });

    function checkForm(){
        if(!vm.currId){
            msgAlert("ID为空！");
            return false;
        }
        if(!vm.currImageId){
            msgAlert("请您上传图片！");
            return false;
        }
        if(!briefTitle.val() || !briefTitle.val().trim()){
            msgAlert("请输入标题！");
            briefTitle.focus();
            return false;
        }
        if(!briefInfo.val() || !briefInfo.val().trim()){
            msgAlert("请输入简介！");
            briefInfo.focus();
            return false;
        }
        return true;
    }

    imagePreview = new iCropper({
        imgFile : $("#uploadImgBtn")[0],
        img : $("#imgForm>div>img")[0],
        imgName : $("#imgFileName")[0],
        imgId : $("#imageId")[0],
        selectionTxt : $("#imgForm>div>span.selectionTxt")[0],
        maxWidth : 580,
        maxHeight : 300,
        x : $("#x")[0],
        y : $("#y")[0],
        w : $("#w")[0],
        h : $("#h")[0],
        imgWidth : 688,
        imgHeight : 408,
        ratioW : 688,
        ratioH : 408,
        onImgLoad : function(){
            if(!imgModalContent.hasClass("hasImg")){
                imgModalContent.addClass("hasImg");
            }
        }
    });

    /////////////////////////////////输入限制
    briefTitle.on("input",function(){
        if(this.value.length>15) this.value = this.value.substr(0,15);
    });
    briefInfo.on("input",function(){
        if(this.value.length>30) this.value = this.value.substr(0,30);
    });

    function initKindEditor(){
        KindEditor.create('#detailContent', {
            resizeType : 1,
            pasteType : 1,
            width : "84%",
            minHeight: "400px",
            showLocal : false,
            resizeMode : 1,
            cssData: 'body {font-family: "微软雅黑"; font-size: 16px; color: #4d4d4d; overflow-x:hidden}',
            allowUpload:true,
            uploadJson : 'club/uploadImage?width=535',
            afterBlur: function(){ this.sync() },
            items : [
                'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline',
                'removeformat', '|', 'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist',
                'insertunorderedlist', '|', 'image', 'link']
        });
    }
   initKindEditor();

    if(pageParam.ope=="add"){
        briefTitle.val("");
        detailContent.val("");
        KindEditor.html("#detailContent","");
        briefInfo.val("");
        editImg[0].src = "";
        editImg.hide();
        vm.uploadBtnStr = "上传图片";
        vm.currImageId = "";
        $("#clubBriefForm>div.img").removeClass("hasImg");
        avalon.scan(thisPage[0]);
    }
    else{
        $.ajax({
            url : "club/item/info/"+pageParam.id,
            success : function(res){
                if(res && res.clubId){
                    briefTitle.val(res.title);
                    detailContent.val(res.description);
                    KindEditor.html("#detailContent", res.description);
                    briefInfo.val(res.intro);
                    vm.currImageId = res.image;
                    if (res.imageUrl) {
                        editImg[0].src = res.imageUrl;
                        editImg.show();
                        vm.uploadBtnStr = "修改图片";
                        $("#clubBriefForm>div.img").addClass("hasImg");
                    }
                    else {
                        editImg[0].src = "";
                        editImg.hide();
                        vm.uploadBtnStr = "上传图片";
                        $("#clubBriefForm>div.img").removeClass("hasImg");
                    }
                    avalon.scan(thisPage[0]);
                }
                else{
                    msgAlert("数据查询失败！");
                    history.back();
                }
            }
        });
    }
});