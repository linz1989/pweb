require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"jqform","!domReady"],function(){function e(e){u.currPage=e=e||1,$.ajax({url:"contact/list",data:{page:e,pageSize:u.pageSize},success:function(t){200==t.statusCode?(t.respData=t.respData.groups||[],u.groups=t.respData,a.refresh({currPage:e,totalPage:t.pageCount}),avalon.scan(r[0])):msgAlert(t.msg||"数据查询失败！")}})}var a,t,o,s=$$.rootVm.page+"Ctrl"+ +new Date,r=$("#"+$$.rootVm.page+"Page"),n=$("#groupNameInput"),i=$("#groupFileInput");r.attr("ms-controller",s),$$.currPath.html("营销中心 >> <a href='#!/messageSell'>短信营销 >> 分组管理</a>");var u=avalon.define({$id:s,pageSize:20,currPage:1,groups:[],delGroup:function(e,a){$("#confirmDelGroupModal>div>div.confirmDel").text("确定要删除名称为'"+a+"'的分组？").attr("groupId",e),t.show()},addGroup:function(){n.val(""),i.val(""),$("#groupFileNameSpan").text(""),o.show()},doChangePageSize:function(){u.pageSize=this.value,e()}});a=new Pagination($("#dataListPagination"),{switchPage:function(a){e(a)}}),t=new Modal($("#confirmDelGroupModal"),{doClickOkBtn:function(){t.close(),$.ajax({url:"contact/delete",data:{groupId:$("#confirmDelGroupModal>div>div.confirmDel").attr("groupId")},success:function(a){200==a.statusCode?(msgAlert(a.msg||"删除成功！",!0),e()):msgAlert(a.msg||"删除失败！")}})}}),o=new Modal($("#addNewGroupModal"),{doClickOkBtn:function(){if(0==n.val().length)return o.showTip("请您输入分组名！"),void n.focus();if(0==i[0].files.length)return void o.showTip("请您上传文件！");var a=i[0].files[0];if(a.size>5242880)return void o.showTip("您上传的文件不能大于5M！");var t=a.name.lastIndexOf("."),s="";return t>=0&&(s=a.name.substring(t+1)),/^(xls|xlsx)$/i.test(s)?(o.loading(),void $("#addGroupForm").ajaxSubmit({url:"contact/save",type:"post",dataType:"json",success:function(a){o.loading("hide"),msgAlert(a.msg||"分组创建成功！",200==a.statusCode),200==a.statusCode&&(o.close(),e())},error:function(e){o.loading("hide"),msgAlert(e.msg||"分组创建失败！")}})):void o.showTip("请您上传excel文件！")}}),i.on("change",function(){if(0==i[0].files.length)return o.showTip("请您上传文件！"),void $("#groupFileNameSpan").text("");var e=i[0].files[0];if($("#groupFileNameSpan").text(e.name),e.size>5242880)return void o.showTip("您上传的文件不能大于5M！");var a=e.name.lastIndexOf("."),t="";a>=0&&(t=e.name.substring(a+1)),/^(xls|xlsx)$/i.test(t)||o.showTip("请您上传excel文件！")}),$("#groupNameInput").on("input",function(){this.value.length>15&&(this.value=this.value.substr(0,15))}),e()});