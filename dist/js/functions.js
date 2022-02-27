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

// Get CSS Variable Value helper
function getCssVariableValue(variableName) {
  var hex = getComputedStyle(document.documentElement).getPropertyValue(variableName);
  if (hex && hex.length > 0) {
    hex = hex.trim();
  }

  return hex;
}
