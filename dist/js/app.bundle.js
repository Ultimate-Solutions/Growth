'use strict';

// Global variables
window.Holol = {
  INFO: {
    PROVIDER: 'Ultimate Solutions Egypt',
    PROVIDER_INFO: 'International leader in Enterprise Resource Solutions and Software Development',
    PROVIDER_LINK: 'https://ultimate-eg.net',
    PROJECT: 'HOLOL - Smart shopping platform',
    PROJECT_INFO:
      'Without technical experience and with ease, you can sell anywhere and anytime with your online store and with your commercial identity',
    VERSION: 'beta',
  },
  LOCAL: {
    BROWSER: {
      LANGUAGE: '',
    },
  },
  UTIL: {
    DelegatedEventHandlers: {},
  },
};

var HOLOLUtil = (function () {
  return {
    /**
     * Get parameter value from URL.
     * @param {string} paramName Parameter name.
     * @returns {string}
     */
    getURLParam: function (paramName) {
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
    },

    /**
     * Checks whether current device is mobile touch.
     * @returns {boolean}
     */
    isMobileDevice: function () {
      var test = this.getViewPort().width < this.getBreakpoint('lg') ? true : false;

      if (test === false) {
        // For use within normal web clients
        test = navigator.userAgent.match(/iPad/i) != null;
      }

      return test;
    },

    /**
     * Checks whether current device is desktop.
     * @returns {boolean}
     */
    isDesktopDevice: function () {
      return HOLOLUtil.isMobileDevice() ? false : true;
    },

    /**
     * Gets browser window viewport size. Ref:
     * http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
     * @returns {object}
     */
    getViewPort: function () {
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
    },

    /**
     * Gets browser window viewport width.
     * @returns {number}
     */
    getViewportWidth: function () {
      return this.getViewPort().width;
    },

    /**
     * Gets browser window viewport height.
     * @returns {number}
     */
    getViewportHeight: function () {
      return this.getViewPort().height;
    },

    /**
     * Gets window width for give breakpoint mode.
     * @param {string} mode Responsive mode name (e.g: xl, lg, md, sm, xs) or
     * (e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
     * @returns {number}
     */
    getBreakpoint: function (breakpoint) {
      var value = this.getCssVariableValue('--breakpoint-' + breakpoint);

      if (value) {
        value = parseInt(value.trim());
      }

      return value;
    },

    /**
     * Checks whether given device mode is currently activated.
     * @param {string} mode Responsive mode name (e.g: xl, lg, md, sm, xs) or
     * (e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
     * @returns {boolean}
     */
    isBreakpointUp: function (mode) {
      var width = this.getViewPort().width;
      var breakpoint = this.getBreakpoint(mode);

      return width >= breakpoint;
    },

    /**
     * Checks whether given device mode is currently deactivated.
     * @param {string} mode Responsive mode name (e.g: xl, lg, md, sm, xs) or
     * (e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
     * @returns {boolean}
     */
    isBreakpointDown: function (mode) {
      var width = this.getViewPort().width;
      var breakpoint = this.getBreakpoint(mode);

      return width < breakpoint;
    },

    /**
     * Generates unique ID for give prefix.
     * @param {string} prefix Prefix for generated ID
     * @param {string} suffix suffix for generated ID
     * @returns {boolean}
     */
    getUniqueId: function (prefix, suffix) {
      if (!suffix) suffix = '';
      if (!prefix) prefix = '';
      return prefix + Math.floor(Math.random() * new Date().getTime()) + suffix;
    },

    /**
     * Checks whether object has property matches given key path.
     * @param {object} obj Object contains values paired with given key path
     * @param {string} keys Keys path separated with dots
     * @returns {boolean}
     */
    isSet: function (obj, keys) {
      var stone;

      keys = keys || '';

      if (keys.indexOf('[') !== -1) {
        throw new Error('Unsupported object path notation.');
      }

      keys = keys.split('.');

      do {
        if (obj === undefined) {
          return false;
        }

        stone = keys.shift();

        if (!obj.hasOwnProperty(stone)) {
          return false;
        }

        obj = obj[stone];
      } while (keys.length);

      return true;
    },

    /**
     * Gets highest z-index of the given element parents
     * @param {object} el jQuery element object
     * @returns {number}
     */
    getHighestZindex: function (el) {
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

          if (!isNaN(value) && value !== 0) {
            return value;
          }
        }

        el = el.parentNode;
      }

      return 1;
    },

    /**
     * Checks whether the element has any parent with fixed position
     * @param {object} el jQuery element object
     * @returns {boolean}
     */
    hasFixedPositionedParent: function (el) {
      var position;

      while (el && el !== document) {
        position = HOLOLUtil.css(el, 'position');

        if (position === 'fixed') {
          return true;
        }

        el = el.parentNode;
      }

      return false;
    },

    /**
     * Simulates delay
     * @param {number} milliseconds Time in milliseconds
     */
    sleep: function (milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },

    /**
     * Get Body object
     * @returns {object}
     */
    getBodyTag: function () {
      return document.getElementsByTagName('body')[0];
    },

    /**
     * Get HTML object
     * @returns {object}
     */
    getHTMLTag: function () {
      return document.getElementsByTagName('html')[0];
    },

    /**
     * Gets randomly generated integer value within given min and max range
     * @param {number} min Range start value
     * @param {number} max Range end value
     * @returns {number}
     */
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    /**
     * Checks whether the element has given classes
     * @param {object} el jQuery element object
     * @param {string} className string with spaces between every class name for multi classes
     * @returns {boolean}
     */
    hasClass: function (el, className) {
      if (!el) {
        return;
      }

      var classesArr = className.split(' ');

      for (var i = 0; i < classesArr.length; i++) {
        let classNew = HOLOLUtil.trim(classesArr[i]),
          hasClass = el.classList
            ? el.classList.contains(classNew)
            : new RegExp('\\b' + classNew + '\\b').test(el.classNew);
        if (!hasClass) {
          return false;
        }
      }

      return true;
    },

    /**
     * Add class to the given element
     * @param {object} el jQuery element object
     * @param {string} className string with spaces between every class name to add multi classes
     */
    addClass: function (el, className) {
      if (!el || typeof className === 'undefined') {
        return;
      }

      var classNames = className.split(' ');

      if (el.classList) {
        for (var i = 0; i < classNames.length; i++) {
          if (classNames[i] && classNames[i].length > 0) {
            el.classList.add(HOLOLUtil.trim(classNames[i]));
          }
        }
      } else if (!HOLOLUtil.hasClass(el, className)) {
        for (var x = 0; x < classNames.length; x++) {
          el.className += ' ' + HOLOLUtil.trim(classNames[x]);
        }
      }
    },

    /**
     * Remove class from the given element
     * @param {object} el jQuery element object
     * @param {string} className string with spaces between every class name to remove multi classes
     */
    removeClass: function (el, className) {
      if (!el || typeof className === 'undefined') {
        return;
      }

      var classNames = className.split(' ');

      if (el.classList) {
        for (var i = 0; i < classNames.length; i++) {
          el.classList.remove(HOLOLUtil.trim(classNames[i]));
        }
      } else if (HOLOLUtil.hasClass(el, className)) {
        for (var x = 0; x < classNames.length; x++) {
          el.className = el.className.replace(
            new RegExp('\\b' + HOLOLUtil.trim(classNames[x]) + '\\b', 'g'),
            ''
          );
        }
      }
    },

    /**
     * Toggle class off the given element
     * @param {object} el jQuery element object
     * @param {string} className string with spaces between every class name to add multi classes
     */
    toggleClass: function (el, className) {
      if (!el || typeof className === 'undefined') {
        return;
      }

      var classNames = className.split(' ');

      if (el.classList) {
        for (var i = 0; i < classNames.length; i++) {
          if (classNames[i] && classNames[i].length > 0) {
            el.classList.toggle(HOLOLUtil.trim(classNames[i]));
          }
        }
      } else if (!HOLOLUtil.hasClass(el, className)) {
        for (var x = 0; x < classNames.length; x++) {
          el.className += ' ' + HOLOLUtil.trim(classNames[x]);
        }
      }
    },

    /**
     * Add Event to the given element
     * @param {object} el jQuery element object
     * @param {string} type string for event type (e.g: click, mouseover, ...)
     * @param {object} handler what run on event (e.g: function)
     */
    addEvent: function (el, type, handler) {
      if (typeof el !== 'undefined' && el !== null) {
        el.addEventListener(type, handler);
      }
    },

    /**
     * Remove Event from the given element
     * @param {object} el jQuery element object
     * @param {string} type string for event type (e.g: click, mouseover, ...)
     * @param {object} handler what run on event (e.g: function)
     */
    removeEvent: function (el, type, handler) {
      if (el !== null) {
        el.removeEventListener(type, handler);
      }
    },

    /**
     * Add Event to the given element inner selector
     * @param {object} element jQuery element object
     * @param {string} selector selector string
     * @param {string} event string for event type (e.g: click, mouseover, ...)
     * @param {object} handler what run on event (e.g: function)
     */
    on: function (element, selector, event, handler) {
      if (element === null) {
        return;
      }

      var eventId = HOLOLUtil.getUniqueId('event');

      window.Holol.UTIL.DelegatedEventHandlers[eventId] = function (e) {
        var targets = element.querySelectorAll(selector);
        var target = e.target;

        while (target && target !== element) {
          for (var i = 0, j = targets.length; i < j; i++) {
            if (target === targets[i]) {
              handler.call(target, e);
            }
          }

          target = target.parentNode;
        }
      };

      HOLOLUtil.addEvent(element, event, window.Holol.UTIL.DelegatedEventHandlers[eventId]);

      return eventId;
    },

    /**
     * Remove Event from the given element inner event ID
     * @param {object} element jQuery element object
     * @param {string} event string for event type (e.g: click, mouseover, ...)
     * @param {string} eventId
     */
    off: function (element, event, eventId) {
      if (!element || !window.Holol.UTIL.DelegatedEventHandlers[eventId]) {
        return;
      }

      HOLOLUtil.removeEvent(element, event, window.Holol.UTIL.DelegatedEventHandlers[eventId]);

      delete window.Holol.UTIL.DelegatedEventHandlers[eventId];
    },

    /**
     * Throttle function
     * @param {object} func function which needs to be throttled
     * @param {number} delay time interval in milliseconds
     */
    throttle: function (timer, func, delay) {
      // If setTimeout is already scheduled, no need to do anything
      if (timer) {
        return;
      }

      // Schedule a setTimeout after delay seconds
      timer = setTimeout(function () {
        func();

        // Once setTimeout function execution is finished, timerId = undefined so that in <br>
        // the next scroll event function execution can be scheduled by the setTimeout
        timer = undefined;
      }, delay);
    },

    /**
     * Debounce function
     * @param {object} func function which needs to be debounced
     * @param {number} delay debounced time in milliseconds
     */
    debounce: function (timer, func, delay) {
      // Cancels the setTimeout method execution
      clearTimeout(timer);

      // Executes the func after delay time.
      timer = setTimeout(func, delay);
    },

    /**
     * Exchange data to/from a web server.
     * When receiving data from a web server, the data is always a string.
     * Parse the data with parseJson(), and the data becomes a JavaScript object
     * @param {string} value (e.g: Web server data)
     * @returns {object} Data after parsing
     */
    parseJson: function (value) {
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
    },

    /**
     * Get responsive value from array of values according to breakpoints
     * @param {object} value responsive values (e.g: {lg: '150px', sm: '100px'})
     * @returns {string}
     */
    getResponsiveValue: function (value) {
      var width = this.getViewPort().width;
      var result;

      value = HOLOLUtil.parseJson(value);

      if (typeof value === 'object') {
        var resultKey;
        var resultBreakpoint = -1;
        var breakpoint;

        for (var key in value) {
          if (key === 'default') {
            breakpoint = 0;
          } else {
            breakpoint = this.getBreakpoint(key) ? this.getBreakpoint(key) : parseInt(key);
          }

          if (breakpoint <= width && breakpoint > resultBreakpoint) {
            resultKey = key;
            resultBreakpoint = breakpoint;
          }
        }

        if (resultKey) {
          result = value[resultKey];
        } else {
          result = value;
        }
      } else {
        result = value;
      }

      return result;
    },

    /**
     * Get index of element according to parentNode
     * @param {object} element jQuery element object
     * @returns {number}
     */
    index: function (element) {
      var c = element.parentNode.children,
        i = 0;
      for (; i < c.length; i++) if (c[i] == element) return i;
    },

    /**
     * Removes whitespace from both sides of a string.
     * @param {string} string String to trim
     * @returns {string}
     */
    trim: function (string) {
      return string.trim();
    },

    /**
     * Removes element from DOM.
     * @param {object} element jQuery element object
     */
    remove: function (el) {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    },

    /**
     * Fid element inside parent DOM.
     * @param {object} parent jQuery element object
     * @param {string} query selector string
     * @returns {object}
     */
    find: function (parent, query) {
      if (parent !== null) {
        return parent.querySelector(query);
      } else {
        return null;
      }
    },

    /**
     * Fid elements inside parent DOM.
     * @param {object} parent jQuery element object
     * @param {string} query selector string
     * @returns {object} Array of objects
     */
    findAll: function (parent, query) {
      if (parent !== null) {
        return parent.querySelectorAll(query);
      } else {
        return null;
      }
    },

    /**
     * Insert element after referenceNode inside DOM.
     * @param {object} element jQuery element object
     * @param {object} referenceNode jQuery reference node object
     * @returns {object}
     */
    insertAfter: function (element, referenceNode) {
      return referenceNode.parentNode.insertBefore(element, referenceNode.nextSibling);
    },

    /**
     * Insert element before referenceNode inside DOM.
     * @param {object} element jQuery element object
     * @param {object} referenceNode jQuery reference node object
     * @returns {object}
     */
    insertBefore: function (element, referenceNode) {
      return referenceNode.parentNode.insertBefore(element, referenceNode);
    },

    /**
     * Insert element last on referenceNode DOM.
     * @param {object} element jQuery element object
     * @param {object} referenceNode jQuery reference node object
     * @returns {object}
     */
    append: function (element, referenceNode) {
      return referenceNode.append(element);
    },

    /**
     * Insert element first on referenceNode DOM.
     * @param {object} element jQuery element object
     * @param {object} referenceNode jQuery reference node object
     * @returns {object}
     */
    prepend: function (element, referenceNode) {
      return referenceNode.prepend(element);
    },

    /**
     * Get the offset width & height of element
     * @param {object} element jQuery element object
     * @returns {number}
     */
    offset: function (element) {
      var rect, win;

      if (!element) {
        return;
      }

      // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
      // Support: IE <=11 only
      // Running getBoundingClientRect on a
      // disconnected node in IE throws an error
      if (!element.getClientRects().length) {
        return { top: 0, left: 0 };
      }

      // Get document-relative position by adding viewport scroll to viewport-relative gBCR
      rect = element.getBoundingClientRect();
      win = element.ownerDocument.defaultView;

      return {
        top: rect.top + win.pageYOffset,
        Bottom: element.offsetTop + element.offsetHeight,
        left: rect.left + win.pageXOffset,
        right: window.innerWidth - (element.offsetLeft + element.offsetWidth),
      };
    },

    /**
     * Get the outer width of element
     * @param {object} element jQuery element object
     * @param {boolean} withMargin (e.g: true: if has margin)
     * @returns {number}
     */
    outerWidth: function (el, withMargin) {
      var width = el.offsetWidth;
      var style;

      if (typeof withMargin !== 'undefined' && withMargin === true) {
        style = getComputedStyle(el);
        width += parseInt(style.marginLeft) + parseInt(style.marginRight);

        return width;
      } else {
        return width;
      }
    },

    /**
     * Get the outer height of element
     * @param {object} element jQuery element object
     * @param {boolean} withMargin (e.g: true: if has margin)
     * @returns {number}
     */
    outerHeight: function (el, withMargin) {
      var height = el.offsetHeight;
      var style;

      if (typeof withMargin !== 'undefined' && withMargin === true) {
        style = getComputedStyle(el);
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);

        return height;
      } else {
        return height;
      }
    },

    /**
     * Get Document width
     * @returns {number}
     */
    getDocumentWidth: function () {
      var body = document.body;
      var html = document.documentElement;

      return Math.max(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
      );
    },

    /**
     * Get Document height
     * @returns {number}
     */
    getDocumentHeight: function () {
      var body = document.body;
      var html = document.documentElement;

      return Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
    },

    /**
     * Check if element is visible
     * @param {object} element jQuery element object
     * @returns {boolean}
     */
    visible: function (el) {
      return !(el.offsetWidth === 0 && el.offsetHeight === 0);
    },

    /**
     * Show element
     * @param {object} element jQuery element object
     */
    show: function (el, display) {
      if (typeof el !== 'undefined') {
        el.style.display = display ? display : 'block';
      }
    },

    /**
     * Hide element
     * @param {object} element jQuery element object
     */
    hide: function (el) {
      if (typeof el !== 'undefined') {
        el.style.display = 'none';
      }
    },

    /**
     * Check if element is in viewport
     * @param {object} element jQuery element object
     * @returns {boolean}
     */
    isInViewport: function (element) {
      var rect = element.getBoundingClientRect();

      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    /**
     * Check if part of element is in viewport
     * @param {object} element jQuery element object
     * @returns {boolean}
     */
    isPartInViewport: function (element) {
      var rect = element.getBoundingClientRect();

      return (
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    /**
     * Run callback on DOM content loaded
     * @param {object} callback (e.g: function)
     */
    onDOMContentLoaded: function (callback) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
      } else {
        callback();
      }
    },

    /**
     * Check if loaded in Iframe
     * @param {object} callback (e.g: function)
     * @returns {boolean}
     */
    inIframe: function () {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    },

    /**
     * Set / Get attribute
     * @param {object} element jQuery element object
     * @param {string} name attribute name
     * @param {string} value attribute value (remove if want to get attribute value)
     */
    attr: function (element, name, value) {
      if (element == undefined) {
        return;
      }

      if (value !== undefined) {
        element.setAttribute(name, value);
      } else {
        return element.getAttribute(name);
      }
    },

    /**
     * Set multiple attributes
     * @param {object} element jQuery element object
     * @param {object} attributes Array of attributes (e.g: {name: value, name2: value2})
     */
    attrs: function (element, attributes) {
      if (element == undefined || attributes == undefined) {
        return;
      }

      Object.keys(attributes).forEach((attr) => {
        HOLOLUtil.attr(element, attr, attributes[attr]);
      });
    },

    /**
     * Check if element has attribute
     * @param {object} element jQuery element object
     * @param {string} attributes attribute name (e.g: {name: value, name2: value2})
     * @returns {boolean}
     */
    hasAttr: function (element, attribute) {
      if (element == undefined) {
        return;
      }

      return element.hasAttribute(attribute) ? true : false;
    },

    /**
     * Remove element has attribute
     * @param {object} element jQuery element object
     * @returns {boolean}
     */
    removeAttr: function (element, name) {
      if (element == undefined) {
        return;
      }

      element.removeAttribute(name);
    },

    /**
     * Get/Set inline style to element
     * @param {object} element jQuery element object
     * @param {string} styleProp style properties name
     * @param {string} value style properties value
     * Don't add if you want to get style
     * or add empty string to remove style property
     * @param {boolean} important Important status (true, false)
     * Add @important if required
     * @returns {string} In get case
     */
    css: function (element, styleProp, value, important) {
      if (!element) {
        return;
      }

      if (value !== undefined) {
        if (important === true) element.style.setProperty(styleProp, value, 'important');
        else element.style[styleProp] = value;
      } else {
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
    },

    /**
     * Get CSS Variable value
     * @param {string} variableName required variable name
     * @returns {string} variable value
     */
    getCssVariableValue: function (variableName) {
      var hex = getComputedStyle(document.documentElement).getPropertyValue(variableName);
      if (hex && hex.length > 0) {
        hex = hex.trim();
      }

      return hex;
    },

    /**
     * Get CSS height value
     * @param {object} element jQuery element object
     * @returns {string} variable value
     */
    height: function (element) {
      return HOLOLUtil.css(element, 'height');
    },

    /**
     * Get CSS width value
     * @param {object} element jQuery element object
     * @returns {string} variable value
     */
    width: function (element) {
      return HOLOLUtil.css(element, 'width');
    },

    /**
     * Animate value from-to (e.g: scroll , width, height, padding, ...)
     * @param {number} from Start position
     * @param {number} to End position
     * @param {number} duration Duration in milliseconds (e.g: 2000 - for 2 seconds)
     * @param {object} update Run on duration (function)
     * @param {object} easing
     * @param {object} done
     */
    animate: function (from, to, duration, update, easing, done) {
      /**
       * TinyAnimate.easings
       *  Adapted from jQuery Easing
       */
      var easings = {};
      var easing;

      easings.linear = function (t, b, c, d) {
        return (c * t) / d + b;
      };

      easing = easings.linear;

      // Early bail out if called incorrectly
      if (
        typeof from !== 'number' ||
        typeof to !== 'number' ||
        typeof duration !== 'number' ||
        typeof update !== 'function'
      ) {
        return;
      }

      // Create mock done() function if necessary
      if (typeof done !== 'function') {
        done = function () {};
      }

      // Pick implementation (requestAnimationFrame | setTimeout)
      var rAF =
        window.requestAnimationFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 50);
        };

      // Animation loop
      var canceled = false;
      var change = to - from;

      function loop(timestamp) {
        var time = (timestamp || +new Date()) - start;

        if (time >= 0) {
          update(easing(time, from, change, duration));
        }
        if (time >= 0 && time >= duration) {
          update(to);
          done();
        } else {
          rAF(loop);
        }
      }

      update(from);

      // Start animation loop
      var start =
        window.performance && window.performance.now ? window.performance.now() : +new Date();

      rAF(loop);
    },

    /**
     * Get scrolled element value
     * @param {object} element jQuery element object
     * @param {string} method The passed in `method` value should be 'Top' or 'Left'
     * @returns {number}
     */
    getScroll: function (element, method) {
      method = 'scroll' + method;
      return element == window || element == document
        ? self[method == 'scrollTop' ? 'pageYOffset' : 'pageXOffset'] ||
            (browserSupportsBoxModel && document.documentElement[method]) ||
            document.body[method]
        : element[method];
    },

    /**
     * Scroll to element
     * @param {object} target jQuery element object
     * @param {number} offset Offset value (e.g: 100)
     * @param {number} duration Duration in milliseconds (e.g: 2000 - for 2 seconds)
     */
    scrollTo: function (target, offset, duration) {
      var duration = duration ? duration : 500;
      var targetPos = target ? HOLOLUtil.offset(target).top : 0;
      var scrollPos =
        window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      var from, to;

      if (offset) {
        targetPos = targetPos - offset;
      }

      from = scrollPos;
      to = targetPos;

      HOLOLUtil.animate(from, to, duration, function (value) {
        document.documentElement.scrollTop = value;
        document.body.parentNode.scrollTop = value;
        document.body.scrollTop = value;
      }); //, easing, done
    },

    /**
     * Scroll to Top
     * @param {number} offset Offset value (e.g: 100)
     * @param {number} duration Duration in milliseconds (e.g: 2000 - for 2 seconds)
     */
    scrollTop: function (offset, duration) {
      HOLOLUtil.scrollTo(null, offset, duration);
    },

    /**
     * Get document scroll top
     * @returns {number}
     */
    getScrollTop: function () {
      return (document.scrollingElement || document.documentElement).scrollTop;
    },

    /**
     * Convert number to currency number (e.g: 12,000)
     * @param {number} nStr
     * @returns {number}
     */
    numberCurrency: function (nStr) {
      nStr += '';
      var x = nStr.split('.');
      var x1 = x[0];
      var x2 = x.length > 1 ? '.' + x[1] : '';
      var rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
      }
      return x1 + x2;
    },

    /**
     * Get site direction
     * @returns {string}
     */
    getDir: function () {
      if (HOLOLUtil.attr(document.querySelector('html'), 'dir'))
        return HOLOLUtil.attr(document.querySelector('html'), 'dir');
      return 'ltr';
    },

    /**
     * Check if Site is RTL (Right to Left view)
     * @returns {boolean}
     */
    isRTL: function () {
      return HOLOLUtil.getDir() === 'rtl' ? true : false;
    },

    /**
     * Set inner element HTML
     * @param {object} element jQuery element object
     * @param {object, string} html
     */
    setHTML: function (element, html) {
      element.innerHTML = html;
    },

    /**
     * Get inner element HTML
     * @param {object} element jQuery element object
     * @returns {string}
     */
    getHTML: function (element) {
      if (element) {
        return element.innerHTML;
      }
    },

    /**
     * Set inner element Text
     * @param {object} element jQuery element object
     * @param {string} text
     */
    setTEXT: function (element, text) {
      element.innerText = text;
    },

    /**
     * Set inner element Text
     * @param {object} element jQuery element object
     * @returns {string}
     */
    getTEXT: function (element) {
      if (element) {
        return element.innerText;
      }
    },

    /**
     * Loop multi elements
     * @param {object} array Array of objects
     * @param {object} callback Function call
     */
    each: function (array, callback) {
      return [].slice.call(array).map(callback);
    },

    /**
     * Set app color mode
     * @param {string} mode The passed in `mode` value should be 'light' or 'dark'
     */
    setColorMode: function (mode) {
      HOLOLUtil.attr(document.querySelector('html'), 'data-color-mode', mode);
    },

    /**
     * Get app color mode
     * @returns {string}
     */
    getColorMode: function () {
      return HOLOLUtil.attr(document.querySelector('html'), 'data-color-mode');
    },

    /**
     * Set app theme
     * @param {string} theme The passed in `mode` value should be
     *     'regular' or 'high_contrast' or 'colorblind'
     */
    setTheme: function (theme) {
      HOLOLUtil.attr(document.querySelector('html'), 'data-theme', theme);
    },

    /**
     * Get app theme
     * @returns {string}
     */
    getTheme: function () {
      return HOLOLUtil.attr(document.querySelector('html'), 'data-theme');
    },

    /**
     * Get Site language
     * @returns {string}
     */
    getSiteLanguage: function () {
      if (HOLOLUtil.attr(document.querySelector('html'), 'lang'))
        return HOLOLUtil.attr(document.querySelector('html'), 'lang');
      return 'en';
    },

    /**
     * Get browser
     * @returns {object}
     */
    getBrowser: function () {
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
    },

    /**
     * Get OS
     * @returns {object}
     */
    getOS: function () {
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
    },
  };
})();

('use strict');

// Class definition
var HOLOLApp = (function () {
  var initHello = function () {
    const PROVIDER = window.Holol.INFO.PROVIDER,
      PROVIDER_INFO = window.Holol.INFO.PROVIDER_INFO,
      PROVIDER_LINK = window.Holol.INFO.PROVIDER_LINK,
      PROJECT = window.Holol.INFO.PROJECT,
      PROJECT_INFO = window.Holol.INFO.PROJECT_INFO,
      VERSION = window.Holol.INFO.VERSION;

    // Check if Chrome
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      // Message
      const _log = [
        `\n%c  ${PROVIDER}  %c \n${PROVIDER_INFO} \n${PROVIDER_LINK}  \n\n${PROJECT} - ${VERSION} %c  \n${PROJECT_INFO}`,
        'color: #fff; border: 1px solid #22447B; background: #22447B; padding:5px;',
        'border: none; padding:5px 5px 0;',
        'border: none; padding:0 5px 5px;',
      ];

      // View message in console log
      setTimeout(console.log.bind(console, ..._log));
    } else if (window.console)
      setTimeout(
        console.log.bind(
          console,
          `\n  ${PROVIDER}  \n ${PROVIDER_INFO}  \n ${PROVIDER_LINK} \n ${PROJECT}  \n ${PROJECT_INFO}\n`
        )
      );
  };

  var initPageLoader = function () {
    // On window load
    window.addEventListener('load', () => {
      HOLOLUtil.removeClass(document.body, 'page-loading');
    });

    // On page before unload
    window.addEventListener('beforeunload', function (e) {
      return document.body.classList.add('page-loading');
    });
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

      // Set default position
      let pos = { top: 0, left: 0, x: 0, y: 0 };

      // Mouse Down Handler
      const mouseDownHandler = function (e) {
        HOLOLUtil.css(dragToScrollItem, 'cursor', 'grabbing');

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
        HOLOLUtil.css(dragToScrollItem, 'cursor', '');

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
      if (HOLOLUtil.getSiteLanguage() == 'ar') {
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
      } else if (HOLOLUtil.getSiteLanguage == 'en') {
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

        if (end - start < 100 || label == Object.keys(ranges)[0]) {
          title = Object.keys(ranges)[0] + ':';
          range = start.format('MMM D');
        } else if (label == Object.keys(ranges)[1]) {
          title = Object.keys(ranges)[1] + ':';
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
          drops: 'auto',
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

  var initOffcanvas = function () {
    HOLOLUtil.each(document.querySelectorAll('[data-holol-offcanvas]'), function (element) {
      HOLOLUtil.addEvent(element, 'click', () => {
        var offcanvasElement = document.querySelector(
          HOLOLUtil.attr(element, 'data-holol-offcanvas')
        );

        //event.preventDefault()
        event.stopPropagation();
        var bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
        bsOffcanvas.show();
      });
    });
  };

  var initCheckboxGroup = function () {
    HOLOLUtil.each(
      document.querySelectorAll('[data-holol-checkbox][data-holol-checkbox-type="master"]'),
      function (element) {
        var sameList = document.querySelectorAll(
          '[data-holol-checkbox=' +
            HOLOLUtil.attr(element, 'data-holol-checkbox') +
            ']:not([data-holol-checkbox-type="master"])'
        );

        // Master Checkbox
        HOLOLUtil.addEvent(element, 'click', () => {
          // Get checkbox status
          var status = 'checked';
          if (element.checked) status = 'checked';
          else if (element.indeterminate) status = 'indeterminate';
          else status = 'unchecked';

          HOLOLUtil.each(sameList, function (newElement) {
            newElement.checked = status == 'checked' ? true : false;
          });
        });

        // Slave Checkboxes
        HOLOLUtil.each(sameList, function (newElement) {
          HOLOLUtil.addEvent(newElement, 'click', () => {
            let checkerResult = checker(sameList);

            if (newElement.checked) {
              if (checkerResult.all) {
                element.checked = true;
                element.indeterminate = false;
              } else {
                element.checked = false;
                element.indeterminate = true;
              }
            } else {
              if (!checkerResult.some) {
                element.checked = false;
                element.indeterminate = false;
              } else {
                element.checked = false;
                element.indeterminate = true;
              }
            }
          });
        });

        var checker = function (checkerList) {
          let checkerCheckAll = true,
            checkerCheckSome = false;

          HOLOLUtil.each(checkerList, function (checkerListItem) {
            if (checkerListItem.checked) {
              checkerCheckSome = true;
            } else {
              checkerCheckAll = false;
            }
          });

          return {
            all: checkerCheckAll,
            some: checkerCheckSome,
          };
        };
      }
    );
  };

  var initTableSelectorActions = function () {
    HOLOLUtil.each(document.querySelectorAll('table + .select-actions'), function (el) {
      // Get Table
      var table = el.previousElementSibling,
        checkboxes = table.querySelectorAll('[type="checkbox"]');

      checker(checkboxes).some == true
        ? el.classList.add('view', 'select')
        : el.classList.remove('view', 'select');

      HOLOLUtil.each(checkboxes, function (checkbox) {
        HOLOLUtil.addEvent(checkbox, 'change', () => {
          checker(checkboxes).some == true
            ? el.classList.add('view', 'select')
            : el.classList.remove('view', 'select');
        });
      });
    });

    function checker(checkerList) {
      let checkerCheckAll = true,
        checkerCheckSome = false;

      HOLOLUtil.each(checkerList, function (checkerListItem) {
        if (checkerListItem.checked) {
          checkerCheckSome = true;
        } else {
          checkerCheckAll = false;
        }
      });

      return {
        all: checkerCheckAll,
        some: checkerCheckSome,
      };
    }
  };

  // Public methods
  return {
    init: function () {
      this.initHello(window.Holol.PROVIDER, window.Holol.VERSION, window.Holol.LINK);
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
      this.initMainNavbar();
      this.initTopNavbar();
      this.initNotificationTabs();
      this.initDropdownSelect();
      this.initDragScroll();
      this.initDaterangepicker();
      this.initOffcanvas();
      this.initCheckboxGroup();
      this.initTableSelectorActions();
    },

    initHello: function (provider, version, link) {
      initHello(provider, version, link);
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

    initOffcanvas: function () {
      initOffcanvas();
    },
    initCheckboxGroup: function () {
      initCheckboxGroup();
    },
    initTableSelectorActions: function () {
      initTableSelectorActions();
    },
  };
})();

// On document ready
HOLOLUtil.onDOMContentLoaded(() => {
  HOLOLApp.init();
});
