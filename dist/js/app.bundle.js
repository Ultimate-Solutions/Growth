('use strict');

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
     * Load JS script to DOM
     * @param {string} name
     * @param {string} version
     * @param {string} url
     * @param {string} integrity
     * @param {string} crossorigin
     * @param {string} type
     * @param {string} referrerpolicy
     * @returns {Promise}
     */
    loadScript: function (name, version, url, integrity, crossorigin, type, referrerpolicy) {
      if (!url) return;

      return new Promise(function (resolve, reject) {
        let comment;
        if (name && version) comment = document.createComment(name + ' v' + version);
        if (name && !version) comment = document.createComment(name);
        let script = document.createElement('script');
        script.src = url;
        if (integrity) script.integrity = integrity;
        if (crossorigin) script.setAttribute('crossorigin', crossorigin);
        if (type) script.type = type;
        if (referrerpolicy) {
          script.setAttribute('referrerpolicy', referrerpolicy);
        }
        script.async = false;
        script.onload = function () {
          resolve(url);
        };
        script.onerror = function () {
          reject(url);
        };
        if (comment) document.body.appendChild(comment);
        document.body.appendChild(script);
      });
    },

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
     * Checks whether current device is mobile device.
     * @returns {boolean}
     */
    isMobileDevice: function () {
      var isMobileDevice = this.getViewPort().width < this.getBreakpoint('lg') ? true : false;

      // For use within normal web clients
      if (isMobileDevice === false) isMobileDevice = navigator.userAgent.match(/iPad/i) != null;

      return isMobileDevice;
    },

    /**
     * Checks whether current device is desktop device.
     * @returns {boolean}
     */
    isDesktopDevice: function () {
      return HOLOLUtil.isMobileDevice() ? false : true;
    },

    /**
     * Checks whether current device is touch device.
     * @returns {boolean}
     */
    isTouchDevice: function () {
      return (
        true ==
        ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch))
      );
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
     * @param {string} breakpoint Responsive mode name (e.g: xl, lg, md, sm, xs) or
     * (e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
     * @returns {number} (e.g: xxl: 1400)
     */
    getBreakpoint: function (breakpoint) {
      var value = this.getCssVariableValue('--breakpoint-' + breakpoint);

      if (value) {
        value = parseInt(value.trim());
      }

      return value;
    },

    /**
     * Checks whether given device breakpoint is currently activated.
     * @param {string} breakpoint Responsive breakpoint name (e.g: xl, lg, md, sm, xs) or
     * (e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
     * @returns {boolean}
     */
    isBreakpointUp: function (breakpoint) {
      return this.getViewPort().width >= this.getBreakpoint(breakpoint);
    },

    /**
     * Checks whether given device breakpoint is currently deactivated.
     * @param {string} breakpoint Responsive breakpoint name (e.g: xl, lg, md, sm, xs) or
     * (e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
     * @returns {boolean}
     */
    isBreakpointDown: function (breakpoint) {
      return this.getViewPort().width < this.getBreakpoint(breakpoint);
    },

    /**
     * Generates unique ID for give prefix & suffix.
     * @param {string} prefix Prefix for generated ID, can be empty
     * @param {string} suffix suffix for generated ID, can be empty
     * @returns {boolean}
     */
    getUniqueID: function (prefix, suffix) {
      return (prefix || '') + Math.floor(Math.random() * new Date().getTime()) + (suffix || '');
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

      if (keys.indexOf('[') !== -1) throw new Error('Unsupported object path notation.');

      keys = keys.split('.');

      do {
        if (obj === undefined) return false;

        stone = keys.shift();

        if (!obj.hasOwnProperty(stone)) return false;

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

          if (!isNaN(value) && value !== 0) return value;
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

        if (position === 'fixed') return true;

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
     * Throttle function
     * @param {function} func function which needs to be throttled
     * @param {number} delay time interval in milliseconds
     */
    throttle: function (timer, func, delay) {
      // If setTimeout is already scheduled, no need to do anything
      if (timer) return;

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
     * @param {function} func function which needs to be debounced
     * @param {number} delay debounced time in milliseconds
     */
    debounce: function (timer, func, delay) {
      // Cancels the setTimeout method execution
      clearTimeout(timer);

      // Executes the func after delay time.
      timer = setTimeout(func, delay);
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
     * @param {number} min Range start value, default: -1000
     * @param {number} max Range end value, default: 1000
     * @returns {number}
     */
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * ((max || 1000) - (min || -1000) + 1)) + (min || -1000);
    },

    /**
     * Checks whether the element has given classes
     * @param {object} element jQuery element object
     * @param {string} className string with spaces between every class name for multi classes
     * @returns {boolean}
     */
    hasClass: function (element, className) {
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
    },

    /**
     * Add class to the given element
     * @param {object} element jQuery element object
     * @param {string} className string with spaces between every class name to add multi classes
     */
    addClass: function (element, className) {
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
    },

    /**
     * Remove class from the given element
     * @param {object} element jQuery element object
     * @param {string} className string with spaces between every class name to remove multi classes
     */
    removeClass: function (element, className) {
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
    },

    /**
     * Toggle class off the given element
     * @param {object} element jQuery element object
     * @param {string} className string with spaces between every class name to add multi classes
     */
    toggleClass: function (element, className) {
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
    },

    /**
     * Add Event to the given element
     * @param {object} element jQuery element object
     * @param {string} type string for event type (e.g: click, mouseover, ...)
     * @param {object} handler what run on event (e.g: function)
     */
    addEvent: function (element, type, handler) {
      if (typeof element !== 'undefined' && element !== null)
        element.addEventListener(type, handler);
    },

    /**
     * Remove Event from the given element
     * @param {object} element jQuery element object
     * @param {string} type string for event type (e.g: click, mouseover, ...)
     * @param {object} handler what run on event (e.g: function)
     */
    removeEvent: function (element, type, handler) {
      if (element !== null) element.removeEventListener(type, handler);
    },

    /**
     * Add Event to the given element inner selector
     * @param {object} element jQuery element object
     * @param {string} selector selector string
     * @param {string} event string for event type (e.g: click, mouseover, ...)
     * @param {object} handler what run on event (e.g: function)
     */
    on: function (element, selector, event, handler) {
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
    },

    /**
     * Remove Event from the given element inner event ID
     * @param {object} element jQuery element object
     * @param {string} event string for event type (e.g: click, mouseover, ...)
     * @param {string} eventId
     */
    off: function (element, event, eventId) {
      if (!element || !window.Holol.UTIL.DelegatedEventHandlers[eventId]) return;

      HOLOLUtil.removeEvent(element, event, window.Holol.UTIL.DelegatedEventHandlers[eventId]);

      delete window.Holol.UTIL.DelegatedEventHandlers[eventId];
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
     * @param {object} value responsive values (e.g: {default: '100px', lg: '150px', sm: '100px'})
     * default for breakpoint 0
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
    },

    /**
     * Get index of element according to parentNode
     * @param {object} element jQuery element object
     * @returns {number}
     */
    index: function (element) {
      if (!element) return;

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
     * Convert string to legal DOM ID
     * @param {string} string String to convert
     * @param {string} validation (eg: h: for HTML, h5: for HTML5, base64: for base64 ) default: base64
     * @returns {string}
     */
    stringToID: function (string, validation) {
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
    },

    /**
     * Removes element from DOM.
     * @param {object} element jQuery element object
     */
    remove: function (element) {
      if (element && element.parentNode) element.parentNode.removeChild(element);
    },

    /**
     * Fid element inside parent DOM.
     * @param {object} parent jQuery element object
     * @param {string} query selector string
     * @returns {object}
     */
    find: function (parent, query) {
      if (parent !== null) return parent.querySelector(query);
      else return null;
    },

    /**
     * Fid elements inside parent DOM.
     * @param {object} parent jQuery element object
     * @param {string} query selector string
     * @returns {object} Array of objects
     */
    findAll: function (parent, query) {
      if (parent !== null) return parent.querySelectorAll(query);
      else return null;
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
    },

    /**
     * Get the outer width of element
     * @param {object} element jQuery element object
     * @param {boolean} withMargin (e.g: true: if has margin)
     * @returns {number}
     */
    outerWidth: function (element, withMargin) {
      if (!element) return;

      var width = element.offsetWidth;
      var style;

      if (typeof withMargin !== 'undefined' && withMargin === true) {
        style = getComputedStyle(element);
        width += parseInt(style.marginLeft) + parseInt(style.marginRight);

        return width;
      } else return width;
    },

    /**
     * Get the outer height of element
     * @param {object} element jQuery element object
     * @param {boolean} withMargin (e.g: true: if has margin)
     * @returns {number}
     */
    outerHeight: function (element, withMargin) {
      if (!element) return;

      var height = element.offsetHeight;
      var style;

      if (typeof withMargin !== 'undefined' && withMargin === true) {
        style = getComputedStyle(element);
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);

        return height;
      } else return height;
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
    visible: function (element) {
      if (!element) return;

      return !(element.offsetWidth === 0 && element.offsetHeight === 0);
    },

    /**
     * Show element
     * @param {object} element jQuery element object
     * @param {string} display display type (e.g: block, inline, none ...)
     */
    show: function (element, display) {
      if (typeof element !== 'undefined') element.style.display = display ? display : 'block';
    },

    /**
     * Hide element
     * @param {object} element jQuery element object
     */
    hide: function (el) {
      if (typeof el !== 'undefined') el.style.display = 'none';
    },

    /**
     * Check if element is in viewport
     * @param {object} element jQuery element object
     * @returns {boolean}
     */
    isInViewport: function (element) {
      if (!element) return;

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
      if (!element) return;

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
     * @param {function} callback (e.g: function)
     */
    onDOMContentLoaded: function (callback) {
      if (typeof callback !== 'function') return;

      if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', callback);
      else callback();
    },

    /**
     * Check if loaded in Iframe
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
     * @param {string} attribute attribute name
     * @param {string} value attribute value (remove if want to get attribute value)
     */
    attr: function (element, attribute, value) {
      if (!element) return;

      if (value !== undefined && value !== null) element.setAttribute(attribute, value);
      else if (!attribute && attribute !== null) return;
      else if (element.getAttribute(attribute) == '') return true;
      else return element.getAttribute(attribute);
    },

    /**
     * Set multiple attributes
     * @param {object} element jQuery element object
     * @param {object} attributes Array of attributes (e.g: {name: value, name2: value2})
     */
    attrs: function (element, attributes) {
      if (!element || !attributes) return;

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
      if (!element || !attribute) return;

      return element.hasAttribute(attribute) ? true : false;
    },

    /**
     * Remove element with attribute
     * @param {object} element jQuery element object
     * @param {string} attribute attribute name
     * @returns {boolean}
     */
    removeAttr: function (element, attribute) {
      if (!element || !attribute) return;

      element.removeAttribute(attribute);
    },

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
    css: function (element, styleProp, value, important) {
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
    },

    /**
     * Get CSS Variable value
     * @param {string} variableName required variable name
     * @returns {string} variable value
     */
    getCssVariableValue: function (variableName) {
      if (!variableName) return;

      var hex = getComputedStyle(document.documentElement).getPropertyValue(variableName);
      if (hex && hex.length > 0) hex = hex.trim();

      return hex;
    },

    /**
     * Get CSS height value
     * @param {object} element jQuery element object
     * @returns {string} variable value
     */
    height: function (element) {
      if (!element) return;

      return HOLOLUtil.css(element, 'height');
    },

    /**
     * Get CSS width value
     * @param {object} element jQuery element object
     * @returns {string} variable value
     */
    width: function (element) {
      if (!element) return;

      return HOLOLUtil.css(element, 'width');
    },

    /**
     * Get scrolled element value
     * @param {object} element jQuery element object
     * @param {string} method The passed in `method` value should be 'Top' or 'Left'
     * @returns {number}
     */
    getScroll: function (element, method) {
      if (!element || !method || method !== 'Top' || method !== 'Left') return;

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
     * @param {string | function} easing Optional: A string when the easing function is
     * available in TinyAnimate.easings, or a function with the signature: function(t, b, c, d) {...}
     */
    scrollTo: function (target, offset) {
      if (typeof target === undefined) return;

      var targetPos = target ? HOLOLUtil.offset(target).top : 0;

      if (typeof offset === 'number') targetPos = targetPos - offset;

      window.scroll({
        top: targetPos,
        behavior: 'smooth',
      });
    },

    /**
     * Scroll to Top
     * @param {number} offset Offset value (e.g: 100)
     * @param {number} duration Duration in milliseconds (e.g: 2000 - for 2 seconds)
     */
    scrollTop: function (offset) {
      offset = typeof offset === 'number' ? offset * -1 : 0;

      HOLOLUtil.scrollTo(null, offset);
    },

    /**
     * Get document scroll top
     * @returns {number}
     */
    getScrollTop: function () {
      return (document.scrollingElement || document.documentElement).scrollTop;
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
     * Set / Remove inner element HTML
     * @param {object} element jQuery element object
     * @param {object, string} html leave empty or don't enter to remove element content
     */
    setHTML: function (element, html) {
      if (!element) return;

      html = html ? html : '';
      element.innerHTML = html;
    },

    /**
     * Get inner element HTML
     * @param {object} element jQuery element object
     * @returns {string}
     */
    getHTML: function (element) {
      if (element) return element.innerHTML;
    },

    /**
     * Set / Remove inner element Text
     * @param {object} element jQuery element object
     * @param {string} text leave empty or don't enter to remove element text
     */
    setTEXT: function (element, text) {
      if (!element) return;

      text = text ? text : '';
      element.innerText = text;
    },

    /**
     * Set inner element Text
     * @param {object} element jQuery element object
     * @returns {string}
     */
    getTEXT: function (element) {
      if (element) return element.innerText;
    },

    /**
     * Loop multi elements
     * @param {object} array Array of objects
     * @param {function} callback Function call
     */
    each: function (array, callback) {
      return [].slice.call(array).map(callback);
    },

    /**
     * Set app color mode
     * @param {string} mode The passed in `mode` value must be 'light' or 'dark'
     */
    setColorMode: function (mode) {
      if (['light', 'dark'].includes(mode))
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
     * @param {string} theme The passed in `mode` value must be
     *     'regular' or 'high_contrast' or 'colorblind'
     */
    setTheme: function (theme) {
      if (['regular', 'high_contrast', 'colorblind'].includes(theme))
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

    /**
     * Get Mutation Observer
     * @param {object} element jQuery element object
     * @param {object} options Array of options
     * @param {function} callback Function call
     */
    mutationObserver: function (element, options, callback) {
      const mutationObserver = new MutationObserver(function (mutationsList, observer) {
        callback();
      });
      mutationObserver.observe(element, options);
    },
  };
})();

('use strict');

//   _    _  ____  _      ____  _
//  | |  | |/ __ \| |    / __ \| |        /\
//  | |__| | |  | | |   | |  | | |       /  \   _ __  _ __
//  |  __  | |  | | |   | |  | | |      / /\ \ | '_ \| '_ \
//  | |  | | |__| | |___| |__| | |____ / ____ \| |_) | |_) |
//  |_|  |_|\____/|______\____/|______/_/    \_\ .__/| .__/
//                                             | |   | |
//                                             |_|   |_|
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
    window.addEventListener('beforeunload', () => {
      HOLOLUtil.addClass(document.body, 'page-loading');
      // return document.body.classList.add('page-loading');
    });
  };

  var initScriptsLoader = function () {
    let scripts = window.globalScripts;

    if (!scripts) return;

    // save all Promises as array
    let promises = [];
    scripts.forEach(function (target) {
      promises.push(
        HOLOLUtil.loadScript(
          target.name,
          target.version,
          target.url,
          target.integrity,
          target.crossorigin,
          target.type,
          target.referrerpolicy
        )
      );
    });

    Promise.all(promises)
      .then(function () {
        console.log('all scripts loaded');
        HOLOLApp.init();
      })
      .catch(function (script) {
        console.log(script + ' failed to load');
      });
  };

  var initLazyLoad = function () {
    if (!document.querySelector('.lazy')) return;

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
        if (!HOLOLUtil.isTouchDevice())
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

  var initBootstrapDropdownInResponsiveTable = function () {
    $('.table-responsive').on('shown.bs.dropdown', function (e) {
      var $table = $(this),
        $menu = $(e.target).siblings('.dropdown-menu'),
        tableOffsetHeight = $table.offset().top + $table.height(),
        menuOffsetHeight = $menu.offset().top + $menu.outerHeight(true);

      if (menuOffsetHeight > tableOffsetHeight)
        $table.css('padding-bottom', menuOffsetHeight - tableOffsetHeight);
    });

    $('.table-responsive').on('hide.bs.dropdown', function () {
      $(this).css('padding-bottom', 0);
    });
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
            var icon = expandCollapseAction.querySelector('em');

            if (HOLOLUtil.hasAttr(mainNavbar, 'collapse')) {
              HOLOLUtil.removeAttr(mainNavbar, 'collapse');
              HOLOLUtil.attr(mainNavbar, 'expand', '');

              // Check window width for mobile view
              if (windowWidth) HOLOLUtil.addClass(document.body, 'overflow-hidden h-100');
            } else if (HOLOLUtil.hasAttr(mainNavbar, 'expand')) {
              HOLOLUtil.removeAttr(mainNavbar, 'expand');
              HOLOLUtil.attr(mainNavbar, 'collapse', '');
              if (windowWidth) HOLOLUtil.removeClass(document.body, 'overflow-hidden h-100');
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

  var initSearchbarInput = function () {
    // Focus search bar input
    const searchBar = document.querySelectorAll('.search-bar');

    HOLOLUtil.each(searchBar, (searchbarElement) => {
      var searchbarInput;
      if (searchbarElement) searchbarInput = searchbarElement.querySelector('input[type="text"]');

      if (searchbarInput) {
        HOLOLUtil.addEvent(searchbarInput, 'focusin', () => {
          HOLOLUtil.addClass(searchbarElement, 'focus');
        });
        HOLOLUtil.addEvent(searchbarInput, 'focusout', () => {
          HOLOLUtil.removeClass(searchbarElement, 'focus');
        });
      }
    });
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
      // View Offcanvas
      HOLOLUtil.addEvent(element, 'click', () => {
        var offcanvasElement = document.querySelector(
          HOLOLUtil.attr(element, 'data-holol-offcanvas')
        );

        //event.preventDefault()
        event.stopPropagation();
        var bsOffcanvas = new bootstrap.Offcanvas(offcanvasElement);
        bsOffcanvas.show();

        // Prevent close on click backdrop for form offcanvas
        if (HOLOLUtil.attr(offcanvasElement, 'data-holol-offcanvas-form')) {
          // Reset
          var isAllowedToHide = false;

          // Add click handler to dismiss buttons for allowing the exit and repeat the hide action
          HOLOLUtil.each(
            offcanvasElement.querySelectorAll('[data-bs-dismiss="offcanvas"]'),
            function (button) {
              HOLOLUtil.addEvent(button, 'click', () => {
                isAllowedToHide = true;
                bsOffcanvas.hide();
              });
            }
          );

          // Checks if hide is allowed and prevents the event if not
          HOLOLUtil.addEvent(offcanvasElement, 'hide.bs.offcanvas', (event) => {
            if (!isAllowedToHide) event.preventDefault();
          });
        }
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
        HOLOLUtil.addEvent(element, 'change', () => {
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
          HOLOLUtil.addEvent(newElement, 'change', () => {
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
        checkboxes = table.querySelectorAll('[type="checkbox"]'),
        checkboxMaster = table.querySelector(
          '[type="checkbox"][data-holol-checkbox-type="master"]'
        ),
        checkboxesCount;

      // Check if checkbox is checked
      checker(checkboxes).some == true ? el.classList.add('select') : el.classList.remove('select');
      // Check on state changes
      HOLOLUtil.each(checkboxes, function (checkbox) {
        HOLOLUtil.addEvent(checkbox, 'change', () => {
          // View / Hide Selector actions
          checker(checkboxes).some == true
            ? el.classList.add('select')
            : el.classList.remove('select');

          // Reset counter
          checkboxesCount = 0;

          // Get checkboxes checked count
          HOLOLUtil.each(checkboxes, function (checkboxCount) {
            if (checkboxCount != checkboxMaster)
              checkboxesCount = checkboxCount.checked ? (checkboxesCount += 1) : checkboxesCount;
          });

          // Set checkboxes checked number
          el.querySelector('[number] > span:first-child').innerText = checkboxesCount;
        });
      });

      // Check if table is in viewport
      HOLOLUtil.isPartInViewport(table)
        ? el.classList.add('inViewport')
        : el.classList.remove('inViewport');

      // View Selector actions on scroll to view
      HOLOLUtil.addEvent(window, 'scroll', () => {
        // Check if table is in viewport
        HOLOLUtil.isPartInViewport(table)
          ? el.classList.add('inViewport')
          : el.classList.remove('inViewport');
      });

      // Close BTN
      HOLOLUtil.addEvent(el.querySelector('[action="close"'), 'click', () => {
        // Un-check all related checkboxes
        HOLOLUtil.each(checkboxes, function (checkbox) {
          checkbox.checked = false;
          checkbox.indeterminate = false;

          // Hide Selector actions
          el.classList.remove('select');
        });
      });
    });

    // List active checker
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

  var initResponsiveTableStickyColumns = function () {
    // Helper function
    var columnNumber = function (list, el) {
      // Reset count
      var count = 0,
        current = 0;

      HOLOLUtil.each(list, function (item) {
        count += 1;
        if (item === el) {
          current = count;
        }
      });
      return current;
    };

    // Get all responsive tables
    HOLOLUtil.each(document.querySelectorAll('.table-responsive table'), function (table) {
      var selectorColumn = table.querySelector('th[selector]'),
        selectorColumnNumber,
        actionsColumn = table.querySelector('th[actions]'),
        actionsColumnNumber;

      // Get table Header
      var tableHeaderItems = table.querySelectorAll('thead > tr > th');

      // Set selector & actions columns number
      selectorColumnNumber = columnNumber(tableHeaderItems, selectorColumn);
      actionsColumnNumber = columnNumber(tableHeaderItems, actionsColumn);

      // Set sticky to selector & actions columns
      if (selectorColumn)
        selectorColumn.style.cssText = 'position: -webkit-sticky; position: sticky; right: 0;';
      if (actionsColumn)
        actionsColumn.style.cssText = 'position: -webkit-sticky; position: sticky; left: 0;';

      // Set sticky to selector columns
      var tableBodySelectorItems = table.querySelectorAll(
        'tbody > tr > *:nth-child(' + selectorColumnNumber + ')'
      );
      HOLOLUtil.each(tableBodySelectorItems, function (item) {
        item.style.cssText = 'position: -webkit-sticky; position: sticky; right: 0;';
      });

      // Set sticky to actions columns
      var tableBodyActionsItems = table.querySelectorAll(
        'tbody > tr > *:nth-child(' + actionsColumnNumber + ')'
      );
      HOLOLUtil.each(tableBodyActionsItems, function (item) {
        item.style.cssText = 'position: -webkit-sticky; position: sticky; left: 0;';
      });

      // Check if table element is sticky for dropdown menus &
      var tableBodyItems = table.querySelectorAll('tbody > tr > *');
      HOLOLUtil.each(tableBodyItems, function (item) {
        // Check if element is sticky
        if (window.getComputedStyle(item).getPropertyValue('position').includes('sticky')) {
          // Check if element has dropdown
          var stickyItemDropdown = item.querySelector('[data-bs-toggle="dropdown"]');
          // Check if dropdown is exist
          if (stickyItemDropdown)
            HOLOLUtil.mutationObserver(stickyItemDropdown, { attributes: true }, () => {
              item.style.zIndex = stickyItemDropdown.classList.contains('show') ? '1' : '';
            });
        }
      });

      // Check if sticky to selector columns exist
      if (selectorColumnNumber) {
        // Get table sticky items
        var tableBodyStickyItems = table.querySelectorAll('tr > *[sticky]');

        // Set sticky position for another sticky columns
        var tableBodyStickyItemsResize = function () {
          HOLOLUtil.each(tableBodyStickyItems, function (item) {
            item.style.setProperty(
              '--table-sticky-column-right',
              HOLOLUtil.css(selectorColumn, 'width')
            );
          });
        };
        tableBodyStickyItemsResize();
        HOLOLUtil.addEvent(window, 'resize', () => {
          tableBodyStickyItemsResize();
        });
      }
    });
  };

  var initInputSwitch = function () {
    HOLOLUtil.each(document.querySelectorAll('[data-holol-switch]'), function (element) {
      // get type
      var type = HOLOLUtil.attr(element, 'data-holol-switch-type');

      // get target container
      var targetContainer = document.querySelector(
        '#' + HOLOLUtil.attr(element, 'data-holol-switch')
      );

      // Set view status on init
      if (element.checked && type === 'reverse') HOLOLUtil.addClass(targetContainer, 'd-none');
      else if (!element.checked && type === 'reverse')
        HOLOLUtil.removeClass(targetContainer, 'd-none');
      else if (element.checked && type !== 'reverse')
        HOLOLUtil.removeClass(targetContainer, 'd-none');
      else if (!element.checked && type !== 'reverse')
        HOLOLUtil.addClass(targetContainer, 'd-none');

      // Set view status on value change (checked or not)
      HOLOLUtil.addEvent(element, 'change', () => {
        if (element.checked && type === 'reverse') HOLOLUtil.addClass(targetContainer, 'd-none');
        else if (!element.checked && type === 'reverse')
          HOLOLUtil.removeClass(targetContainer, 'd-none');
        else if (element.checked && type !== 'reverse')
          HOLOLUtil.removeClass(targetContainer, 'd-none');
        else if (!element.checked && type !== 'reverse')
          HOLOLUtil.addClass(targetContainer, 'd-none');
      });
    });
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
      this.initBootstrapDropdownInResponsiveTable();
      this.initScrollSpy();
      this.initButtons();
      this.initCheck();
      this.initAutosize();
      this.initCountUp();
      this.initCountUpTabs();
      this.initSmoothScroll();
      this.initMainNavbar();
      this.initTopNavbar();
      this.initSearchbarInput();
      this.initNotificationTabs();
      this.initDropdownSelect();
      this.initDragScroll();
      this.initDaterangepicker();
      this.initOffcanvas();
      this.initCheckboxGroup();
      this.initTableSelectorActions();
      this.initResponsiveTableStickyColumns();
      this.initInputSwitch();
    },

    initHello: function (provider, version, link) {
      initHello(provider, version, link);
    },

    initPageLoader: function () {
      initPageLoader();
    },

    initScriptsLoader: function () {
      initScriptsLoader();
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

    initBootstrapDropdownInResponsiveTable: function () {
      initBootstrapDropdownInResponsiveTable();
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

    initSearchbarInput: function () {
      initSearchbarInput();
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
    initResponsiveTableStickyColumns: function () {
      initResponsiveTableStickyColumns();
    },
    initInputSwitch: function () {
      initInputSwitch();
    },
  };
})();

// On document ready
HOLOLUtil.onDOMContentLoaded(() => {
  HOLOLApp.initScriptsLoader();
});
