require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"!domReady"],function(){function t(){return 0==r.val().length?(r.focus(),msgAlert("请输入每消费1元获取的积分数量！"),!1):0==o.val().length?(o.focus(),msgAlert("请输入注册赠送积分数量！"),!1):0==h.val().length?(h.focus(),msgAlert("请输入技师每兑换1元所需积分数量！"),!1):0!=g.val().length||(g.focus(),msgAlert("请输入技师起提积分数量！"),!1)}function e(){return u.val()?/^1[34578]\d{9}$/.test(u.val())?!!l.val()||(l.focus(),l.showTip("请输入充值积分！"),!1):(u.focus(),a.showTip("请输入正确的手机号码！"),!1):(u.focus(),a.showTip("请输入充值账号！"),!1)}function s(){$.ajax({url:"club/credit/account",success:function(t){200==t.statusCode&&t.respData&&(t=t.respData,d.deliverAmount=t.deliverAmount,d.recycleAmount=t.recycleAmount)}})}var a,c=$$.rootVm.page+"Ctrl"+ +new Date,i=$("#"+$$.rootVm.page+"Page"),u=$("#charge-account"),l=$("#charge-value"),n=$("#charge-remark"),r=$("#creditPerConsume"),o=$("#creditPerRegister"),h=$("#creditPerExchange"),g=$("#creditExchangeLimitation");i.attr("ms-controller",c),$$.currPath.html("积分系统 >> 积分管理");var d=avalon.define({$id:c,deliverAmount:0,recycleAmount:0,settingSwitch:"off",selectedTab:"user",chargeType:"user",changeChargeType:function(t){d.chargeType=t},doClickSwitch:function(){var t="on"==d.settingSwitch?"off":"on";$.ajax({url:"club/credit//system/switch",data:{status:t},success:function(e){200==e.statusCode?d.settingSwitch=t:msgAlert(e.msg||"操作失败！")}})},doClickChargeBtn:function(){u.val(""),l.val(""),n.html(""),a.show()},doClickSaveCfgBtn:function(){t()&&$.ajax({url:"club/credit/settings/save",data:{clubId:$$.clubId,creditExchangeLimitation:g.val(),creditPerConsume:r.val(),creditPerExchange:h.val(),creditPerRegister:o.val()},success:function(t){200==t.statusCode?msgAlert("保存成功！",!0):msgAlert(t.msg||"保存失败！")}})}});$("div#settingCfg").on("input","div.item>input",function(){/\D/.test(this.value)&&(this.value=this.value.replace(/\D/g,"")),this.value.length>9&&(this.value=this.value.substring(0,9))}),l.on("input",function(){/\D/.test(this.value)&&(this.value=this.value.replace(/\D/g,"")),this.value.length>9&&(this.value=this.value.substring(0,9))}),u.on("input",function(){/\D/.test(this.value)&&(this.value=this.value.replace(/\D/g,"")),1==this.value.length&&1!=this.value&&(this.value=""),2!=this.value.length||/^1[34578]$/.test(this.value)||(this.value=1),this.value.length>11&&(this.value=this.value.substring(0,11))}),a=new Modal($("#chargeModal"),{doClickOkBtn:function(){e()&&(a.loading(),$.ajax({url:"club/credit/charge",type:"post",data:{userType:d.chargeType,telephone:u.val(),amount:l.val(),remark:n.text().substr(0,1e3)},success:function(t){200==t.statusCode?(a.close(),s(),msgAlert(t.msg||"充值成功！",!0)):a.showTip(t.msg||"充值失败！")},complete:function(){a.loading("hide")}}))}}),$.ajax({url:"club/credit/switch/status",data:{clubId:$$.clubId},success:function(t){200==t.statusCode&&(d.settingSwitch="on"==t.respData.clubSwitch?"on":"off","on"==d.settingSwitch&&$.ajax({url:"club/credit/settings/get",data:{clubId:$$.clubId},success:function(t){200==t.statusCode&&(t=t.respData,t&&(o.val(t.creditPerRegister),g.val(t.creditExchangeLimitation),r.val(t.creditPerConsume),h.val(t.creditPerExchange)))}}))}}),s(),avalon.scan(i[0])});