require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"area","dragsort","!domReady"],function(){function e(){$.ajax({url:"tech/data",data:{ajax:1,categoryId:l.queryCategory,name:$("#techInfoSearch").val()},success:function(e){200==e.statusCode&&(l.freeList=e.respData.free||[],l.busyList=e.respData.work||[]),avalon.scan(o[0])}})}function t(){$.ajax({url:"api/v2/manager/tech/recommend/list",success:function(e){200==e.statusCode&&(l.recommendList=e.respData)}})}function a(){$.ajax({url:"club/service/data",success:function(e){200==e.statusCode&&(l.itemList=e.respData)}})}function s(){return r.val()?u.val()?!!/^1[34578]\d{9}$/.test(u.val())||(i.showTip("请输入正确的手机号码！"),u.focus(),!1):(i.showTip("请输入技师手机号码！"),u.focus(),!1):(i.showTip("请输入技师昵称！"),r.focus(),!1)}var i,c=$$.rootVm.page+"Ctrl"+ +new Date,o=$("#"+$$.rootVm.page+"Page"),r=$("#techName"),n=$("#techNo"),u=$("#techPhoneNum");o.attr("ms-controller",c),$$.currPath.html("技师管理 >> 所有技师");var l=avalon.define({$id:c,freeList:[],busyList:[],recommendList:[],itemList:[],queryCategory:"-1",currSex:"male",provinceList:provinceData.provinceList,cityList:[],doClickSearchBtn:function(){e()},doAddTechBtn:function(){r.val(""),n.val(""),u.val(""),l.currSex="male",i.show()},doChangeQueryCategory:function(){l.queryCategory=this.value,e()},doChangeSex:function(e){l.currSex=e},doChangeOfProvince:function(){if($("#citySelect").val(""),""==this.value)l.cityList=[];else for(var e=0;e<provinceData.cityList.length;e++)provinceData.cityList[e].provinceCode==this.value&&(l.cityList=provinceData.cityList[e].city)},doClickTech:function(e){location.href="#!/techDetail?id="+e}});$("#techInfoSearch").on("keypress",function(t){13==t.keyCode&&e()}),i=new Modal($("#addTechModal"),{doClickOkBtn:function(){s()&&(i.loading(),$.ajax({url:"tech/create",type:"post",data:{id:"-1",name:r.val(),gender:l.currSex,serialNo:n.val(),phoneNum:u.val(),provinceCode:$("#provinceSelect").val(),province:$("#provinceSelect").val()?$("#provinceSelect option:selected").text():"",cityCode:$("#citySelect").val(),city:$("#citySelect").val()?$("#citySelect option:selected").text():""},success:function(t){i.loading("hide"),t&&t.id?(i.close(),msgAlert("添加成功！",!0),e()):i.showTip(t.message||"添加失败！")}}))}}),r.on("input",function(){this.value.length>15&&(this.value=this.value.substr(0,15))}),n.on("input",function(){this.value.length>5&&(this.value=this.value.substr(0,5))}),u.on("input",function(){/\D/.test(this.value)&&(this.value=this.value.replace(/\D/g,"")),1==this.value.length&&1!=this.value&&(this.value=""),2!=this.value.length||/^1[34578]$/.test(this.value)||(this.value=1),this.value.length>11&&(this.value=this.value.substring(0,11))}),$("#recommendTechList").dragsort({dragSelector:"li",dragSelectorExclude:"div>a>div>b",dragEnd:function(){for(var e=$("#recommendTechList>li"),t=[],a=0;a<e.length;a++)t.push(e[a].getAttribute("techId"));$.ajax({url:"tech/top/sort",type:"post",data:{ids:t.join(",")},success:function(e){200==e.statusCode?msgAlert(e.msg,!0):msgAlert(e.msg||"排序失败！")}})}}),$("#freeTechList,#busyTechList").dragsort({dragSelector:"li",dragBetween:!0,dragSelectorExclude:"div>a>div>b",dragEnd:function(){var e=$(this),t=e.attr("techId"),a=e.parents().attr("type");$.ajax({url:"tech/update/status",type:"post",data:{id:t,status:a},success:function(e){200==e.statusCode?msgAlert(e.message,!0):msgAlert(e.message||"操作失败！")}})}}),t(),a(),e()});