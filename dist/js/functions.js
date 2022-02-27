// #region / Date Range Picker
//   _____        _         _____                          _____ _      _
//  |  __ \      | |       |  __ \                        |  __ (_)    | |
//  | |  | | __ _| |_ ___  | |__) |__ _ _ __   __ _  ___  | |__) |  ___| | _____ _ __
//  | |  | |/ _` | __/ _ \ |  _  // _` | '_ \ / _` |/ _ \ |  ___/ |/ __| |/ / _ \ '__|
//  | |__| | (_| | ||  __/ | | \ \ (_| | | | | (_| |  __/ | |   | | (__|   <  __/ |
//  |_____/ \__,_|\__\___| |_|  \_\__,_|_| |_|\__, |\___| |_|   |_|\___|_|\_\___|_|
//                                             __/ |
//                                            |___/
document.addEventListener('DOMContentLoaded', () => {
  // Get all Date Pickers
  const datePickers = $('[date-picker]');

  // Check if exist
  if (datePickers) {
    // Loop all pickers
    datePickers.each(function () {
      // Get picker type
      var datePickerType = $(this).attr('picker-type');

      // Picker type = range
      if (datePickerType == 'range') {
        let ele = $(this);

        var start = moment().subtract(29, 'days');
        var end = moment();
        var local;

        if (ele.attr('picker-container') == 'input')
          function cb(start, end) {
            ele.val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
          }
        else if (ele.attr('picker-container') == 'span')
          function cb(start, end) {
            ele.find('span').html(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
          }
        else if (ele.attr('picker-container') == 'input-group')
          function cb(start, end) {
            ele.find('input').val(start.format('DD/MM/YYYY') + ' - ' + end.format('DD/MM/YYYY'));
          }

        var lang = document.getElementsByTagName('html')[0].getAttribute('lang'),
          dir = document.getElementsByTagName('html')[0].getAttribute('dir');

        if (dir == 'rtl' && lang == 'ar')
          local = {
            direction: 'rtl',
            applyLabel: 'تاكيد',
            cancelLabel: 'الغاء',
            fromLabel: 'من',
            toLabel: 'الى',
            todayRangeLabel: 'اليوم',
            yesterdayRangeLabel: 'امس',
            last7daysRangeLabel: 'أخر 7 ايام',
            last30daysRangeLabel: 'أخر 30 يوم',
            thisMonthRangeLabel: 'هذا الشهر',
            lastMonthRangeLabel: 'أخر شهر',
            lastRangeCustom: 'مخصص',
            weekLabel: 'W',
            daysOfWeek: ['الأحد', 'الأثنين', 'الثلاثاء', 'الاربعاء', 'الخميس', 'الجمعة', 'السبت'],
            monthNames: [
              'يناير',
              'فبراير',
              'مارس',
              'ابريل',
              'مايو',
              'يونيو',
              'يوليو',
              'اغسطس',
              'سيبتمبر',
              'اكتوبر',
              'نوفمبر',
              'ديسمبر',
            ],
          };
        else
          local = {
            direction: 'ltr',
            applyLabel: 'Apply',
            cancelLabel: 'Cancel',
            fromLabel: 'From',
            toLabel: 'To',
            todayRangeLabel: 'Today',
            yesterdayRangeLabel: 'Yesterday',
            last7daysRangeLabel: 'Last 7 Days',
            last30daysRangeLabel: 'Last 30 Days',
            thisMonthRangeLabel: 'This Month',
            lastMonthRangeLabel: 'Last Month',
            lastRangeCustom: 'Custom Range',
            weekLabel: 'W',
            daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
            monthNames: [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ],
          };

        ele.daterangepicker(
          {
            locale: local,
            startDate: start,
            endDate: end,
            ranges: {
              Today: [moment(), moment()],
              Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
              'Last 7 Days': [moment().subtract(6, 'days'), moment()],
              'Last 30 Days': [moment().subtract(29, 'days'), moment()],
              'This Month': [moment().startOf('month'), moment().endOf('month')],
              'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month'),
              ],
            },
          },
          cb
        );

        cb(start, end);

        // Set active state on picker opened
        ele.on('show.daterangepicker', function (ev, picker) {
          ele.addClass('active');

          // Change Local date range menu text
          const daterangepickers = document.querySelectorAll('.daterangepicker');
          for (let daterangepicker of daterangepickers) {
            var rangeToday = daterangepicker.querySelector('.ranges [data-range-key="Today"'),
              rangeYesterday = daterangepicker.querySelector('.ranges [data-range-key="Yesterday"'),
              rangeLast7Days = daterangepicker.querySelector(
                '.ranges [data-range-key="Last 7 Days"'
              ),
              rangeLast30Days = daterangepicker.querySelector(
                '.ranges [data-range-key="Last 30 Days"'
              ),
              rangeThisMonth = daterangepicker.querySelector(
                '.ranges [data-range-key="This Month"'
              ),
              rangeLastMonth = daterangepicker.querySelector(
                '.ranges [data-range-key="Last Month"'
              ),
              rangeCustom = daterangepicker.querySelector('.ranges [data-range-key="Custom Range"');

            // Change Text
            rangeToday.innerHTML = local.todayRangeLabel;
            rangeYesterday.innerHTML = local.yesterdayRangeLabel;
            rangeLast7Days.innerHTML = local.last7daysRangeLabel;
            rangeLast30Days.innerHTML = local.last30daysRangeLabel;
            rangeThisMonth.innerHTML = local.thisMonthRangeLabel;
            rangeLastMonth.innerHTML = local.lastMonthRangeLabel;
            rangeCustom.innerHTML = local.lastRangeCustom;
          }
        });

        // Remove active state on picker closed
        ele.on('hide.daterangepicker', function (ev, picker) {
          ele.removeClass('active');
        });
      }
    });
  }
});
// #endregion

// #region / Apexcharts
//                                _                _
//      /\                       | |              | |
//     /  \   _ __   _____  _____| |__   __ _ _ __| |_ ___
//    / /\ \ | '_ \ / _ \ \/ / __| '_ \ / _` | '__| __/ __|
//   / ____ \| |_) |  __/>  < (__| | | | (_| | |  | |_\__ \
//  /_/    \_\ .__/ \___/_/\_\___|_| |_|\__,_|_|   \__|___/
//           | |
//           |_|
document.addEventListener('DOMContentLoaded', () => {
  // Small Profits Chart
  var ele1 = document.getElementById('holol_chart_widget_1_small');
  // Check exist
  if (ele1) {
    // Options
    var options = {
      series: [
        {
          name: 'Net Profit',
          data: [10, 10, 34, 16, 10],
        },
      ],
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
        curve: 'straight',
        show: !0,
        width: 3,
        colors: [getCssVariableValue('--bs-success')],
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
    // Call function
    new ApexCharts(ele1, options).render();
  }

  // Small Sales Chart
  var ele2 = document.getElementById('holol_chart_widget_2_small');
  // Check exist
  if (ele2) {
    // Options
    var options = {
      series: [
        {
          name: 'Net Profit',
          data: [10, 8, 18, 16, 24],
        },
      ],
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
        curve: 'straight',
        show: !0,
        width: 3,
        colors: [getCssVariableValue('--bs-indigo')],
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
    // Call function
    new ApexCharts(ele2, options).render();
  }

  // Small Orders Chart
  var ele3 = document.getElementById('holol_chart_widget_3_small');
  // Check exist
  if (ele3) {
    // Options
    var options = {
      series: [
        {
          name: 'Net Profit',
          data: [10, 20, 20, 16, 10],
        },
      ],
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
        curve: 'straight',
        show: !0,
        width: 3,
        colors: [getCssVariableValue('--bs-warning')],
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
    // Call function
    new ApexCharts(ele3, options).render();
  }

  // Small views Chart
  var ele4 = document.getElementById('holol_chart_widget_4_small');
  // Check exist
  if (ele4) {
    // Options
    var options = {
      series: [
        {
          name: 'Net Profit',
          data: [8, 20, 18, 20, 32],
        },
      ],
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
        curve: 'straight',
        show: !0,
        width: 3,
        colors: [getCssVariableValue('--bs-green')],
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
    // Call function
    new ApexCharts(ele4, options).render();
  }

  // Big home Chart
  var eleHome = document.getElementById('holol_chart_widget_1');
  // Check exist
  if (eleHome) {
    // Options
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
          data: [0000, 10000, 40000, 40000, 40000, 80000, 80000, 50000],
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
    // Call function
    new ApexCharts(eleHome, options).render();
  }

  // Donut Chart
  var donutChart = document.getElementById('donutChart');
  // Check exist
  if (donutChart) {
    // Options
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
    // Call function
    new ApexCharts(donutChart, options).render();

    // Update Donut Chart on click tabs
    document.querySelector('#table-deviceType').addEventListener('click', () => {
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
    document.querySelector('#table-country').addEventListener('click', () => {
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
  }
});
// #endregion

// Get CSS Variable Value helper
function getCssVariableValue(variableName) {
  var hex = getComputedStyle(document.documentElement).getPropertyValue(variableName);
  if (hex && hex.length > 0) {
    hex = hex.trim();
  }

  return hex;
}
