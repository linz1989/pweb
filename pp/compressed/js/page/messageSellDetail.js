require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"daterangepicker","!domReady"],function(){function e(e){for(var t=h.templates[e].templateParts,a=h.templates[e].templatePartsParam={},s=0;s<t.length;s++)/^#/.test(t[s])&&(a[t[s].substr(1)]=h.configData.defaults[t[s].substr(1)]||"")}function t(e){return e.getFullYear()+"-"+(e.getMonth()<9?"0":"")+(e.getMonth()+1)+"-"+(e.getDate()<10?"0":"")+e.getDate()}function a(e,t){var a,s,n,i="",l=0,r=0;for(a=0;a<e.length;a++)if(/^#/.test(e[a]))if(n=e[a].substr(1),void 0!=h.configData.dicts[n]){if(i+="<select param='"+n+"'>",h.configData.textTips[n]&&(i+="<option "+(t[n]?"":"selected")+">"+h.configData.textTips[n]+"</option>"),s=h.configData.dicts[n]||[])for(l=0;l<s.length;l++){for(i+="<option pCount='"+s[l].length+"'",r=0;r<s[l].length;r++)i+="p"+r+"='"+s[l][r]+"' ";i+=(s[l][0]==t[n]?"selected":"")+">"+s[l][0]+"</option>"}i+="</select>"}else i+=/^link/.test(n)?"<a param='"+n+"' href='"+t[n]+"' target='_blank'>"+t[n]+"</a>":"<input param='"+n+"' value='"+t[n]+"' maxlength='15' placeholder='"+(h.configData.textTips[n]||"")+"'/>";else i+="<span>"+e[a]+"</span>";return i}function s(e,t,a){var s,n=p.find("a[param='"+t.associate+"']"),i=t.requestUrl,l=e.getAttribute("pCount");if(l){for(l=parseInt(l),s=0;s<l;s++)i=i.replace("("+a+"["+s+"])",e.getAttribute("p"+s));$.get(i,{refresh:Date.now()},function(e){200==e.statusCode&&n.attr("href",e.respData).html(e.respData)},"json")}else n.attr("href","").html("")}function n(e,t){u.id?(u.id=h.msgId=t.respData,location.href="#!/messageSellDetail?id="+u.id+"&editable=false",h.pageState=3,$$.currPath.html("<a href='#!/messageSell'>短信营销 >> 短信详情"),h.sendDateTime=e.sendTime,$("#templateListContainer>tr:eq("+h.templateSelectedIndex+")").siblings().hide()):location.href="#!/messageSell"}function i(e){var t=$("#sendTime").val(),a=t.split("-"),s=new Date,n=$("#setTimeSelector>select");return s.setFullYear(a[0]-0),s.setMonth(a[1]-1),s.setDate(a[2]-0),s.setHours(n[0].value-0),s.setMinutes(n[1].value-0),s.setSeconds(n[2].value-0),e?s:t+" "+n[0].value+":"+n[1].value+":"+n[2].value}function l(){var e={force:"N"};e.params=h.templates[h.templateSelectedIndex].templatePartsParam||{};for(var t in e.params)if(null==e.params[t]||0==e.params[t].length)return null;if(e.params=JSON.stringify(e.params),u.id&&(e.messageId=u.id),e.messageTemplateId=h.templates[h.templateSelectedIndex].id,e.receiverFrom=h.selectedReceiver,4==e.receiverFrom){e.contactGroupIds=[];var a,s=$("#groupsContainer>li.active");for(a=0;a<s.length;a++)e.contactGroupIds.push(s[a].getAttribute("group-id"))}return e.sendTime=i(),e.status=h.messageStatus,e}var r,o,d=$$.rootVm.page+"Ctrl"+ +new Date,c=$("#"+$$.rootVm.page+"Page"),m=$("#sendObjSelector td"),u=getParamObj(),p=$("#editMessageContentModal>div>div.content"),v={},g=!1,f={};c.attr("ms-controller",d);var h=avalon.define({$id:d,pageTitle:"新建短信",pageState:1,pageCount:1,msgId:null,dict:{status:{Y:"启用",N:"禁用"},sendStatus:{Y:"已发送",N:"未发送",I:"发送中",W:"等待发送"},receiverFrom:{1:"活跃用户",2:"有效用户",3:"全部用户",4:"指定用户"},hour:[],min:[],second:[]},configData:null,templates:[],templateSelectedIndex:null,selectedReceiveCount:0,selectedReceiver:1,messageStatus:"Y",sendDateTime:"",showEditModal:function(t){if(3!=h.pageState){h.templateSelectedIndex=t,p.attr("template-index",t);var n=$("#templateListContainer>tr:eq("+t+")>td>div.checkbox");n.hasClass("active")||($("#templateListContainer div.checkbox").removeClass("active"),n.addClass("active"));var i=h.templates[t].templateParts;h.templates[t].templatePartsParam||e(t);var l=a(i,h.templates[t].templatePartsParam);p.html(l);for(var o,d,c,m=p.find("select"),u=0;u<m.length;u++)m[u]&&(o=$(m[u]),d=o.attr("param"),v[d]&&(c=o.find("option:selected"),c[0]&&s(c[0],v[d],d)));r.show()}},doClickBackBtn:function(){u.id||null==h.templateSelectedIndex||""==h.templateSelectedIndex?location.href="#!/messageSell":($("#confirmSaveSendModal>div>h3").text("是否存为草稿"),$("#confirmSaveSendModal>div>div.content").text("是否存为禁用的草稿，以方便下次修改及启用？").attr("type","save"),$("#confirmSaveSendModal>div>div.footer>a:eq(0)").text("保存"),$("#confirmSaveSendModal>div>div.footer>a:eq(1)").text("不保存"),o.show())},doClickOKBtn:function(){if(null==h.templateSelectedIndex)return void msgAlert("请选择短信模板！");var e=l();if(null==e)return void msgAlert("请完善短信内容！");if(!g){g=!0;var t=i(!0);(new Date).getTime()>t&&"Y"==h.messageStatus?($("#confirmSaveSendModal>div>h3").text("提示"),$("#confirmSaveSendModal>div>div.content").text("发送时间错误，是否立即发送？").attr("type","send"),$("#confirmSaveSendModal>div>div.footer>a:eq(0)").text("发送"),$("#confirmSaveSendModal>div>div.footer>a:eq(1)").text("不发送"),o.show()):$.ajax({url:"message/save",data:e,type:"post",traditional:!0,success:function(t){g=!1,msgAlert(t.msg,200==t.statusCode),200==t.statusCode&&n(e,t)}})}},doRenderedOfTemplate:function(){f.messageTemplateId&&($("#templateListContainer tr[template-id="+f.messageTemplateId+"]").find("div.checkbox").addClass("active"),h.templateSelectedIndex=$("#templateListContainer div.checkbox.active").parents("tr").attr("template-index"),null!=h.templateSelectedIndex&&e(h.templateSelectedIndex),delete f.messageTemplateId)},doRenderedGroups:function(){if(f.contactGroupIds){var e,t=$("#groupsContainer>li"),a={},s=f.contactGroupIds.split(",");for(e=0;e<s.length;e++)a[s[e]]=!0;var n=0;for(e=0;e<t.length;e++)a[t[e].getAttribute("group-id")]&&(t[e].className="active",n+=parseInt(t[e].getAttribute("count")));h.selectedReceiveCount=n,delete f.contactGroupIds}},doRenderedHour:function(){f.hour&&($("#setTimeSelector>select:eq(0)").val(f.hour),delete f.hour)},doRenderedMin:function(){f.min&&($("#setTimeSelector>select:eq(1)").val(f.min),delete f.min)},doRenderedSecond:function(){f.second&&($("#setTimeSelector>select:eq(2)").val(f.second),delete f.second)}});if(r=new Modal($("#editMessageContentModal"),{doClickOkBtn:function(){for(var e,t,a=p[0].children,s="",n=p.attr("template-index"),i=h.templates[n].templatePartsParam,l=0;l<a.length;l++)if(e=a[l].getAttribute("param")){if("a"!=a[l].tagName.toLowerCase()?(s+=a[l].value,"select"==a[l].tagName.toLowerCase()?(t=$(a[l]).find("option:selected"),t.length>0&&t.attr("pCount")&&(i[e]=t.text())):i[e]=a[l].value):(s+=a[l].innerHTML,i[e]=a[l].innerHTML),!i[e])return void msgAlert("短信内容不完整！")}else s+=a[l].innerHTML;h.templates[n].template=s,r.close()}}),p.on("change","select",function(){var e=$(this),t=e.attr("param");if(v[t]){var a=e.find("option:selected");a[0]&&s(a[0],v[t],t)}}),o=new Modal($("#confirmSaveSendModal"),{doClickOkBtn:function(){var e=$("#confirmSaveSendModal>div>div.content").attr("type"),t=l();return null==t?void msgAlert("请完善短信内容！"):void("save"==e?(t.status="N",$.ajax({url:"message/save",data:t,type:"post",traditional:!0,success:function(e){msgAlert(e.msg,200==e.statusCode),o.close(),200==e.statusCode&&n(t,e)}})):"send"==e&&(t.force="Y",$.ajax({url:"message/save",data:t,type:"post",traditional:!0,success:function(e){msgAlert(e.msg,200==e.statusCode),o.close(),200==e.statusCode&&n(t,e),g=!1}})))},doClickCancelBtn:function(){o.close();var e=$("#confirmSaveSendModal>div>div.content").attr("type");"save"==e&&(location.href="#!/messageSell")}}),u.id?(h.msgId=u.id,"false"==u.editable?(h.pageState=3,h.pageTitle="短信详情"):(h.pageState=2,h.pageTitle="编辑短信")):(h.pageState=1,h.pageTitle="新建短信"),$$.currPath.html("营销中心 >> <a href='#!/messageSell'>短信营销 >> "+h.pageTitle),3!=h.pageState){for(var S=[],C=[],x=[],I=0;I<60;I++)I<24&&S.push((I<10?"0":"")+I),C.push((I<10?"0":"")+I),x.push((I<10?"0":"")+I);h.dict.hour=S,h.dict.min=C,h.dict.second=x,$("#groupsContainer").on("click","li",function(){var e=$(this);e.hasClass("active")?e.removeClass("active"):e.addClass("active");var t,a=$("#groupsContainer>li.active"),s=0;for(t=0;t<a.length;t++)s+=parseInt(a[t].getAttribute("count"));h.selectedReceiveCount=s}),m.click(function(){var e=$(this);if(!e.hasClass("active"))if(m.removeClass("active"),e.addClass("active"),h.selectedReceiver=e.attr("receiver"),"undefined"!=typeof e.attr("count"))h.selectedReceiveCount=e.attr("count"),$("#groupsContainer>li").removeClass("active");else{var t,a=e.find("ul>li.active"),s=0;for(t=0;t<a.length;t++)s+=parseInt(a[t].getAttribute("count"));h.selectedReceiveCount=s}}),$("#setStatusSelector>div").click(function(){var e=$(this);e.hasClass("active")?(e.removeClass("active"),h.messageStatus="N"):(e.addClass("active"),h.messageStatus="Y")});var T={};u.id&&(T.messageId=u.id),$.ajax({url:"message/edit",data:T,success:function(e){if(200==e.statusCode){if(e=e.respData,e.linkageFields){var a,s,n;for(a in e.linkageFields)s=e.linkageFields[a],s&&(n=s.split(">="),n[0]=n[0].slice(1,-1),v[n[0]]={associate:a,requestUrl:n[1]})}h.configData=e,h.templates=e.templates;var i,l=new Date;if(u.id){f.messageTemplateId=e.message.messageTemplateId,$("#sendObjSelector>table>tbody td:eq("+(e.message.receiverFrom-1)+")").addClass("active"),h.selectedReceiver=e.message.receiverFrom,4==e.message.receiverFrom&&(f.contactGroupIds=e.message.contactGroupIds),h.selectedReceiveCount=e.message.receiverNum,i=e.message.sendTime.split(" ");var r=i[0].split("-");i=i[0],l.setFullYear(r[0]-0),l.setMonth(r[1]-1),l.setDate(r[2]-0)}else $("#sendObjSelector>table>tbody td:eq(0)").addClass("active"),h.selectedReceiveCount=e.counts[1],h.templateSelectedIndex=null;$("#sendTime").val(i||t(new Date)),$("#sendTime").daterangepicker({singleDatePicker:!0,timePicker:!1,startDate:l,locale:{format:"YYYY-MM-DD",separator:" - "}}),h.templateSelectedIndex&&(f.templateSelectedIndex=h.templateSelectedIndex),u.id&&(r=e.message.sendTime.split(" ")[1].split(":"),f.hour=r[0],f.min=r[1],f.second=r[2],h.messageStatus=e.message.status),avalon.scan(c[0])}else msgAlert(e.msg||"数据查询失败！"),setTimeout(function(){location.href="#!/messageSell"},2e3)}})}else $.ajax({url:"message/get/"+u.id,success:function(e){200==e.statusCode?(e=e.respData,h.templates.push(e.template),h.sendDateTime=e.message.sendTime,h.selectedReceiver=e.message.receiverFrom,h.selectedReceiveCount=e.message.receiverNum,avalon.scan(c[0]),$("#templateListContainer").find("div.checkbox").addClass("active")):msgAlert(e.msg||"详情数据查询失败！")}})});