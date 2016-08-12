require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        rawData = [],
        confirmModal,
        confirmModalEle = $("#confirmModal"),
        confirmModalContent = $("#confirmModal>div>div.content"),
        qrCodeModal,
        qrCodeModalImg = $("#qrCodeModal>div>div.content>img");

    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("营销中心 >> 优惠券");

    var vm = avalon.define({
        $id : vmId,
        dataList : [],
        statusObj : [{"name":"全部状态","value":""},{"name":"使用中","value":"online"},{"name":"未上线","value":"not_online"},
            {"name":"已下线","value":"downline_can_use"},{"name":"已过期","value":"ne_lose_efficacy"},{"name":"已失效","value":"disable"}],
        currStatus : "",
        doChangeStatus : function(){//////筛选状态数据列表
            vm.currStatus = this.value;
            filterList();
        },
        showQrCode : function(qrCodeUrl,actId){////预览二维码
            if(!qrCodeUrl){
                $.ajax({
                    url : "act/qrcode",
                    data : { id : actId },
                    success : function(res){
                        if(res.statusCode == 200){
                            qrCodeModalImg[0].src = res.respData;
                            qrCodeModal.show();
                        }
                        else{
                            msgAlert("未能成功生成二维码！");
                        }
                    }
                });
            }
            else{
                qrCodeModalImg[0].src = qrCodeUrl;
                qrCodeModal.show();
            }
        },
        doChangeCouponStatus : function(actId,actType,opeType){/////上线\删除\下线操作
            var opeTypeName = (opeType=="online" ? "上线" : (opeType=="delete" ? "删除" : "下线"));
            confirmModalEle.attr("opeType",opeType);
            confirmModalEle.attr("actId",actId);
            confirmModalEle.attr("actType",actType);
            confirmModalContent.text("确定要"+opeTypeName+"此优惠券？");
            confirmModal.show();
        },
        doCopyCoupon : function(actId,actType){////复制操作
            $.ajax({
                url : "act/copy",
                data : { id : actId, operator : "copy", actType : actType },
                success : function(res){
                    if(res.statusCode == 200){
                        msgAlert(res.msg,true);
                        queryData();
                    }
                    else{
                        msgAlert(res.msg || "操作失败！");
                    }
                }
            });
        },
        doHandlerPopCoupon : function(actId){////处理弹窗
            $.ajax({
                url : "act/assigned_index",
                data : { id : actId },
                success : function(res){
                    if(res.statusCode == 200){
                        msgAlert(res.msg,true);
                        queryData();
                    }
                    else{
                        msgAlert(res.msg || "操作失败！");
                    }
                }
            });
        }
    });

    function filterList(){
        if(vm.currStatus == "") vm.dataList = rawData;
        else{
            var filterData = [];
            for(var i=0;i<rawData.length;i++){
                if(rawData[i]["actStatus"] == vm.currStatus){
                    filterData.push(rawData[i]);
                }
                vm.dataList = filterData;
            }
        }
    }

    confirmModal = new Modal(confirmModalEle,{
        doClickOkBtn : function(){
            confirmModal.close();
            $.ajax({
                url : "act/modify",
                data : { actId : confirmModalEle.attr("actId"), operator : confirmModalEle.attr("opeType") , actType : confirmModalEle.attr("actType") },
                success : function(res){
                    if(res.statusCode == 200){
                        msgAlert(res.msg,true);
                        queryData();
                    }
                    else{
                        msgAlert(res.msg || "操作失败！");
                    }
                }
            });
        }
    });

    qrCodeModal = new Modal($("#qrCodeModal"));

    function queryData(){
        $.ajax({
            url : "act/list",
            success : function(res){
                if(res.statusCode == 200){
                    res = res.respData;
                    rawData = res.coupons || [];
                    filterList();
                    avalon.scan(thisPage[0]);
                }
            }
        });
    }

    queryData();
});