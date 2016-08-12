require(["css!../../compressed/css/page/"+$$.rootVm.page+".css?"+$$.rootVm.currTime,"colorbox","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        pageParam = getParamObj(),
        orderListPagination,
        commentListPagination,
        confirmModal,
        techCategories,
        editServiceItemModal;

    if(!pageParam.id){
        msgAlert("地址栏缺少访问参数！");
        history.back();
    }
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("技师管理 >> <a href='#!/techList'>所有技师</a> >> 技师详情");

    var vm = avalon.define({
        $id : vmId,
        techId : pageParam.id,
        orderList : [],
        techInfoObj : {},
        serviceItems : [],
        albumsNum : 0,
        currQueryStatus : "",
        orderListPageSize : 15,
        commentListPageSize : 15,
        orderStatus : [{ name : "已完成" , value : "complete"} , { name : "待接受" , value : "submit"} , { name : "已接受" , value : "accept"} , { name : "已拒绝" , value : "reject"} ,{ name : "失效" , value : "failure"} ,{ name : "超时" , value : "overtime"}  ],
        commentList : [],
        selectedTab : "order",
        isRecommend : "N",
        opeType : "",
        confirmContent : "",
        albums : "",
        serviceList : [],
        doChangeQueryStatus : function(){
            vm.currQueryStatus = this.value;
            queryOrderList();
        },
        onChangeOrderListPageSize : function(){
            vm.orderListPageSize = this.value;
            queryOrderList();
        },
        onChangeCommentListPageSize : function(){
            vm.commentListPageSize = this.value;
            queryCommentList();
        },
        doChangeTab : function(tab){
            vm.selectedTab = tab;
        },
        doChangeRecommend : function(){
            vm.opeType = "recommend";
            if(vm.isRecommend=="Y"){
                vm.confirmContent = "确定取消该技师的首页推荐？";
            }
            else{
                vm.confirmContent = "确定将该技师推荐到首页？";
            }
            confirmModal.show();
        },
        doDeleteTech : function(){
            vm.opeType = "del";
            vm.confirmContent = "确定将该技师删除？";
            confirmModal.show();
        },
        doClickDeleteComment : function(id){/////删除评论
            $("#confirmModal").attr("commentId",id);
            vm.opeType = "delComment";
            vm.confirmContent = "确定将这条评论删除？";
            confirmModal.show();
        },
        doClickEditServiceItem : function(){/////修改技师服务项目
            editServiceItemModal.show();
        },
        doCategoryAllCheck : function(){/////在类别上全选/全不选
            var changeStatus = this.className=="active" ? "" : "active",
                items = $(this).parents("tbody").find("tr.item>td>i");
            changeStatus ? items.addClass("active") : items.removeClass("active");
            this.className = changeStatus;
        },
        doServiceItemCheck : function(){/////单个项目的勾选切换
            var changeStatus = this.className=="active" ? "" : "active",
                tbody = $(this).parents("tbody"),
                categoryNode =tbody.find("tr.group>td>i");
            this.className = changeStatus;
            if(changeStatus==""){
                categoryNode[0].className = "";
            }
            else{
                if(tbody.find("tr.item>td>i.active").length==tbody.find("tr.item>td>i").length){
                    categoryNode[0].className = "active";
                }
            }
        }
    });

    orderListPagination = new Pagination($("#orderListPagination"),{
        switchPage : function(page){
            queryOrderList(page);
        }
    });

    commentListPagination = new Pagination($("#commentListPagination"),{
        switchPage : function(page){
            queryCommentList(page);
        }
    });

    confirmModal = new Modal($("#confirmModal"),{
        doClickOkBtn : function(){
            if(vm.opeType=="recommend"){
                $.ajax({
                    url : "api/v2/manager/tech/recommend",
                    data : { id : pageParam.id },
                    success : function(res){
                        if(res.statusCode==200){
                            msgAlert(res.msg,true);
                            vm.isRecommend = (vm.isRecommend=="Y" ? "N" : "Y");
                        }
                        else{
                            msgAlert(res.msg);
                        }
                    }
                });
            }
            else if(vm.opeType == "del"){
                $.ajax({
                    url : "tech/delete/"+pageParam.id,
                    success : function(res){
                        confirmModal.close();
                        if(res.statusCode==200){
                            msgAlert(res.message,true);
                            location.href="#!/techList";
                        }
                        else{
                            msgAlert(res.message || "操作失败！");
                        }
                    }
                });
            }
            else if(vm.opeType == "delComment"){
                $.ajax({
                    url : "api/v2/manager/tech/comments/delete",
                    data : { commentId : $("#confirmModal").attr("commentId") },
                    success : function(res){
                        if(res.statusCode == 200){
                            msgAlert(res.msg,true);
                            queryCommentList();
                        }
                        else{
                            msgAlert(res.msg ||"删除失败！");
                        }
                    }
                });
            }
            confirmModal.close();
        }
    });

    function queryData(refreshServiceItem){
        $.ajax({
            url : "tech/update/data",
            type : "post",
            data : { id : pageParam.id , ajax : 1 },
            success : function(res){
                if(res && res.data){
                    if(refreshServiceItem===true){
                        if(res.category){
                            doHandlerCategory(res);
                            queryAllServiceItem();
                        }
                    }
                    else{
                        vm.isRecommend = res.data.recommend || "N";
                        vm.techInfoObj = res.data;
                        vm.albums = res.albums || [];
                        if(res.category){
                            doHandlerCategory(res);
                        }
                        if(res.albums){
                            vm.albumsNum = res.albums.length;
                        }
                        avalon.scan(thisPage[0]);
                        $("a.techHeader").colorbox({ rel : 'techHeader' , maxWidth : '90%', maxHeight : '90%' });
                        queryAllServiceItem();
                    }
                }
                else{
                    msgAlert("数据查询失败！");
                    history.back();
                }
            }
        });
    }

    function doHandlerCategory(res){
        var items, k;
        for(var i=0;i<res.category.length;i++){
            items = [];
            for(k=0;k<res.category[i].serviceItems.length;k++){
                items.push(res.category[i].serviceItems[k].name);
            }
            res.category[i].items = items.join("、");
        }
        techCategories = res.category;
        vm.serviceItems = res.category;
    }

    function queryOrderList(page){
        page  = page || 1;
        $.ajax({
            url : "api/v2/manager/tech/orders",
            type : "post",
            data : {
                techId : pageParam.id,
                page : page,
                pageSize : vm.orderListPageSize,
                status : vm.currQueryStatus
            },
            success : function(res){
                if(res.statusCode == 200){
                    vm.orderList = res.respData;
                    orderListPagination.refresh({ currPage : page , totalPage : res.pageCount });
                }
                else vm.orderList = [];
            }
        });
    }

    function queryCommentList(page){
        page  = page || 1;
        //console.log("vm.commentListPageSize："+vm.commentListPageSize);
        $.ajax({
            url : "api/v2/manager/tech/comments",
            type : "post",
            data : {
                techId : pageParam.id,
                page : page,
                pageSize : vm.commentListPageSize
            },
            success : function(res){
                if(res.statusCode == 200){
                    vm.commentList = res.respData;
                    commentListPagination.refresh({ currPage : page , totalPage : res.pageCount });
                }
                else vm.commentList = [];
            }
        });
    }

    function queryAllServiceItem(){
        $.ajax({
            url : "club/service/data",
            data : { select : 1 },
            success : function(res){
                if(res.statusCode == 200){
                    res = res.respData;
                    var k, selectedCategory;
                    for(var i=0;i<res.length;i++){
                        selectedCategory = findServiceCategoryObj(res[i].name);
                        if(selectedCategory && selectedCategory.serviceItems.length==res[i].serviceItems.length){////全选此类别
                            res[i].selected = true;
                        }
                        else{
                            res[i].selected = false;
                        }
                        for(k=0;k<res[i].serviceItems.length;k++){
                            if(selectedCategory && inArr(res[i].serviceItems[k].id,selectedCategory.serviceItems,"id")){
                                res[i].serviceItems[k].selected = true;
                            }
                            else{
                                res[i].serviceItems[k].selected = false;
                            }
                        }
                    }
                    vm.serviceList = res || [];
                }
            }
        });
    }

    function findServiceCategoryObj(name){
        for(var k=0;k<techCategories.length;k++){
            if(techCategories[k].name == name){
                return techCategories[k];
            }
        }
        return null;
    }

    function pushCategoryArr(arr,item){
        for(var j=0;j<arr.length;j++){
            if(arr[j] == item) return;
        }
        arr.push(item);
    }

    editServiceItemModal = new Modal($("#editServiceItemModal"),{
        doClickOkBtn : function(){
            var categoryIdArr = [], servicesArr = [],
                $selectedService = $("#serviceItemTable>tbody>tr.item>td>i.active"),
                k;
            for(k=0;k<$selectedService.length;k++){
                servicesArr.push($selectedService[k].getAttribute("itemId"));
                pushCategoryArr(categoryIdArr,$selectedService[k].getAttribute("categoryId"));
            }
            editServiceItemModal.loading();
            //console.log(JSON.stringify(categoryIdArr)+"\n"+JSON.stringify(servicesArr));
            $.ajax({
                url : "tech/service/update",
                type : "post",
                traditional : true,
                data : {
                    id : pageParam.id,
                    services : servicesArr,
                    categoryId : categoryIdArr
                },
                success : function(res){
                    editServiceItemModal.loading("hide");
                    if(res.statusCode == 200){
                        editServiceItemModal.close();
                        msgAlert(res.message,true);
                        queryData(true);
                    }
                    else{
                        editServiceItemModal.showTip(res.message);
                    }
                }
            });
        }
    });

    queryData();
    queryOrderList();
    queryCommentList();
});