require(["css!../../compressed/css/page/clubService.css?"+$$.rootVm.currTime,"css!../../compressed/css/common/kindeditor.css","kindeditor","kindeditor_zhCn","jqform","cropper","dragsort","!domReady"],function(){function e(){return""!=$("#editForm>div.img>img")[0].src||$("#imgFileName").val()?c.val()?($("#imgFileName").val()&&C.val(""),!0):(c.focus(),o.showTip("请输入项目名称！"),!1):(o.showTip("请上传项目图片！"),!1)}function i(){$.ajax({url:"club/service/dataList",success:function(e){200==e.statusCode&&(P.items=e.respData.items,P.categories=e.respData.sort,avalon.scan(n[0]))}})}function t(e){d&&d.remove(),d=KindEditor.editor({fileManagerJson:"club/service/photoGallery/data?id="+e,allowFileManager:!0}),0==w&&(KindEditor("#fileManager").click(function(){d.loadPlugin("filemanager",function(){d.plugin.filemanagerDialog({viewType:"VIEW",dirName:"image",clickFn:function(e){s.clean(),s.load("updateImageInfo/imageView/"+e,{autoCropArea:1,disabled:!0}),r.addClass("hasImg"),C.val(e),d.hideDialog()}})})}),w=!0)}var a,o,s,d,l=$$.rootVm.page+"Ctrl"+ +new Date,n=$("#"+$$.rootVm.page+"Page"),r=$("#editForm"),c=$("#itemName"),m=$("#itemPrice0"),u=$("#itemTime0"),g=$("#durationUnit"),p=$("#itemPrice1"),v=$("#itemTime1"),f=$("#durationUnitPlus"),h=$("#itemDescription"),I=$("#itemDescriptionContent"),C=$("#currEditImageId"),w=!1;n.attr("ms-controller",l),$$.currPath.html("资料设置 >> 服务项目");var P=avalon.define({$id:l,items:[],categories:[],opeType:"",opeId:"",confirmContent:"",units:["分钟","小时","天","次"],addPlus:!1,currEditId:"",doClickOfDel:function(e){P.opeId=e,P.opeType="del",P.confirmContent="确认删除此项目？",a.show()},doClickOfRemoveIndex:function(e){P.opeId=e,P.opeType="removeIndex",P.confirmContent="确定要将此项目移除出首页吗？",a.show()},doClickOfEdit:function(e){var i=P.items[e];P.currEditId=i.id,C.val(i.image),c.val(i.name),m.val(i.price),u.val(i.duration),g.val(i.durationUnit),h.val(i.description),I.html(i.description),""!=i.pricePlus?(P.addPlus=!0,p.val(i.pricePlus),v.val(i.durationPlus),f.val(i.durationUnitPlus)):(P.addPlus=!1,p.val(""),v.val("")),i.imageUrl?(s.load(i.imageUrl,{autoCropArea:1,disabled:!0}),r.addClass("hasImg")):(s.clean(),r.removeClass("hasImg")),t(i.categoryId),o.show()},doClickAddPlus:function(){P.addPlus=!0},doClickRemovePlus:function(){P.addPlus=!1}});a=new Modal($("#confirmModal"),{doClickOkBtn:function(){a.close(),"del"==P.opeType?$.ajax({url:"club/service/item/delete",data:{id:P.opeId},success:function(e){200==e.statusCode?(msgAlert("删除成功！",!0),i()):msgAlert(e.message)}}):$.ajax({url:"club/service/item/devaluation",data:{recommended:"Y",id:P.opeId},success:function(e){200==e.statusCode?(msgAlert(e.msg,!0),i()):msgAlert(e.msg)}})}}),o=new Modal($("#editItemModal"),{doClickOkBtn:function(){if(e()){h.val(I.html());var t=s.checkSelectionValidate();if("OK"!=t)return void o.showTip(t);o.loading(),r.ajaxSubmit({dataType:"json",success:function(e){200==e.statusCode?(msgAlert("修改成功！",!0),o.close(),i()):o.showTip(e.message||"操作失败！")},complete:function(e){o.loading("hide"),400==e.status&&o.showTip("您选择的裁剪区域过大！请通过鼠标缩小区域！")}})}}}),$("#editForm").on("input","div.price>input",function(){/\D/.test(this.value)&&(this.value=this.value.replace(/\D/g,"")),this.value.length>6&&(this.value=this.value.substr(0,6))}),s=new iCropper({imgFile:$("#uploadImgBtn")[0],img:$("#editForm>div.img>img")[0],imgName:$("#imgFileName")[0],imgId:$("#currEditImageId")[0],selectionTxt:$("#editForm>div.img>span.selectionTxt")[0],maxWidth:580,maxHeight:230,x:$("#x")[0],y:$("#y")[0],w:$("#w")[0],h:$("#h")[0],imgWidth:324,imgHeight:324,ratioW:1,ratioH:1,onImgLoad:function(){r.hasClass("hasImg")||r.addClass("hasImg")}}),$("#serviceItemList").dragsort({dragSelector:"li",dragSelectorExclude:"div>ul>li",dragEnd:function(){for(var e=$(this),i=e.parents("ul").children(),t=[],a=0;a<i.length;a++)t.push(i[a].getAttribute("itemId"));$.ajax({url:"club/service/top/sort",type:"post",data:{ids:t.join(",")},success:function(e){200==e.statusCode&&msgAlert("排序成功！",!0)}})}}),i()});