# Color.JS
Color.js - small javascript library for manipulating with a color. 
ColorJS is a javascript class designed to work with color. 
The class implements methods for conveniently working with color, 
converting it to various formats and generating special color schemes. 
Color.js provides simple API that may be used to create colors (HEX, RGB, RGBA, HSV, HSL, HSLA, CMYK), 
and perform various color related operations (conversions and such) and create 
any color schemes (complementary, triple, ...)

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

## License
This software is free to use under the MIT license. See the [LICENSE](LICENSE) file for license text and copyright information.