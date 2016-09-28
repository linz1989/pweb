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
            i, k, reg = new RegExp(pageParam.key);

        for(i=0;i<pdata.length;i++){
            if(pdata[i]["id"] == pageParam.type || pageParam.type=="" ){
                contentHtmlStr += "<div id='product_category_"+pdata[i]["id"]+"'>";
                if(pageParam.type != "") $("#product-type").html("<a href='product.html#"+pdata[i]["id"]+"'>"+pdata[i]["text"]+"</a>");
                if(pdata[i].list){
                    contentHtmlStr += generateHtml(pdata[i],reg);
                }
                else if(pdata[i].category){
                    for(k=0;k<pdata[i].category.length;k++){
                        contentHtmlStr += generateHtml(pdata[i].category[k],reg);
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
    });

    function generateHtml(pObj,reg){
        var k, contentHtmlStr = "";
        for(k=0;k<pObj["list"].length;k++){
            if(reg.test(pObj["list"][k].title) || reg.test(pObj["list"][k].description)){
                contentHtmlStr +="<div class='item' pid='"+pObj["list"][k].id+"'>\
                        <img src='"+pObj["list"][k].img+"' />\
                        <h4>"+pObj["list"][k].title+"</h4>\
                        <p>"+pObj["list"][k].description+"</p>\
                    </div>";
            }
        }
        return contentHtmlStr;
    }
})