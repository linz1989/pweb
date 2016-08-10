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

//////全局的提示，延时time之后消失
function msgAlert(msg,tag,time){
    time = time || 2000;
    tag = (tag ? "success" : "fail" );
    var $box = $('<div class="msgBox"><span><span class="' + tag + '"></span>'+msg+'<span class="end"></span></span></div>');
    $("body").append($box);
    $box.show(0);
    setTimeout(function(){ $box.remove() },time)
}

$(function(){
    var userName = $("#user-name"),
        userEmail = $("#user-email"),
        userTel = $("#user-tel"),
        userSubject = $("#user-subject"),
        userContent = $("#user-content"),
        contactZone = $("#contact-modal");

    var successTip = contactZone.attr("success-tip"),
        failTip = contactZone.attr("fail-tip");

    var contactModal = new Modal(contactZone,{
        doClickOkBtn : function(){
            if(checkForm()){
                contactModal.loading();

                var now =(+new Date()),
                    appKey = SHA1("A6925251770173"+"UZ"+"35E25FEA-86D2-D271-C6CB-68EEC80020B2"+"UZ"+now)+"."+now;

                $.ajax({
                    "url": "https://d.apicloud.com/mcm/api/customer",
                    "method": "POST",
                    "cache": false,
                    "headers": {
                        "X-APICloud-AppId": "A6925251770173",
                        "X-APICloud-AppKey": appKey
                    },
                    "data": {
                        "name": userName.val(),
                        "email": userEmail.val(),
                        "tel": userTel.val(),
                        "subject" : userSubject.val(),
                        "content" : userContent.text()
                    }
                }).success(function (data, status, header) {
                    contactModal.loading("hide");
                    userName.val("");
                    userEmail.val("");
                    userTel.val("");
                    userSubject.val("");
                    userContent.html("");
                    contactModal.close();
                    msgAlert(successTip,true);
                }).fail(function (header, status, errorThrown) {
                    msgAlert(failTip);
                })
            }
        }
    });

    $("#contact_building_btn,#contact_support_btn").click(function(){
        contactModal.show();
    });

    function checkForm(){
        if(!userName.val()){
            userName.focus();
            return false;
        }
        if(userEmail.val() && !/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(userEmail.val())){
            userEmail.focus();
            return false;
        }
        if(!userSubject.val()){
            userSubject.focus();
            return false;
        }
        if(!userContent.text()){
            userContent.focus();
            return false;
        }
        return true;
    }

    userTel.on("input",function(){
        if (/[^+\d]/.test(this.value)) {
            this.value = this.value.replace(/[^+\d]/g, '');
        }
        /*if (this.value.length == 1 && this.value != 1) {
            this.value = "";
        }
        if (this.value.length == 2 && !/^1[34578]$/.test(this.value)) {
            this.value = 1;
        }
        if (this.value.length > 11) {
            this.value = this.value.substring(0, 11);
        }*/
    });
})