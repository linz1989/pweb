require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"amap","qrcode","cropper","jqform","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        changePwCurrPw = $("#changePw-currPw"),
        changePwNewPw = $("#changePw-newPw"),
        changePwRepeatNewPw = $("#changePw-repeatNewPw"),
        changePwModal,
        clubInfoModal,
        emailOfClubInfo = $("div#clubInfoModal>div>div.content>div.email"),
        clubInfoName = $("#clubInfo-name"),
        clubInfoContacts = $("#clubInfo-contacts"),
        clubInfoMobilePhone = $("#clubInfo-mobilePhone"),
        clubInfoTelephone = $("#clubInfo-telephone"),
        clubInfoEmail = $("#clubInfo-email"),
        clubInfoAddress = $("#clubInfo-address"),
        clubLocModal,
        thisAMap,
        editLogoModal,
        imagePreview,
        editLogoModalContent = $("#editLogoModal>div>div.content");

    var $autoComInput = $('#locSearch'),$autoComResult = $('#autoSearchRes');

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("<a href='#!/home'>资料设置</a> >> 会所资料");

    var vm = avalon.define({
        $id : vmId,
        info : {},
        currTelCount : 0,
        clubAddress : "",
        doChangePw : function(){
            changePwCurrPw.val("");
            changePwNewPw.val("");
            changePwRepeatNewPw.val("");
            changePwModal.show();
        },
        doEditClubInfo : function(){
            $("div#clubInfoModal>div>div.content>div.del").remove();
            clubInfoName.val(vm.info.club.name);
            clubInfoContacts.val(vm.info.club.contacts);
            clubInfoMobilePhone.val(vm.info.club.mobilePhone);
            clubInfoEmail.val(vm.info.club.email);
            clubInfoAddress.val(vm.info.club.address);
            $("#clubInfo-lngx").val(vm.info.club.lngx);
            $("#clubInfo-laty").val(vm.info.club.laty);
            //////客服电话
            var telArr = vm.info.club.telephone.split(",") || [];
            vm.currTelCount = telArr.length;
            if(telArr.length !=0){
                clubInfoTelephone.val(telArr[0]);
                if(telArr.length>1){
                    for(var i=1;i<telArr.length;i++){
                        $("<div class='tel del'><label></label><input type='text' value='"+telArr[i]+"' maxlength='15' placeholder='请输入客服电话'/><i></i></div>").insertBefore(emailOfClubInfo);
                    }
                }
            }
            else{
                clubInfoTelephone.val("");
            }
            clubInfoModal.show();
        },
        doLocMap : function(){
            clubLocModal.show();
        },
        doClickEditLogo : function(){
            if(vm.info.club.imageUrl){
                imagePreview.load(vm.info.club.imageUrl,{
                    autoCropArea : 1, disabled : true
                });
            }
            editLogoModal.show();
        }
    });

    /////////////////////////////////////////////////点击修改密码
    changePwModal = new Modal($("#changePwModal"),{
            doClickOkBtn : function(){
                if(checkChangePwFormValidate()){
                    changePwModal.loading();
                    $.ajax({
                        url : "profile/password/update",
                        type : "post",
                        data : { password : changePwCurrPw.val() , plainPassword : changePwNewPw.val() },
                        success : function(res){
                            if(res.statusCode == 200){
                                changePwModal.close();
                                msgAlert(res.msg,true);
                            }
                            else{
                                changePwModal.showTip(res.msg);
                            }
                        },
                        complete : function(xhr){
                            changePwModal.loading("hide");
                            if(xhr.status == 200){
                                changePwModal.close();
                                msgAlert("账号密码修改成功！",true);
                            }
                            else if(xhr.status == 400){
                                changePwModal.showTip(xhr.responseText);
                            }
                        }
                    });
                }
            }
        });

    $("#changePwModal>div>div.content").on("input","div>input",function(){
        if(this.value.length>30) this.value = this.value.substr(0,30);
        if(/\s/.test(this.value)) this.value = this.value.replace(/\s/g,"");
    }).on("keypress","div>input",function(event){
        if(event.keyCode==13){
            $("#changePwModal>div>div.footer>a:eq(0)").click();
        }
    });

    function checkChangePwFormValidate(){
        if(!changePwCurrPw.val()){
            changePwCurrPw.focus();
            changePwModal.showTip("请输入当前密码！");
            return false;
        }
        if(!changePwNewPw.val()){
            changePwNewPw.focus();
            changePwModal.showTip("请输入新的密码！");
            return false;
        }
        if(!changePwRepeatNewPw.val()){
            changePwRepeatNewPw.focus();
            changePwModal.showTip("请再次输入新密码！");
            return false;
        }
        if(changePwRepeatNewPw.val() != changePwNewPw.val()){
            changePwRepeatNewPw.focus();
            changePwModal.showTip("两次输入的新密码不一致！");
            return false;
        }
        return true;
    }
    //////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////修改会所资料
    clubInfoModal = new Modal($("#clubInfoModal"),{
        doClickOkBtn : function(){
            if(checkClubInfoForm()){
                clubInfoModal.loading();
                $.ajax({
                    url : "profile/club/update",
                    type : "post",
                    data : {
                        name : clubInfoName.val(),
                        contacts : clubInfoContacts.val(),
                        mobilePhone : clubInfoMobilePhone.val(),
                        email : clubInfoEmail.val(),
                        address : clubInfoAddress.val(),
                        lngx : $("#clubInfo-lngx").val(),
                        laty : $("#clubInfo-laty").val(),
                        telephone : getTelArr().join(",")
                    },
                    success : function(res){
                        clubInfoModal.loading("hide");
                        if(res.statusCode == 200){
                            clubInfoModal.close();
                            msgAlert(res.msg,true);
                            //////////////////////////////
                            vm.info.club.name = clubInfoName.val();
                            vm.info.club.contacts = clubInfoContacts.val();
                            vm.info.club.mobilePhone = clubInfoMobilePhone.val();
                            vm.info.club.email = clubInfoEmail.val();
                            vm.info.club.address = clubInfoAddress.val();
                            vm.info.club.lngx = $("#clubInfo-lngx").val();
                            vm.info.club.laty = $("#clubInfo-laty").val();
                            vm.info.club.telephone = getTelArr().join(",");
                        }
                        else{
                            clubInfoModal.showTip(res.msg || "操作失败！");
                        }
                    }
                });
            }
        }
    });

    function checkClubInfoForm(){
        if(!clubInfoName.val()){
            clubInfoModal.showTip("请输入会所名称！");
            clubInfoName.focus();
            return false;
        }
        if(clubInfoMobilePhone.val() && !/^1[34578]\d{9}$/.test(clubInfoMobilePhone.val()) ){
            clubInfoModal.showTip("请输入正确的手机号码！");
            clubInfoMobilePhone.focus();
            return false;
        }
        if(clubInfoEmail.val() && !/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(clubInfoEmail.val())){
            clubInfoModal.showTip("请输入正确的电子邮箱！");
            clubInfoEmail.focus();
            return false;
        }
        return true;
    }

    function getTelArr(){
        var arr = [], k, list = $("#clubInfoModal>div>div.content>div.tel>input");
        for(k=0;k<list.length;k++){
            if(list[k].value){
                arr.push(list[k].value);
            }
        }
        return arr;
    }

    $("#clubInfoModal>div>div.content").on("click","div.del>i",function(){//////删除客服电话
        $(this).parents("div.tel").remove();
        vm.currTelCount = vm.currTelCount-1;
    });

    $("#clubInfoModal>div>div.content").on("click","div.plus>i",function(){//////增加客服电话
        $("<div class='tel del'><label></label><input type='text' maxlength='15' placeholder='请输入客服电话'/><i></i></div>").insertBefore(emailOfClubInfo);
        vm.currTelCount = vm.currTelCount+1;
    });

    ///////////////////////////输入限制
    clubInfoMobilePhone.on("input",function(){
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
    $("#clubInfoModal>div>div.content").on("input","div.tel>input",function(){
        if(/[^-|\d]/.test(this.value)){
            this.value = this.value.replace(/[^-|\d]/g, '');
        }
        if (this.value.length > 15) {
            this.value = this.value.substring(0, 15);
        }
    });

    ////////////////////////////////////////clubLocModal
    clubLocModal = new Modal($("#clubLocModal"),{
        doClickOkBtn : function(){
            $("#clubInfo-lngx").val($("#map-lngx").val());
            $("#clubInfo-laty").val($("#map-laty").val());
            clubInfoAddress.val(vm.clubAddress);
            clubLocModal.close();
        }
    });

    $("#club-logo")[0].onerror = function(){
        this.src = "club-admin/img/common/clubLogo.jpg";
    };

    ///////////////////////////////////////////////初始化地图
    function initMap(){
        var waitAMpaInit = setInterval(function(){
            if(AMap && AMap.LngLat){
                clearInterval(waitAMpaInit);
                /////////////////////////地图对象
                vm.clubAddress = vm.info.club.address;
                var mapInitObj = {
                    zoom:15 //地图显示的缩放级别
                };
                if(vm.info.club.laty && vm.info.club.lngx){
                    $("#map-lngx").val(vm.info.club.lngx);
                    $("#map-laty").val(vm.info.club.laty);
                    mapInitObj.center = new AMap.LngLat(vm.info.club.lngx,vm.info.club.laty);
                }
                thisAMap = new AMap.Map("loc-map", {
                    resizeEnable: true,
                    view: new AMap.View2D(mapInitObj),
                    isHotspot: true//加载热点
                });

                if(vm.info.club.laty && vm.info.club.lngx){
                    AMap.event.addListener(thisAMap,'complete',function(){
                        var marker = new AMap.Marker({
                            position: new AMap.LngLat(vm.info.club.lngx,vm.info.club.laty),
                            offset: new AMap.Pixel(-10,-34),
                            icon: "./img/common/mark_bs.png"
                        });
                        marker.setMap(thisAMap);
                    });
                }

                //点击热点获取经纬度
                AMap.event.addListener(thisAMap, 'click', function(e){
                    $('.amap-icon').remove();
                    //获取地址
                    showMapAddress([e.lnglat.getLng(), e.lnglat.getLat()]);

                    //实例化信息窗体
                    new AMap.InfoWindow({
                        isCustom: true,  //使用自定义窗体
                        autoMove: false,
                        content:'<img src="./img/common/mark_bs.png" />', //信息窗体显示内容
                        offset:new AMap.Pixel(0, 8) //设置偏移量
                    }).open(thisAMap, e.lnglat);
                });

                //自动搜索
                var autoComplete;
                thisAMap.plugin(["AMap.Autocomplete"], function() {
                    AMap.event.addDomListener($autoComInput[0], 'input', function () {
                        var keywords = $autoComInput.val();
                        if(!keywords){
                            $autoComResult.hide();
                        }
                        else{
                            autoComplete = new AMap.Autocomplete({
                                pageIndex : 1,
                                pageSize : 10,
                                city : "" //城市，默认全国
                            });
                            //查询成功时返回查询结果
                            AMap.event.addListener(autoComplete, "complete", autoSearchCallback);
                            autoComplete.search(keywords);
                        }
                    });
                });

                $autoComResult.on('click','div', function (){ //截取输入提示的关键字部分
                    var text = this.innerHTML.replace(/<[^>].*?>.*<\/[^>].*?>/g,"");
                    $autoComInput.val(text);
                    //根据选择的输入提示关键字查询
                    thisAMap.plugin(["AMap.PlaceSearch"], function() {
                        var mapSearch = new AMap.PlaceSearch();  //构造地点查询类
                        AMap.event.addListener(mapSearch, "complete", searchCallback); //查询成功时的回调函数
                        mapSearch.search(text);  //关键字查询查询
                    });
                    $autoComResult.hide();
                });
            }
        },100);
    }

    function showMapAddress(locArr){
        $("#map-lngx").val(locArr[0]);
        $("#map-laty").val(locArr[1]);
        new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        }).getAddress(locArr, function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                $("#format-address").val(result.regeocode.formattedAddress);
                vm.clubAddress = result.regeocode.formattedAddress;
            }
        });
    }

    function autoSearchCallback(data){
        var resultStr = "", tipArr = [];
        if(!data.tips) return;
        tipArr = data.tips;
        if (tipArr.length>0) {
            for (var i = 0; i < tipArr.length; i++) {
                resultStr += "<div >" + tipArr[i].name + "<span>"+ tipArr[i].district + "</span></div>";
            }
        }
        else  {
            resultStr = "无搜索结果，请重新输入!";
        }
        $autoComResult[0].innerHTML = resultStr;
        $autoComResult.show();
    }

    function searchCallback(data){
        thisAMap.clearMap();
        var poiArr = data.poiList.pois;
        poiArr.forEach(function (d,i) {
            var lngX, latY;
            if(d.location){
                lngX = d.location.getLng();
                latY = d.location.getLat();
            }else{
                lngX = d._location.getLng();
                latY = d._location.getLat();
            }
            var markerOption = {
                map: thisAMap,
                icon:"http://webapi.amap.com/images/" + (i + 1) + ".png",
                position:new AMap.LngLat(lngX, latY)
            };
            var mar = new AMap.Marker(markerOption);
            AMap.event.addListener(mar, "click", function (e){
                showMapAddress([lngX, latY]);
            });
        });
        if(poiArr[0]) thisAMap.setZoomAndCenter(16,[poiArr[0].location.getLng(),poiArr[0].location.getLat()]);
    }

    ////////////////////////////////////////////////////////////////编辑会所logo图片
    editLogoModal = new Modal($("#editLogoModal"),{
        doClickOkBtn : function(){
            if($("#clubLogoForm>div>img")[0] && $("#clubLogoForm>div>img")[0].width !=0){
                if(!$("#uploadImgBtn")[0].files[0]){
                    editLogoModal.close();
                }
                else{
                    var checkRes = imagePreview.checkSelectionValidate();
                    if(checkRes != "OK"){
                        editLogoModal.showTip(checkRes);
                        return;
                    }
                    editLogoModal.loading();
                    $("#clubLogoForm").ajaxSubmit({
                        dataType:  'json',
                        success : function(res){
                            if(res && res.avatarUrl){
                                $("#club-logo")[0].src = res.avatarUrl;
                                $("header>div.logo>img")[0].src = res.avatarUrl;
                                vm.info.club.imageUrl = res.avatarUrl;
                                editLogoModal.close();
                                msgAlert("修改成功！",true);
                            }
                            else{
                                editLogoModal.showTip(res.msg || res.message || "修改失败！");
                            }
                        },
                        complete : function(xhr){
                            editLogoModal.loading("hide");
                            if(xhr.status == 400){
                                editLogoModal.showTip("您选择的裁剪区域过大！请通过鼠标缩小区域！");
                            }
                        }
                    });
                }
            }
            else{
                editLogoModal.showTip("请您上传图片！");
            }
        }
    });

    imagePreview = new iCropper({
        imgFile : $("#uploadImgBtn")[0],
        img : $("#clubLogoForm>div>img")[0],
        selectionTxt : $("#clubLogoForm>div>span.selectionTxt")[0],
        imgName : $("#imgFileName")[0],
        maxWidth : 580,
        maxHeight : 300,
        x : $("#x")[0],
        y : $("#y")[0],
        w : $("#w")[0],
        h : $("#h")[0],
        imgWidth : 168,
        imgHeight : 168,
        onImgLoad : function(){
            if(!editLogoModalContent.hasClass("hasImg")){
                editLogoModalContent.addClass("hasImg");
            }
        }
    });

    $.ajax({
        url : "profile/data",
        success : function(res){
            if(res.statusCode == 200){
                vm.info = res.respData;
                $("#club-logo")[0].src = res.respData.club.imageUrl || "";
                avalon.scan(thisPage[0]);

                if(vm.info.club.indexQrcodeUrl && /^http/.test(vm.info.club.indexQrcodeUrl)){
                    $("#club-qrcode-img")[0].src = vm.info.club.indexQrcodeUrl;
                }
                else{
                    $.ajax({
                        url : "club/get/qrcode",
                        type : "post",
                        success : function(qrRes){
                            if(qrRes.statusCode==200) $("#club-qrcode-img")[0].src = qrRes.respData;
                        }
                    });
                }

                /////获取客人注册二维码
                $.ajax({
                    url : "api/v1/wx/club/param_qrcode",
                    data : {
                        clubId : res.respData.club.clubId
                    },
                    success : function(imgRes){
                        if(imgRes.statusCode == 200){
                            $("#registeredQrCode")[0].src = imgRes.respData;
                        }
                    }
                });
                initMap();
            }
        }
    });

    //===== 生成扫码支付的二维码 ====
    $('#qrPayCode').qrcode({
        width:430,
        height:430,
        text:location.origin+(location.pathname.split(';')[0]+'spa2/?#qrPay&clubId='+ $$.clubId),
        roundBlank:true         //四周是否留白
    })
});