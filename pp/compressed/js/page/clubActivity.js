require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","jqform","cropper","dragsort","!domReady"],function(){function t(){if("add"==f.currEditOpe&&!$("#imgFileName").val())return i.showTip("请上传活动图片！"),!1;if(!s.val())return i.showTip("请输入活动标题！"),s.focus(),!1;if(!d.html())return i.showTip("请输入活动规则！"),d.focus(),!1;l.val(d.html());var t=formatDateRangeVal(n.val());return u.val(t.start),m.val(t.end),!0}function e(){$.ajax({url:"act/list",success:function(t){200==t.statusCode&&(g=t.respData.acts,f.list=g),avalon.scan(c[0]),$.ajax({url:"act/downline_act?actType=act&actStatus=downline",success:function(t){if(200==t.statusCode)for(var e=0;e<t.respData.length;e++)g.push(t.respData[e]),f.list=g}})}})}var a,i,o,r=$$.rootVm.page+"Ctrl"+ +new Date,c=$("#"+$$.rootVm.page+"Page"),n=$("#actDate"),s=$("#actTitle"),d=$("#actRulesContent"),l=$("#actRules"),u=$("#startTime"),m=$("#endTime"),p=$("#editActivityForm");c.attr("ms-controller",r),$$.currPath.html("营销中心 >> 场所活动");var g=[],f=avalon.define({$id:r,list:[],confirmContent:"",opeType:"",opeActId:"",editStr:"新增活动",currEditOpe:"add",currActId:"",doChangeStatus:function(t,e){"online"==t?(f.opeType="downline",f.confirmContent="确认下线此活动？"):(f.opeType="online",f.confirmContent="确认上线此活动？"),f.opeActId=e,a.show()},doDelAct:function(t){f.confirmContent="确认删除此活动？",f.opeType="delete",f.opeActId=t,a.show()},doClickOfAddNew:function(){f.editStr="新增活动",f.currEditOpe="add",f.currActId="",s.val(""),d.html(""),l.val(""),u.val(""),m.val(""),p.removeClass("hasImg"),o.clean(),i.show()},doEditAct:function(t){f.editStr="编辑活动",f.currEditOpe="modify",f.currActId=g[t].actId,s.val(g[t].actTitle),d.html(g[t].actContent),l.val(g[t].actContent),u.val(g[t].startDate),m.val(g[t].endDate),g[t].startDate&&g[t].endDate?(n.data("daterangepicker").setStartDate(g[t].startDate),n.data("daterangepicker").setEndDate(g[t].endDate)):n.val(""),g[t].actLogoUrl?o.load(g[t].actLogoUrl,{autoCropArea:1,disabled:!0}):o.clean(),p.addClass("hasImg"),i.show()}});a=new Modal($("#confirmModal"),{doClickOkBtn:function(){a.close(),$.ajax({url:"act/modify",data:{actId:f.opeActId,operator:f.opeType,actType:"act"},success:function(t){200==t.statusCode?(msgAlert(t.msg,!0),e()):msgAlert(t.msg||"操作失败！")}})}});var h=new Date,v=new Date;v.setTime(h.getTime()+2592e6),n.daterangepicker({startDate:h,endDate:v}),i=new Modal($("#editActivityModal"),{doClickOkBtn:function(){if(t()){if($("#imgFileName").val()){var a=o.checkSelectionValidate();if("OK"!=a)return void i.showTip(a)}i.loading(),p.ajaxSubmit({dataType:"json",success:function(t){200==t.statusCode?(msgAlert(t.msg,!0),i.close(),e()):i.showTip(t.msg||"操作失败！")},complete:function(t){i.loading("hide"),400==t.status&&i.showTip("您选择的裁剪区域过大！请通过鼠标缩小区域！")}})}}}),o=new iCropper({imgFile:$("#uploadImgBtn")[0],img:$("#editActivityForm>div.img>img")[0],imgName:$("#imgFileName")[0],selectionTxt:$("#editActivityForm>div.img>span.selectionTxt")[0],maxWidth:630,maxHeight:250,x:$("#x")[0],y:$("#y")[0],w:$("#w")[0],h:$("#h")[0],imgWidth:720,imgHeight:360,ratioW:2,ratioH:1,onImgLoad:function(){p.hasClass("hasImg")||p.addClass("hasImg")}}),$("#activityList").dragsort({dragSelector:"li",dragSelectorExclude:"div>ul>li",dragEnd:function(){for(var t,e=$(this),a=e.parents("ul").children(),i=[],o=0;o<a.length;o++)t=a[o].getAttribute("actId"),t&&i.push(t);$.ajax({url:"act/orders",type:"post",data:{orderIds:i.join(","),actType:"act",clubId:f.list[0].clubId},success:function(t){200==t.statusCode&&msgAlert("操作成功！",!0)}})}}),e()});