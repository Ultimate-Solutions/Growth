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
		const expandCollapseActions = document.querySelectorAll('[sidebar-action]');
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

		// Expand / Collapse Main navbar - Mobile
		var windowWidth = window.innerWidth;
		// Check window width
		if (windowWidth <= 992) {
			// Expand status
			if (mainNavbar.hasAttribute('expand')) {
				// Remove desktop expand
				mainNavbar.removeAttribute('expand');
				// Add mobile expand
				mainNavbar.setAttribute('expand-mobile', '');
			}
			// Collapse status
			if (mainNavbar.hasAttribute('collapse')) {
				// Remove desktop expand
				mainNavbar.removeAttribute('collapse');
				// Add mobile expand
				mainNavbar.setAttribute('collapse-mobile', '');
			}
		} else {
			// Expand status
			if (mainNavbar.hasAttribute('expand-mobile')) {
				// Add desktop expand
				mainNavbar.setAttribute('expand', '');
				// Remove mobile expand
				mainNavbar.removeAttribute('expand-mobile');
			}
			// Collapse status
			if (mainNavbar.hasAttribute('collapse-mobile')) {
				// Add desktop expand
				mainNavbar.setAttribute('collapse', '');
				// Remove mobile expand
				mainNavbar.removeAttribute('collapse-mobile');
			}
		}
		// On screen resize
		window.addEventListener(
			'resize',
			() => {
				windowWidth = window.innerWidth;

				if (windowWidth <= 992) {
					// Expand status
					if (mainNavbar.hasAttribute('expand')) {
						// Remove desktop expand
						mainNavbar.removeAttribute('expand');
						// Add mobile expand
						mainNavbar.setAttribute('expand-mobile', '');
					}
					// Collapse status
					if (mainNavbar.hasAttribute('collapse')) {
						// Remove desktop expand
						mainNavbar.removeAttribute('collapse');
						// Add mobile expand
						mainNavbar.setAttribute('collapse-mobile', '');
					}
				} else {
					// Expand status
					if (mainNavbar.hasAttribute('expand-mobile')) {
						// Add desktop expand
						mainNavbar.setAttribute('expand', '');
						// Remove mobile expand
						mainNavbar.removeAttribute('expand-mobile');
					}
					// Collapse status
					if (mainNavbar.hasAttribute('collapse-mobile')) {
						// Add desktop expand
						mainNavbar.setAttribute('collapse', '');
						// Remove mobile expand
						mainNavbar.removeAttribute('collapse-mobile');
					}
				}
			},
			true
		);
		for (let expandCollapseAction of expandCollapseActions) {
			expandCollapseAction.addEventListener('click', () => {
				if (mainNavbar.hasAttribute('collapse-mobile')) {
					mainNavbar.removeAttribute('collapse-mobile');
					mainNavbar.setAttribute('expand-mobile', '');
				} else if (mainNavbar.hasAttribute('expand-mobile')) {
					mainNavbar.removeAttribute('expand-mobile');
					mainNavbar.setAttribute('collapse-mobile', '');
				}
			});
		}

		// Dropdown lists
		let dropdwonLists = mainNavbar.querySelectorAll('.nav-link.dropdown');

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

		// Actions for dropdown links
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

// Element Top Left position helper
function offset(el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}
