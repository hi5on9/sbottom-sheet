## sbottom-sheet 
Use bottom sheet with steps! 🏃‍♀️🏃‍♂️

<p align="center">
<img src="https://user-images.githubusercontent.com/55988602/195505015-0f05a57d-f651-4cfc-b902-2e203b2ac74c.gif">
</p>

## Install
```shell
> npm install --save-dev sbottom-sheet
   ```

## Usage
### plugin   
```javascript
import SBottomSheet from 'sbottom-sheet'
Vue.use(SbottomSheet)
```

### componenet 

```javascript
<template>
	<div>
		<button @click="showBottomSheet">show</button>		
		<sbottom-sheet  v-model="isVisible" :threshold="30">
			<p>this is contents</p>
		</sbottom-sheet>
	</div>
</template>

<script>
// ...
	methods: {
		showBottomSheet() {
			this.isVisible = true
		}
	}
</script>
```

## Props

write later..
