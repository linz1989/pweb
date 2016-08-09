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


$(function(){
    var userName = $("#user-name"),
        userEmail = $("#user-email"),
        userTel = $("#user-tel"),
        userSubject = $("#user-subject"),
        userContent = $("#user-content");

    var contactModal = new Modal($("#contact-modal"),{
        doClickOkBtn : function(){
            if(checkForm()){
                contactModal.loading();

                ///////////////////////////
                contactModal.loading("hide");
                userName.val("");
                userEmail.val("");
                userTel.val("");
                userSubject.val("");
                userContent.html("");
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