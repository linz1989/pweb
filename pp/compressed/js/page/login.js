function iSessionStorage(e,o){if(sessionStorage&&sessionStorage.setItem&&sessionStorage.getItem){if(!o)return sessionStorage.getItem(e);sessionStorage.setItem(e,o)}return!1}function cookie(e,o,i){if(e){var t,n=new RegExp("(^| )"+e+"=([^;]*)(;|$)");if(null==o)return(t=document.cookie.match(n))?decodeURIComponent(t[2]):null;i||(i=10);var s=new Date;s.setTime(s.getTime()+24*i*60*60*1e3),document.cookie=e+"="+encodeURIComponent(o)+";expires="+s.toGMTString()}}function clearCookie(e){var o,i,t=new RegExp("(^| )"+e+"=([^;]*)(;|$)"),n=new Date;n.setTime(n.getTime()-1),(o=document.cookie.match(t))&&(i=decodeURIComponent(o[2])),i&&(document.cookie=e+"="+i+";expires="+n.toGMTString())}$(function(){function e(){return i.val()&&t.val()?(n.addClass("active"),!0):(n.removeClass("active"),!1)}var o=$("#login-dialog>form>div.remember"),i=$("#user-name"),t=$("#user-pw"),n=$("#login-dialog>form>input.btn"),s=$("#login-dialog>form>div.info");o.click(function(){$(this).toggleClass("active")}),i.on("input",function(){this.value.length>45&&(this.value=this.value.substr(0,45)),e()}),t.on("input",function(){this.value.length>45&&(this.value=this.value.substr(0,45)),e()}),n.click(function(){return/active/.test(n[0].className)&&e()?(o.hasClass("active")?(cookie("loginUserName",i.val()),cookie("loginUserPw",t.val())):(clearCookie("loginUserName"),clearCookie("loginUserPw")),iSessionStorage("spaLastLoginTimestamp",+new Date),!0):(i.val()?t.val()||t.focus():i.focus(),!1)}),$("body").on("keypress",function(e){13==e.keyCode&&n.click()}),i.val(cookie("loginUserName")),t.val(cookie("loginUserPw")),e(),i.val()?t.val()||t.focus():i.focus();var a=iSessionStorage("spaLastLoginTimestamp");a&&+new Date-a<2e3&&(s.show(),setTimeout(function(){s.hide()},4e3))});