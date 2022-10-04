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
    threshold: { // percentage
      default: 0.5,
      type: Number,
    },
    outsideClose: { // 시트 바깥 눌러서 닫기
      default: true,
      type: Boolean,
    },
    outsideClick: { // 시트 바깥 클릭 되도록
      default: false,
      type: Boolean,
    },
    outsideScroll: { // 시트 바깥 스크롤 되도록
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
    leaveHeader: {
      default: false,
      type: Boolean,
    },
    threeStep: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
        sheetY: this.height,
        startY: 0,
        transformY: 0,
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
        position: this.checkPosition ? '' : 'fixed',
      }
      return style
    },
    getAutoHeight() {
      const style = {
        transform: `translateY(${this.transformY}px)`,
        transition: 'transfrom .35s'
      }
      return style;
    }
  },
  methods: {
    startDragEvent(e) {
      if(this.outsideScroll) document.body.style.overflow = 'hidden';

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
      const sheet = document.getElementById("s--bottom-sheet-sheet")
      const EndY = this.checkEvent(e)

      if(this.outsideScroll) document.body.style.overflow = '';

      if(sheet.clientHeight - this.transformY <=  sheet.clientHeight * this.threshold) {
        this.closeBottomSheet(true);
      }
      if(this.threeStep) {
        this.steps = EndY - this.startY > 50 ? this.steps - 1 : this.steps + 1;
        this.changeStep();
      }

      this.transformY = 0
      this.startY = 0

      window.removeEventListener('mousemove', this.onDragEvent);
      window.removeEventListener('touchmove', this.onDragEvent);
      window.removeEventListener('mouseup', this.endDragEvent);
      window.removeEventListener('touchend', this.endDragEvent);
    },
    closeBottomSheet(status) {
      if(!this.outsideClose && !status) return;
      else {
        this.$emit('input', false)
      }
    },
    checkEvent(e) {
      if (e instanceof window.MouseEvent || e instanceof MouseEvent){ return  e.clientY }
      else { return e.changedTouches[0].clientY }
    },
    changeStep() {
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
    }
  },
  unmounted() {
    document.body.style.overflow = '';
    document.body.style.height = '';
  },
  watch:{
    value: {
      immediate: true,
      handler(now) {
        if(now) {
          this.steps = 1;
          if(!this.outsideScroll) { document.body.style.overflow = 'hidden'; document.body.style.height = '100vh'; }
        } else {
          document.body.style.overflow = '';
          document.body.style.height = '';
          this.steps = 0;
          this.sheetY = this.height;
        }
      }
    }
  }
};
</script>

<template>
  <div class="s--bottom-sheet-container" v-if="value" @click.self="closeBottomSheet(false)" :style="getStyle">
    <div class="s--bottom-sheet-sheet" :style="getAutoHeight" id="s--bottom-sheet-sheet">
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
        <div class="test-content"></div>
      </section>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "./style.scss";

</style>
