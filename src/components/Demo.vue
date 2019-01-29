<template>
  <div>
    <h1>Draggable Number Component</h1>
    <draggable-number-input :min="0" :max="200" v-model="someNumber" label="My Number" drag-direction="X" :hide-label="false"/>

    <h2>Advanced demo</h2>
    <div id="advanced-demo">
      <div class="controls">
        <draggable-number-input label="Width:" @input="adjustHeight" v-model="width" drag-direction="X" />
          <input 
            type="checkbox" 
            name="lock-aspect-ratio" 
            id="lock-aspect-ratio" 
            v-model="aspectRatio.isLocked"
            @change="lockAspectRatio">
          <label for="lock-aspect-ratio">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 120" x="0px" y="0px" fill="#fff">
              <path d="M11.89,67.67A16,16,0,0,0,39.2,79h0l17-17h0a16.08,16.08,0,0,0,1.47-20.93,4,4,0,1,0-6.39,4.82,8,8,0,0,1-.74,10.45h0l-17,17h0A8,8,0,1,1,22.23,62l7.49-7.48a4,4,0,0,0-5.66-5.66l-7.48,7.49A15.86,15.86,0,0,0,11.89,67.67Z"/>
              <path d="M66.28,40.59a4,4,0,0,0,2.83,6.83,4,4,0,0,0,2.83-1.18l7.48-7.48h0A16,16,0,0,0,56.8,16.13h0l-17,17A16.07,16.07,0,0,0,38.35,54a4,4,0,0,0,3.2,1.59,3.93,3.93,0,0,0,2.4-.81,4,4,0,0,0,.79-5.6,8,8,0,0,1,.74-10.46l17-17h0A8,8,0,0,1,73.77,33.1h0Z"/>
            </svg>
          </label>
          <draggable-number-input label="Height:" @input="adjustWidth" v-model="height" drag-direction="Y" />
      </div>
      <div class="canvas">
        <div :style="{ width: `${width}px`, height: `${height}px` }" id="the-box"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import DraggableNumberInput from "./DraggableNumberInput.vue";

@Component({
  components: {
    DraggableNumberInput,
  },
})
export default class HelloWorld extends Vue {
  public someNumber = 12;
  public width = 100;
  public height = 50;
  public aspectRatio = {
    isLocked: true,
    ratio: this.height / this.width
  }

  private adjustHeight(val: number) {
    if(!this.aspectRatio.isLocked)
      return;
    
    this.height = Math.round(val * this.aspectRatio.ratio);
  }

  private adjustWidth(val: number) {
    if(!this.aspectRatio.isLocked)
      return;
    
    this.width = Math.round( val * (1 / this.aspectRatio.ratio) );
  }

  private lockAspectRatio() {
    this.aspectRatio.ratio = this.height / this.width;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.controls {
  background-color: #535353;
  color: #fff;
  padding: 10px;
  position: relative;
}

#lock-aspect-ratio {
  display: none;
}

#the-box {
  background-color: #42b983;
  box-shadow: 0 0 10px #222;
  display: inline-block;
  vertical-align: middle;
  top: 5px;
  left: 5px;
}

#lock-aspect-ratio + label {
  border-radius: 3px;
  cursor: pointer;
  padding: 2px;
}

#lock-aspect-ratio + label:hover {
  background-color: #636363;
}

#lock-aspect-ratio:checked + label {
  background-color: #303030;
  border-bottom: 1px solid #666;
  box-shadow: inset 0 0 10px #2b2b2b;
}

.controls label svg {
  margin-top: 3px;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.controls .vue-draggable-number-container {
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
  margin: 10px;
  text-transform: uppercase;
}

.controls .vue-draggable-number-container input {
  background-color: #3a3a3a;
  border:           none;
  border-bottom:    1px solid #666;
  box-shadow:       inset 0 0 2px #303030;
  color:            #fff;
  padding:          3px 6px;
  width:            35px;
}

.canvas {
  background-color: #3a3a3a;
  overflow:         hidden;
  padding:          10px;
  height:           240px;
}

.canvas::before {
  content:        "";
  display:        inline-block;
  vertical-align: middle;
  height:         100%;
}
</style>
