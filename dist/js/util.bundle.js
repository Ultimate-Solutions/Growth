/*!
 * Holol Utility
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory())
    : typeof define === 'function' && define.amd
    ? define(factory)
    : (global.majedUtilities = factory());
})(this, function () {
  //
  // Utility Methods
  //

  /**
   * Check if browser supports required methods
   * @return {Boolean} Returns true if all required methods are supported
   */
  var supports = () => {
    return (
      'querySelector' in document &&
      'addEventListener' in window &&
      'requestAnimationFrame' in window &&
      'closest' in window.Element.prototype
    );
  };

  /**
   * Get parameter value from URL.
   * @param {string} paramName Parameter name.
   * @returns {string}
   */
  var getURLParam = (paramName) => {
    var searchString = window.location.search.substring(1),
      i,
      val,
      params = searchString.split('&');

    for (i = 0; i < params.length; i++) {
      val = params[i].split('=');
      if (val[0] == paramName) {
        return unescape(val[1]);
      }
    }

    return null;
  };

  /**
   * Checks whether current device is mobile device.
   * @returns {boolean}
   */
  var isMobileDevice = () => {
    var isMobileDevice = this.getViewPort().width < this.getBreakpoint('lg') ? true : false;

    // For use within normal web clients
    if (isMobileDevice === false) isMobileDevice = navigator.userAgent.match(/iPad/i) != null;

    return isMobileDevice;
  };

  /**
   * Checks whether current device is desktop device.
   * @returns {boolean}
   */
  var isDesktopDevice = () => {
    return isMobileDevice() ? false : true;
  };

  /**
   * Checks whether current device is touch device.
   * @returns {boolean}
   */
  var isTouchDevice = () => {
    return (
      true ==
      ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch))
    );
  };

  /**
   * Gets browser window viewport size. Ref:
   * http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
   * @returns {object}
   */
  var getViewPort = () => {
    var e = window,
      a = 'inner';
    if (!('innerWidth' in window)) {
      a = 'client';
      e = document.documentElement || document.body;
    }

    return {
      width: e[a + 'Width'],
      height: e[a + 'Height'],
    };
  };

  /**
   * Gets browser window viewport width.
   * @returns {number}
   */
  var getViewportWidth = () => {
    return this.getViewPort().width;
  };

  /**
   * Gets browser window viewport height.
   * @returns {number}
   */
  var getViewportHeight = () => {
    return this.getViewPort().height;
  };

  /**
   * Gets window width for give breakpoint mode.
   * @param {string} breakpoint Responsive mode name (e.g: xl, lg, md, sm, xs) or
   * (e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
   * @returns {number} (e.g: xxl: 1400)
   */
  var getBreakpoint = (breakpoint) => {
    var value = this.getCssVariableValue('--breakpoint-' + breakpoint);

    if (value) {
      value = parseInt(value.trim());
    }

    return value;
  };

  /**
   * Checks whether given device breakpoint is currently activated.
   * @param {string} breakpoint Responsive breakpoint name (e.g: xl, lg, md, sm, xs) or
   * (e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
   * @returns {boolean}
   */
  var isBreakpointUp = (breakpoint) => {
    return this.getViewPort().width >= this.getBreakpoint(breakpoint);
  };

  /**
   * Checks whether given device breakpoint is currently deactivated.
   * @param {string} breakpoint Responsive breakpoint name (e.g: xl, lg, md, sm, xs) or
   * (e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
   * @returns {boolean}
   */
  var isBreakpointDown = (breakpoint) => {
    return this.getViewPort().width < this.getBreakpoint(breakpoint);
  };

  /**
   * Generates unique ID for give prefix & suffix.
   * @param {string} prefix Prefix for generated ID, can be empty
   * @param {string} suffix suffix for generated ID, can be empty
   * @returns {boolean}
   */
  var getUniqueID = (prefix, suffix) => {
    return (prefix || '') + Math.floor(Math.random() * new Date().getTime()) + (suffix || '');
  };

  /**
   * Checks whether object has property matches given key path.
   * @param {object} obj Object contains values paired with given key path
   * @param {string} keys Keys path separated with dots
   * @returns {boolean}
   */
  var isSet = (obj, keys) => {
    var stone;

    keys = keys || '';

    if (keys.indexOf('[') !== -1) throw new Error('Unsupported object path notation.');

    keys = keys.split('.');

    do {
      if (obj === undefined) return false;

      stone = keys.shift();

      if (!obj.hasOwnProperty(stone)) return false;

      obj = obj[stone];
    } while (keys.length);

    return true;
  };

  /**
   * Gets highest z-index of the given element parents
   * @param {object} el jQuery element object
   * @returns {number}
   */
  var getHighestZindex = (el) => {
    var position, value;

    while (el && el !== document) {
      // Ignore z-index if position is set to a value where z-index is ignored by the browser
      // This makes behavior of this function consistent across browsers
      // WebKit always returns auto if the element is positioned
      position = HOLOLUtil.css(el, 'position');

      if (position === 'absolute' || position === 'relative' || position === 'fixed') {
        // IE returns 0 when zIndex is not specified
        // other browsers return a string
        // we ignore the case of nested elements with an explicit value of 0
        // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
        value = parseInt(HOLOLUtil.css(el, 'z-index'));

        if (!isNaN(value) && value !== 0) return value;
      }

      el = el.parentNode;
    }

    return 1;
  };

  /**
   * Checks whether the element has any parent with fixed position
   * @param {object} el jQuery element object
   * @returns {boolean}
   */
  var hasFixedPositionedParent = (el) => {
    var position;

    while (el && el !== document) {
      position = HOLOLUtil.css(el, 'position');

      if (position === 'fixed') return true;

      el = el.parentNode;
    }

    return false;
  };

  /**
   * Simulates delay
   * @param {number} milliseconds Time in milliseconds
   */
  var sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  /**
   * Throttle function
   * @param {function} func function which needs to be throttled
   * @param {number} delay time interval in milliseconds
   */
  var throttle = (timer, func, delay) => {
    // If setTimeout is already scheduled, no need to do anything
    if (timer) return;

    // Schedule a setTimeout after delay seconds
    timer = setTimeout(function () {
      func();

      // Once setTimeout function execution is finished, timerId = undefined so that in <br>
      // the next scroll event function execution can be scheduled by the setTimeout
      timer = undefined;
    }, delay);
  };

  /**
   * Debounce function
   * @param {function} func function which needs to be debounced
   * @param {number} delay debounced time in milliseconds
   */
  var debounce = (timer, func, delay) => {
    // Cancels the setTimeout method execution
    clearTimeout(timer);

    // Executes the func after delay time.
    timer = setTimeout(func, delay);
  };

  /**
   * Get Body object
   * @returns {object}
   */
  var getBodyTag = () => {
    return document.getElementsByTagName('body')[0];
  };

  /**
   * Get HTML object
   * @returns {object}
   */
  var getHTMLTag = () => {
    return document.getElementsByTagName('html')[0];
  };

  /**
   * Gets randomly generated integer value within given min and max range
   * @param {number} min Range start value, default: -1000
   * @param {number} max Range end value, default: 1000
   * @returns {number}
   */
  var getRandomInt = (min, max) => {
    return Math.floor(Math.random() * ((max || 1000) - (min || -1000) + 1)) + (min || -1000);
  };

  /**
   * Checks whether the element has given classes
   * @param {object} element jQuery element object
   * @param {string} className string with spaces between every class name for multi classes
   * @returns {boolean}
   */
  var hasClass = (element, className) => {
    if (!element || typeof className === 'undefined') return;

    var classesArr = className.split(' ');

    for (var i = 0; i < classesArr.length; i++) {
      let classNew = HOLOLUtil.trim(classesArr[i]),
        hasClass = element.classList
          ? element.classList.contains(classNew)
          : new RegExp('\\b' + classNew + '\\b').test(element.classNew);

      if (!hasClass) return false;
    }

    return true;
  };

  /**
   * Add class to the given element
   * @param {object} element jQuery element object
   * @param {string} className string with spaces between every class name to add multi classes
   */
  var addClass = (element, className) => {
    if (!element || typeof className === 'undefined') return;

    var classNames = className.split(' ');

    if (element.classList) {
      for (var i = 0; i < classNames.length; i++)
        if (classNames[i] && classNames[i].length > 0)
          element.classList.add(HOLOLUtil.trim(classNames[i]));
    } else if (!HOLOLUtil.hasClass(element, className)) {
      for (var x = 0; x < classNames.length; x++)
        element.className += ' ' + HOLOLUtil.trim(classNames[x]);
    }
  };

  /**
   * Remove class from the given element
   * @param {object} element jQuery element object
   * @param {string} className string with spaces between every class name to remove multi classes
   */
  var removeClass = (element, className) => {
    if (!element || typeof className === 'undefined') return;

    var classNames = className.split(' ');

    if (element.classList)
      for (var i = 0; i < classNames.length; i++)
        element.classList.remove(HOLOLUtil.trim(classNames[i]));
    else if (HOLOLUtil.hasClass(element, className))
      for (var x = 0; x < classNames.length; x++)
        element.className = element.className.replace(
          new RegExp('\\b' + HOLOLUtil.trim(classNames[x]) + '\\b', 'g'),
          ''
        );
  };

  /**
   * Toggle class off the given element
   * @param {object} element jQuery element object
   * @param {string} className string with spaces between every class name to add multi classes
   */
  var toggleClass = (element, className) => {
    if (!element || typeof className === 'undefined') return;

    var classNames = className.split(' ');

    if (element.classList) {
      for (var i = 0; i < classNames.length; i++)
        if (classNames[i] && classNames[i].length > 0)
          element.classList.toggle(HOLOLUtil.trim(classNames[i]));
    } else if (!HOLOLUtil.hasClass(element, className)) {
      for (var x = 0; x < classNames.length; x++)
        element.className += ' ' + HOLOLUtil.trim(classNames[x]);
    }
  };

  /**
   * Add Event to the given element
   * @param {object} element jQuery element object
   * @param {string} type string for event type (e.g: click, mouseover, ...)
   * @param {object} handler what run on event (e.g: function)
   */
  var addEvent = (element, type, handler) => {
    if (typeof element !== 'undefined' && element !== null) element.addEventListener(type, handler);
  };

  /**
   * Remove Event from the given element
   * @param {object} element jQuery element object
   * @param {string} type string for event type (e.g: click, mouseover, ...)
   * @param {object} handler what run on event (e.g: function)
   */
  var removeEvent = (element, type, handler) => {
    if (element !== null) element.removeEventListener(type, handler);
  };

  /**
   * Add Event to the given element inner selector
   * @param {object} element jQuery element object
   * @param {string} selector selector string
   * @param {string} event string for event type (e.g: click, mouseover, ...)
   * @param {object} handler what run on event (e.g: function)
   */
  var on = (element, selector, event, handler) => {
    if (element === null) return;

    var eventId = HOLOLUtil.getUniqueID('event');

    window.Holol.UTIL.DelegatedEventHandlers[eventId] = function (e) {
      var targets = element.querySelectorAll(selector);
      var target = e.target;

      while (target && target !== element) {
        for (var i = 0, j = targets.length; i < j; i++)
          if (target === targets[i]) handler.call(target, e);

        target = target.parentNode;
      }
    };

    HOLOLUtil.addEvent(element, event, window.Holol.UTIL.DelegatedEventHandlers[eventId]);

    return eventId;
  };

  /**
   * Remove Event from the given element inner event ID
   * @param {object} element jQuery element object
   * @param {string} event string for event type (e.g: click, mouseover, ...)
   * @param {string} eventId
   */
  var off = (element, event, eventId) => {
    if (!element || !window.Holol.UTIL.DelegatedEventHandlers[eventId]) return;

    HOLOLUtil.removeEvent(element, event, window.Holol.UTIL.DelegatedEventHandlers[eventId]);

    delete window.Holol.UTIL.DelegatedEventHandlers[eventId];
  };

  /**
   * Exchange data to/from a web server.
   * When receiving data from a web server, the data is always a string.
   * Parse the data with parseJson(), and the data becomes a JavaScript object
   * @param {string} value (e.g: Web server data)
   * @returns {object} Data after parsing
   */
  var parseJson = (value) => {
    if (typeof value === 'string') {
      value = value.replace(/'/g, '"');

      var jsonStr = value.replace(/(\w+:)|(\w+ :)/g, function (matched) {
        return '"' + matched.substring(0, matched.length - 1) + '":';
      });

      try {
        value = JSON.parse(jsonStr);
      } catch (e) {}
    }

    return value;
  };

  /**
   * Get responsive value from array of values according to breakpoints
   * @param {object} value responsive values (e.g: {default: '100px', lg: '150px', sm: '100px'})
   * default for breakpoint 0
   * @returns {string}
   */
  var getResponsiveValue = (value) => {
    var width = this.getViewPort().width;
    var result;

    value = HOLOLUtil.parseJson(value);

    if (typeof value === 'object') {
      var resultKey;
      var resultBreakpoint = -1;
      var breakpoint;

      for (var key in value) {
        if (key === 'default') breakpoint = 0;
        else breakpoint = this.getBreakpoint(key) ? this.getBreakpoint(key) : parseInt(key);

        if (breakpoint <= width && breakpoint > resultBreakpoint) {
          resultKey = key;
          resultBreakpoint = breakpoint;
        }
      }

      if (resultKey) result = value[resultKey];
      else return;
    } else return;

    return result;
  };

  /**
   * Get index of element according to parentNode
   * @param {object} element jQuery element object
   * @returns {number}
   */
  var index = (element) => {
    if (!element) return;

    var c = element.parentNode.children,
      i = 0;
    for (; i < c.length; i++) if (c[i] == element) return i;
  };

  /**
   * Removes whitespace from both sides of a string.
   * @param {string} string String to trim
   * @returns {string}
   */
  var trim = (string) => {
    return string.trim();
  };

  /**
   * Convert string to legal DOM ID
   * @param {string} string String to convert
   * @param {string} validation (eg: h: for HTML, h5: for HTML5, base64: for base64 ) default: base64
   * @returns {string}
   */
  var stringToID = (string, validation) => {
    if (!string) return;

    var newString;

    // base64
    if (!validation || validation === 'base64') {
      string = btoa(string);
      // Check exist
      return document.getElementById(string) ? HOLOLUtil.getUniqueID(string + '_') : string;
    }

    // Remove white spaces from begin & end
    newString = HOLOLUtil.trim(string);

    // Replace inner white spaces to "_"
    newString = string.replace(/ /g, '_');

    // Remove illegal characters from DOM ID for HTML standards
    if (validation === 'h') {
      newString = newString.replace(/[^a-z0-9\-_:\.]|^[^a-z]+/gi, '');
      // Check exist
      return document.getElementById(newString)
        ? HOLOLUtil.getUniqueID(newString + '_')
        : newString;
    }

    // Remove illegal characters from DOM ID for HTML5 standards
    if (validation === 'h5') {
      newString = newString.replace(/\s+/g, '');
      // Check exist
      return document.getElementById(newString)
        ? HOLOLUtil.getUniqueID(newString + '_')
        : newString;
    }

    // base64 (default)
    string = btoa(string);
    // Check exist
    return document.getElementById(string) ? HOLOLUtil.getUniqueID(string + '_') : string;
  };

  /**
   * Removes element from DOM.
   * @param {object} element jQuery element object
   */
  var remove = (element) => {
    if (element && element.parentNode) element.parentNode.removeChild(element);
  };

  /**
   * Fid element inside parent DOM.
   * @param {object} parent jQuery element object
   * @param {string} query selector string
   * @returns {object}
   */
  var find = (parent, query) => {
    if (parent !== null) return parent.querySelector(query);
    else return null;
  };

  /**
   * Fid elements inside parent DOM.
   * @param {object} parent jQuery element object
   * @param {string} query selector string
   * @returns {object} Array of objects
   */
  var findAll = (parent, query) => {
    if (parent !== null) return parent.querySelectorAll(query);
    else return null;
  };

  /**
   * Insert element after referenceNode inside DOM.
   * @param {object} element jQuery element object
   * @param {object} referenceNode jQuery reference node object
   * @returns {object}
   */
  var insertAfter = (element, referenceNode) => {
    return referenceNode.parentNode.insertBefore(element, referenceNode.nextSibling);
  };

  /**
   * Insert element before referenceNode inside DOM.
   * @param {object} element jQuery element object
   * @param {object} referenceNode jQuery reference node object
   * @returns {object}
   */
  var insertBefore = (element, referenceNode) => {
    return referenceNode.parentNode.insertBefore(element, referenceNode);
  };

  /**
   * Insert element last on referenceNode DOM.
   * @param {object} element jQuery element object
   * @param {object} referenceNode jQuery reference node object
   * @returns {object}
   */
  var append = (element, referenceNode) => {
    return referenceNode.append(element);
  };

  /**
   * Insert element first on referenceNode DOM.
   * @param {object} element jQuery element object
   * @param {object} referenceNode jQuery reference node object
   * @returns {object}
   */
  var prepend = (element, referenceNode) => {
    return referenceNode.prepend(element);
  };

  /**
   * Get the offset width & height of element
   * @param {object} element jQuery element object
   * @returns {number}
   */
  var offset = (element) => {
    var rect, win;

    if (!element) return;

    // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
    // Support: IE <=11 only
    // Running getBoundingClientRect on a
    // disconnected node in IE throws an error
    if (!element.getClientRects().length) return { top: 0, left: 0 };

    // Get document-relative position by adding viewport scroll to viewport-relative gBCR
    rect = element.getBoundingClientRect();
    win = element.ownerDocument.defaultView;

    return {
      top: rect.top + win.pageYOffset,
      Bottom: element.offsetTop + element.offsetHeight,
      left: rect.left + win.pageXOffset,
      right: window.innerWidth - (element.offsetLeft + element.offsetWidth),
    };
  };

  /**
   * Get the outer width of element
   * @param {object} element jQuery element object
   * @param {boolean} withMargin (e.g: true: if has margin)
   * @returns {number}
   */
  var outerWidth = (element, withMargin) => {
    if (!element) return;

    var width = element.offsetWidth;
    var style;

    if (typeof withMargin !== 'undefined' && withMargin === true) {
      style = getComputedStyle(element);
      width += parseInt(style.marginLeft) + parseInt(style.marginRight);

      return width;
    } else return width;
  };

  /**
   * Get the outer height of element
   * @param {object} element jQuery element object
   * @param {boolean} withMargin (e.g: true: if has margin)
   * @returns {number}
   */
  var outerHeight = (element, withMargin) => {
    if (!element) return;

    var height = element.offsetHeight;
    var style;

    if (typeof withMargin !== 'undefined' && withMargin === true) {
      style = getComputedStyle(element);
      height += parseInt(style.marginTop) + parseInt(style.marginBottom);

      return height;
    } else return height;
  };

  /**
   * Get Document width
   * @returns {number}
   */
  var getDocumentWidth = () => {
    var body = document.body;
    var html = document.documentElement;

    return Math.max(
      body.scrollWidth,
      body.offsetWidth,
      html.clientWidth,
      html.scrollWidth,
      html.offsetWidth
    );
  };

  /**
   * Get Document height
   * @returns {number}
   */
  var getDocumentHeight = () => {
    var body = document.body;
    var html = document.documentElement;

    return Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
  };

  /**
   * Check if element is visible
   * @param {object} element jQuery element object
   * @returns {boolean}
   */
  var visible = (element) => {
    if (!element) return;

    return !(element.offsetWidth === 0 && element.offsetHeight === 0);
  };

  /**
   * Show element
   * @param {object} element jQuery element object
   * @param {string} display display type (e.g: block, inline, none ...)
   */
  var show = (element, display) => {
    if (typeof element !== 'undefined') element.style.display = display ? display : 'block';
  };

  /**
   * Hide element
   * @param {object} element jQuery element object
   */
  var hide = (el) => {
    if (typeof el !== 'undefined') el.style.display = 'none';
  };

  /**
   * Check if element is in viewport
   * @param {object} element jQuery element object
   * @returns {boolean}
   */
  var isInViewport = (element) => {
    if (!element) return;

    var rect = element.getBoundingClientRect();

    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  /**
   * Check if part of element is in viewport
   * @param {object} element jQuery element object
   * @returns {boolean}
   */
  var isPartInViewport = (element) => {
    if (!element) return;

    var rect = element.getBoundingClientRect();

    return (
      rect.bottom > 0 &&
      rect.right > 0 &&
      rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
      rect.left < (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  /**
   * Run callback on DOM content loaded
   * @param {function} callback (e.g: function)
   */
  var onDOMContentLoaded = (callback) => {
    if (typeof callback !== 'function') return;

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', callback);
    else callback();
  };

  /**
   * Check if loaded in Iframe
   * @returns {boolean}
   */
  var inIframe = () => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  };

  /**
   * Set / Get attribute
   * @param {object} element jQuery element object
   * @param {string} attribute attribute name
   * @param {string} value attribute value (remove if want to get attribute value)
   */
  var attr = (element, attribute, value) => {
    if (!element) return;

    if (value !== undefined && value !== null) element.setAttribute(attribute, value);
    else if (!attribute && attribute !== null) return;
    else if (element.getAttribute(attribute) == '') return true;
    else return element.getAttribute(attribute);
  };

  /**
   * Set multiple attributes
   * @param {object} element jQuery element object
   * @param {object} attributes Array of attributes (e.g: {name: value, name2: value2})
   */
  var attrs = (element, attributes) => {
    if (!element || !attributes) return;

    Object.keys(attributes).forEach((attr) => {
      HOLOLUtil.attr(element, attr, attributes[attr]);
    });
  };

  /**
   * Check if element has attribute
   * @param {object} element jQuery element object
   * @param {string} attributes attribute name (e.g: {name: value, name2: value2})
   * @returns {boolean}
   */
  var hasAttr = (element, attribute) => {
    if (!element || !attribute) return;

    return element.hasAttribute(attribute) ? true : false;
  };

  /**
   * Remove element with attribute
   * @param {object} element jQuery element object
   * @param {string} attribute attribute name
   * @returns {boolean}
   */
  var removeAttr = (element, attribute) => {
    if (!element || !attribute) return;

    element.removeAttribute(attribute);
  };

  /**
   * Get/Set inline style to element
   * @param {object} element jQuery element object
   * @param {string} styleProp style properties name
   * @param {string} value style properties value
   * Don't add if you want to get style
   * or add empty string to remove style property
   * @param {boolean} important Important status (true, false), add if required
   * @returns {string} In get case
   */
  var css = (element, styleProp, value, important) => {
    if (!element || !styleProp) return;

    if (value !== undefined)
      if (important === true) element.style.setProperty(styleProp, value, 'important');
      else element.style[styleProp] = value;
    else {
      var defaultView = (element.ownerDocument || document).defaultView;

      // W3C standard way:
      if (defaultView && defaultView.getComputedStyle) {
        // sanitize property name to css notation
        // (hyphen separated words eg. font-Size)
        styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase();

        return defaultView.getComputedStyle(element, null).getPropertyValue(styleProp);
      } else if (element.currentStyle) {
        // IE
        // sanitize property name to camelCase
        styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
          return letter.toUpperCase();
        });

        value = element.currentStyle[styleProp];

        // convert other units to pixels on IE
        if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
          return (function (value) {
            var oldLeft = element.style.left,
              oldRsLeft = element.runtimeStyle.left;

            element.runtimeStyle.left = element.currentStyle.left;
            element.style.left = value || 0;
            value = element.style.pixelLeft + 'px';
            element.style.left = oldLeft;
            element.runtimeStyle.left = oldRsLeft;

            return value;
          })(value);
        }

        return value;
      }
    }
  };

  /**
   * Get CSS Variable value
   * @param {string} variableName required variable name
   * @returns {string} variable value
   */
  var getCssVariableValue = (variableName) => {
    if (!variableName) return;

    var hex = getComputedStyle(document.documentElement).getPropertyValue(variableName);
    if (hex && hex.length > 0) hex = hex.trim();

    return hex;
  };

  /**
   * Get CSS height value
   * @param {object} element jQuery element object
   * @returns {string} variable value
   */
  var height = (element) => {
    if (!element) return;

    return HOLOLUtil.css(element, 'height');
  };

  /**
   * Get CSS width value
   * @param {object} element jQuery element object
   * @returns {string} variable value
   */
  var width = (element) => {
    if (!element) return;

    return HOLOLUtil.css(element, 'width');
  };

  /**
   * Get scrolled element value
   * @param {object} element jQuery element object
   * @param {string} method The passed in `method` value should be 'Top' or 'Left'
   * @returns {number}
   */
  var getScroll = (element, method) => {
    if (!element || !method || method !== 'Top' || method !== 'Left') return;

    method = 'scroll' + method;
    return element == window || element == document
      ? self[method == 'scrollTop' ? 'pageYOffset' : 'pageXOffset'] ||
          (browserSupportsBoxModel && document.documentElement[method]) ||
          document.body[method]
      : element[method];
  };

  /**
   * Scroll to element
   * @param {object} target jQuery element object
   * @param {number} offset Offset value (e.g: 100)
   * @param {number} duration Duration in milliseconds (e.g: 2000 - for 2 seconds)
   * @param {string | function} easing Optional: A string when the easing function is
   * available in TinyAnimate.easings, or a function with the signature: function(t, b, c, d) {...}
   */
  var scrollTo = (target, offset) => {
    if (typeof target === undefined) return;

    var targetPos = target ? HOLOLUtil.offset(target).top : 0;

    if (typeof offset === 'number') targetPos = targetPos - offset;

    window.scroll({
      top: targetPos,
      behavior: 'smooth',
    });
  };

  /**
   * Scroll to Top
   * @param {number} offset Offset value (e.g: 100)
   * @param {number} duration Duration in milliseconds (e.g: 2000 - for 2 seconds)
   */
  var scrollTop = (offset) => {
    offset = typeof offset === 'number' ? offset * -1 : 0;

    HOLOLUtil.scrollTo(null, offset);
  };

  /**
   * Get document scroll top
   * @returns {number}
   */
  var getScrollTop = () => {
    return (document.scrollingElement || document.documentElement).scrollTop;
  };

  /**
   * Get site direction
   * @returns {string}
   */
  var getDir = () => {
    if (HOLOLUtil.attr(document.querySelector('html'), 'dir'))
      return HOLOLUtil.attr(document.querySelector('html'), 'dir');
    return 'ltr';
  };

  /**
   * Check if Site is RTL (Right to Left view)
   * @returns {boolean}
   */
  var isRTL = () => {
    return HOLOLUtil.getDir() === 'rtl' ? true : false;
  };

  /**
   * Set / Remove inner element HTML
   * @param {object} element jQuery element object
   * @param {object, string} html leave empty or don't enter to remove element content
   */
  var setHTML = (element, html) => {
    if (!element) return;

    html = html ? html : '';
    element.innerHTML = html;
  };

  /**
   * Get inner element HTML
   * @param {object} element jQuery element object
   * @returns {string}
   */
  var getHTML = (element) => {
    if (element) return element.innerHTML;
  };

  /**
   * Set / Remove inner element Text
   * @param {object} element jQuery element object
   * @param {string} text leave empty or don't enter to remove element text
   */
  var setTEXT = (element, text) => {
    if (!element) return;

    text = text ? text : '';
    element.innerText = text;
  };

  /**
   * Set inner element Text
   * @param {object} element jQuery element object
   * @returns {string}
   */
  var getTEXT = (element) => {
    if (element) return element.innerText;
  };

  /**
   * Loop multi elements
   * @param {object} array Array of objects
   * @param {function} callback Function call
   */
  var each = (array, callback) => {
    return [].slice.call(array).map(callback);
  };

  /**
   * Set app color mode
   * @param {string} mode The passed in `mode` value must be 'light' or 'dark'
   */
  var setColorMode = (mode) => {
    if (['light', 'dark'].includes(mode))
      HOLOLUtil.attr(document.querySelector('html'), 'data-color-mode', mode);
  };

  /**
   * Get app color mode
   * @returns {string}
   */
  var getColorMode = () => {
    return HOLOLUtil.attr(document.querySelector('html'), 'data-color-mode');
  };

  /**
   * Set app theme
   * @param {string} theme The passed in `mode` value must be
   *     'regular' or 'high_contrast' or 'colorblind'
   */
  var setTheme = (theme) => {
    if (['regular', 'high_contrast', 'colorblind'].includes(theme))
      HOLOLUtil.attr(document.querySelector('html'), 'data-theme', theme);
  };

  /**
   * Get app theme
   * @returns {string}
   */
  var getTheme = () => {
    return HOLOLUtil.attr(document.querySelector('html'), 'data-theme');
  };

  /**
   * Get Site language
   * @returns {string}
   */
  var getSiteLanguage = () => {
    if (HOLOLUtil.attr(document.querySelector('html'), 'lang'))
      return HOLOLUtil.attr(document.querySelector('html'), 'lang');
    return 'en';
  };

  /**
   * Get browser
   * @returns {object}
   */
  var getBrowser = () => {
    const data = {
      header: [
        navigator.platform,
        navigator.userAgent,
        navigator.appVersion,
        navigator.vendor,
        window.opera,
      ],
      browser: [
        { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
        { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
        { name: 'Safari', value: 'Safari', version: 'Version' },
        { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
        { name: 'Opera', value: 'Opera', version: 'Opera' },
        { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
        { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' },
      ],
    };

    var matchItem = function (string, data) {
      var i = 0,
        j = 0,
        html = '',
        regex,
        regexv,
        match,
        matches,
        version;

      for (i = 0; i < data.length; i += 1) {
        regex = new RegExp(data[i].value, 'i');
        match = regex.test(string);
        if (match) {
          regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
          matches = string.match(regexv);
          version = '';
          if (matches) {
            if (matches[1]) {
              matches = matches[1];
            }
          }
          if (matches) {
            matches = matches.split(/[._]+/);
            for (j = 0; j < matches.length; j += 1) {
              if (j === 0) {
                version += matches[j] + '.';
              } else {
                version += matches[j];
              }
            }
          } else {
            version = '0';
          }
          return {
            name: data[i].name,
            version: parseFloat(version),
          };
        }
      }
      return { name: 'unknown', version: 0 };
    };

    var agent = data.header.join(' '),
      browser = matchItem(agent, data.browser);

    return {
      name: browser.name,
      version: browser.version,
      language:
        (
          window.navigator.userLanguage ||
          window.navigator.language ||
          window.navigator.browserLanguage ||
          window.navigator.systemLanguage
        ).slice(0, 2) || '',
    };
  };

  /**
   * Get OS
   * @returns {object}
   */
  var getOS = () => {
    const data = {
      header: [
        navigator.platform,
        navigator.userAgent,
        navigator.appVersion,
        navigator.vendor,
        window.opera,
      ],
      os: [
        { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
        { name: 'Windows', value: 'Win', version: 'NT' },
        { name: 'iPhone', value: 'iPhone', version: 'OS' },
        { name: 'iPad', value: 'iPad', version: 'OS' },
        { name: 'Kindle', value: 'Silk', version: 'Silk' },
        { name: 'Android', value: 'Android', version: 'Android' },
        { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
        { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
        { name: 'Macintosh', value: 'Mac', version: 'OS X' },
        { name: 'Linux', value: 'Linux', version: 'rv' },
        { name: 'Palm', value: 'Palm', version: 'PalmOS' },
      ],
    };

    var matchItem = function (string, data) {
      var i = 0,
        j = 0,
        html = '',
        regex,
        regexv,
        match,
        matches,
        version;

      for (i = 0; i < data.length; i += 1) {
        regex = new RegExp(data[i].value, 'i');
        match = regex.test(string);
        if (match) {
          regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
          matches = string.match(regexv);
          version = '';
          if (matches) {
            if (matches[1]) {
              matches = matches[1];
            }
          }
          if (matches) {
            matches = matches.split(/[._]+/);
            for (j = 0; j < matches.length; j += 1) {
              if (j === 0) {
                version += matches[j] + '.';
              } else {
                version += matches[j];
              }
            }
          } else {
            version = '0';
          }
          return {
            name: data[i].name,
            version: parseFloat(version),
          };
        }
      }
      return { name: 'unknown', version: 0 };
    };

    var agent = data.header.join(' '),
      os = matchItem(agent, data.os);

    return {
      name: os.name,
      version: os.version,
    };
  };

  /**
   * Get Mutation Observer
   * @param {object} element jQuery element object
   * @param {object} options Array of options
   * @param {function} callback Function call
   */
  var mutationObserver = (element, options, callback) => {
    const mutationObserver = new MutationObserver(function (mutationsList, observer) {
      callback();
    });
    mutationObserver.observe(element, options);
  };

  var HOLOLUtil = function () {
    //
    // Variables
    //

    var HOLOLUtil = {}; // Object for public APIs

    //
    // Methods
    //

    HOLOLUtil.getURLParam = (paramName) => {
      return getURLParam(paramName);
    };
    HOLOLUtil.isMobileDevice = () => {
      return isMobileDevice();
    };
    HOLOLUtil.isDesktopDevice = () => {
      return isDesktopDevice();
    };
    HOLOLUtil.isTouchDevice = () => {
      return isTouchDevice();
    };
    HOLOLUtil.getViewPort = () => {
      return getViewPort();
    };
    HOLOLUtil.getViewportWidth = () => {
      return getViewportWidth();
    };
    HOLOLUtil.getViewportHeight = () => {
      return getViewportHeight();
    };
    HOLOLUtil.getBreakpoint = (breakpoint) => {
      return getBreakpoint(breakpoint);
    };
    HOLOLUtil.isBreakpointUp = (breakpoint) => {
      return isBreakpointUp(breakpoint);
    };
    HOLOLUtil.isBreakpointDown = (breakpoint) => {
      return isBreakpointDown(breakpoint);
    };
    HOLOLUtil.getUniqueID = (prefix, suffix) => {
      return getUniqueID(prefix, suffix);
    };
    HOLOLUtil.isSet = (obj, keys) => {
      return isSet(obj, keys);
    };
    HOLOLUtil.getHighestZindex = (el) => {
      return getHighestZindex(el);
    };
    HOLOLUtil.hasFixedPositionedParent = (el) => {
      return hasFixedPositionedParent(el);
    };
    HOLOLUtil.sleep = (milliseconds) => {
      return sleep(milliseconds);
    };
    HOLOLUtil.throttle = (timer, func, delay) => {
      return throttle(timer, func, delay);
    };
    HOLOLUtil.debounce = (timer, func, delay) => {
      return debounce(timer, func, delay);
    };
    HOLOLUtil.getBodyTag = () => {
      return getBodyTag();
    };
    HOLOLUtil.getHTMLTag = () => {
      return getHTMLTag();
    };
    HOLOLUtil.getRandomInt = (min, max) => {
      return getRandomInt(min, max);
    };
    HOLOLUtil.hasClass = (element, className) => {
      return hasClass(element, className);
    };
    HOLOLUtil.addClass = (element, className) => {
      return addClass(element, className);
    };
    HOLOLUtil.removeClass = (element, className) => {
      return removeClass(element, className);
    };
    HOLOLUtil.toggleClass = (element, className) => {
      return toggleClass(element, className);
    };
    HOLOLUtil.addEvent = (element, type, handler) => {
      return addEvent(element, type, handler);
    };
    HOLOLUtil.removeEvent = (element, type, handler) => {
      return removeEvent(element, type, handler);
    };
    HOLOLUtil.on = (element, selector, event, handler) => {
      return on(element, selector, event, handler);
    };
    HOLOLUtil.off = (element, event, eventId) => {
      return off(element, event, eventId);
    };
    HOLOLUtil.parseJson = (value) => {
      return parseJson(value);
    };
    HOLOLUtil.getResponsiveValue = (value) => {
      return getResponsiveValue(value);
    };
    HOLOLUtil.index = (element) => {
      return index(element);
    };
    HOLOLUtil.trim = (string) => {
      return trim(string);
    };
    HOLOLUtil.stringToID = (string, validation) => {
      return stringToID(string, validation);
    };
    HOLOLUtil.remove = (element) => {
      return remove(element);
    };
    HOLOLUtil.find = (parent, query) => {
      return find(parent, query);
    };
    HOLOLUtil.findAll = (parent, query) => {
      return findAll(parent, query);
    };
    HOLOLUtil.insertAfter = (element, referenceNode) => {
      return insertAfter(element, referenceNode);
    };
    HOLOLUtil.insertBefore = (element, referenceNode) => {
      return insertBefore(element, referenceNode);
    };
    HOLOLUtil.append = (element, referenceNode) => {
      return append(element, referenceNode);
    };
    HOLOLUtil.prepend = (element, referenceNode) => {
      return prepend(element, referenceNode);
    };
    HOLOLUtil.offset = (element) => {
      return offset(element);
    };
    HOLOLUtil.outerWidth = (element, withMargin) => {
      return outerWidth(element, withMargin);
    };
    HOLOLUtil.outerHeight = (element, withMargin) => {
      return outerHeight(element, withMargin);
    };
    HOLOLUtil.getDocumentWidth = () => {
      return getDocumentWidth();
    };
    HOLOLUtil.getDocumentHeight = () => {
      return getDocumentHeight();
    };
    HOLOLUtil.visible = (element) => {
      return visible(element);
    };
    HOLOLUtil.show = (element, display) => {
      return show(element, display);
    };
    HOLOLUtil.hide = (el) => {};
    HOLOLUtil.isInViewport = (element) => {
      return hide(el);
    };
    HOLOLUtil.isPartInViewport = (element) => {
      return isPartInViewport(element);
    };
    HOLOLUtil.onDOMContentLoaded = (callback) => {
      return onDOMContentLoaded(callback);
    };
    HOLOLUtil.inIframe = () => {
      return inIframe();
    };
    HOLOLUtil.attr = (element, attribute, value) => {
      return attr(element, attribute, value);
    };
    HOLOLUtil.attrs = (element, attributes) => {
      return attrs(element, attributes);
    };
    HOLOLUtil.hasAttr = (element, attribute) => {
      return hasAttr(element, attribute);
    };
    HOLOLUtil.removeAttr = (element, attribute) => {
      return removeAttr(element, attribute);
    };
    HOLOLUtil.css = (element, styleProp, value, important) => {
      return css(element, styleProp, value, important);
    };
    HOLOLUtil.getCssVariableValue = (variableName) => {
      return getCssVariableValue(variableName);
    };
    HOLOLUtil.height = (element) => {
      return height(element);
    };
    HOLOLUtil.width = (element) => {
      return width(element);
    };
    HOLOLUtil.getScroll = (element, method) => {
      return getScroll(element, method);
    };
    HOLOLUtil.scrollTo = (target, offset) => {
      return scrollTo(target, offset);
    };
    HOLOLUtil.scrollTop = (offset) => {
      return scrollTop(offset);
    };
    HOLOLUtil.getScrollTop = () => {
      return getScrollTop();
    };
    HOLOLUtil.getDir = () => {
      return getDir();
    };
    HOLOLUtil.isRTL = () => {
      return isRTL();
    };
    HOLOLUtil.setHTML = (element, html) => {
      return setHTML(element, html);
    };
    HOLOLUtil.getHTML = (element) => {
      return getHTML(element);
    };
    HOLOLUtil.setTEXT = (element, text) => {
      return setTEXT(element, text);
    };
    HOLOLUtil.getTEXT = (element) => {
      return getTEXT(element);
    };
    HOLOLUtil.each = (array, callback) => {
      return each(array, callback);
    };
    HOLOLUtil.setColorMode = (mode) => {
      return setColorMode(mode);
    };
    HOLOLUtil.getColorMode = () => {
      return getColorMode();
    };
    HOLOLUtil.setTheme = (theme) => {
      return setTheme(theme);
    };
    HOLOLUtil.getTheme = () => {
      return getTheme();
    };
    HOLOLUtil.getSiteLanguage = () => {
      return getSiteLanguage();
    };
    HOLOLUtil.getBrowser = () => {
      return getBrowser();
    };
    /**
     * Get OS
     * @returns {object}
     */
    HOLOLUtil.getOS = () => {
      return getOS();
    };
    HOLOLUtil.mutationObserver = (element, options, callback) => {
      return mutationObserver(element, options, callback);
    };

    /**
     * Initialize HOLOLUtil
     */
    var init = function () {
      // feature test
      if (!supports())
        throw 'HOLOLUtil: This browser does not support the required JavaScript methods and browser APIs.';
    };

    //
    // Initialize plugin
    //

    init();

    //
    // Public APIs
    //

    return HOLOLUtil;
  };

  return HOLOLUtil;
});
