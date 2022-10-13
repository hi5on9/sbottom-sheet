<script>
import Vue from 'vue';
import SbottomSheet from '@/sbottom-sheet.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    SbottomSheet
  },
  data() {
    return {
      isVisible: false
    }
  },
  methods: {
    clickButton(status) {
      this.isVisible = status;
    },
    clickTest() {
      console.log("click")
    }
  }
});
</script>

<template>
  <div id="app">
    <button @click="clickButton(true)">open</button>
    <button @click="clickTest">clickTest</button>
    <div style="height:700px"></div>
    <sbottom-sheet v-model="isVisible" :draggable="true" :height="'300px'" :overlay="true" :outside-close="false" :outside-scroll="true" :outside-click="true" :three-step="true" >
      <button @click="clickButton(false)">close</button>
    </sbottom-sheet>
  </div>
</template>


<style scoped>
  .test {
    height:1000px;
    overflow: scroll;
  }
  .end{
    height:800px;
  }
</style>