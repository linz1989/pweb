require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"area","dragsort","cropper","jqform","!domReady"],function(){function e(e){if($("#citySelect").val(""),""==e)x.cityList=[];else for(var t=0;t<provinceData.cityList.length;t++)provinceData.cityList[t].provinceCode==e&&(x.cityList=provinceData.cityList[t].city)}function t(){return m.val()?v.val()?!!/^1[34578]\d{9}$/.test(v.val())||(msgAlert("请输入正确的手机号码！"),v.focus(),!1):(msgAlert("请输入技师手机号码！"),v.focus(),!1):(msgAlert("请输入技师昵称！"),m.focus(),!1)}function a(){$.ajax({url:"tech/update/data",type:"post",data:{type:"update",ajax:"1",id:u.id},success:function(e){e&&e.data&&(p=e.data.avatar,m.val(e.data.name),h.val(e.data.serialNo),v.val(e.data.phoneNum),x.currSex=e.data.gender,g.text(e.data.description||""),x.techInfoObj=e.data,x.imgList=e.albums||[],avalon.scan(r[0]),e.data.provinceCode&&"null"!=e.data.provinceCode&&(b.provinceCode=e.data.provinceCode),e.data.cityCode&&"null"!=e.data.cityCode&&(b.cityCode=e.data.cityCode))}})}function i(){$.ajax({url:"tech/update/data",type:"post",data:{type:"update",ajax:"1",id:u.id},success:function(e){e&&e.albums&&(x.imgList=e.albums||[])}})}var o,c,l,s,n,d=$$.rootVm.page+"Ctrl"+ +new Date,r=$("#"+$$.rootVm.page+"Page"),u=getParamObj(),m=$("#techName"),h=$("#techNo"),v=$("#techPhoneNum"),g=$("#techDesc"),p="",f="",y=$("#editHeaderModal>div>div.content"),C=$("#editAlbumModal>div>div.content"),b={};u.id||(msgAlert("地址栏缺少访问参数！"),history.back()),r.attr("ms-controller",d),$$.currPath.html("技师管理 >> <a href='#!/techList'>所有技师</a> >> <a href='#!/techDetail?id="+u.id+"'>技师详情</a> >> 技师编辑");var x=avalon.define({$id:d,techId:u.id,currSex:"male",provinceList:provinceData.provinceList,cityList:[],techInfoObj:{},imgList:[],doChangeSex:function(e){x.currSex=e},doChangeOfProvince:function(){e(this.value)},doSaveTechInfo:function(){t()&&$.ajax({url:"tech/create",type:"post",data:{id:u.id,name:m.val(),gender:x.currSex,serialNo:h.val(),phoneNum:v.val(),provinceCode:$("#provinceSelect").val(),province:$("#provinceSelect").val()?$("#provinceSelect option:selected").text():"",cityCode:$("#citySelect").val(),city:$("#citySelect").val()?$("#citySelect option:selected").text():"",description:g.text(),avatar:p},success:function(e){e&&e.id?msgAlert("保存成功！",!0):msgAlert(e.message||"保存失败！")}})},doClickDelImg:function(e){f=e,o.show()},doEditTechHeader:function(){x.techInfoObj.avatarUrl&&l.load(x.techInfoObj.avatarUrl,!1),c.show()},doClickAddTechAlbum:function(){n.clean(),C.removeClass("hasImg"),s.show()},doRenderedOfProvince:function(){b.provinceCode&&($("#provinceSelect").val(b.provinceCode),e(b.provinceCode),delete b.provinceCode)},doRenderedOfCity:function(){b.cityCode&&($("#citySelect").val(b.cityCode),delete b.cityCode)}});c=new Modal($("#editHeaderModal"),{doClickOkBtn:function(){if($("#techHeaderForm>div>img")[0]&&0!=$("#techHeaderForm>div>img")[0].width)if($("#tech-uploadImgBtn")[0].files[0]){var e=l.checkSelectionValidate();if("OK"!=e)return void c.showTip(e);$("#tech-image").val(""),c.loading(),$("#techHeaderForm").ajaxSubmit({dataType:"json",success:function(e){e&&e.avatarUrl?(x.techInfoObj.avatarUrl=e.avatarUrl,c.close(),msgAlert("修改成功！",!0)):c.showTip(e.msg||e.message||"修改失败！")},complete:function(e){c.loading("hide"),400==e.status&&c.showTip("您选择的裁剪区域过大！请通过鼠标缩小区域！")}})}else c.close();else c.showTip("请您上传图片！")}}),l=new iCropper({imgFile:$("#tech-uploadImgBtn")[0],img:$("#techHeaderForm>div>img")[0],imgName:$("#tech-imgFileName")[0],selectionTxt:$("#techHeaderForm>div>span.selectionTxt")[0],imgId:$("#techImageId"),maxWidth:580,maxHeight:300,x:$("#tech-x")[0],y:$("#tech-y")[0],w:$("#tech-w")[0],h:$("#tech-h")[0],imgWidth:168,imgHeight:168,onImgLoad:function(){y.hasClass("hasImg")||y.addClass("hasImg")}}),s=new Modal($("#editAlbumModal"),{doClickOkBtn:function(){if($("#album-uploadImgBtn")[0].files[0]){var e=n.checkSelectionValidate();if("OK"!=e)return void s.showTip(e);$("#album-image").val(""),s.loading(),$("#techAlbumForm").ajaxSubmit({dataType:"json",success:function(e){e&&e.id?(s.close(),msgAlert("上传成功！",!0),i()):s.showTip(e.msg||e.message||"上传失败！")},complete:function(e){s.loading("hide"),400==e.status&&s.showTip("您选择的裁剪区域过大！请通过鼠标缩小区域！")}})}else s.showTip("请您上传图片！")}}),n=new iCropper({imgFile:$("#album-uploadImgBtn")[0],img:$("#techAlbumForm>div>img")[0],imgName:$("#album-imgFileName")[0],selectionTxt:$("#techAlbumForm>div>span.selectionTxt")[0],maxWidth:580,maxHeight:300,factor:$("#album-factor")[0],x:$("#album-x")[0],y:$("#album-y")[0],w:$("#album-w")[0],h:$("#album-h")[0],imgWidth:360,imgHeight:360,onImgLoad:function(){C.hasClass("hasImg")||C.addClass("hasImg")}}),o=new Modal($("#confirmModal"),{doClickOkBtn:function(){$.ajax({url:"tech/album/delete",type:"post",data:{id:f,techId:u.id},success:function(e){200==e.statusCode?(msgAlert("删除成功！",!0),i()):msgAlert(e.msg||e.message||"删除失败！")}}),o.close()}}),m.on("input",function(){this.value.length>15&&(this.value=this.value.substr(0,15))}),h.on("input",function(){this.value.length>10&&(this.value=this.value.substr(0,10))}),v.on("input",function(){/\D/.test(this.value)&&(this.value=this.value.replace(/\D/g,"")),1==this.value.length&&1!=this.value&&(this.value=""),2!=this.value.length||/^1[34578]$/.test(this.value)||(this.value=1),this.value.length>11&&(this.value=this.value.substring(0,11))}),$("#techImgList").dragsort({dragSelector:"li",dragSelectorExclude:">div>ul>li",dragEnd:function(){for(var e=$(this),t=e.parents("ul").children(),a=[],i=0;i<t.length;i++)a.push(t[i].getAttribute("imgId"));$.ajax({url:"tech/album/sort",type:"post",data:{ids:a.join(","),techId:u.id},success:function(){msgAlert("操作成功！",!0)}})}}),a()});