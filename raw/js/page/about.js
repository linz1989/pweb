$(function(){
    var lang = $("body").attr("data-lang");
    $.get("../json/about_"+lang+".html",{},function(res){
        $("div.content-wrap>div").html(res);
        $("#loading").removeClass("active");
    },"text");
})