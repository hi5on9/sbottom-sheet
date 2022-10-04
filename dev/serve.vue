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
    <div class="test">this is text
      {{isVisible}}
      <button @click="clickButton(true)">open</button>
      <button @click="clickTest">clickTest</button>
      <div class="end">this is end</div>
    </div>
    <sbottom-sheet v-model="isVisible" :draggable="true" :height="'300px'" :overlay="true" :outside-close="false" :outside-scroll="true" :outside-click="true" :leave-header="false" :three-step="true" >
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