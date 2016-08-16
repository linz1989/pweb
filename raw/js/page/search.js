$(function(){
    var lang = $("body").attr("data-lang"),
        $rightContentList,
        content = $("div.content-wrap>div"),
        pageParam = getParam();

    pageParam.type = pageParam.type || "";
    pageParam.key = pageParam.key || "";
    $("#key-word").html(pageParam.key);

    /////获取产品数据
    $.get("../json/product_"+lang+".json",{ "_t" : (+new Date())},function(res){
        var pdata = res.products,
            contentHtmlStr = "",
            i, k;

        for(i=0;i<pdata.length;i++){
            if(pdata[i]["id"] == pageParam.type || pageParam.type=="" ){
                contentHtmlStr += "<div id='product_category_"+pdata[i]["id"]+"'>";
                if(pageParam.type != "") $("#product-type").html("<a href='product.html#"+pdata[i]["id"]+"'>"+pdata[i]["text"]+"</a>");
                var reg = new RegExp(pageParam.key);
                for(k=0;k<pdata[i]["list"].length;k++){
                    if(reg.test(pdata[i]["list"][k].title) || reg.test(pdata[i]["list"][k].description)){
                        contentHtmlStr +="<div class='item' pid='"+pdata[i]["list"][k].id+"'>\
                        <img src='"+pdata[i]["list"][k].img+"' />\
                        <h4>"+pdata[i]["list"][k].title+"</h4>\
                        <p>"+pdata[i]["list"][k].description+"</p>\
                    </div>";
                    }
                }
                contentHtmlStr +="</div>";
            }
        }
        if(contentHtmlStr != "") $("#productContent").html(contentHtmlStr);
        $rightContentList = $("#productContent>div");
    },"json");

    $("#productContent").on("click","div>div.item",function(){
        location.href="detail.html?pid="+this.getAttribute("pid");
    })
})