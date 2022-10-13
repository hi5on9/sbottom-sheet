var script = {
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

  data() {
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
    getStyle() {
      const style = {
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
        '--translate-Y': `translateY(${this.transformY}px)`,
        '--transition': this.transition,
        position: this.checkPosition ? '' : 'fixed'
      };
      return style;
    }

  },
  methods: {
    startDragEvent(e) {
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

    onDragEvent(e) {
      this.transformY = this.checkEvent(e) - this.startY;
    },

    endDragEvent(e) {
      const EndY = this.checkEvent(e);
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

    animationEndEvent(e) {
      /** initialize all after transform */
      if (!this.value) {
        this.steps = 0;
        this.startY = 0;
        this.transformY = 0;
        this.sheetY = this.height;
        this.isVisible = false;
      }
    },

    checkEvent(e) {
      if (e instanceof window.MouseEvent || e instanceof MouseEvent) {
        return e.clientY;
      } else {
        return e.changedTouches[0].clientY;
      }
    },

    changeStep(gap) {
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

    closeBottomSheet(status) {
      if (!this.outsideClose && !status) return;else {
        this.$emit('input', false);
      }
    },

    backgroundScrollOn() {
      document.body.style.overflow = '';
      document.body.style.height = '';
    },

    backgroundScrollOff() {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    }

  },

  unmounted() {
    this.backgroundScrollOn();
  },

  watch: {
    value: {
      immediate: true,

      handler(now) {
        if (now) {
          this.steps = 1;
          this.isVisible = true;
          if (!this.outsideScroll) this.backgroundScrollOff();
        } else this.backgroundScrollOn();
      }

    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
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
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
const __vue_script__ = script;
/* template */

var __vue_render__ = function () {
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
      "click": function ($event) {
        if ($event.target !== $event.currentTarget) {
          return null;
        }

        return _vm.closeBottomSheet(false);
      },
      "animationend": _vm.animationEndEvent
    }
  }, [_c('div', {
    staticClass: "s--bottom-sheet-sheet",
    attrs: {
      "id": "s--bottom-sheet-sheet"
    }
  }, [_vm.draggable ? _c('header', {
    staticClass: "s--bottom-sheet-header",
    on: {
      "mousedown": _vm.startDragEvent,
      "touchstart": _vm.startDragEvent
    }
  }, [_vm._m(0)]) : _vm._e(), _vm._v(" "), _c('section', {
    staticClass: "s--bottom-sheet-content"
  }, [_vm._t("default")], 2)])]) : _vm._e();
};

var __vue_staticRenderFns__ = [function () {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    staticClass: "draggable"
  }, [_c('span', [_vm._v("drag")])]);
}];
/* style */

const __vue_inject_styles__ = function (inject) {
  if (!inject) return;
  inject("data-v-6ba15c83_0", {
    source: ".s--bottom-sheet-container[data-v-6ba15c83]{width:100%;height:100%;left:0;top:0;z-index:9999}.s--bottom-sheet-container[data-v-6ba15c83]:last-of-type{background:var(--overlay-color)}.s--bottom-sheet-container.sheet-close[data-v-6ba15c83]:last-of-type{-webkit-animation:background-out-data-v-6ba15c83 .35s forwards;animation:background-out-data-v-6ba15c83 .35s forwards}.s--bottom-sheet-container.sheet-close .s--bottom-sheet-sheet[data-v-6ba15c83]{-webkit-animation:slide-out-data-v-6ba15c83 .35s forwards;animation:slide-out-data-v-6ba15c83 .35s forwards}.s--bottom-sheet-container .s--bottom-sheet-sheet[data-v-6ba15c83]{height:var(--height);max-height:var(--max-height);min-height:var(--min-height);width:var(--width);max-width:var(--max-width);min-width:var(--min-width);bottom:0;left:0;right:0;background:var(--sheet-color);border-top-left-radius:var(--border-radius);border-top-right-radius:var(--border-radius);padding:10px;position:fixed;box-shadow:0 6px 30px -6px rgba(0,0,0,.15);transform:var(--translate-Y);margin:0 auto;-webkit-animation:slide-in-data-v-6ba15c83 .4s ease;animation:slide-in-data-v-6ba15c83 .35s ease;transition:var(--transition) .35s ease}.s--bottom-sheet-container .s--bottom-sheet-sheet[data-v-6ba15c83]::after{position:absolute;content:\"\";display:block;left:0;right:0;z-index:-1;top:99%;height:101vh;background-color:var(--sheet-color);width:100%}.s--bottom-sheet-container .s--bottom-sheet-sheet .s--bottom-sheet-header[data-v-6ba15c83]{min-height:15px;position:absolute;top:15px;left:50%;transform:translate(-50%,-50%);width:100%;height:30px}.s--bottom-sheet-container .s--bottom-sheet-sheet .s--bottom-sheet-header .draggable[data-v-6ba15c83]{content:\"\";display:inline-block;width:50px;height:4px;background:var(--slide-icon-color);border-radius:10px;position:absolute;transform:translate(-50%,-50%);left:50%;top:50%}.s--bottom-sheet-container .s--bottom-sheet-sheet .s--bottom-sheet-header .draggable span[data-v-6ba15c83]{position:absolute;clip:rect(0 0 0 0);width:1px;height:1px;margin:-1px;overflow:hidden}.s--bottom-sheet-container .s--bottom-sheet-sheet .s--bottom-sheet-content[data-v-6ba15c83]{width:100%;height:100%;overflow:scroll;touch-action:auto!important;margin-top:20px}@-webkit-keyframes slide-in-data-v-6ba15c83{0%{-webkit-transform:translateY(100%);transform:translateY(100%);opacity:.3}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@keyframes slide-in-data-v-6ba15c83{0%{-webkit-transform:translateY(100%);transform:translateY(100%);opacity:.3}100%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}}@-webkit-keyframes slide-out-data-v-6ba15c83{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}100%{-webkit-transform:translateY(100%);transform:translateY(100%);opacity:.3}}@keyframes slide-out-data-v-6ba15c83{0%{-webkit-transform:translateY(0);transform:translateY(0);opacity:1}100%{-webkit-transform:translateY(100%);transform:translateY(100%);opacity:.3}}@-webkit-keyframes background-out-data-v-6ba15c83{0%{opacity:1}100%{opacity:.3}}@keyframes background-out-data-v-6ba15c83{0%{opacity:1}100%{opacity:.3}}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


const __vue_scope_id__ = "data-v-6ba15c83";
/* module identifier */

const __vue_module_identifier__ = undefined;
/* functional template */

const __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

const __vue_component__ = /*#__PURE__*/normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

var component = __vue_component__;

// Import vue component
// IIFE injects install function into component, allowing component
// to be registered via Vue.use() as well as Vue.component(),

var entry_esm = /*#__PURE__*/(() => {
  // Get component instance
  const installable = component; // Attach install function executed by Vue.use()

  installable.install = Vue => {
    Vue.component('SbottomSheet', installable);
  };

  return installable;
})(); // It's possible to expose named exports when writing components that can
// also be used as directives, etc. - eg. import { RollupDemoDirective } from 'rollup-demo';
// export const RollupDemoDirective = directive;

export { entry_esm as default };
