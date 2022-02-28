'use strict';

// Class definition
var HOLOLApp = (function () {
  var initPageLoader = function () {
    // CSS3 Transitions only after page load
    // (.page - loading class added to body tag and remove with JS on page load)
    HOLOLUtil.removeClass(document.body, 'page-loading');
  };

  var initLazyLoad = function () {
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
  };

  var initBootstrapTooltip = function (el, options) {
    var delay = {};

    // Return if element is undefined or null
    if (!el) return;

    // Set options if is undefined of null
    if (!options) options = {};

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

  var initBootstrapTooltips = function (options) {
    HOLOLUtil.each(
      document.querySelectorAll('[data-bs-toggle="tooltip"]'),
      function (tooltipTriggerEl) {
        if (options) initBootstrapTooltip(tooltipTriggerEl, options);
        else initBootstrapTooltip(tooltipTriggerEl, {});
      }
    );
  };

  var initBootstrapPopover = function (el, options) {
    var delay = {};

    // Return if element is undefined or null
    if (!el) return;

    // Set options if is undefined of null
    if (!options) options = {};

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

  var initBootstrapPopovers = function (options) {
    HOLOLUtil.each(
      document.querySelectorAll('[data-bs-toggle="popover"]'),
      function (popoverTrigger) {
        if (options) initBootstrapPopover(popoverTrigger, options);
        else initBootstrapPopover(popoverTrigger, {});
      }
    );
  };

  var initScrollSpy = function () {
    HOLOLUtil.each(document.querySelectorAll('[data-bs-spy="scroll"]'), function (element) {
      var sel = element.getAttribute('data-bs-target');
      var scrollContent = document.querySelector(sel);
      var scrollSpy = bootstrap.ScrollSpy.getInstance(scrollContent);
      if (scrollSpy) {
        scrollSpy.refresh();
      }
    });
  };

  var initButtons = function () {
    HOLOLUtil.each(document.querySelectorAll('[data-holol-buttons="true"]'), function (group) {
      var selector = group.hasAttribute('data-holol-buttons-target')
        ? group.getAttribute('data-holol-buttons-target')
        : '.btn';

      // Toggle Handler
      HOLOLUtil.on(group, selector, 'click', function (e) {
        HOLOLUtil.each(group.querySelectorAll(selector + '.active'), function (button) {
          HOLOLUtil.removeClass(button, 'active');
        });

        HOLOLUtil.addClass(this, 'active');
      });
    });
  };

  var initCheck = function () {
    // Toggle Handler
    HOLOLUtil.on(document.body, '[data-holol-check="true"]', 'change', function (e) {
      var check = this;

      HOLOLUtil.each(
        document.querySelectorAll(HOLOLUtil.attr(check, 'data-holol-check-target')),
        function (target) {
          target.type == 'checkbox'
            ? (target.checked = check.checked)
            : HOLOLUtil.toggleClass(target, 'active');
        }
      );
    });
  };

  var initSelect2 = function () {
    HOLOLUtil.each(
      document.querySelectorAll('[data-control="select2"], [data-holol-select2="true"]'),
      function (element) {
        var options = {
          dir: HOLOLUtil.attr(document.body, 'direction'),
        };

        if (HOLOLUtil.attr(element, 'data-hide-search') == 'true')
          options.minimumResultsForSearch = Infinity;

        $(element).select2(options);
      }
    );
  };

  var initAutosize = function () {
    HOLOLUtil.each(document.querySelectorAll('[data-holol-autosize="true"]'), function (input) {
      autosize(input);
    });
  };

  var initCountUp = function () {
    HOLOLUtil.each(
      document.querySelectorAll('[data-holol-countup="true"]:not(.counted)'),
      function (element) {
        if (HOLOLUtil.isInViewport(element) && HOLOLUtil.visible(element)) {
          var options = {};

          var value = HOLOLUtil.attr(element, 'data-holol-countup-value');
          value = parseFloat(value.replace(/,/, ''));

          if (HOLOLUtil.hasAttr(element, 'data-holol-countup-start-val'))
            options.startVal = parseFloat(HOLOLUtil.attr(element, 'data-holol-countup-start-val'));

          if (HOLOLUtil.hasAttr(element, 'data-holol-countup-duration'))
            options.duration = parseInt(HOLOLUtil.attr(element, 'data-holol-countup-duration'));

          if (HOLOLUtil.hasAttr(element, 'data-holol-countup-decimal-places'))
            options.decimalPlaces = parseInt(
              HOLOLUtil.attr(element, 'data-holol-countup-decimal-places')
            );

          if (HOLOLUtil.hasAttr(element, 'data-holol-countup-prefix'))
            options.prefix = HOLOLUtil.attr(element, 'data-holol-countup-prefix');

          if (HOLOLUtil.hasAttr(element, 'data-holol-countup-suffix'))
            options.suffix = HOLOLUtil.attr(element, 'data-holol-countup-suffix');

          if (HOLOLUtil.hasAttr(element, 'data-holol-countup-short'))
            if (value >= 1000 && value < 1000000) {
              value = value / 1000;
              options.suffix = 'K';

              if (HOLOLUtil.hasAttr(element, 'data-holol-countup-start-val'))
                options.startVal =
                  parseFloat(HOLOLUtil.attr(element, 'data-holol-countup-start-val')) / 1000;
            } else if (value >= 1000000 && value < 1000000000) {
              value = value / 1000000;
              options.suffix = 'M';

              if (HOLOLUtil.hasAttr(element, 'data-holol-countup-start-val'))
                options.startVal =
                  parseFloat(HOLOLUtil.attr(element, 'data-holol-countup-start-val')) / 1000000;
            } else if (value >= 1000000000 && value < 1000000000000) {
              value = value / 1000000000;
              options.suffix = 'B';

              if (HOLOLUtil.hasAttr(element, 'data-holol-countup-start-val'))
                options.startVal =
                  parseFloat(HOLOLUtil.attr(element, 'data-holol-countup-start-val')) / 1000000000;
            } else {
              value = value / 1000000000000;
              options.suffix = 'T';

              if (HOLOLUtil.hasAttr(element, 'data-holol-countup-start-val'))
                options.startVal =
                  parseFloat(HOLOLUtil.attr(element, 'data-holol-countup-start-val')) /
                  1000000000000;
            }

          var count = new countUp.CountUp(element, value, options);

          count.start();

          HOLOLUtil.addClass(element, 'counted');
        }
      }
    );
  };

  var initCountUpTabs = function () {
    // Initial call
    initCountUp();

    // Window scroll event handler
    window.addEventListener('scroll', initCountUp);

    // Tabs shown event handler
    HOLOLUtil.each(
      document.querySelectorAll('[data-holol-countup-tabs="true"][data-bs-toggle="tab"]'),
      function (tab) {
        tab.addEventListener('shown.bs.tab', initCountUp);
      }
    );
  };

  var initSmoothScroll = function () {
    if (SmoothScroll) {
      new SmoothScroll('a[data-holol-scroll-toggle][href*="#"]', {
        offset: function (anchor, toggle) {
          // Integer or Function returning an integer. How far to
          // offset the scrolling anchor location in pixels.
          // This example is a function, but you could do something
          // as simple as `offset: 25`.

          // An example returning different values based on whether
          // the clicked link was in the header nav or not
          if (anchor.hasAttribute('data-holol-scroll-offset')) {
            var val = HOLOLUtil.getResponsiveValue(anchor.getAttribute('data-holol-scroll-offset'));

            return val;
          } else {
            return 0;
          }
        },
      });
    }
  };

  var initDateRangePicker = function () {};

  var initMainNavbar = function () {
    // Main navbar
    const mainNavbar = document.querySelector('.dashboard > .main-navbar');
    const mainContainer = document.querySelector('.dashboard > .content');

    if (mainNavbar) {
      // Mobile view checkup
      var windowWidth = window.innerWidth <= 991.98 ? true : false;

      // Expand / Collapse Main navbar
      HOLOLUtil.each(
        document.querySelectorAll('[data-action="sidebar-toggler"]'),
        function (expandCollapseAction) {
          HOLOLUtil.addEvent(expandCollapseAction, 'click', () => {
            if (HOLOLUtil.hasAttr(mainNavbar, 'collapse')) {
              HOLOLUtil.removeAttr(mainNavbar, 'collapse');
              HOLOLUtil.attr(mainNavbar, 'expand', '');

              // Check window width for mobile view
              if (windowWidth) HOLOLUtil.addClass(document.body, 'overflow-hidden h-100');
            } else if (mainNavbar.hasAttribute('expand')) {
              HOLOLUtil.removeAttr(mainNavbar, 'expand');
              HOLOLUtil.attr(mainNavbar, 'collapse', '');
              if (windowWidth) {
                HOLOLUtil.removeClass(document.body, 'overflow-hidden h-100');
              }
            }
          });
        }
      );

      // Close Main navbar on click outside
      if (windowWidth)
        HOLOLUtil.addEvent(document, 'mouseup', function (e) {
          if (HOLOLUtil.hasAttr(mainNavbar, 'expand'))
            if (mainContainer.contains(e.target)) {
              HOLOLUtil.removeAttr(mainNavbar, 'expand');
              HOLOLUtil.attr(mainNavbar, 'collapse', '');
              HOLOLUtil.removeClass(document.body, 'overflow-hidden h-100');
            }
        });
      // Resize event for close Main navbar on click outside
      HOLOLUtil.addEvent(
        window,
        'resize',
        () => {
          if (windowWidth)
            document.addEventListener('mouseup', function (e) {
              if (HOLOLUtil.hasAttr(mainNavbar, 'expand'))
                if (mainContainer.contains(e.target)) {
                  HOLOLUtil.removeAttr(mainNavbar, 'expand');
                  HOLOLUtil.attr(mainNavbar, 'collapse', '');
                  HOLOLUtil.removeClass(document.body, 'overflow-hidden h-100');
                }
            });
        },
        true
      );

      // Actions for dropdown links
      // Dropdown lists
      const dropdownLists = mainNavbar.querySelectorAll('.nav-link.dropdown');
      HOLOLUtil.each(dropdownLists, function (dropdownListItem) {
        HOLOLUtil.addEvent(dropdownListItem, 'click', () => {
          if (!HOLOLUtil.hasClass(dropdownListItem, 'expand')) {
            // Collapse All Dropdown
            HOLOLUtil.each(dropdownLists, function (dropdownListItemNew) {
              HOLOLUtil.removeClass(dropdownListItemNew, 'expand');
            });
            // Expand current dropdown
            HOLOLUtil.addClass(dropdownListItem, 'expand');
          } // Collapse All Dropdown
          else
            HOLOLUtil.each(dropdownLists, function (dropdownListItemNew) {
              HOLOLUtil.removeClass(dropdownListItemNew, 'expand');
            });
        });
      });

      // Check active dropdown links
      // Nav items
      HOLOLUtil.each(mainNavbar.querySelectorAll('.nav-item'), function (navItem) {
        let dropdownList = navItem.querySelector('.dropdown-list');
        if (dropdownList && dropdownList.querySelector('.nav-item.active'))
          HOLOLUtil.addClass(navItem.querySelector('.nav-link.dropdown'), 'expand');
      });

      // Enable tooltips
      HOLOLUtil.each(mainNavbar.querySelectorAll('[data-tooltip'), function (tooltip) {
        // Event to handle mouse enter event
        HOLOLUtil.addEvent(tooltip, 'mouseenter', () => {
          // Check if Main navbar has collapse status
          if (HOLOLUtil.hasAttr(mainNavbar, 'collapse')) {
            // Create Tooltip container
            const tooltipContainer = document.createElement('div');
            HOLOLUtil.attr(tooltipContainer, 'tooltip-container', '');

            // Set tooltip data
            HOLOLUtil.setTEXT(tooltipContainer, HOLOLUtil.attr(tooltip, 'data-title'));

            // Append tooltip to view
            HOLOLUtil.append(tooltipContainer, document.body);

            // Set tooltip position
            HOLOLUtil.css(tooltipContainer, 'top', HOLOLUtil.offset(tooltip).top + 'px');
          }
        });

        // Remove tooltip content on leave target
        HOLOLUtil.addEvent(tooltip, 'mouseleave', () => {
          HOLOLUtil.remove(document.querySelector('[tooltip-container]'));
        });
      });
    }
  };

  var initTopNavbar = function () {
    // Main navbar
    const topNavbar = document.querySelector('.dashboard > .content > .top-navbar');
    // Check if Top navbar is exist
    if (topNavbar) {
      // Scroll Animation
      HOLOLUtil.addEvent(window, 'scroll', () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100)
          HOLOLUtil.addClass(topNavbar, 'scrolled');
        else HOLOLUtil.removeClass(topNavbar, 'scrolled');
      });

      // Search bar
      const searchBar = topNavbar.querySelector('.search-bar');

      // Event for Search icon click
      HOLOLUtil.addEvent(searchBar, 'click', () => {
        // Check for Mobile view
        if (window.innerWidth <= 991.98) {
          // Get Floating search bar
          var searchbarFloating = document.querySelector('.searchbarFloating');
          // Check active state
          if (!HOLOLUtil.hasClass(searchbarFloating, 'active')) {
            // View Search bar on click
            HOLOLUtil.addClass(searchBar, 'active');
            HOLOLUtil.addClass(searchbarFloating, 'active');
            document.querySelector('.searchbarFloating input').focus();
          } else {
            // Hide Search bar on click
            HOLOLUtil.removeClass(searchBar, 'active');
            HOLOLUtil.removeClass(searchbarFloating, 'active');
          }

          // Hide Search bar on click outside
          HOLOLUtil.addEvent(document, 'mouseup', function (e) {
            if (HOLOLUtil.hasClass(searchbarFloating, 'active') && window.innerWidth <= 991.98)
              if (!searchbarFloating.contains(e.target) && !searchBar.contains(e.target)) {
                HOLOLUtil.removeClass(searchBar, 'active');
                HOLOLUtil.removeClass(searchbarFloating, 'active');
              }
          });
        }
      });
    }
  };

  var initNotificationTabs = function () {
    // Main navbar
    const notifTabs = document.querySelector('.dashboard > .content [notif]'),
      notifTabsClose = notifTabs.querySelector('[close]');

    if (notifTabs) {
      // Close Notification banal
      HOLOLUtil.addEvent(notifTabsClose, 'click', () => {
        HOLOLUtil.addClass(notifTabs, 'remove');
        notifTabs.ontransitionend = function () {
          HOLOLUtil.remove(notifTabs);
        };
      });

      // Change Notification color
      let notifTabsLinks = notifTabs.querySelectorAll('.action[data-bs-toggle="list"]');

      HOLOLUtil.each(notifTabsLinks, function (link) {
        // Check active link
        if (HOLOLUtil.hasClass(link, 'active'))
          HOLOLUtil.attr(notifTabs, 'data-type', HOLOLUtil.attr(link, 'data-type'));

        // Change on click
        HOLOLUtil.addEvent(link, 'click', () => {
          HOLOLUtil.attr(notifTabs, 'data-type', HOLOLUtil.attr(link, 'data-type'));
        });
      });
    }
  };

  var initDropdownSelect = function () {
    // Get all Dropdown with selector
    HOLOLUtil.each(
      document.querySelectorAll('[data-bs-toggle="dropdown"][data-select]'),
      function (dropdownItem) {
        // Check exist
        if (!dropdownItem) {
          return;
        }

        // Get select container
        var selector = document.querySelector('#' + HOLOLUtil.attr(dropdownItem, 'data-select'));
        // Get all options
        var options = dropdownItem.nextElementSibling.querySelectorAll('.dropdown-item');

        HOLOLUtil.each(options, function (option) {
          // Set active value
          if (HOLOLUtil.hasClass(option, 'active')) {
            // Set active
            selector.value = HOLOLUtil.attr(option, 'value');

            // Set dropdown text
            HOLOLUtil.setTEXT(dropdownItem, HOLOLUtil.attr(option, 'value'));
          }

          // Action on click an option
          HOLOLUtil.addEvent(option, 'click', () => {
            // Remove active for all
            HOLOLUtil.each(options, function (optionInner) {
              HOLOLUtil.removeClass(optionInner, 'active');
            });

            // Add active for current
            HOLOLUtil.addClass(option, 'active');

            // Add active value to selector
            selector.value = HOLOLUtil.attr(option, 'value');

            // Set dropdown text
            HOLOLUtil.setTEXT(dropdownItem, HOLOLUtil.attr(option, 'value'));
          });
        });
      }
    );
  };

  var initDragScroll = function () {
    // Get all Dropdown with selector
    HOLOLUtil.each(document.querySelectorAll('[drag][scroll]'), function (dragToScrollItem) {
      // Check existing
      if (!dragToScrollItem) {
        return;
      }

      // Change cursor to grab
      HOLOLUtil.css(dragToScrollItem, 'cursor', 'grab');

      // Set default position
      let pos = { top: 0, left: 0, x: 0, y: 0 };

      // Mouse Down Handler
      const mouseDownHandler = function (e) {
        HOLOLUtil.css(dragToScrollItem, 'cursor', 'grabbing');
        HOLOLUtil.css(dragToScrollItem, 'userSelect', 'none');

        pos = {
          left: dragToScrollItem.scrollLeft,
          top: dragToScrollItem.scrollTop,
          // Get the current mouse position
          x: e.clientX,
          y: e.clientY,
        };

        HOLOLUtil.addEvent(document, 'mousemove', mouseMoveHandler);
        HOLOLUtil.addEvent(document, 'mouseup', mouseUpHandler);
      };

      // Mouse Move Handler
      const mouseMoveHandler = function (e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        dragToScrollItem.scrollTop = pos.top - dy;
        dragToScrollItem.scrollLeft = pos.left - dx;
      };

      // Mouse Up Handler
      const mouseUpHandler = function () {
        HOLOLUtil.css(dragToScrollItem, 'cursor', 'grab');
        HOLOLUtil.css(dragToScrollItem, 'userSelect', '');

        HOLOLUtil.removeEvent(document, 'mousemove', mouseMoveHandler);
        HOLOLUtil.removeEvent(document, 'mouseup', mouseUpHandler);
      };

      // Attach the handler
      dragToScrollItem.addEventListener('mousedown', mouseDownHandler);
    });
  };

  var initDaterangepicker = function () {
    // Get all Date Pickers
    HOLOLUtil.each($('[date-picker]'), function (picker) {
      // Get picker
      var picker = $(picker);

      // Check existing
      if (!picker) {
        return;
      }

      var start = moment();
      var end = moment();

      // Locale Translation
      var locale, ranges;
      if (HOLOLUtil.getLang() == 'ar') {
        locale = {
          direction: 'rtl',
          applyLabel: 'تاكيد',
          cancelLabel: 'الغاء',
          fromLabel: 'من',
          toLabel: 'الى',
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
        ranges = {
          اليوم: [moment(), moment()],
          امس: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'أخر 7 ايام': [moment().subtract(6, 'days'), moment()],
          'أخر 30 يوم': [moment().subtract(29, 'days'), moment()],
          'هذا الشهر': [moment().startOf('month'), moment().endOf('month')],
          'أخر شهر': [
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month'),
          ],
        };
      } else if (HOLOLUtil.getLang == 'en') {
        locale = {
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
          customRangeLabel: 'Custom Range',
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
        ranges = {
          Today: [moment(), moment()],
          Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'This Month': [moment().startOf('month'), moment().endOf('month')],
          'Last Month': [
            moment().subtract(1, 'month').startOf('month'),
            moment().subtract(1, 'month').endOf('month'),
          ],
        };
      }

      // Label text
      function cb(start, end, label) {
        var title = '';
        var range = '';

        if (end - start < 100 || label == 'Today') {
          title = 'Today:';
          range = start.format('MMM D');
        } else if (label == 'Yesterday') {
          title = 'Yesterday:';
          range = start.format('MMM D');
        } else {
          range = start.format('MMM D') + ' - ' + end.format('MMM D');
        }

        if ($('#datePickerRangeValue').is('input'))
          $('#datePickerRangeValue').val(title + ' ' + range);
        else {
          $('#datePickerRangeValue').html(title + ' ' + range);
          $('#datePickerRangeValue')
            .next('input')
            .val(start + ' - ' + end);
        }
      }

      // Date Picker caller
      picker.daterangepicker(
        {
          locale: locale,
          startDate: start,
          endDate: end,
          applyClass: 'btn-primary',
          cancelClass: 'btn-light-primary',
          ranges: ranges,
        },
        cb
      );
      cb(start, end, '');

      // Set active state on picker opened
      picker.on('show.daterangepicker', function (ev, el) {
        picker.addClass('active');
      });

      // Remove active state on picker closed
      picker.on('hide.daterangepicker', function (ev, el) {
        picker.removeClass('active');
      });
    });
  };

  // Public methods
  return {
    init: function () {
      this.initPageLoader();
      this.initLazyLoad();
      this.initBootstrapTooltip();
      this.initBootstrapTooltips();
      this.initBootstrapPopover();
      this.initBootstrapPopovers();
      this.initScrollSpy();
      this.initButtons();
      this.initCheck();
      this.initSelect2();
      this.initAutosize();
      this.initCountUp();
      this.initCountUpTabs();
      this.initSmoothScroll();
      this.initDateRangePicker();
      this.initMainNavbar();
      this.initTopNavbar();
      this.initNotificationTabs();
      this.initDropdownSelect();
      this.initDragScroll();
      this.initDaterangepicker();
    },

    initPageLoader: function () {
      initPageLoader();
    },

    initLazyLoad: function () {
      initLazyLoad();
    },

    initBootstrapTooltip: function (el, options) {
      return initBootstrapTooltip(el, options);
    },

    initBootstrapTooltips: function () {
      initBootstrapTooltips();
    },

    initBootstrapPopovers: function () {
      initBootstrapPopovers();
    },

    initBootstrapPopover: function (el, options) {
      return initBootstrapPopover(el, options);
    },

    initScrollSpy: function () {
      initScrollSpy();
    },

    initButtons: function () {
      initButtons();
    },

    initCheck: function () {
      initCheck();
    },

    initSelect2: function () {
      initSelect2();
    },

    initCountUp: function () {
      initCountUp();
    },

    initCountUpTabs: function () {
      initCountUpTabs();
    },

    initAutosize: function () {
      initAutosize();
    },

    initSmoothScroll: function () {
      initSmoothScroll();
    },

    initDateRangePicker: function () {
      initDateRangePicker();
    },

    initMainNavbar: function () {
      initMainNavbar();
    },

    initTopNavbar: function () {
      initTopNavbar();
    },

    initNotificationTabs: function () {
      initNotificationTabs();
    },

    initDropdownSelect: function () {
      initDropdownSelect();
    },

    initDragScroll: function () {
      initDragScroll();
    },

    initDaterangepicker: function () {
      initDaterangepicker();
    },
  };
})();

// On document ready
HOLOLUtil.onDOMContentLoaded(() => {
  HOLOLApp.init();
});

// On window load
window.addEventListener('load', () => {
  HOLOLApp.initPageLoader();
});
