'use strict';

// Global variables
window.HOLOLUtilDelegatedEventHandlers = {};

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

      console.log(breakpoint);
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

      console.log(breakpoint);
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
     * Add Attributes to the given element
     * @param {object} el jQuery element object
     * @param {object} attributes Array of attributes
     *    (e.g: {attribute_1: value_1, attribute_2: value_2})
     */
    addAttribute: function (el, attributes) {
      if (!el || typeof attributes === 'undefined') {
        return;
      }

      for (var key in attributes) {
        el.setAttribute(key, attributes[key]);
      }
    },

    /**
     * Remove Attributes from the given element
     * @param {object} el jQuery element object
     * @param {object} attributes Array of attributes (e.g: {attribute_1, attribute_2})
     */
    removeAttribute: function (el, attributes) {
      if (!el || typeof attributes === 'undefined') {
        return;
      }

      for (var key in attributes) {
        el.removeAttribute(key);
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

      window.HOLOLUtilDelegatedEventHandlers[eventId] = function (e) {
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

      HOLOLUtil.addEvent(element, event, window.HOLOLUtilDelegatedEventHandlers[eventId]);

      return eventId;
    },

    /**
     * Remove Event from the given element inner event ID
     * @param {object} element jQuery element object
     * @param {string} event string for event type (e.g: click, mouseover, ...)
     * @param {string} eventId
     */
    off: function (element, event, eventId) {
      if (!element || !window.HOLOLUtilDelegatedEventHandlers[eventId]) {
        return;
      }

      HOLOLUtil.removeEvent(element, event, window.HOLOLUtilDelegatedEventHandlers[eventId]);

      delete window.HOLOLUtilDelegatedEventHandlers[eventId];
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
     * Insert element after referenceNode inside DOM.
     * @param {object} element jQuery element object
     * @param {object} referenceNode jQuery reference node object
     * @returns {object}
     */
    insertBefore: function (element, referenceNode) {
      return referenceNode.parentNode.insertBefore(element, referenceNode);
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
     * Set attribute
     * @param {object} element jQuery element object
     * @param {string} name attribute name
     * @param {string} value attribute value
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
    setAttrs: function (element, attributes) {
      if (element == undefined || attributes == undefined) {
        return;
      }

      Object.keys(attributes).forEach((attr) => {
        element.setAttribute(attr, attributes[attr]);
      });
    },

    hasAttr: function (el, name) {
      if (el == undefined) {
        return;
      }

      return el.getAttribute(name) ? true : false;
    },

    removeAttr: function (el, name) {
      if (el == undefined) {
        return;
      }

      el.removeAttribute(name);
    },

    css: function (el, styleProp, value, important) {
      if (!el) {
        return;
      }

      if (value !== undefined) {
        if (important === true) {
          el.style.setProperty(styleProp, value, 'important');
        } else {
          el.style[styleProp] = value;
        }
      } else {
        var defaultView = (el.ownerDocument || document).defaultView;

        // W3C standard way:
        if (defaultView && defaultView.getComputedStyle) {
          // sanitize property name to css notation
          // (hyphen separated words eg. font-Size)
          styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase();

          return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
        } else if (el.currentStyle) {
          // IE
          // sanitize property name to camelCase
          styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
            return letter.toUpperCase();
          });

          value = el.currentStyle[styleProp];

          // convert other units to pixels on IE
          if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
            return (function (value) {
              var oldLeft = el.style.left,
                oldRsLeft = el.runtimeStyle.left;

              el.runtimeStyle.left = el.currentStyle.left;
              el.style.left = value || 0;
              value = el.style.pixelLeft + 'px';
              el.style.left = oldLeft;
              el.runtimeStyle.left = oldRsLeft;

              return value;
            })(value);
          }

          return value;
        }
      }
    },

    getCssVariableValue: function (variableName) {
      var hex = getComputedStyle(document.documentElement).getPropertyValue(variableName);
      if (hex && hex.length > 0) {
        hex = hex.trim();
      }

      return hex;
    },

    height: function (el) {
      return HOLOLUtil.css(el, 'height');
    },

    width: function (el) {
      return HOLOLUtil.css(el, 'width');
    },

    getScroll: function (element, method) {
      // The passed in `method` value should be 'Top' or 'Left'
      method = 'scroll' + method;
      return element == window || element == document
        ? self[method == 'scrollTop' ? 'pageYOffset' : 'pageXOffset'] ||
            (browserSupportsBoxModel && document.documentElement[method]) ||
            document.body[method]
        : element[method];
    },

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

    scrollTop: function (offset, duration) {
      HOLOLUtil.scrollTo(null, offset, duration);
    },

    getScrollTop: function () {
      return (document.scrollingElement || document.documentElement).scrollTop;
    },

    numberString: function (nStr) {
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

    isRTL: function () {
      return document.querySelector('html').getAttribute('direction') === 'rtl';
    },

    setHTML: function (el, html) {
      el.innerHTML = html;
    },

    getHTML: function (el) {
      if (el) {
        return el.innerHTML;
      }
    },

    colorLighten: function (color, amount) {
      const addLight = function (color, amount) {
        let cc = parseInt(color, 16) + amount;
        let c = cc > 255 ? 255 : cc;
        c = c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;
        return c;
      };

      color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color;
      amount = parseInt((255 * amount) / 100);

      return (color = `#${addLight(color.substring(0, 2), amount)}${addLight(
        color.substring(2, 4),
        amount
      )}${addLight(color.substring(4, 6), amount)}`);
    },

    colorDarken: function (color, amount) {
      const subtractLight = function (color, amount) {
        let cc = parseInt(color, 16) - amount;
        let c = cc < 0 ? 0 : cc;
        c = c.toString(16).length > 1 ? c.toString(16) : `0${c.toString(16)}`;

        return c;
      };

      color = color.indexOf('#') >= 0 ? color.substring(1, color.length) : color;
      amount = parseInt((255 * amount) / 100);

      return (color = `#${subtractLight(color.substring(0, 2), amount)}${subtractLight(
        color.substring(2, 4),
        amount
      )}${subtractLight(color.substring(4, 6), amount)}`);
    },

    each: function (array, callback) {
      return [].slice.call(array).map(callback);
    },

    majed: function () {
      return 'Majed';
    },
  };
})();

('use strict');

// Class definition
var HOLOLApp = function () {
  var initPageLoader = function () {
    // CSS3 Transitions only after page load(.page-loading class added to body tag and remove with JS on page load)
    HOLOLUtil.removeClass(document.body, 'page-loading');
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

  var initBootstrapTooltips = function (options) {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      if (options) initBootstrapTooltip(tooltipTriggerEl, options);
      else initBootstrapTooltip(tooltipTriggerEl, {});
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

  var initBootstrapPopovers = function (options) {
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));

    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      if (options) initBootstrapPopover(popoverTriggerEl, options);
      else initBootstrapPopover(popoverTriggerEl, {});
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

  var initButtons = function () {
    var buttonsGroup = [].slice.call(document.querySelectorAll('[data-holol-buttons="true"]'));

    buttonsGroup.map(function (group) {
      var selector = group.hasAttribute('data-holol-buttons-target')
        ? group.getAttribute('data-holol-buttons-target')
        : '.btn';

      // Toggle Handler
      HOLOLUtil.on(group, selector, 'click', function (e) {
        var buttons = [].slice.call(group.querySelectorAll(selector + '.active'));

        buttons.map(function (button) {
          button.classList.remove('active');
        });

        this.classList.add('active');
      });
    });
  };

  var initCheck = function () {
    // Toggle Handler
    HOLOLUtil.on(document.body, '[data-holol-check="true"]', 'change', function (e) {
      var check = this;
      var targets = document.querySelectorAll(check.getAttribute('data-holol-check-target'));

      HOLOLUtil.each(targets, function (target) {
        if (target.type == 'checkbox') {
          target.checked = check.checked;
        } else {
          target.classList.toggle('active');
        }
      });
    });
  };

  var initSelect2 = function () {
    var elements = [].slice.call(
      document.querySelectorAll('[data-control="select2"], [data-holol-select2="true"]')
    );

    elements.map(function (element) {
      var options = {
        dir: document.body.getAttribute('direction'),
      };

      if (element.getAttribute('data-hide-search') == 'true') {
        options.minimumResultsForSearch = Infinity;
      }

      $(element).select2(options);
    });
  };

  var initAutosize = function () {
    var inputs = [].slice.call(document.querySelectorAll('[data-holol-autosize="true"]'));

    inputs.map(function (input) {
      autosize(input);
    });
  };

  var initCountUp = function () {
    var elements = [].slice.call(
      document.querySelectorAll('[data-holol-countup="true"]:not(.counted)')
    );

    elements.map(function (element) {
      if (HOLOLUtil.isInViewport(element) && HOLOLUtil.visible(element)) {
        var options = {};

        var value = element.getAttribute('data-holol-countup-value');
        value = parseFloat(value.replace(/,/, ''));

        if (element.hasAttribute('data-holol-countup-start-val')) {
          options.startVal = parseFloat(element.getAttribute('data-holol-countup-start-val'));
        }

        if (element.hasAttribute('data-holol-countup-duration')) {
          options.duration = parseInt(element.getAttribute('data-holol-countup-duration'));
        }

        if (element.hasAttribute('data-holol-countup-decimal-places')) {
          options.decimalPlaces = parseInt(
            element.getAttribute('data-holol-countup-decimal-places')
          );
        }

        if (element.hasAttribute('data-holol-countup-prefix')) {
          options.prefix = element.getAttribute('data-holol-countup-prefix');
        }

        if (element.hasAttribute('data-holol-countup-suffix')) {
          options.suffix = element.getAttribute('data-holol-countup-suffix');
        }

        var count = new countUp.CountUp(element, value, options);

        count.start();

        element.classList.add('counted');
      }
    });
  };

  var initCountUpTabs = function () {
    // Initial call
    initCountUp();

    // Window scroll event handler
    window.addEventListener('scroll', initCountUp);

    // Tabs shown event handler
    var tabs = [].slice.call(
      document.querySelectorAll('[data-holol-countup-tabs="true"][data-bs-toggle="tab"]')
    );
    tabs.map(function (tab) {
      tab.addEventListener('shown.bs.tab', initCountUp);
    });
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

  return {
    init: function () {
      this.initPageLoader();
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
    },

    initPageLoader: function () {
      initPageLoader();
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

    setColorMode: function (mode) {
      document.querySelector('html').setAttribute('data-color-mode', mode);
    },

    getColorMode: function () {
      return document.querySelector('html').getAttribute('data-color-mode');
    },

    setTheme: function (theme) {
      document.querySelector('html').setAttribute('data-theme', theme);
    },

    getTheme: function () {
      return document.querySelector('html').getAttribute('data-theme');
    },
  };
};

// On document ready

var uiNew = function () {
  function welcome(fn, ln) {
    console.log(fn + ' ' + ln);
  }

  function tryit(x) {
    if (x) welcome('majed', 'sief');
    else welcome('sief', 'majed');
  }
  return {
    welcome: function welcome(fn, ln) {
      console.log(fn + ' ' + ln);
    },
    try: function (x) {
      if (x) welcome('majed', 'sief');
      else welcome('sief', 'majed');
    },
  };
};
function welcome(fn, ln) {
  console.log(fn + ' ' + ln);

  uiNew.try(true);
}

function tryit(x) {
  if (x) welcome('majed', 'sief');
  else welcome('sief', 'majed');
}

HOLOLUtil.onDOMContentLoaded(function () {
  tryit(true);
});

HOLOLUtil.onDOMContentLoaded(function () {
  const sdfsdfsd = document.querySelector('[statistics]');
  console.log(HOLOLUtil.setAttrs(sdfsdfsd, { majed: 'fsdf', ahmed: 'kkkkkkk' }));
  console.log(HOLOLUtil.attr(sdfsdfsd, 'jjjjj', 'asd55555'));

  // HOLOLUtil.on(sdfsdfsd, '.item[chart-control]', 'click', function () {
  //   console.log('asdasdasdad');
  // });
});
