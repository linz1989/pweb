function Modal(i,t){this.ele=i,this.option=t=t||{};var o=this,e=this.ele.find("div>h3.header>span"),n=this.ele.find("div>div.footer>a.cancel"),s=this.ele.find("div>div.footer>a.ok");e[0]&&e.click(function(){o.close()}),s[0]&&t.doClickOkBtn&&s.click(function(){t.doClickOkBtn()}),n[0]&&(t.doClickCancelBtn?n.click(function(){t.doClickCancelBtn()}):n.click(function(){o.close()})),this.tip=this.ele.find("div>div.footer>span.tip"),this.ele.children("div").append("<div class='mask'><div><i></i><i></i><i></i><i></i><i></i></div></div>")}Modal.prototype.show=function(i){i&&this.ele.find("div>div.content").html(i),this.ele.css("display","block"),this.ele.removeClass("loading");var t=this.ele;setTimeout(function(){t.addClass("active")},30)},Modal.prototype.close=function(){this.ele.removeClass("active");var i=this.ele;setTimeout(function(){i.css("display","none")},500),this.option.afterClose&&this.option.afterClose()},Modal.prototype.loading=function(i){i=i||"show","show"==i?this.ele.addClass("loading"):this.ele.removeClass("loading")},Modal.prototype.showTip=function(i,t){if(this.tip&&this.tip[0]){i&&this.tip.text(i),t===!0?this.tip.addClass("ok"):this.tip.removeClass("ok"),this.tip.show();var o=this.tip;setTimeout(function(){o.hide()},3e3)}},Modal.prototype.hideClose=function(){this.ele.find("div>h3.header>span").hide()},$(function(){var i=new Modal($("#contact-modal"),{doOkBtnClick:function(){}});$("#contact_building_btn,#contact_support_btn").click(function(){i.show()})});