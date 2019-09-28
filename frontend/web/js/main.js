(function () {
  'use strict';

  // region NodeList.forEach
  if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  } // endregion
  // region Element.matches


  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  } // endregion
  // region Element.closest


  if (!Element.prototype.closest) {
    Element.prototype.closest = function (s) {
      var el = this;

      do {
        if (el.matches(s)) {
          return el;
        }

        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);

      return null;
    };
  } // endregion
  // region Array.from


  if (!Array.from) {
    Array.from = function () {
      var toStr = Object.prototype.toString;

      var isCallable = function isCallable(fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };

      var toInteger = function toInteger(value) {
        var number = Number(value);

        if (isNaN(number)) {
          return 0;
        }

        if (number === 0 || !isFinite(number)) {
          return number;
        }

        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };

      var maxSafeInteger = Math.pow(2, 53) - 1;

      var toLength = function toLength(value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      }; // The length property of the from method is 1.


      return function from(arrayLike
      /*, mapFn, thisArg */
      ) {
        // 1. Let C be the this value.
        var C = this; // 2. Let items be ToObject(arrayLike).

        var items = Object(arrayLike); // 3. ReturnIfAbrupt(items).

        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        } // 4. If mapfn is undefined, then let mapping be false.


        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;

        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          } // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.


          if (arguments.length > 2) {
            T = arguments[2];
          }
        } // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).


        var len = toLength(items.length); // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).

        var A = isCallable(C) ? Object(new C(len)) : new Array(len); // 16. Let k be 0.

        var k = 0; // 17. Repeat, while k < len… (also steps a - h)

        var kValue;

        while (k < len) {
          kValue = items[k];

          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }

          k += 1;
        } // 18. Let putStatus be Put(A, "length", len, true).


        A.length = len; // 20. Return A.

        return A;
      };
    }();
  } // endregion
  // region Placeholder support with .placeholder-shown


  function placeholderPolyfill() {
    this.classList[this.value ? 'remove' : 'add']('placeholder-shown');
  }

  document.querySelectorAll('[placeholder]').forEach(function (el) {
    el.classList[el.value ? 'remove' : 'add']('placeholder-shown');
    el.addEventListener('change', placeholderPolyfill);
    el.addEventListener('keyup', placeholderPolyfill);
  }); // endregion
  // region Array.prototype.includes
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes#Polyfill

  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
      value: function value(valueToFind, fromIndex) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);
        var len = o.length >>> 0;

        if (len === 0) {
          return false;
        }

        var n = fromIndex | 0;
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        function sameValueZero(x, y) {
          return x === y || typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y);
        }

        while (k < len) {
          if (sameValueZero(o[k], valueToFind)) {
            return true;
          }

          k++;
        }

        return false;
      }
    });
  } // endregion
  // region window.Event


  (function () {
    if (typeof window.CustomEvent === 'function') return false;

    function CustomEvent(event, params) {
      params = params || {
        bubbles: false,
        cancelable: false,
        detail: null
      };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    }

    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
  })(); // endregion
  // region Array.prototype.find


  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function value(predicate) {
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);
        var len = o.length >>> 0;

        if (typeof predicate !== 'function') {
          throw new TypeError('predicate must be a function');
        }

        var thisArg = arguments[1];
        var k = 0;

        while (k < len) {
          var kValue = o[k];

          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          }

          k++;
        }

        return undefined;
      },
      configurable: true,
      writable: true
    });
  } // endregion

  var utils = (function () {
    // region VH height for mobile browsers. css --> height: calc(var(--vh, 1vh) * 100);
    // First we get the viewport height and we multiply it by 1% to get a value for a vh unit
    var vh = window.innerHeight * 0.01; // Then we set the value in the --vh custom property to the root of the document

    document.documentElement.style.setProperty('--vh', "".concat(vh, "px")); // Recalculate on resize event

    window.addEventListener('resize', function () {
      vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', "".concat(vh, "px"));
    }); // endregion
    // region classesAddWithDelay/classesRemoveWithDelay (element, classInstant, classDelay, delay)

    function classesAddWithDelay(element, classInstant, classDelay, delay) {
      element.classList.add(classInstant);
      setTimeout(function () {
        element.classList.add(classDelay);
      }, delay);
    }

    function classesRemoveWithDelay(element, classInstant, classDelay, delay) {
      element.classList.remove(classInstant);
      setTimeout(function () {
        element.classList.remove(classDelay);
      }, delay);
    } // endregion
    // region XMLHttpRequest


    var timeout = 3000;
    var httpStatusCodes = {
      200: [true],
      400: [false, 'Неверный запрос'],
      401: [false, 'Необходима авторизация'],
      403: [false, 'Доступ запрещен'],
      404: [false, 'Запрашиваемые данные не найдены'],
      500: [false, 'Внутренняя ошибка сервера']
    };
    /* New XHR with predefined settings.
     * @param {Function} onLoad - callback function, invoked in case of successful request
     * @param {Function} onError - callback function, invoked in case of errors. */

    function createRequest(onLoad, onError) {
      var xhr = new XMLHttpRequest();

      function loadHandler() {
        if (httpStatusCodes[xhr.status] && httpStatusCodes[xhr.status][0]) {
          // no xhr.responseType = 'json' because of IE11
          onLoad(JSON.parse(xhr.responseText));
        } else if (!httpStatusCodes[xhr.status]) {
          onError("(HTTP status code: ".concat(xhr.status, ")"));
        } else {
          onError(httpStatusCodes[xhr.status][1]);
        }
      }

      xhr.addEventListener('load', loadHandler);
      xhr.addEventListener('error', function () {
        onError('xhr error');
      });
      xhr.addEventListener('timeout', function () {
        onError('xhr timeout');
      });
      return xhr;
    }
    /* Downloads data from the server */


    function load(onLoad, onError) {
      var xhr = createRequest(onLoad, onError);
      xhr.open('GET', window.utils.xhr.url); // timeout после open из-за IE11

      xhr.timeout = timeout;
      xhr.send();
    } // Sends data to the server.


    function save(data, onLoad, onError) {
      var xhr = createRequest(onLoad, onError);
      xhr.open('POST', window.utils.xhr.url);
      xhr.send(data);
    } // endregion


    window.utils = {
      classesAddWithDelay: classesAddWithDelay,
      classesRemoveWithDelay: classesRemoveWithDelay,
      xhr: {
        load: load,
        save: save,
        url: ''
      }
    };
  });

  var example = (function () {
    var msg = 'JS check!';
    console.log(msg);
  });

  var modal = (function () {
    var buttonOpen = document.querySelector('.modal-open');
    if (!buttonOpen) return;
    var body = document.querySelector('body');
    var modal = document.querySelector('.modal');
    if (!modal) return;
    var buttonClose = modal.querySelector('.modal__close');

    var onKeyDown = function onKeyDown(evt) {
      if (evt.keyCode === 27) {
        closeModal(evt);
      }
    };

    var closeModal = function closeModal(evt) {
      modal.classList.remove('show');
      body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKeyDown);
      evt.stopPropagation();
    };

    var openModal = function openModal() {
      modal.classList.add('show');
      body.classList.add('modal-open');
      document.addEventListener('keydown', onKeyDown);
    };

    buttonOpen.addEventListener('click', function () {
      openModal();
    });
    modal.addEventListener('click', function (evt) {
      if (evt.target === modal) {
        closeModal(evt);
      }
    });
    buttonClose.addEventListener('click', closeModal);
  });

  var dataTable = (function () {
    var editionTogglers = document.querySelectorAll('.js-toggle-edition');
    var filterTogglers = document.querySelectorAll('.js-filters-toggler');
    var filters = document.querySelector('.js-filters');

    var _loop = function _loop(i) {
      editionTogglers[i].addEventListener('click', function () {
        if (editionTogglers[i].closest('tr').classList.contains('selected')) {
          editionTogglers[i].closest('tr').classList.remove('selected');
        } else {
          editionTogglers[i].closest('tr').classList.add('selected');
        }
      });
    };

    for (var i = 0; i < editionTogglers.length; i++) {
      _loop(i);
    }

    for (var i = 0; i < filterTogglers.length; i++) {
      filterTogglers[i].addEventListener('click', function () {
        if (filters.classList.contains('show')) {
          filters.classList.remove('show');
        } else {
          filters.classList.add('show');
        }
      });
    }
  });

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var choices_min = createCommonjsModule(function (module, exports) {
    /*! choices.js v7.0.0 | (c) 2019 Josh Johnson | https://github.com/jshjohnson/Choices#readme */
    !function (e, t) {
       module.exports = t() ;
    }(window, function () {
      return function (e) {
        var t = {};

        function i(n) {
          if (t[n]) return t[n].exports;
          var o = t[n] = {
            i: n,
            l: !1,
            exports: {}
          };
          return e[n].call(o.exports, o, o.exports, i), o.l = !0, o.exports;
        }

        return i.m = e, i.c = t, i.d = function (e, t, n) {
          i.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: n
          });
        }, i.r = function (e) {
          "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
          }), Object.defineProperty(e, "__esModule", {
            value: !0
          });
        }, i.t = function (e, t) {
          if (1 & t && (e = i(e)), 8 & t) return e;
          if (4 & t && "object" == _typeof(e) && e && e.__esModule) return e;
          var n = Object.create(null);
          if (i.r(n), Object.defineProperty(n, "default", {
            enumerable: !0,
            value: e
          }), 2 & t && "string" != typeof e) for (var o in e) {
            i.d(n, o, function (t) {
              return e[t];
            }.bind(null, o));
          }
          return n;
        }, i.n = function (e) {
          var t = e && e.__esModule ? function () {
            return e.default;
          } : function () {
            return e;
          };
          return i.d(t, "a", t), t;
        }, i.o = function (e, t) {
          return Object.prototype.hasOwnProperty.call(e, t);
        }, i.p = "/public/assets/scripts/", i(i.s = 9);
      }([function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.diff = t.cloneObject = t.existsInArray = t.isIE11 = t.fetchFromObject = t.getWindowHeight = t.dispatchEvent = t.sortByScore = t.sortByAlpha = t.calcWidthOfInput = t.strToEl = t.sanitise = t.isScrolledIntoView = t.getAdjacentEl = t.findAncestorByAttrName = t.wrap = t.isElement = t.isType = t.getType = t.generateId = t.generateChars = t.getRandomNumber = void 0;

        var n = function n(e, t) {
          return Math.floor(Math.random() * (t - e) + e);
        };

        t.getRandomNumber = n;

        var o = function o(e) {
          for (var t = "", i = 0; i < e; i++) {
            t += n(0, 36).toString(36);
          }

          return t;
        };

        t.generateChars = o;

        t.generateId = function (e, t) {
          var i = e.id || e.name && "".concat(e.name, "-").concat(o(2)) || o(4);
          return i = i.replace(/(:|\.|\[|\]|,)/g, ""), i = "".concat(t, "-").concat(i);
        };

        var r = function r(e) {
          return Object.prototype.toString.call(e).slice(8, -1);
        };

        t.getType = r;

        var s = function s(e, t) {
          return null != t && r(t) === e;
        };

        t.isType = s;

        t.isElement = function (e) {
          return e instanceof Element;
        };

        t.wrap = function (e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : document.createElement("div");
          return e.nextSibling ? e.parentNode.insertBefore(t, e.nextSibling) : e.parentNode.appendChild(t), t.appendChild(e);
        };

        t.findAncestorByAttrName = function (e, t) {
          for (var i = e; i;) {
            if (i.hasAttribute(t)) return i;
            i = i.parentElement;
          }

          return null;
        };

        t.getAdjacentEl = function (e, t) {
          var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;

          if (e && t) {
            var n = e.parentNode.parentNode,
                o = Array.from(n.querySelectorAll(t)),
                r = o.indexOf(e);
            return o[r + (i > 0 ? 1 : -1)];
          }
        };

        t.isScrolledIntoView = function (e, t) {
          var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
          if (e) return i > 0 ? t.scrollTop + t.offsetHeight >= e.offsetTop + e.offsetHeight : e.offsetTop >= t.scrollTop;
        };

        var a = function a(e) {
          return s("String", e) ? e.replace(/&/g, "&amp;").replace(/>/g, "&rt;").replace(/</g, "&lt;").replace(/"/g, "&quot;") : e;
        };

        t.sanitise = a;
        var c,
            l = (c = document.createElement("div"), function (e) {
          var t = e.trim();
          c.innerHTML = t;

          for (var i = c.children[0]; c.firstChild;) {
            c.removeChild(c.firstChild);
          }

          return i;
        });
        t.strToEl = l;

        t.calcWidthOfInput = function (e, t) {
          var i = e.value || e.placeholder,
              n = e.offsetWidth;

          if (i) {
            var o = l("<span>".concat(a(i), "</span>"));

            if (o.style.position = "absolute", o.style.padding = "0", o.style.top = "-9999px", o.style.left = "-9999px", o.style.width = "auto", o.style.whiteSpace = "pre", document.body.contains(e) && window.getComputedStyle) {
              var r = window.getComputedStyle(e);
              r && (o.style.fontSize = r.fontSize, o.style.fontFamily = r.fontFamily, o.style.fontWeight = r.fontWeight, o.style.fontStyle = r.fontStyle, o.style.letterSpacing = r.letterSpacing, o.style.textTransform = r.textTransform, o.style.padding = r.padding);
            }

            document.body.appendChild(o), requestAnimationFrame(function () {
              i && o.offsetWidth !== e.offsetWidth && (n = o.offsetWidth + 4), document.body.removeChild(o), t.call(void 0, "".concat(n, "px"));
            });
          } else t.call(void 0, "".concat(n, "px"));
        };

        t.sortByAlpha = function (e, t) {
          var i = "".concat(e.label || e.value).toLowerCase(),
              n = "".concat(t.label || t.value).toLowerCase();
          return i < n ? -1 : i > n ? 1 : 0;
        };

        t.sortByScore = function (e, t) {
          return e.score - t.score;
        };

        t.dispatchEvent = function (e, t) {
          var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
              n = new CustomEvent(t, {
            detail: i,
            bubbles: !0,
            cancelable: !0
          });
          return e.dispatchEvent(n);
        };

        t.getWindowHeight = function () {
          var e = document.body,
              t = document.documentElement;
          return Math.max(e.scrollHeight, e.offsetHeight, t.clientHeight, t.scrollHeight, t.offsetHeight);
        };

        t.fetchFromObject = function e(t, i) {
          var n = i.indexOf(".");
          return n > -1 ? e(t[i.substring(0, n)], i.substr(n + 1)) : t[i];
        };

        t.isIE11 = function () {
          return !(!navigator.userAgent.match(/Trident/) || !navigator.userAgent.match(/rv[ :]11/));
        };

        t.existsInArray = function (e, t) {
          var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "value";
          return e.some(function (e) {
            return s("String", t) ? e[i] === t.trim() : e[i] === t;
          });
        };

        t.cloneObject = function (e) {
          return JSON.parse(JSON.stringify(e));
        };

        t.diff = function (e, t) {
          var i = Object.keys(e).sort(),
              n = Object.keys(t).sort();
          return i.filter(function (e) {
            return n.indexOf(e) < 0;
          });
        };
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.SCROLLING_SPEED = t.KEY_CODES = t.ACTION_TYPES = t.EVENTS = t.DEFAULT_CONFIG = t.DEFAULT_CLASSNAMES = void 0;
        var n = i(0),
            o = {
          containerOuter: "choices",
          containerInner: "choices__inner",
          input: "choices__input",
          inputCloned: "choices__input--cloned",
          list: "choices__list",
          listItems: "choices__list--multiple",
          listSingle: "choices__list--single",
          listDropdown: "choices__list--dropdown",
          item: "choices__item",
          itemSelectable: "choices__item--selectable",
          itemDisabled: "choices__item--disabled",
          itemChoice: "choices__item--choice",
          placeholder: "choices__placeholder",
          group: "choices__group",
          groupHeading: "choices__heading",
          button: "choices__button",
          activeState: "is-active",
          focusState: "is-focused",
          openState: "is-open",
          disabledState: "is-disabled",
          highlightedState: "is-highlighted",
          hiddenState: "is-hidden",
          flippedState: "is-flipped",
          loadingState: "is-loading",
          noResults: "has-no-results",
          noChoices: "has-no-choices"
        };
        t.DEFAULT_CLASSNAMES = o;
        var r = {
          items: [],
          choices: [],
          silent: !1,
          renderChoiceLimit: -1,
          maxItemCount: -1,
          addItems: !0,
          addItemFilterFn: null,
          removeItems: !0,
          removeItemButton: !1,
          editItems: !1,
          duplicateItemsAllowed: !0,
          delimiter: ",",
          paste: !0,
          searchEnabled: !0,
          searchChoices: !0,
          searchFloor: 1,
          searchResultLimit: 4,
          searchFields: ["label", "value"],
          position: "auto",
          resetScrollPosition: !0,
          shouldSort: !0,
          shouldSortItems: !1,
          sortFn: n.sortByAlpha,
          placeholder: !0,
          placeholderValue: null,
          searchPlaceholderValue: null,
          prependValue: null,
          appendValue: null,
          renderSelectedChoices: "auto",
          loadingText: "Loading...",
          noResultsText: "No results found",
          noChoicesText: "No choices to choose from",
          itemSelectText: "Press to select",
          uniqueItemText: "Only unique values can be added",
          customAddItemText: "Only values matching specific conditions can be added",
          addItemText: function addItemText(e) {
            return 'Press Enter to add <b>"'.concat((0, n.sanitise)(e), '"</b>');
          },
          maxItemText: function maxItemText(e) {
            return "Only ".concat(e, " values can be added");
          },
          itemComparer: function itemComparer(e, t) {
            return e === t;
          },
          fuseOptions: {
            includeScore: !0
          },
          callbackOnInit: null,
          callbackOnCreateTemplates: null,
          classNames: o
        };
        t.DEFAULT_CONFIG = r;
        t.EVENTS = {
          showDropdown: "showDropdown",
          hideDropdown: "hideDropdown",
          change: "change",
          choice: "choice",
          search: "search",
          addItem: "addItem",
          removeItem: "removeItem",
          highlightItem: "highlightItem",
          highlightChoice: "highlightChoice"
        };
        t.ACTION_TYPES = {
          ADD_CHOICE: "ADD_CHOICE",
          FILTER_CHOICES: "FILTER_CHOICES",
          ACTIVATE_CHOICES: "ACTIVATE_CHOICES",
          CLEAR_CHOICES: "CLEAR_CHOICES",
          ADD_GROUP: "ADD_GROUP",
          ADD_ITEM: "ADD_ITEM",
          REMOVE_ITEM: "REMOVE_ITEM",
          HIGHLIGHT_ITEM: "HIGHLIGHT_ITEM",
          CLEAR_ALL: "CLEAR_ALL"
        };
        t.KEY_CODES = {
          BACK_KEY: 46,
          DELETE_KEY: 8,
          ENTER_KEY: 13,
          A_KEY: 65,
          ESC_KEY: 27,
          UP_KEY: 38,
          DOWN_KEY: 40,
          PAGE_UP_KEY: 33,
          PAGE_DOWN_KEY: 34
        };
        t.SCROLLING_SPEED = 4;
      }, function (e, t, i) {

        (function (e, n) {
          var o,
              r = i(7);
          o = "undefined" != typeof self ? self : "undefined" != typeof window ? window : void 0 !== e ? e : n;
          var s = Object(r.a)(o);
          t.a = s;
        }).call(this, i(3), i(14)(e));
      }, function (e, t) {
        var i;

        i = function () {
          return this;
        }();

        try {
          i = i || new Function("return this")();
        } catch (e) {
          "object" == (typeof window === "undefined" ? "undefined" : _typeof(window)) && (i = window);
        }

        e.exports = i;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = void 0;
        var n = i(0);

        function o(e, t) {
          for (var i = 0; i < t.length; i++) {
            var n = t[i];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
          }
        }

        var r = function () {
          function e(t) {
            var i = t.element,
                o = t.classNames;
            if (function (e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e), Object.assign(this, {
              element: i,
              classNames: o
            }), !(0, n.isElement)(i)) throw new TypeError("Invalid element passed");
            this.isDisabled = !1;
          }

          var t, i;
          return t = e, (i = [{
            key: "conceal",
            value: function value() {
              this.element.classList.add(this.classNames.input), this.element.classList.add(this.classNames.hiddenState), this.element.tabIndex = "-1";
              var e = this.element.getAttribute("style");
              e && this.element.setAttribute("data-choice-orig-style", e), this.element.setAttribute("aria-hidden", "true"), this.element.setAttribute("data-choice", "active");
            }
          }, {
            key: "reveal",
            value: function value() {
              this.element.classList.remove(this.classNames.input), this.element.classList.remove(this.classNames.hiddenState), this.element.removeAttribute("tabindex");
              var e = this.element.getAttribute("data-choice-orig-style");
              e ? (this.element.removeAttribute("data-choice-orig-style"), this.element.setAttribute("style", e)) : this.element.removeAttribute("style"), this.element.removeAttribute("aria-hidden"), this.element.removeAttribute("data-choice"), this.element.value = this.element.value;
            }
          }, {
            key: "enable",
            value: function value() {
              this.element.removeAttribute("disabled"), this.element.disabled = !1, this.isDisabled = !1;
            }
          }, {
            key: "disable",
            value: function value() {
              this.element.setAttribute("disabled", ""), this.element.disabled = !0, this.isDisabled = !0;
            }
          }, {
            key: "triggerEvent",
            value: function value(e, t) {
              (0, n.dispatchEvent)(this.element, e, t);
            }
          }, {
            key: "value",
            get: function get() {
              return this.element.value;
            }
          }]) && o(t.prototype, i), e;
        }();

        t.default = r;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = t.TEMPLATES = void 0;
        var n,
            o = (n = i(27)) && n.__esModule ? n : {
          default: n
        },
            r = i(0);

        function s(e, t, i) {
          return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : e[t] = i, e;
        }

        var a = {
          containerOuter: function containerOuter(e, t, i, n, o, s) {
            var a = n ? 'tabindex="0"' : "",
                c = i ? 'role="listbox"' : "",
                l = "";
            return i && o && (c = 'role="combobox"', l = 'aria-autocomplete="list"'), (0, r.strToEl)('\n      <div\n        class="'.concat(e.containerOuter, '"\n        data-type="').concat(s, '"\n        ').concat(c, "\n        ").concat(a, "\n        ").concat(l, '\n        aria-haspopup="true"\n        aria-expanded="false"\n        dir="').concat(t, '"\n        >\n      </div>\n    '));
          },
          containerInner: function containerInner(e) {
            return (0, r.strToEl)('\n      <div class="'.concat(e.containerInner, '"></div>\n    '));
          },
          itemList: function itemList(e, t) {
            var i,
                n = (0, o.default)(e.list, (s(i = {}, e.listSingle, t), s(i, e.listItems, !t), i));
            return (0, r.strToEl)('\n      <div class="'.concat(n, '"></div>\n    '));
          },
          placeholder: function placeholder(e, t) {
            return (0, r.strToEl)('\n      <div class="'.concat(e.placeholder, '">\n        ').concat(t, "\n      </div>\n    "));
          },
          item: function item(e, t, i) {
            var n,
                a,
                c = t.active ? 'aria-selected="true"' : "",
                l = t.disabled ? 'aria-disabled="true"' : "",
                u = (0, o.default)(e.item, (s(n = {}, e.highlightedState, t.highlighted), s(n, e.itemSelectable, !t.highlighted), s(n, e.placeholder, t.placeholder), n));
            return i ? (u = (0, o.default)(e.item, (s(a = {}, e.highlightedState, t.highlighted), s(a, e.itemSelectable, !t.disabled), s(a, e.placeholder, t.placeholder), a)), (0, r.strToEl)('\n        <div\n          class="'.concat(u, '"\n          data-item\n          data-id="').concat(t.id, '"\n          data-value="').concat(t.value, "\"\n          data-custom-properties='").concat(t.customProperties, "'\n          data-deletable\n          ").concat(c, "\n          ").concat(l, "\n          >\n          ").concat(t.label, '\x3c!--\n       --\x3e<button\n            type="button"\n            class="').concat(e.button, '"\n            data-button\n            aria-label="Remove item: \'').concat(t.value, "'\"\n            >\n            Remove item\n          </button>\n        </div>\n      "))) : (0, r.strToEl)('\n      <div\n        class="'.concat(u, '"\n        data-item\n        data-id="').concat(t.id, '"\n        data-value="').concat(t.value, '"\n        ').concat(c, "\n        ").concat(l, "\n        >\n        ").concat(t.label, "\n      </div>\n    "));
          },
          choiceList: function choiceList(e, t) {
            var i = t ? "" : 'aria-multiselectable="true"';
            return (0, r.strToEl)('\n      <div\n        class="'.concat(e.list, '"\n        dir="ltr"\n        role="listbox"\n        ').concat(i, "\n        >\n      </div>\n    "));
          },
          choiceGroup: function choiceGroup(e, t) {
            var i = t.disabled ? 'aria-disabled="true"' : "",
                n = (0, o.default)(e.group, s({}, e.itemDisabled, t.disabled));
            return (0, r.strToEl)('\n      <div\n        class="'.concat(n, '"\n        data-group\n        data-id="').concat(t.id, '"\n        data-value="').concat(t.value, '"\n        role="group"\n        ').concat(i, '\n        >\n        <div class="').concat(e.groupHeading, '">').concat(t.value, "</div>\n      </div>\n    "));
          },
          choice: function choice(e, t, i) {
            var n,
                a = t.groupId > 0 ? 'role="treeitem"' : 'role="option"',
                c = (0, o.default)(e.item, e.itemChoice, (s(n = {}, e.itemDisabled, t.disabled), s(n, e.itemSelectable, !t.disabled), s(n, e.placeholder, t.placeholder), n));
            return (0, r.strToEl)('\n      <div\n        class="'.concat(c, '"\n        data-select-text="').concat(i, '"\n        data-choice\n        data-id="').concat(t.id, '"\n        data-value="').concat(t.value, '"\n        ').concat(t.disabled ? 'data-choice-disabled aria-disabled="true"' : "data-choice-selectable", '\n        id="').concat(t.elementId, '"\n        ').concat(a, "\n        >\n        ").concat(t.label, "\n      </div>\n    "));
          },
          input: function input(e) {
            var t = (0, o.default)(e.input, e.inputCloned);
            return (0, r.strToEl)('\n      <input\n        type="text"\n        class="'.concat(t, '"\n        autocomplete="off"\n        autocapitalize="off"\n        spellcheck="false"\n        role="textbox"\n        aria-autocomplete="list"\n        >\n    '));
          },
          dropdown: function dropdown(e) {
            var t = (0, o.default)(e.list, e.listDropdown);
            return (0, r.strToEl)('\n      <div\n        class="'.concat(t, '"\n        aria-expanded="false"\n        >\n      </div>\n    '));
          },
          notice: function notice(e, t) {
            var i,
                n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "",
                a = (0, o.default)(e.item, e.itemChoice, (s(i = {}, e.noResults, "no-results" === n), s(i, e.noChoices, "no-choices" === n), i));
            return (0, r.strToEl)('\n      <div class="'.concat(a, '">\n        ').concat(t, "\n      </div>\n    "));
          },
          option: function option(e) {
            return (0, r.strToEl)('\n      <option value="'.concat(e.value, '" ').concat(e.active ? "selected" : "", " ").concat(e.disabled ? "disabled" : "", " ").concat(e.customProperties ? "data-custom-properties=".concat(e.customProperties) : "", ">").concat(e.label, "</option>\n    "));
          }
        };
        t.TEMPLATES = a;
        var c = a;
        t.default = c;
      }, function (e, t, i) {

        i.r(t);
        var n = i(8),
            o = "object" == (typeof self === "undefined" ? "undefined" : _typeof(self)) && self && self.Object === Object && self,
            r = (n.a || o || Function("return this")()).Symbol,
            s = Object.prototype,
            a = s.hasOwnProperty,
            c = s.toString,
            l = r ? r.toStringTag : void 0;

        var u = function u(e) {
          var t = a.call(e, l),
              i = e[l];

          try {
            e[l] = void 0;
            var n = !0;
          } catch (e) {}

          var o = c.call(e);
          return n && (t ? e[l] = i : delete e[l]), o;
        },
            h = Object.prototype.toString;

        var d = function d(e) {
          return h.call(e);
        },
            f = "[object Null]",
            p = "[object Undefined]",
            v = r ? r.toStringTag : void 0;

        var m = function m(e) {
          return null == e ? void 0 === e ? p : f : v && v in Object(e) ? u(e) : d(e);
        };

        var g = function (e, t) {
          return function (i) {
            return e(t(i));
          };
        }(Object.getPrototypeOf, Object);

        var _ = function _(e) {
          return null != e && "object" == _typeof(e);
        },
            y = "[object Object]",
            b = Function.prototype,
            E = Object.prototype,
            S = b.toString,
            I = E.hasOwnProperty,
            O = S.call(Object);

        var C = function C(e) {
          if (!_(e) || m(e) != y) return !1;
          var t = g(e);
          if (null === t) return !0;
          var i = I.call(t, "constructor") && t.constructor;
          return "function" == typeof i && i instanceof i && S.call(i) == O;
        },
            T = i(2),
            w = {
          INIT: "@@redux/INIT"
        };

        function k(e, t, i) {
          var n;

          if ("function" == typeof t && void 0 === i && (i = t, t = void 0), void 0 !== i) {
            if ("function" != typeof i) throw new Error("Expected the enhancer to be a function.");
            return i(k)(e, t);
          }

          if ("function" != typeof e) throw new Error("Expected the reducer to be a function.");
          var o = e,
              r = t,
              s = [],
              a = s,
              c = !1;

          function l() {
            a === s && (a = s.slice());
          }

          function u() {
            return r;
          }

          function h(e) {
            if ("function" != typeof e) throw new Error("Expected listener to be a function.");
            var t = !0;
            return l(), a.push(e), function () {
              if (t) {
                t = !1, l();
                var i = a.indexOf(e);
                a.splice(i, 1);
              }
            };
          }

          function d(e) {
            if (!C(e)) throw new Error("Actions must be plain objects. Use custom middleware for async actions.");
            if (void 0 === e.type) throw new Error('Actions may not have an undefined "type" property. Have you misspelled a constant?');
            if (c) throw new Error("Reducers may not dispatch actions.");

            try {
              c = !0, r = o(r, e);
            } finally {
              c = !1;
            }

            for (var t = s = a, i = 0; i < t.length; i++) {
              (0, t[i])();
            }

            return e;
          }

          return d({
            type: w.INIT
          }), (n = {
            dispatch: d,
            subscribe: h,
            getState: u,
            replaceReducer: function replaceReducer(e) {
              if ("function" != typeof e) throw new Error("Expected the nextReducer to be a function.");
              o = e, d({
                type: w.INIT
              });
            }
          })[T.a] = function () {
            var e,
                t = h;
            return (e = {
              subscribe: function subscribe(e) {
                if ("object" != _typeof(e)) throw new TypeError("Expected the observer to be an object.");

                function i() {
                  e.next && e.next(u());
                }

                return i(), {
                  unsubscribe: t(i)
                };
              }
            })[T.a] = function () {
              return this;
            }, e;
          }, n;
        }

        function A(e, t) {
          var i = t && t.type;
          return "Given action " + (i && '"' + i.toString() + '"' || "an action") + ', reducer "' + e + '" returned undefined. To ignore an action, you must explicitly return the previous state. If you want this reducer to hold no value, you can return null instead of undefined.';
        }

        function L(e) {
          for (var t = Object.keys(e), i = {}, n = 0; n < t.length; n++) {
            var o = t[n];
            "function" == typeof e[o] && (i[o] = e[o]);
          }

          var r = Object.keys(i);
          var s = void 0;

          try {
            !function (e) {
              Object.keys(e).forEach(function (t) {
                var i = e[t];
                if (void 0 === i(void 0, {
                  type: w.INIT
                })) throw new Error('Reducer "' + t + "\" returned undefined during initialization. If the state passed to the reducer is undefined, you must explicitly return the initial state. The initial state may not be undefined. If you don't want to set a value for this reducer, you can use null instead of undefined.");
                if (void 0 === i(void 0, {
                  type: "@@redux/PROBE_UNKNOWN_ACTION_" + Math.random().toString(36).substring(7).split("").join(".")
                })) throw new Error('Reducer "' + t + "\" returned undefined when probed with a random type. Don't try to handle " + w.INIT + ' or other actions in "redux/*" namespace. They are considered private. Instead, you must return the current state for any unknown actions, unless it is undefined, in which case you must return the initial state, regardless of the action type. The initial state may not be undefined, but can be null.');
              });
            }(i);
          } catch (e) {
            s = e;
          }

          return function () {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
                t = arguments[1];
            if (s) throw s;

            for (var n = !1, o = {}, a = 0; a < r.length; a++) {
              var c = r[a],
                  l = i[c],
                  u = e[c],
                  h = l(u, t);

              if (void 0 === h) {
                var d = A(c, t);
                throw new Error(d);
              }

              o[c] = h, n = n || h !== u;
            }

            return n ? o : e;
          };
        }

        function x(e, t) {
          return function () {
            return t(e.apply(void 0, arguments));
          };
        }

        function P(e, t) {
          if ("function" == typeof e) return x(e, t);
          if ("object" != _typeof(e) || null === e) throw new Error("bindActionCreators expected an object or a function, instead received " + (null === e ? "null" : _typeof(e)) + '. Did you write "import ActionCreators from" instead of "import * as ActionCreators from"?');

          for (var i = Object.keys(e), n = {}, o = 0; o < i.length; o++) {
            var r = i[o],
                s = e[r];
            "function" == typeof s && (n[r] = x(s, t));
          }

          return n;
        }

        function D() {
          for (var e = arguments.length, t = Array(e), i = 0; i < e; i++) {
            t[i] = arguments[i];
          }

          return 0 === t.length ? function (e) {
            return e;
          } : 1 === t.length ? t[0] : t.reduce(function (e, t) {
            return function () {
              return e(t.apply(void 0, arguments));
            };
          });
        }

        var j = Object.assign || function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var i = arguments[t];

            for (var n in i) {
              Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n]);
            }
          }

          return e;
        };

        function M() {
          for (var e = arguments.length, t = Array(e), i = 0; i < e; i++) {
            t[i] = arguments[i];
          }

          return function (e) {
            return function (i, n, o) {
              var r,
                  s = e(i, n, o),
                  a = s.dispatch,
                  c = {
                getState: s.getState,
                dispatch: function dispatch(e) {
                  return a(e);
                }
              };
              return r = t.map(function (e) {
                return e(c);
              }), a = D.apply(void 0, r)(s.dispatch), j({}, s, {
                dispatch: a
              });
            };
          };
        }

        i.d(t, "createStore", function () {
          return k;
        }), i.d(t, "combineReducers", function () {
          return L;
        }), i.d(t, "bindActionCreators", function () {
          return P;
        }), i.d(t, "applyMiddleware", function () {
          return M;
        }), i.d(t, "compose", function () {
          return D;
        });
      }, function (e, t, i) {

        function n(e) {
          var t,
              i = e.Symbol;
          return "function" == typeof i ? i.observable ? t = i.observable : (t = i("observable"), i.observable = t) : t = "@@observable", t;
        }

        i.d(t, "a", function () {
          return n;
        });
      }, function (e, t, i) {

        (function (e) {
          var i = "object" == _typeof(e) && e && e.Object === Object && e;
          t.a = i;
        }).call(this, i(3));
      }, function (e, t, i) {
        e.exports = i(10);
      }, function (e, t, i) {

        var n = v(i(11)),
            o = v(i(12)),
            r = v(i(13)),
            s = i(20),
            a = i(1),
            c = i(5),
            l = i(28),
            u = i(29),
            h = i(30),
            d = i(31),
            f = i(32),
            p = i(0);

        function v(e) {
          return e && e.__esModule ? e : {
            default: e
          };
        }

        function m(e, t, i) {
          return t in e ? Object.defineProperty(e, t, {
            value: i,
            enumerable: !0,
            configurable: !0,
            writable: !0
          }) : e[t] = i, e;
        }

        function g(e, t) {
          for (var i = 0; i < t.length; i++) {
            var n = t[i];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
          }
        }

        var _ = function () {
          function e() {
            var t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "[data-choice]",
                i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};

            if (function (e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e), (0, p.isType)("String", t)) {
              var n = Array.from(document.querySelectorAll(t));
              if (n.length > 1) return this._generateInstances(n, i);
            }

            this.config = o.default.all([a.DEFAULT_CONFIG, e.userDefaults, i], {
              arrayMerge: function arrayMerge(e, t) {
                return [].concat(t);
              }
            });
            var c = (0, p.diff)(this.config, a.DEFAULT_CONFIG);
            c.length && console.warn("Unknown config option(s) passed", c.join(", ")), ["auto", "always"].includes(this.config.renderSelectedChoices) || (this.config.renderSelectedChoices = "auto");
            var l = (0, p.isType)("String", t) ? document.querySelector(t) : t;
            return l ? (this._isTextElement = "text" === l.type, this._isSelectOneElement = "select-one" === l.type, this._isSelectMultipleElement = "select-multiple" === l.type, this._isSelectElement = this._isSelectOneElement || this._isSelectMultipleElement, this._isTextElement ? this.passedElement = new s.WrappedInput({
              element: l,
              classNames: this.config.classNames,
              delimiter: this.config.delimiter
            }) : this._isSelectElement && (this.passedElement = new s.WrappedSelect({
              element: l,
              classNames: this.config.classNames
            })), this.passedElement ? (!0 === this.config.shouldSortItems && this._isSelectOneElement && !this.config.silent && console.warn("shouldSortElements: Type of passed element is 'select-one', falling back to false."), this.initialised = !1, this._store = new r.default(this.render), this._initialState = {}, this._currentState = {}, this._prevState = {}, this._currentValue = "", this._canSearch = this.config.searchEnabled, this._isScrollingOnIe = !1, this._highlightPosition = 0, this._wasTap = !0, this._placeholderValue = this._generatePlaceholderValue(), this._baseId = (0, p.generateId)(this.passedElement.element, "choices-"), this._direction = this.passedElement.element.getAttribute("dir") || "ltr", this._idNames = {
              itemChoice: "item-choice"
            }, this._presetChoices = this.config.choices, this._presetItems = this.config.items, this.passedElement.value && (this._presetItems = this._presetItems.concat(this.passedElement.value.split(this.config.delimiter))), this._render = this._render.bind(this), this._onFocus = this._onFocus.bind(this), this._onBlur = this._onBlur.bind(this), this._onKeyUp = this._onKeyUp.bind(this), this._onKeyDown = this._onKeyDown.bind(this), this._onClick = this._onClick.bind(this), this._onTouchMove = this._onTouchMove.bind(this), this._onTouchEnd = this._onTouchEnd.bind(this), this._onMouseDown = this._onMouseDown.bind(this), this._onMouseOver = this._onMouseOver.bind(this), this._onFormReset = this._onFormReset.bind(this), this._onAKey = this._onAKey.bind(this), this._onEnterKey = this._onEnterKey.bind(this), this._onEscapeKey = this._onEscapeKey.bind(this), this._onDirectionKey = this._onDirectionKey.bind(this), this._onDeleteKey = this._onDeleteKey.bind(this), "active" === this.passedElement.element.getAttribute("data-choice") && console.warn("Trying to initialise Choices on element already initialised"), void this.init()) : console.error("Passed element was of an invalid type")) : console.error("Could not find passed element or passed element was of an invalid type");
          }

          var t, i;
          return t = e, (i = [{
            key: "init",
            value: function value() {
              if (!this.initialised) {
                this._createTemplates(), this._createElements(), this._createStructure(), this._initialState = (0, p.cloneObject)(this._store.state), this._store.subscribe(this._render), this._render(), this._addEventListeners(), (!this.config.addItems || this.passedElement.element.hasAttribute("disabled")) && this.disable(), this.initialised = !0;
                var e = this.config.callbackOnInit;
                e && (0, p.isType)("Function", e) && e.call(this);
              }
            }
          }, {
            key: "destroy",
            value: function value() {
              this.initialised && (this._removeEventListeners(), this.passedElement.reveal(), this.containerOuter.unwrap(this.passedElement.element), this._isSelectElement && (this.passedElement.options = this._presetChoices), this.clearStore(), this.config.templates = null, this.initialised = !1);
            }
          }, {
            key: "enable",
            value: function value() {
              return this.passedElement.isDisabled && this.passedElement.enable(), this.containerOuter.isDisabled && (this._addEventListeners(), this.input.enable(), this.containerOuter.enable()), this;
            }
          }, {
            key: "disable",
            value: function value() {
              return this.passedElement.isDisabled || this.passedElement.disable(), this.containerOuter.isDisabled || (this._removeEventListeners(), this.input.disable(), this.containerOuter.disable()), this;
            }
          }, {
            key: "highlightItem",
            value: function value(e) {
              var t = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
              if (!e) return this;
              var i = e.id,
                  n = e.groupId,
                  o = void 0 === n ? -1 : n,
                  r = e.value,
                  s = void 0 === r ? "" : r,
                  c = e.label,
                  l = void 0 === c ? "" : c,
                  h = o >= 0 ? this._store.getGroupById(o) : null;
              return this._store.dispatch((0, u.highlightItem)(i, !0)), t && this.passedElement.triggerEvent(a.EVENTS.highlightItem, {
                id: i,
                value: s,
                label: l,
                groupValue: h && h.value ? h.value : null
              }), this;
            }
          }, {
            key: "unhighlightItem",
            value: function value(e) {
              if (!e) return this;
              var t = e.id,
                  i = e.groupId,
                  n = void 0 === i ? -1 : i,
                  o = e.value,
                  r = void 0 === o ? "" : o,
                  s = e.label,
                  c = void 0 === s ? "" : s,
                  l = n >= 0 ? this._store.getGroupById(n) : null;
              return this._store.dispatch((0, u.highlightItem)(t, !1)), this.passedElement.triggerEvent(a.EVENTS.highlightItem, {
                id: t,
                value: r,
                label: c,
                groupValue: l && l.value ? l.value : null
              }), this;
            }
          }, {
            key: "highlightAll",
            value: function value() {
              var e = this;
              return this._store.items.forEach(function (t) {
                return e.highlightItem(t);
              }), this;
            }
          }, {
            key: "unhighlightAll",
            value: function value() {
              var e = this;
              return this._store.items.forEach(function (t) {
                return e.unhighlightItem(t);
              }), this;
            }
          }, {
            key: "removeActiveItemsByValue",
            value: function value(e) {
              var t = this;
              return this._store.activeItems.filter(function (t) {
                return t.value === e;
              }).forEach(function (e) {
                return t._removeItem(e);
              }), this;
            }
          }, {
            key: "removeActiveItems",
            value: function value(e) {
              var t = this;
              return this._store.activeItems.filter(function (t) {
                return t.id !== e;
              }).forEach(function (e) {
                return t._removeItem(e);
              }), this;
            }
          }, {
            key: "removeHighlightedItems",
            value: function value() {
              var e = this,
                  t = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
              return this._store.highlightedActiveItems.forEach(function (i) {
                e._removeItem(i), t && e._triggerChange(i.value);
              }), this;
            }
          }, {
            key: "showDropdown",
            value: function value(e) {
              var t = this;
              return this.dropdown.isActive ? this : (requestAnimationFrame(function () {
                t.dropdown.show(), t.containerOuter.open(t.dropdown.distanceFromTopWindow()), !e && t._canSearch && t.input.focus(), t.passedElement.triggerEvent(a.EVENTS.showDropdown, {});
              }), this);
            }
          }, {
            key: "hideDropdown",
            value: function value(e) {
              var t = this;
              return this.dropdown.isActive ? (requestAnimationFrame(function () {
                t.dropdown.hide(), t.containerOuter.close(), !e && t._canSearch && (t.input.removeActiveDescendant(), t.input.blur()), t.passedElement.triggerEvent(a.EVENTS.hideDropdown, {});
              }), this) : this;
            }
          }, {
            key: "getValue",
            value: function value() {
              var e = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
                  t = this._store.activeItems.reduce(function (t, i) {
                var n = e ? i.value : i;
                return t.push(n), t;
              }, []);

              return this._isSelectOneElement ? t[0] : t;
            }
          }, {
            key: "setValue",
            value: function value(e) {
              var t = this;
              return this.initialised ? ([].concat(e).forEach(function (e) {
                return t._setChoiceOrItem(e);
              }), this) : this;
            }
          }, {
            key: "setChoiceByValue",
            value: function value(e) {
              var t = this;
              return !this.initialised || this._isTextElement ? this : (((0, p.isType)("Array", e) ? e : [e]).forEach(function (e) {
                return t._findAndSelectChoiceByValue(e);
              }), this);
            }
          }, {
            key: "setChoices",
            value: function value() {
              var e = this,
                  t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
                  i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
                  n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "",
                  o = arguments.length > 3 && void 0 !== arguments[3] && arguments[3];
              if (!this._isSelectElement || !i) return this;
              o && this.clearChoices(), this.containerOuter.removeLoadingState();
              return this._setLoading(!0), t.forEach(function (t) {
                t.choices ? e._addGroup({
                  group: t,
                  id: t.id || null,
                  valueKey: i,
                  labelKey: n
                }) : e._addChoice({
                  value: t[i],
                  label: t[n],
                  isSelected: t.selected,
                  isDisabled: t.disabled,
                  customProperties: t.customProperties,
                  placeholder: t.placeholder
                });
              }), this._setLoading(!1), this;
            }
          }, {
            key: "clearChoices",
            value: function value() {
              this._store.dispatch((0, l.clearChoices)());
            }
          }, {
            key: "clearStore",
            value: function value() {
              return this._store.dispatch((0, d.clearAll)()), this;
            }
          }, {
            key: "clearInput",
            value: function value() {
              var e = !this._isSelectOneElement;
              return this.input.clear(e), !this._isTextElement && this._canSearch && (this._isSearching = !1, this._store.dispatch((0, l.activateChoices)(!0))), this;
            }
          }, {
            key: "ajax",
            value: function value(e) {
              var t = this;
              return this.initialised && this._isSelectElement && e ? (requestAnimationFrame(function () {
                return t._handleLoadingState(!0);
              }), e(this._ajaxCallback()), this) : this;
            }
          }, {
            key: "_render",
            value: function value() {
              if (!this._store.isLoading()) {
                this._currentState = this._store.state;
                var e = this._currentState.choices !== this._prevState.choices || this._currentState.groups !== this._prevState.groups || this._currentState.items !== this._prevState.items,
                    t = this._isSelectElement,
                    i = this._currentState.items !== this._prevState.items;
                e && (t && this._renderChoices(), i && this._renderItems(), this._prevState = this._currentState);
              }
            }
          }, {
            key: "_renderChoices",
            value: function value() {
              var e = this,
                  t = this._store,
                  i = t.activeGroups,
                  n = t.activeChoices,
                  o = document.createDocumentFragment();

              if (this.choiceList.clear(), this.config.resetScrollPosition && requestAnimationFrame(function () {
                return e.choiceList.scrollToTop();
              }), i.length >= 1 && !this._isSearching) {
                var r = n.filter(function (e) {
                  return !0 === e.placeholder && -1 === e.groupId;
                });
                r.length >= 1 && (o = this._createChoicesFragment(r, o)), o = this._createGroupsFragment(i, n, o);
              } else n.length >= 1 && (o = this._createChoicesFragment(n, o));

              if (o.childNodes && o.childNodes.length > 0) {
                var s = this._store.activeItems,
                    a = this._canAddItem(s, this.input.value);

                a.response ? (this.choiceList.append(o), this._highlightChoice()) : this.choiceList.append(this._getTemplate("notice", a.notice));
              } else {
                var c, l;
                this._isSearching ? (l = (0, p.isType)("Function", this.config.noResultsText) ? this.config.noResultsText() : this.config.noResultsText, c = this._getTemplate("notice", l, "no-results")) : (l = (0, p.isType)("Function", this.config.noChoicesText) ? this.config.noChoicesText() : this.config.noChoicesText, c = this._getTemplate("notice", l, "no-choices")), this.choiceList.append(c);
              }
            }
          }, {
            key: "_renderItems",
            value: function value() {
              var e = this._store.activeItems || [];
              this.itemList.clear();

              var t = this._createItemsFragment(e);

              t.childNodes && this.itemList.append(t);
            }
          }, {
            key: "_createGroupsFragment",
            value: function value(e, t, i) {
              var n = this,
                  o = i || document.createDocumentFragment();
              return this.config.shouldSort && e.sort(this.config.sortFn), e.forEach(function (e) {
                var i = function (e) {
                  return t.filter(function (t) {
                    return n._isSelectOneElement ? t.groupId === e.id : t.groupId === e.id && ("always" === n.config.renderSelectedChoices || !t.selected);
                  });
                }(e);

                if (i.length >= 1) {
                  var r = n._getTemplate("choiceGroup", e);

                  o.appendChild(r), n._createChoicesFragment(i, o, !0);
                }
              }), o;
            }
          }, {
            key: "_createChoicesFragment",
            value: function value(e, t) {
              var i = this,
                  n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2],
                  o = t || document.createDocumentFragment(),
                  r = this.config,
                  s = r.renderSelectedChoices,
                  a = r.searchResultLimit,
                  c = r.renderChoiceLimit,
                  l = this._isSearching ? p.sortByScore : this.config.sortFn,
                  u = function u(e) {
                if ("auto" !== s || i._isSelectOneElement || !e.selected) {
                  var t = i._getTemplate("choice", e, i.config.itemSelectText);

                  o.appendChild(t);
                }
              },
                  h = e;

              "auto" !== s || this._isSelectOneElement || (h = e.filter(function (e) {
                return !e.selected;
              }));
              var d = h.reduce(function (e, t) {
                return t.placeholder ? e.placeholderChoices.push(t) : e.normalChoices.push(t), e;
              }, {
                placeholderChoices: [],
                normalChoices: []
              }),
                  f = d.placeholderChoices,
                  v = d.normalChoices;
              (this.config.shouldSort || this._isSearching) && v.sort(l);
              var m = h.length,
                  g = [].concat(f, v);
              this._isSearching ? m = a : c > 0 && !n && (m = c);

              for (var _ = 0; _ < m; _ += 1) {
                g[_] && u(g[_]);
              }

              return o;
            }
          }, {
            key: "_createItemsFragment",
            value: function value(e) {
              var t = this,
                  i = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : null,
                  n = this.config,
                  o = n.shouldSortItems,
                  r = n.sortFn,
                  s = n.removeItemButton,
                  a = i || document.createDocumentFragment();
              o && !this._isSelectOneElement && e.sort(r), this._isTextElement ? this.passedElement.value = e : this.passedElement.options = e;
              return e.forEach(function (e) {
                return function (e) {
                  var i = t._getTemplate("item", e, s);

                  a.appendChild(i);
                }(e);
              }), a;
            }
          }, {
            key: "_triggerChange",
            value: function value(e) {
              null != e && this.passedElement.triggerEvent(a.EVENTS.change, {
                value: e
              });
            }
          }, {
            key: "_selectPlaceholderChoice",
            value: function value() {
              var e = this._store.placeholderChoice;
              e && (this._addItem({
                value: e.value,
                label: e.label,
                choiceId: e.id,
                groupId: e.groupId,
                placeholder: e.placeholder
              }), this._triggerChange(e.value));
            }
          }, {
            key: "_handleButtonAction",
            value: function value(e, t) {
              if (e && t && this.config.removeItems && this.config.removeItemButton) {
                var i = t.parentNode.getAttribute("data-id"),
                    n = e.find(function (e) {
                  return e.id === parseInt(i, 10);
                });
                this._removeItem(n), this._triggerChange(n.value), this._isSelectOneElement && this._selectPlaceholderChoice();
              }
            }
          }, {
            key: "_handleItemAction",
            value: function value(e, t) {
              var i = this,
                  n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];

              if (e && t && this.config.removeItems && !this._isSelectOneElement) {
                var o = t.getAttribute("data-id");
                e.forEach(function (e) {
                  e.id !== parseInt(o, 10) || e.highlighted ? !n && e.highlighted && i.unhighlightItem(e) : i.highlightItem(e);
                }), this.input.focus();
              }
            }
          }, {
            key: "_handleChoiceAction",
            value: function value(e, t) {
              if (e && t) {
                var i = t.getAttribute("data-id"),
                    n = this._store.getChoiceById(i),
                    o = e[0] && e[0].keyCode ? e[0].keyCode : null,
                    r = this.dropdown.isActive;

                if (n.keyCode = o, this.passedElement.triggerEvent(a.EVENTS.choice, {
                  choice: n
                }), n && !n.selected && !n.disabled) this._canAddItem(e, n.value).response && (this._addItem({
                  value: n.value,
                  label: n.label,
                  choiceId: n.id,
                  groupId: n.groupId,
                  customProperties: n.customProperties,
                  placeholder: n.placeholder,
                  keyCode: n.keyCode
                }), this._triggerChange(n.value));
                this.clearInput(), r && this._isSelectOneElement && (this.hideDropdown(!0), this.containerOuter.focus());
              }
            }
          }, {
            key: "_handleBackspace",
            value: function value(e) {
              if (this.config.removeItems && e) {
                var t = e[e.length - 1],
                    i = e.some(function (e) {
                  return e.highlighted;
                });
                this.config.editItems && !i && t ? (this.input.value = t.value, this.input.setWidth(), this._removeItem(t), this._triggerChange(t.value)) : (i || this.highlightItem(t, !1), this.removeHighlightedItems(!0));
              }
            }
          }, {
            key: "_setLoading",
            value: function value(e) {
              this._store.dispatch((0, f.setIsLoading)(e));
            }
          }, {
            key: "_handleLoadingState",
            value: function value() {
              var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0],
                  t = this.itemList.getChild(".".concat(this.config.classNames.placeholder));
              e ? (this.disable(), this.containerOuter.addLoadingState(), this._isSelectOneElement ? t ? t.innerHTML = this.config.loadingText : (t = this._getTemplate("placeholder", this.config.loadingText), this.itemList.append(t)) : this.input.placeholder = this.config.loadingText) : (this.enable(), this.containerOuter.removeLoadingState(), this._isSelectOneElement ? t.innerHTML = this._placeholderValue || "" : this.input.placeholder = this._placeholderValue || "");
            }
          }, {
            key: "_handleSearch",
            value: function value(e) {
              if (e && this.input.isFocussed) {
                var t = this._store.choices,
                    i = this.config,
                    n = i.searchFloor,
                    o = i.searchChoices,
                    r = t.some(function (e) {
                  return !e.active;
                });

                if (e && e.length >= n) {
                  var s = o ? this._searchChoices(e) : 0;
                  this.passedElement.triggerEvent(a.EVENTS.search, {
                    value: e,
                    resultCount: s
                  });
                } else r && (this._isSearching = !1, this._store.dispatch((0, l.activateChoices)(!0)));
              }
            }
          }, {
            key: "_canAddItem",
            value: function value(e, t) {
              var i = !0,
                  n = (0, p.isType)("Function", this.config.addItemText) ? this.config.addItemText(t) : this.config.addItemText;

              if (!this._isSelectOneElement) {
                var o = (0, p.existsInArray)(e, t);
                this.config.maxItemCount > 0 && this.config.maxItemCount <= e.length && (i = !1, n = (0, p.isType)("Function", this.config.maxItemText) ? this.config.maxItemText(this.config.maxItemCount) : this.config.maxItemText), !this.config.duplicateItemsAllowed && o && i && (i = !1, n = (0, p.isType)("Function", this.config.uniqueItemText) ? this.config.uniqueItemText(t) : this.config.uniqueItemText), this._isTextElement && this.config.addItems && i && (0, p.isType)("Function", this.config.addItemFilterFn) && !this.config.addItemFilterFn(t) && (i = !1, n = (0, p.isType)("Function", this.config.customAddItemText) ? this.config.customAddItemText(t) : this.config.customAddItemText);
              }

              return {
                response: i,
                notice: n
              };
            }
          }, {
            key: "_ajaxCallback",
            value: function value() {
              var e = this;
              return function (t, i, n) {
                if (t && i) {
                  var o = (0, p.isType)("Object", t) ? [t] : t;
                  o && (0, p.isType)("Array", o) && o.length ? (e._handleLoadingState(!1), e._setLoading(!0), o.forEach(function (t) {
                    t.choices ? e._addGroup({
                      group: t,
                      id: t.id || null,
                      valueKey: i,
                      labelKey: n
                    }) : e._addChoice({
                      value: (0, p.fetchFromObject)(t, i),
                      label: (0, p.fetchFromObject)(t, n),
                      isSelected: t.selected,
                      isDisabled: t.disabled,
                      customProperties: t.customProperties,
                      placeholder: t.placeholder
                    });
                  }), e._setLoading(!1), e._isSelectOneElement && e._selectPlaceholderChoice()) : e._handleLoadingState(!1);
                }
              };
            }
          }, {
            key: "_searchChoices",
            value: function value(e) {
              var t = (0, p.isType)("String", e) ? e.trim() : e,
                  i = (0, p.isType)("String", this._currentValue) ? this._currentValue.trim() : this._currentValue;
              if (t.length < 1 && t === "".concat(i, " ")) return 0;
              var o = this._store.searchableChoices,
                  r = t,
                  s = [].concat(this.config.searchFields),
                  a = Object.assign(this.config.fuseOptions, {
                keys: s
              }),
                  c = new n.default(o, a).search(r);
              return this._currentValue = t, this._highlightPosition = 0, this._isSearching = !0, this._store.dispatch((0, l.filterChoices)(c)), c.length;
            }
          }, {
            key: "_addEventListeners",
            value: function value() {
              document.addEventListener("keyup", this._onKeyUp), document.addEventListener("keydown", this._onKeyDown), document.addEventListener("click", this._onClick), document.addEventListener("touchmove", this._onTouchMove), document.addEventListener("touchend", this._onTouchEnd), document.addEventListener("mousedown", this._onMouseDown), document.addEventListener("mouseover", this._onMouseOver), this._isSelectOneElement && (this.containerOuter.element.addEventListener("focus", this._onFocus), this.containerOuter.element.addEventListener("blur", this._onBlur)), this.input.element.addEventListener("focus", this._onFocus), this.input.element.addEventListener("blur", this._onBlur), this.input.element.form && this.input.element.form.addEventListener("reset", this._onFormReset), this.input.addEventListeners();
            }
          }, {
            key: "_removeEventListeners",
            value: function value() {
              document.removeEventListener("keyup", this._onKeyUp), document.removeEventListener("keydown", this._onKeyDown), document.removeEventListener("click", this._onClick), document.removeEventListener("touchmove", this._onTouchMove), document.removeEventListener("touchend", this._onTouchEnd), document.removeEventListener("mousedown", this._onMouseDown), document.removeEventListener("mouseover", this._onMouseOver), this._isSelectOneElement && (this.containerOuter.element.removeEventListener("focus", this._onFocus), this.containerOuter.element.removeEventListener("blur", this._onBlur)), this.input.element.removeEventListener("focus", this._onFocus), this.input.element.removeEventListener("blur", this._onBlur), this.input.element.form && this.input.element.form.removeEventListener("reset", this._onFormReset), this.input.removeEventListeners();
            }
          }, {
            key: "_onKeyDown",
            value: function value(e) {
              var t,
                  i = e.target,
                  n = e.keyCode,
                  o = e.ctrlKey,
                  r = e.metaKey;

              if (i === this.input.element || this.containerOuter.element.contains(i)) {
                var s = this._store.activeItems,
                    c = this.input.isFocussed,
                    l = this.dropdown.isActive,
                    u = this.itemList.hasChildren,
                    h = String.fromCharCode(n),
                    d = a.KEY_CODES.BACK_KEY,
                    f = a.KEY_CODES.DELETE_KEY,
                    p = a.KEY_CODES.ENTER_KEY,
                    v = a.KEY_CODES.A_KEY,
                    g = a.KEY_CODES.ESC_KEY,
                    _ = a.KEY_CODES.UP_KEY,
                    y = a.KEY_CODES.DOWN_KEY,
                    b = a.KEY_CODES.PAGE_UP_KEY,
                    E = a.KEY_CODES.PAGE_DOWN_KEY,
                    S = o || r;
                !this._isTextElement && /[a-zA-Z0-9-_ ]/.test(h) && this.showDropdown();
                var I = (m(t = {}, v, this._onAKey), m(t, p, this._onEnterKey), m(t, g, this._onEscapeKey), m(t, _, this._onDirectionKey), m(t, b, this._onDirectionKey), m(t, y, this._onDirectionKey), m(t, E, this._onDirectionKey), m(t, f, this._onDeleteKey), m(t, d, this._onDeleteKey), t);
                I[n] && I[n]({
                  event: e,
                  target: i,
                  keyCode: n,
                  metaKey: r,
                  activeItems: s,
                  hasFocusedInput: c,
                  hasActiveDropdown: l,
                  hasItems: u,
                  hasCtrlDownKeyPressed: S
                });
              }
            }
          }, {
            key: "_onKeyUp",
            value: function value(e) {
              var t = e.target,
                  i = e.keyCode;

              if (t === this.input.element) {
                var n = this.input.value,
                    o = this._store.activeItems,
                    r = this._canAddItem(o, n),
                    s = a.KEY_CODES.BACK_KEY,
                    c = a.KEY_CODES.DELETE_KEY;

                if (this._isTextElement) {
                  if (r.notice && n) {
                    var u = this._getTemplate("notice", r.notice);

                    this.dropdown.element.innerHTML = u.outerHTML, this.showDropdown(!0);
                  } else this.hideDropdown(!0);
                } else {
                  var h = (i === s || i === c) && !t.value,
                      d = !this._isTextElement && this._isSearching,
                      f = this._canSearch && r.response;
                  h && d ? (this._isSearching = !1, this._store.dispatch((0, l.activateChoices)(!0))) : f && this._handleSearch(this.input.value);
                }

                this._canSearch = this.config.searchEnabled;
              }
            }
          }, {
            key: "_onAKey",
            value: function value(e) {
              var t = e.hasItems;
              e.hasCtrlDownKeyPressed && t && (this._canSearch = !1, this.config.removeItems && !this.input.value && this.input.element === document.activeElement && this.highlightAll());
            }
          }, {
            key: "_onEnterKey",
            value: function value(e) {
              var t = e.event,
                  i = e.target,
                  n = e.activeItems,
                  o = e.hasActiveDropdown,
                  r = a.KEY_CODES.ENTER_KEY,
                  s = i.hasAttribute("data-button");

              if (this._isTextElement && i.value) {
                var c = this.input.value;
                this._canAddItem(n, c).response && (this.hideDropdown(!0), this._addItem({
                  value: c
                }), this._triggerChange(c), this.clearInput());
              }

              if (s && (this._handleButtonAction(n, i), t.preventDefault()), o) {
                var l = this.dropdown.getChild(".".concat(this.config.classNames.highlightedState));
                l && (n[0] && (n[0].keyCode = r), this._handleChoiceAction(n, l)), t.preventDefault();
              } else this._isSelectOneElement && (this.showDropdown(), t.preventDefault());
            }
          }, {
            key: "_onEscapeKey",
            value: function value(e) {
              e.hasActiveDropdown && (this.hideDropdown(!0), this.containerOuter.focus());
            }
          }, {
            key: "_onDirectionKey",
            value: function value(e) {
              var t = e.event,
                  i = e.hasActiveDropdown,
                  n = e.keyCode,
                  o = e.metaKey,
                  r = a.KEY_CODES.DOWN_KEY,
                  s = a.KEY_CODES.PAGE_UP_KEY,
                  c = a.KEY_CODES.PAGE_DOWN_KEY;

              if (i || this._isSelectOneElement) {
                this.showDropdown(), this._canSearch = !1;
                var l,
                    u = n === r || n === c ? 1 : -1;
                if (o || n === c || n === s) l = u > 0 ? Array.from(this.dropdown.element.querySelectorAll("[data-choice-selectable]")).pop() : this.dropdown.element.querySelector("[data-choice-selectable]");else {
                  var h = this.dropdown.element.querySelector(".".concat(this.config.classNames.highlightedState));
                  l = h ? (0, p.getAdjacentEl)(h, "[data-choice-selectable]", u) : this.dropdown.element.querySelector("[data-choice-selectable]");
                }
                l && ((0, p.isScrolledIntoView)(l, this.choiceList.element, u) || this.choiceList.scrollToChoice(l, u), this._highlightChoice(l)), t.preventDefault();
              }
            }
          }, {
            key: "_onDeleteKey",
            value: function value(e) {
              var t = e.event,
                  i = e.target,
                  n = e.hasFocusedInput,
                  o = e.activeItems;
              !n || i.value || this._isSelectOneElement || (this._handleBackspace(o), t.preventDefault());
            }
          }, {
            key: "_onTouchMove",
            value: function value() {
              this._wasTap && (this._wasTap = !1);
            }
          }, {
            key: "_onTouchEnd",
            value: function value(e) {
              var t = (e || e.touches[0]).target;
              this._wasTap && this.containerOuter.element.contains(t) && ((t === this.containerOuter.element || t === this.containerInner.element) && (this._isTextElement ? this.input.focus() : this._isSelectMultipleElement && this.showDropdown()), e.stopPropagation());
              this._wasTap = !0;
            }
          }, {
            key: "_onMouseDown",
            value: function value(e) {
              var t = e.target,
                  i = e.shiftKey;

              if (this.choiceList.element.contains(t) && (0, p.isIE11)() && (this._isScrollingOnIe = !0), this.containerOuter.element.contains(t) && t !== this.input.element) {
                var n = this._store.activeItems,
                    o = i,
                    r = (0, p.findAncestorByAttrName)(t, "data-button"),
                    s = (0, p.findAncestorByAttrName)(t, "data-item"),
                    a = (0, p.findAncestorByAttrName)(t, "data-choice");
                r ? this._handleButtonAction(n, r) : s ? this._handleItemAction(n, s, o) : a && this._handleChoiceAction(n, a), e.preventDefault();
              }
            }
          }, {
            key: "_onMouseOver",
            value: function value(e) {
              var t = e.target;
              (t === this.dropdown || this.dropdown.element.contains(t)) && t.hasAttribute("data-choice") && this._highlightChoice(t);
            }
          }, {
            key: "_onClick",
            value: function value(e) {
              var t = e.target;
              this.containerOuter.element.contains(t) ? this.dropdown.isActive || this.containerOuter.isDisabled ? this._isSelectOneElement && t !== this.input.element && !this.dropdown.element.contains(t) && this.hideDropdown() : this._isTextElement ? document.activeElement !== this.input.element && this.input.focus() : (this.showDropdown(), this.containerOuter.focus()) : (this._store.highlightedActiveItems && this.unhighlightAll(), this.containerOuter.removeFocusState(), this.hideDropdown(!0));
            }
          }, {
            key: "_onFocus",
            value: function value(e) {
              var t = this,
                  i = e.target;
              this.containerOuter.element.contains(i) && {
                text: function text() {
                  i === t.input.element && t.containerOuter.addFocusState();
                },
                "select-one": function selectOne() {
                  t.containerOuter.addFocusState(), i === t.input.element && t.showDropdown(!0);
                },
                "select-multiple": function selectMultiple() {
                  i === t.input.element && (t.showDropdown(!0), t.containerOuter.addFocusState());
                }
              }[this.passedElement.element.type]();
            }
          }, {
            key: "_onBlur",
            value: function value(e) {
              var t = this,
                  i = e.target;

              if (this.containerOuter.element.contains(i) && !this._isScrollingOnIe) {
                var n = this._store.activeItems.some(function (e) {
                  return e.highlighted;
                });

                ({
                  text: function text() {
                    i === t.input.element && (t.containerOuter.removeFocusState(), n && t.unhighlightAll(), t.hideDropdown(!0));
                  },
                  "select-one": function selectOne() {
                    t.containerOuter.removeFocusState(), (i === t.input.element || i === t.containerOuter.element && !t._canSearch) && t.hideDropdown(!0);
                  },
                  "select-multiple": function selectMultiple() {
                    i === t.input.element && (t.containerOuter.removeFocusState(), t.hideDropdown(!0), n && t.unhighlightAll());
                  }
                })[this.passedElement.element.type]();
              } else this._isScrollingOnIe = !1, this.input.element.focus();
            }
          }, {
            key: "_onFormReset",
            value: function value() {
              this._store.dispatch((0, d.resetTo)(this._initialState));
            }
          }, {
            key: "_highlightChoice",
            value: function value() {
              var e = this,
                  t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null,
                  i = Array.from(this.dropdown.element.querySelectorAll("[data-choice-selectable]"));

              if (i.length) {
                var n = t;
                Array.from(this.dropdown.element.querySelectorAll(".".concat(this.config.classNames.highlightedState))).forEach(function (t) {
                  t.classList.remove(e.config.classNames.highlightedState), t.setAttribute("aria-selected", "false");
                }), n ? this._highlightPosition = i.indexOf(n) : (n = i.length > this._highlightPosition ? i[this._highlightPosition] : i[i.length - 1]) || (n = i[0]), n.classList.add(this.config.classNames.highlightedState), n.setAttribute("aria-selected", "true"), this.passedElement.triggerEvent(a.EVENTS.highlightChoice, {
                  el: n
                }), this.dropdown.isActive && (this.input.setActiveDescendant(n.id), this.containerOuter.setActiveDescendant(n.id));
              }
            }
          }, {
            key: "_addItem",
            value: function value(e) {
              var t = e.value,
                  i = e.label,
                  n = void 0 === i ? null : i,
                  o = e.choiceId,
                  r = void 0 === o ? -1 : o,
                  s = e.groupId,
                  c = void 0 === s ? -1 : s,
                  l = e.customProperties,
                  h = void 0 === l ? null : l,
                  d = e.placeholder,
                  f = void 0 !== d && d,
                  v = e.keyCode,
                  m = void 0 === v ? null : v,
                  g = (0, p.isType)("String", t) ? t.trim() : t,
                  _ = m,
                  y = h,
                  b = this._store.items,
                  E = n || g,
                  S = parseInt(r, 10) || -1,
                  I = c >= 0 ? this._store.getGroupById(c) : null,
                  O = b ? b.length + 1 : 1;
              return this.config.prependValue && (g = this.config.prependValue + g.toString()), this.config.appendValue && (g += this.config.appendValue.toString()), this._store.dispatch((0, u.addItem)({
                value: g,
                label: E,
                id: O,
                choiceId: S,
                groupId: c,
                customProperties: h,
                placeholder: f,
                keyCode: _
              })), this._isSelectOneElement && this.removeActiveItems(O), this.passedElement.triggerEvent(a.EVENTS.addItem, {
                id: O,
                value: g,
                label: E,
                customProperties: y,
                groupValue: I && I.value ? I.value : void 0,
                keyCode: _
              }), this;
            }
          }, {
            key: "_removeItem",
            value: function value(e) {
              if (!e || !(0, p.isType)("Object", e)) return this;
              var t = e.id,
                  i = e.value,
                  n = e.label,
                  o = e.choiceId,
                  r = e.groupId,
                  s = r >= 0 ? this._store.getGroupById(r) : null;
              return this._store.dispatch((0, u.removeItem)(t, o)), s && s.value ? this.passedElement.triggerEvent(a.EVENTS.removeItem, {
                id: t,
                value: i,
                label: n,
                groupValue: s.value
              }) : this.passedElement.triggerEvent(a.EVENTS.removeItem, {
                id: t,
                value: i,
                label: n
              }), this;
            }
          }, {
            key: "_addChoice",
            value: function value(e) {
              var t = e.value,
                  i = e.label,
                  n = void 0 === i ? null : i,
                  o = e.isSelected,
                  r = void 0 !== o && o,
                  s = e.isDisabled,
                  a = void 0 !== s && s,
                  c = e.groupId,
                  u = void 0 === c ? -1 : c,
                  h = e.customProperties,
                  d = void 0 === h ? null : h,
                  f = e.placeholder,
                  p = void 0 !== f && f,
                  v = e.keyCode,
                  m = void 0 === v ? null : v;

              if (null != t) {
                var g = this._store.choices,
                    _ = n || t,
                    y = g ? g.length + 1 : 1,
                    b = "".concat(this._baseId, "-").concat(this._idNames.itemChoice, "-").concat(y);

                this._store.dispatch((0, l.addChoice)({
                  value: t,
                  label: _,
                  id: y,
                  groupId: u,
                  disabled: a,
                  elementId: b,
                  customProperties: d,
                  placeholder: p,
                  keyCode: m
                })), r && this._addItem({
                  value: t,
                  label: _,
                  choiceId: y,
                  customProperties: d,
                  placeholder: p,
                  keyCode: m
                });
              }
            }
          }, {
            key: "_addGroup",
            value: function value(e) {
              var t = this,
                  i = e.group,
                  n = e.id,
                  o = e.valueKey,
                  r = void 0 === o ? "value" : o,
                  s = e.labelKey,
                  a = void 0 === s ? "label" : s,
                  c = (0, p.isType)("Object", i) ? i.choices : Array.from(i.getElementsByTagName("OPTION")),
                  l = n || Math.floor(new Date().valueOf() * Math.random()),
                  u = !!i.disabled && i.disabled;

              if (c) {
                this._store.dispatch((0, h.addGroup)(i.label, l, !0, u));

                c.forEach(function (e) {
                  var i = e.disabled || e.parentNode && e.parentNode.disabled;

                  t._addChoice({
                    value: e[r],
                    label: (0, p.isType)("Object", e) ? e[a] : e.innerHTML,
                    isSelected: e.selected,
                    isDisabled: i,
                    groupId: l,
                    customProperties: e.customProperties,
                    placeholder: e.placeholder
                  });
                });
              } else this._store.dispatch((0, h.addGroup)(i.label, i.id, !1, i.disabled));
            }
          }, {
            key: "_getTemplate",
            value: function value(e) {
              var t;
              if (!e) return null;

              for (var i = this.config, n = i.templates, o = i.classNames, r = arguments.length, s = new Array(r > 1 ? r - 1 : 0), a = 1; a < r; a++) {
                s[a - 1] = arguments[a];
              }

              return (t = n[e]).call.apply(t, [this, o].concat(s));
            }
          }, {
            key: "_createTemplates",
            value: function value() {
              var e = this.config.callbackOnCreateTemplates,
                  t = {};
              e && (0, p.isType)("Function", e) && (t = e.call(this, p.strToEl)), this.config.templates = (0, o.default)(c.TEMPLATES, t);
            }
          }, {
            key: "_createElements",
            value: function value() {
              this.containerOuter = new s.Container({
                element: this._getTemplate("containerOuter", this._direction, this._isSelectElement, this._isSelectOneElement, this.config.searchEnabled, this.passedElement.element.type),
                classNames: this.config.classNames,
                type: this.passedElement.element.type,
                position: this.config.position
              }), this.containerInner = new s.Container({
                element: this._getTemplate("containerInner"),
                classNames: this.config.classNames,
                type: this.passedElement.element.type,
                position: this.config.position
              }), this.input = new s.Input({
                element: this._getTemplate("input"),
                classNames: this.config.classNames,
                type: this.passedElement.element.type
              }), this.choiceList = new s.List({
                element: this._getTemplate("choiceList", this._isSelectOneElement)
              }), this.itemList = new s.List({
                element: this._getTemplate("itemList", this._isSelectOneElement)
              }), this.dropdown = new s.Dropdown({
                element: this._getTemplate("dropdown"),
                classNames: this.config.classNames,
                type: this.passedElement.element.type
              });
            }
          }, {
            key: "_createStructure",
            value: function value() {
              this.passedElement.conceal(), this.containerInner.wrap(this.passedElement.element), this.containerOuter.wrap(this.containerInner.element), this._isSelectOneElement ? this.input.placeholder = this.config.searchPlaceholderValue || "" : this._placeholderValue && (this.input.placeholder = this._placeholderValue, this.input.setWidth(!0)), this.containerOuter.element.appendChild(this.containerInner.element), this.containerOuter.element.appendChild(this.dropdown.element), this.containerInner.element.appendChild(this.itemList.element), this._isTextElement || this.dropdown.element.appendChild(this.choiceList.element), this._isSelectOneElement ? this.config.searchEnabled && this.dropdown.element.insertBefore(this.input.element, this.dropdown.element.firstChild) : this.containerInner.element.appendChild(this.input.element), this._isSelectElement ? this._addPredefinedChoices() : this._isTextElement && this._addPredefinedItems();
            }
          }, {
            key: "_addPredefinedChoices",
            value: function value() {
              var e = this,
                  t = this.passedElement.optionGroups;

              if (this._highlightPosition = 0, this._isSearching = !1, this._setLoading(!0), t && t.length) {
                var i = this.passedElement.placeholderOption;
                i && "SELECT" === i.parentNode.tagName && this._addChoice({
                  value: i.value,
                  label: i.innerHTML,
                  isSelected: i.selected,
                  isDisabled: i.disabled,
                  placeholder: !0
                }), t.forEach(function (t) {
                  return e._addGroup({
                    group: t,
                    id: t.id || null
                  });
                });
              } else {
                var n = this.passedElement.options,
                    o = this.config.sortFn,
                    r = this._presetChoices;
                n.forEach(function (e) {
                  r.push({
                    value: e.value,
                    label: e.innerHTML,
                    selected: e.selected,
                    disabled: e.disabled || e.parentNode.disabled,
                    placeholder: e.hasAttribute("placeholder"),
                    customProperties: e.getAttribute("data-custom-properties")
                  });
                }), this.config.shouldSort && r.sort(o);
                var s = r.some(function (e) {
                  return e.selected;
                });
                r.forEach(function (t, i) {
                  return function (t, i) {
                    var n = t.value,
                        o = t.label,
                        r = t.customProperties,
                        a = t.placeholder;
                    if (e._isSelectElement) {
                      if (t.choices) e._addGroup({
                        group: t,
                        id: t.id || null
                      });else {
                        var c = e._isSelectOneElement && !s && 0 === i,
                            l = !!c || t.selected,
                            u = !c && t.disabled;

                        e._addChoice({
                          value: n,
                          label: o,
                          isSelected: l,
                          isDisabled: u,
                          customProperties: r,
                          placeholder: a
                        });
                      }
                    } else e._addChoice({
                      value: n,
                      label: o,
                      isSelected: t.selected,
                      isDisabled: t.disabled,
                      customProperties: r,
                      placeholder: a
                    });
                  }(t, i);
                });
              }

              this._setLoading(!1);
            }
          }, {
            key: "_addPredefinedItems",
            value: function value() {
              var e = this;

              this._presetItems.forEach(function (t) {
                return function (t) {
                  var i = (0, p.getType)(t);
                  "Object" === i && t.value ? e._addItem({
                    value: t.value,
                    label: t.label,
                    choiceId: t.id,
                    customProperties: t.customProperties,
                    placeholder: t.placeholder
                  }) : "String" === i && e._addItem({
                    value: t
                  });
                }(t);
              });
            }
          }, {
            key: "_setChoiceOrItem",
            value: function value(e) {
              var t = this;
              ({
                object: function object() {
                  e.value && (t._isTextElement ? t._addItem({
                    value: e.value,
                    label: e.label,
                    choiceId: e.id,
                    customProperties: e.customProperties,
                    placeholder: e.placeholder
                  }) : t._addChoice({
                    value: e.value,
                    label: e.label,
                    isSelected: !0,
                    isDisabled: !1,
                    customProperties: e.customProperties,
                    placeholder: e.placeholder
                  }));
                },
                string: function string() {
                  t._isTextElement ? t._addItem({
                    value: e
                  }) : t._addChoice({
                    value: e,
                    label: e,
                    isSelected: !0,
                    isDisabled: !1
                  });
                }
              })[(0, p.getType)(e).toLowerCase()]();
            }
          }, {
            key: "_findAndSelectChoiceByValue",
            value: function value(e) {
              var t = this,
                  i = this._store.choices.find(function (i) {
                return t.config.itemComparer(i.value, e);
              });

              i && !i.selected && this._addItem({
                value: i.value,
                label: i.label,
                choiceId: i.id,
                groupId: i.groupId,
                customProperties: i.customProperties,
                placeholder: i.placeholder,
                keyCode: i.keyCode
              });
            }
          }, {
            key: "_generateInstances",
            value: function value(t, i) {
              return t.reduce(function (t, n) {
                return t.push(new e(n, i)), t;
              }, [this]);
            }
          }, {
            key: "_generatePlaceholderValue",
            value: function value() {
              return !this._isSelectOneElement && !!this.config.placeholder && (this.config.placeholderValue || this.passedElement.element.getAttribute("placeholder"));
            }
          }]) && g(t.prototype, i), e;
        }();

        _.userDefaults = {}, e.exports = _;
      }, function (e, t, i) {
        /*!
         * Fuse.js v3.4.2 - Lightweight fuzzy-search (http://fusejs.io)
         * 
         * Copyright (c) 2012-2017 Kirollos Risk (http://kiro.me)
         * All Rights Reserved. Apache Software License 2.0
         * 
         * http://www.apache.org/licenses/LICENSE-2.0
         */
        var n;
        n = function n() {
          return function (e) {
            var t = {};

            function i(n) {
              if (t[n]) return t[n].exports;
              var o = t[n] = {
                i: n,
                l: !1,
                exports: {}
              };
              return e[n].call(o.exports, o, o.exports, i), o.l = !0, o.exports;
            }

            return i.m = e, i.c = t, i.d = function (e, t, n) {
              i.o(e, t) || Object.defineProperty(e, t, {
                enumerable: !0,
                get: n
              });
            }, i.r = function (e) {
              "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
              }), Object.defineProperty(e, "__esModule", {
                value: !0
              });
            }, i.t = function (e, t) {
              if (1 & t && (e = i(e)), 8 & t) return e;
              if (4 & t && "object" == _typeof(e) && e && e.__esModule) return e;
              var n = Object.create(null);
              if (i.r(n), Object.defineProperty(n, "default", {
                enumerable: !0,
                value: e
              }), 2 & t && "string" != typeof e) for (var o in e) {
                i.d(n, o, function (t) {
                  return e[t];
                }.bind(null, o));
              }
              return n;
            }, i.n = function (e) {
              var t = e && e.__esModule ? function () {
                return e.default;
              } : function () {
                return e;
              };
              return i.d(t, "a", t), t;
            }, i.o = function (e, t) {
              return Object.prototype.hasOwnProperty.call(e, t);
            }, i.p = "", i(i.s = "./src/index.js");
          }({
            "./src/bitap/bitap_matched_indices.js":
            /*!********************************************!*\
              !*** ./src/bitap/bitap_matched_indices.js ***!
              \********************************************/

            /*! no static exports found */
            function srcBitapBitap_matched_indicesJs(e, t) {
              e.exports = function () {
                for (var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1, i = [], n = -1, o = -1, r = 0, s = e.length; r < s; r += 1) {
                  var a = e[r];
                  a && -1 === n ? n = r : a || -1 === n || ((o = r - 1) - n + 1 >= t && i.push([n, o]), n = -1);
                }

                return e[r - 1] && r - n >= t && i.push([n, r - 1]), i;
              };
            },
            "./src/bitap/bitap_pattern_alphabet.js":
            /*!*********************************************!*\
              !*** ./src/bitap/bitap_pattern_alphabet.js ***!
              \*********************************************/

            /*! no static exports found */
            function srcBitapBitap_pattern_alphabetJs(e, t) {
              e.exports = function (e) {
                for (var t = {}, i = e.length, n = 0; n < i; n += 1) {
                  t[e.charAt(n)] = 0;
                }

                for (var o = 0; o < i; o += 1) {
                  t[e.charAt(o)] |= 1 << i - o - 1;
                }

                return t;
              };
            },
            "./src/bitap/bitap_regex_search.js":
            /*!*****************************************!*\
              !*** ./src/bitap/bitap_regex_search.js ***!
              \*****************************************/

            /*! no static exports found */
            function srcBitapBitap_regex_searchJs(e, t) {
              var i = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g;

              e.exports = function (e, t) {
                var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : / +/g,
                    o = new RegExp(t.replace(i, "\\$&").replace(n, "|")),
                    r = e.match(o),
                    s = !!r,
                    a = [];
                if (s) for (var c = 0, l = r.length; c < l; c += 1) {
                  var u = r[c];
                  a.push([e.indexOf(u), u.length - 1]);
                }
                return {
                  score: s ? .5 : 1,
                  isMatch: s,
                  matchedIndices: a
                };
              };
            },
            "./src/bitap/bitap_score.js":
            /*!**********************************!*\
              !*** ./src/bitap/bitap_score.js ***!
              \**********************************/

            /*! no static exports found */
            function srcBitapBitap_scoreJs(e, t) {
              e.exports = function (e, t) {
                var i = t.errors,
                    n = void 0 === i ? 0 : i,
                    o = t.currentLocation,
                    r = void 0 === o ? 0 : o,
                    s = t.expectedLocation,
                    a = void 0 === s ? 0 : s,
                    c = t.distance,
                    l = void 0 === c ? 100 : c,
                    u = n / e.length,
                    h = Math.abs(a - r);
                return l ? u + h / l : h ? 1 : u;
              };
            },
            "./src/bitap/bitap_search.js":
            /*!***********************************!*\
              !*** ./src/bitap/bitap_search.js ***!
              \***********************************/

            /*! no static exports found */
            function srcBitapBitap_searchJs(e, t, i) {
              var n = i(
              /*! ./bitap_score */
              "./src/bitap/bitap_score.js"),
                  o = i(
              /*! ./bitap_matched_indices */
              "./src/bitap/bitap_matched_indices.js");

              e.exports = function (e, t, i, r) {
                for (var s = r.location, a = void 0 === s ? 0 : s, c = r.distance, l = void 0 === c ? 100 : c, u = r.threshold, h = void 0 === u ? .6 : u, d = r.findAllMatches, f = void 0 !== d && d, p = r.minMatchCharLength, v = void 0 === p ? 1 : p, m = a, g = e.length, _ = h, y = e.indexOf(t, m), b = t.length, E = [], S = 0; S < g; S += 1) {
                  E[S] = 0;
                }

                if (-1 !== y) {
                  var I = n(t, {
                    errors: 0,
                    currentLocation: y,
                    expectedLocation: m,
                    distance: l
                  });

                  if (_ = Math.min(I, _), -1 !== (y = e.lastIndexOf(t, m + b))) {
                    var O = n(t, {
                      errors: 0,
                      currentLocation: y,
                      expectedLocation: m,
                      distance: l
                    });
                    _ = Math.min(O, _);
                  }
                }

                y = -1;

                for (var C = [], T = 1, w = b + g, k = 1 << b - 1, A = 0; A < b; A += 1) {
                  for (var L = 0, x = w; L < x;) {
                    n(t, {
                      errors: A,
                      currentLocation: m + x,
                      expectedLocation: m,
                      distance: l
                    }) <= _ ? L = x : w = x, x = Math.floor((w - L) / 2 + L);
                  }

                  w = x;
                  var P = Math.max(1, m - x + 1),
                      D = f ? g : Math.min(m + x, g) + b,
                      j = Array(D + 2);
                  j[D + 1] = (1 << A) - 1;

                  for (var M = D; M >= P; M -= 1) {
                    var N = M - 1,
                        F = i[e.charAt(N)];

                    if (F && (E[N] = 1), j[M] = (j[M + 1] << 1 | 1) & F, 0 !== A && (j[M] |= (C[M + 1] | C[M]) << 1 | 1 | C[M + 1]), j[M] & k && (T = n(t, {
                      errors: A,
                      currentLocation: N,
                      expectedLocation: m,
                      distance: l
                    })) <= _) {
                      if (_ = T, (y = N) <= m) break;
                      P = Math.max(1, 2 * m - y);
                    }
                  }

                  if (n(t, {
                    errors: A + 1,
                    currentLocation: m,
                    expectedLocation: m,
                    distance: l
                  }) > _) break;
                  C = j;
                }

                return {
                  isMatch: y >= 0,
                  score: 0 === T ? .001 : T,
                  matchedIndices: o(E, v)
                };
              };
            },
            "./src/bitap/index.js":
            /*!****************************!*\
              !*** ./src/bitap/index.js ***!
              \****************************/

            /*! no static exports found */
            function srcBitapIndexJs(e, t, i) {
              function n(e, t) {
                for (var i = 0; i < t.length; i++) {
                  var n = t[i];
                  n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
                }
              }

              var o = i(
              /*! ./bitap_regex_search */
              "./src/bitap/bitap_regex_search.js"),
                  r = i(
              /*! ./bitap_search */
              "./src/bitap/bitap_search.js"),
                  s = i(
              /*! ./bitap_pattern_alphabet */
              "./src/bitap/bitap_pattern_alphabet.js"),
                  a = function () {
                function e(t, i) {
                  var n = i.location,
                      o = void 0 === n ? 0 : n,
                      r = i.distance,
                      a = void 0 === r ? 100 : r,
                      c = i.threshold,
                      l = void 0 === c ? .6 : c,
                      u = i.maxPatternLength,
                      h = void 0 === u ? 32 : u,
                      d = i.isCaseSensitive,
                      f = void 0 !== d && d,
                      p = i.tokenSeparator,
                      v = void 0 === p ? / +/g : p,
                      m = i.findAllMatches,
                      g = void 0 !== m && m,
                      _ = i.minMatchCharLength,
                      y = void 0 === _ ? 1 : _;
                  !function (e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                  }(this, e), this.options = {
                    location: o,
                    distance: a,
                    threshold: l,
                    maxPatternLength: h,
                    isCaseSensitive: f,
                    tokenSeparator: v,
                    findAllMatches: g,
                    minMatchCharLength: y
                  }, this.pattern = this.options.isCaseSensitive ? t : t.toLowerCase(), this.pattern.length <= h && (this.patternAlphabet = s(this.pattern));
                }

                var t, i;
                return t = e, (i = [{
                  key: "search",
                  value: function value(e) {
                    if (this.options.isCaseSensitive || (e = e.toLowerCase()), this.pattern === e) return {
                      isMatch: !0,
                      score: 0,
                      matchedIndices: [[0, e.length - 1]]
                    };
                    var t = this.options,
                        i = t.maxPatternLength,
                        n = t.tokenSeparator;
                    if (this.pattern.length > i) return o(e, this.pattern, n);
                    var s = this.options,
                        a = s.location,
                        c = s.distance,
                        l = s.threshold,
                        u = s.findAllMatches,
                        h = s.minMatchCharLength;
                    return r(e, this.pattern, this.patternAlphabet, {
                      location: a,
                      distance: c,
                      threshold: l,
                      findAllMatches: u,
                      minMatchCharLength: h
                    });
                  }
                }]) && n(t.prototype, i), e;
              }();

              e.exports = a;
            },
            "./src/helpers/deep_value.js":
            /*!***********************************!*\
              !*** ./src/helpers/deep_value.js ***!
              \***********************************/

            /*! no static exports found */
            function srcHelpersDeep_valueJs(e, t, i) {
              var n = i(
              /*! ./is_array */
              "./src/helpers/is_array.js");

              e.exports = function (e, t) {
                return function e(t, i, o) {
                  if (i) {
                    var r = i.indexOf("."),
                        s = i,
                        a = null;
                    -1 !== r && (s = i.slice(0, r), a = i.slice(r + 1));
                    var c = t[s];
                    if (null != c) if (a || "string" != typeof c && "number" != typeof c) {
                      if (n(c)) for (var l = 0, u = c.length; l < u; l += 1) {
                        e(c[l], a, o);
                      } else a && e(c, a, o);
                    } else o.push(c.toString());
                  } else o.push(t);

                  return o;
                }(e, t, []);
              };
            },
            "./src/helpers/is_array.js":
            /*!*********************************!*\
              !*** ./src/helpers/is_array.js ***!
              \*********************************/

            /*! no static exports found */
            function srcHelpersIs_arrayJs(e, t) {
              e.exports = function (e) {
                return Array.isArray ? Array.isArray(e) : "[object Array]" === Object.prototype.toString.call(e);
              };
            },
            "./src/index.js":
            /*!**********************!*\
              !*** ./src/index.js ***!
              \**********************/

            /*! no static exports found */
            function srcIndexJs(e, t, i) {
              function n(e) {
                return (n = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
                  return _typeof(e);
                } : function (e) {
                  return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
                })(e);
              }

              function o(e, t) {
                for (var i = 0; i < t.length; i++) {
                  var n = t[i];
                  n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
                }
              }

              var r = i(
              /*! ./bitap */
              "./src/bitap/index.js"),
                  s = i(
              /*! ./helpers/deep_value */
              "./src/helpers/deep_value.js"),
                  a = i(
              /*! ./helpers/is_array */
              "./src/helpers/is_array.js"),
                  c = function () {
                function e(t, i) {
                  var n = i.location,
                      o = void 0 === n ? 0 : n,
                      r = i.distance,
                      a = void 0 === r ? 100 : r,
                      c = i.threshold,
                      l = void 0 === c ? .6 : c,
                      u = i.maxPatternLength,
                      h = void 0 === u ? 32 : u,
                      d = i.caseSensitive,
                      f = void 0 !== d && d,
                      p = i.tokenSeparator,
                      v = void 0 === p ? / +/g : p,
                      m = i.findAllMatches,
                      g = void 0 !== m && m,
                      _ = i.minMatchCharLength,
                      y = void 0 === _ ? 1 : _,
                      b = i.id,
                      E = void 0 === b ? null : b,
                      S = i.keys,
                      I = void 0 === S ? [] : S,
                      O = i.shouldSort,
                      C = void 0 === O || O,
                      T = i.getFn,
                      w = void 0 === T ? s : T,
                      k = i.sortFn,
                      A = void 0 === k ? function (e, t) {
                    return e.score - t.score;
                  } : k,
                      L = i.tokenize,
                      x = void 0 !== L && L,
                      P = i.matchAllTokens,
                      D = void 0 !== P && P,
                      j = i.includeMatches,
                      M = void 0 !== j && j,
                      N = i.includeScore,
                      F = void 0 !== N && N,
                      K = i.verbose,
                      R = void 0 !== K && K;
                  !function (e, t) {
                    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                  }(this, e), this.options = {
                    location: o,
                    distance: a,
                    threshold: l,
                    maxPatternLength: h,
                    isCaseSensitive: f,
                    tokenSeparator: v,
                    findAllMatches: g,
                    minMatchCharLength: y,
                    id: E,
                    keys: I,
                    includeMatches: M,
                    includeScore: F,
                    shouldSort: C,
                    getFn: w,
                    sortFn: A,
                    verbose: R,
                    tokenize: x,
                    matchAllTokens: D
                  }, this.setCollection(t);
                }

                var t, i;
                return t = e, (i = [{
                  key: "setCollection",
                  value: function value(e) {
                    return this.list = e, e;
                  }
                }, {
                  key: "search",
                  value: function value(e) {
                    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {
                      limit: !1
                    };

                    this._log('---------\nSearch pattern: "'.concat(e, '"'));

                    var i = this._prepareSearchers(e),
                        n = i.tokenSearchers,
                        o = i.fullSearcher,
                        r = this._search(n, o),
                        s = r.weights,
                        a = r.results;

                    return this._computeScore(s, a), this.options.shouldSort && this._sort(a), t.limit && "number" == typeof t.limit && (a = a.slice(0, t.limit)), this._format(a);
                  }
                }, {
                  key: "_prepareSearchers",
                  value: function value() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
                        t = [];
                    if (this.options.tokenize) for (var i = e.split(this.options.tokenSeparator), n = 0, o = i.length; n < o; n += 1) {
                      t.push(new r(i[n], this.options));
                    }
                    return {
                      tokenSearchers: t,
                      fullSearcher: new r(e, this.options)
                    };
                  }
                }, {
                  key: "_search",
                  value: function value() {
                    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
                        t = arguments.length > 1 ? arguments[1] : void 0,
                        i = this.list,
                        n = {},
                        o = [];

                    if ("string" == typeof i[0]) {
                      for (var r = 0, s = i.length; r < s; r += 1) {
                        this._analyze({
                          key: "",
                          value: i[r],
                          record: r,
                          index: r
                        }, {
                          resultMap: n,
                          results: o,
                          tokenSearchers: e,
                          fullSearcher: t
                        });
                      }

                      return {
                        weights: null,
                        results: o
                      };
                    }

                    for (var a = {}, c = 0, l = i.length; c < l; c += 1) {
                      for (var u = i[c], h = 0, d = this.options.keys.length; h < d; h += 1) {
                        var f = this.options.keys[h];

                        if ("string" != typeof f) {
                          if (a[f.name] = {
                            weight: 1 - f.weight || 1
                          }, f.weight <= 0 || f.weight > 1) throw new Error("Key weight has to be > 0 and <= 1");
                          f = f.name;
                        } else a[f] = {
                          weight: 1
                        };

                        this._analyze({
                          key: f,
                          value: this.options.getFn(u, f),
                          record: u,
                          index: c
                        }, {
                          resultMap: n,
                          results: o,
                          tokenSearchers: e,
                          fullSearcher: t
                        });
                      }
                    }

                    return {
                      weights: a,
                      results: o
                    };
                  }
                }, {
                  key: "_analyze",
                  value: function value(e, t) {
                    var i = e.key,
                        n = e.arrayIndex,
                        o = void 0 === n ? -1 : n,
                        r = e.value,
                        s = e.record,
                        c = e.index,
                        l = t.tokenSearchers,
                        u = void 0 === l ? [] : l,
                        h = t.fullSearcher,
                        d = void 0 === h ? [] : h,
                        f = t.resultMap,
                        p = void 0 === f ? {} : f,
                        v = t.results,
                        m = void 0 === v ? [] : v;

                    if (null != r) {
                      var g = !1,
                          _ = -1,
                          y = 0;

                      if ("string" == typeof r) {
                        this._log("\nKey: ".concat("" === i ? "-" : i));

                        var b = d.search(r);

                        if (this._log('Full text: "'.concat(r, '", score: ').concat(b.score)), this.options.tokenize) {
                          for (var E = r.split(this.options.tokenSeparator), S = [], I = 0; I < u.length; I += 1) {
                            var O = u[I];

                            this._log('\nPattern: "'.concat(O.pattern, '"'));

                            for (var C = !1, T = 0; T < E.length; T += 1) {
                              var w = E[T],
                                  k = O.search(w),
                                  A = {};
                              k.isMatch ? (A[w] = k.score, g = !0, C = !0, S.push(k.score)) : (A[w] = 1, this.options.matchAllTokens || S.push(1)), this._log('Token: "'.concat(w, '", score: ').concat(A[w]));
                            }

                            C && (y += 1);
                          }

                          _ = S[0];

                          for (var L = S.length, x = 1; x < L; x += 1) {
                            _ += S[x];
                          }

                          _ /= L, this._log("Token score average:", _);
                        }

                        var P = b.score;
                        _ > -1 && (P = (P + _) / 2), this._log("Score average:", P);
                        var D = !this.options.tokenize || !this.options.matchAllTokens || y >= u.length;

                        if (this._log("\nCheck Matches: ".concat(D)), (g || b.isMatch) && D) {
                          var j = p[c];
                          j ? j.output.push({
                            key: i,
                            arrayIndex: o,
                            value: r,
                            score: P,
                            matchedIndices: b.matchedIndices
                          }) : (p[c] = {
                            item: s,
                            output: [{
                              key: i,
                              arrayIndex: o,
                              value: r,
                              score: P,
                              matchedIndices: b.matchedIndices
                            }]
                          }, m.push(p[c]));
                        }
                      } else if (a(r)) for (var M = 0, N = r.length; M < N; M += 1) {
                        this._analyze({
                          key: i,
                          arrayIndex: M,
                          value: r[M],
                          record: s,
                          index: c
                        }, {
                          resultMap: p,
                          results: m,
                          tokenSearchers: u,
                          fullSearcher: d
                        });
                      }
                    }
                  }
                }, {
                  key: "_computeScore",
                  value: function value(e, t) {
                    this._log("\n\nComputing score:\n");

                    for (var i = 0, n = t.length; i < n; i += 1) {
                      for (var o = t[i].output, r = o.length, s = 1, a = 1, c = 0; c < r; c += 1) {
                        var l = e ? e[o[c].key].weight : 1,
                            u = (1 === l ? o[c].score : o[c].score || .001) * l;
                        1 !== l ? a = Math.min(a, u) : (o[c].nScore = u, s *= u);
                      }

                      t[i].score = 1 === a ? s : a, this._log(t[i]);
                    }
                  }
                }, {
                  key: "_sort",
                  value: function value(e) {
                    this._log("\n\nSorting...."), e.sort(this.options.sortFn);
                  }
                }, {
                  key: "_format",
                  value: function value(e) {
                    var t = [];

                    if (this.options.verbose) {
                      var i = [];
                      this._log("\n\nOutput:\n\n", JSON.stringify(e, function (e, t) {
                        if ("object" === n(t) && null !== t) {
                          if (-1 !== i.indexOf(t)) return;
                          i.push(t);
                        }

                        return t;
                      })), i = null;
                    }

                    var o = [];
                    this.options.includeMatches && o.push(function (e, t) {
                      var i = e.output;
                      t.matches = [];

                      for (var n = 0, o = i.length; n < o; n += 1) {
                        var r = i[n];

                        if (0 !== r.matchedIndices.length) {
                          var s = {
                            indices: r.matchedIndices,
                            value: r.value
                          };
                          r.key && (s.key = r.key), r.hasOwnProperty("arrayIndex") && r.arrayIndex > -1 && (s.arrayIndex = r.arrayIndex), t.matches.push(s);
                        }
                      }
                    }), this.options.includeScore && o.push(function (e, t) {
                      t.score = e.score;
                    });

                    for (var r = 0, s = e.length; r < s; r += 1) {
                      var a = e[r];

                      if (this.options.id && (a.item = this.options.getFn(a.item, this.options.id)[0]), o.length) {
                        for (var c = {
                          item: a.item
                        }, l = 0, u = o.length; l < u; l += 1) {
                          o[l](a, c);
                        }

                        t.push(c);
                      } else t.push(a.item);
                    }

                    return t;
                  }
                }, {
                  key: "_log",
                  value: function value() {
                    var e;
                    this.options.verbose && (e = console).log.apply(e, arguments);
                  }
                }]) && o(t.prototype, i), e;
              }();

              e.exports = c;
            }
          });
        }, e.exports = n();
      }, function (e, t, i) {

        i.r(t);

        var n = function n(e) {
          return function (e) {
            return !!e && "object" == _typeof(e);
          }(e) && !function (e) {
            var t = Object.prototype.toString.call(e);
            return "[object RegExp]" === t || "[object Date]" === t || function (e) {
              return e.$$typeof === o;
            }(e);
          }(e);
        };

        var o = "function" == typeof Symbol && Symbol.for ? Symbol.for("react.element") : 60103;

        function r(e, t) {
          return !1 !== t.clone && t.isMergeableObject(e) ? a((i = e, Array.isArray(i) ? [] : {}), e, t) : e;
          var i;
        }

        function s(e, t, i) {
          return e.concat(t).map(function (e) {
            return r(e, i);
          });
        }

        function a(e, t, i) {
          (i = i || {}).arrayMerge = i.arrayMerge || s, i.isMergeableObject = i.isMergeableObject || n;
          var o = Array.isArray(t);
          return o === Array.isArray(e) ? o ? i.arrayMerge(e, t, i) : function (e, t, i) {
            var n = {};
            return i.isMergeableObject(e) && Object.keys(e).forEach(function (t) {
              n[t] = r(e[t], i);
            }), Object.keys(t).forEach(function (o) {
              i.isMergeableObject(t[o]) && e[o] ? n[o] = a(e[o], t[o], i) : n[o] = r(t[o], i);
            }), n;
          }(e, t, i) : r(t, i);
        }

        a.all = function (e, t) {
          if (!Array.isArray(e)) throw new Error("first argument should be an array");
          return e.reduce(function (e, i) {
            return a(e, i, t);
          }, {});
        };

        var c = a;
        t.default = c;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = void 0;
        var n,
            o = i(6),
            r = (n = i(15)) && n.__esModule ? n : {
          default: n
        };

        function s(e, t) {
          for (var i = 0; i < t.length; i++) {
            var n = t[i];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
          }
        }

        var a = function () {
          function e() {
            !function (e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e), this._store = (0, o.createStore)(r.default, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
          }

          var t, i;
          return t = e, (i = [{
            key: "subscribe",
            value: function value(e) {
              this._store.subscribe(e);
            }
          }, {
            key: "dispatch",
            value: function value(e) {
              this._store.dispatch(e);
            }
          }, {
            key: "isLoading",
            value: function value() {
              return this.state.general.loading;
            }
          }, {
            key: "getChoiceById",
            value: function value(e) {
              return !!e && this.activeChoices.find(function (t) {
                return t.id === parseInt(e, 10);
              });
            }
          }, {
            key: "getGroupById",
            value: function value(e) {
              return this.groups.find(function (t) {
                return t.id === parseInt(e, 10);
              });
            }
          }, {
            key: "state",
            get: function get() {
              return this._store.getState();
            }
          }, {
            key: "items",
            get: function get() {
              return this.state.items;
            }
          }, {
            key: "activeItems",
            get: function get() {
              return this.items.filter(function (e) {
                return !0 === e.active;
              });
            }
          }, {
            key: "highlightedActiveItems",
            get: function get() {
              return this.items.filter(function (e) {
                return e.active && e.highlighted;
              });
            }
          }, {
            key: "choices",
            get: function get() {
              return this.state.choices;
            }
          }, {
            key: "activeChoices",
            get: function get() {
              return this.choices.filter(function (e) {
                return !0 === e.active;
              });
            }
          }, {
            key: "selectableChoices",
            get: function get() {
              return this.choices.filter(function (e) {
                return !0 !== e.disabled;
              });
            }
          }, {
            key: "searchableChoices",
            get: function get() {
              return this.selectableChoices.filter(function (e) {
                return !0 !== e.placeholder;
              });
            }
          }, {
            key: "placeholderChoice",
            get: function get() {
              return [].concat(this.choices).reverse().find(function (e) {
                return !0 === e.placeholder;
              });
            }
          }, {
            key: "groups",
            get: function get() {
              return this.state.groups;
            }
          }, {
            key: "activeGroups",
            get: function get() {
              var e = this.groups,
                  t = this.choices;
              return e.filter(function (e) {
                var i = !0 === e.active && !1 === e.disabled,
                    n = t.some(function (e) {
                  return !0 === e.active && !1 === e.disabled;
                });
                return i && n;
              }, []);
            }
          }]) && s(t.prototype, i), e;
        }();

        t.default = a;
      }, function (e, t) {
        e.exports = function (e) {
          if (!e.webpackPolyfill) {
            var t = Object.create(e);
            t.children || (t.children = []), Object.defineProperty(t, "loaded", {
              enumerable: !0,
              get: function get() {
                return t.l;
              }
            }), Object.defineProperty(t, "id", {
              enumerable: !0,
              get: function get() {
                return t.i;
              }
            }), Object.defineProperty(t, "exports", {
              enumerable: !0
            }), t.webpackPolyfill = 1;
          }

          return t;
        };
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = void 0;
        var n = i(6),
            o = l(i(16)),
            r = l(i(17)),
            s = l(i(18)),
            a = l(i(19)),
            c = i(0);

        function l(e) {
          return e && e.__esModule ? e : {
            default: e
          };
        }

        var u = (0, n.combineReducers)({
          items: o.default,
          groups: r.default,
          choices: s.default,
          general: a.default
        }),
            h = function h(e, t) {
          var i = e;
          if ("CLEAR_ALL" === t.type) i = void 0;else if ("RESET_TO" === t.type) return (0, c.cloneObject)(t.state);
          return u(i, t);
        };

        t.default = h;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n,
              t = arguments.length > 1 ? arguments[1] : void 0;

          switch (t.type) {
            case "ADD_ITEM":
              var i = [].concat(e, [{
                id: t.id,
                choiceId: t.choiceId,
                groupId: t.groupId,
                value: t.value,
                label: t.label,
                active: !0,
                highlighted: !1,
                customProperties: t.customProperties,
                placeholder: t.placeholder || !1,
                keyCode: null
              }]);
              return i.map(function (e) {
                var t = e;
                return t.highlighted = !1, t;
              });

            case "REMOVE_ITEM":
              return e.map(function (e) {
                var i = e;
                return i.id === t.id && (i.active = !1), i;
              });

            case "HIGHLIGHT_ITEM":
              return e.map(function (e) {
                var i = e;
                return i.id === t.id && (i.highlighted = t.highlighted), i;
              });

            default:
              return e;
          }
        }, t.defaultState = void 0;
        var n = [];
        t.defaultState = n;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n,
              t = arguments.length > 1 ? arguments[1] : void 0;

          switch (t.type) {
            case "ADD_GROUP":
              return [].concat(e, [{
                id: t.id,
                value: t.value,
                active: t.active,
                disabled: t.disabled
              }]);

            case "CLEAR_CHOICES":
              return [];

            default:
              return e;
          }
        }, t.defaultState = void 0;
        var n = [];
        t.defaultState = n;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = function () {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n,
              t = arguments.length > 1 ? arguments[1] : void 0;

          switch (t.type) {
            case "ADD_CHOICE":
              return [].concat(e, [{
                id: t.id,
                elementId: t.elementId,
                groupId: t.groupId,
                value: t.value,
                label: t.label || t.value,
                disabled: t.disabled || !1,
                selected: !1,
                active: !0,
                score: 9999,
                customProperties: t.customProperties,
                placeholder: t.placeholder || !1,
                keyCode: null
              }]);

            case "ADD_ITEM":
              return t.activateOptions ? e.map(function (e) {
                var i = e;
                return i.active = t.active, i;
              }) : t.choiceId > -1 ? e.map(function (e) {
                var i = e;
                return i.id === parseInt(t.choiceId, 10) && (i.selected = !0), i;
              }) : e;

            case "REMOVE_ITEM":
              return t.choiceId > -1 ? e.map(function (e) {
                var i = e;
                return i.id === parseInt(t.choiceId, 10) && (i.selected = !1), i;
              }) : e;

            case "FILTER_CHOICES":
              return e.map(function (e) {
                var i = e;
                return i.active = t.results.some(function (e) {
                  var t = e.item,
                      n = e.score;
                  return t.id === i.id && (i.score = n, !0);
                }), i;
              });

            case "ACTIVATE_CHOICES":
              return e.map(function (e) {
                var i = e;
                return i.active = t.active, i;
              });

            case "CLEAR_CHOICES":
              return n;

            default:
              return e;
          }
        }, t.defaultState = void 0;
        var n = [];
        t.defaultState = n;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = t.defaultState = void 0;
        var n = {
          loading: !1
        };
        t.defaultState = n;

        var o = function o() {
          var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : n,
              t = arguments.length > 1 ? arguments[1] : void 0;

          switch (t.type) {
            case "SET_IS_LOADING":
              return {
                loading: t.isLoading
              };

            default:
              return e;
          }
        };

        t.default = o;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), Object.defineProperty(t, "Dropdown", {
          enumerable: !0,
          get: function get() {
            return n.default;
          }
        }), Object.defineProperty(t, "Container", {
          enumerable: !0,
          get: function get() {
            return o.default;
          }
        }), Object.defineProperty(t, "Input", {
          enumerable: !0,
          get: function get() {
            return r.default;
          }
        }), Object.defineProperty(t, "List", {
          enumerable: !0,
          get: function get() {
            return s.default;
          }
        }), Object.defineProperty(t, "WrappedInput", {
          enumerable: !0,
          get: function get() {
            return a.default;
          }
        }), Object.defineProperty(t, "WrappedSelect", {
          enumerable: !0,
          get: function get() {
            return c.default;
          }
        });
        var n = l(i(21)),
            o = l(i(22)),
            r = l(i(23)),
            s = l(i(24)),
            a = l(i(25)),
            c = l(i(26));

        function l(e) {
          return e && e.__esModule ? e : {
            default: e
          };
        }
      }, function (e, t, i) {

        function n(e, t) {
          for (var i = 0; i < t.length; i++) {
            var n = t[i];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
          }
        }

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = void 0;

        var o = function () {
          function e(t) {
            var i = t.element,
                n = t.type,
                o = t.classNames;
            !function (e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e), Object.assign(this, {
              element: i,
              type: n,
              classNames: o
            }), this.isActive = !1;
          }

          var t, i;
          return t = e, (i = [{
            key: "distanceFromTopWindow",
            value: function value() {
              return this.dimensions = this.element.getBoundingClientRect(), this.position = Math.ceil(this.dimensions.top + window.pageYOffset + this.element.offsetHeight), this.position;
            }
          }, {
            key: "getChild",
            value: function value(e) {
              return this.element.querySelector(e);
            }
          }, {
            key: "show",
            value: function value() {
              return this.element.classList.add(this.classNames.activeState), this.element.setAttribute("aria-expanded", "true"), this.isActive = !0, this;
            }
          }, {
            key: "hide",
            value: function value() {
              return this.element.classList.remove(this.classNames.activeState), this.element.setAttribute("aria-expanded", "false"), this.isActive = !1, this;
            }
          }]) && n(t.prototype, i), e;
        }();

        t.default = o;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = void 0;
        var n = i(0);

        function o(e, t) {
          for (var i = 0; i < t.length; i++) {
            var n = t[i];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
          }
        }

        var r = function () {
          function e(t) {
            var i = t.element,
                n = t.type,
                o = t.classNames,
                r = t.position;
            !function (e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e), Object.assign(this, {
              element: i,
              classNames: o,
              type: n,
              position: r
            }), this.isOpen = !1, this.isFlipped = !1, this.isFocussed = !1, this.isDisabled = !1, this.isLoading = !1, this._onFocus = this._onFocus.bind(this), this._onBlur = this._onBlur.bind(this);
          }

          var t, i;
          return t = e, (i = [{
            key: "addEventListeners",
            value: function value() {
              this.element.addEventListener("focus", this._onFocus), this.element.addEventListener("blur", this._onBlur);
            }
          }, {
            key: "removeEventListeners",
            value: function value() {
              this.element.removeEventListener("focus", this._onFocus), this.element.removeEventListener("blur", this._onBlur);
            }
          }, {
            key: "shouldFlip",
            value: function value(e) {
              var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : (0, n.getWindowHeight)();
              if (void 0 === e) return !1;
              var i = !1;
              return "auto" === this.position ? i = e >= t : "top" === this.position && (i = !0), i;
            }
          }, {
            key: "setActiveDescendant",
            value: function value(e) {
              this.element.setAttribute("aria-activedescendant", e);
            }
          }, {
            key: "removeActiveDescendant",
            value: function value() {
              this.element.removeAttribute("aria-activedescendant");
            }
          }, {
            key: "open",
            value: function value(e) {
              this.element.classList.add(this.classNames.openState), this.element.setAttribute("aria-expanded", "true"), this.isOpen = !0, this.shouldFlip(e) && (this.element.classList.add(this.classNames.flippedState), this.isFlipped = !0);
            }
          }, {
            key: "close",
            value: function value() {
              this.element.classList.remove(this.classNames.openState), this.element.setAttribute("aria-expanded", "false"), this.removeActiveDescendant(), this.isOpen = !1, this.isFlipped && (this.element.classList.remove(this.classNames.flippedState), this.isFlipped = !1);
            }
          }, {
            key: "focus",
            value: function value() {
              this.isFocussed || this.element.focus();
            }
          }, {
            key: "addFocusState",
            value: function value() {
              this.element.classList.add(this.classNames.focusState);
            }
          }, {
            key: "removeFocusState",
            value: function value() {
              this.element.classList.remove(this.classNames.focusState);
            }
          }, {
            key: "enable",
            value: function value() {
              this.element.classList.remove(this.classNames.disabledState), this.element.removeAttribute("aria-disabled"), "select-one" === this.type && this.element.setAttribute("tabindex", "0"), this.isDisabled = !1;
            }
          }, {
            key: "disable",
            value: function value() {
              this.element.classList.add(this.classNames.disabledState), this.element.setAttribute("aria-disabled", "true"), "select-one" === this.type && this.element.setAttribute("tabindex", "-1"), this.isDisabled = !0;
            }
          }, {
            key: "wrap",
            value: function value(e) {
              (0, n.wrap)(e, this.element);
            }
          }, {
            key: "unwrap",
            value: function value(e) {
              this.element.parentNode.insertBefore(e, this.element), this.element.parentNode.removeChild(this.element);
            }
          }, {
            key: "addLoadingState",
            value: function value() {
              this.element.classList.add(this.classNames.loadingState), this.element.setAttribute("aria-busy", "true"), this.isLoading = !0;
            }
          }, {
            key: "removeLoadingState",
            value: function value() {
              this.element.classList.remove(this.classNames.loadingState), this.element.removeAttribute("aria-busy"), this.isLoading = !1;
            }
          }, {
            key: "_onFocus",
            value: function value() {
              this.isFocussed = !0;
            }
          }, {
            key: "_onBlur",
            value: function value() {
              this.isFocussed = !1;
            }
          }]) && o(t.prototype, i), e;
        }();

        t.default = r;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = void 0;
        var n = i(0);

        function o(e, t) {
          for (var i = 0; i < t.length; i++) {
            var n = t[i];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
          }
        }

        var r = function () {
          function e(t) {
            var i = t.element,
                n = t.type,
                o = t.classNames,
                r = t.placeholderValue;
            !function (e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e), Object.assign(this, {
              element: i,
              type: n,
              classNames: o,
              placeholderValue: r
            }), this.element = i, this.classNames = o, this.isFocussed = this.element === document.activeElement, this.isDisabled = !1, this._onPaste = this._onPaste.bind(this), this._onInput = this._onInput.bind(this), this._onFocus = this._onFocus.bind(this), this._onBlur = this._onBlur.bind(this);
          }

          var t, i;
          return t = e, (i = [{
            key: "addEventListeners",
            value: function value() {
              this.element.addEventListener("input", this._onInput), this.element.addEventListener("paste", this._onPaste), this.element.addEventListener("focus", this._onFocus), this.element.addEventListener("blur", this._onBlur), this.element.form && this.element.form.addEventListener("reset", this._onFormReset);
            }
          }, {
            key: "removeEventListeners",
            value: function value() {
              this.element.removeEventListener("input", this._onInput), this.element.removeEventListener("paste", this._onPaste), this.element.removeEventListener("focus", this._onFocus), this.element.removeEventListener("blur", this._onBlur), this.element.form && this.element.form.removeEventListener("reset", this._onFormReset);
            }
          }, {
            key: "enable",
            value: function value() {
              this.element.removeAttribute("disabled"), this.isDisabled = !1;
            }
          }, {
            key: "disable",
            value: function value() {
              this.element.setAttribute("disabled", ""), this.isDisabled = !0;
            }
          }, {
            key: "focus",
            value: function value() {
              this.isFocussed || this.element.focus();
            }
          }, {
            key: "blur",
            value: function value() {
              this.isFocussed && this.element.blur();
            }
          }, {
            key: "clear",
            value: function value() {
              var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
              return this.element.value && (this.element.value = ""), e && this.setWidth(), this;
            }
          }, {
            key: "setWidth",
            value: function value(e) {
              var t = this,
                  i = function i(e) {
                t.element.style.width = e;
              };

              if (this._placeholderValue) {
                var n = this.element.value.length >= this._placeholderValue.length / 1.25;
                (this.element.value && n || e) && this.calcWidth(i);
              } else this.calcWidth(i);
            }
          }, {
            key: "calcWidth",
            value: function value(e) {
              return (0, n.calcWidthOfInput)(this.element, e);
            }
          }, {
            key: "setActiveDescendant",
            value: function value(e) {
              this.element.setAttribute("aria-activedescendant", e);
            }
          }, {
            key: "removeActiveDescendant",
            value: function value() {
              this.element.removeAttribute("aria-activedescendant");
            }
          }, {
            key: "_onInput",
            value: function value() {
              "select-one" !== this.type && this.setWidth();
            }
          }, {
            key: "_onPaste",
            value: function value(e) {
              e.target === this.element && this.preventPaste && e.preventDefault();
            }
          }, {
            key: "_onFocus",
            value: function value() {
              this.isFocussed = !0;
            }
          }, {
            key: "_onBlur",
            value: function value() {
              this.isFocussed = !1;
            }
          }, {
            key: "placeholder",
            set: function set(e) {
              this.element.placeholder = e;
            }
          }, {
            key: "value",
            set: function set(e) {
              this.element.value = e;
            },
            get: function get() {
              return (0, n.sanitise)(this.element.value);
            }
          }]) && o(t.prototype, i), e;
        }();

        t.default = r;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = void 0;
        var n = i(1);

        function o(e, t) {
          for (var i = 0; i < t.length; i++) {
            var n = t[i];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
          }
        }

        var r = function () {
          function e(t) {
            var i = t.element;
            !function (e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, e), Object.assign(this, {
              element: i
            }), this.scrollPos = this.element.scrollTop, this.height = this.element.offsetHeight, this.hasChildren = !!this.element.children;
          }

          var t, i;
          return t = e, (i = [{
            key: "clear",
            value: function value() {
              this.element.innerHTML = "";
            }
          }, {
            key: "append",
            value: function value(e) {
              this.element.appendChild(e);
            }
          }, {
            key: "getChild",
            value: function value(e) {
              return this.element.querySelector(e);
            }
          }, {
            key: "scrollToTop",
            value: function value() {
              this.element.scrollTop = 0;
            }
          }, {
            key: "scrollToChoice",
            value: function value(e, t) {
              var i = this;

              if (e) {
                var n = this.element.offsetHeight,
                    o = e.offsetHeight,
                    r = e.offsetTop + o,
                    s = this.element.scrollTop + n,
                    a = t > 0 ? this.element.scrollTop + r - s : e.offsetTop;
                requestAnimationFrame(function (e) {
                  i._animateScroll(e, a, t);
                });
              }
            }
          }, {
            key: "_scrollDown",
            value: function value(e, t, i) {
              var n = (i - e) / t,
                  o = n > 1 ? n : 1;
              this.element.scrollTop = e + o;
            }
          }, {
            key: "_scrollUp",
            value: function value(e, t, i) {
              var n = (e - i) / t,
                  o = n > 1 ? n : 1;
              this.element.scrollTop = e - o;
            }
          }, {
            key: "_animateScroll",
            value: function value(e, t, i) {
              var o = this,
                  r = n.SCROLLING_SPEED,
                  s = this.element.scrollTop,
                  a = !1;
              i > 0 ? (this._scrollDown(s, r, t), s < t && (a = !0)) : (this._scrollUp(s, r, t), s > t && (a = !0)), a && requestAnimationFrame(function () {
                o._animateScroll(e, t, i);
              });
            }
          }]) && o(t.prototype, i), e;
        }();

        t.default = r;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = void 0;
        var n,
            o = (n = i(4)) && n.__esModule ? n : {
          default: n
        };

        function r(e) {
          return (r = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
            return _typeof(e);
          } : function (e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
          })(e);
        }

        function s(e, t) {
          for (var i = 0; i < t.length; i++) {
            var n = t[i];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
          }
        }

        function a(e, t) {
          return !t || "object" !== r(t) && "function" != typeof t ? function (e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e;
          }(e) : t;
        }

        function c(e, t, i) {
          return (c = "undefined" != typeof Reflect && Reflect.get ? Reflect.get : function (e, t, i) {
            var n = function (e, t) {
              for (; !Object.prototype.hasOwnProperty.call(e, t) && null !== (e = l(e));) {
              }

              return e;
            }(e, t);

            if (n) {
              var o = Object.getOwnPropertyDescriptor(n, t);
              return o.get ? o.get.call(i) : o.value;
            }
          })(e, t, i || e);
        }

        function l(e) {
          return (l = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
            return e.__proto__ || Object.getPrototypeOf(e);
          })(e);
        }

        function u(e, t) {
          return (u = Object.setPrototypeOf || function (e, t) {
            return e.__proto__ = t, e;
          })(e, t);
        }

        var h = function (e) {
          function t(e) {
            var i,
                n = e.element,
                o = e.classNames,
                r = e.delimiter;
            return function (e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, t), (i = a(this, l(t).call(this, {
              element: n,
              classNames: o
            }))).delimiter = r, i;
          }

          var i, n;
          return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
            e.prototype = Object.create(t && t.prototype, {
              constructor: {
                value: e,
                writable: !0,
                configurable: !0
              }
            }), t && u(e, t);
          }(t, o.default), i = t, (n = [{
            key: "value",
            set: function set(e) {
              var t = e.map(function (e) {
                return e.value;
              }).join(this.delimiter);
              this.element.setAttribute("value", t), this.element.value = t;
            },
            get: function get() {
              return c(l(t.prototype), "value", this);
            }
          }]) && s(i.prototype, n), t;
        }();

        t.default = h;
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.default = void 0;
        var n = r(i(4)),
            o = r(i(5));

        function r(e) {
          return e && e.__esModule ? e : {
            default: e
          };
        }

        function s(e) {
          return (s = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function (e) {
            return _typeof(e);
          } : function (e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : _typeof(e);
          })(e);
        }

        function a(e, t) {
          for (var i = 0; i < t.length; i++) {
            var n = t[i];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n);
          }
        }

        function c(e, t) {
          return !t || "object" !== s(t) && "function" != typeof t ? function (e) {
            if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return e;
          }(e) : t;
        }

        function l(e) {
          return (l = Object.setPrototypeOf ? Object.getPrototypeOf : function (e) {
            return e.__proto__ || Object.getPrototypeOf(e);
          })(e);
        }

        function u(e, t) {
          return (u = Object.setPrototypeOf || function (e, t) {
            return e.__proto__ = t, e;
          })(e, t);
        }

        var h = function (e) {
          function t(e) {
            var i = e.element,
                n = e.classNames;
            return function (e, t) {
              if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
            }(this, t), c(this, l(t).call(this, {
              element: i,
              classNames: n
            }));
          }

          var i, r;
          return function (e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
            e.prototype = Object.create(t && t.prototype, {
              constructor: {
                value: e,
                writable: !0,
                configurable: !0
              }
            }), t && u(e, t);
          }(t, n.default), i = t, (r = [{
            key: "appendDocFragment",
            value: function value(e) {
              this.element.innerHTML = "", this.element.appendChild(e);
            }
          }, {
            key: "placeholderOption",
            get: function get() {
              return this.element.querySelector("option[placeholder]");
            }
          }, {
            key: "optionGroups",
            get: function get() {
              return Array.from(this.element.getElementsByTagName("OPTGROUP"));
            }
          }, {
            key: "options",
            get: function get() {
              return Array.from(this.element.options);
            },
            set: function set(e) {
              var t = document.createDocumentFragment();
              e.forEach(function (e) {
                return i = e, n = o.default.option(i), void t.appendChild(n);
                var i, n;
              }), this.appendDocFragment(t);
            }
          }]) && a(i.prototype, r), t;
        }();

        t.default = h;
      }, function (e, t, i) {
        var n;
        /*!
          Copyright (c) 2017 Jed Watson.
          Licensed under the MIT License (MIT), see
          http://jedwatson.github.io/classnames
        */

        /*!
          Copyright (c) 2017 Jed Watson.
          Licensed under the MIT License (MIT), see
          http://jedwatson.github.io/classnames
        */

        !function () {

          var i = {}.hasOwnProperty;

          function o() {
            for (var e = [], t = 0; t < arguments.length; t++) {
              var n = arguments[t];

              if (n) {
                var r = _typeof(n);

                if ("string" === r || "number" === r) e.push(n);else if (Array.isArray(n) && n.length) {
                  var s = o.apply(null, n);
                  s && e.push(s);
                } else if ("object" === r) for (var a in n) {
                  i.call(n, a) && n[a] && e.push(a);
                }
              }
            }

            return e.join(" ");
          }

          e.exports ? (o.default = o, e.exports = o) : void 0 === (n = function () {
            return o;
          }.apply(t, [])) || (e.exports = n);
        }();
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.clearChoices = t.activateChoices = t.filterChoices = t.addChoice = void 0;
        var n = i(1);

        t.addChoice = function (e) {
          var t = e.value,
              i = e.label,
              o = e.id,
              r = e.groupId,
              s = e.disabled,
              a = e.elementId,
              c = e.customProperties,
              l = e.placeholder,
              u = e.keyCode;
          return {
            type: n.ACTION_TYPES.ADD_CHOICE,
            value: t,
            label: i,
            id: o,
            groupId: r,
            disabled: s,
            elementId: a,
            customProperties: c,
            placeholder: l,
            keyCode: u
          };
        };

        t.filterChoices = function (e) {
          return {
            type: n.ACTION_TYPES.FILTER_CHOICES,
            results: e
          };
        };

        t.activateChoices = function () {
          var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0];
          return {
            type: n.ACTION_TYPES.ACTIVATE_CHOICES,
            active: e
          };
        };

        t.clearChoices = function () {
          return {
            type: n.ACTION_TYPES.CLEAR_CHOICES
          };
        };
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.highlightItem = t.removeItem = t.addItem = void 0;
        var n = i(1);

        t.addItem = function (e) {
          var t = e.value,
              i = e.label,
              o = e.id,
              r = e.choiceId,
              s = e.groupId,
              a = e.customProperties,
              c = e.placeholder,
              l = e.keyCode;
          return {
            type: n.ACTION_TYPES.ADD_ITEM,
            value: t,
            label: i,
            id: o,
            choiceId: r,
            groupId: s,
            customProperties: a,
            placeholder: c,
            keyCode: l
          };
        };

        t.removeItem = function (e, t) {
          return {
            type: n.ACTION_TYPES.REMOVE_ITEM,
            id: e,
            choiceId: t
          };
        };

        t.highlightItem = function (e, t) {
          return {
            type: n.ACTION_TYPES.HIGHLIGHT_ITEM,
            id: e,
            highlighted: t
          };
        };
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.addGroup = void 0;
        var n = i(1);

        t.addGroup = function (e, t, i, o) {
          return {
            type: n.ACTION_TYPES.ADD_GROUP,
            value: e,
            id: t,
            active: i,
            disabled: o
          };
        };
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.resetTo = t.clearAll = void 0;

        t.clearAll = function () {
          return {
            type: "CLEAR_ALL"
          };
        };

        t.resetTo = function (e) {
          return {
            type: "RESET_TO",
            state: e
          };
        };
      }, function (e, t, i) {

        Object.defineProperty(t, "__esModule", {
          value: !0
        }), t.setIsLoading = void 0;

        t.setIsLoading = function (e) {
          return {
            type: "SET_IS_LOADING",
            isLoading: e
          };
        };
      }]);
    });
  });
  var Choices = unwrapExports(choices_min);
  var choices_min_1 = choices_min.Choices;

  var select = (function () {
    if (document.querySelector('.select')) {
      var choices = new Choices('.select', {
        loadingText: 'Загрузка...',
        noResultsText: 'Результатов не найдено',
        noChoicesText: 'Нет вариантов для выбора',
        itemSelectText: 'Нажмите для выбора',
        placeholder: true,
        shouldSort: false
      });
    }
  });

  var field = (function () {
    if (document.querySelector('.js-check-all') && document.querySelector('.js-row-selection')) {
      var checkAll = document.querySelector('.js-check-all');
      var allChecks = document.querySelectorAll('.js-row-selection');
      checkAll.addEventListener('change', function () {
        if (checkAll.checked) {
          for (var i = 0; i < allChecks.length; i++) {
            allChecks[i].checked = true;
          }
        } else {
          for (var _i = 0; _i < allChecks.length; _i++) {
            allChecks[_i].checked = false;
          }
        }
      });
    }

    if (document.querySelector('.js-unique-link-field')) {
      var uniqueLinkField = document.querySelector('.js-unique-link-field');
      var uniqueLink = document.querySelector('.js-unique-link');
      uniqueLinkField.style.display = 'none';
      uniqueLink.addEventListener('change', function () {
        if (uniqueLink.checked) {
          uniqueLinkField.style.display = 'block';
        } else {
          uniqueLinkField.style.display = 'none';
        }
      });
    }
  });

  var tabControls = (function () {
    var tabControls = document.querySelectorAll('.js-tab-control');

    var _loop = function _loop(i) {
      tabControls[i].addEventListener('click', function () {
        var tabContainer = tabControls[i].closest('.js-tabs');
        var tabs = tabContainer.querySelectorAll('.js-tab');
        var siblings = [].slice.call(tabControls[i].parentNode.children).filter(function (v) {
          return v !== tabControls[i];
        });

        for (var j = 0; j < siblings.length; j++) {
          siblings[j].classList.remove('active');
        }

        tabs.forEach(function (el) {
          el.classList.remove('active');
        });
        tabControls[i].classList.add('active');
        tabs[i].classList.add('active');
      });
    };

    for (var i = 0; i < tabControls.length; i++) {
      _loop(i);
    }
  });

  var tail_datetimeFull_min = createCommonjsModule(function (module) {
    /* pytesNET/tail.DateTime v.0.4.14 | Full Version | @author SamBrishes, pytesNET <sam@pytes.net> | @license MIT */
    !function (t, e) {
        module.exports ? module.exports = e(t, t.document) : (void 0 === t.tail && (t.tail = {}), t.tail.DateTime = t.tail.datetime = e(t, t.document), "undefined" != typeof jQuery && (jQuery.fn.DateTime = jQuery.fn.datetime = function (t) {
        var e,
            i = [];
        return this.each(function () {
          !1 !== (e = tail.DateTime(this, t)) && i.push(e);
        }), 1 === i.length ? i[0] : 0 !== i.length && i;
      }), "undefined" != typeof MooTools && (Element.implement({
        DateTime: function DateTime(t) {
          return new tail.DateTime(this, t);
        }
      }), Element.implement({
        datetime: function datetime(t) {
          return new tail.DateTime(this, t);
        }
      })));
    }(window, function (d, h) {

      function u(t, e) {
        return !!(t && "classList" in t) && t.classList.contains(e);
      }

      function a(t, e) {
        return t && "classList" in t ? t.classList.add(e) : void 0;
      }

      function n(t, e) {
        return t && "classList" in t ? t.classList.remove(e) : void 0;
      }

      function s(t, e, i) {
        if (CustomEvent && CustomEvent.name) var a = new CustomEvent(e, i);else (a = h.createEvent("CustomEvent")).initCustomEvent(e, !!i.bubbles, !!i.cancelable, i.detail);
        return t.dispatchEvent(a);
      }

      function o(t, e) {
        if ("function" == typeof Object.assign) return Object.assign({}, t, e || {});
        var i = Object.constructor();

        for (var a in t) {
          i[a] = a in e ? e[a] : t[a];
        }

        return i;
      }

      function p(t, e) {
        var i = h.createElement(t);
        return i.className = e && e.join ? e.join(" ") : e || "", i;
      }

      function r(t) {
        return t.charAt(0).toUpperCase() + t.slice(1);
      }

      function l(t, e, i) {
        var a = t instanceof Date ? t : !!t && new Date(t);
        return a instanceof Date && !isNaN(a.getDate()) && (i && a.setHours(0, 0, 0, 0), !0 === e ? a.getTime() : a);
      }

      h.forms.inputmode = !0;

      var c = function c(t, e) {
        if ((t = "string" == typeof t ? h.querySelectorAll(t) : t) instanceof NodeList || t instanceof HTMLCollection || t instanceof Array) {
          for (var i = [], a = t.length, n = 0; n < a; n++) {
            i.push(new c(t[n], e));
          }

          return 1 === i.length ? i[0] : 0 !== i.length && i;
        }

        if (!(t instanceof Element)) return !1;
        if (!(this instanceof c)) return new c(t, e);
        if (c.inst[t.getAttribute("data-tail-datetime")]) return c.inst[t.getAttribute("data-tail-datetime")];

        if (t.getAttribute("data-datetime")) {
          var s = JSON.parse(t.getAttribute("data-datetime").replace(/\'/g, '"'));
          s instanceof Object && (e = o(e, s));
        }

        return this.e = t, this.id = ++c.count, this.con = o(c.defaults, e), (c.inst["tail-" + this.id] = this).e.setAttribute("data-tail-datetime", "tail-" + this.id), this.init();
      };

      return c.version = "0.4.14", c.status = "beta", c.count = 0, c.inst = {}, c.defaults = {
        animate: !0,
        classNames: !1,
        closeButton: !0,
        dateFormat: "YYYY-mm-dd",
        dateStart: !1,
        dateRanges: [],
        dateBlacklist: !0,
        dateEnd: !1,
        locale: "en",
        position: "bottom",
        rtl: "auto",
        startOpen: !1,
        stayOpen: !1,
        time12h: !1,
        timeFormat: "HH:ii:ss",
        timeHours: !0,
        timeMinutes: !0,
        timeSeconds: 0,
        timeIncrement: !0,
        timeStepHours: 1,
        timeStepMinutes: 5,
        timeStepSeconds: 5,
        today: !0,
        tooltips: [],
        viewDefault: "days",
        viewDecades: !0,
        viewYears: !0,
        viewMonths: !0,
        viewDays: !0,
        weekStart: 0
      }, c.strings = {
        ar: {
          months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
          days: ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
          shorts: ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"],
          time: ["ساعة", "دقيقة", "ثانية"],
          header: ["إختر الشهر", "إخنر السنة", "إختر العقد", "إختر الوقت"]
        },
        cs: {
          months: ["Leden", "Únor", "Březen", "Duben", "Květen", "Červen", "Červenec", "Srpen", "Září", "Říjen", "Listopad", "Prosinec"],
          days: ["Neděle", "Pondělí", "Úterý", "Středa", "Čtvrtek", "Pátek", "Sobota"],
          shorts: ["NE", "PO", "ÚT", "ST", "ČT", "PÁ", "SO"],
          time: ["Hodiny", "Minuty", "Sekundy"],
          header: ["Vyberte měsíc", "Vyberte rok", "Vyberte desetiletí", "Vyberte čas"]
        },
        de: {
          months: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
          days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
          shorts: ["SO", "MO", "DI", "MI", "DO", "FR", "SA"],
          time: ["Stunden", "Minuten", "Sekunden"],
          header: ["Wähle einen Monat", "Wähle ein Jahr", "Wähle ein Jahrzehnt", "Wähle eine Uhrzeit"]
        },
        de_AT: {
          months: ["Jänner", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
          days: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
          shorts: ["SO", "MO", "DI", "MI", "DO", "FR", "SA"],
          time: ["Stunden", "Minuten", "Sekunden"],
          header: ["Wähle einen Monat", "Wähle ein Jahr", "Wähle ein Jahrzehnt", "Wähle eine Uhrzeit"]
        },
        el: {
          months: ["Ιανουάριος", "Φεβρουάριος", "Μάρτιος", "Απρίλιος", "Μάιος", "Ιούνιος", "Ιούλιος", "Αύγουστος", "Σεπτέμβριος", "Οκτώβριος", "Νοέμβριος", "Δεκέμβριος"],
          days: ["Κυριακή", "Δευτέρα", "Τρίτη", "Τετάρτη", "Πέμπτη", "Παρασκευή", "Σάββατο"],
          shorts: ["ΚΥΡ", "ΔΕΥ", "ΤΡΙ", "ΤΕΤ", "ΠΕΜ", "ΠΑΡ", "ΣΑΒ"],
          time: ["Ώρες", "Λεπτά", "Δευτερόλεπτα"],
          header: ["Επιλογή Μηνός", "Επιλογή Έτους", "Επιλογή Δεκαετίας", "Επιλογή Ώρας"]
        },
        en: {
          months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          shorts: ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"],
          time: ["Hours", "Minutes", "Seconds"],
          header: ["Select a Month", "Select a Year", "Select a Decade", "Select a Time"]
        },
        es: {
          months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
          days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
          shorts: ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"],
          time: ["Horas", "Minutos", "Segundos"],
          header: ["Selecciona un mes", "Seleccione un año", "Seleccione un década", "Seleccione una hora"]
        },
        es_MX: {
          months: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
          days: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
          shorts: ["DO", "LU", "MA", "MI", "JU", "VI", "SÁ"],
          time: ["Horas", "Minutos", "Segundos"],
          header: ["Selecciona un Mes", "Selecciona un Año", "Selecciona una Decada", "Selecciona la Hora"]
        },
        fi: {
          months: ["Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu", "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"],
          days: ["Sunnuntai", "Maanantai", "Tiistai", "Keskiviikko", "Torstai", "Perjantai", "Lauantai"],
          shorts: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
          time: ["Tunnit", "Minuutit", "Sekuntit"],
          header: ["Valitse kuukausi", "Valitse vuosi", "Valitse vuosikymmen", "Valitse aika"]
        },
        fr: {
          months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
          days: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
          shorts: ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"],
          time: ["Heure", "Minute", "Seconde"],
          header: ["Choisissez un mois", "Choisissez une année", "Choisissez une décénie", "Kies een Tijdstip"]
        },
        id: {
          months: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"],
          days: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
          shorts: ["MIN", "SEN", "SEL", "RAB", "KAM", "JUM", "SAB"],
          time: ["Jam", "Menit", "Detik"],
          header: ["Pilih Bulan", "Pilih Tahun", "Pilih Dekade", "Pilih Jam"]
        },
        it: {
          months: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
          days: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
          shorts: ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"],
          time: ["Ore", "Minuti", "Secondi"],
          header: ["Seleziona un mese", "Seleziona un anno", "Seleziona un decennio", "Seleziona un orario"]
        },
        ko: {
          months: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
          days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
          shorts: ["일", "월", "화", "수", "목", "금", "토"],
          time: ["시", "분", "초"],
          header: ["월 선택", "연도 선택", "연대 선택", "시간 선택"]
        },
        nl: {
          months: ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"],
          days: ["Zondag", "Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag"],
          shorts: ["ZO", "MA", "DI", "WO", "DO", "VR", "ZA"],
          time: ["Uur", "Minuten", "Seconden"],
          header: ["Kies een Maand", "Kies een Jaar", "Kies een Decennium", "Kies een Tijdstip"]
        },
        no: {
          months: ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"],
          days: ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"],
          shorts: ["SØN", "MAN", "TIR", "ONS", "TOR", "FRE", "LØR"],
          time: ["Timer", "Minutter", "Sekunder"],
          header: ["Velg måned", "Velg år", "Velg tiår", "Velg klokkeslett"]
        },
        pl: {
          months: ["Styczeń", "Luty", "Marzec", "Kwiecień", "Maj", "Czerwiec", "Lipiec", "Sierpień", "Wrzesień", "Październik", "Listopad", "Grudzień"],
          days: ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"],
          shorts: ["ND", "PN", "WT", "ŚR", "CZW", "PT", "SOB"],
          time: ["Godzina", "Minuta", "Sekunda"],
          header: ["Wybierz miesiąc", "Wybierz rok", "Wybierz dekadę", "Wybierz czas"]
        },
        pt_BR: {
          months: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
          days: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
          shorts: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
          time: ["Horas", "Minutos", "Segundos"],
          header: ["Escolha um mês", "Escolha um ano", "Escolha uma década", "Escolha um horário"]
        },
        ru: {
          months: ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"],
          days: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
          shorts: ["вс", "пн", "вт", "ср", "чт", "пт", "сб"],
          time: ["часов", "минут", "секунд"],
          header: ["Выберите месяц", "Выберите год", "Выберите Десятилетие", "Выберите время"]
        },
        tr: {
          months: ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"],
          days: ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"],
          shorts: ["PA", "PT", "SA", "ÇA", "PE", "CU", "CT"],
          time: ["Saat", "Dakika", "Saniye"],
          header: ["Ay Seçin", "Yıl Seçin", "On Yıl Seçin", "Zaman Seçin"]
        },
        modify: function modify(t, e, i) {
          if (!(t in this)) return !1;
          if (e instanceof Object) for (var a in e) {
            this.modify(t, a, e[a]);
          } else this[t][e] = "string" == typeof i ? i : this[t][e];
          return !0;
        },
        register: function register(t, e) {
          return "string" == typeof t && e instanceof Object && (this[t] = e, !0);
        }
      }, c.prototype = {
        init: function init() {
          this.prepare();

          var t = this.__.shorts.slice(this.con.weekStart).concat(this.__.shorts.slice(0, this.con.weekStart));

          this.weekdays = "<thead>\n<tr>\n";

          for (var e = 0; e < 7; e++) {
            this.weekdays += '<th class="calendar-week">' + t[e] + "</th>";
          }

          this.weekdays += "\n</tr>\n</thead>", this.select = l(this.e.getAttribute("data-value") || this.e.value), (!this.select || this.select < this.con.dateStart || this.select > this.con.dateEnd) && (this.select = null), null == this.view && (this.view = {
            type: this.con.viewDefault,
            date: this.select || new Date()
          });
          var i = ["Hours", "Minutes", "Seconds"];

          for (e = 0; e < 3; e++) {
            if ("number" == typeof this.con["time" + i[e]]) this.view.date["set" + i[e]](this.con["time" + i[e]]);else for (; this.view.date["get" + i[e]]() % this.con["timeStep" + i[e]] != 0;) {
              this.view.date["set" + i[e]](this.view.date["get" + i[e]]() + 1);
            }
          }

          return this.ampm = !!this.con.time12h && 12 < this.view.date.getHours(), this.events = {}, this.dt = this.renderCalendar(), this.con.startOpen && this.open(), this.select && this.selectDate(this.select), this.bind();
        },
        prepare: function prepare() {
          if (this.__ = o(c.strings.en, c.strings[this.con.locale] || {}), this.con.dateStart = l(this.con.dateStart, !0, !0) || -9999999999999, this.con.dateEnd = l(this.con.dateEnd, !0, !0) || 9999999999999, this.con.viewDefault = this.con.dateFormat ? this.con.viewDefault : "time", "string" == typeof this.con.weekStart && (this.con.weekStart = c.strings.en.shorts.indexOf(this.con.weekStart)), this.con.weekStart < 0 && 6 < this.con.weekStart && (this.con.weekStart = 0), 0 < this.con.dateRanges.length) {
            for (var t = [], e = (n = this.con.dateRanges).length, i = 0; i < e; i++) {
              n[i] instanceof Object && (n[i].start || n[i].days) && (!1 === (n[i].start = l(n[i].start || !1, !0, !0)) ? n[i].start = n[i].end = 1 / 0 : (!1 === (n[i].end = l(n[i].end || !1, !0, !0)) && (n[i].end = n[i].start), n[i].start = n[i].start > n[i].end ? [n[i].end, n[i].end = n[i].start][0] : n[i].start), n[i].days = !("days" in n[i]) || n[i].days, n[i].days = "boolean" != typeof n[i].days ? function (t) {
                for (var e = [], i = t.length, a = 0; a < i; a++) {
                  "string" == typeof t[a] && (t[a] = c.strings.en.shorts.indexOf(t[a])), 0 <= t[a] && t[a] <= 6 && e.push(t[a]);
                }

                return e;
              }(n[i].days instanceof Array ? n[i].days : [n[i].days]) : [0, 1, 2, 3, 4, 5, 6], t.push({
                start: n[i].start,
                end: n[i].end,
                days: n[i].days
              }));
            }

            this.con.dateRanges = t;
          }

          if (0 < this.con.tooltips.length) {
            t = [];
            var a,
                n,
                s = this.con.tooltips;

            for (e = s.length, i = 0; i < e; i++) {
              s[i] instanceof Object && s[i].date && (s[i].date instanceof Array ? (a = l(s[i].date[0] || !1, !0, !0), n = l(s[i].date[1] || !1, !0, !0) || a) : a = n = l(s[i].date || !1, !0, !0), a && t.push({
                date: a !== n ? [a, n] : a,
                text: s[i].text || "Tooltip",
                color: s[i].color || "inherit",
                element: s[i].element || (r = h.createElement("DIV"), r.className = "calendar-tooltip", r.innerHTML = '<div class="tooltip-inner">' + s[i].text || "Tooltip</div>", r)
              }));
            }

            this.con.tooltips = t;
          }

          var r;
          return this;
        },
        bind: function bind() {
          var e = this;
          return void 0 === this._bind && (this.e.addEventListener("focusin", function (t) {
            e.open.call(e);
          }), this.e.addEventListener("keyup", function (t) {
            e.callback.call(e, t);
          }), h.addEventListener("keyup", function (t) {
            e.dt.contains(t.target) && e.callback.call(e, t);
          }), h.addEventListener("click", function (t) {
            e.dt.contains(t.target) ? e.callback.call(e, t) : !e.e.contains(t.target) && u(e.dt, "calendar-open") && (t.target == e.dt || t.target == e.e || e.con.stayOpen || e.close.call(e));
          }), h.addEventListener("mouseover", function (t) {
            e.dt.contains(t.target) && e.callback.call(e, t);
          }), this._bind = !0), this;
        },
        callback: function callback(t) {
          var e,
              i = t.target,
              a = "getAttribute",
              n = "data-action",
              s = i[a](n) ? i : i.parentElement[a](n) ? i.parentElement : i,
              r = "data-tooltip";

          if ("mouseover" == t.type && (!1 !== (e = i[a](r) ? i : !!s[a](r) && s) ? this.dt.querySelector("#tooltip-" + e[a](r) + "-" + e[a](r + "-time")) || this.showTooltip(e[a](r), e, e[a](r + "-time")) : this.dt.querySelector(".calendar-tooltip:not(.remove)") && this.hideTooltip(this.dt.querySelector(".calendar-tooltip").id.slice(8))), "click" == t.type) {
            if (!s || 1 != t.buttons && 1 != (t.which || t.button)) return;
            if (s.hasAttribute("data-disabled")) return;

            switch (s[a](n)) {
              case "prev":
              case "next":
                return this.browseView(s[a](n));

              case "cancel":
                this.con.stayOpen || this.close();
                break;

              case "submit":
                return this.con.stayOpen || this.close(), this.selectDate(this.fetchDate(parseInt(s[a]("data-date"))));

              case "view":
                return this.switchDate(s[a]("data-year") || null, s[a]("data-month") || null, s[a]("data-day") || null), this.switchView(s[a]("data-view"));
            }
          }

          if ("keyup" == t.type) {
            if ("INPUT" != t.target.tagName && t.target !== this.e && /calendar-(static|close)/i.test(this.dt.className)) return !1;
            13 == (t.keyCode || t.which) && (this.selectDate(this.fetchDate(this.select)), t.stopPropagation(), this.con.stayOpen || this.close()), 27 == (t.keyCode || t.which) && (this.con.stayOpen || this.close());
          }
        },
        trigger: function trigger(t) {
          var e = {
            bubbles: !1,
            cancelable: !0,
            detail: {
              args: arguments,
              self: this
            }
          };
          "change" == t && (s(this.e, "input", e), s(this.e, "change", e)), s(this.dt, "tail::" + t, e);

          for (var i = (this.events[t] || []).length, a = 0; a < i; a++) {
            this.events[t][a].cb.apply(this, function (t, e, i) {
              for (var a = e.length, n = 0; n < a; ++n) {
                t[n - 1] = e[n];
              }

              return t[n] = i, t;
            }(new Array(arguments.length), arguments, this.events[t][a].args));
          }

          return !0;
        },
        calcPosition: function calcPosition() {
          var t = this.dt.style,
              e = d.getComputedStyle(this.dt),
              i = parseInt(e.marginLeft) + parseInt(e.marginRight),
              a = parseInt(e.marginTop) + parseInt(e.marginBottom),
              n = this.e.getBoundingClientRect().top + d.scrollY,
              s = this.e.getBoundingClientRect().left - d.scrollX,
              r = this.e.offsetWidth || 0,
              o = this.e.offsetHeight || 0;

          switch (t.visibility = "hidden", this.con.position) {
            case "top":
              var l = n - (this.dt.offsetHeight + a),
                  c = s + r / 2 - (this.dt.offsetWidth / 2 + i / 2);
              break;

            case "left":
              l = n + o / 2 - (this.dt.offsetHeight / 2 + a), c = s - (this.dt.offsetWidth + i);
              break;

            case "right":
              l = n + o / 2 - (this.dt.offsetHeight / 2 + a), c = s + r;
              break;

            default:
              l = n + o, c = s + r / 2 - (this.dt.offsetWidth / 2 + i / 2);
          }

          return t.top = (0 <= l ? l : this.e.offsetTop) + "px", t.left = (0 <= c ? c : 0) + "px", t.visibility = "visible", this;
        },
        convertDate: function convertDate(t, e) {
          var i,
              a = {
            H: String("00" + t.getHours()).toString().slice(-2),
            G: (i = t.getHours(), i % 12 ? i % 12 : 12),
            A: 12 <= t.getHours() ? "PM" : "AM",
            a: 12 <= t.getHours() ? "pm" : "am",
            i: String("00" + t.getMinutes()).toString().slice(-2),
            s: String("00" + t.getSeconds()).toString().slice(-2),
            Y: t.getFullYear(),
            y: parseInt(t.getFullYear().toString().slice(2)),
            m: String("00" + (t.getMonth() + 1)).toString().slice(-2),
            M: this.__.months[t.getMonth()].slice(0, 3),
            F: this.__.months[t.getMonth()],
            d: String("00" + t.getDate()).toString().slice(-2),
            D: this.__.days[t.getDay()],
            l: this.__.shorts[t.getDay()].toLowerCase()
          };
          return e.replace(/([HGismd]{1,2}|[Y]{2,4}|y{2})/g, function (t) {
            return 4 == t.length || 2 == t.length ? a[t.slice(-1)].toString().slice(-Math.abs(t.length)) : 1 == t.length && "0" == t[0] ? a[t.slice(-1)].toString().slice(-1) : a[t.slice(-1)].toString();
          }).replace(/(A|a|M|F|D|l)/g, function (t) {
            return a[t];
          });
        },
        renderCalendar: function renderCalendar() {
          var t = ["tail-datetime-calendar", "calendar-close"],
              e = !0 === this.con.classNames ? this.e.className.split(" ") : this.con.classNames;

          if (["top", "left", "right", "bottom"].indexOf(this.con.position) < 0) {
            var i = h.querySelector(this.con.position);
            t.push("calendar-static");
          }

          (!0 === this.con.rtl || 0 <= ["ar", "he", "mdr", "sam", "syr"].indexOf(this.con.rtl)) && t.push("rtl"), this.con.stayOpen && t.push("calendar-stay"), (e = "function" == typeof e.split ? e.split(" ") : e) instanceof Array && (t = t.concat(e));
          var a = p("DIV", t),
              n = !1;

          if (a.id = "tail-datetime-" + this.id, this.con.dateFormat ? n = '<span class="action action-prev" data-action="prev"></span><span class="label" data-action="view" data-view="up"></span><span class="action action-next" data-action="next"></span>' : this.con.timeFormat && (n = '<span class="action action-submit" data-action="submit"></span><span class="label"></span><span class="action action-cancel" data-action="cancel"></span>'), a.innerHTML = n ? '<div class="calendar-actions">' + n + "</div>" : "", this.con.dateFormat && this.renderDatePicker(a, this.con.viewDefault), this.con.timeFormat && this.renderTimePicker(a), this.con.closeButton && !i) {
            var s = p("BUTTON", "calendar-close"),
                r = this;
            s.addEventListener("click", function (t) {
              t.preventDefault(), r.close();
            }), a.appendChild(s);
          }

          return (i || h.body).appendChild(a), a;
        },
        renderDatePicker: function renderDatePicker(t, e) {
          if ((!e || ["decades", "years", "months", "days"].indexOf(e) < 0) && (e = this.con.viewDays ? "days" : this.con.viewMonths ? "months" : this.con.viewYears ? "years" : !!this.con.viewDecades && "decades"), !e || !this.con["view" + r(e)] || !this.con.dateFormat) return !1;
          var i = h.createElement("DIV");
          return i.className = "calendar-datepicker calendar-view-" + e, i.innerHTML = this["view" + r(e)](), t.querySelector(".calendar-datepicker") ? t.replaceChild(i, t.querySelector(".calendar-datepicker")) : t.appendChild(i), this.view.type = e, this.handleLabel(t);
        },
        renderTimePicker: function renderTimePicker(t) {
          if (!this.con.timeFormat) return !1;
          var e,
              i,
              a = [],
              n = 0;

          if (this.con.time12h) {
            var s = 12 < this.view.date.getHours() ? 'checked="checked" ' : "";
            a.push('<label class="timepicker-switch" data-am="AM" data-pm="PM"><input type="checkbox" value="1" data-input="PM" ' + s + "/><span></span></label>");
          }

          for (var r in {
            Hours: 0,
            Minutes: 0,
            Seconds: 0
          }) {
            !1 !== this.con["time" + r] ? ((e = h.createElement("INPUT")).type = "text", e.disabled = null === this.con["time" + r], e.setAttribute("min", "Hours" === r && this.con.time12h ? "01" : "00"), e.setAttribute("max", "Hours" !== r ? "60" : this.con.time12h ? "13" : "24"), e.setAttribute("step", this.con["timeStep" + r]), e.setAttribute("value", (i = this.view.date["get" + r]()) < 10 ? "0" + i : i), e.setAttribute("pattern", "d*"), e.setAttribute("inputmode", "numeric"), e.setAttribute("data-input", r.toLowerCase()), a.push('<div class="timepicker-field timepicker-' + r.toLowerCase() + '">' + e.outerHTML + '<button class="picker-step step-up"></button><button class="picker-step step-down"></button><label>' + this.__.time[n++] + "</label></div>")) : a.push((n++, null));
          }

          var o = p("DIV", "calendar-timepicker"),
              l = this;
          o.innerHTML = a.join("\n");
          var c = o.querySelectorAll("input");

          for (n = 0; n < c.length; n++) {
            "checkbox" !== c[n].type ? (c[n].addEventListener("input", function (t) {
              l.handleTime.call(l, this);
            }), c[n].addEventListener("keydown", function (t) {
              var e = event.keyCode || event.which || 0;
              if (38 === e || 40 === e) return t.preventDefault(), l.handleStep.call(l, this, 38 === e ? "up" : "down"), !1;
            })) : c[n].addEventListener("change", function (t) {
              l.handleTime.call(l, this);
            });
          }

          for (c = o.querySelectorAll("button"), n = 0; n < c.length; n++) {
            c[n].addEventListener("mousedown", function (t) {
              t.preventDefault();
              var e = this.parentElement.querySelector("input");
              return l.handleStep.call(l, e, u(this, "step-up") ? "up" : "down"), !1;
            });
          }

          var d = t.querySelector(".calendar-timepicker");
          return t[d ? "replaceChild" : "appendChild"](o, d), this.handleLabel(t);
        },
        handleTime: function handleTime(t) {
          this.con.time12h && "checkbox" === t.type && (this.ampm = t.checked);
          var e = t.parentElement.parentElement;
          e = [e.querySelector("input[data-input=hours]") || {
            value: 0
          }, e.querySelector("input[data-input=minutes]") || {
            value: 0
          }, e.querySelector("input[data-input=seconds]") || {
            value: 0
          }], this.selectTime(parseInt(e[0].value) + (this.ampm ? 12 : 0), parseInt(e[1].value), parseInt(e[2].value)), e[2].value = this.view.date.getSeconds(), e[1].value = this.view.date.getMinutes(), this.con.time12h ? e[0].value = 12 < this.view.date.getHours() ? this.view.date.getHours() - 12 : this.view.date.getHours() : e[0].value = this.view.date.getHours();
        },
        handleStep: function handleStep(t, e, i) {
          var a = null,
              n = parseInt(t.value),
              s = parseInt(t.getAttribute("min")),
              r = parseInt(t.getAttribute("max")),
              o = t.getAttribute("data-input"),
              l = parseInt(t.getAttribute("step"));

          if ("up" === e ? (a = r <= n + l || null, t.value = r <= n + l ? 13 === r ? 1 : 0 : n + l, this.ampm = !!this.con.time12h && 12 <= this.view.date.getHours() + 1) : "down" === e && (a = !(n - l < s) && null, t.value = n - l < s ? r - l : n - l, this.ampm = !!this.con.time12h && this.view.date.getHours() - 1 <= 0), t.value < 10 && (t.value = "0" + t.value), this.con.timeIncrement && null !== a) {
            var c = t.parentElement.previousElementSibling;
            c && !1 === c.disabled ? this.handleStep(c.querySelector("input"), a ? "up" : "down", !0) : "hours" == o && this.view.date.setDate(this.view.date.getDate() + (a ? 1 : -1));
          }

          if (void 0 !== i && !0 === i) return !1;
          var d = t.parentElement.parentElement;

          if (this.selectTime(parseInt((d.querySelector("input[data-input=hours]") || {
            value: 0
          }).value) + (this.ampm ? 12 : 0), parseInt((d.querySelector("input[data-input=minutes]") || {
            value: 0
          }).value), parseInt((d.querySelector("input[data-input=seconds]") || {
            value: 0
          }).value)), this.con.time12h) {
            var h = t.parentElement.parentElement.querySelector("input[type=checkbox]");
            h && h.checked !== 12 < this.view.date.getHours() && (h.checked = 12 < this.view.date.getHours());
          }

          return !0;
        },
        handleLabel: function handleLabel(t) {
          var e,
              i,
              a = t.querySelector(".label");

          switch (this.view.type) {
            case "days":
              e = this.__.months[this.view.date.getMonth()] + ", " + this.view.date.getFullYear();
              break;

            case "months":
              e = this.view.date.getFullYear();
              break;

            case "years":
              e = (i = parseInt(this.view.date.getFullYear().toString().slice(0, 3) + "0")) + " - " + (i + 10);
              break;

            case "decades":
              e = (i = parseInt(this.view.date.getFullYear().toString().slice(0, 2) + "00")) + " - " + (i + 100);
              break;

            case "time":
              e = this.__.header[3];
          }

          return a.innerText = e, t;
        },
        viewDecades: function viewDecades() {
          var t = this.view.date.getFullYear(),
              e = new Date(this.view.date.getTime()),
              i = this.con.today ? new Date().getYear() : 0;
          e.setFullYear(t - parseInt(t.toString()[3]) - 30);

          for (var a, n, s = [], r = [], o = 1; o <= 16; o++) {
            a = "calendar-decade" + (i >= e.getYear() && i <= e.getYear() + 10 ? " date-today" : ""), n = 'data-action="view" data-view="down" data-year="' + e.getFullYear() + '"', s.push('<td class="' + a + '" ' + n + '><span class="inner">' + e.getFullYear() + " - " + (e.getFullYear() + 10) + "</span></td>"), 4 <= o && o % 4 == 0 && (r.push("<tr>\n" + s.join("\n") + "\n</tr>"), s = []), e.setFullYear(e.getFullYear() + 10);
          }

          return '<table class="calendar-decades"><thead><tr><th colspan="4">' + this.__.header[2] + "</th></tr></thead><tbody>" + r.join("\n") + "</tbody></table>";
        },
        viewYears: function viewYears() {
          var t = this.view.date.getFullYear(),
              e = new Date(this.view.date.getTime()),
              i = this.con.today ? new Date().getYear() : 0;
          e.setFullYear(t - parseInt(t.toString()[3]) - 2);

          for (var a, n, s = [], r = [], o = 1; o <= 16; o++) {
            a = "calendar-year" + (e.getYear() == i ? " date-today" : ""), n = 'data-action="view" data-view="down" data-year="' + e.getFullYear() + '"', s.push('<td class="' + a + '" ' + n + '><span class="inner">' + e.getFullYear() + "</span></td>"), 4 <= o && o % 4 == 0 && (r.push("<tr>\n" + s.join("\n") + "\n</tr>"), s = []), e.setFullYear(e.getFullYear() + 1);
          }

          return '<table class="calendar-years"><thead><tr><th colspan="4">' + this.__.header[1] + "</th></tr></thead><tbody>" + r.join("\n") + "</tbody></table>";
        },
        viewMonths: function viewMonths() {
          var t = this.__.months,
              e = this.con.today ? new Date().getMonth() : -1;
          e = this.view.date.getYear() == new Date().getYear() ? e : -1;

          for (var i, a, n = [], s = [], r = 0; r < 12; r++) {
            i = "calendar-month" + (e == r ? " date-today" : ""), a = 'data-action="view" data-view="down" data-month="' + r + '"', n.push('<td class="' + i + '" ' + a + '><span class="inner">' + t[r] + "</span></td>"), 3 == n.length && (s.push("<tr>\n" + n.join("\n") + "\n</tr>"), n = []);
          }

          return '<table class="calendar-months"><thead><tr><th colspan="3">' + this.__.header[0] + "</th></tr></thead><tbody>" + s.join("\n") + "</tbody></table>";
        },
        viewDays: function viewDays() {
          var i,
              t,
              e,
              a,
              n,
              s,
              r = new Date(this.view.date.getTime()),
              o = new Date().toDateString(),
              l = r.getMonth(),
              c = [],
              d = [],
              h = [0, []],
              u = ([].concat(this.con.tooltips), [0, 0]);

          for (r.setHours(0, 0, 0, 0), r.setDate(1), r.setDate(1 - (r.getDay() - this.con.weekStart)); d.length < 6;) {
            i = r.getTime(), s = [].concat(this.con.dateRanges), e = 'data-action="submit" data-date="' + r.getTime() + '"', t = "calendar-day date-" + (r.getMonth() > l ? "next" : r.getMonth() < l ? "previous" : "current"), this.con.today && o == r.toDateString() && (t += " date-today"), this.con.dateBlacklist && (i < this.con.dateStart || i > this.con.dateEnd) ? h = [i < this.con.dateStart ? this.con.dateStart : 1 / 0, [0, 1, 2, 3, 4, 5, 6], !0] : 0 < this.con.dateRanges.length ? s.filter(function (t) {
              return t.start == 1 / 0 || i >= t.start && i <= t.end ? !(h = [t.end, t.days]) : t.start > i;
            }, this) : 3 == h.length && (h = [0, [0, 1, 2, 3, 4, 5, 6]]), 0 < this.con.tooltips.length && this.con.tooltips.filter(function (t, e) {
              t.date instanceof Array ? t.date[0] <= i && t.date[1] >= i && (u = [t.date[1], e, t.color]) : t.date == i && (u = [t.date, e, t.color]);
            }, this), u[0] < i && (u = [0, 0]), (n = h[0] >= i && 0 <= h[1].indexOf(r.getDay())) && this.con.dateBlacklist || !n && !this.con.dateBlacklist ? (t += " date-disabled", e += ' data-disabled="true"') : 0 !== h[0] && h[0] <= i && (h = [0, []]), this.select && this.select.toDateString() == r.toDateString() && (t += " date-select"), a = '<span class="inner">' + r.getDate() + "</span>", 0 < u[0] && (t += " date-tooltip", e += ' data-tooltip="' + u[1] + '" data-tooltip-time="' + i + '"', "inherit" !== u[2] ? a += '<span class="tooltip-tick" style="background:' + u[2] + ';"></span>' : a += '<span class="tooltip-tick"></span>'), c.push('<td class="' + t + '" ' + e + ">" + a + "</td>"), 7 == c.length && (d.push("<tr>\n" + c.join("\n") + "\n</tr>"), c = []), r.setDate(r.getDate() + 1);
          }

          return d = "<tbody>" + d.join("\n") + "</tbody>", '<table class="calendar-days">' + this.weekdays + d + "</table>";
        },
        showTooltip: function showTooltip(t, e, i) {
          var a,
              n = this.con.tooltips[t].element,
              s = n.style,
              r = this.dt.querySelector(".calendar-datepicker");
          s.cssText = "opacity:0;visibility:hidden;", n.id = "tooltip-" + t + "-" + i, r.appendChild(n), a = n.offsetWidth, n.offsetHeight, s.top = e.offsetTop + e.offsetHeight + "px", s.left = e.offsetLeft + e.offsetWidth / 2 - a / 2 + "px", s.visibility = "visible", this.con.animate ? (n.setAttribute("data-top", parseInt(s.top)), s.top = parseInt(s.top) + 5 + "px", function t() {
            parseFloat(s.top) > n.getAttribute("data-top") && (s.top = parseFloat(s.top) - .5 + "px"), (s.opacity = parseFloat(s.opacity) + .125) < 1 && setTimeout(t, 20);
          }()) : s.opacity = 1;
        },
        hideTooltip: function hideTooltip(t) {
          var e = this.dt.querySelector("#tooltip-" + t),
              i = e.style;
          this.con.animate ? (e.className += " remove", function t() {
            if (parseFloat(i.top) < parseInt(e.getAttribute("data-top")) + 5 && (i.top = parseFloat(i.top) + .5 + "px"), (i.opacity -= .125) < 0) return (e.className = "calendar-tooltip") ? e.parentElement.removeChild(e) : "";
            setTimeout(t, 20);
          }()) : e.parentElement.removeChild(e);
        },
        switchView: function switchView(t) {
          var e = [null, "days", "months", "years", "decades", null];
          return -1 == e.indexOf(t) && ("up" == t ? t = e[(e.indexOf(this.view.type) || 5) + 1] || null : "down" == t && (t = e[(e.indexOf(this.view.type) || 1) - 1] || null), t && this.con["view" + r(t)] || (t = !1)), !!t && (this.renderDatePicker(this.dt, t), this.trigger("view", t));
        },
        switchDate: function switchDate(t, e, i, a) {
          return "auto" === i && (i = this.view.date.getDate(), (1 === this.view.date.getMonth() && 28 <= i || 30 <= i) && (i = (i = new Date(t, e + 1, 0)).getDate())), this.view.date.setFullYear(null == t ? this.view.date.getFullYear() : t, null == e ? this.view.date.getMonth() : e, i || this.view.date.getDate()), !0 === a || this.switchView(this.view.type);
        },
        switchMonth: function switchMonth(t, e) {
          return "string" == typeof t && (t = 0 <= ["previous", "prev"].indexOf(t) ? -1 : 1, t = this.view.date.getMonth() + type), this.switchDate(e || this.getFullYear(), t);
        },
        switchYear: function switchYear(t) {
          return "string" == typeof t && (t = 0 <= ["previous", "prev"].indexOf(t) ? -1 : 1, t = this.view.date.getFullYear() + type), this.switchDate(t);
        },
        browseView: function browseView(t) {
          switch (t = 0 <= ["previous", "prev"].indexOf(t) ? -1 : 1, this.view.type) {
            case "days":
              return this.switchDate(null, this.view.date.getMonth() + t, "auto");

            case "months":
              return this.switchDate(this.view.date.getFullYear() + t, null, "auto");

            case "years":
              return this.switchDate(this.view.date.getFullYear() + 10 * t, null, "auto");

            case "decades":
              return this.switchDate(this.view.date.getFullYear() + 100 * t, null, "auto");
          }

          return !1;
        },
        fetchDate: function fetchDate(t) {
          t = l(t || !1) || this.view.date;
          var e = this.dt.querySelectorAll("input[type=number]");
          return e && 3 == e.length && t.setHours(e[0].value || 0, e[1].value || 0, e[2].value || 0, 0), t;
        },
        selectDate: function selectDate(t, e, i, a, n, s) {
          var r = new Date(),
              o = [];
          return this.con.dateFormat && o.push(this.con.dateFormat), this.con.timeFormat && o.push(this.con.timeFormat), this.select = t instanceof Date ? t : new Date(t || (null == t ? this.view.date.getFullYear() : r.getFullYear()), e || (null == e ? this.view.date.getMonth() : r.getMonth()), i || (null == i ? this.view.date.getDate() : r.getDate()), a || (null == a ? this.view.date.getHours() : 0), n || (null == n ? this.view.date.getMinutes() : 0), s || (null == s ? this.view.date.getSeconds() : 0)), this.view.date = new Date(this.select.getTime()), this.e.value = this.convertDate(this.select, o.join(" ")), this.e.setAttribute("data-value", this.select.getTime()), this.switchView("days"), this.trigger("change");
        },
        selectTime: function selectTime(t, e, i) {
          return this.selectDate(void 0, void 0, void 0, t, e, i);
        },
        open: function open() {
          if (!u(this.dt, "calendar-close")) return this;
          var e = this,
              i = this.dt.style;
          return i.display = "block", i.opacity = this.con.animate ? 0 : 1, n(this.dt, "calendar-close"), a(this.dt, "calendar-idle"), u(this.dt, "calendar-static") || e.calcPosition(), function t() {
            if (1 <= (i.opacity = parseFloat(i.opacity) + .125)) return n(e.dt, "calendar-idle"), a(e.dt, "calendar-open"), e.trigger("open");
            setTimeout(t, 20);
          }(), this;
        },
        close: function close() {
          if (!u(this.dt, "calendar-open")) return this;
          var e = this,
              i = this.dt.style;
          return i.display = "block", i.opacity = this.con.animate ? 1 : 0, n(this.dt, "calendar-open"), a(this.dt, "calendar-idle"), function t() {
            if ((i.opacity -= .125) <= 0) return n(e.dt, "calendar-idle"), a(e.dt, "calendar-close"), i.display = "none", e.trigger("close");
            setTimeout(t, 20);
          }(), this;
        },
        toggle: function toggle() {
          return u(this.dt, "calendar-open") ? this.close() : u(this.dt, "calendar-close") ? this.open() : this;
        },
        on: function on(t, e, i) {
          return !(["open", "close", "change", "view"].indexOf(t) < 0 || "function" != typeof e) && (t in this.events || (this.events[t] = []), this.events[t].push({
            cb: e,
            args: i instanceof Array ? i : []
          }), this);
        },
        remove: function remove() {
          return this.e.removeAttribute("data-tail-datetime"), this.e.removeAttribute("data-value"), this.dt.parentElement.removeChild(this.dt), this;
        },
        reload: function reload() {
          return this.remove(), this.init();
        },
        config: function config(t, e, i) {
          if (t instanceof Object) {
            for (var a in t) {
              this.config(a, t[a], !1);
            }

            return this.reload(), this.con;
          }

          return void 0 === t ? this.con : t in this.con && (void 0 === e ? this.con[t] : (this.con[t] = e, !1 !== this.rebuild && this.reload(), this));
        }
      }, c;
    });
  });

  var dateTime = (function () {
    document.addEventListener('DOMContentLoaded', function () {
      tail_datetimeFull_min('.js-calendar', {
        timeHours: false,
        timeMinutes: false,
        timeSeconds: false,
        timeFormat: '',
        dateFormat: 'dd-mm-YYYY',
        locale: 'ru'
      });
    });
  });

  var tagsBlock = (function () {
    var tagsEditor = document.querySelector('.js-tags-edit');
    var addTag = document.querySelector('.js-add-tag');

    if (tagsEditor) {
      tagsEditor.addEventListener('click', function (e) {
        e.target.classList.add('hide');
        e.target.closest('.tags-block').querySelector('.tags-block__edit-box').classList.add('show');
        e.target.closest('.tags-block').querySelector('.js-add-tag').focus();
      });
      var founded = false;
      addTag.addEventListener('focus', function (event) {
        if (founded) return;
        founded = true;
        var tagList = event.target.closest('.tags-block').querySelector('.js-tags');
        document.addEventListener('keydown', function (e) {
          if (e.keyCode === 13) {
            e.preventDefault();
            var newTagVal = addTag.value;

            if (newTagVal) {
              var newTag = document.createElement('li');
              newTag.className = 'tags-block__list-item';
              newTag.innerHTML = '<div class="tag"><span data-js="tag-name"></span><button class="button button--close" type="button"><svg width="18" height="18"><use xlink:href="img/sprite.svg#close" /></svg></button></div>';
              newTag.querySelector('[data-js=tag-name]').innerText = newTagVal;
              tagList.appendChild(newTag);
            }

            event.target.closest('.tags-block').querySelector('.js-add-tag').value = '';
            event.target.closest('.tags-block').querySelector('.js-tags-edit').classList.remove('hide');
            event.target.closest('.tags-block').querySelector('.tags-block__edit-box').classList.remove('show');
          }
        });
      });
    }
  });

  var GHOST_ELEMENT_ID = '__autosizeInputGhost';
  var characterEntities = {
    ' ': 'nbsp',
    '<': 'lt',
    '>': 'gt'
  };

  function mapSpecialCharacterToCharacterEntity(specialCharacter) {
    return '&' + characterEntities[specialCharacter] + ';';
  }

  function escapeSpecialCharacters(string) {
    return string.replace(/\s|<|>/g, mapSpecialCharacterToCharacterEntity);
  } // Create `ghostElement`, with inline styles to hide it and ensure that the text is all
  // on a single line.


  function createGhostElement() {
    var ghostElement = document.createElement('div');
    ghostElement.id = GHOST_ELEMENT_ID;
    ghostElement.style.cssText = 'display:inline-block;height:0;overflow:hidden;position:absolute;top:0;visibility:hidden;white-space:nowrap;';
    document.body.appendChild(ghostElement);
    return ghostElement;
  }

  var autosizeInput = function autosizeInput(element, options) {
    var elementStyle = window.getComputedStyle(element); // prettier-ignore

    var elementCssText = 'box-sizing:' + elementStyle.boxSizing + ';border-left:' + elementStyle.borderLeftWidth + ' solid red' + ';border-right:' + elementStyle.borderRightWidth + ' solid red' + ';font-family:' + elementStyle.fontFamily + ';font-feature-settings:' + elementStyle.fontFeatureSettings + ';font-kerning:' + elementStyle.fontKerning + ';font-size:' + elementStyle.fontSize + ';font-stretch:' + elementStyle.fontStretch + ';font-style:' + elementStyle.fontStyle + ';font-variant:' + elementStyle.fontVariant + ';font-variant-caps:' + elementStyle.fontVariantCaps + ';font-variant-ligatures:' + elementStyle.fontVariantLigatures + ';font-variant-numeric:' + elementStyle.fontVariantNumeric + ';font-weight:' + elementStyle.fontWeight + ';letter-spacing:' + elementStyle.letterSpacing + ';margin-left:' + elementStyle.marginLeft + ';margin-right:' + elementStyle.marginRight + ';padding-left:' + elementStyle.paddingLeft + ';padding-right:' + elementStyle.paddingRight + ';text-indent:' + elementStyle.textIndent + ';text-transform:' + elementStyle.textTransform; // Assigns an appropriate width to the given `element` based on its contents.

    function setWidth() {
      var string = element.value || element.getAttribute('placeholder') || ''; // Check if the `ghostElement` exists. If no, create it.

      var ghostElement = document.getElementById(GHOST_ELEMENT_ID) || createGhostElement(); // Copy all width-affecting styles to the `ghostElement`.

      ghostElement.style.cssText += elementCssText;
      ghostElement.innerHTML = escapeSpecialCharacters(string); // Copy the width of `ghostElement` to `element`.

      var width = window.getComputedStyle(ghostElement).width;
      element.style.width = width;
      return width;
    }

    element.addEventListener('input', setWidth);
    var width = setWidth(); // Set `min-width` only if `options.minWidth` was set, and only if the initial
    // width is non-zero.

    if (options && options.minWidth && width !== '0px') {
      element.style.minWidth = width;
    } // Return a function for unbinding the event listener and removing the `ghostElement`.


    return function () {
      element.removeEventListener('input', setWidth);
      var ghostElement = document.getElementById(GHOST_ELEMENT_ID);

      if (ghostElement) {
        ghostElement.parentNode.removeChild(ghostElement);
      }
    };
  };

  var dealForm = (function () {
    if (document.querySelector('#date-selection')) {
      autosizeInput(document.querySelector('#date-selection'), {
        minWidth: true
      });
      document.querySelector('#date-selection').style.minWidth = '85px';
    }

    if (document.querySelector('#deal-selection')) {
      autosizeInput(document.querySelector('#deal-selection'));
      document.querySelector('#deal-selection').style.minWidth = '0';
    }

    if (document.querySelector('#price-field')) {
      var priceField = document.querySelector('#price-field');

      var valSetter = function valSetter() {
        priceField.value = parseInt(priceField.value, 10).toString(10) + ' ' + priceField.getAttribute('data-postfix');
        priceField.addEventListener('input', function () {
          var num;
          var last = priceField.selectionStart;
          var result = (num = parseInt(priceField.value, 10) || 0) + ' ' + priceField.getAttribute('data-postfix');

          if (result !== priceField.value) {
            priceField.value = result;
            var newLast = priceField.selectionStart;

            if (last > (num + '').length) {
              priceField.setSelectionRange((num + '').length, (num + '').length);
            }

            if (newLast > (num + '').length) {
              priceField.setSelectionRange((num + '').length, (num + '').length);
            }
          }
        });
      };

      valSetter();
      autosizeInput(priceField, {
        minWidth: true
      });
      priceField.style.minWidth = '0';
    }

    if (document.querySelector('.js-resizable')) {
      (function () {
        var inputableFields = document.querySelectorAll('.js-resizable');

        var _loop = function _loop(i) {
          inputableFields[i].addEventListener('focus', function (event) {
            document.addEventListener('keydown', function (e) {
              if (e.keyCode === 13) {
                e.preventDefault();
                inputableFields[i].blur();
              }
            });
          });
        };

        for (var i = 0; i < inputableFields.length; i++) {
          _loop(i);
        }
      })();
    }
  });

  var messageBox = (function () {
    if (document.querySelector('.message-box')) {
      var autoExpand = function autoExpand(field) {
        field.style.height = 'inherit';
        var computed = window.getComputedStyle(field); // Calculate the height

        var height = parseInt(computed.getPropertyValue('border-top-width'), 10) + field.scrollHeight + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
        field.style.height = height + 'px';
      };

      var messageEdit = document.querySelector('.js-message-edit');
      var cancelEdit = document.querySelector('.js-message-cancel');
      var finishEdit = document.querySelector('.js-message-save');
      var messageField = document.querySelector('.js-message-field');
      messageEdit.addEventListener('click', function () {
        messageEdit.closest('.message-box').classList.add('editing');
        messageEdit.closest('.message-box').querySelector('.js-message-field').removeAttribute('readonly');
        messageField.style.height = parseInt(messageField.scrollHeight, 10) + 32 + 'px';
      });
      cancelEdit.addEventListener('click', function () {
        cancelEdit.closest('.message-box').classList.remove('editing');
        cancelEdit.closest('.message-box').querySelector('.js-message-field').setAttribute('readonly', 'readonly');
        autoExpand(messageField);
        messageField.style.height = parseInt(messageField.scrollHeight, 10) - 30 + 'px';
      });
      finishEdit.addEventListener('click', function () {
        finishEdit.closest('.message-box').classList.remove('editing');
        finishEdit.closest('.message-box').querySelector('.js-message-field').setAttribute('readonly', 'readonly');
        autoExpand(messageField);
        messageField.style.height = parseInt(messageField.scrollHeight, 10) - 30 + 'px';
      });
      autoExpand(messageField);
      messageField.addEventListener('input', function (event) {
        if (event.target.tagName.toLowerCase() !== 'textarea') return;
        autoExpand(event.target);
      }, false);
    }
  });

  var taskWidget = (function () {
    if (document.querySelector('.js-task-widget')) {
      var btnCreateTask = document.querySelector('.js-create-task');
      if (!btnCreateTask) return;
      var taskWidget = document.querySelector('.js-task-widget');
      var btnClose = document.querySelector('.task-widget__close-button');
      var textarea = document.querySelector('.task-widget__textarea');
      btnCreateTask.addEventListener('click', function () {
        if (!btnCreateTask.classList.contains('hide')) {
          btnCreateTask.classList.add('hide');
          taskWidget.classList.add('show');
        }
      });
      btnClose.addEventListener('click', function () {
        btnCreateTask.classList.remove('hide');
        taskWidget.classList.remove('show');
      });

      var autoExpand = function autoExpand(field) {
        // Reset field height
        field.style.height = 'inherit'; // Get the computed styles for the element

        var computed = window.getComputedStyle(field); // Calculate the height

        var height = parseInt(computed.getPropertyValue('border-top-width'), 10) + parseInt(computed.getPropertyValue('padding-top'), 10) + field.scrollHeight // + parseInt(computed.getPropertyValue('padding-bottom'), 10)
        + parseInt(computed.getPropertyValue('border-bottom-width'), 10);
        field.style.height = height + 'px';
      };

      textarea.addEventListener('input', function (event) {
        if (event.target.tagName.toLowerCase() !== 'textarea') return;
        autoExpand(event.target);
      }, false);
      var dateField = document.querySelector('.task-widget__input--date');

      if (dateField) {
        autosizeInput(dateField);
        tail_datetimeFull_min(dateField, {
          position: ".task-widget__calendar-container",
          // Appends the Calendar to this Container
          startOpen: false,
          stayOpen: false,
          timeHours: false,
          timeMinutes: false,
          timeSeconds: false,
          timeFormat: '',
          dateFormat: 'dd-mm-YYYY',
          locale: 'ru' // Keeps the Calendar Popup Open

        });
      }
    }
  });

  var simplebar_min = createCommonjsModule(function (module, exports) {
    /**
     * SimpleBar.js - v4.2.3
     * Scrollbars, simpler.
     * https://grsmto.github.io/simplebar/
     *
     * Made by Adrien Denat from a fork by Jonathan Nicol
     * Under MIT License
     */
    !function (t, e) {
       module.exports = e() ;
    }(commonjsGlobal, function () {

      var t = function t(_t2) {
        if ("function" != typeof _t2) throw TypeError(String(_t2) + " is not a function");
        return _t2;
      },
          e = function e(t) {
        try {
          return !!t();
        } catch (t) {
          return !0;
        }
      },
          i = {}.toString,
          r = function r(t) {
        return i.call(t).slice(8, -1);
      },
          n = "".split,
          s = e(function () {
        return !Object("z").propertyIsEnumerable(0);
      }) ? function (t) {
        return "String" == r(t) ? n.call(t, "") : Object(t);
      } : Object,
          o = function o(t) {
        if (null == t) throw TypeError("Can't call method on " + t);
        return t;
      },
          a = function a(t) {
        return Object(o(t));
      },
          l = Math.ceil,
          c = Math.floor,
          u = function u(t) {
        return isNaN(t = +t) ? 0 : (t > 0 ? c : l)(t);
      },
          h = Math.min,
          f = function f(t) {
        return t > 0 ? h(u(t), 9007199254740991) : 0;
      },
          d = function d(t) {
        return "object" == _typeof(t) ? null !== t : "function" == typeof t;
      },
          p = Array.isArray || function (t) {
        return "Array" == r(t);
      },
          v = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof commonjsGlobal ? commonjsGlobal : "undefined" != typeof self ? self : {};

      function g(t, e) {
        return t(e = {
          exports: {}
        }, e.exports), e.exports;
      }

      var b,
          m,
          y,
          x,
          E = "object" == (typeof window === "undefined" ? "undefined" : _typeof(window)) && window && window.Math == Math ? window : "object" == (typeof self === "undefined" ? "undefined" : _typeof(self)) && self && self.Math == Math ? self : Function("return this")(),
          w = !e(function () {
        return 7 != Object.defineProperty({}, "a", {
          get: function get() {
            return 7;
          }
        }).a;
      }),
          O = E.document,
          _ = d(O) && d(O.createElement),
          S = !w && !e(function () {
        return 7 != Object.defineProperty((t = "div", _ ? O.createElement(t) : {}), "a", {
          get: function get() {
            return 7;
          }
        }).a;
        var t;
      }),
          L = function L(t) {
        if (!d(t)) throw TypeError(String(t) + " is not an object");
        return t;
      },
          A = function A(t, e) {
        if (!d(t)) return t;
        var i, r;
        if (e && "function" == typeof (i = t.toString) && !d(r = i.call(t))) return r;
        if ("function" == typeof (i = t.valueOf) && !d(r = i.call(t))) return r;
        if (!e && "function" == typeof (i = t.toString) && !d(r = i.call(t))) return r;
        throw TypeError("Can't convert object to primitive value");
      },
          M = Object.defineProperty,
          k = {
        f: w ? M : function (t, e, i) {
          if (L(t), e = A(e, !0), L(i), S) try {
            return M(t, e, i);
          } catch (t) {}
          if ("get" in i || "set" in i) throw TypeError("Accessors not supported");
          return "value" in i && (t[e] = i.value), t;
        }
      },
          W = function W(t, e) {
        return {
          enumerable: !(1 & t),
          configurable: !(2 & t),
          writable: !(4 & t),
          value: e
        };
      },
          T = w ? function (t, e, i) {
        return k.f(t, e, W(1, i));
      } : function (t, e, i) {
        return t[e] = i, t;
      },
          R = function R(t, e) {
        try {
          T(E, t, e);
        } catch (i) {
          E[t] = e;
        }

        return e;
      },
          j = g(function (t) {
        var e = E["__core-js_shared__"] || R("__core-js_shared__", {});
        (t.exports = function (t, i) {
          return e[t] || (e[t] = void 0 !== i ? i : {});
        })("versions", []).push({
          version: "3.0.1",
          mode: "global",
          copyright: "© 2019 Denis Pushkarev (zloirock.ru)"
        });
      }),
          C = 0,
          N = Math.random(),
          z = function z(t) {
        return "Symbol(".concat(void 0 === t ? "" : t, ")_", (++C + N).toString(36));
      },
          D = !e(function () {
        return !String(Symbol());
      }),
          V = j("wks"),
          I = E.Symbol,
          B = function B(t) {
        return V[t] || (V[t] = D && I[t] || (D ? I : z)("Symbol." + t));
      },
          P = B("species"),
          H = function H(t, e) {
        var i;
        return p(t) && ("function" != typeof (i = t.constructor) || i !== Array && !p(i.prototype) ? d(i) && null === (i = i[P]) && (i = void 0) : i = void 0), new (void 0 === i ? Array : i)(0 === e ? 0 : e);
      },
          F = function F(e, i) {
        var r = 1 == e,
            n = 2 == e,
            o = 3 == e,
            l = 4 == e,
            c = 6 == e,
            u = 5 == e || c,
            h = i || H;
        return function (i, d, p) {
          for (var v, g, b = a(i), m = s(b), y = function (e, i, r) {
            if (t(e), void 0 === i) return e;

            switch (r) {
              case 0:
                return function () {
                  return e.call(i);
                };

              case 1:
                return function (t) {
                  return e.call(i, t);
                };

              case 2:
                return function (t, r) {
                  return e.call(i, t, r);
                };

              case 3:
                return function (t, r, n) {
                  return e.call(i, t, r, n);
                };
            }

            return function () {
              return e.apply(i, arguments);
            };
          }(d, p, 3), x = f(m.length), E = 0, w = r ? h(i, x) : n ? h(i, 0) : void 0; x > E; E++) {
            if ((u || E in m) && (g = y(v = m[E], E, b), e)) if (r) w[E] = g;else if (g) switch (e) {
              case 3:
                return !0;

              case 5:
                return v;

              case 6:
                return E;

              case 2:
                w.push(v);
            } else if (l) return !1;
          }

          return c ? -1 : o || l ? l : w;
        };
      },
          q = B("species"),
          $ = {}.propertyIsEnumerable,
          Y = Object.getOwnPropertyDescriptor,
          X = {
        f: Y && !$.call({
          1: 2
        }, 1) ? function (t) {
          var e = Y(this, t);
          return !!e && e.enumerable;
        } : $
      },
          G = function G(t) {
        return s(o(t));
      },
          K = {}.hasOwnProperty,
          U = function U(t, e) {
        return K.call(t, e);
      },
          J = Object.getOwnPropertyDescriptor,
          Q = {
        f: w ? J : function (t, e) {
          if (t = G(t), e = A(e, !0), S) try {
            return J(t, e);
          } catch (t) {}
          if (U(t, e)) return W(!X.f.call(t, e), t[e]);
        }
      },
          Z = j("native-function-to-string", Function.toString),
          tt = E.WeakMap,
          et = "function" == typeof tt && /native code/.test(Z.call(tt)),
          it = j("keys"),
          rt = {},
          nt = E.WeakMap;

      if (et) {
        var st = new nt(),
            ot = st.get,
            at = st.has,
            lt = st.set;
        b = function b(t, e) {
          return lt.call(st, t, e), e;
        }, m = function m(t) {
          return ot.call(st, t) || {};
        }, y = function y(t) {
          return at.call(st, t);
        };
      } else {
        var ct = it[x = "state"] || (it[x] = z(x));
        rt[ct] = !0, b = function b(t, e) {
          return T(t, ct, e), e;
        }, m = function m(t) {
          return U(t, ct) ? t[ct] : {};
        }, y = function y(t) {
          return U(t, ct);
        };
      }

      var ut,
          ht,
          ft = {
        set: b,
        get: m,
        has: y,
        enforce: function enforce(t) {
          return y(t) ? m(t) : b(t, {});
        },
        getterFor: function getterFor(t) {
          return function (e) {
            var i;
            if (!d(e) || (i = m(e)).type !== t) throw TypeError("Incompatible receiver, " + t + " required");
            return i;
          };
        }
      },
          dt = g(function (t) {
        var e = ft.get,
            i = ft.enforce,
            r = String(Z).split("toString");
        j("inspectSource", function (t) {
          return Z.call(t);
        }), (t.exports = function (t, e, n, s) {
          var o = !!s && !!s.unsafe,
              a = !!s && !!s.enumerable,
              l = !!s && !!s.noTargetGet;
          "function" == typeof n && ("string" != typeof e || U(n, "name") || T(n, "name", e), i(n).source = r.join("string" == typeof e ? e : "")), t !== E ? (o ? !l && t[e] && (a = !0) : delete t[e], a ? t[e] = n : T(t, e, n)) : a ? t[e] = n : R(e, n);
        })(Function.prototype, "toString", function () {
          return "function" == typeof this && e(this).source || Z.call(this);
        });
      }),
          pt = Math.max,
          vt = Math.min,
          gt = (ut = !1, function (t, e, i) {
        var r,
            n = G(t),
            s = f(n.length),
            o = function (t, e) {
          var i = u(t);
          return i < 0 ? pt(i + e, 0) : vt(i, e);
        }(i, s);

        if (ut && e != e) {
          for (; s > o;) {
            if ((r = n[o++]) != r) return !0;
          }
        } else for (; s > o; o++) {
          if ((ut || o in n) && n[o] === e) return ut || o || 0;
        }

        return !ut && -1;
      }),
          bt = function bt(t, e) {
        var i,
            r = G(t),
            n = 0,
            s = [];

        for (i in r) {
          !U(rt, i) && U(r, i) && s.push(i);
        }

        for (; e.length > n;) {
          U(r, i = e[n++]) && (~gt(s, i) || s.push(i));
        }

        return s;
      },
          mt = ["constructor", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString", "toString", "valueOf"],
          yt = mt.concat("length", "prototype"),
          xt = {
        f: Object.getOwnPropertyNames || function (t) {
          return bt(t, yt);
        }
      },
          Et = {
        f: Object.getOwnPropertySymbols
      },
          wt = E.Reflect,
          Ot = wt && wt.ownKeys || function (t) {
        var e = xt.f(L(t)),
            i = Et.f;
        return i ? e.concat(i(t)) : e;
      },
          _t = function _t(t, e) {
        for (var i = Ot(e), r = k.f, n = Q.f, s = 0; s < i.length; s++) {
          var o = i[s];
          U(t, o) || r(t, o, n(e, o));
        }
      },
          St = /#|\.prototype\./,
          Lt = function Lt(t, i) {
        var r = Mt[At(t)];
        return r == Wt || r != kt && ("function" == typeof i ? e(i) : !!i);
      },
          At = Lt.normalize = function (t) {
        return String(t).replace(St, ".").toLowerCase();
      },
          Mt = Lt.data = {},
          kt = Lt.NATIVE = "N",
          Wt = Lt.POLYFILL = "P",
          Tt = Lt,
          Rt = Q.f,
          jt = function jt(t, e) {
        var i,
            r,
            n,
            s,
            o,
            a = t.target,
            l = t.global,
            c = t.stat;
        if (i = l ? E : c ? E[a] || R(a, {}) : (E[a] || {}).prototype) for (r in e) {
          if (s = e[r], n = t.noTargetGet ? (o = Rt(i, r)) && o.value : i[r], !Tt(l ? r : a + (c ? "." : "#") + r, t.forced) && void 0 !== n) {
            if (_typeof(s) == _typeof(n)) continue;

            _t(s, n);
          }

          (t.sham || n && n.sham) && T(s, "sham", !0), dt(i, r, s, t);
        }
      },
          Ct = F(2);

      jt({
        target: "Array",
        proto: !0,
        forced: !(ht = "filter", !e(function () {
          var t = [];
          return (t.constructor = {})[q] = function () {
            return {
              foo: 1
            };
          }, 1 !== t[ht](Boolean).foo;
        }))
      }, {
        filter: function filter(t) {
          return Ct(this, t, arguments[1]);
        }
      });

      var Nt = function Nt(t, i) {
        var r = [][t];
        return !r || !e(function () {
          r.call(null, i || function () {
            throw 1;
          }, 1);
        });
      },
          zt = [].forEach,
          Dt = F(0),
          Vt = Nt("forEach") ? function (t) {
        return Dt(this, t, arguments[1]);
      } : zt;

      jt({
        target: "Array",
        proto: !0,
        forced: [].forEach != Vt
      }, {
        forEach: Vt
      });
      jt({
        target: "Array",
        proto: !0,
        forced: Nt("reduce")
      }, {
        reduce: function reduce(e) {
          return function (e, i, r, n, o) {
            t(i);
            var l = a(e),
                c = s(l),
                u = f(l.length),
                h = o ? u - 1 : 0,
                d = o ? -1 : 1;
            if (r < 2) for (;;) {
              if (h in c) {
                n = c[h], h += d;
                break;
              }

              if (h += d, o ? h < 0 : u <= h) throw TypeError("Reduce of empty array with no initial value");
            }

            for (; o ? h >= 0 : u > h; h += d) {
              h in c && (n = i(n, c[h], h, l));
            }

            return n;
          }(this, e, arguments.length, arguments[1], !1);
        }
      });
      var It = k.f,
          Bt = Function.prototype,
          Pt = Bt.toString,
          Ht = /^\s*function ([^ (]*)/;
      !w || "name" in Bt || It(Bt, "name", {
        configurable: !0,
        get: function get() {
          try {
            return Pt.call(this).match(Ht)[1];
          } catch (t) {
            return "";
          }
        }
      });

      var Ft = Object.keys || function (t) {
        return bt(t, mt);
      },
          qt = Object.assign,
          $t = !qt || e(function () {
        var t = {},
            e = {},
            i = Symbol();
        return t[i] = 7, "abcdefghijklmnopqrst".split("").forEach(function (t) {
          e[t] = t;
        }), 7 != qt({}, t)[i] || "abcdefghijklmnopqrst" != Ft(qt({}, e)).join("");
      }) ? function (t, e) {
        for (var i = a(t), r = arguments.length, n = 1, o = Et.f, l = X.f; r > n;) {
          for (var c, u = s(arguments[n++]), h = o ? Ft(u).concat(o(u)) : Ft(u), f = h.length, d = 0; f > d;) {
            l.call(u, c = h[d++]) && (i[c] = u[c]);
          }
        }

        return i;
      } : qt;

      jt({
        target: "Object",
        stat: !0,
        forced: Object.assign !== $t
      }, {
        assign: $t
      });
      var Yt = "\t\n\x0B\f\r \xA0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF",
          Xt = "[" + Yt + "]",
          Gt = RegExp("^" + Xt + Xt + "*"),
          Kt = RegExp(Xt + Xt + "*$"),
          Ut = E.parseInt,
          Jt = /^[-+]?0[xX]/,
          Qt = 8 !== Ut(Yt + "08") || 22 !== Ut(Yt + "0x16") ? function (t, e) {
        var i = function (t, e) {
          return t = String(o(t)), 1 & e && (t = t.replace(Gt, "")), 2 & e && (t = t.replace(Kt, "")), t;
        }(String(t), 3);

        return Ut(i, e >>> 0 || (Jt.test(i) ? 16 : 10));
      } : Ut;
      jt({
        global: !0,
        forced: parseInt != Qt
      }, {
        parseInt: Qt
      });
      var Zt,
          te,
          ee = RegExp.prototype.exec,
          ie = String.prototype.replace,
          re = ee,
          ne = (Zt = /a/, te = /b*/g, ee.call(Zt, "a"), ee.call(te, "a"), 0 !== Zt.lastIndex || 0 !== te.lastIndex),
          se = void 0 !== /()??/.exec("")[1];
      (ne || se) && (re = function re(t) {
        var e,
            i,
            r,
            n,
            s = this;
        return se && (i = new RegExp("^" + s.source + "$(?!\\s)", function () {
          var t = L(this),
              e = "";
          return t.global && (e += "g"), t.ignoreCase && (e += "i"), t.multiline && (e += "m"), t.unicode && (e += "u"), t.sticky && (e += "y"), e;
        }.call(s))), ne && (e = s.lastIndex), r = ee.call(s, t), ne && r && (s.lastIndex = s.global ? r.index + r[0].length : e), se && r && r.length > 1 && ie.call(r[0], i, function () {
          for (n = 1; n < arguments.length - 2; n++) {
            void 0 === arguments[n] && (r[n] = void 0);
          }
        }), r;
      });
      var oe = re;
      jt({
        target: "RegExp",
        proto: !0,
        forced: /./.exec !== oe
      }, {
        exec: oe
      });

      var ae = function ae(t, e, i) {
        return e + (i ? function (t, e, i) {
          var r,
              n,
              s = String(o(t)),
              a = u(e),
              l = s.length;
          return a < 0 || a >= l ? i ? "" : void 0 : (r = s.charCodeAt(a)) < 55296 || r > 56319 || a + 1 === l || (n = s.charCodeAt(a + 1)) < 56320 || n > 57343 ? i ? s.charAt(a) : r : i ? s.slice(a, a + 2) : n - 56320 + (r - 55296 << 10) + 65536;
        }(t, e, !0).length : 1);
      },
          le = function le(t, e) {
        var i = t.exec;

        if ("function" == typeof i) {
          var n = i.call(t, e);
          if ("object" != _typeof(n)) throw TypeError("RegExp exec method returned something other than an Object or null");
          return n;
        }

        if ("RegExp" !== r(t)) throw TypeError("RegExp#exec called on incompatible receiver");
        return oe.call(t, e);
      },
          ce = B("species"),
          ue = !e(function () {
        var t = /./;
        return t.exec = function () {
          var t = [];
          return t.groups = {
            a: "7"
          }, t;
        }, "7" !== "".replace(t, "$<a>");
      }),
          he = !e(function () {
        var t = /(?:)/,
            e = t.exec;

        t.exec = function () {
          return e.apply(this, arguments);
        };

        var i = "ab".split(t);
        return 2 !== i.length || "a" !== i[0] || "b" !== i[1];
      }),
          fe = function fe(t, i, r, n) {
        var s = B(t),
            o = !e(function () {
          var e = {};
          return e[s] = function () {
            return 7;
          }, 7 != ""[t](e);
        }),
            a = o && !e(function () {
          var e = !1,
              i = /a/;
          return i.exec = function () {
            return e = !0, null;
          }, "split" === t && (i.constructor = {}, i.constructor[ce] = function () {
            return i;
          }), i[s](""), !e;
        });

        if (!o || !a || "replace" === t && !ue || "split" === t && !he) {
          var l = /./[s],
              c = r(s, ""[t], function (t, e, i, r, n) {
            return e.exec === oe ? o && !n ? {
              done: !0,
              value: l.call(e, i, r)
            } : {
              done: !0,
              value: t.call(i, e, r)
            } : {
              done: !1
            };
          }),
              u = c[0],
              h = c[1];
          dt(String.prototype, t, u), dt(RegExp.prototype, s, 2 == i ? function (t, e) {
            return h.call(t, this, e);
          } : function (t) {
            return h.call(t, this);
          }), n && T(RegExp.prototype[s], "sham", !0);
        }
      };

      fe("match", 1, function (t, e, i) {
        return [function (e) {
          var i = o(this),
              r = null == e ? void 0 : e[t];
          return void 0 !== r ? r.call(e, i) : new RegExp(e)[t](String(i));
        }, function (t) {
          var r = i(e, t, this);
          if (r.done) return r.value;
          var n = L(t),
              s = String(this);
          if (!n.global) return le(n, s);
          var o = n.unicode;
          n.lastIndex = 0;

          for (var a, l = [], c = 0; null !== (a = le(n, s));) {
            var u = String(a[0]);
            l[c] = u, "" === u && (n.lastIndex = ae(s, f(n.lastIndex), o)), c++;
          }

          return 0 === c ? null : l;
        }];
      });
      var de = Math.max,
          pe = Math.min,
          ve = Math.floor,
          ge = /\$([$&`']|\d\d?|<[^>]*>)/g,
          be = /\$([$&`']|\d\d?)/g;
      fe("replace", 2, function (t, e, i) {
        return [function (i, r) {
          var n = o(this),
              s = null == i ? void 0 : i[t];
          return void 0 !== s ? s.call(i, n, r) : e.call(String(n), i, r);
        }, function (t, n) {
          var s = i(e, t, this, n);
          if (s.done) return s.value;
          var o = L(t),
              a = String(this),
              l = "function" == typeof n;
          l || (n = String(n));
          var c = o.global;

          if (c) {
            var h = o.unicode;
            o.lastIndex = 0;
          }

          for (var d = [];;) {
            var p = le(o, a);
            if (null === p) break;
            if (d.push(p), !c) break;
            "" === String(p[0]) && (o.lastIndex = ae(a, f(o.lastIndex), h));
          }

          for (var v, g = "", b = 0, m = 0; m < d.length; m++) {
            p = d[m];

            for (var y = String(p[0]), x = de(pe(u(p.index), a.length), 0), E = [], w = 1; w < p.length; w++) {
              E.push(void 0 === (v = p[w]) ? v : String(v));
            }

            var O = p.groups;

            if (l) {
              var _ = [y].concat(E, x, a);

              void 0 !== O && _.push(O);
              var S = String(n.apply(void 0, _));
            } else S = r(y, a, x, E, O, n);

            x >= b && (g += a.slice(b, x) + S, b = x + y.length);
          }

          return g + a.slice(b);
        }];

        function r(t, i, r, n, s, o) {
          var l = r + t.length,
              c = n.length,
              u = be;
          return void 0 !== s && (s = a(s), u = ge), e.call(o, u, function (e, o) {
            var a;

            switch (o.charAt(0)) {
              case "$":
                return "$";

              case "&":
                return t;

              case "`":
                return i.slice(0, r);

              case "'":
                return i.slice(l);

              case "<":
                a = s[o.slice(1, -1)];
                break;

              default:
                var u = +o;
                if (0 === u) return e;

                if (u > c) {
                  var h = ve(u / 10);
                  return 0 === h ? e : h <= c ? void 0 === n[h - 1] ? o.charAt(1) : n[h - 1] + o.charAt(1) : e;
                }

                a = n[u - 1];
            }

            return void 0 === a ? "" : a;
          });
        }
      });

      for (var me in {
        CSSRuleList: 0,
        CSSStyleDeclaration: 0,
        CSSValueList: 0,
        ClientRectList: 0,
        DOMRectList: 0,
        DOMStringList: 0,
        DOMTokenList: 1,
        DataTransferItemList: 0,
        FileList: 0,
        HTMLAllCollection: 0,
        HTMLCollection: 0,
        HTMLFormElement: 0,
        HTMLSelectElement: 0,
        MediaList: 0,
        MimeTypeArray: 0,
        NamedNodeMap: 0,
        NodeList: 1,
        PaintRequestList: 0,
        Plugin: 0,
        PluginArray: 0,
        SVGLengthList: 0,
        SVGNumberList: 0,
        SVGPathSegList: 0,
        SVGPointList: 0,
        SVGStringList: 0,
        SVGTransformList: 0,
        SourceBufferList: 0,
        StyleSheetList: 0,
        TextTrackCueList: 0,
        TextTrackList: 0,
        TouchList: 0
      }) {
        var ye = E[me],
            xe = ye && ye.prototype;
        if (xe && xe.forEach !== Vt) try {
          T(xe, "forEach", Vt);
        } catch (t) {
          xe.forEach = Vt;
        }
      }

      var Ee = "Expected a function",
          we = NaN,
          Oe = "[object Symbol]",
          _e = /^\s+|\s+$/g,
          Se = /^[-+]0x[0-9a-f]+$/i,
          Le = /^0b[01]+$/i,
          Ae = /^0o[0-7]+$/i,
          Me = parseInt,
          ke = "object" == _typeof(v) && v && v.Object === Object && v,
          We = "object" == (typeof self === "undefined" ? "undefined" : _typeof(self)) && self && self.Object === Object && self,
          Te = ke || We || Function("return this")(),
          Re = Object.prototype.toString,
          je = Math.max,
          Ce = Math.min,
          Ne = function Ne() {
        return Te.Date.now();
      };

      function ze(t, e, i) {
        var r,
            n,
            s,
            o,
            a,
            l,
            c = 0,
            u = !1,
            h = !1,
            f = !0;
        if ("function" != typeof t) throw new TypeError(Ee);

        function d(e) {
          var i = r,
              s = n;
          return r = n = void 0, c = e, o = t.apply(s, i);
        }

        function p(t) {
          var i = t - l;
          return void 0 === l || i >= e || i < 0 || h && t - c >= s;
        }

        function v() {
          var t = Ne();
          if (p(t)) return g(t);
          a = setTimeout(v, function (t) {
            var i = e - (t - l);
            return h ? Ce(i, s - (t - c)) : i;
          }(t));
        }

        function g(t) {
          return a = void 0, f && r ? d(t) : (r = n = void 0, o);
        }

        function b() {
          var t = Ne(),
              i = p(t);

          if (r = arguments, n = this, l = t, i) {
            if (void 0 === a) return function (t) {
              return c = t, a = setTimeout(v, e), u ? d(t) : o;
            }(l);
            if (h) return a = setTimeout(v, e), d(l);
          }

          return void 0 === a && (a = setTimeout(v, e)), o;
        }

        return e = Ve(e) || 0, De(i) && (u = !!i.leading, s = (h = "maxWait" in i) ? je(Ve(i.maxWait) || 0, e) : s, f = "trailing" in i ? !!i.trailing : f), b.cancel = function () {
          void 0 !== a && clearTimeout(a), c = 0, r = l = n = a = void 0;
        }, b.flush = function () {
          return void 0 === a ? o : g(Ne());
        }, b;
      }

      function De(t) {
        var e = _typeof(t);

        return !!t && ("object" == e || "function" == e);
      }

      function Ve(t) {
        if ("number" == typeof t) return t;
        if (function (t) {
          return "symbol" == _typeof(t) || function (t) {
            return !!t && "object" == _typeof(t);
          }(t) && Re.call(t) == Oe;
        }(t)) return we;

        if (De(t)) {
          var e = "function" == typeof t.valueOf ? t.valueOf() : t;
          t = De(e) ? e + "" : e;
        }

        if ("string" != typeof t) return 0 === t ? t : +t;
        t = t.replace(_e, "");
        var i = Le.test(t);
        return i || Ae.test(t) ? Me(t.slice(2), i ? 2 : 8) : Se.test(t) ? we : +t;
      }

      var Ie = function Ie(t, e, i) {
        var r = !0,
            n = !0;
        if ("function" != typeof t) throw new TypeError(Ee);
        return De(i) && (r = "leading" in i ? !!i.leading : r, n = "trailing" in i ? !!i.trailing : n), ze(t, e, {
          leading: r,
          maxWait: e,
          trailing: n
        });
      },
          Be = "Expected a function",
          Pe = NaN,
          He = "[object Symbol]",
          Fe = /^\s+|\s+$/g,
          qe = /^[-+]0x[0-9a-f]+$/i,
          $e = /^0b[01]+$/i,
          Ye = /^0o[0-7]+$/i,
          Xe = parseInt,
          Ge = "object" == _typeof(v) && v && v.Object === Object && v,
          Ke = "object" == (typeof self === "undefined" ? "undefined" : _typeof(self)) && self && self.Object === Object && self,
          Ue = Ge || Ke || Function("return this")(),
          Je = Object.prototype.toString,
          Qe = Math.max,
          Ze = Math.min,
          ti = function ti() {
        return Ue.Date.now();
      };

      function ei(t) {
        var e = _typeof(t);

        return !!t && ("object" == e || "function" == e);
      }

      function ii(t) {
        if ("number" == typeof t) return t;
        if (function (t) {
          return "symbol" == _typeof(t) || function (t) {
            return !!t && "object" == _typeof(t);
          }(t) && Je.call(t) == He;
        }(t)) return Pe;

        if (ei(t)) {
          var e = "function" == typeof t.valueOf ? t.valueOf() : t;
          t = ei(e) ? e + "" : e;
        }

        if ("string" != typeof t) return 0 === t ? t : +t;
        t = t.replace(Fe, "");
        var i = $e.test(t);
        return i || Ye.test(t) ? Xe(t.slice(2), i ? 2 : 8) : qe.test(t) ? Pe : +t;
      }

      var ri = function ri(t, e, i) {
        var r,
            n,
            s,
            o,
            a,
            l,
            c = 0,
            u = !1,
            h = !1,
            f = !0;
        if ("function" != typeof t) throw new TypeError(Be);

        function d(e) {
          var i = r,
              s = n;
          return r = n = void 0, c = e, o = t.apply(s, i);
        }

        function p(t) {
          var i = t - l;
          return void 0 === l || i >= e || i < 0 || h && t - c >= s;
        }

        function v() {
          var t = ti();
          if (p(t)) return g(t);
          a = setTimeout(v, function (t) {
            var i = e - (t - l);
            return h ? Ze(i, s - (t - c)) : i;
          }(t));
        }

        function g(t) {
          return a = void 0, f && r ? d(t) : (r = n = void 0, o);
        }

        function b() {
          var t = ti(),
              i = p(t);

          if (r = arguments, n = this, l = t, i) {
            if (void 0 === a) return function (t) {
              return c = t, a = setTimeout(v, e), u ? d(t) : o;
            }(l);
            if (h) return a = setTimeout(v, e), d(l);
          }

          return void 0 === a && (a = setTimeout(v, e)), o;
        }

        return e = ii(e) || 0, ei(i) && (u = !!i.leading, s = (h = "maxWait" in i) ? Qe(ii(i.maxWait) || 0, e) : s, f = "trailing" in i ? !!i.trailing : f), b.cancel = function () {
          void 0 !== a && clearTimeout(a), c = 0, r = l = n = a = void 0;
        }, b.flush = function () {
          return void 0 === a ? o : g(ti());
        }, b;
      },
          ni = "Expected a function",
          si = "__lodash_hash_undefined__",
          oi = "[object Function]",
          ai = "[object GeneratorFunction]",
          li = /^\[object .+?Constructor\]$/,
          ci = "object" == _typeof(v) && v && v.Object === Object && v,
          ui = "object" == (typeof self === "undefined" ? "undefined" : _typeof(self)) && self && self.Object === Object && self,
          hi = ci || ui || Function("return this")();

      var fi = Array.prototype,
          di = Function.prototype,
          pi = Object.prototype,
          vi = hi["__core-js_shared__"],
          gi = function () {
        var t = /[^.]+$/.exec(vi && vi.keys && vi.keys.IE_PROTO || "");
        return t ? "Symbol(src)_1." + t : "";
      }(),
          bi = di.toString,
          mi = pi.hasOwnProperty,
          yi = pi.toString,
          xi = RegExp("^" + bi.call(mi).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
          Ei = fi.splice,
          wi = Wi(hi, "Map"),
          Oi = Wi(Object, "create");

      function _i(t) {
        var e = -1,
            i = t ? t.length : 0;

        for (this.clear(); ++e < i;) {
          var r = t[e];
          this.set(r[0], r[1]);
        }
      }

      function Si(t) {
        var e = -1,
            i = t ? t.length : 0;

        for (this.clear(); ++e < i;) {
          var r = t[e];
          this.set(r[0], r[1]);
        }
      }

      function Li(t) {
        var e = -1,
            i = t ? t.length : 0;

        for (this.clear(); ++e < i;) {
          var r = t[e];
          this.set(r[0], r[1]);
        }
      }

      function Ai(t, e) {
        for (var i, r, n = t.length; n--;) {
          if ((i = t[n][0]) === (r = e) || i != i && r != r) return n;
        }

        return -1;
      }

      function Mi(t) {
        return !(!Ri(t) || (e = t, gi && gi in e)) && (function (t) {
          var e = Ri(t) ? yi.call(t) : "";
          return e == oi || e == ai;
        }(t) || function (t) {
          var e = !1;
          if (null != t && "function" != typeof t.toString) try {
            e = !!(t + "");
          } catch (t) {}
          return e;
        }(t) ? xi : li).test(function (t) {
          if (null != t) {
            try {
              return bi.call(t);
            } catch (t) {}

            try {
              return t + "";
            } catch (t) {}
          }

          return "";
        }(t));
        var e;
      }

      function ki(t, e) {
        var i,
            r,
            n = t.__data__;
        return ("string" == (r = _typeof(i = e)) || "number" == r || "symbol" == r || "boolean" == r ? "__proto__" !== i : null === i) ? n["string" == typeof e ? "string" : "hash"] : n.map;
      }

      function Wi(t, e) {
        var i = function (t, e) {
          return null == t ? void 0 : t[e];
        }(t, e);

        return Mi(i) ? i : void 0;
      }

      function Ti(t, e) {
        if ("function" != typeof t || e && "function" != typeof e) throw new TypeError(ni);

        var i = function i() {
          var r = arguments,
              n = e ? e.apply(this, r) : r[0],
              s = i.cache;
          if (s.has(n)) return s.get(n);
          var o = t.apply(this, r);
          return i.cache = s.set(n, o), o;
        };

        return i.cache = new (Ti.Cache || Li)(), i;
      }

      function Ri(t) {
        var e = _typeof(t);

        return !!t && ("object" == e || "function" == e);
      }

      _i.prototype.clear = function () {
        this.__data__ = Oi ? Oi(null) : {};
      }, _i.prototype.delete = function (t) {
        return this.has(t) && delete this.__data__[t];
      }, _i.prototype.get = function (t) {
        var e = this.__data__;

        if (Oi) {
          var i = e[t];
          return i === si ? void 0 : i;
        }

        return mi.call(e, t) ? e[t] : void 0;
      }, _i.prototype.has = function (t) {
        var e = this.__data__;
        return Oi ? void 0 !== e[t] : mi.call(e, t);
      }, _i.prototype.set = function (t, e) {
        return this.__data__[t] = Oi && void 0 === e ? si : e, this;
      }, Si.prototype.clear = function () {
        this.__data__ = [];
      }, Si.prototype.delete = function (t) {
        var e = this.__data__,
            i = Ai(e, t);
        return !(i < 0 || (i == e.length - 1 ? e.pop() : Ei.call(e, i, 1), 0));
      }, Si.prototype.get = function (t) {
        var e = this.__data__,
            i = Ai(e, t);
        return i < 0 ? void 0 : e[i][1];
      }, Si.prototype.has = function (t) {
        return Ai(this.__data__, t) > -1;
      }, Si.prototype.set = function (t, e) {
        var i = this.__data__,
            r = Ai(i, t);
        return r < 0 ? i.push([t, e]) : i[r][1] = e, this;
      }, Li.prototype.clear = function () {
        this.__data__ = {
          hash: new _i(),
          map: new (wi || Si)(),
          string: new _i()
        };
      }, Li.prototype.delete = function (t) {
        return ki(this, t).delete(t);
      }, Li.prototype.get = function (t) {
        return ki(this, t).get(t);
      }, Li.prototype.has = function (t) {
        return ki(this, t).has(t);
      }, Li.prototype.set = function (t, e) {
        return ki(this, t).set(t, e), this;
      }, Ti.Cache = Li;

      var ji = Ti,
          Ci = function () {
        if ("undefined" != typeof Map) return Map;

        function t(t, e) {
          var i = -1;
          return t.some(function (t, r) {
            return t[0] === e && (i = r, !0);
          }), i;
        }

        return function () {
          function e() {
            this.__entries__ = [];
          }

          return Object.defineProperty(e.prototype, "size", {
            get: function get() {
              return this.__entries__.length;
            },
            enumerable: !0,
            configurable: !0
          }), e.prototype.get = function (e) {
            var i = t(this.__entries__, e),
                r = this.__entries__[i];
            return r && r[1];
          }, e.prototype.set = function (e, i) {
            var r = t(this.__entries__, e);
            ~r ? this.__entries__[r][1] = i : this.__entries__.push([e, i]);
          }, e.prototype.delete = function (e) {
            var i = this.__entries__,
                r = t(i, e);
            ~r && i.splice(r, 1);
          }, e.prototype.has = function (e) {
            return !!~t(this.__entries__, e);
          }, e.prototype.clear = function () {
            this.__entries__.splice(0);
          }, e.prototype.forEach = function (t, e) {
            void 0 === e && (e = null);

            for (var i = 0, r = this.__entries__; i < r.length; i++) {
              var n = r[i];
              t.call(e, n[1], n[0]);
            }
          }, e;
        }();
      }(),
          Ni = "undefined" != typeof window && "undefined" != typeof document && window.document === document,
          zi = "undefined" != typeof commonjsGlobal && commonjsGlobal.Math === Math ? commonjsGlobal : "undefined" != typeof self && self.Math === Math ? self : "undefined" != typeof window && window.Math === Math ? window : Function("return this")(),
          Di = "function" == typeof requestAnimationFrame ? requestAnimationFrame.bind(zi) : function (t) {
        return setTimeout(function () {
          return t(Date.now());
        }, 1e3 / 60);
      },
          Vi = 2;

      var Ii = 20,
          Bi = ["top", "right", "bottom", "left", "width", "height", "size", "weight"],
          Pi = "undefined" != typeof MutationObserver,
          Hi = function () {
        function t() {
          this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = function (t, e) {
            var i = !1,
                r = !1,
                n = 0;

            function s() {
              i && (i = !1, t()), r && a();
            }

            function o() {
              Di(s);
            }

            function a() {
              var t = Date.now();

              if (i) {
                if (t - n < Vi) return;
                r = !0;
              } else i = !0, r = !1, setTimeout(o, e);

              n = t;
            }

            return a;
          }(this.refresh.bind(this), Ii);
        }

        return t.prototype.addObserver = function (t) {
          ~this.observers_.indexOf(t) || this.observers_.push(t), this.connected_ || this.connect_();
        }, t.prototype.removeObserver = function (t) {
          var e = this.observers_,
              i = e.indexOf(t);
          ~i && e.splice(i, 1), !e.length && this.connected_ && this.disconnect_();
        }, t.prototype.refresh = function () {
          this.updateObservers_() && this.refresh();
        }, t.prototype.updateObservers_ = function () {
          var t = this.observers_.filter(function (t) {
            return t.gatherActive(), t.hasActive();
          });
          return t.forEach(function (t) {
            return t.broadcastActive();
          }), t.length > 0;
        }, t.prototype.connect_ = function () {
          Ni && !this.connected_ && (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), Pi ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
            attributes: !0,
            childList: !0,
            characterData: !0,
            subtree: !0
          })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
        }, t.prototype.disconnect_ = function () {
          Ni && this.connected_ && (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
        }, t.prototype.onTransitionEnd_ = function (t) {
          var e = t.propertyName,
              i = void 0 === e ? "" : e;
          Bi.some(function (t) {
            return !!~i.indexOf(t);
          }) && this.refresh();
        }, t.getInstance = function () {
          return this.instance_ || (this.instance_ = new t()), this.instance_;
        }, t.instance_ = null, t;
      }(),
          Fi = function Fi(t, e) {
        for (var i = 0, r = Object.keys(e); i < r.length; i++) {
          var n = r[i];
          Object.defineProperty(t, n, {
            value: e[n],
            enumerable: !1,
            writable: !1,
            configurable: !0
          });
        }

        return t;
      },
          qi = function qi(t) {
        return t && t.ownerDocument && t.ownerDocument.defaultView || zi;
      },
          $i = Ji(0, 0, 0, 0);

      function Yi(t) {
        return parseFloat(t) || 0;
      }

      function Xi(t) {
        for (var e = [], i = 1; i < arguments.length; i++) {
          e[i - 1] = arguments[i];
        }

        return e.reduce(function (e, i) {
          return e + Yi(t["border-" + i + "-width"]);
        }, 0);
      }

      function Gi(t) {
        var e = t.clientWidth,
            i = t.clientHeight;
        if (!e && !i) return $i;

        var r = qi(t).getComputedStyle(t),
            n = function (t) {
          for (var e = {}, i = 0, r = ["top", "right", "bottom", "left"]; i < r.length; i++) {
            var n = r[i],
                s = t["padding-" + n];
            e[n] = Yi(s);
          }

          return e;
        }(r),
            s = n.left + n.right,
            o = n.top + n.bottom,
            a = Yi(r.width),
            l = Yi(r.height);

        if ("border-box" === r.boxSizing && (Math.round(a + s) !== e && (a -= Xi(r, "left", "right") + s), Math.round(l + o) !== i && (l -= Xi(r, "top", "bottom") + o)), !function (t) {
          return t === qi(t).document.documentElement;
        }(t)) {
          var c = Math.round(a + s) - e,
              u = Math.round(l + o) - i;
          1 !== Math.abs(c) && (a -= c), 1 !== Math.abs(u) && (l -= u);
        }

        return Ji(n.left, n.top, a, l);
      }

      var Ki = "undefined" != typeof SVGGraphicsElement ? function (t) {
        return t instanceof qi(t).SVGGraphicsElement;
      } : function (t) {
        return t instanceof qi(t).SVGElement && "function" == typeof t.getBBox;
      };

      function Ui(t) {
        return Ni ? Ki(t) ? function (t) {
          var e = t.getBBox();
          return Ji(0, 0, e.width, e.height);
        }(t) : Gi(t) : $i;
      }

      function Ji(t, e, i, r) {
        return {
          x: t,
          y: e,
          width: i,
          height: r
        };
      }

      var Qi = function () {
        function t(t) {
          this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = Ji(0, 0, 0, 0), this.target = t;
        }

        return t.prototype.isActive = function () {
          var t = Ui(this.target);
          return this.contentRect_ = t, t.width !== this.broadcastWidth || t.height !== this.broadcastHeight;
        }, t.prototype.broadcastRect = function () {
          var t = this.contentRect_;
          return this.broadcastWidth = t.width, this.broadcastHeight = t.height, t;
        }, t;
      }(),
          Zi = function () {
        return function (t, e) {
          var i,
              r,
              n,
              s,
              o,
              a,
              l,
              c = (r = (i = e).x, n = i.y, s = i.width, o = i.height, a = "undefined" != typeof DOMRectReadOnly ? DOMRectReadOnly : Object, l = Object.create(a.prototype), Fi(l, {
            x: r,
            y: n,
            width: s,
            height: o,
            top: n,
            right: r + s,
            bottom: o + n,
            left: r
          }), l);
          Fi(this, {
            target: t,
            contentRect: c
          });
        };
      }(),
          tr = function () {
        function t(t, e, i) {
          if (this.activeObservations_ = [], this.observations_ = new Ci(), "function" != typeof t) throw new TypeError("The callback provided as parameter 1 is not a function.");
          this.callback_ = t, this.controller_ = e, this.callbackCtx_ = i;
        }

        return t.prototype.observe = function (t) {
          if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");

          if ("undefined" != typeof Element && Element instanceof Object) {
            if (!(t instanceof qi(t).Element)) throw new TypeError('parameter 1 is not of type "Element".');
            var e = this.observations_;
            e.has(t) || (e.set(t, new Qi(t)), this.controller_.addObserver(this), this.controller_.refresh());
          }
        }, t.prototype.unobserve = function (t) {
          if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");

          if ("undefined" != typeof Element && Element instanceof Object) {
            if (!(t instanceof qi(t).Element)) throw new TypeError('parameter 1 is not of type "Element".');
            var e = this.observations_;
            e.has(t) && (e.delete(t), e.size || this.controller_.removeObserver(this));
          }
        }, t.prototype.disconnect = function () {
          this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
        }, t.prototype.gatherActive = function () {
          var t = this;
          this.clearActive(), this.observations_.forEach(function (e) {
            e.isActive() && t.activeObservations_.push(e);
          });
        }, t.prototype.broadcastActive = function () {
          if (this.hasActive()) {
            var t = this.callbackCtx_,
                e = this.activeObservations_.map(function (t) {
              return new Zi(t.target, t.broadcastRect());
            });
            this.callback_.call(t, e, t), this.clearActive();
          }
        }, t.prototype.clearActive = function () {
          this.activeObservations_.splice(0);
        }, t.prototype.hasActive = function () {
          return this.activeObservations_.length > 0;
        }, t;
      }(),
          er = "undefined" != typeof WeakMap ? new WeakMap() : new Ci(),
          ir = function () {
        return function t(e) {
          if (!(this instanceof t)) throw new TypeError("Cannot call a class as a function.");
          if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");
          var i = Hi.getInstance(),
              r = new tr(e, i, this);
          er.set(this, r);
        };
      }();

      ["observe", "unobserve", "disconnect"].forEach(function (t) {
        ir.prototype[t] = function () {
          var e;
          return (e = er.get(this))[t].apply(e, arguments);
        };
      });
      var rr = void 0 !== zi.ResizeObserver ? zi.ResizeObserver : ir,
          nr = !("undefined" == typeof window || !window.document || !window.document.createElement);

      function sr() {
        if ("undefined" == typeof document) return 0;
        var t = document.body,
            e = document.createElement("div"),
            i = e.style;
        i.position = "fixed", i.left = 0, i.visibility = "hidden", i.overflowY = "scroll", t.appendChild(e);
        var r = e.getBoundingClientRect().right;
        return t.removeChild(e), r;
      }

      var or = function () {
        function t(e, i) {
          var r = this;
          this.onScroll = function () {
            r.scrollXTicking || (window.requestAnimationFrame(r.scrollX), r.scrollXTicking = !0), r.scrollYTicking || (window.requestAnimationFrame(r.scrollY), r.scrollYTicking = !0);
          }, this.scrollX = function () {
            r.axis.x.isOverflowing && (r.showScrollbar("x"), r.positionScrollbar("x")), r.scrollXTicking = !1;
          }, this.scrollY = function () {
            r.axis.y.isOverflowing && (r.showScrollbar("y"), r.positionScrollbar("y")), r.scrollYTicking = !1;
          }, this.onMouseEnter = function () {
            r.showScrollbar("x"), r.showScrollbar("y");
          }, this.onMouseMove = function (t) {
            r.mouseX = t.clientX, r.mouseY = t.clientY, (r.axis.x.isOverflowing || r.axis.x.forceVisible) && r.onMouseMoveForAxis("x"), (r.axis.y.isOverflowing || r.axis.y.forceVisible) && r.onMouseMoveForAxis("y");
          }, this.onMouseLeave = function () {
            r.onMouseMove.cancel(), (r.axis.x.isOverflowing || r.axis.x.forceVisible) && r.onMouseLeaveForAxis("x"), (r.axis.y.isOverflowing || r.axis.y.forceVisible) && r.onMouseLeaveForAxis("y"), r.mouseX = -1, r.mouseY = -1;
          }, this.onWindowResize = function () {
            r.scrollbarWidth = sr(), r.hideNativeScrollbar();
          }, this.hideScrollbars = function () {
            r.axis.x.track.rect = r.axis.x.track.el.getBoundingClientRect(), r.axis.y.track.rect = r.axis.y.track.el.getBoundingClientRect(), r.isWithinBounds(r.axis.y.track.rect) || (r.axis.y.scrollbar.el.classList.remove(r.classNames.visible), r.axis.y.isVisible = !1), r.isWithinBounds(r.axis.x.track.rect) || (r.axis.x.scrollbar.el.classList.remove(r.classNames.visible), r.axis.x.isVisible = !1);
          }, this.onPointerEvent = function (t) {
            var e, i;
            r.axis.x.scrollbar.rect = r.axis.x.scrollbar.el.getBoundingClientRect(), r.axis.y.scrollbar.rect = r.axis.y.scrollbar.el.getBoundingClientRect(), (r.axis.x.isOverflowing || r.axis.x.forceVisible) && (i = r.isWithinBounds(r.axis.x.scrollbar.rect)), (r.axis.y.isOverflowing || r.axis.y.forceVisible) && (e = r.isWithinBounds(r.axis.y.scrollbar.rect)), (e || i) && (t.preventDefault(), t.stopPropagation(), "mousedown" === t.type && (e && r.onDragStart(t, "y"), i && r.onDragStart(t, "x")));
          }, this.drag = function (e) {
            var i = r.axis[r.draggedAxis].track,
                n = i.rect[r.axis[r.draggedAxis].sizeAttr],
                s = r.axis[r.draggedAxis].scrollbar,
                o = r.contentWrapperEl[r.axis[r.draggedAxis].scrollSizeAttr],
                a = parseInt(r.elStyles[r.axis[r.draggedAxis].sizeAttr], 10);
            e.preventDefault(), e.stopPropagation();
            var l = (("y" === r.draggedAxis ? e.pageY : e.pageX) - i.rect[r.axis[r.draggedAxis].offsetAttr] - r.axis[r.draggedAxis].dragOffset) / (n - s.size) * (o - a);
            "x" === r.draggedAxis && (l = r.isRtl && t.getRtlHelpers().isRtlScrollbarInverted ? l - (n + s.size) : l, l = r.isRtl && t.getRtlHelpers().isRtlScrollingInverted ? -l : l), r.contentWrapperEl[r.axis[r.draggedAxis].scrollOffsetAttr] = l;
          }, this.onEndDrag = function (t) {
            t.preventDefault(), t.stopPropagation(), r.el.classList.remove(r.classNames.dragging), document.removeEventListener("mousemove", r.drag, !0), document.removeEventListener("mouseup", r.onEndDrag, !0), r.removePreventClickId = window.setTimeout(function () {
              document.removeEventListener("click", r.preventClick, !0), document.removeEventListener("dblclick", r.preventClick, !0), r.removePreventClickId = null;
            });
          }, this.preventClick = function (t) {
            t.preventDefault(), t.stopPropagation();
          }, this.el = e, this.flashTimeout, this.contentEl, this.contentWrapperEl, this.offsetEl, this.maskEl, this.globalObserver, this.mutationObserver, this.resizeObserver, this.scrollbarWidth, this.minScrollbarWidth = 20, this.options = Object.assign({}, t.defaultOptions, i), this.classNames = Object.assign({}, t.defaultOptions.classNames, this.options.classNames), this.isRtl, this.axis = {
            x: {
              scrollOffsetAttr: "scrollLeft",
              sizeAttr: "width",
              scrollSizeAttr: "scrollWidth",
              offsetAttr: "left",
              overflowAttr: "overflowX",
              dragOffset: 0,
              isOverflowing: !0,
              isVisible: !1,
              forceVisible: !1,
              track: {},
              scrollbar: {}
            },
            y: {
              scrollOffsetAttr: "scrollTop",
              sizeAttr: "height",
              scrollSizeAttr: "scrollHeight",
              offsetAttr: "top",
              overflowAttr: "overflowY",
              dragOffset: 0,
              isOverflowing: !0,
              isVisible: !1,
              forceVisible: !1,
              track: {},
              scrollbar: {}
            }
          }, this.removePreventClickId = null, this.el.SimpleBar || (this.recalculate = Ie(this.recalculate.bind(this), 64), this.onMouseMove = Ie(this.onMouseMove.bind(this), 64), this.hideScrollbars = ri(this.hideScrollbars.bind(this), this.options.timeout), this.onWindowResize = ri(this.onWindowResize.bind(this), 64, {
            leading: !0
          }), t.getRtlHelpers = ji(t.getRtlHelpers), this.init());
        }

        t.getRtlHelpers = function () {
          var e = document.createElement("div");
          e.innerHTML = '<div class="hs-dummy-scrollbar-size"><div style="height: 200%; width: 200%; margin: 10px 0;"></div></div>';
          var i = e.firstElementChild;
          document.body.appendChild(i);
          var r = i.firstElementChild;
          i.scrollLeft = 0;
          var n = t.getOffset(i),
              s = t.getOffset(r);
          i.scrollLeft = 999;
          var o = t.getOffset(r);
          return {
            isRtlScrollingInverted: n.left !== s.left && s.left - o.left != 0,
            isRtlScrollbarInverted: n.left !== s.left
          };
        }, t.initHtmlApi = function () {
          this.initDOMLoadedElements = this.initDOMLoadedElements.bind(this), "undefined" != typeof MutationObserver && (this.globalObserver = new MutationObserver(function (e) {
            e.forEach(function (e) {
              Array.prototype.forEach.call(e.addedNodes, function (e) {
                1 === e.nodeType && (e.hasAttribute("data-simplebar") ? !e.SimpleBar && new t(e, t.getElOptions(e)) : Array.prototype.forEach.call(e.querySelectorAll("[data-simplebar]"), function (e) {
                  !e.SimpleBar && new t(e, t.getElOptions(e));
                }));
              }), Array.prototype.forEach.call(e.removedNodes, function (t) {
                1 === t.nodeType && (t.hasAttribute("data-simplebar") ? t.SimpleBar && t.SimpleBar.unMount() : Array.prototype.forEach.call(t.querySelectorAll("[data-simplebar]"), function (t) {
                  t.SimpleBar && t.SimpleBar.unMount();
                }));
              });
            });
          }), this.globalObserver.observe(document, {
            childList: !0,
            subtree: !0
          })), "complete" === document.readyState || "loading" !== document.readyState && !document.documentElement.doScroll ? window.setTimeout(this.initDOMLoadedElements) : (document.addEventListener("DOMContentLoaded", this.initDOMLoadedElements), window.addEventListener("load", this.initDOMLoadedElements));
        }, t.getElOptions = function (t) {
          return Array.prototype.reduce.call(t.attributes, function (t, e) {
            var i = e.name.match(/data-simplebar-(.+)/);

            if (i) {
              var r = i[1].replace(/\W+(.)/g, function (t, e) {
                return e.toUpperCase();
              });

              switch (e.value) {
                case "true":
                  t[r] = !0;
                  break;

                case "false":
                  t[r] = !1;
                  break;

                case void 0:
                  t[r] = !0;
                  break;

                default:
                  t[r] = e.value;
              }
            }

            return t;
          }, {});
        }, t.removeObserver = function () {
          this.globalObserver.disconnect();
        }, t.initDOMLoadedElements = function () {
          document.removeEventListener("DOMContentLoaded", this.initDOMLoadedElements), window.removeEventListener("load", this.initDOMLoadedElements), Array.prototype.forEach.call(document.querySelectorAll("[data-simplebar]"), function (e) {
            e.SimpleBar || new t(e, t.getElOptions(e));
          });
        }, t.getOffset = function (t) {
          var e = t.getBoundingClientRect();
          return {
            top: e.top + (window.pageYOffset || document.documentElement.scrollTop),
            left: e.left + (window.pageXOffset || document.documentElement.scrollLeft)
          };
        };
        var e = t.prototype;
        return e.init = function () {
          this.el.SimpleBar = this, nr && (this.initDOM(), this.scrollbarWidth = sr(), this.recalculate(), this.initListeners());
        }, e.initDOM = function () {
          var t = this;
          if (Array.prototype.filter.call(this.el.children, function (e) {
            return e.classList.contains(t.classNames.wrapper);
          }).length) this.wrapperEl = this.el.querySelector("." + this.classNames.wrapper), this.contentWrapperEl = this.el.querySelector("." + this.classNames.contentWrapper), this.offsetEl = this.el.querySelector("." + this.classNames.offset), this.maskEl = this.el.querySelector("." + this.classNames.mask), this.contentEl = this.el.querySelector("." + this.classNames.contentEl), this.placeholderEl = this.el.querySelector("." + this.classNames.placeholder), this.heightAutoObserverWrapperEl = this.el.querySelector("." + this.classNames.heightAutoObserverWrapperEl), this.heightAutoObserverEl = this.el.querySelector("." + this.classNames.heightAutoObserverEl), this.axis.x.track.el = this.findChild(this.el, "." + this.classNames.track + "." + this.classNames.horizontal), this.axis.y.track.el = this.findChild(this.el, "." + this.classNames.track + "." + this.classNames.vertical);else {
            for (this.wrapperEl = document.createElement("div"), this.contentWrapperEl = document.createElement("div"), this.offsetEl = document.createElement("div"), this.maskEl = document.createElement("div"), this.contentEl = document.createElement("div"), this.placeholderEl = document.createElement("div"), this.heightAutoObserverWrapperEl = document.createElement("div"), this.heightAutoObserverEl = document.createElement("div"), this.wrapperEl.classList.add(this.classNames.wrapper), this.contentWrapperEl.classList.add(this.classNames.contentWrapper), this.offsetEl.classList.add(this.classNames.offset), this.maskEl.classList.add(this.classNames.mask), this.contentEl.classList.add(this.classNames.contentEl), this.placeholderEl.classList.add(this.classNames.placeholder), this.heightAutoObserverWrapperEl.classList.add(this.classNames.heightAutoObserverWrapperEl), this.heightAutoObserverEl.classList.add(this.classNames.heightAutoObserverEl); this.el.firstChild;) {
              this.contentEl.appendChild(this.el.firstChild);
            }

            this.contentWrapperEl.appendChild(this.contentEl), this.offsetEl.appendChild(this.contentWrapperEl), this.maskEl.appendChild(this.offsetEl), this.heightAutoObserverWrapperEl.appendChild(this.heightAutoObserverEl), this.wrapperEl.appendChild(this.heightAutoObserverWrapperEl), this.wrapperEl.appendChild(this.maskEl), this.wrapperEl.appendChild(this.placeholderEl), this.el.appendChild(this.wrapperEl);
          }

          if (!this.axis.x.track.el || !this.axis.y.track.el) {
            var e = document.createElement("div"),
                i = document.createElement("div");
            e.classList.add(this.classNames.track), i.classList.add(this.classNames.scrollbar), e.appendChild(i), this.axis.x.track.el = e.cloneNode(!0), this.axis.x.track.el.classList.add(this.classNames.horizontal), this.axis.y.track.el = e.cloneNode(!0), this.axis.y.track.el.classList.add(this.classNames.vertical), this.el.appendChild(this.axis.x.track.el), this.el.appendChild(this.axis.y.track.el);
          }

          this.axis.x.scrollbar.el = this.axis.x.track.el.querySelector("." + this.classNames.scrollbar), this.axis.y.scrollbar.el = this.axis.y.track.el.querySelector("." + this.classNames.scrollbar), this.options.autoHide || (this.axis.x.scrollbar.el.classList.add(this.classNames.visible), this.axis.y.scrollbar.el.classList.add(this.classNames.visible)), this.el.setAttribute("data-simplebar", "init");
        }, e.initListeners = function () {
          var t = this;
          this.options.autoHide && this.el.addEventListener("mouseenter", this.onMouseEnter), ["mousedown", "click", "dblclick"].forEach(function (e) {
            t.el.addEventListener(e, t.onPointerEvent, !0);
          }), ["touchstart", "touchend", "touchmove"].forEach(function (e) {
            t.el.addEventListener(e, t.onPointerEvent, {
              capture: !0,
              passive: !0
            });
          }), this.el.addEventListener("mousemove", this.onMouseMove), this.el.addEventListener("mouseleave", this.onMouseLeave), this.contentWrapperEl.addEventListener("scroll", this.onScroll), window.addEventListener("resize", this.onWindowResize), this.resizeObserver = new rr(this.recalculate), this.resizeObserver.observe(this.el), this.resizeObserver.observe(this.contentEl);
        }, e.recalculate = function () {
          var t = this.heightAutoObserverEl.offsetHeight <= 1,
              e = this.heightAutoObserverEl.offsetWidth <= 1;
          this.elStyles = window.getComputedStyle(this.el), this.isRtl = "rtl" === this.elStyles.direction, this.contentEl.style.padding = this.elStyles.paddingTop + " " + this.elStyles.paddingRight + " " + this.elStyles.paddingBottom + " " + this.elStyles.paddingLeft, this.wrapperEl.style.margin = "-" + this.elStyles.paddingTop + " -" + this.elStyles.paddingRight + " -" + this.elStyles.paddingBottom + " -" + this.elStyles.paddingLeft, this.contentWrapperEl.style.height = t ? "auto" : "100%", this.placeholderEl.style.width = e ? this.contentEl.offsetWidth + "px" : "auto", this.placeholderEl.style.height = this.contentEl.scrollHeight + "px", this.axis.x.isOverflowing = this.contentWrapperEl.scrollWidth > this.contentWrapperEl.offsetWidth, this.axis.y.isOverflowing = this.contentWrapperEl.scrollHeight > this.contentWrapperEl.offsetHeight, this.axis.x.isOverflowing = "hidden" !== this.elStyles.overflowX && this.axis.x.isOverflowing, this.axis.y.isOverflowing = "hidden" !== this.elStyles.overflowY && this.axis.y.isOverflowing, this.axis.x.forceVisible = "x" === this.options.forceVisible || !0 === this.options.forceVisible, this.axis.y.forceVisible = "y" === this.options.forceVisible || !0 === this.options.forceVisible, this.hideNativeScrollbar(), this.axis.x.track.rect = this.axis.x.track.el.getBoundingClientRect(), this.axis.y.track.rect = this.axis.y.track.el.getBoundingClientRect(), this.axis.x.scrollbar.size = this.getScrollbarSize("x"), this.axis.y.scrollbar.size = this.getScrollbarSize("y"), this.axis.x.scrollbar.el.style.width = this.axis.x.scrollbar.size + "px", this.axis.y.scrollbar.el.style.height = this.axis.y.scrollbar.size + "px", this.positionScrollbar("x"), this.positionScrollbar("y"), this.toggleTrackVisibility("x"), this.toggleTrackVisibility("y");
        }, e.getScrollbarSize = function (t) {
          void 0 === t && (t = "y");
          var e,
              i = this.scrollbarWidth ? this.contentWrapperEl[this.axis[t].scrollSizeAttr] : this.contentWrapperEl[this.axis[t].scrollSizeAttr] - this.minScrollbarWidth,
              r = this.axis[t].track.rect[this.axis[t].sizeAttr];

          if (this.axis[t].isOverflowing) {
            var n = r / i;
            return e = Math.max(~~(n * r), this.options.scrollbarMinSize), this.options.scrollbarMaxSize && (e = Math.min(e, this.options.scrollbarMaxSize)), e;
          }
        }, e.positionScrollbar = function (e) {
          void 0 === e && (e = "y");
          var i = this.contentWrapperEl[this.axis[e].scrollSizeAttr],
              r = this.axis[e].track.rect[this.axis[e].sizeAttr],
              n = parseInt(this.elStyles[this.axis[e].sizeAttr], 10),
              s = this.axis[e].scrollbar,
              o = this.contentWrapperEl[this.axis[e].scrollOffsetAttr],
              a = (o = "x" === e && this.isRtl && t.getRtlHelpers().isRtlScrollingInverted ? -o : o) / (i - n),
              l = ~~((r - s.size) * a);
          l = "x" === e && this.isRtl && t.getRtlHelpers().isRtlScrollbarInverted ? l + (r - s.size) : l, s.el.style.transform = "x" === e ? "translate3d(" + l + "px, 0, 0)" : "translate3d(0, " + l + "px, 0)";
        }, e.toggleTrackVisibility = function (t) {
          void 0 === t && (t = "y");
          var e = this.axis[t].track.el,
              i = this.axis[t].scrollbar.el;
          this.axis[t].isOverflowing || this.axis[t].forceVisible ? (e.style.visibility = "visible", this.contentWrapperEl.style[this.axis[t].overflowAttr] = "scroll") : (e.style.visibility = "hidden", this.contentWrapperEl.style[this.axis[t].overflowAttr] = "hidden"), this.axis[t].isOverflowing ? i.style.display = "block" : i.style.display = "none";
        }, e.hideNativeScrollbar = function () {
          if (this.offsetEl.style[this.isRtl ? "left" : "right"] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? "-" + (this.scrollbarWidth || this.minScrollbarWidth) + "px" : 0, this.offsetEl.style.bottom = this.axis.x.isOverflowing || this.axis.x.forceVisible ? "-" + (this.scrollbarWidth || this.minScrollbarWidth) + "px" : 0, !this.scrollbarWidth) {
            var t = [this.isRtl ? "paddingLeft" : "paddingRight"];
            this.contentWrapperEl.style[t] = this.axis.y.isOverflowing || this.axis.y.forceVisible ? this.minScrollbarWidth + "px" : 0, this.contentWrapperEl.style.paddingBottom = this.axis.x.isOverflowing || this.axis.x.forceVisible ? this.minScrollbarWidth + "px" : 0;
          }
        }, e.onMouseMoveForAxis = function (t) {
          void 0 === t && (t = "y"), this.axis[t].track.rect = this.axis[t].track.el.getBoundingClientRect(), this.axis[t].scrollbar.rect = this.axis[t].scrollbar.el.getBoundingClientRect(), this.isWithinBounds(this.axis[t].scrollbar.rect) ? this.axis[t].scrollbar.el.classList.add(this.classNames.hover) : this.axis[t].scrollbar.el.classList.remove(this.classNames.hover), this.isWithinBounds(this.axis[t].track.rect) ? (this.showScrollbar(t), this.axis[t].track.el.classList.add(this.classNames.hover)) : this.axis[t].track.el.classList.remove(this.classNames.hover);
        }, e.onMouseLeaveForAxis = function (t) {
          void 0 === t && (t = "y"), this.axis[t].track.el.classList.remove(this.classNames.hover), this.axis[t].scrollbar.el.classList.remove(this.classNames.hover);
        }, e.showScrollbar = function (t) {
          void 0 === t && (t = "y");
          var e = this.axis[t].scrollbar.el;
          this.axis[t].isVisible || (e.classList.add(this.classNames.visible), this.axis[t].isVisible = !0), this.options.autoHide && this.hideScrollbars();
        }, e.onDragStart = function (t, e) {
          void 0 === e && (e = "y");
          var i = this.axis[e].scrollbar.el,
              r = "y" === e ? t.pageY : t.pageX;
          this.axis[e].dragOffset = r - i.getBoundingClientRect()[this.axis[e].offsetAttr], this.draggedAxis = e, this.el.classList.add(this.classNames.dragging), document.addEventListener("mousemove", this.drag, !0), document.addEventListener("mouseup", this.onEndDrag, !0), null === this.removePreventClickId ? (document.addEventListener("click", this.preventClick, !0), document.addEventListener("dblclick", this.preventClick, !0)) : (window.clearTimeout(this.removePreventClickId), this.removePreventClickId = null);
        }, e.getContentElement = function () {
          return this.contentEl;
        }, e.getScrollElement = function () {
          return this.contentWrapperEl;
        }, e.removeListeners = function () {
          var t = this;
          this.options.autoHide && this.el.removeEventListener("mouseenter", this.onMouseEnter), ["mousedown", "click", "dblclick"].forEach(function (e) {
            t.el.removeEventListener(e, t.onPointerEvent, !0);
          }), ["touchstart", "touchend", "touchmove"].forEach(function (e) {
            t.el.removeEventListener(e, t.onPointerEvent, {
              capture: !0,
              passive: !0
            });
          }), this.el.removeEventListener("mousemove", this.onMouseMove), this.el.removeEventListener("mouseleave", this.onMouseLeave), this.contentWrapperEl.removeEventListener("scroll", this.onScroll), window.removeEventListener("resize", this.onWindowResize), this.mutationObserver && this.mutationObserver.disconnect(), this.resizeObserver.disconnect(), this.recalculate.cancel(), this.onMouseMove.cancel(), this.hideScrollbars.cancel(), this.onWindowResize.cancel();
        }, e.unMount = function () {
          this.removeListeners(), this.el.SimpleBar = null;
        }, e.isChildNode = function (t) {
          return null !== t && (t === this.el || this.isChildNode(t.parentNode));
        }, e.isWithinBounds = function (t) {
          return this.mouseX >= t.left && this.mouseX <= t.left + t.width && this.mouseY >= t.top && this.mouseY <= t.top + t.height;
        }, e.findChild = function (t, e) {
          var i = t.matches || t.webkitMatchesSelector || t.mozMatchesSelector || t.msMatchesSelector;
          return Array.prototype.filter.call(t.children, function (t) {
            return i.call(t, e);
          })[0];
        }, t;
      }();

      return or.defaultOptions = {
        autoHide: !0,
        forceVisible: !1,
        classNames: {
          contentEl: "simplebar-content",
          contentWrapper: "simplebar-content-wrapper",
          offset: "simplebar-offset",
          mask: "simplebar-mask",
          wrapper: "simplebar-wrapper",
          placeholder: "simplebar-placeholder",
          scrollbar: "simplebar-scrollbar",
          track: "simplebar-track",
          heightAutoObserverWrapperEl: "simplebar-height-auto-observer-wrapper",
          heightAutoObserverEl: "simplebar-height-auto-observer",
          visible: "simplebar-visible",
          horizontal: "simplebar-horizontal",
          vertical: "simplebar-vertical",
          hover: "simplebar-hover",
          dragging: "simplebar-dragging"
        },
        scrollbarMinSize: 25,
        scrollbarMaxSize: 0,
        timeout: 1e3
      }, nr && or.initHtmlApi(), or;
    });
  });

  var dealLog = (function () {
    var dealLog = document.querySelector('.deal-log');

    if (dealLog) {
      var simpleBar = new simplebar_min(dealLog, {
        autoHide: false,
        forceVisible: true
      });
      simpleBar.getScrollElement();
    }
  });

  var communicationHeader = (function () {
    var togglers = document.querySelectorAll('.communication-header__button');
    var communicationContent = document.querySelectorAll('.communication__content');
    if (!togglers) return;

    var clearState = function clearState() {
      for (var i = 0; i < togglers.length; i++) {
        togglers[i].classList.remove('active');
      }

      for (var _i = 0; _i < communicationContent.length; _i++) {
        communicationContent[_i].classList.remove('show');
      }
    };

    var toggleOnClick = function toggleOnClick(evt) {
      clearState();
      var id = evt.target.getAttribute('data-target');
      var content = document.getElementById(id);
      evt.target.classList.add('active');
      content.classList.add('show');
    };

    for (var i = 0; i < togglers.length; i++) {
      togglers[i].addEventListener('click', toggleOnClick);
    }
  });

  /* eslint-disable */
  // endregion

  utils();
  example(); //todo remove

  modal();
  dataTable();
  select();
  field();
  tabControls();
  dateTime();
  tagsBlock();
  dealForm();
  messageBox();
  taskWidget();
  dealLog();
  communicationHeader();

}());
//# sourceMappingURL=main.js.map
