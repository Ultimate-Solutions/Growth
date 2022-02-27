'use strict';

// Class definition
var HOLOLWidgets = (function () {
  // Charts widgets > Global variables
  const lineColorChartLine = HOLOLUtil.getCssVariableValue('--bs-indigo');
  const globalOptionsChartLine = {
    chart: {
      fontFamily: 'inherit',
      type: 'line',
      height: '30px',
      toolbar: {
        show: !1,
      },
      zoom: {
        enabled: !1,
      },
      sparkline: {
        enabled: !0,
      },
    },
    plotOptions: {},
    legend: {
      show: !1,
    },
    dataLabels: {
      enabled: !1,
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    stroke: {
      curve: 'smooth',
      show: !0,
      width: 3,
      colors: lineColorChartLine,
    },
    xaxis: {
      categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
      axisBorder: {
        show: !1,
      },
      axisTicks: {
        show: !1,
      },
    },
    yaxis: {
      labels: {
        show: !1,
      },
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      hover: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: !1,
        filter: {
          type: 'none',
          value: 0,
        },
      },
    },
    tooltip: {
      show: !1,
    },
    colors: ['transparent'],
  };

  // Charts widget small 1
  var initChartsWidgetSmall1 = function () {
    var element = document.getElementById('holol_chart_widget_1_small');

    var lineColor = HOLOLUtil.getCssVariableValue('--bs-success');

    if (!element) {
      return;
    }

    // Set default options
    var options = globalOptionsChartLine;
    // Set Series data
    options.series = [
      {
        data: [10, 10, 34, 16, 10],
      },
    ]; // Set stroke color
    options.stroke.colors = lineColor;

    var chart = new ApexCharts(element, options);
    chart.render();
  };

  // Charts widget small 2
  var initChartsWidgetSmall2 = function () {
    var element = document.getElementById('holol_chart_widget_2_small');

    var lineColor = HOLOLUtil.getCssVariableValue('--bs-indigo');

    if (!element) {
      return;
    }

    // Set default options
    var options = globalOptionsChartLine;
    // Set Series data
    options.series = [
      {
        data: [10, 8, 18, 16, 24],
      },
    ]; // Set stroke color
    options.stroke.colors = lineColor;

    var chart = new ApexCharts(element, options);
    chart.render();
  };

  // Charts widget small 3
  var initChartsWidgetSmall3 = function () {
    var element = document.getElementById('holol_chart_widget_3_small');

    var lineColor = HOLOLUtil.getCssVariableValue('--bs-warning');

    if (!element) {
      return;
    }

    // Set default options
    var options = globalOptionsChartLine;
    // Set Series data
    options.series = [
      {
        data: [10, 20, 20, 16, 10],
      },
    ]; // Set stroke color
    options.stroke.colors = lineColor;

    var chart = new ApexCharts(element, options);
    chart.render();
  };

  // Charts widget small 4
  var initChartsWidgetSmall4 = function () {
    var element = document.getElementById('holol_chart_widget_4_small');

    var lineColor = HOLOLUtil.getCssVariableValue('--bs-blue');

    if (!element) {
      return;
    }

    // Set default options
    var options = globalOptionsChartLine;
    // Set Series data
    options.series = [
      {
        data: [8, 20, 18, 20, 32],
      },
    ]; // Set stroke color
    options.stroke.colors = lineColor;

    var chart = new ApexCharts(element, options);
    chart.render();
  };

  // Charts widget Home main
  var initChartsWidgetMain = function () {
    var element = document.getElementById('holol_chart_widget_1');

    if (!element) {
      return;
    }

    // Set default options
    var options = {
      series: [
        {
          name: 'الارباح',
          data: [30000, 40000, 40000, 90000, 90000, 70000, 70000, 30000],
        },
        {
          name: 'المبيعات',
          data: [40000, 40000, 60000, 80000, 60000, 60000, 60000, 50000],
        },
        {
          name: 'الطلبات',
          data: [20000, 30000, 50000, 20000, 20000, 60000, 80000, 10000],
        },
        {
          name: 'الزيارات',
          data: [0, 10000, 40000, 40000, 40000, 80000, 80000, 50000],
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'line',
        height: 350,
        toolbar: {
          show: !1,
        },
      },
      plotOptions: {},
      legend: {
        show: !1,
      },
      dataLabels: {
        enabled: !1,
      },
      fill: {
        type: 'solid',
        opacity: 1,
      },
      stroke: {
        curve: 'smooth',
        show: !0,
        width: 3,
      },
      xaxis: {
        categories: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
        axisBorder: {
          show: !1,
        },
        axisTicks: {
          show: !1,
        },
        labels: {
          style: {
            colors: [getCssVariableValue('--bs-gray')],
            fontSize: '12px',
          },
        },
        crosshairs: {
          position: 'front',
          stroke: {
            color: getCssVariableValue('--bs-primary'),
            width: 1,
            dashArray: 3,
          },
        },
        tooltip: {
          enabled: !0,
          formatter: void 0,
          offsetY: 0,
          style: {
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: [getCssVariableValue('--bs-gray')],
            fontSize: '12px',
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: !1,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (t) {
            if (t < 1000) return t;
            else if (t >= 1000) return t / 1000 + 'K';
            else if (t >= 1000000) return t / 1000000 + 'M';
            else if (t >= 1000000000) return t / 1000000000 + 'T';
          },
        },
      },
      colors: [
        getCssVariableValue('--chart-blue'),
        getCssVariableValue('--chart-pink'),
        getCssVariableValue('--chart-yellow'),
        getCssVariableValue('--chart-green'),
      ],
      grid: {
        borderColor: getCssVariableValue('--chart-gray-border'),
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: !0,
          },
        },
      },
    };

    var chart = new ApexCharts(element, options);
    chart.render();
  };

  // Charts widget Home Donuts
  var initChartsWidgetMainDonuts = function () {
    var element = document.getElementById('donutChart');

    if (!element) {
      return;
    }

    // Set default options
    var options = {
      series: [4640, 5050, 1300],
      labels: ['Desktop', 'Tablet', 'Phone'],
      chart: {
        id: 'donutChart',
        type: 'donut',
        height: 300,
      },
      plotOptions: {},
      legend: {
        show: !1,
      },
      dataLabels: {
        enabled: !1,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '85%',
            labels: {
              show: !0,
              value: {
                fontSize: '32px',
                formatter: function (val) {
                  if (val < 1000) return val;
                  else if (val >= 1000) return parseInt(val / 1000) + 'K';
                  else if (val >= 1000000) return parseInt(val / 1000000) + 'M';
                  else if (val >= 1000000000) return parseInt(val / 1000000000) + 'T';
                },
              },
              name: {
                fontSize: '18px',
                formatter: function (val) {
                  return val;
                },
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Total',
                fontSize: '22px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: '#373d3f',
                formatter: function (w) {
                  let val = w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);

                  if (val < 1000) return val;
                  else if (val >= 1000) return parseInt(val / 1000) + 'K';
                  else if (val >= 1000000) return parseInt(val / 1000000) + 'M';
                  else if (val >= 1000000000) return parseInt(val / 1000000000) + 'T';
                },
              },
            },
          },
          expandOnClick: false,
        },
      },
      legend: {
        show: !1,
      },
      dataLabels: {
        enabled: !1,
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: !1,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            if (val < 1000) return val;
            else if (val >= 1000) return parseInt(val / 1000) + 'K';
            else if (val >= 1000000) return parseInt(val / 1000000) + 'M';
            else if (val >= 1000000000) return parseInt(val / 1000000000) + 'T';
          },
        },
      },
    };

    var chart = new ApexCharts(element, options).render();

    // Update Donut Chart on click tabs
    HOLOLUtil.addEvent(document.querySelector('#table-deviceType'), 'click', () => {
      ApexCharts.exec(
        'donutChart',
        'updateOptions',
        {
          series: [4640, 5050, 1300],
          labels: ['Desktop', 'Tablet', 'Phone'],
        },
        false,
        true
      );
    });
    // Update Donut Chart on click tabs
    HOLOLUtil.addEvent(document.querySelector('#table-country'), 'click', () => {
      ApexCharts.exec(
        'donutChart',
        'updateOptions',
        {
          series: [250000, 121000, 78000, 26540],
          labels: ['السعودية', 'مصر', 'المغرب', 'البحرين'],
        },
        false,
        true
      );
    });
  };

  // Public methods
  return {
    init: function () {
      // Charts widgets
      initChartsWidgetSmall1();
      initChartsWidgetSmall2();
      initChartsWidgetSmall3();
      initChartsWidgetSmall4();
      initChartsWidgetMain();
      initChartsWidgetMainDonuts();
    },
  };
})();

// On document ready
HOLOLUtil.onDOMContentLoaded(function () {
  HOLOLWidgets.init();
});
