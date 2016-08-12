KindEditor.plugin("media",function(e){var t=this,a="media",i=t.lang(a+"."),l=e.undef(t.allowMediaUpload,!0),n=e.undef(t.allowFileManager,!1),d=e.undef(t.formatUploadUrl,!0),o=e.undef(t.extraFileUploadParams,{}),r=e.undef(t.filePostName,"imgFile"),u=e.undef(t.uploadJson,t.basePath+"php/upload_json.php");t.plugin.media={edit:function(){var s=['<div style="padding:20px;">','<div class="ke-dialog-row">','<label for="keUrl" style="width:60px;">'+i.url+"</label>",'<input class="ke-input-text" type="text" id="keUrl" name="url" value="" style="width:160px;" /> &nbsp;','<input type="button" class="ke-upload-button" value="'+i.upload+'" /> &nbsp;','<span class="ke-button-common ke-button-outer">','<input type="button" class="ke-button-common ke-button" name="viewServer" value="'+i.viewServer+'" />',"</span>","</div>",'<div class="ke-dialog-row">','<label for="keWidth" style="width:60px;">'+i.width+"</label>",'<input type="text" id="keWidth" class="ke-input-text ke-input-number" name="width" value="550" maxlength="4" />',"</div>",'<div class="ke-dialog-row">','<label for="keHeight" style="width:60px;">'+i.height+"</label>",'<input type="text" id="keHeight" class="ke-input-text ke-input-number" name="height" value="400" maxlength="4" />',"</div>",'<div class="ke-dialog-row">','<label for="keAutostart">'+i.autostart+"</label>",'<input type="checkbox" id="keAutostart" name="autostart" value="" /> ',"</div>","</div>"].join(""),p=t.createDialog({name:a,width:450,height:230,title:t.lang(a),body:s,yesBtn:{name:t.lang("yes"),click:function(a){var i=e.trim(g.val()),l=m.val(),n=v.val();if("http://"==i||e.invalidUrl(i))return alert(t.lang("invalidUrl")),void g[0].focus();if(!/^\d*$/.test(l))return alert(t.lang("invalidWidth")),void m[0].focus();if(!/^\d*$/.test(n))return alert(t.lang("invalidHeight")),void v[0].focus();var d=e.mediaImg(t.themesPath+"common/blank.gif",{src:i,type:e.mediaType(i),width:l,height:n,autostart:f[0].checked?"true":"false",loop:"true"});t.insertHtml(d).hideDialog().focus()}}}),c=p.div,g=e('[name="url"]',c),h=e('[name="viewServer"]',c),m=e('[name="width"]',c),v=e('[name="height"]',c),f=e('[name="autostart"]',c);if(g.val("http://"),l){var k=e.uploadbutton({button:e(".ke-upload-button",c)[0],fieldName:r,extraParams:o,url:e.addParam(u,"dir=media"),afterUpload:function(i){if(p.hideLoading(),0===i.error){var l=i.url;d&&(l=e.formatUrl(l,"absolute")),g.val(l),t.afterUpload&&t.afterUpload.call(t,l,i,a),alert(t.lang("uploadSuccess"))}else alert(i.message)},afterError:function(e){p.hideLoading(),t.errorDialog(e)}});k.fileBox.change(function(e){p.showLoading(t.lang("uploadLoading")),k.submit()})}else e(".ke-upload-button",c).hide();n?h.click(function(a){t.loadPlugin("filemanager",function(){t.plugin.filemanagerDialog({viewType:"LIST",dirName:"media",clickFn:function(a,i){t.dialogs.length>1&&(e('[name="url"]',c).val(a),t.afterSelectFile&&t.afterSelectFile.call(t,a),t.hideDialog())}})})}):h.hide();var b=t.plugin.getSelectedMedia();if(b){var w=e.mediaAttrs(b.attr("data-ke-tag"));g.val(w.src),m.val(e.removeUnit(b.css("width"))||w.width||0),v.val(e.removeUnit(b.css("height"))||w.height||0),f[0].checked="true"===w.autostart}g[0].focus(),g[0].select()},"delete":function(){t.plugin.getSelectedMedia().remove(),t.addBookmark()}},t.clickToolbar(a,t.plugin.media.edit)});