'use strict';function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}var script = {
  name: 'SbottomSheet',
  props: {
    value: {
      default: false,
      type: Boolean
    },
    height: {
      default: "auto",
      type: String
    },
    minHeight: {
      default: "10px",
      type: String
    },
    maxHeight: {
      default: "calc(100% - 30px)",
      type: String
    },
    width: {
      default: "auto",
      type: String
    },
    minWidth: {
      default: "200px",
      type: String
    },
    maxWidth: {
      default: "100%",
      type: String
    },
    sheetColor: {
      default: "#ffffff",
      type: String
    },
    overlayColor: {
      default: "rgba(0, 0, 0, 0.5)",
      type: String
    },
    slideIconColor: {
      default: "#D9DDE4",
      type: String
    },
    radius: {
      default: "20px",
      type: String
    },
    threshold: {
      // percentage
      default: 150,
      type: Number
    },
    outsideClose: {
      // 시트 바깥 눌러서 닫기
      default: true,
      type: Boolean
    },
    outsideClick: {
      // 시트 바깥 클릭 되도록
      default: false,
      type: Boolean
    },
    outsideScroll: {
      // 시트 바깥 스크롤 되도록
      default: false,
      type: Boolean
    },
    overlay: {
      // 시트 밖 음영 처리
      default: true,
      type: Boolean
    },
    draggable: {
      default: true,
      type: Boolean
    },
    threeStep: {
      default: false,
      type: Boolean
    }
  },
  data: function data() {
    return {
      isVisible: this.value,
      sheetY: this.height,
      startY: 0,
      transformY: 0,
      transition: 'none',
      steps: 1,
      checkPosition: this.outsideClick && !this.outsideClose && !this.overlay
    };
  },
  computed: {
    getStyle: function getStyle() {
      var style = {
        '--height': this.sheetY,
        '--min-height': this.minHeight,
        '--max-height': this.maxHeight,
        '--width': this.wdith,
        '--min-width': this.minWidth,
        '--max-width': this.maxWidth,
        '--sheet-color': this.sheetColor,
        '--overlay-color': !this.overlay ? '' : this.overlayColor,
        '--slide-icon-color': this.slideIconColor,
        '--border-radius': this.radius,
        '--translate-Y': "translateY(".concat(this.transformY, "px)"),
        '--transition': this.transition,
        position: this.checkPosition ? '' : 'fixed'
      };
      return style;
    }
  },
  methods: {
    startDragEvent: function startDragEvent(e) {
      this.transition = 'none';
      if (this.outsideScroll) this.backgroundScrollOff();

      if (e instanceof window.MouseEvent || e instanceof MouseEvent) {
        this.startY = e.clientY;
        window.addEventListener('mousemove', this.onDragEvent);
        window.addEventListener('mouseup', this.endDragEvent);
      } else {
        this.startY = e.touches[0].clientY;
        window.addEventListener('touchmove', this.onDragEvent);
        window.addEventListener('touchend', this.endDragEvent);
      }
    },
    onDragEvent: function onDragEvent(e) {
      this.transformY = this.checkEvent(e) - this.startY;
    },
    endDragEvent: function endDragEvent(e) {
      var EndY = this.checkEvent(e);
      this.transition = 'all';
      if (this.outsideScroll) this.backgroundScrollOn();

      if (this.threeStep) {
        this.changeStep(EndY - this.startY);
      }

      if (EndY - this.startY >= this.threshold) {
        this.closeBottomSheet(true);
      } else {
        this.transformY = 0;
        this.startY = 0;
      }

      window.removeEventListener('mousemove', this.onDragEvent);
      window.removeEventListener('touchmove', this.onDragEvent);
      window.removeEventListener('mouseup', this.endDragEvent);
      window.removeEventListener('touchend', this.endDragEvent);
    },
    animationEndEvent: function animationEndEvent(e) {
      /** initialize all after transform */
      if (!this.value) {
        this.steps = 0;
        this.startY = 0;
        this.transformY = 0;
        this.sheetY = this.height;
        this.isVisible = false;
      }
    },
    checkEvent: function checkEvent(e) {
      if (e instanceof window.MouseEvent || e instanceof MouseEvent) {
        return e.clientY;
      } else {
        return e.changedTouches[0].clientY;
      }
    },
    changeStep: function changeStep(gap) {
      if (gap <= -1 * this.threshold / 2) {
        this.steps = this.steps + 1 > 2 ? 2 : this.steps + 1;
      } else if (gap >= this.threshold / 2) {
        this.steps = this.steps - 1 < 0 ? 0 : this.steps - 1;
      } else return;

      switch (this.steps) {
        case 0:
          this.closeBottomSheet(true);
          break;

        case 1:
          this.sheetY = this.height;
          break;

        case 2:
          this.sheetY = this.maxHeight;
          break;
      }
    },
    closeBottomSheet: function closeBottomSheet(status) {
      if (!this.outsideClose && !status) return;else {
        this.$emit('input', false);
      }
    },
    backgroundScrollOn: function backgroundScrollOn() {
      document.body.style.overflow = '';
      document.body.style.height = '';
    },
    backgroundScrollOff: function backgroundScrollOff() {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    }
  },
  unmounted: function unmounted() {
    this.backgroundScrollOn();
  },
  watch: {
    value: {
      immediate: true,
      handler: function handler(now) {
        if (now) {
          this.steps = 1;
          this.isVisible = true;
          if (!this.outsideScroll) this.backgroundScrollOff();
        } else this.backgroundScrollOn();
      }
    }
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}function createInjectorSSR(context) {
    if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
    }
    if (!context)
        return () => { };
    if (!('styles' in context)) {
        context._styles = context._styles || {};
        Object.defineProperty(context, 'styles', {
            enumerable: true,
            get: () => context._renderStyles(context._styles)
        });
        context._renderStyles = context._renderStyles || renderStyles;
    }
    return (id, style) => addStyle(id, style, context);
}
function addStyle(id, css, context) {
    const group = css.media || 'default' ;
    const style = context._styles[group] || (context._styles[group] = { ids: [], css: '' });
    if (!style.ids.includes(id)) {
        style.media = css.media;
        style.ids.push(id);
        let code = css.source;
        style.css += code + '\n';
    }
}
function renderStyles(styles) {
    let css = '';
    for (const key in styles) {
        const style = styles[key];
        css +=
            '<style data-vue-ssr-id="' +
                Array.from(style.ids).join(' ') +
                '"' +
                (style.media ? ' media="' + style.media + '"' : '') +
                '>' +
                style.css +
                '</style>';
    }
    return css;
}/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _vm.isVisible ? _c('div', {
    staticClass: "s--bottom-sheet-container",
    class: {
      'sheet-close': !_vm.value
    },
    style: _vm.getStyle,
    on: {
      "click": function click($event) {
        if ($event.target !== $event.currentTarget) {
          return null;
        }

        return _vm.closeBottomSheet(false);
      },
      "animationend": _vm.animationEndEvent
    }
  }, [_vm._ssrNode("<div id=\"s--bottom-sheet-sheet\" class=\"s--bottom-sheet-sheet\" data-v-6ba15c83>", "</div>", [_vm._ssrNode((_vm.draggable ? "<header class=\"s--bottom-sheet-header\" data-v-6ba15c83><div class=\"draggable\" data-v-6ba15c83><span data-v-6ba15c83>drag</span></div></header>" : "<!---->") + " "), _vm._ssrNode("<section class=\"s--bottom-sheet-content\" data-v-6ba15c83>", "</section>", [_vm._t("default")], 2)], 2)]) : _vm._e();
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-6ba15c83_0", {
    source: ".s--bottom-sheet-container[data-v-6ba15c83]{width:100%;height:100%;left:0;top:0;z-index:9999}.s--bottom-sheet-container[data-v-6ba15c83]:last-of-type{background:var(--overlay-color)}.s--bottom-sheet-container.sheet-close[data-v-6ba15c83]:last-of-type{-webkit-animation:background-out-data-v-6ba15c83 .35s forwards;animation:background-out-data-v-6ba15c83 .35s forwards}.s--bottom-sheet-container.sheet-close .s--bottom-sheet-sheet[data-v-6ba15c83]{-webkit-animation:slide-out-data-v-6ba15c83 .35s forwards;animation:slide-out-data-v-6ba15c83 .35s forwards}.s--bottom-sheet-container .s--bottom-sheet-sheet[data-v-6ba15c83]{height:var(--height);max-height:var(--max-height);min-height:var(--min-height);width:var(--width);max-width:var(--max-width);min-width:var(--min-width);bottom:0;left:0;right:0;background:var(--sheet-color);border-top-left-radius:var(--border-radius);border-top-right-radius:var(--border-radius);padding:10px;position:fixed;box-shadow:0 6px 30px -6px rgba(0,0,0,.15);transform:var(--translate-Y);margin:0 auto;-webkit-animation:slide-in-data-v-6ba15c83 .4s ease;animation:slide-in-data-v-6ba15c83 .35s ease;transition:var(--transition) .35s ease}.s--bottom-sheet-container .s--bottom-sheet-sheet[data-v-6ba15c83]::after{position:absolute;content:\"\";display:block;left:0;right:0;z-index:-1;top:99%;height:101vh;background-color:var(--sheet-color);width:100%}.s--bottom-sheet-container .s--bottom-sheet-sheet .s--bottom-sheet-header[data-v-6ba15c83]{min-height:15px;position:absolute;top:15px;left:50%;transform:translate(-50%,-50%);width:100%;height:30px}.s--bottom-sheet-container .s--bottom-sheet-sheet .s--bottom-sheet-header .draggable[data-v-6ba15c83]{content:\"\";display:inline-block;width:50px;height:4px;background:var(--slide-icon-color);border-radius:10px;position:absolute;transform:translate(-50%,-50%);left:50%;top:50%}.s--bottom-sheet-container .s--bottom-sheet-sheet .s--bottom-sheet-header .draggable span[data-v-6ba15c83]{position:absolute;clip:rect(0 0 0 0);width:1px;height:1px;margin:-1px;overflow:hidden}.s--bottom-sheet-container .s--bottom-sheet-sheet .s--bottom-sheet-content[data-v-6ba15c83]{width:100%;height:100%;overflow:scroll;touch-action:auto!important;margin-top:20px}@-webkit-keyframes slide-in-data-v-6ba15c83{0%{-webkit-transform:translateY(100%);transform:translateY(100%);opacity:.3}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@keyframes slide-in-data-v-6ba15c83{0%{-webkit-transform:translateY(100%);transform:translateY(100%);opacity:.3}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@-webkit-keyframes slide-out-data-v-6ba15c83{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}100%{-webkit-transform:translateY(100%);transform:translateY(100%);opacity:.3}}@keyframes slide-out-data-v-6ba15c83{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}100%{-webkit-transform:translateY(100%);transform:translateY(100%);opacity:.3}}@-webkit-keyframes background-out-data-v-6ba15c83{0%{opacity:1}100%{opacity:.3}}@keyframes background-out-data-v-6ba15c83{0%{opacity:1}100%{opacity:.3}}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-6ba15c83";
/* module identifier */

var __vue_module_identifier__ = "data-v-6ba15c83";
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject shadow dom */

var __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, undefined, createInjectorSSR, undefined);

var component$1 = __vue_component__;// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var component = /*#__PURE__*/(function () {
  // Get component instance
  var installable = component$1; // Attach install function executed by Vue.use()

  installable.install = function (Vue) {
    Vue.component('SbottomSheet', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;
var namedExports=/*#__PURE__*/Object.freeze({__proto__:null,'default':component});// only expose one global var, with named exports exposed as properties of
// that global var (eg. plugin.namedExport)

Object.entries(namedExports).forEach(function (_ref) {
  var _ref2 = _slicedToArray(_ref, 2),
      exportName = _ref2[0],
      exported = _ref2[1];

  if (exportName !== 'default') component[exportName] = exported;
});module.exports=component;