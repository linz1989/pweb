/**
 * Created by andy on 14-12-25.
 */
/**
 *
 *  Secure Hash Algorithm (SHA1)
 *  http://www.webtoolkit.info/
 *
 **/

function SHA1(msg) {

    function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };

    function lsb_hex(val) {
        var str = "";
        var i;
        var vh;
        var vl;

        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };

    function cvt_hex(val) {
        var str = "";
        var i;
        var v;

        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };


    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var blockstart;
    var i, j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A, B, C, D, E;
    var temp;

    msg = Utf8Encode(msg);

    var msg_len = msg.length;

    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
            msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }

    switch (msg_len % 4) {
        case 0:
            i = 0x080000000;
            break;
        case 1:
            i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
            break;

        case 2:
            i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
            break;

        case 3:
            i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
            break;
    }

    word_array.push(i);

    while ((word_array.length % 16) != 14) word_array.push(0);

    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);


    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {

        for (i = 0; i < 16; i++) W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++) W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);

        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;

        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }

        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;

    }

    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();

}
//*********************************************************************
// 检测是否支持某个CSS3样式的方法
//*********************************************************************
function isSupportCss3(style) {
    var prefix = ['webkit', 'Moz', 'ms', 'o'],
        i,
        humpString = [],
        htmlStyle = document.documentElement.style,
        _toHumb = function (string) {
            return string.replace(/-(\w)/g, function ($0, $1) {
                return $1.toUpperCase();
            });
        };

    for (i in prefix) {
        humpString.push(_toHumb(prefix[i] + '-' + style));
    }
    humpString.push(_toHumb(style));

    for (i in humpString)
        if (humpString[i] in htmlStyle) return true;
    return false;
}

function isPC() {
    var userAgentInfo = navigator.userAgent,
        Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"],
        flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

//********************************************************************
//对localStorage的封装
//*******************************************************************
function ls(key,value){
    if(localStorage){
        if(value){
            if(localStorage.setItem) return localStorage.setItem(key,value);
        }
        else if(localStorage.getItem){
            return localStorage.getItem(key);
        }
    }
    return false;
}

//********************************************************************
//获取地址栏参数
//*******************************************************************
function getParam(){
    var paramObj = {},
        paramArr = [],
        i,
        arr,
        paramUrl = location.href.split("?")[1];
    if(paramUrl){
        paramArr = paramUrl.split("&");
        for(i=0;i<paramArr.length;i++){
            arr = paramArr[i].split("=");
            if(arr.length==2){
                paramObj[arr[0]] = decodeURIComponent(arr[1]);
            }
        }
    }
    return paramObj;
}

$(function () {
    var $win = $(window), supportTouch = !isPC();
    
    //////////////////////////////////////////////////////////menu
    var lang = $("body").attr("data-lang"),i;
    ls("sunshine-visit-lang",lang);
    $.get("../json/menu_"+lang+".json",{ "_t" : (+new Date())},function(res) {
        var htmlStr = "";
        ////////////////////////////////////////////////////solution menu
        var solutionMenuData = res.solutionMenu;
        for(i=0;i<solutionMenuData.length;i++){
            htmlStr += "<li><a href='solution.html#"+solutionMenuData[i]["id"]+"'>"+solutionMenuData[i]["text"]+"</a></li>";
        }
        $("#solution-menu").html(htmlStr);

        ////////////////////////////////////////////////////product menu
        var productMenuData = res.productMenu;
        htmlStr = "";
        for(i=0;i<productMenuData.length;i++){
            htmlStr += "<li><a href='product.html#"+productMenuData[i]["id"]+"'>"+productMenuData[i]["text"]+"</a></li>";
        }
        $("#product-menu").html(htmlStr);
    });

    ////////////////////////////////////////////////////////////语言
    $("div.top-wrap>ul").on("click","li",function(){
       location.href="../"+this.getAttribute("lang")+"/index.html";
    });

    ///////////////////////////////////////////////////////////点击菜单弹出
    var menuListArr = $("div.menu-wrap>div>ul>li");
    menuListArr[supportTouch ? "click" : "hover"](function(event){ doHandlerMenu(this); event.stopPropagation(); });
    if(supportTouch){
        $("div.menu-wrap>div>ul>li>a.touch").removeAttr("href");
    }
    function doHandlerMenu(menu){
        if(menu.className != "active"){
            menuListArr.removeClass("active");
            menu.className = "active";
        }
        else menu.className = "";
    }

    ////////////////////////////////////////////////////////////滚动条的监听
    var menu = $("body>div.menu-wrap"),
        backBtn = $("div.side-bar>ul>li.back");

    $win.scroll(function(){
        var scrollTop = $win.scrollTop();
        if(!supportTouch){
            if(scrollTop>112 && $win.width()>=1000){
                if(!menu.hasClass("fixed")){
                    menu.addClass("fixed");
                }
            }
            else{
                if(menu.hasClass("fixed")){
                    menu.removeClass("fixed");
                }
            }
        }

        if(backBtn[0]){
            if(scrollTop>112){
                backBtn.removeClass("hide");
            }
            else{
                backBtn.addClass("hide");
            }
        }
    });

    if($win.scrollTop()>112 ){
        if(!supportTouch) menu.addClass("fixed");
        backBtn.removeClass("hide");
    }
});
//////////////////////////////Modal
function Modal(ele,option){
    this.ele = ele;
    this.option = option = option || {};

    var thisModel = this;
    var closeTag = this.ele.find("div>h3.header>span"),
        cancelBtn = this.ele.find("div>div.footer>a.cancel"),
        okBtn = this.ele.find("div>div.footer>a.ok");
    if(closeTag[0]){
        closeTag.click(function(){ thisModel.close() });
    }
    if(okBtn[0] && option.doClickOkBtn){
        okBtn.click(function(){
            option.doClickOkBtn();
        });
    }
    if(cancelBtn[0]){
        if(option.doClickCancelBtn){
            cancelBtn.click(function(){
                option.doClickCancelBtn();
            });
        }
        else cancelBtn.click(function(){ thisModel.close() });
    }

    this.tip = this.ele.find("div>div.footer>span.tip");
    this.ele.children("div").append("<div class='mask'><div><i></i><i></i><i></i><i></i><i></i></div></div>");
}
Modal.prototype.show = function(str){
    if(str) this.ele.find("div>div.content").html(str);
    this.ele.css("display","block");
    this.ele.removeClass("loading");
    var ele = this.ele;
    setTimeout(function(){
        ele.addClass("active");
    },30);
};
Modal.prototype.close = function(){
    this.ele.removeClass("active");
    var ele = this.ele;
    setTimeout(function(){
        ele.css("display","none");
    },500);
    if(this.option.afterClose) this.option.afterClose();
};
Modal.prototype.loading = function(type){
    type = type || "show";
    if(type=="show") this.ele.addClass("loading");
    else this.ele.removeClass("loading");
};
Modal.prototype.showTip = function(tipStr,isOk){
    if(this.tip && this.tip[0]){
        if(tipStr) this.tip.text(tipStr);
        isOk===true ? this.tip.addClass("ok") : this.tip.removeClass("ok");
        this.tip.show();
        var tipEle = this.tip;
        setTimeout(function(){ tipEle.hide() },3000)
    }
};
Modal.prototype.hideClose = function(){
    this.ele.find("div>h3.header>span").hide();
};

//////全局的提示，延时time之后消失
function msgAlert(msg,tag,time){
    time = time || 2000;
    tag = (tag ? "success" : "fail" );
    var $box = $('<div class="msgBox"><span><span class="' + tag + '"></span>'+msg+'<span class="end"></span></span></div>');
    $("body").append($box);
    $box.show(0);
    setTimeout(function(){ $box.remove() },time)
}

$(function(){
    var userName = $("#user-name"),
        userEmail = $("#user-email"),
        userTel = $("#user-tel"),
        userSubject = $("#user-subject"),
        userContent = $("#user-content"),
        contactZone = $("#contact-modal");

    var successTip = contactZone.attr("success-tip"),
        failTip = contactZone.attr("fail-tip"),
        emailErrorTip = userEmail.attr("email-error-tip");

    var contactModal = new Modal(contactZone,{
        doClickOkBtn : function(){
            if(checkForm()){
                contactModal.loading();

                var now =(+new Date()),
                    appKey = SHA1("A6925251770173"+"UZ"+"35E25FEA-86D2-D271-C6CB-68EEC80020B2"+"UZ"+now)+"."+now;

                $.ajax({
                    "url": "https://d.apicloud.com/mcm/api/customer",
                    "method": "POST",
                    "cache": false,
                    "headers": {
                        "X-APICloud-AppId": "A6925251770173",
                        "X-APICloud-AppKey": appKey
                    },
                    "data": {
                        "name": userName.val(),
                        "email": userEmail.val(),
                        "tel": userTel.val(),
                        "subject" : userSubject.val(),
                        "content" : userContent.text()
                    }
                }).success(function (data, status, header) {
                    contactModal.loading("hide");
                    userName.val("");
                    userEmail.val("");
                    userTel.val("");
                    userSubject.val("");
                    userContent.html("");
                    contactModal.close();
                    msgAlert(successTip,true);
                }).fail(function (header, status, errorThrown) {
                    msgAlert(failTip);
                })
            }
        }
    });

    $("#contact_building_btn,#contact_support_btn").click(function(){
        contactModal.show();
    });

    function checkForm(){
        if(!userName.val()){
            userName.focus();
            return false;
        }
        if(userEmail.val() && !/^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(userEmail.val())){
            userEmail.focus();
            contactModal.showTip(emailErrorTip);
            return false;
        }
        if(!userSubject.val()){
            userSubject.focus();
            return false;
        }
        if(!userContent.text()){
            userContent.focus();
            return false;
        }
        return true;
    }

    userTel.on("input",function(){
        if (/[^+\d]/.test(this.value)) {
            this.value = this.value.replace(/[^+\d]/g, '');
        }
        /*if (this.value.length == 1 && this.value != 1) {
            this.value = "";
        }
        if (this.value.length == 2 && !/^1[34578]$/.test(this.value)) {
            this.value = 1;
        }
        if (this.value.length > 11) {
            this.value = this.value.substring(0, 11);
        }*/
    });

    $("#loading").removeClass("active");
})