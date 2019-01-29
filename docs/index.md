---
title: Vue Draggable Number Documentation
---

# Vue Draggable Number

A simple number input component that users can edit by dragging the label around, inspired by Photoshop UX.

Written in Typescript.

## Basic usage

```html
<template>
  <div>
   <draggable-number-input v-model="someNumber" label="My number" />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        someNumber: 1,
      };
    },
  };
</script>
```

<div id="unstyled-demo">
  <draggable-number-input v-model="someNumber" label="My number" />
</div>

This will create an unstyled HTML5 `<input type="number">` tied to `someNumber`, the value of which the user can easily increase or decrease by dragging (respectively) up and down on the label.

The only two required properties are `label` and `value` (in the example case, handled through the `v-model` syntactic sugar).

## Allowed props

| Property | Description | Type | Default | Options |
|---------------|----------------------------------------------------------------------------------------------------------------------|---------|-----------|--------------|
| dragDirection | The axis in which the user has to drag to increase/decrease the number. | String | "Y" | "X" \| "Y" |
| hideLabel | Whether or not to hide the label. | Boolean | false | true | false |
| label | The label to show next to the input. It is also used to generate the name of the input and the class of the wrapper. | String | - | - |
| max | Maximum allowed value. | Number | Infinity | - |
| min | Minimum allowed value. | Number | -Infinity | - |
| step | The amount by which the value is increased on mouse movement. | Number | 1 | - |
| value | The value of the input. | Number | - | - |

The generated HTML looks like this:

```html
<div class="vue-draggable-number-container ${generatedInputName}">
  <label for="${generatedInputName}"> {{ label }} </label>
  <input type="number" name="${generatedInputName}" />
</div>
```

Where `${generatedInputName}` is `draggable-number-` plus the _kebab-cased_ label.

These are useful to target the component for styling.

## Advanced demo: keeping the aspect ratio

As mentioned, the inspiration from this component came from Adobe Photoshop's UX. Hence, a usecase for it could be sizing inputs. We can imagine we have an element we want to resize, while keeping the aspect-ratio of the element constant.

We would have something like this:

<div id="advanced-demo-container">
  <div class="controls">
   <draggable-number-input label="Width:" v-on:input="adjustHeight" v-model="width" drag-direction="X"></draggable-number-input>
    
   <input 
      type="checkbox" 
      name="lock-aspect-ratio" 
      id="lock-aspect-ratio"
      v-model="aspectRatio.isLocked"
      v-on:change="lockAspectRatio">
   <label for="lock-aspect-ratio">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 120" x="0px" y="0px" fill="#fff">
        <path d="M11.89,67.67A16,16,0,0,0,39.2,79h0l17-17h0a16.08,16.08,0,0,0,1.47-20.93,4,4,0,1,0-6.39,4.82,8,8,0,0,1-.74,10.45h0l-17,17h0A8,8,0,1,1,22.23,62l7.49-7.48a4,4,0,0,0-5.66-5.66l-7.48,7.49A15.86,15.86,0,0,0,11.89,67.67Z" />
        <path d="M66.28,40.59a4,4,0,0,0,2.83,6.83,4,4,0,0,0,2.83-1.18l7.48-7.48h0A16,16,0,0,0,56.8,16.13h0l-17,17A16.07,16.07,0,0,0,38.35,54a4,4,0,0,0,3.2,1.59,3.93,3.93,0,0,0,2.4-.81,4,4,0,0,0,.79-5.6,8,8,0,0,1,.74-10.46l17-17h0A8,8,0,0,1,73.77,33.1h0Z" />
      </svg>
   </label>

   <draggable-number-input label="Height:" v-on:input="adjustWidth" v-model="height" drag-direction="Y"></draggable-number-input>
  </div>
  <div class="canvas">
    <div :style="{ width: `${width}px`, height: `${height}px` }" id="the-box"></div>
  </div>
</div>

```html
    <template>
      <div id="advanced-demo">
        <draggable-number-input label="Width:" @input="adjustHeight" v-model="width" drag-direction="X" />
        <input v-model="aspectRatio.isLocked" @change="lockAspectRatio">
        <label for="lock-aspect-ratio">
          <!-- SVG Icon -->
        </label>
        <draggable-number-input label="Height:" @input="adjustWidth" v-model="height" drag-direction="Y" />
      </div>
    </template>

    <script lang="ts">
      export default class LockedRatioDemo extends Vue {
        public width = 10;
        public height = 20;
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
```
