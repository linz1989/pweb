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
    var now =(+new Date()),
        appKey = SHA1("A6925251770173"+"UZ"+"35E25FEA-86D2-D271-C6CB-68EEC80020B2"+"UZ"+now)+"."+now;

    $.ajax({
        "url": "https://d.apicloud.com/mcm/api/customer",
        "method": "GET",
        "cache": false,
        "headers": {
            "X-APICloud-AppId": "A6925251770173",
            "X-APICloud-AppKey": appKey
        }
    }).success(function (data, status, header) {
        if(data && data.length>0){
            $("#noDataTab").hide();
            var _html= "";
            for(var i=0;i<data.length;i++){
                _html +="<tr>\
                        <td>"+data[i]["name"]+"</td>\
                        <td>"+data[i]["email"]+"</td>\
                        <td>"+data[i]["tel"]+"</td>\
                        <td>"+data[i]["subject"]+"</td>\
                        <td>"+data[i]["content"]+"</td>\
                        <td>"+data[i]["createdAt"]+"</td>\
                    </tr>"
            }
            $("#dataTab").html(_html);
        }
    }).fail(function (header, status, errorThrown) {
        msgAlert("获取数据出错！")
    });

    $(window).resize(function(){
        doResizeHeight();
    });

    function doResizeHeight(){
        console.log("wh:"+$(window).height()+"bh:"+$("body").height());
    }

    doResizeHeight();
})