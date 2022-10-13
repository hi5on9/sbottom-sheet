<script>
export default {
  name: 'SbottomSheet',
  props: {
    value: {
      default : false,
      type: Boolean,
    },
    height: {
      default: "auto",
      type: String,
    },
    minHeight: {
      default: "10px",
      type: String,
    },
    maxHeight: {
      default: "calc(100% - 30px)",
      type: String
    },
    width: {
      default: "auto",
      type: String,
    },
    minWidth: {
      default: "200px",
      type: String,
    },
    maxWidth: {
      default: "100%",
      type: String,
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
      type: String,
    },
    radius: {
      default: "20px",
      type: String,
    },
    threshold: {
      default: 150,
      type: Number,
    },
    outsideClose: {
      default: true,
      type: Boolean,
    },
    outsideClick: {
      default: false,
      type: Boolean,
    },
    outsideScroll: {
      default: false,
      type: Boolean
    },
    overlay: { // 시트 밖 음영 처리
      default: true,
      type: Boolean
    },
    draggable: {
      default: true,
      type: Boolean,
    },
    threeStep: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
        isVisible: this.value,
        sheetY: this.height,
        startY: 0,
        transformY: 0,
        transition: 'none',
        steps: 1,
        checkPosition: this.outsideClick && !this.outsideClose  && !this.overlay
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
        '--sheet-color' : this.sheetColor,
        '--overlay-color': !this.overlay ? '' : this.overlayColor,
        '--slide-icon-color': this.slideIconColor,
        '--border-radius': this.radius,
        '--translate-Y': `translateY(${this.transformY}px)`,
        '--transition': this.transition,
        position: this.checkPosition ? '' : 'fixed',
      }
      return style
    },
  },
  methods: {
    startDragEvent(e) {
      this.transition = 'none'
      if(this.outsideScroll) this.backgroundScrollOff();

      if (e instanceof window.MouseEvent || e instanceof MouseEvent) {
        this.startY = e.clientY;
        window.addEventListener('mousemove', this.onDragEvent)
        window.addEventListener('mouseup', this.endDragEvent)
      }
      else {
        this.startY = e.touches[0].clientY
        window.addEventListener('touchmove', this.onDragEvent)
        window.addEventListener('touchend', this.endDragEvent)
      }
    },
    onDragEvent(e){
      this.transformY = this.checkEvent(e) - this.startY
    },
    endDragEvent(e){
      const EndY = this.checkEvent(e)
      this.transition = 'all'

      if(this.outsideScroll) this.backgroundScrollOn();

      if(this.threeStep) {
        this.changeStep(EndY - this.startY);
      }

      if(EndY - this.startY >=  this.threshold) {
        this.closeBottomSheet(true);
      } else {
        this.transformY = 0
        this.startY = 0
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
        this.startY = 0
        this.transformY = 0
        this.sheetY = this.height;
        this.isVisible = false
      }
    },
    checkEvent(e) {
      if (e instanceof window.MouseEvent || e instanceof MouseEvent){ return  e.clientY }
      else { return e.changedTouches[0].clientY }
    },
    changeStep(gap) {
      if (gap <= -1 * this.threshold / 2 ) {
        this.steps = this.steps + 1 > 2 ? 2 : this.steps + 1
      } else if (gap >= this.threshold / 2) {
        this.steps = this.steps - 1 < 0 ? 0 : this.steps - 1
      } else return
      switch (this.steps) {
        case 0:
          this.closeBottomSheet(true);
          break;
        case 1:
          this.sheetY = this.height;
          break;
        case 2:
          this.sheetY = this.maxHeight
          break;
      }
    },
    closeBottomSheet(status) {
      if(!this.outsideClose && !status) return;
      else {
        this.$emit('input', false)
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
  watch:{
    value: {
      immediate: true,
      handler(now) {
        if(now) {
          this.steps = 1;
          this.isVisible = true;
          if(!this.outsideScroll) this.backgroundScrollOff();
        } else this.backgroundScrollOn();
      }
    }
  }
};
</script>

<template>
  <div class="s--bottom-sheet-container" v-if="isVisible" @click.self="closeBottomSheet(false)" @animationend="animationEndEvent" :style="getStyle" :class="{ 'sheet-close':!value }">
    <div class="s--bottom-sheet-sheet" id="s--bottom-sheet-sheet" >
      <!--  -->
      <header class="s--bottom-sheet-header"
          v-if="draggable"
          @mousedown="startDragEvent"
          @touchstart="startDragEvent">
        <div class="draggable">
          <span>drag</span>
        </div>
      </header>
      <!-- -->
      <section class="s--bottom-sheet-content">
        <slot />
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./style.scss";

</style>
