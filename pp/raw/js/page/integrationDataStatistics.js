require(["css!../../compressed/css/page/dataStatistics.css?" + $$.rootVm.currTime, "daterangepicker", "highcharts", "!domReady"], function () {
    var vmId = $$.rootVm.page + "Ctrl" + (+new Date()),
        thisPage = $("#" + $$.rootVm.page + "Page"),
        dateRangeSearch = $("#chartGroup>div.tool>div>input");
    thisPage.attr("ms-controller", vmId);
    $$.currPath.html("数据统计 >> 积分统计");

    var vm = avalon.define({
        $id: vmId,
        deliverAmount: 0,
        recycleAmount: 0
    });

    var initStartDate = new Date();
    initStartDate.setTime(initStartDate.getTime() - 30 * 24 * 60 * 60 * 1000);
    dateRangeSearch.daterangepicker({startDate: initStartDate, endDate: new Date()}, function (start, end) {
        $("#chartGroup>div.tool>div>a").removeClass("active");
        queryData(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    });

    function queryClubAmount() {
        $.ajax({
            url: "club/credit/account",
            success: function (res) {
                if (res.statusCode == 200) {
                    if (res.respData) {
                        res = res.respData;
                        vm.deliverAmount = res.deliverAmount;
                        vm.recycleAmount = res.recycleAmount;
                    }
                }
            }
        });
    }

    function queryData(start, end) {
        var type = $("#chartGroup>div.tool>a.active").attr("type"),
            dateRange = formatDateRangeVal(dateRangeSearch.val()),
            startDate = start || dateRange.start,
            endDate = end || dateRange.end;

        $.ajax({
            url: "club/credit/trade/statistics",
            data: {
                startDate: startDate,
                endDate: endDate,
                clubId: $$.clubId,
                accumulated : (type=="total")
            },
            success: function (res) {
                if (res.statusCode == 200) {
                    res = res.respData;
                    var option = {
                        xAxis: {
                            categories: res.days,
                            labels: {
                                step: Math.round(res.days.length / 10) < 1 ? 1 : Math.round(res.days.length / 10),
                                staggerLines: 1
                            },
                            tickmarkPlacement: "on"
                        },
                        series: res.data,
                        yAxis: [{ title: { text : null }, min: 0, allowDecimals: false}],
                        tooltip: {},
                        colors: ['#f5b156', '#7cb5ec']
                    };
                    $("#chartGroup>div.chart").updateChart(option);
                    avalon.scan(thisPage[0]);
                }
            }
        })
    }

    $("#chartGroup>div.tool>a").click(function () {
        var $this = $(this);
        if (!$this.hasClass("active")) {
            $this.siblings().removeClass("active");
            $this.addClass("active");
            queryData();
        }
    });

    $("#chartGroup>div.tool>div>a").click(function () {
        var $this = $(this);
        if (!$this.hasClass("active")) {
            $this.siblings().removeClass("active");
            $this.addClass("active");
            var initStartDate = new Date();
            initStartDate.setTime(initStartDate.getTime() - parseInt($this.attr("type")) * 24 * 60 * 60 * 1000);
            dateRangeSearch.data('daterangepicker').setStartDate(initStartDate);
            dateRangeSearch.data('daterangepicker').setEndDate(new Date());
            queryData();
        }
    });

    queryClubAmount();
    queryData();
});