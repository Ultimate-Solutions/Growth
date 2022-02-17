'use strict';

// Class definition
var HololApp = function () {
  var initPageLoader = function () {
    // CSS3 Transitions only after page load(.page-loading class added to body tag and remove with JS on page load)
    document.body.classList.remove('page-loading');
  };

  var initBootstrapTooltip = function (el, options) {
    var delay = {};

    // Handle delay options
    if (el.hasAttribute('data-bs-delay-hide')) {
      delay['hide'] = el.getAttribute('data-bs-delay-hide');
    }

    if (el.hasAttribute('data-bs-delay-show')) {
      delay['show'] = el.getAttribute('data-bs-delay-show');
    }

    if (delay) {
      options['delay'] = delay;
    }

    // Check dismiss options
    if (el.hasAttribute('data-bs-dismiss') && el.getAttribute('data-bs-dismiss') == 'click') {
      options['dismiss'] = 'click';
    }

    // Initialize popover
    var tp = new bootstrap.Tooltip(el, options);

    // Handle dismiss
    if (options['dismiss'] && options['dismiss'] === 'click') {
      // Hide popover on element click
      el.addEventListener('click', function (e) {
        tp.hide();
      });
    }

    return tp;
  };

  var initBootstrapTooltips = function (el, options) {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      initBootstrapTooltip(tooltipTriggerEl, {});
    });
  };

  var initBootstrapPopover = function (el, options) {
    var delay = {};

    // Handle delay options
    if (el.hasAttribute('data-bs-delay-hide')) {
      delay['hide'] = el.getAttribute('data-bs-delay-hide');
    }

    if (el.hasAttribute('data-bs-delay-show')) {
      delay['show'] = el.getAttribute('data-bs-delay-show');
    }

    if (delay) {
      options['delay'] = delay;
    }

    // Handle dismiss option
    if (el.getAttribute('data-bs-dismiss') == 'true') {
      options['dismiss'] = true;
    }

    if (options['dismiss'] === true) {
      options['template'] =
        '<div class="popover" role="tooltip"><div class="popover-arrow"></div><span class="popover-dismiss btn btn-icon"><i class="bi bi-x fs-2"></i></span><h3 class="popover-header"></h3><div class="popover-body"></div></div>';
    }

    // Initialize popover
    var popover = new bootstrap.Popover(el, options);

    // Handle dismiss click
    if (options['dismiss'] === true) {
      var dismissHandler = function (e) {
        popover.hide();
      };

      el.addEventListener('shown.bs.popover', function () {
        var dismissEl = document.getElementById(el.getAttribute('aria-describedby'));
        dismissEl.addEventListener('click', dismissHandler);
      });

      el.addEventListener('hide.bs.popover', function () {
        var dismissEl = document.getElementById(el.getAttribute('aria-describedby'));
        dismissEl.removeEventListener('click', dismissHandler);
      });
    }

    return popover;
  };

  var initBootstrapPopovers = function () {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));

    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      initBootstrapPopover(popoverTriggerEl, {});
    });
  };

  var initScrollSpy = function () {
    var elements = [].slice.call(document.querySelectorAll('[data-bs-spy="scroll"]'));

    elements.map(function (element) {
      var sel = element.getAttribute('data-bs-target');
      var scrollContent = document.querySelector(element.getAttribute('data-bs-target'));
      var scrollSpy = bootstrap.ScrollSpy.getInstance(scrollContent);
      if (scrollSpy) {
        scrollSpy.refresh();
      }
    });
  };

  var initSelect2 = function () {
    var elements = [].slice.call(document.querySelectorAll('[data-control="select2"]'));

    elements.map(function (element) {
      var options = {
        dir: document.getElementsByTagName('html')[0].getAttribute('dir'),
        theme: 'bootstrap5',
        width: '100%',
        selectionCssClass: ':all:',
      };

      if (element.getAttribute('data-hide-search') == 'true') {
        options.minimumResultsForSearch = Infinity;
      }

      $(element).select2(options);
    });
  };
};

// #region / Enable tooltips everywhere
//   ______             _     _        _              _ _   _                                                _
//  |  ____|           | |   | |      | |            | | | (_)                                              | |
//  | |__   _ __   __ _| |__ | | ___  | |_ ___   ___ | | |_ _ _ __  ___    _____   _____ _ __ _   ___      _| |__   ___ _ __ ___
//  |  __| | '_ \ / _` | '_ \| |/ _ \ | __/ _ \ / _ \| | __| | '_ \/ __|  / _ \ \ / / _ \ '__| | | \ \ /\ / / '_ \ / _ \ '__/ _ \
//  | |____| | | | (_| | |_) | |  __/ | || (_) | (_) | | |_| | |_) \__ \ |  __/\ V /  __/ |  | |_| |\ V  V /| | | |  __/ | |  __/
//  |______|_| |_|\__,_|_.__/|_|\___|  \__\___/ \___/|_|\__|_| .__/|___/  \___| \_/ \___|_|   \__, | \_/\_/ |_| |_|\___|_|  \___|
//                                                           | |                               __/ |
//                                                           |_|                              |___/
document.addEventListener('DOMContentLoaded', () => {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
// #endregion

// #region / LazyLoad
//   _                     _                     _
//  | |                   | |                   | |
//  | |     __ _ _____   _| |     ___   __ _  __| |
//  | |    / _` |_  / | | | |    / _ \ / _` |/ _` |
//  | |___| (_| |/ /| |_| | |___| (_) | (_| | (_| |
//  |______\__,_/___|\__, |______\___/ \__,_|\__,_|
//                    __/ |
//                   |___/
//
document.addEventListener('DOMContentLoaded', () => {
  function logElementEvent(eventName, element) {
    console.log(Date.now(), eventName, element.getAttribute('data-src'));
  }

  var callback_error = function (element) {
    logElementEvent('💀 ERROR', element);
    element.src = 'https://via.placeholder.com/440x560/?text=Error+Placeholder';
  };

  window.lazyLoadOptions = {
    threshold: 0,
    // Assign the callbacks defined above
    callback_error: callback_error,
  };
});
// #endregion

// #region / Main Navbar
//   __  __       _         _   _             _
//  |  \/  |     (_)       | \ | |           | |
//  | \  / | __ _ _ _ __   |  \| | __ ___   _| |__   __ _ _ __
//  | |\/| |/ _` | | '_ \  | . ` |/ _` \ \ / / '_ \ / _` | '__|
//  | |  | | (_| | | | | | | |\  | (_| |\ V /| |_) | (_| | |
//  |_|  |_|\__,_|_|_| |_| |_| \_|\__,_| \_/ |_.__/ \__,_|_|
//
//
document.addEventListener('DOMContentLoaded', () => {
  // Main navbar
  const dashboard = document.querySelector('.dashboard');
  const mainNavbar = document.querySelector('.dashboard > .main-navbar');
  const mainContainer = document.querySelector('.dashboard > .content');

  if (mainNavbar) {
    // Expand / Collapse Main navbar
    const expandCollapseActions = document.querySelectorAll('[data-action="sidebar-toggler"]');
    for (let expandCollapseAction of expandCollapseActions) {
      expandCollapseAction.addEventListener('click', () => {
        if (mainNavbar.hasAttribute('collapse')) {
          mainNavbar.removeAttribute('collapse');
          mainNavbar.setAttribute('expand', '');
          if (window.innerWidth <= 991.98) {
            document.body.classList.add('overflow-hidden', 'h-100');
          }
        } else if (mainNavbar.hasAttribute('expand')) {
          mainNavbar.removeAttribute('expand');
          mainNavbar.setAttribute('collapse', '');
          if (window.innerWidth <= 991.98) {
            document.body.classList.remove('overflow-hidden', 'h-100');
          }
        }
      });
    }

    // Expand / Collapse Main navbar on click outside for Mobile view
    var windowWidth = window.innerWidth;

    // Check Window width
    if (windowWidth <= 991.98) {
      document.addEventListener('mouseup', function (e) {
        if (mainNavbar.hasAttribute('expand'))
          if (windowWidth <= 991.98)
            if (mainContainer.contains(e.target)) {
              mainNavbar.removeAttribute('expand');
              mainNavbar.setAttribute('collapse', '');
              document.body.classList.remove('overflow-hidden', 'h-100');
            }
      });
    }

    window.addEventListener(
      'resize',
      () => {
        windowWidth = window.innerWidth;

        if (windowWidth <= 991.98) {
          document.addEventListener('mouseup', function (e) {
            if (mainNavbar.hasAttribute('expand'))
              if (windowWidth <= 991.98)
                if (!mainNavbar.contains(e.target)) {
                  mainNavbar.removeAttribute('expand');
                  mainNavbar.setAttribute('collapse', '');
                  document.body.classList.add('overflow-hidden', 'h-100');
                }
          });
        }
      },
      true
    );

    // Actions for dropdown links
    // Dropdown lists
    const dropdwonLists = mainNavbar.querySelectorAll('.nav-link.dropdown');
    for (let dropdownListItem of dropdwonLists) {
      dropdownListItem.addEventListener('click', () => {
        if (!dropdownListItem.classList.contains('expand')) {
          // Collapse All Dropdowns
          collapseAllDropdown(dropdwonLists);
          // Expant current dropdown
          expandDropdown(dropdownListItem);
        } else {
          // Collapse All Dropdowns
          collapseAllDropdown(dropdwonLists);
        }
      });
    }

    // Collapse
    function collapseAllDropdown(master) {
      // Collapse dropdown
      for (let el of master) {
        el.classList.remove('expand');
      }
    }

    // Expand
    function expandDropdown(el) {
      el.classList.add('expand');
    }

    // Check active dropdown links
    // Nav items
    const navItems = mainNavbar.querySelectorAll('.nav-item');
    for (let navItem of navItems) {
      let dropdownList = navItem.querySelector('.dropdown-list');
      if (dropdownList) {
        let navItemActive = dropdownList.querySelector('.nav-item.active');
        if (navItemActive) {
          navItem.querySelector('.nav-link.dropdown').classList.add('expand');
        }
      }
    }

    // Enable tooltips
    const tooltips = mainNavbar.querySelectorAll('[data-tooltip');
    for (let tooltip of tooltips) {
      tooltip.addEventListener('mouseenter', () => {
        if (mainNavbar.hasAttribute('collapse')) {
          // Create Tooltip container
          const tooltipContainer = document.createElement('div');
          tooltipContainer.setAttribute('tooltip-container', '');
          // Set tooltip data
          tooltipContainer.innerText = tooltip.getAttribute('data-title');
          // Append tooltip to view
          document.body.appendChild(tooltipContainer);

          // Set tooltip position
          var divOffset = offset(tooltip);
          tooltipContainer.style.top = divOffset.top + 'px';
        }
      });

      tooltip.addEventListener('mouseleave', () => {
        let el = document.querySelector('[tooltip-container]');
        if (el) {
          el.remove();
        }
      });
    }
  }
});
// #endregion

// #region / Top Navbar
//   _______            _   _             _
//  |__   __|          | \ | |           | |
//     | | ___  _ __   |  \| | __ ___   _| |__   __ _ _ __
//     | |/ _ \| '_ \  | . ` |/ _` \ \ / / '_ \ / _` | '__|
//     | | (_) | |_) | | |\  | (_| |\ V /| |_) | (_| | |
//     |_|\___/| .__/  |_| \_|\__,_| \_/ |_.__/ \__,_|_|
//             | |
//             |_|
document.addEventListener('DOMContentLoaded', () => {
  // Main navbar
  const topNavbar = document.querySelector('.dashboard > .content > .top-navbar');

  if (topNavbar) {
    // Scroll Animation
    window.addEventListener('scroll', () => {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        topNavbar.classList.add('scrolled');
      } else {
        topNavbar.classList.remove('scrolled');
      }
    });

    // Search bar
    const searchBar = topNavbar.querySelector('.search-bar');

    searchBar.addEventListener('click', () => {
      if (window.innerWidth <= 991.98) {
        // Toggle Active
        searchBar.classList.toggle('active');

        const targetContainer = document.body.querySelector('.searchbarFloating');
        if (!targetContainer) {
          // View Search bar
          const div = document.createElement('div');
          div.classList.add('searchbarFloating');
          div.innerHTML = searchBar.innerHTML;
          document.querySelector('.dashboard > .content').appendChild(div);
          document.querySelector('.searchbarFloating [icon]').remove();
          document.querySelector('.searchbarFloating input').focus();

          // Hide Search bar on click outside
          document.addEventListener('mouseup', function (e) {
            if (
              document.body.querySelector('.searchbarFloating') &&
              !searchBar.contains(e.target) &&
              !document.body.querySelector('.searchbarFloating').contains(e.target)
            ) {
              // Toggle Active
              searchBar.classList.remove('active');

              let target = document.body.querySelector('.searchbarFloating');
              let stepper = 0;
              var fadeEffect = setInterval(function () {
                if (!target.style.transform) {
                  stepper = 0;
                  target.style.transform = 'translateY(0%)';
                }
                if (stepper > -300) {
                  stepper = stepper - 10;
                  target.style.transform = 'translateY(' + stepper + '%)';
                } else {
                  clearInterval(fadeEffect);
                  document.body.querySelector('.searchbarFloating').remove();
                  document.querySelector('.searchbarFloating input').focusout();
                }
              }, 10);
            }
          });
        } else {
          // Hide Search bar on click
          let target = document.body.querySelector('.searchbarFloating');
          let stepper = 0;
          var fadeEffect = setInterval(function () {
            if (!target.style.transform) {
              stepper = 0;
              target.style.transform = 'translateY(0%)';
            }
            if (stepper > -300) {
              stepper = stepper - 10;
              target.style.transform = 'translateY(' + stepper + '%)';
            } else {
              clearInterval(fadeEffect);
              document.body.querySelector('.searchbarFloating').remove();
              document.querySelector('.searchbarFloating input').focusout();
            }
          }, 10);
        }
      }
    });
  }
});
// #endregion

// #region / Notification Tabs
//   _   _       _   _  __ _           _   _               _______    _
//  | \ | |     | | (_)/ _(_)         | | (_)             |__   __|  | |
//  |  \| | ___ | |_ _| |_ _  ___ __ _| |_ _  ___  _ __      | | __ _| |__  ___
//  | . ` |/ _ \| __| |  _| |/ __/ _` | __| |/ _ \| '_ \     | |/ _` | '_ \/ __|
//  | |\  | (_) | |_| | | | | (_| (_| | |_| | (_) | | | |    | | (_| | |_) \__ \
//  |_| \_|\___/ \__|_|_| |_|\___\__,_|\__|_|\___/|_| |_|    |_|\__,_|_.__/|___/
//
//
document.addEventListener('DOMContentLoaded', () => {
  // Main navbar
  const notifTabs = document.querySelector('.dashboard > .content [notif]'),
    notifTabsClose = notifTabs.querySelector('[close]');

  if (notifTabs) {
    // Close Notification banel
    notifTabsClose.addEventListener('click', () => {
      notifTabs.classList.add('remove');
      notifTabs.ontransitionend = function () {
        notifTabs.remove();
      };
    });

    // Change Notification color
    let notifTabsLinks = notifTabs.querySelectorAll('.action[data-bs-toggle="list"]');

    for (let link of notifTabsLinks) {
      // Check active link
      if (link.classList.contains('active')) {
        let status = link.getAttribute('data-type');
        notifTabs.setAttribute('data-type', status);
      }

      // Change on click
      link.addEventListener('click', () => {
        let status = link.getAttribute('data-type');
        notifTabs.setAttribute('data-type', status);
      });
    }
  }
});
// #endregion

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
        rangeDatePicker($(this));
      }
    });

    // Range Function
    function rangeDatePicker(ele) {
      var start = moment().subtract(29, 'days');
      var end = moment();

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

      var local;
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
          customRangeLabel: 'مخصص',
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
          customRangeLabel: 'Custom',
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
            rangeLast7Days = daterangepicker.querySelector('.ranges [data-range-key="Last 7 Days"'),
            rangeLast30Days = daterangepicker.querySelector(
              '.ranges [data-range-key="Last 30 Days"'
            ),
            rangeThisMonth = daterangepicker.querySelector('.ranges [data-range-key="This Month"'),
            rangeLastMonth = daterangepicker.querySelector('.ranges [data-range-key="Last Month"');

          // Change Text
          rangeToday.innerHTML = local.todayRangeLabel;
          rangeYesterday.innerHTML = local.yesterdayRangeLabel;
          rangeLast7Days.innerHTML = local.last7daysRangeLabel;
          rangeLast30Days.innerHTML = local.last30daysRangeLabel;
          rangeThisMonth.innerHTML = local.thisMonthRangeLabel;
          rangeLastMonth.innerHTML = local.lastMonthRangeLabel;
        }
      });

      // Remove active state on picker closed
      ele.on('hide.daterangepicker', function (ev, picker) {
        ele.removeClass('active');
      });
    }
  }
});
// #endregion

// #region / SELECT2
//    _____ ______ _      ______ _____ _______ ___
//   / ____|  ____| |    |  ____/ ____|__   __|__ \
//  | (___ | |__  | |    | |__ | |       | |     ) |
//   \___ \|  __| | |    |  __|| |       | |    / /
//   ____) | |____| |____| |___| |____   | |   / /_
//  |_____/|______|______|______\_____|  |_|  |____|
//
//
document.addEventListener('DOMContentLoaded', () => {
  // Get all SELECT2 elements
  var initSelect2 = function () {
    var elements = [].slice.call(document.querySelectorAll('[data-control="select2"]'));

    elements.map(function (element) {
      var options = {
        dir: document.getElementsByTagName('html')[0].getAttribute('dir'),
        theme: 'bootstrap5',
        width: '100%',
        selectionCssClass: ':all:',
      };

      if (element.getAttribute('data-hide-search') == 'true') {
        options.minimumResultsForSearch = Infinity;
      }

      $(element).select2(options);
    });
  };

  initSelect2();
});
// #endregion

// Element Top Left position helper
function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}
