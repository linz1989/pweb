function isSupportCss3(t){var e,n=["webkit","Moz","ms","o"],o=[],r=document.documentElement.style,i=function(t){return t.replace(/-(\w)/g,function(t,e){return e.toUpperCase()})};for(e in n)o.push(i(n[e]+"-"+t));o.push(i(t));for(e in o)if(o[e]in r)return!0;return!1}function ls(t,e){if(localStorage)if(e){if(localStorage.setItem)return localStorage.setItem(t,e)}else if(localStorage.getItem)return localStorage.getItem(t);return!1}function getParam(){var t,e,n={},o=[],r=location.href.split("?")[1];if(r)for(o=r.split("&"),t=0;t<o.length;t++)e=o[t].split("="),2==e.length&&(n[e[0]]=e[1]);return n}$(function(){function t(t){"active"!=t.className?(n.removeClass("active"),t.className="active"):t.className=""}var e=($(window),"ontouchend"in document),n=$("div.menu-wrap>div>ul>li");n[e?"click":"hover"](function(e){t(this),e.stopPropagation()})});