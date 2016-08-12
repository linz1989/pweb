require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        $sendObjSelectorUsers = $("#sendObjSelector td"),
        paramObj = getParamObj(),
        editModal,
        editModalContent = $("#editMessageContentModal>div>div.content"),
        confirmModal,
        linkFieldsObj = {},
        inRequest = false,
        initObj = {};
    thisPage.attr("ms-controller",vmId);

    var vm = avalon.define({
        $id : vmId,
        pageTitle : "新建短信",
        pageState : 1,
        pageCount : 1,
        msgId : null,
        dict : {
            status : { "Y" : '启用', "N" : "禁用" },
            sendStatus : { "Y" : '已发送', "N" : "未发送", "I": '发送中', "W": '等待发送' },
            receiverFrom : { "1" : '活跃用户', "2": '有效用户', "3": '全部用户', "4": '指定用户' },
            hour : [],
            min : [],
            second : []
        },
        configData : null,
        templates : [], //模板列表
        templateSelectedIndex : null,
        selectedReceiveCount : 0, ///选中的用户数
        selectedReceiver : 1, ////选中的发送对象
        messageStatus : "Y", ///状态
        sendDateTime : "",///发送时间
        showEditModal : function(index){
            if(vm.pageState == 3) return;
            vm.templateSelectedIndex = index;
            ////////////////////////////////////////////////////////////////////////////生成content
            editModalContent.attr("template-index",index);
            var $currCheckBox = $("#templateListContainer>tr:eq("+index+")>td>div.checkbox");
            if(!$currCheckBox.hasClass("active")){
                $("#templateListContainer div.checkbox").removeClass("active");
                $currCheckBox.addClass("active");
            }
            var parts = vm.templates[index].templateParts;
            if(!vm.templates[index].templatePartsParam){
                setTemplateDefaultPartsParam(index);
            }
            var htmlStr = generateTemplateHtml(parts,vm.templates[index].templatePartsParam);
            editModalContent.html(htmlStr);
            var selectEleArr = editModalContent.find("select"), $this, paramName, selected;
            for(var k=0;k<selectEleArr.length;k++){
                if(selectEleArr[k]){
                    $this = $(selectEleArr[k]);
                    paramName = $this.attr("param");
                    if(linkFieldsObj[paramName]){
                        selected = $this.find("option:selected");
                        if(selected[0]) doHandlerOfChangeLink(selected[0],linkFieldsObj[paramName],paramName);
                    }
                }
            }
            editModal.show();
        },
        doClickBackBtn : function(){/////点击返回按钮
            if(!paramObj.id && vm.templateSelectedIndex != null && vm.templateSelectedIndex != "" ){
                $("#confirmSaveSendModal>div>h3").text("是否存为草稿");
                $("#confirmSaveSendModal>div>div.content").text("是否存为禁用的草稿，以方便下次修改及启用？").attr("type","save");
                $("#confirmSaveSendModal>div>div.footer>a:eq(0)").text("保存");
                $("#confirmSaveSendModal>div>div.footer>a:eq(1)").text("不保存");
                confirmModal.show();
            }
            else{
                location.href="#!/messageSell";
            }
        },
        doClickOKBtn : function(){///点击确定按钮
            if(vm.templateSelectedIndex==null){
                msgAlert("请选择短信模板！");
                return;
            }
            var formParam = getPageForm();
            if(formParam == null){
                msgAlert("请完善短信内容！");
                return;
            }

            if(inRequest) return;
            inRequest = true;

            //判断发送时间是否正确
            var sendTime = getSendTime(true);
            if ((new Date()).getTime() > sendTime && vm.messageStatus=="Y") { //弹窗提示选择一个未来时间
                $("#confirmSaveSendModal>div>h3").text("提示");
                $("#confirmSaveSendModal>div>div.content").text("发送时间错误，是否立即发送？").attr("type", "send");
                $("#confirmSaveSendModal>div>div.footer>a:eq(0)").text("发送");
                $("#confirmSaveSendModal>div>div.footer>a:eq(1)").text("不发送");
                confirmModal.show();
            }
            else { //////保存
                $.ajax({
                    url: "message/save",
                    data: formParam,
                    type: "post",
                    traditional: true,
                    success: function (res) {
                        inRequest = false;
                        msgAlert(res.msg, res.statusCode == 200);
                        if (res.statusCode == 200){
                            doHandlerAfterSave(formParam,res);
                        }
                    }
                });
            }
        },

        /////////////////////////////////////////////////////
        doRenderedOfTemplate : function(){///模板
            if(initObj.messageTemplateId){
                $("#templateListContainer tr[template-id="+initObj.messageTemplateId+"]").find("div.checkbox").addClass("active");//选择模板
                vm.templateSelectedIndex = $("#templateListContainer div.checkbox.active").parents("tr").attr("template-index");
                if(vm.templateSelectedIndex != null){
                    setTemplateDefaultPartsParam(vm.templateSelectedIndex);
                }
                delete initObj.messageTemplateId;
            }
        },
        doRenderedGroups : function(){////指定用户
            if(initObj.contactGroupIds){
                var checkBoxList = $("#groupsContainer>li"), k, tempObj = {}, groupsArr = initObj.contactGroupIds.split(",");
                for(k=0;k<groupsArr.length;k++) tempObj[groupsArr[k]] = true;
                var receiverNum = 0;
                for(k=0;k<checkBoxList.length;k++){
                    if(tempObj[checkBoxList[k].getAttribute("group-id")]){
                        checkBoxList[k].className = "active";
                        receiverNum += parseInt(checkBoxList[k].getAttribute("count"));
                    }
                }
                vm.selectedReceiveCount = receiverNum;//发送对象用户数
                delete initObj.contactGroupIds;
            }
        },
        doRenderedHour : function(){
            if(initObj.hour){
                $("#setTimeSelector>select:eq(0)").val(initObj.hour);
                delete initObj.hour;
            }
        },
        doRenderedMin : function(){
            if(initObj.min){
                $("#setTimeSelector>select:eq(1)").val(initObj.min);
                delete initObj.min;
            }
        },
        doRenderedSecond : function(){
            if(initObj.second){
                $("#setTimeSelector>select:eq(2)").val(initObj.second);
                delete initObj.second;
            }
        }
    });

    function setTemplateDefaultPartsParam(index){
        var parts = vm.templates[index].templateParts;
        var param = vm.templates[index].templatePartsParam = {};
        for(var i=0;i<parts.length;i++){
            if(/^#/.test(parts[i])){
                param[parts[i].substr(1)] = vm.configData.defaults[parts[i].substr(1)] || "";
            }
        }
        ///console.log("setTemplateDefaultPartsParam....."+JSON.stringify(param));
    }

    /////////////////////////格式化日期
    function formatDate(date){
        return date.getFullYear()+"-"+(date.getMonth()<9 ? "0" : "")+(date.getMonth()+1)+"-"+(date.getDate()<10 ? "0" : "")+date.getDate();
    }

    //////////////////////////////////////////////编辑短信内容modal
    editModal = new Modal($("#editMessageContentModal"),{
        doClickOkBtn : function(){
            var eleArr = editModalContent[0].children, str="", pIndex = editModalContent.attr("template-index"), pObj = vm.templates[pIndex].templatePartsParam, pName, selectOption;
            for(var i=0;i<eleArr.length;i++){
                pName = eleArr[i].getAttribute("param");
                if(pName){
                    if(eleArr[i].tagName.toLowerCase() != "a"){
                        str += eleArr[i].value;
                        if(eleArr[i].tagName.toLowerCase() == "select"){
                            selectOption = $(eleArr[i]).find("option:selected");
                            if(selectOption.length>0 && selectOption.attr("pCount")){
                                pObj[pName] = selectOption.text();
                            }
                        }
                        else pObj[pName] = eleArr[i].value;
                    }
                    else{
                        str += eleArr[i].innerHTML;
                        pObj[pName] = eleArr[i].innerHTML;
                    }
                    if(!pObj[pName]){
                        msgAlert("短信内容不完整！");
                        return;
                    }
                }
                else{
                    str += eleArr[i].innerHTML;
                }
            }
            vm.templates[pIndex].template = str;
            editModal.close();
        }
    });

    /////////////////////////////////////
    function generateTemplateHtml(tempObj,pObj){
        var j, htmlStr = "", k=0, m = 0, optionArr, currParam;
        //console.log("pObj："+JSON.stringify(pObj));
        for(j = 0;j<tempObj.length;j++){
            if(/^#/.test(tempObj[j])){
                currParam = tempObj[j].substr(1);
                if(vm.configData.dicts[currParam] != undefined){
                    htmlStr +="<select param='"+currParam+"'>";

                    ///////////////////////////////////先加提示的option
                    if(vm.configData.textTips[currParam]){
                        htmlStr += "<option "+( pObj[currParam] ? "" : "selected")+">"+vm.configData.textTips[currParam]+"</option>"
                    }
                    optionArr = vm.configData.dicts[currParam] || [];
                    if(optionArr){
                        for(k=0;k<optionArr.length;k++){
                            htmlStr += "<option pCount='"+optionArr[k].length+"'";
                            for(m=0;m<optionArr[k].length;m++){//属性
                                htmlStr += "p"+m+"='"+optionArr[k][m]+"' ";
                            }
                            htmlStr += ( optionArr[k][0]==pObj[currParam] ? "selected" : "" )+">"+optionArr[k][0]+"</option>"
                        }
                    }
                    htmlStr +="</select>";
                }
                else if(/^link/.test(currParam)){////匹配链接
                    htmlStr += "<a param='"+currParam+"' href='"+pObj[currParam]+"' target='_blank'>"+pObj[currParam]+"</a>";
                }
                else{//////其他输入框
                    htmlStr +="<input param='"+currParam+"' value='"+pObj[currParam]+"' maxlength='15' placeholder='"+(vm.configData.textTips[currParam] || "")+"'/>";
                }
            }
            else{
                htmlStr += "<span>"+tempObj[j]+"</span>";
            }
        }
        return htmlStr;
    }

    editModalContent.on("change","select",function(){
        var $this = $(this), paramName = $this.attr("param");
        if(linkFieldsObj[paramName]){
            var selected = $this.find("option:selected");
            if(selected[0]) doHandlerOfChangeLink(selected[0],linkFieldsObj[paramName],paramName);
        }
    });

    function doHandlerOfChangeLink(option,linkObj,paramName){
        //console.log("option："+JSON.stringify(option)+"\nlinkObj："+JSON.stringify(linkObj)+"\nparamName："+paramName);
        var linkEle = editModalContent.find("a[param='"+linkObj.associate+"']"), requestUrl = linkObj.requestUrl;
        var pCount = option.getAttribute("pCount"), k;
        if(pCount){
            pCount = parseInt(pCount);
            for(k=0;k<pCount;k++){
                requestUrl = requestUrl.replace("("+paramName+"["+k+"])",option.getAttribute("p"+k));
            }
            $.get(requestUrl,{ refresh : Date.now() }, function(res){
                if(res.statusCode == 200){
                    linkEle.attr("href",res.respData).html(res.respData);
                }
            },"json");
        }
        else{
            linkEle.attr("href","").html("");
        }
    }

    confirmModal = new Modal($("#confirmSaveSendModal"),{
        doClickOkBtn : function(){
            var type = $("#confirmSaveSendModal>div>div.content").attr("type");
            var formParam = getPageForm();
            if(formParam == null){
                msgAlert("请完善短信内容！");
                return;
            }
            if(type=="save"){///////////保存为草稿
                formParam.status = "N";
                $.ajax({
                    url: "message/save",
                    data: formParam,
                    type: "post",
                    traditional: true,
                    success: function (res) {
                        msgAlert(res.msg, res.statusCode == 200);
                        confirmModal.close();
                        if (res.statusCode == 200){
                            doHandlerAfterSave(formParam,res);
                        }
                    }
                });
            }
            else if(type=="send"){//////////////////////立即发送
                formParam.force = "Y";
                $.ajax({
                    url: "message/save",
                    data: formParam,
                    type: "post",
                    traditional: true,
                    success: function (res) {
                        msgAlert(res.msg, res.statusCode == 200);
                        confirmModal.close();
                        if (res.statusCode == 200){
                            doHandlerAfterSave(formParam,res);
                        }
                        inRequest = false;
                    }
                });
            }
        },
        doClickCancelBtn : function(){
            confirmModal.close();
            var type = $("#confirmSaveSendModal>div>div.content").attr("type");
            if(type=="save"){
                location.href = "#!/messageSell";
            }
        }
    });

    function doHandlerAfterSave(formParam,res){
        //console.log("doHandlerAfterSave---paramObj.id："+paramObj.id);
        if(paramObj.id){
            paramObj.id = vm.msgId = res.respData;
            location.href = "#!/messageSellDetail?id="+paramObj.id+"&editable=false";
            vm.pageState = 3;
            $$.currPath.html("<a href='#!/messageSell'>短信营销 >> 短信详情");
            vm.sendDateTime = formParam.sendTime;
            $("#templateListContainer>tr:eq("+vm.templateSelectedIndex+")").siblings().hide();
        }
        else location.href = "#!/messageSell";
    }

    function getSendTime(tag){
        var timeStr = $("#sendTime").val(), arr = timeStr.split("-"), time = new Date(), timeList = $("#setTimeSelector>select");
        time.setFullYear(arr[0]-0);
        time.setMonth(arr[1]-1);
        time.setDate(arr[2]-0);
        time.setHours(timeList[0].value-0);
        time.setMinutes(timeList[1].value-0);
        time.setSeconds(timeList[2].value-0);
        return (tag ? time : timeStr+" "+timeList[0].value+":"+timeList[1].value+":"+timeList[2].value)
    }

    function getPageForm(){
        //console.log("form params："+JSON.stringify(vm.templates[vm.templateSelectedIndex].templatePartsParam));
        var formObj = { force : 'N' };
        ///模板内容参数
        formObj.params = vm.templates[vm.templateSelectedIndex].templatePartsParam || {};
        //console.log("formObj.params："+JSON.stringify(formObj.params));
        for(var item in formObj.params){
            if(formObj.params[item] == null || formObj.params[item].length==0 ){
                return null;
            }
        }
        formObj.params = JSON.stringify(formObj.params);
        if(paramObj.id) formObj.messageId = paramObj.id;
        ///选择的短信模板
        formObj.messageTemplateId = vm.templates[vm.templateSelectedIndex].id;
        ////发送对象
        formObj.receiverFrom = vm.selectedReceiver;
        if(formObj.receiverFrom == 4){
            formObj.contactGroupIds = [];
            var selectedGroups = $("#groupsContainer>li.active"), k;
            for(k=0;k<selectedGroups.length;k++) {
                formObj.contactGroupIds.push(selectedGroups[k].getAttribute("group-id"));
            }
        }
        ///发送时间
        formObj.sendTime = getSendTime();
        ///状态
        formObj.status = vm.messageStatus;
        //console.log(formObj);
        return formObj;
    }

    ////////////////////////////////////////////////////////初始化页面代码
    //判断页面状态，新建、查看详情还是编辑
    if(paramObj.id){
        vm.msgId = paramObj.id;
        if(paramObj.editable=="false"){
            vm.pageState = 3;
            vm.pageTitle = "短信详情";
        }
        else{
            vm.pageState = 2;
            vm.pageTitle = "编辑短信";
        }
    }
    else{
        vm.pageState = 1;
        vm.pageTitle = "新建短信";
    }
    $$.currPath.html("营销中心 >> <a href='#!/messageSell'>短信营销 >> "+vm.pageTitle);

    if(vm.pageState != 3){
        ////////////////////////////////////////////////////构造时分秒
        var hour = [], min = [], second = [];
        for(var i=0;i<60;i++){
            if(i<24) hour.push((i<10 ? "0" : "")+i);
            min.push((i<10 ? "0" : "")+i);
            second.push((i<10 ? "0" : "")+i);
        }
        vm.dict.hour = hour;
        vm.dict.min = min;
        vm.dict.second = second;

        /////////////////////////////////////选择短信发送对象
        $("#groupsContainer").on("click","li",function(){
            var $this = $(this);
            $this.hasClass("active") ? $this.removeClass("active") : $this.addClass("active");
            var checkedArr = $("#groupsContainer>li.active"), k, totalCount=0;
            for(k=0;k<checkedArr.length;k++){
                totalCount += parseInt(checkedArr[k].getAttribute("count"));
            }
            vm.selectedReceiveCount = totalCount;
        });
        $sendObjSelectorUsers.click(function(){
            var $this = $(this);
            if(!$this.hasClass("active")){
                $sendObjSelectorUsers.removeClass("active");
                $this.addClass("active");
                vm.selectedReceiver = $this.attr("receiver");
                if(typeof($this.attr("count")) != "undefined"){
                    vm.selectedReceiveCount = $this.attr("count");
                    $("#groupsContainer>li").removeClass("active");
                }
                else{
                    var checkedArr = $this.find("ul>li.active"), k, totalCount=0;
                    for(k=0;k<checkedArr.length;k++){
                        totalCount += parseInt(checkedArr[k].getAttribute("count"));
                    }
                    vm.selectedReceiveCount = totalCount;
                }
            }
        });

        ////////////////////////////////////////////设置状态
        $("#setStatusSelector>div").click(function(){
            var $this = $(this);
            if($this.hasClass("active")){
                $this.removeClass("active");
                vm.messageStatus = "N";
            }
            else{
                $this.addClass("active");
                vm.messageStatus = "Y";
            }
        });

        ////////////////////////////////////////////查询初始化数据
        var requestParamObj = { };
        if(paramObj.id) requestParamObj.messageId = paramObj.id;
        $.ajax({
            url : "message/edit",
            data : requestParamObj,
            success : function(res){
                if(res.statusCode == 200){
                    res = res.respData;
                    /////////linkFieldsObj
                    if(res.linkageFields){
                        var item, itemStr, itemParamArr;
                        for(item in res.linkageFields){
                            itemStr = res.linkageFields[item];
                            if(itemStr){
                                itemParamArr = itemStr.split(">=");
                                itemParamArr[0] = itemParamArr[0].slice(1,-1);
                                linkFieldsObj[itemParamArr[0]] = { "associate" : item, "requestUrl" : itemParamArr[1] };
                            }
                        }
                    }
                    //console.log("linkFieldsObj："+JSON.stringify(linkFieldsObj));
                    vm.configData = res;
                    vm.templates = res.templates;

                    ////////////////////////////////////////////////////////////////////////////////////
                    var sendDateStr, initDate = new Date();
                    if(!paramObj.id){/////新建短信的情况下
                        $("#sendObjSelector>table>tbody td:eq(0)").addClass("active");//发送对象默认为活跃用户
                        vm.selectedReceiveCount = res.counts["1"];
                        //$("#templateListContainer div.checkbox:eq(0)").addClass("active");//默认选择模板一
                        vm.templateSelectedIndex = null;
                    }
                    else{ ////编辑状态下
                        initObj.messageTemplateId = res.message.messageTemplateId;

                        //$("#templateListContainer tr[template-id="+res.message.messageTemplateId+"]").find("div.checkbox").addClass("active");//选择模板
                        //vm.templateSelectedIndex = $("#templateListContainer div.checkbox.active").parents("tr").attr("template-index");
                        $("#sendObjSelector>table>tbody td:eq("+(res.message.receiverFrom-1)+")").addClass("active"); //发送对象
                        vm.selectedReceiver = res.message.receiverFrom;

                        if(res.message.receiverFrom==4){//勾选checkbox
                            initObj.contactGroupIds = res.message.contactGroupIds;

                            /*var checkBoxList = $("#groupsContainer>li"), k, tempObj = {}, groupsArr = res.message.contactGroupIds.split(",");
                            for(k=0;k<groupsArr.length;k++) tempObj[groupsArr[k]] = true;
                            res.message.receiverNum = 0;
                            for(k=0;k<checkBoxList.length;k++){
                                if(tempObj[checkBoxList[k].getAttribute("group-id")]){
                                    checkBoxList[k].className = "active";
                                    res.message.receiverNum += parseInt(checkBoxList[k].getAttribute("count"));
                                }
                            }*/
                        }
                        vm.selectedReceiveCount = res.message.receiverNum;//发送对象用户数

                        //时间
                        sendDateStr = res.message.sendTime.split(" ");
                        var tArr = sendDateStr[0].split("-");
                        sendDateStr = sendDateStr[0];
                        initDate.setFullYear(tArr[0]-0);
                        initDate.setMonth(tArr[1]-1);
                        initDate.setDate(tArr[2]-0);
                    }
                    $("#sendTime").val(sendDateStr || formatDate(new Date()));
                    $("#sendTime").daterangepicker({
                        singleDatePicker : true,
                        timePicker: false,
                        startDate : initDate,
                        locale: { format : "YYYY-MM-DD", separator: " - " }
                    });

                    /////////////////////设置模板参数
                    if(vm.templateSelectedIndex) initObj.templateSelectedIndex = vm.templateSelectedIndex;
                    //if(vm.templateSelectedIndex) setTemplateDefaultPartsParam(vm.templateSelectedIndex);

                    if(paramObj.id){
                        tArr = res.message.sendTime.split(" ")[1].split(":");
                        initObj.hour = tArr[0];
                        initObj.min = tArr[1];
                        initObj.second = tArr[2];
                        ///$("#setTimeSelector>select:eq(0)").val(tArr[0]);
                        ////$("#setTimeSelector>select:eq(1)").val(tArr[1]);
                        /////$("#setTimeSelector>select:eq(2)").val(tArr[2]);
                        vm.messageStatus = res.message.status;//状态
                    }

                    //////////////////////////////////////////////////////////////////////////////////
                    avalon.scan(thisPage[0]);
                }
                else{
                    msgAlert(res.msg || "数据查询失败！");
                    setTimeout(function(){ location.href="#!/messageSell" },2000);
                }
            }
        });
    }
    else{
        $.ajax({
            url : "message/get/"+paramObj.id,
            success : function(res){
                if(res.statusCode == 200){
                    res = res.respData;
                    vm.templates.push(res.template);
                    vm.sendDateTime = res.message.sendTime;
                    vm.selectedReceiver = res.message.receiverFrom;
                    vm.selectedReceiveCount = res.message.receiverNum;
                    avalon.scan(thisPage[0]);
                    $("#templateListContainer").find("div.checkbox").addClass("active");//选择模板
                }
                else{
                    msgAlert(res.msg || "详情数据查询失败！");
                }
            }
        });
    }
});