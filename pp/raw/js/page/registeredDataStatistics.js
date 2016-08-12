require(["css!../../compressed/css/page/dataStatistics.css?"+$$.rootVm.currTime,"daterangepicker","highcharts","!domReady"],function(){
    var vmId = $$.rootVm.page+"Ctrl"+(+new Date()),
        thisPage = $("#"+$$.rootVm.page+"Page"),
        dateRangeSearch = $("#chartGroup>div.tool>div>input");
    thisPage.attr("ms-controller",vmId);
    $$.currPath.html("数据统计 >> 注册用户");

    var vm = avalon.define({
        $id : vmId,
        countObj : { sum : "-" , count1 : "-" , count2 : "-" , count3 : "-" }
    });

    var initStartDate = new Date();
    initStartDate.setTime(initStartDate.getTime()-30*24*60*60*1000);
    dateRangeSearch.daterangepicker({ startDate : initStartDate , endDate : new Date() },function(start,end){
        $("#chartGroup>div.tool>div>a").removeClass("active");
        queryData(start.format('YYYY-MM-DD'),end.format('YYYY-MM-DD'));
    });

    $.ajax({
        url : "club/datastatistics/register/sumdata",
        success : function(res){
            if(res.statusCode == 200 && res.respData){
                vm.countObj = res.respData;
            }
        }
    });

    function queryData(start,end){
        var type = $("#chartGroup>div.tool>a.active").attr("type"),
            dateRange =formatDateRangeVal(dateRangeSearch.val()),
            startDate = start || dateRange.start,
            endDate = end || dateRange.end;
        $.ajax({
            url : "club/datastatistics/register/data",
            data : {
                startDate : startDate, endDate : endDate, type : type
            },
            success : function(res){
                if(res.statusCode == 200){
                    res = res.respData;
                    var option = {
                        xAxis : {
                            categories : res.today,
                            labels : {
                                step : Math.round(res.today.length / 10) < 1 ? 1 : Math.round(res.today.length / 10),
                                staggerLines : 1
                            },
                            tickmarkPlacement : "on"
                        },
                        series : [{ name : (type=="new" ? "新增数" : "累计数"), data : res.counts , showInLegend : false }],
                        yAxis: [{ title: { text: null }, min : 0, allowDecimals : false }],
                        tooltip: { },
                        colors: [ '#ff7d7d' ]
                    };
                    $("#chartGroup>div.chart").updateChart(option);
                    avalon.scan(thisPage[0]);
                }
            }
        })
    }

    $("#chartGroup>div.tool>a").click(function(){
        var $this = $(this);
        if(!$this.hasClass("active")){
            $this.siblings().removeClass("active");
            $this.addClass("active");
            queryData();
        }
    });

    $("#chartGroup>div.tool>div>a").click(function(){
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

    queryData();
});