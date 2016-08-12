require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","jqform","cropper","dragsort","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        confirmModal,
        editActivityModal,
        actDate = $("#actDate"),
        actTitle = $("#actTitle"),
        actRulesContent = $("#actRulesContent"),
        actRules = $("#actRules"),
        startTime = $("#startTime"),
        endTime = $("#endTime"),
        imagePreview,
        editActivityForm = $("#editActivityForm");

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("营销中心 >> 场所活动");

    var actList = [];
    var vm = avalon.define({
        $id : vmId,
        list : [],
        confirmContent : "",
        opeType : "",
        opeActId : "",
        editStr : "新增活动",
        currEditOpe : "add",
        currActId : "",
        doChangeStatus : function(status,id){///status id
            if(status == "online"){
                vm.opeType = "downline";
                vm.confirmContent = "确认下线此活动？";
            }
            else{
                vm.opeType = "online";
                vm.confirmContent = "确认上线此活动？";
            }
            vm.opeActId = id;
            confirmModal.show();
        },
        doDelAct : function(id){
            vm.confirmContent = "确认删除此活动？";
            vm.opeType = "delete";
            vm.opeActId = id;
            confirmModal.show();
        },
        doClickOfAddNew : function(){
            vm.editStr = "新增活动";
            vm.currEditOpe = "add";
            vm.currActId = "";
            actTitle.val("");
            actRulesContent.html("");
            actRules.val("");
            startTime.val("");
            endTime.val("");
            editActivityForm.removeClass("hasImg");
            imagePreview.clean();
            editActivityModal.show();
        },
        doEditAct : function(index){
            vm.editStr = "编辑活动";
            vm.currEditOpe = "modify";
            vm.currActId = actList[index].actId;
            actTitle.val(actList[index].actTitle);
            actRulesContent.html(actList[index].actContent);
            actRules.val(actList[index].actContent);
            startTime.val(actList[index].startDate);
            endTime.val(actList[index].endDate);
            if(actList[index].startDate && actList[index].endDate){
                actDate.data('daterangepicker').setStartDate(actList[index].startDate);
                actDate.data('daterangepicker').setEndDate(actList[index].endDate);
            }
            else{
                actDate.val("");
            }
            if(actList[index].actLogoUrl){
                imagePreview.load(actList[index].actLogoUrl,{
                    autoCropArea : 1, disabled : true
                });
            }
            else{
                imagePreview.clean();
            }
            editActivityForm.addClass("hasImg");
            editActivityModal.show();
        }
    });

    confirmModal = new Modal($("#confirmModal"),{
        doClickOkBtn : function(){
            confirmModal.close();
            $.ajax({
                url: "act/modify",
                data: { actId: vm.opeActId, operator: vm.opeType, actType: "act" },
                success: function (res) {
                    if (res.statusCode == 200) {
                        msgAlert(res.msg, true);
                        queryData();
                    }
                    else {
                        msgAlert(res.msg || "操作失败！");
                    }
                }
            });
        }
    });

    //////////////////日期范围
    var initStartDate = new Date(), initEndDate = new Date();
    initEndDate.setTime(initStartDate.getTime()+30*24*60*60*1000);
    actDate.daterangepicker({ startDate : initStartDate, endDate : initEndDate});

    editActivityModal = new Modal($("#editActivityModal"),{
        doClickOkBtn : function(){
            if(checkForm()){
                if($("#imgFileName").val()){
                    var checkRes = imagePreview.checkSelectionValidate();
                    if(checkRes != "OK"){
                        editActivityModal.showTip(checkRes);
                        return;
                    }
                }
                editActivityModal.loading();
                editActivityForm.ajaxSubmit({
                    dataType:  'json',
                    success : function(res){
                        if(res.statusCode == 200){
                            msgAlert(res.msg,true);
                            editActivityModal.close();
                            queryData();
                        }
                        else{
                            editActivityModal.showTip(res.msg || "操作失败！");
                        }
                    },
                    complete : function(xhr){
                        editActivityModal.loading("hide");
                        if(xhr.status == 400){
                            editActivityModal.showTip("您选择的裁剪区域过大！请通过鼠标缩小区域！");
                        }
                    }
                });
            }
        }
    });

    function checkForm(){
        if(vm.currEditOpe=="add" && !$("#imgFileName").val()){
            editActivityModal.showTip("请上传活动图片！");
            return false;
        }
        if(!actTitle.val()){
            editActivityModal.showTip("请输入活动标题！");
            actTitle.focus();
            return false;
        }
        if(!actRulesContent.html()){
            editActivityModal.showTip("请输入活动规则！");
            actRulesContent.focus();
            return false;
        }
        actRules.val(actRulesContent.html());
        var dateObj = formatDateRangeVal(actDate.val());
        startTime.val(dateObj.start);
        endTime.val(dateObj.end);
        return true;
    }

    imagePreview = new iCropper({
        imgFile : $("#uploadImgBtn")[0],
        img : $("#editActivityForm>div.img>img")[0],
        imgName : $("#imgFileName")[0],
        selectionTxt : $("#editActivityForm>div.img>span.selectionTxt")[0],
        maxWidth : 630,
        maxHeight : 250,
        x : $("#x")[0],
        y : $("#y")[0],
        w : $("#w")[0],
        h : $("#h")[0],
        imgWidth : 720,
        imgHeight : 360,
        ratioW : 2,
        ratioH : 1,
        onImgLoad : function(){
            if(!editActivityForm.hasClass("hasImg")){
                editActivityForm.addClass("hasImg");
            }
        }
    });

    function queryData(){
        $.ajax({
            url : "act/list",
            success : function(res){
                if(res.statusCode == 200){
                    actList = res.respData.acts;
                    vm.list= actList;
                }
                avalon.scan(thisPage[0]);

                ///////////////获取下线的活动
                $.ajax({
                    url : "act/downline_act?actType=act&actStatus=downline",
                    success : function(downlineRes){
                        if(downlineRes.statusCode == 200){
                            for(var k=0;k<downlineRes.respData.length;k++){
                                actList.push(downlineRes.respData[k]);
                                vm.list= actList;
                            }
                        }
                    }
                })
            }
        });
    }

    $("#activityList").dragsort({
        dragSelector : "li",
        dragSelectorExclude : "div>ul>li",
        dragEnd : function(){
            var $this = $(this), list = $this.parents("ul").children(), ids = [], actId;
            for(var k=0;k<list.length;k++){
                actId = list[k].getAttribute("actId");
                if(actId){
                    ids.push(actId);
                }
            }
            $.ajax({
                url : "act/orders",
                type : "post",
                data : { orderIds : ids.join(",") , actType : "act" , clubId : vm.list[0].clubId },
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