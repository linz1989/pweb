require(["css!../../compressed/css/page/dataStatistics.css?"+$$.rootVm.currTime,"css!../../compressed/css/page/accountDataStatistics.css?"+$$.rootVm.currTime,"daterangepicker","highcharts","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        dateRangeSearch = $("#accountDataChartGroup>div.tool>div>input");
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("数据统计 >> 账户统计");

    var vm = avalon.define({
        $id : vmId,
        rechargeList :  [],
        countObj : { totalAmount : "-" , usedAmount : "-" , orderCount : "-" , notUsedAmount : "-" }
    });

    var initStartDate = new Date();
    initStartDate.setTime(initStartDate.getTime()-30*24*60*60*1000);
    dateRangeSearch.daterangepicker({ startDate : initStartDate , endDate : new Date() },function(start,end){
        $("#accountDataChartGroup>div.tool>div>a").removeClass("active");
        queryData(start.format('YYYY-MM-DD'),end.format('YYYY-MM-DD'));
    });

    function queryRechargeCountData(){
        $.ajax({
            url : "club/finacial/user/account/total",
            success : function(res){
                if(res.statusCode == 200 && res.respData){
                    vm.countObj = res.respData;
                    avalon.scan(thisPage[0]);
                }
            }
        });
    }

    function queryData(start,end){
        var type = $("#accountDataChartGroup>div.tool>a.active").attr("type"),
            dateRange =formatDateRangeVal(dateRangeSearch.val()),
            startDate = start || dateRange.start,
            endDate = end || dateRange.end;
        $.ajax({
            url : "club/finacial/user/account/report",
            data : {
                startDate : startDate, endDate : endDate, type : type
            },
            success : function(res){
                if(res.statusCode == 200){
                    res = res.respData;
                    var option = {
                        xAxis : {
                            categories : res.days,
                            labels : {
                                step : Math.round(res.days.length / 10) < 1 ? 1 : Math.round(res.days.length / 10),
                                staggerLines : 1
                            },
                            tickmarkPlacement : "on"
                        },
                        series : (function (obj) {
                            obj.forEach(function (v,i) {
                                if(v.name !=='订单笔数'){
                                    v.data.forEach(function (v2,j) {
                                        obj[i].data[j] = (v2/100).toFixed(2) - 0;
                                    });
                                }
                            });
                            return obj;
                        })(res.data),
                        yAxis: [{ title: { text: null }, min : 0, allowDecimals : false }],
                        tooltip: { },
                        colors: [ '#f5b156', '#7cb5ec', '#ff7d7d']
                    };
                    $("#accountDataChartGroup>div.chart").updateChart(option);
                }
            }
        })
    }

    $("#accountDataChartGroup>div.tool>a").click(function(){
        var $this = $(this);
        if(!$this.hasClass("active")){
            $this.siblings().removeClass("active");
            $this.addClass("active");
            queryData();
        }
    });

    $("#accountDataChartGroup>div.tool>div>a").click(function(){
        var $this = $(this);
        if(!$this.hasClass("active")){
            $this.siblings().removeClass("active");
            $this.addClass("active");
            var initStartDate = new Date();
            initStartDate.setTime(initStartDate.getTime()-parseInt($this.attr("type"))*24*60*60*1000);
            dateRangeSearch.data('daterangepicker').setStartDate(initStartDate);
            dateRangeSearch.data('daterangepicker').setEndDate(new Date());
            queryData();
        }
    });
    queryRechargeCountData();
    queryData();
});