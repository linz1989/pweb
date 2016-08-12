String.prototype.trim=function() {
    return this.replace(/(^\s*)|(\s*$)/g,'');
};

//////////////////////////////Modal
function Modal(ele,option){
    this.ele = ele;
    this.option = option = option || {};

    var thisModel = this;
    var closeTag = this.ele.find("div>h3.header>span"),
        cancelBtn = this.ele.find("div>div.footer>a.cancel"),
        okBtn = this.ele.find("div>div.footer>a.ok");
    if(closeTag[0]){
        closeTag.click(function(){ thisModel.close() });
    }
    if(okBtn[0] && option.doClickOkBtn){
        okBtn.click(function(){
            option.doClickOkBtn();
        });
    }
    if(cancelBtn[0]){
        if(option.doClickCancelBtn){
            cancelBtn.click(function(){
                option.doClickCancelBtn();
            });
        }
        else cancelBtn.click(function(){ thisModel.close() });
    }

    this.tip = this.ele.find("div>div.footer>span.tip");
    this.ele.children("div").append("<div class='mask'><div><i></i><i></i><i></i><i></i><i></i></div></div>");
}
Modal.prototype.show = function(str){
    if(str) this.ele.find("div>div.content").html(str);
    this.ele.css("display","block");
    this.ele.removeClass("loading");
    var ele = this.ele;
    setTimeout(function(){
        ele.addClass("active");
    },30);
};
Modal.prototype.close = function(){
    this.ele.removeClass("active");
    var ele = this.ele;
    setTimeout(function(){
        ele.css("display","none");
    },500);
    if(this.option.afterClose) this.option.afterClose();
};
Modal.prototype.loading = function(type){
    type = type || "show";
    if(type=="show") this.ele.addClass("loading");
    else this.ele.removeClass("loading");
};
Modal.prototype.showTip = function(tipStr,isOk){
    if(this.tip && this.tip[0]){
        if(tipStr) this.tip.text(tipStr);
        isOk===true ? this.tip.addClass("ok") : this.tip.removeClass("ok");
        this.tip.show();
        var tipEle = this.tip;
        setTimeout(function(){ tipEle.hide() },3000)
    }
};
Modal.prototype.hideClose = function(){
    this.ele.find("div>h3.header>span").hide();
};

//////////////////////////////////////////////////Pagination
function Pagination(ele,option){
    this.ele = ele;
    this.option = option || {};
    this.pages = ele.children("div.pages");
    var pagObj = this;
    pagObj.pages.on("click","a",function(){
        if(!/disable/.test(this.className) && this.innerHTML != "..."){
            var gotoPage = 1;
            if(!/curr/.test(this.className)){
                if(/prev/.test(this.className)){
                    gotoPage = pagObj.currPage-1;
                }
                else if(/next/.test(this.className)){
                    gotoPage = pagObj.currPage+1;
                }
                else{
                    gotoPage = parseInt(this.innerHTML);
                }
                pagObj.option.switchPage(gotoPage);
            }
        }
    })
}
Pagination.prototype.refresh = function(option){
    this.currPage = option.currPage;
    this.totalPage = option.totalPage;
    var hasPrev = (option.currPage != 1), hasNext = (option.currPage != option.totalPage);
    var htmlStr = "<a class='prev"+(hasPrev ? "" : " disable")+"'><<</a>";
    var i;
    if(option.totalPage<=7){
        for(i=1;i<=option.totalPage;i++){
            htmlStr += "<a"+(i==this.currPage ? " class='curr'" : "")+">"+i+"</a>"
        }
    }
    else{
        var posArr = [1,,,,,,option.totalPage], leftVal = option.currPage-1, rightVal = option.currPage+1;
        if(leftVal<3){
            for(i=1;i<=4;i++) posArr[i] = i+1;
            posArr[5] = "...";
        }
        else if(option.totalPage-rightVal<3){
            for(i=5;i>=2;i--) posArr[i] = posArr[i+1]-1;
            posArr[1]="...";
        }
        else{
            posArr[1] = "...";
            posArr[2] = leftVal;
            posArr[3] = option.currPage;
            posArr[4] = rightVal;
            posArr[5] = "...";
        }
        for(i=0;i<posArr.length;i++){
            htmlStr +="<a"+(posArr[i]==option.currPage ? " class='curr'" : "")+">"+posArr[i]+"</a>";
        }
    }
    htmlStr +="<a class='next"+(hasNext ? "" : " disable")+"'>>></a>";
    this.pages.html(htmlStr);
};

//////////////////////////////////////////获取页面链接参数
function getParamObj(p){
    var paramObj = {}, pArr = location.href.split("?")[1];
    if(pArr){
        pArr = pArr.split("&");
        var i, tArr;
        for(i = 0;i<pArr.length;i++){
            tArr = pArr[i].split("=");
            if(tArr.length == 2){
                paramObj[tArr[0]] = tArr[1];
            }
        }
    }
    return p ? paramObj[p] : paramObj;
}

function formatDateRangeVal(str){
    var arr = str.split(" - ");
    arr[0] = arr[0] || "";
    arr[1] = arr[1] || "";
    arr[0] = arr[0].slice(0,-1).replace(/(年|月)/g,"-");
    arr[1] = arr[1].slice(0,-1).replace(/(年|月)/g,"-");
    return { start : arr[0] , end : arr[1] }
}

function formatDate(d){
    var  month = d.getMonth()+1, day = d.getDate(),
        hour = d.getHours(), min = d.getMinutes(), sec = d.getSeconds();
    hour = (hour > 9 ? hour : '0' + hour), min = (min > 9 ? min : '0' + min), sec = (sec < 10 ? '0' + sec : sec);
    return d.getFullYear() + '-' + (month < 9 ? '0' + month : month) + '-' + (day < 9 ? '0' + day : day) +" "+ hour + ':' + min + ':' + sec;
}

//////全局的提示，延时time之后消失
function msgAlert(msg,tag,time){
    time = time || 2000;
    tag = (tag ? "success" : "fail" );
    var $box = $('<div class="msgBox"><span><span class="' + tag + '"></span>'+msg+'<span class="end"></span></span></div>');
    $("body").append($box);
    $box.show(0);
    setTimeout(function(){ $box.remove() },time)
}

///////////////////////////////////////////图表的更新
$.fn.updateChart = function(option) {
    option = option || {};
    option = $.extend(true,{
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        width: ['1px'],
        exporting: {
            enabled: false
        },
        credits: {
            enabled: false // 禁用版权信息
        }
    },option);

    var chartObj = $(this).highcharts();
    if(!chartObj){
        $(this).highcharts(option);
    }
    else{
        chartObj.xAxis[0].update(option.xAxis);
        var series=chartObj.series;
        while(series.length > 0) {
            series[0].remove(false);
        }
        for(var i=0;i<option.series.length;i++){
            chartObj.addSeries(option.series[i],false);
        }
        chartObj.redraw();
    }
};

function inArr(item,arr,pop){
    for(var i=0;i<arr.length;i++){
        if(pop){
            if(arr[i][pop]==item) return true;
        }
        else if(arr[i]==item) return true;
    }
    return false;
}

///////////////////////////////////////////////////iCropper
function iCropper(option){
    option = option || {};
    this.option = option; ////this.option.imgFile
    this.cropper = null;
    this.cropperStatus = "enable";
    this.hasCrop = true;////是否有选框的标志
    this.loadOption = {};/////load参数
    if(!this.option.imgFile){
        console.log("iCropper --- 选项中不存在imgFile!");
        return ;
    }
    this.option.maxSize = option.maxSize || 10240;/////图片文件的最大大小,默认10M
    this.option.fileNameMaxLength = option.fileNameMaxLength || 50;//////图片文件名的最大宽度
    this.option.ratioW = this.option.ratioW || 1; ////裁剪的宽高比
    this.option.ratioH = this.option.ratioH || 1;
    this.option.$img = $(this.option.img);

    ///////////////x、y、w、h、imgName ----input 隐藏域
    //////////////img  ----图片元素 imgId---image ID对应的
    //////////////maxWidth maxHeight
    /////////////onImgLoad

    var thisObj = this, thisOption = this.option;
    window.URL = window.URL || window.webkitURL;

    $(thisOption.imgFile).on("change",function(){
        if(thisOption.imgFile.files[0]){
            var filePath = thisOption.imgFile.value,
                dotIndex = filePath.lastIndexOf("."),
                fileExt = filePath.substr(dotIndex+1).toLowerCase(),
                subName = filePath.substr(0,dotIndex).toLowerCase();

            if(!/^(jpg|png|jpeg)$/.test(fileExt)){
                thisOption.imgFile.value = "";
                thisOption.imgName.value = "";
                msgAlert("请上传后缀名为jpg或png的照片！");
                return false;
            }
            if(subName.length>=thisOption.fileNameMaxLength){
                thisOption.imgFile.value = "";
                thisOption.imgName.value = "";
                msgAlert("图片文件名不能超过" + thisOption.fileNameMaxLength + "字符");
                return false;
            }
            var fileSize = thisOption.imgFile.files[0].size;
            fileSize=Math.round(fileSize/1024*100)/100; //单位为KB
            if(fileSize>=thisOption.maxSize){
                var maxSizeStr;
                if(thisOption.maxSize>=1024){
                    maxSizeStr = Math.round(thisOption.maxSize/1024) + "MB";
                }else{
                    maxSizeStr = Math.round(thisOption.maxSize) + "KB";
                }
                thisOption.imgFile.value = "";
                thisOption.imgName.value = "";
                msgAlert("照片最大尺寸为" + maxSizeStr + "，请重新上传!");
                return false;
            }

            //////////////////////////////////////////////////////////////
            thisOption.imgName.value = thisOption.imgFile.files[0].name;
            var url = URL.createObjectURL(thisOption.imgFile.files[0]);
            thisObj.load(url,{ blobURL : url });
        }
    });
}

////////////////////////////////加载图片
/////disabled---只浏览而无法操作
iCropper.prototype.load = function(imgSrc,option){
    var thisObj = this,
        thisOption = this.option;
    thisObj.loadOption = option || {};
    thisObj.loadOption.autoCropArea = (thisObj.loadOption.autoCropArea || 1);
    thisOption.img.src = imgSrc;
    //console.log("load option---"+JSON.stringify(thisObj.loadOption));

    if(!thisObj.cropper){///////初始化裁剪插件
        //console.log("初始化裁剪插件...");
        thisObj.cropper = true;
        thisOption.$img.cropper({
            aspectRatio : thisOption.ratioW / thisOption.ratioH,
            autoCrop : true,
            checkCrossOrigin : false,
            autoCropArea : thisObj.loadOption.autoCropArea,
            built : function(){/////插件初始化之后的回调
                if(thisObj.loadOption.disabled === true){////disable 裁剪
                    thisObj.changeCropperStatus("disable");
                }
                else{
                    thisObj.changeCropperStatus("enable");
                }

                if(thisObj.loadOption.blobURL){//////释放blobURL
                    URL.revokeObjectURL(thisObj.loadOption.blobURL);
                    if(thisOption.imgId) thisOption.imgId.value = "";
                }
                else{
                    thisOption.imgFile.value = "";
                    thisOption.imgName.value = "";
                }
            },
            crop : function(e){
                //console.log("x："+ e.x+"--y："+ e.y+"--width："+ e.width+"--height："+ e.height);
                thisObj.setSelectValue(e);
            }
        });
    }
    else{
        //console.log("reset......");
        thisObj.changeCropperStatus("enable");
        thisOption.$img.cropper('reset').cropper('replace', imgSrc);
    }

    /////////////////////图片加载之后的回调
    if(thisOption.onImgLoad){
        thisOption.onImgLoad();
    }
};

//////////////////////////////设置裁剪值到文本域
iCropper.prototype.setSelectValue = function(selection){
    var op = this.option;
    op.x.value = Math.round(selection.x) || 0;
    op.y.value = Math.round(selection.y) || 0;
    op.w.value = Math.round(selection.width) || 0;
    op.h.value = Math.round(selection.height) || 0;

    if(op.selectionTxt){
        if(op.w.value != 0 && op.h.value !=0){
            op.selectionTxt.innerHTML = "<b>x："+op.x.value+"</b><b>y："+op.y.value+"</b><b>宽："+op.w.value+"px</b><b>高："+op.h.value+"px</b>";
            op.selectionTxt.style.display = "inline";
        }
        else{
            op.selectionTxt.style.display = "none";
        }
    }
};

//////////////////清除
iCropper.prototype.clean = function(){
    if(this.cropper){
        this.option.$img.cropper("destroy");
        if(this.option.selectionTxt){
            this.option.selectionTxt.style.display = "none";
        }
        this.option.img.src = "";
        this.cropper = false;
    }
};

///////////////////////////////check validate
iCropper.prototype.checkSelectionValidate = function(){
    var op = this.option,
        x = parseInt(op.x.value),
        y = parseInt(op.y.value),
        w = parseInt(op.w.value),
        h = parseInt(op.h.value);
    if(op.x.value.length==0 || op.y.value.length==0 || op.w.value.length==0 || op.h.value.length==0 ){
        return "您未选择区域！";
    }
    if(x<0 || y<0){
        return "您的选择区域有问题！";
    }
    var imageData = op.$img.cropper("getImageData");
    if(x+w>imageData.naturalWidth || y+h>imageData.naturalHeight){
        return "您的选择区域有问题！";
    }
    return "OK";
};

/////////////////////////////changeCropperStatus
iCropper.prototype.changeCropperStatus = function(status){
    var oppositeStatus = (status=="enable" ? "disable" : "enable");
    if(this.cropperStatus == oppositeStatus){
        this.option.$img.cropper(status);
        this.cropperStatus = status;
    }
};

function iSessionStorage(key, value) {//expires :单位ms
    if(sessionStorage && sessionStorage.setItem && sessionStorage.getItem){
        if (value != undefined) {
            sessionStorage.setItem(key, value);
        } else {
            return sessionStorage.getItem(key);
        }
    }
    return false;
}