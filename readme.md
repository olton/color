# Color.JS
Color.js - small javascript library for manipulating with a color.

## Install
```shell
npm i @olton/color
```

## Using
```javascript
import Color from "@olton/color"

const col = new Color("#fff")

console.log(color.toRGB()); // RGB {r: 255, g: 255, b: 255}
console.log(color.toRGB().toString()); // rgb(255,255,255)
```