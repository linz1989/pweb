require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"!domReady"],function(){function e(e){for(var o,t=0;t<e.length;t++)o=parseInt(t/4),void 0==h[o]&&(h[o]=[]),h[o].push(e[t]);C.coupons=h[0]||[],h.length>0&&u.refresh({currPage:1,totalPage:h.length}),C.couponsPage=h.length}function o(){h=[],C.coupons=[],C.couponsPage=1,C.verifyCouponSuaId="",C.selectCoupon.consumeMoneyDescription="",C.selectCoupon.getDate="",C.selectCoupon.useTimePeriod="",C.selectCoupon.actContent="",C.selectCoupon.couponNo=""}function t(){C.selectOrder.id="",C.selectOrder.customerName="",C.selectOrder.phoneNum="",C.selectOrder.appointTime="",C.selectOrder.createdAt="",C.selectOrder.techName="",C.selectOrder.downPayment="",C.selectOrder.statusName="",C.selectOrder.status="reject",C.selectOrder.isExpire=!1}function n(){$.ajax({url:"info/data",type:"post",success:function(e){200==e.statusCode&&(e=e.respData,C.orders=e.orders,C.banners=e.data.banners,C.freeCount=e.data.free||0,C.inProgressCount=e.data.inProgress||0,avalon.scan(l[0]))}})}function s(){return""==f.val()?c.showTip("授权码不能为空"):f.val().length<14?c.showTip("请输入14位授权码"):""==g.val()?c.showTip("消费金额不能为空"):void $.ajax({url:"api/v2/finacial/account/payforother/check",type:"post",data:{code:f.val(),usedAmount:100*parseFloat(g.val())},success:function(e){"200"==e.statusCode?(msgAlert("核销成功",!0),f.val(""),g.val(""),c.close()):msgAlert(e.msg||"核销失败，请检查授权码或金额是否出错后再次核销")}})}var a,u,r,c,i=$$.rootVm.page+"Ctrl"+ +new Date,l=$("#"+$$.rootVm.page+"Page"),p=$("#search-tel-input"),d=$("#search-couponNo-input"),h=[],v=$("#search-order-input"),f=$("#treatCodeInput"),g=$("#moneyInput"),m="";l.attr("ms-controller",i),$$.currPath.html("首页");var C=avalon.define({$id:i,paidOrderSwitch:"off",couponSwitch:"off",orders:[],freeCount:0,inProgressCount:0,coupons:[],couponsPage:1,verifyCouponSuaId:"",selectCoupon:{consumeMoneyDescription:"",getDate:"",useTimePeriod:"",actContent:"",couponNo:""},selectOrder:{id:"",customerName:"",phoneNum:"",appointTime:"",createdAt:"",techName:"",downPayment:"",statusName:"",status:"reject",isExpire:!1},doPaidOrderVerify:function(){t(),r.show()},doSearchOrder:function(){return/\d{12}/.test(v.val())?void $.ajax({url:"api/v2/manager/user/paid_order/view",data:{orderNo:v.val()},success:function(e){200==e.statusCode?C.selectOrder=e.respData:(msgAlert(e.msg||"未能查询到预付费订单！"),t())}}):(r.showTip("请输入正确的12位订单预约号码！"),void v.focus())},doUsePaidOrder:function(e){C.selectOrder.id&&$.ajax({url:"api/v2/manager/user/paid_order/use",data:{id:C.selectOrder.id,processType:e,orderNo:v.val()},success:function(o){200==o.statusCode?(msgAlert("verified"==e?"使用成功！":"操作成功！",!0),r.close()):msgAlert(o.msg||"操作失败！")}})},doCouponVerify:function(){o(),a.show()},couponVerifyType:"tel",doSearchCoupon:function(t){if("tel"==C.couponVerifyType){if(!/^1[34578]\d{9}$/.test(p.val()))return p.focus(),void a.showTip("请输入正确的手机号码！");$.ajax({url:"api/v2/manager/user/coupons",data:{phoneNum:p.val()},success:function(n){o(),200==n.statusCode?e(n.respData):n.msg&&t&&msgAlert(n.msg)}})}else{if(!/^\d{12}$/.test(d.val()))return d.focus(),void a.showTip("请输入12位券优惠码！");$.ajax({url:"api/v2/manager/user/coupon/view",data:{couponNo:d.val()},success:function(n){o(),200==n.statusCode?e([n.respData.userAct]):n.msg&&t&&msgAlert(n.msg)}})}},deSelectVerifyCoupon:function(e,o){C.verifyCouponSuaId=e,C.selectCoupon.consumeMoneyDescription=C.coupons[o].consumeMoneyDescription,C.selectCoupon.getDate=C.coupons[o].getDate,C.selectCoupon.useTimePeriod=C.coupons[o].useTimePeriod,C.selectCoupon.actContent=C.coupons[o].actContent,C.selectCoupon.couponNo=C.coupons[o].couponNo},doTreatVerify:function(){f.val(""),g.val(""),c.show()}});$.ajax({url:"api/v2/manager/paid_order/open_status",success:function(e){200==e.statusCode&&(e=e.respData,e.payAppointment="Y"==e.payAppointment?"on":"off","on"==e.payAppointment&&"on"==e.openStatus&&(C.paidOrderSwitch="on"),C.couponSwitch=e.couponSwitch,n())}}),a=new Modal($("#couponVerificationModal"),{doClickOkBtn:function(){""!=C.verifyCouponSuaId&&$.ajax({url:"api/v2/manager/user/coupon/use",data:{suaId:C.verifyCouponSuaId,couponNo:C.selectCoupon.couponNo},success:function(e){200==e.statusCode?(msgAlert(e.msg,!0),C.doSearchCoupon(!1)):msgAlert(e.msg||"核销失败！")}})}}),u=new Pagination($("#couponPagination"),{switchPage:function(e){C.coupons=h[e-1],u.refresh({currPage:e,totalPage:h.length})}}),$("#couponSearchTypeSelect").on("change",function(){C.couponVerifyType=this.value}),p.on("input",function(){/\D/.test(this.value)&&(this.value=this.value.replace(/\D/g,"")),1==this.value.length&&1!=this.value&&(this.value=""),2!=this.value.length||/^1[34578]$/.test(this.value)||(this.value=1),this.value.length>11&&(this.value=this.value.substring(0,11))}).on("keypress",function(e){13==e.keyCode&&C.doSearchCoupon(!0)}),d.on("input",function(){/\D/.test(this.value)&&(this.value=this.value.replace(/\D/g,"")),this.value.length>12&&(this.value=this.value.substring(0,12))}).on("keypress",function(e){13==e.keyCode&&C.doSearchCoupon(!0)}),r=new Modal($("#orderVerificationModal")),v.on("input",function(){/\D/.test(this.value)&&(this.value=this.value.replace(/\D/g,"")),this.value.length>12&&(this.value=this.value.substring(0,12))}).on("keypress",function(e){13==e.keyCode&&C.doSearchOrder()}),c=new Modal($("#treatVerificationModal"),{doClickOkBtn:function(){s()}}),f.on("input",function(){this.value=this.value.match(/^[\d\s]*/g)[0].replace(/\s*/g,"")}).on("keypress",function(e){13==e.keyCode&&g[0].focus()}),g.on("input",function(){if(""==g[0].value)m.length>1?g[0].value=m:m="";else{var e=g[0].value.match(/\./g);e&&g[0].value.match(/\./g).length>1&&(g[0].value=g[0].value.substring(0,g[0].value.length-1)),/^([1-9][0-9]*|(([1-9]\d*|0)\.[0-9]{0,2})|0)$/g.test(g[0].value)?m=g[0].value:g[0].value=m}}).on("keypress",function(e){13==e.keyCode&&s()})});