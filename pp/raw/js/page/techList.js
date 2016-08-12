require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"area","dragsort","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        addTechModal,
        techName = $("#techName"),
        techNo = $("#techNo"),
        techPhoneNum = $("#techPhoneNum");

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("技师管理 >> 所有技师");

    var vm = avalon.define({
        $id : vmId,
        freeList : [],
        busyList : [],
        recommendList : [],
        itemList : [],
        queryCategory : "-1",
        currSex : "male",
        provinceList : provinceData.provinceList,
        cityList : [],
        doClickSearchBtn : function(){
            queryData();
        },
        doAddTechBtn : function(){
            techName.val("");
            techNo.val("");
            techPhoneNum.val("");
            vm.currSex = "male";
            addTechModal.show();
        },
        doChangeQueryCategory : function(){
            vm.queryCategory = this.value;
            queryData();
        },
        doChangeSex : function(v){
            vm.currSex = v;
        },
        doChangeOfProvince : function(){
            $("#citySelect").val("");
            if(this.value==""){
                vm.cityList = [];
            }
            else{
                for(var i=0;i<provinceData.cityList.length;i++){
                    if(provinceData.cityList[i].provinceCode == this.value){
                        vm.cityList = provinceData.cityList[i].city;
                    }
                }
            }
        },
        doClickTech : function(id){
            location.href="#!/techDetail?id="+id;
        }
    });

    function queryData(){
        $.ajax({
            url : "tech/data",
            data : {
                ajax : 1, categoryId : vm.queryCategory, name : $("#techInfoSearch").val()
            },
            success : function(res){
                if(res.statusCode == 200){
                    vm.freeList = res.respData.free || [];
                    vm.busyList = res.respData.work || [];
                }
                avalon.scan(thisPage[0]);
            }
        });
    }

    function queryRecomendTech(){
        $.ajax({
            url : "api/v2/manager/tech/recommend/list",
            success : function(res){
                if(res.statusCode == 200){
                    vm.recommendList = res.respData;
                }
            }
        });
    }

    function queryServiceCategory(){
        $.ajax({
            url : "club/service/data",
            success : function(res){
                if(res.statusCode==200){
                    vm.itemList = res.respData;
                }
            }
        });
    }

    $("#techInfoSearch").on("keypress",function(event){
        if(event.keyCode==13){
            queryData();
        }
    });

    addTechModal = new Modal($("#addTechModal"),{
        doClickOkBtn : function(){
            if(checkForm()){
                addTechModal.loading();
                $.ajax({
                    url : "tech/create",
                    type : "post",
                    data : {
                        id : "-1",
                        name : techName.val(),
                        gender : vm.currSex,
                        serialNo : techNo.val(),
                        phoneNum : techPhoneNum.val(),
                        provinceCode : $("#provinceSelect").val(),
                        province : $("#provinceSelect").val() ? $("#provinceSelect option:selected").text() : "",
                        cityCode : $("#citySelect").val(),
                        city : $("#citySelect").val() ? $("#citySelect option:selected").text() : ""
                    },
                    success : function(res){
                        addTechModal.loading("hide");
                        if(res && res.id){
                            addTechModal.close();
                            msgAlert("添加成功！",true);
                            queryData();
                        }
                        else{
                            addTechModal.showTip(res.message || "添加失败！");
                        }
                    }
                });
            }
        }
    });

    function checkForm(){
        if(!techName.val()){
            addTechModal.showTip("请输入技师昵称！");
            techName.focus();
            return false;
        }
        if(!techPhoneNum.val()){
            addTechModal.showTip("请输入技师手机号码！");
            techPhoneNum.focus();
            return false;
        }
        else if(!/^1[34578]\d{9}$/.test(techPhoneNum.val())){
            addTechModal.showTip("请输入正确的手机号码！");
            techPhoneNum.focus();
            return false;
        }
        return true;
    }

    /////////////////////////////////////输入限制
    techName.on("input",function(){
        if(this.value.length>15){
            this.value = this.value.substr(0,15);
        }
    });

    techNo.on("input",function(){
        if(this.value.length>5){
            this.value = this.value.substr(0,5);
        }
    });

    techPhoneNum.on("input",function(){
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

    $("#recommendTechList").dragsort({
        dragSelector : "li",
        dragSelectorExclude : "div>a>div>b",
        dragEnd : function(){
            var list = $("#recommendTechList>li"), idArr = [];
            for(var k=0;k<list.length;k++){
                idArr.push(list[k].getAttribute("techId"));
            }
            $.ajax({
                url : "tech/top/sort",
                type : "post",
                data : { ids : idArr.join(",") },
                success : function(res){
                    if(res.statusCode == 200){
                        msgAlert(res.msg,true);
                    }
                    else{
                        msgAlert(res.msg || "排序失败！");
                    }
                }
            });
        }
    });

    $("#freeTechList,#busyTechList").dragsort({
        dragSelector : "li",
        dragBetween : true,
        dragSelectorExclude : "div>a>div>b",
        dragEnd : function(){
            var $this = $(this), techId = $this.attr("techId"), status = $this.parents().attr("type");
            $.ajax({
                url : "tech/update/status",
                type : "post",
                data : { id : techId , status : status },
                success : function(res){
                    if(res.statusCode == 200){
                        msgAlert(res.message,true);
                    }
                    else{
                        msgAlert(res.message || "操作失败！");
                    }
                }
            });
        }
    });

    queryRecomendTech();
    queryServiceCategory();
    queryData();
});