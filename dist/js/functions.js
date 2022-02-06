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
	const mainNavbar = document.querySelector('.dashboard > .main-navbar');

	if (mainNavbar) {
		// Expand / Collapse Main navbar
		const expandCollapseActions = document.querySelectorAll(
			'[data-action="sidebar-toggler"]'
		);
		for (let expandCollapseAction of expandCollapseActions) {
			expandCollapseAction.addEventListener('click', () => {
				if (mainNavbar.hasAttribute('collapse')) {
					mainNavbar.removeAttribute('collapse');
					mainNavbar.setAttribute('expand', '');
				} else if (mainNavbar.hasAttribute('expand')) {
					mainNavbar.removeAttribute('expand');
					mainNavbar.setAttribute('collapse', '');
				}
			});
		}

		// Expand / Collapse Main navbar on click outside for Mobile view
		var windowWidth = window.innerWidth;
		const dashboardContent = document.querySelector(
			'.dashboard > .main-navbar + .content'
		);

		// Check Window width
		if (windowWidth <= 991.98) {
			if (mainNavbar.hasAttribute('expand')) {
				document.addEventListener('mouseup', function (e) {
					if (windowWidth <= 991.98)
						if (!mainNavbar.contains(e.target)) {
							mainNavbar.removeAttribute('expand');
							mainNavbar.setAttribute('collapse', '');
						}
				});
			}
		}

		window.addEventListener(
			'resize',
			() => {
				windowWidth = window.innerWidth;

				if (windowWidth <= 991.98) {
					if (mainNavbar.hasAttribute('expand')) {
						document.addEventListener('mouseup', function (e) {
							if (windowWidth <= 991.98)
								if (!mainNavbar.contains(e.target)) {
									mainNavbar.removeAttribute('expand');
									mainNavbar.setAttribute('collapse', '');
								}
						});
					}
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

		// Check activedropdown links
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
					tooltipContainer.innerText = tooltip.getAttribute('title');
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
	const topNavbar = document.querySelector(
			'.dashboard > .content > .top-navbar'
		),
		mainContainer = document.querySelector('.dashboard > .content');

	if (topNavbar) {
		// Scroll Animation
		mainContainer.addEventListener('scroll', () => {
			if (mainContainer.scrollTop > 100) {
				topNavbar.classList.add('scrolled');
			} else {
				topNavbar.classList.remove('scrolled');
			}
		});

		// Search bar
		const searchBar = topNavbar.querySelector('.search-bar');
		// View Search bar
		searchBar.querySelector('[icon]').addEventListener('click', () => {
			if (!searchBar.classList.contains('show')) {
				searchBar.classList.add('show');
				searchBar.querySelector('input').focus();
			}
		});
		// Hide Search bar
		searchBar.querySelector('button').addEventListener('click', () => {
			if (searchBar.classList.contains('show')) {
				searchBar.classList.remove('show');
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
		notifTabsClose.addEventListener('click', () => {
			notifTabs.classList.add('remove');
			notifTabs.ontransitionend = function () {
				notifTabs.remove();
			};
		});
	}
});
// #endregion

// Element Top Left position helper
function offset(el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}
