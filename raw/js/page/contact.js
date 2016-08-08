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
    var contactModal = new Modal($("#contact-modal"),{
        doOkBtnClick : function(){

        }
    });

    $("#contact_building_btn,#contact_support_btn").click(function(){
        contactModal.show();
    });
})