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

    if (window.innerWidth <= 991.98) {
      searchBar.addEventListener('click', () => {
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
      });
    }
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

      ele.daterangepicker(
        {
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
      });

      // Remove active state on picker closed
      ele.on('hide.daterangepicker', function (ev, picker) {
        ele.removeClass('active');
      });
    }
  }
});

// Element Top Left position helper
function offset(el) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}
