require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){function e(e,t,i){e=e||1,$.ajax({url:"club/finacial/user/deal/list",type:"post",data:{page:e,pageSize:r,showOperator:"N",businessCategory:n.selectType||"",userName:$("#userTelSearch").val()||""},success:function(t){200==t.statusCode&&(n.dataList=t.respData,a.refresh({currPage:e,totalPage:t.pageCount}),avalon.scan(s[0]))}})}var a,t=$$.rootVm.page+"Ctrl"+ +new Date,s=$("#"+$$.rootVm.page+"Page"),r=20,i={consume:"账户消费",user_recharge:"线上充值",pay_for_other:"请客核销",line_recharge:"线下充值"};s.attr("ms-controller",t),$$.currPath.html("数据统计 >> <a href='#!/accountDataStatistics'>账户统计</a> >> 充值记录"),avalon.filters.bizTypeFilter=function(e){return i[e]||""};var n=avalon.define({$id:t,dataList:[],selectType:"",searchTel:"",switchType:function(){n.selectType=this.value,e()},doClickSearch:function(){e()}});a=new Pagination($("#dataListPagination"),{switchPage:function(a){e(a)}}),$("#dataListTable>table>thead>tr:eq(0)>th>div>select").on("change",function(){r=this.value,e()}),$("#userTelSearch").on("input",function(){/\D/.test(this.value)&&(this.value=this.value.replace(/\D/g,"")),this.value.length>11&&(this.value=this.value.substr(0,11))}).on("keypress",function(a){13==a.keyCode&&e()}),e()});