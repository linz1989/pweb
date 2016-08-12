function iSessionStorage(key, value) {//expires :单位ms
    if(sessionStorage && sessionStorage.setItem && sessionStorage.getItem){
        if (value) {
            sessionStorage.setItem(key, value);
        } else {
            return sessionStorage.getItem(key);
        }
    }
    return false;
}

function cookie(name, value, expireDay) {
    if (!name) return;
    var arr,  reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if (value == null) {//获取cookie
        if (arr = document.cookie.match(reg)) return decodeURIComponent(arr[2]);
        return null;
    } else { //设置cookie
        if (!expireDay) expireDay = 10;
        var exp = new Date();
        exp.setTime(exp.getTime() + expireDay * 24 * 60 * 60 * 1000);
        document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + exp.toGMTString();
    }
}

function clearCookie(name) {
    var arr, reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)'), exp = new Date(), cVal;
    exp.setTime(exp.getTime() - 1);
    if (arr = document.cookie.match(reg)) cVal = decodeURIComponent(arr[2]);
    if (cVal) document.cookie = name + '=' + cVal + ';expires=' + exp.toGMTString();
}

$(function(){
    var rememberCheckbox = $("#login-dialog>form>div.remember"),
        userName = $("#user-name"),
        userPw = $("#user-pw"),
        loginBtn = $("#login-dialog>form>input.btn"),
        errorInfo = $("#login-dialog>form>div.info");

    rememberCheckbox.click(function(){
        $(this).toggleClass("active");
    });

    userName.on("input",function(){
        if(this.value.length>45) this.value = this.value.substr(0,45);
        checkValidate();
    });

    userPw.on("input",function(){
        if(this.value.length>45) this.value = this.value.substr(0,45);
        checkValidate();
    });

    function checkValidate(){
        if(userName.val() && userPw.val()){
            loginBtn.addClass("active");
            return true;
        }
        else{
            loginBtn.removeClass("active");
            return false;
        }
    }

    loginBtn.click(function(){
        if(!/active/.test(loginBtn[0].className) || !checkValidate()){
            if(!userName.val()) userName.focus();
            else if(!userPw.val()) userPw.focus();
            return false;
        }

        ////////////////////////记住用户名密码
        if(rememberCheckbox.hasClass("active")){
            cookie("loginUserName",userName.val());
            cookie("loginUserPw",userPw.val());
        }
        else{
            clearCookie("loginUserName");
            clearCookie("loginUserPw");
        }
        iSessionStorage("spaLastLoginTimestamp",(+new Date()));
        return true;

        //////////////////////////////////post提交
        /*$.ajax({
            url : "login",
            type : "post",
            data : { username : userName.val() , password : userPw.val() },
            complete : function(xhr){
                if(xhr.status == 200){
                    location.href = "./";////进入主页
                }
                else{
                    errorInfo.show();////用户名或者密码错误
                    setTimeout(function(){ errorInfo.hide() },4000);
                }
            }
        });*/
    });

    $("body").on("keypress",function(event){
        if(event.keyCode==13){
            loginBtn.click();
        }
    });

    userName.val(cookie("loginUserName"));
    userPw.val(cookie("loginUserPw"));

    checkValidate();
    if(!userName.val()) userName.focus();
    else if(!userPw.val()) userPw.focus();

    var spaLastLoginTimestamp=iSessionStorage("spaLastLoginTimestamp");
    if(spaLastLoginTimestamp && (+new Date())-spaLastLoginTimestamp<2000){
        errorInfo.show();////用户名或者密码错误
        setTimeout(function(){ errorInfo.hide() },4000);
    }
});