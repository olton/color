(function () {
    'use strict';

    class HSV {
        constructor(h = 0, s = 0, v = 0) {
            this.h = h;
            this.s = s;
            this.v = v;
        }

        toString(){
            return `hsv(${this.h},${this.s},${this.v})`;
        }
    }

    class HSL {
        constructor(h = 0, s = 0, l = 0) {
            this.h = h;
            this.s = s;
            this.l = l;
        }

        toString(){
            return `hsl(${this.h},${this.s},${this.l})`;
        }
    }

    class HSLA {
        constructor(h = 0, s = 0, l = 0, a = 0) {
            this.h = h;
            this.s = s;
            this.l = l;
            this.a = a;
        }

        toString(){
            return `hsla(${this.h},${this.s},${this.l},${this.a})`;
        }
    }

    class RGB {
        constructor(r = 0, g = 0, b = 0) {
            this.r = r;
            this.g = g;
            this.b = b;
        }

        toString(){
            return `rgb(${this.r},${this.g},${this.b})`;
        }
    }

    class RGBA {
        constructor(r = 0, g = 0, b = 0, a = 0) {
            this.r = r;
            this.g = g;
            this.b = b;
            this.a = a;
        }

        toString(){
            return `rgba(${this.r},${this.g},${this.b},${this.a})`;
        }
    }

    class CMYK {
        constructor(c = 0, m = 0, y = 0, k = 0) {
            this.c = c;
            this.m = m;
            this.y = y;
            this.k = k;
        }

        toString(){
            return `cmyk(${this.c},${this.m},${this.y},${this.k})`;
        }
    }

    const colorTypes = {
        HEX: "hex",
        RGB: "rgb",
        RGBA: "rgba",
        HSV: "hsv",
        HSL: "hsl",
        HSLA: "hsla",
        CMYK: "cmyk",
        UNKNOWN: "unknown",
    };

    const colorDefaultProps = {
        angle: 30,
        algorithm: 1,
        step: 0.1,
        distance: 5,
        tint1: 0.8,
        tint2: 0.4,
        shade1: 0.6,
        shade2: 0.3,
        alpha: 1,
    };

    /**
     * Create color in specified format
     * @param {string} colorType
     * @param {*} from
     * @returns {RGB|RGBA|HSV|HSL|HSLA|CMYK|undefined}
     */
    const createColor = (colorType = "hex", from = "#000000") => {
        let baseColor;

        if (typeof from === "string") {
            baseColor = parseColor(from);
        }

        if (!isColor(baseColor)) {
            baseColor = "#000000";
        }

        return toColor(baseColor, colorType.toLowerCase());
    };

    /**
     * Expand shorthand form (e.g. "#03F") to full form (e.g. "#0033FF")
     * @param hex
     * @returns {string}
     */
    const expandHexColor = function (hex) {
        if (isColor(hex) && typeof hex !== "string") {
            return hex;
        }
        if (typeof hex !== "string") {
            throw new Error("Value is not a string!");
        }
        if (hex[0] === "#" && hex.length === 4) {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            return (
                "#" +
                hex.replace(shorthandRegex, (m, r, g, b) => {
                    return r + r + g + g + b + b;
                })
            );
        }
        return hex[0] === "#" ? hex : "#" + hex;
    };

    /**
     * Check if specified color is dark
     * @param {*} color
     * @returns {boolean|undefined}
     */
    const isDark = color => {
        if (!isColor(color)) return;
        const rgb = toRGB(color);
        const YIQ = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
        return YIQ < 128;
    };

    /**
     * Check if specified color is light
     * @param {*} color
     * @returns {boolean|undefined}
     */
    const isLight = color => {
        return !isDark(color);
    };

    /**
     * Check if specified color is HSV color
     * @param {*} color
     * @returns {boolean|undefined}
     */
    const isHSV = color => {
        return color instanceof HSV;
    };

    /**
     * Check if specified color is HSL color
     * @param {*} color
     * @returns {boolean|undefined}
     */
    const isHSL = color => {
        return color instanceof HSL;
    };

    /**
     * Check if specified color is HSLA color
     * @param {*} color
     * @returns {boolean|undefined}
     */
    const isHSLA = color => {
        return color instanceof HSLA;
    };

    /**
     * Check if specified color is RGB color
     * @param {*} color
     * @returns {boolean|undefined}
     */
    const isRGB = color => {
        return color instanceof RGB;
    };

    /**
     * Check if specified color is RGBA color
     * @param {*} color
     * @returns {boolean|undefined}
     */
    const isRGBA = color => {
        return color instanceof RGBA;
    };

    /**
     * Check if specified color is CMYK color
     * @param {*} color
     * @returns {boolean|undefined}
     */
    const isCMYK = color => {
        return color instanceof CMYK;
    };

    /**
     * Check if specified color is HEX color
     * @param {*} color
     * @returns {boolean|undefined}
     */
    const isHEX = color => {
        return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
    };

    /**
     * Check if value is a supported color
     * @param {*} color
     * @returns {boolean|undefined}
     */
    const isColor = color => {
        return !color
            ? false
            : isHEX(color) ||
            isRGB(color) ||
            isRGBA(color) ||
            isHSV(color) ||
            isHSL(color) ||
            isHSLA(color) ||
            isCMYK(color);
    };

    /**
     * Return type of color
     * @param {*} color
     * @returns {string}
     */
    const colorType = color => {
        if (isHEX(color)) return colorTypes.HEX;
        if (isRGB(color)) return colorTypes.RGB;
        if (isRGBA(color)) return colorTypes.RGBA;
        if (isHSV(color)) return colorTypes.HSV;
        if (isHSL(color)) return colorTypes.HSL;
        if (isHSLA(color)) return colorTypes.HSLA;
        if (isCMYK(color)) return colorTypes.CMYK;

        return colorTypes.UNKNOWN;
    };

    /**
     * Check if color1 is equal to comparison color2
     * @param {*} color1
     * @param {*} color2
     * @returns {boolean}
     */
    const equal = (color1, color2) => {
        if (!isColor(color1) || !isColor(color2)) {
            return false;
        }

        return toHEX(color1) === toHEX(color2);
    };

    /**
     * Get stringify color value
     * @param {*} color
     * @returns {string} This function return string presentation of color. Example: for RGB will return rgb(x, y, z)
     */
    const colorToString = color => {
        return color.toString();
    };

    /**
     * @param {string} hex
     * @returns {RGB} Value returned as RGB object
     */
    const hex2rgb = hex => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
            expandHexColor(hex)
        );
        const rgb = [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
        ];
        return result ? new RGB(...rgb) : null;
    };

    /**
     *
     * @param {RGB} rgb
     * @returns {string}
     */
    const rgb2hex = rgb => {
        return (
            "#" +
            ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)
        );
    };

    /**
     *
     * @param {RGB} rgb
     * @returns {HSV}
     */
    const rgb2hsv = rgb => {
        const hsv = new HSV();
        let h, s, v;
        const r = rgb.r / 255,
            g = rgb.g / 255,
            b = rgb.b / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;

        v = max;

        if (max === 0) {
            s = 0;
        } else {
            s = 1 - min / max;
        }

        if (max === min) {
            h = 0;
        } else if (max === r && g >= b) {
            h = 60 * ((g - b) / delta);
        } else if (max === r && g < b) {
            h = 60 * ((g - b) / delta) + 360;
        } else if (max === g) {
            h = 60 * ((b - r) / delta) + 120;
        } else if (max === b) {
            h = 60 * ((r - g) / delta) + 240;
        } else {
            h = 0;
        }

        hsv.h = h;
        hsv.s = s;
        hsv.v = v;

        return hsv;
    };

    /**
     *
     * @param {HSV} hsv
     * @returns {RGB}
     */
    const hsv2rgb = hsv => {
        let r, g, b;
        const h = hsv.h,
            s = hsv.s * 100,
            v = hsv.v * 100;
        const Hi = Math.floor(h / 60);
        const Vmin = ((100 - s) * v) / 100;
        const alpha = (v - Vmin) * ((h % 60) / 60);
        const Vinc = Vmin + alpha;
        const Vdec = v - alpha;

        switch (Hi) {
            case 0:
                r = v;
                g = Vinc;
                b = Vmin;
                break;
            case 1:
                r = Vdec;
                g = v;
                b = Vmin;
                break;
            case 2:
                r = Vmin;
                g = v;
                b = Vinc;
                break;
            case 3:
                r = Vmin;
                g = Vdec;
                b = v;
                break;
            case 4:
                r = Vinc;
                g = Vmin;
                b = v;
                break;
            case 5:
                r = v;
                g = Vmin;
                b = Vdec;
                break;
        }

        return new RGB(
            Math.round((r * 255) / 100),
            Math.round((g * 255) / 100),
            Math.round((b * 255) / 100)
        );
    };

    /**
     *
     * @param {HSV} hsv
     * @returns {string}
     */
    const hsv2hex = hsv => {
        return rgb2hex(hsv2rgb(hsv));
    };

    /**
     *
     * @param {string} hex
     * @returns {HSV}
     */
    const hex2hsv = hex => {
        return rgb2hsv(hex2rgb(hex));
    };

    /**
     *
     * @param {RGB} rgb
     * @returns {CMYK}
     */
    const rgb2cmyk = rgb => {
        const cmyk = new CMYK();

        const r = rgb.r / 255;
        const g = rgb.g / 255;
        const b = rgb.b / 255;

        cmyk.k = Math.min(1 - r, 1 - g, 1 - b);

        cmyk.c = 1 - cmyk.k === 0 ? 0 : (1 - r - cmyk.k) / (1 - cmyk.k);
        cmyk.m = 1 - cmyk.k === 0 ? 0 : (1 - g - cmyk.k) / (1 - cmyk.k);
        cmyk.y = 1 - cmyk.k === 0 ? 0 : (1 - b - cmyk.k) / (1 - cmyk.k);

        cmyk.c = Math.round(cmyk.c * 100);
        cmyk.m = Math.round(cmyk.m * 100);
        cmyk.y = Math.round(cmyk.y * 100);
        cmyk.k = Math.round(cmyk.k * 100);

        return cmyk;
    };

    /**
     *
     * @param {CMYK} cmyk
     * @returns {RGB}
     */
    const cmyk2rgb = cmyk => {
        const r = Math.floor(255 * (1 - cmyk.c / 100) * (1 - cmyk.k / 100));
        const g = Math.ceil(255 * (1 - cmyk.m / 100) * (1 - cmyk.k / 100));
        const b = Math.ceil(255 * (1 - cmyk.y / 100) * (1 - cmyk.k / 100));

        return new RGB(r, g, b);
    };

    /**
     *
     * @param {HSV} hsv
     * @returns {HSL}
     */
    const hsv2hsl = hsv => {
        let h, s, l, d;
        h = hsv.h;
        l = (2 - hsv.s) * hsv.v;
        s = hsv.s * hsv.v;
        if (l === 0) {
            s = 0;
        } else {
            d = l <= 1 ? l : 2 - l;
            if (d === 0) {
                s = 0;
            } else {
                s /= d;
            }
        }
        l /= 2;
        return new HSL(h, s, l);
    };

    /**
     *
     * @param {HSL} hsl
     * @returns {HSV}
     */
    const hsl2hsv = hsl => {
        let h, s, v, l;
        h = hsl.h;
        l = hsl.l * 2;
        s = hsl.s * (l <= 1 ? l : 2 - l);

        v = (l + s) / 2;

        if (l + s === 0) {
            s = 0;
        } else {
            s = (2 * s) / (l + s);
        }

        return new HSV(h, s, v);
    };

    /**
     *
     * @param {RGB|RGBA} rgb
     * @returns {RGB}
     */
    const rgb2websafe = rgb => {
        return new RGB(
            Math.round(rgb.r / 51) * 51,
            Math.round(rgb.g / 51) * 51,
            Math.round(rgb.b / 51) * 51
        );
    };

    /**
     *
     * @param {RGBA} rgba
     * @returns {RGBA}
     */
    const rgba2websafe = rgba => {
        const rgbWebSafe = rgb2websafe(rgba);
        return new RGBA(rgbWebSafe.r, rgbWebSafe.g, rgbWebSafe.b, rgba.a);
    };

    /**
     *
     * @param {string} hex
     * @returns {string}
     */
    const hex2websafe = hex => {
        return rgb2hex(rgb2websafe(hex2rgb(hex)));
    };

    /**
     *
     * @param hsv
     * @returns {HSV}
     */
    const hsv2websafe = hsv => {
        return rgb2hsv(rgb2websafe(toRGB(hsv)));
    };

    const hsl2websafe = hsl => {
        return hsv2hsl(rgb2hsv(rgb2websafe(toRGB(hsl))));
    };

    const cmyk2websafe = cmyk => {
        return rgb2cmyk(rgb2websafe(cmyk2rgb(cmyk)));
    };

    const websafe = color => {
        if (isHEX(color)) return hex2websafe(color);
        if (isRGB(color)) return rgb2websafe(color);
        if (isRGBA(color)) return rgba2websafe(color);
        if (isHSV(color)) return hsv2websafe(color);
        if (isHSL(color)) return hsl2websafe(color);
        if (isCMYK(color)) return cmyk2websafe(color);

        return color;
    };

    /**
     * Convert color to specified
     * @param color
     * @param mode
     * @param alpha
     * @returns {*}
     */
    const toColor = (color, mode = "rgb", alpha = 1) => {
        let result;
        switch (mode.toLowerCase()) {
            case "hex":
                result = toHEX(color);
                break;
            case "rgb":
                result = toRGB(color);
                break;
            case "rgba":
                result = toRGBA(color, alpha);
                break;
            case "hsl":
                result = toHSL(color);
                break;
            case "hsla":
                result = toHSLA(color, alpha);
                break;
            case "hsv":
                result = toHSV(color);
                break;
            case "cmyk":
                result = toCMYK(color);
                break;
            default:
                result = color;
        }
        return result;
    };

    /**
     * Convert color to hex
     * @param color
     * @returns {string}
     */
    const toHEX = color => {
        return typeof color === "string"
            ? expandHexColor(color)
            : rgb2hex(toRGB(color));
    };

    /**
     * Convert color to RGB
     * @param color
     * @returns {RGB|*}
     */
    const toRGB = color => {
        if (isRGB(color)) return color;
        if (isRGBA(color)) return new RGB(color.r, color.g, color.b);
        if (isHSV(color)) return hsv2rgb(color);
        if (isHSL(color)) return hsv2rgb(hsl2hsv(color));
        if (isHSLA(color)) return hsv2rgb(hsl2hsv(color));
        if (isHEX(color)) return hex2rgb(color);
        if (isCMYK(color)) return cmyk2rgb(color);

        throw new Error("Unknown color format!");
    };

    /**
     * Convert color to RGBA
     * @param color
     * @param alpha
     * @returns {RGBA|*}
     */
    const toRGBA = (color, alpha) => {
        if (isRGBA(color)) {
            if (alpha) {
                color.a = alpha;
            }
            return color;
        }
        const rgb = toRGB(color);
        return new RGBA(rgb.r, rgb.g, rgb.b, alpha);
    };

    /**
     * Convert color to HSV
     * @param color
     * @returns {HSV}
     */
    const toHSV = color => {
        return rgb2hsv(toRGB(color));
    };

    /**
     * Convert color to HSL
     * @param color
     * @returns {HSL}
     */
    const toHSL = color => {
        return hsv2hsl(rgb2hsv(toRGB(color)));
    };

    /**
     * Convert color to HSLA
     * @param color
     * @param alpha
     * @returns {HSLA|*}
     */
    const toHSLA = (color, alpha = 1) => {
        if (isHSLA(color)) {
            if (alpha) {
                color.a = alpha;
            }
            return color;
        }
        let hsla = hsv2hsl(rgb2hsv(toRGB(color)));
        hsla.a = alpha;
        return new HSLA(hsla.h, hsla.s, hsla.l, hsla.a);
    };

    /**
     * Convert color to CMYK
     * @param color
     * @returns {CMYK}
     */
    const toCMYK = color => {
        return rgb2cmyk(toRGB(color));
    };

    /**
     * Convert color to grayscale
     * @param color
     * @returns {*}
     */
    const grayscale = color => {
        const rgb = toRGB(color);
        const type = colorType(color).toLowerCase();
        const gray = Math.round(rgb.r * 0.2125 + rgb.g * 0.7154 + rgb.b * 0.0721);
        const mono = new RGB(gray, gray, gray);

        return toColor(mono, type);
    };

    /**
     * Darken color to specified percent
     * @param color
     * @param amount
     * @returns {*}
     */
    const darken = (color, amount = 10) => {
        return lighten(color, -1 * Math.abs(amount));
    };

    /**
     * lighten color to specified percent
     * @param color
     * @param amount
     * @returns {*}
     */
    const lighten = (color, amount = 10) => {
        let type,
            res,
            ring = amount > 0;

        const calc = function (_color, _amount) {
            let r, g, b;
            const col = _color.slice(1);

            const num = parseInt(col, 16);
            r = (num >> 16) + _amount;

            if (r > 255) r = 255;
            else if (r < 0) r = 0;

            b = ((num >> 8) & 0x00ff) + _amount;

            if (b > 255) b = 255;
            else if (b < 0) b = 0;

            g = (num & 0x0000ff) + _amount;

            if (g > 255) g = 255;
            else if (g < 0) g = 0;

            return "#" + (g | (b << 8) | (r << 16)).toString(16);
        };

        type = colorType(color).toLowerCase();

        if (type === colorTypes.RGBA) {
            color.a;
        }

        do {
            res = calc(toHEX(color), amount);
            ring ? amount-- : amount++;
        } while (res.length < 7);

        return toColor(res, type);
    };

    /**
     * Rotate color on color wheel to specified angle
     * @param color
     * @param angle
     * @param alpha
     * @returns {*}
     */
    const hueShift = (color, angle, alpha = 1) => {
        const hsv = toHSV(color);
        const type = colorType(color).toLowerCase();
        let h = hsv.h;
        h += angle;
        while (h >= 360.0) h -= 360.0;
        while (h < 0.0) h += 360.0;
        hsv.h = h;

        return toColor(hsv, type, alpha);
    };

    /**
     * Create color scheme
     * @param color
     * @param name
     * @param format
     * @param options
     * @returns {boolean|*}
     */
    const createColorScheme = (color, name, format, options) => {
        const opt = Object.assign({}, colorDefaultProps, options);

        let i;
        const scheme = [];
        let hsv;
        let rgb, h, s, v;

        hsv = toHSV(color);
        h = hsv.h;
        s = hsv.s;
        v = hsv.v;

        if (isHSV(hsv) === false) {
            console.warn("The value is a not supported color format!");
            return false;
        }

        function convert(source, format) {
            let result;
            switch (format) {
                case "hex":
                    result = source.map(function (v) {
                        return toHEX(v);
                    });
                    break;
                case "rgb":
                    result = source.map(function (v) {
                        return toRGB(v);
                    });
                    break;
                case "rgba":
                    result = source.map(function (v) {
                        return toRGBA(v, opt.alpha);
                    });
                    break;
                case "hsl":
                    result = source.map(function (v) {
                        return toHSL(v);
                    });
                    break;
                case "hsla":
                    result = source.map(function (v) {
                        return toHSLA(v, opt.alpha);
                    });
                    break;
                case "cmyk":
                    result = source.map(function (v) {
                        return toCMYK(v);
                    });
                    break;
                default:
                    result = source;
            }

            return result;
        }

        function clamp(num, min, max) {
            return Math.max(min, Math.min(num, max));
        }

        function toRange(a, b, c) {
            return a < b ? b : a > c ? c : a;
        }

        function shift(h, s) {
            h += s;
            while (h >= 360.0) h -= 360.0;
            while (h < 0.0) h += 360.0;
            return h;
        }

        switch (name) {
            case "monochromatic":
            case "mono":
                if (opt.algorithm === 1) {
                    rgb = hsv2rgb(hsv);
                    rgb.r = toRange(
                        Math.round(rgb.r + (255 - rgb.r) * opt.tint1),
                        0,
                        255
                    );
                    rgb.g = toRange(
                        Math.round(rgb.g + (255 - rgb.g) * opt.tint1),
                        0,
                        255
                    );
                    rgb.b = toRange(
                        Math.round(rgb.b + (255 - rgb.b) * opt.tint1),
                        0,
                        255
                    );
                    scheme.push(rgb2hsv(rgb));

                    rgb = hsv2rgb(hsv);
                    rgb.r = toRange(
                        Math.round(rgb.r + (255 - rgb.r) * opt.tint2),
                        0,
                        255
                    );
                    rgb.g = toRange(
                        Math.round(rgb.g + (255 - rgb.g) * opt.tint2),
                        0,
                        255
                    );
                    rgb.b = toRange(
                        Math.round(rgb.b + (255 - rgb.b) * opt.tint2),
                        0,
                        255
                    );
                    scheme.push(rgb2hsv(rgb));

                    scheme.push(hsv);

                    rgb = hsv2rgb(hsv);
                    rgb.r = toRange(Math.round(rgb.r * opt.shade1), 0, 255);
                    rgb.g = toRange(Math.round(rgb.g * opt.shade1), 0, 255);
                    rgb.b = toRange(Math.round(rgb.b * opt.shade1), 0, 255);
                    scheme.push(rgb2hsv(rgb));

                    rgb = hsv2rgb(hsv);
                    rgb.r = toRange(Math.round(rgb.r * opt.shade2), 0, 255);
                    rgb.g = toRange(Math.round(rgb.g * opt.shade2), 0, 255);
                    rgb.b = toRange(Math.round(rgb.b * opt.shade2), 0, 255);
                    scheme.push(rgb2hsv(rgb));
                } else if (opt.algorithm === 2) {
                    scheme.push(hsv);
                    for (i = 1; i <= opt.distance; i++) {
                        v = clamp(v - opt.step, 0, 1);
                        s = clamp(s - opt.step, 0, 1);
                        scheme.push({ h: h, s: s, v: v });
                    }
                } else if (opt.algorithm === 3) {
                    scheme.push(hsv);
                    for (i = 1; i <= opt.distance; i++) {
                        v = clamp(v - opt.step, 0, 1);
                        scheme.push({ h: h, s: s, v: v });
                    }
                } else {
                    v = clamp(hsv.v + opt.step * 2, 0, 1);
                    scheme.push({ h: h, s: s, v: v });

                    v = clamp(hsv.v + opt.step, 0, 1);
                    scheme.push({ h: h, s: s, v: v });

                    scheme.push(hsv);
                    s = hsv.s;
                    v = hsv.v;

                    v = clamp(hsv.v - opt.step, 0, 1);
                    scheme.push({ h: h, s: s, v: v });

                    v = clamp(hsv.v - opt.step * 2, 0, 1);
                    scheme.push({ h: h, s: s, v: v });
                }
                break;

            case "complementary":
            case "complement":
            case "comp":
                scheme.push(hsv);

                h = shift(hsv.h, 180.0);
                scheme.push(new HSV(h, s, v));
                break;

            case "double-complementary":
            case "double-complement":
            case "double":
                scheme.push(hsv);

                h = shift(h, 180.0);
                scheme.push(new HSV(h, s, v));

                h = shift(h, opt.angle);
                scheme.push(new HSV(h, s, v));

                h = shift(h, 180.0);
                scheme.push(new HSV(h, s, v));

                break;

            case "analogous":
            case "analog":
                h = shift(h, opt.angle);
                scheme.push(new HSV(h, s, v));

                scheme.push(hsv);

                h = shift(hsv.h, 0.0 - opt.angle);
                scheme.push(new HSV(h, s, v));

                break;

            case "triadic":
            case "triad":
                scheme.push(hsv);
                for (i = 1; i < 3; i++) {
                    h = shift(h, 120.0);
                    scheme.push(new HSV(h, s, v));
                }
                break;

            case "tetradic":
            case "tetra":
                scheme.push(hsv);

                h = shift(hsv.h, 180.0);
                scheme.push(new HSV(h, s, v));

                h = shift(hsv.h, -1 * opt.angle);
                scheme.push(new HSV(h, s, v));

                h = shift(h, 180.0);
                scheme.push(new HSV(h, s, v));

                break;

            case "square":
                scheme.push(hsv);
                for (i = 1; i < 4; i++) {
                    h = shift(h, 90.0);
                    scheme.push(new HSV(h, s, v));
                }
                break;

            case "split-complementary":
            case "split-complement":
            case "split":
                h = shift(h, 180.0 - opt.angle);
                scheme.push(new HSV(h, s, v));

                scheme.push(hsv);

                h = shift(hsv.h, 180.0 + opt.angle);
                scheme.push(new HSV(h, s, v));
                break;

            default:
                console.warn("Unknown scheme name");
        }

        return convert(scheme, format);
    };

    /**
     * Parse from string to color type
     * @param color
     * @returns {HSL|RGB|RGBA|string|HSV|CMYK|HSLA}
     */
    const parseColor = function (color) {
        const _color = color.toLowerCase();

        let a = _color
            .replace(/[^\d.,]/g, "")
            .split(",")
            .map(v => {
                return _color.includes("hs") ? parseFloat(v) : parseInt(v);
            });

        if (_color[0] === "#") {
            return expandHexColor(_color);
        }

        if (_color.includes("rgba")) {
            return new RGBA(a[0], a[1], a[2], a[3]);
        }
        if (_color.includes("rgb")) {
            return new RGB(a[0], a[1], a[2]);
        }
        if (_color.includes("cmyk")) {
            return new CMYK(a[0], a[1], a[2], a[3]);
        }
        if (_color.includes("hsv")) {
            return new HSV(a[0], a[1], a[2]);
        }
        if (_color.includes("hsla")) {
            return new HSLA(a[0], a[1], a[2], a[3]);
        }
        if (_color.includes("hsl")) {
            return new HSL(a[0], a[1], a[2]);
        }
        return _color;
    };

    /**
     * Create random color
     */
    const randomColor = (colorType = "hex", alpha = 1) => {
        const rnd = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
        let hex, r, g, b;

        r = rnd(0, 255);
        g = rnd(0, 255);
        b = rnd(0, 255);

        hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

        return colorType === "hex" ? hex : toColor(hex, colorType, alpha);
    };

    var Routines = /*#__PURE__*/Object.freeze({
        __proto__: null,
        colorTypes: colorTypes,
        colorDefaultProps: colorDefaultProps,
        createColor: createColor,
        expandHexColor: expandHexColor,
        isDark: isDark,
        isLight: isLight,
        isHSV: isHSV,
        isHSL: isHSL,
        isHSLA: isHSLA,
        isRGB: isRGB,
        isRGBA: isRGBA,
        isCMYK: isCMYK,
        isHEX: isHEX,
        isColor: isColor,
        colorType: colorType,
        equal: equal,
        colorToString: colorToString,
        hex2rgb: hex2rgb,
        rgb2hex: rgb2hex,
        rgb2hsv: rgb2hsv,
        hsv2rgb: hsv2rgb,
        hsv2hex: hsv2hex,
        hex2hsv: hex2hsv,
        rgb2cmyk: rgb2cmyk,
        cmyk2rgb: cmyk2rgb,
        hsv2hsl: hsv2hsl,
        hsl2hsv: hsl2hsv,
        rgb2websafe: rgb2websafe,
        rgba2websafe: rgba2websafe,
        hex2websafe: hex2websafe,
        hsv2websafe: hsv2websafe,
        hsl2websafe: hsl2websafe,
        cmyk2websafe: cmyk2websafe,
        websafe: websafe,
        toColor: toColor,
        toHEX: toHEX,
        toRGB: toRGB,
        toRGBA: toRGBA,
        toHSV: toHSV,
        toHSL: toHSL,
        toHSLA: toHSLA,
        toCMYK: toCMYK,
        grayscale: grayscale,
        darken: darken,
        lighten: lighten,
        hueShift: hueShift,
        createColorScheme: createColorScheme,
        parseColor: parseColor,
        randomColor: randomColor
    });

    const StandardColorPalette = {
        aliceBlue: "#f0f8ff",
        antiqueWhite: "#faebd7",
        aqua: "#00ffff",
        aquamarine: "#7fffd4",
        azure: "#f0ffff",
        beige: "#f5f5dc",
        bisque: "#ffe4c4",
        black: "#000000",
        blanchedAlmond: "#ffebcd",
        blue: "#0000ff",
        blueViolet: "#8a2be2",
        brown: "#a52a2a",
        burlyWood: "#deb887",
        cadetBlue: "#5f9ea0",
        chartreuse: "#7fff00",
        chocolate: "#d2691e",
        coral: "#ff7f50",
        cornflowerBlue: "#6495ed",
        cornsilk: "#fff8dc",
        crimson: "#dc143c",
        cyan: "#00ffff",
        darkBlue: "#00008b",
        darkCyan: "#008b8b",
        darkGoldenRod: "#b8860b",
        darkGray: "#a9a9a9",
        darkGreen: "#006400",
        darkKhaki: "#bdb76b",
        darkMagenta: "#8b008b",
        darkOliveGreen: "#556b2f",
        darkOrange: "#ff8c00",
        darkOrchid: "#9932cc",
        darkRed: "#8b0000",
        darkSalmon: "#e9967a",
        darkSeaGreen: "#8fbc8f",
        darkSlateBlue: "#483d8b",
        darkSlateGray: "#2f4f4f",
        darkTurquoise: "#00ced1",
        darkViolet: "#9400d3",
        deepPink: "#ff1493",
        deepSkyBlue: "#00bfff",
        dimGray: "#696969",
        dodgerBlue: "#1e90ff",
        fireBrick: "#b22222",
        floralWhite: "#fffaf0",
        forestGreen: "#228b22",
        fuchsia: "#ff00ff",
        gainsboro: "#DCDCDC",
        ghostWhite: "#F8F8FF",
        gold: "#ffd700",
        goldenRod: "#daa520",
        gray: "#808080",
        green: "#008000",
        greenYellow: "#adff2f",
        honeyDew: "#f0fff0",
        hotPink: "#ff69b4",
        indianRed: "#cd5c5c",
        indigo: "#4b0082",
        ivory: "#fffff0",
        khaki: "#f0e68c",
        lavender: "#e6e6fa",
        lavenderBlush: "#fff0f5",
        lawnGreen: "#7cfc00",
        lemonChiffon: "#fffacd",
        lightBlue: "#add8e6",
        lightCoral: "#f08080",
        lightCyan: "#e0ffff",
        lightGoldenRodYellow: "#fafad2",
        lightGray: "#d3d3d3",
        lightGreen: "#90ee90",
        lightPink: "#ffb6c1",
        lightSalmon: "#ffa07a",
        lightSeaGreen: "#20b2aa",
        lightSkyBlue: "#87cefa",
        lightSlateGray: "#778899",
        lightSteelBlue: "#b0c4de",
        lightYellow: "#ffffe0",
        lime: "#00ff00",
        limeGreen: "#32dc32",
        linen: "#faf0e6",
        magenta: "#ff00ff",
        maroon: "#800000",
        mediumAquaMarine: "#66cdaa",
        mediumBlue: "#0000cd",
        mediumOrchid: "#ba55d3",
        mediumPurple: "#9370db",
        mediumSeaGreen: "#3cb371",
        mediumSlateBlue: "#7b68ee",
        mediumSpringGreen: "#00fa9a",
        mediumTurquoise: "#48d1cc",
        mediumVioletRed: "#c71585",
        midnightBlue: "#191970",
        mintCream: "#f5fffa",
        mistyRose: "#ffe4e1",
        moccasin: "#ffe4b5",
        navajoWhite: "#ffdead",
        navy: "#000080",
        oldLace: "#fdd5e6",
        olive: "#808000",
        oliveDrab: "#6b8e23",
        orange: "#ffa500",
        orangeRed: "#ff4500",
        orchid: "#da70d6",
        paleGoldenRod: "#eee8aa",
        paleGreen: "#98fb98",
        paleTurquoise: "#afeeee",
        paleVioletRed: "#db7093",
        papayaWhip: "#ffefd5",
        peachPuff: "#ffdab9",
        peru: "#cd853f",
        pink: "#ffc0cb",
        plum: "#dda0dd",
        powderBlue: "#b0e0e6",
        purple: "#800080",
        rebeccaPurple: "#663399",
        red: "#ff0000",
        rosyBrown: "#bc8f8f",
        royalBlue: "#4169e1",
        saddleBrown: "#8b4513",
        salmon: "#fa8072",
        sandyBrown: "#f4a460",
        seaGreen: "#2e8b57",
        seaShell: "#fff5ee",
        sienna: "#a0522d",
        silver: "#c0c0c0",
        slyBlue: "#87ceeb",
        slateBlue: "#6a5acd",
        slateGray: "#708090",
        snow: "#fffafa",
        springGreen: "#00ff7f",
        steelBlue: "#4682b4",
        tan: "#d2b48c",
        teal: "#008080",
        thistle: "#d8bfd8",
        tomato: "#ff6347",
        turquoise: "#40e0d0",
        violet: "#ee82ee",
        wheat: "#f5deb3",
        white: "#ffffff",
        whiteSmoke: "#f5f5f5",
        yellow: "#ffff00",
        yellowGreen: "#9acd32",
    };

    const MetroColorPalette = {
        lime: "#a4c400",
        green: "#60a917",
        emerald: "#008a00",
        blue: "#00AFF0",
        teal: "#00aba9",
        cyan: "#1ba1e2",
        cobalt: "#0050ef",
        indigo: "#6a00ff",
        violet: "#aa00ff",
        pink: "#dc4fad",
        magenta: "#d80073",
        crimson: "#a20025",
        red: "#CE352C",
        orange: "#fa6800",
        amber: "#f0a30a",
        yellow: "#fff000",
        brown: "#825a2c",
        olive: "#6d8764",
        steel: "#647687",
        mauve: "#76608a",
        taupe: "#87794e",
    };

    const Palette = {
        color: function (
            name,
            palette = StandardColorPalette,
            undefined_color = undefined
        ) {
            return palette[name] !== undefined ? palette[name] : undefined_color;
        },

        palette: function (palette = StandardColorPalette) {
            return Object.keys(palette);
        },

        colors: function (palette = StandardColorPalette) {
            return Object.values(palette);
        },
    };

    class Color {
        /**
         * Private method for setting value. Do not use outside
         * @param {*} color
         * @private
         */
        _setValue(color) {
            if (!color) {
                color = "#000000";
            }
            if (typeof color === "string") {
                color = parseColor(color);
            }
            if (color && isColor(color)) {
                this._value = color;
            } else {
                this._value = undefined;
            }
        }

        /**
         * Private method for setting options
         * @param options
         * @private
         */
        _setOptions(options) {
            this._options = Object.assign({}, colorDefaultProps, options);
        }

        /**
         * Constructor
         * @param {*} color. Set color value. Value must one of: hex, RGB, RGBA, HSL, HSLA, HSV, CMYK.
         * @param {Object} options
         */
        constructor(color = "#000000", options = null) {
            this._setValue(color);
            this._setOptions(options);
        }

        /**
         * Getter. Get options
         * @returns {{shade1: number, shade2: number, tint1: number, tint2: number, distance: number, alpha: number, angle: number, step: number, algorithm: number}}
         */
        get options() {
            return this._options;
        }

        /**
         * Setter. Set options. Will override default options
         * @param options
         */
        set options(options) {
            this._setOptions(options);
        }

        /**
         * Getter. Return current color value.
         * @returns {*}
         */
        get value() {
            return this._value ? this._value : undefined;
        }

        /**
         * Setter. Set color value. Value must one of: hex, RGB, RGBA, HSL, HSLA, HSV, CMYK.
         * @param {*} color
         */
        set value(color) {
            this._setValue(color);
        }

        /**
         * Convert current color to RGB
         * @returns {this | undefined}
         */
        toRGB() {
            if (!this._value) {
                return;
            }
            this._value = toRGB(this._value);
            return this;
        }

        /**
         * Getter.  Get color in RGB format
         * @returns {RGB | undefined}
         */
        get rgb() {
            return this._value ? toRGB(this._value) : undefined;
        }

        /**
         * Convert current value to RGBA
         * @param alpha - Alpha chanel value.
         * @returns {this | undefined}
         */
        toRGBA(alpha) {
            if (!this._value) {
                return;
            }
            if (isRGBA(this._value)) {
                if (alpha) {
                    this._value = toRGBA(this._value, alpha);
                }
            } else {
                this._value = toRGBA(
                    this._value,
                    alpha || colorDefaultProps.alpha
                );
            }
            return this;
        }

        /**
         * Getter. Get value in RGBA format. For alpha chanel value used options.alpha
         * @returns {RGBA | undefined}
         */
        get rgba() {
            return this._value
                ? isRGBA(this._value)
                    ? this._value
                    : toRGBA(this._value, this._options.alpha)
                : undefined;
        }

        /**
         * Convert current value to HEX
         * @returns {this | undefined}
         */
        toHEX() {
            if (!this._value) {
                return;
            }
            this._value = toHEX(this._value);
            return this;
        }

        /**
         * Getter. Get value as HEX
         * @returns {string | undefined}
         */
        get hex() {
            return this._value ? toHEX(this._value) : undefined;
        }

        /**
         * Convert current value to HSV
         * @returns {this | undefined}
         */
        toHSV() {
            if (!this._value) {
                return;
            }
            this._value = toHSV(this._value);
            return this;
        }

        /**
         * Getter. Get value as HSV
         * @returns {HSV | undefined}
         */
        get hsv() {
            return this._value ? toHSV(this._value) : undefined;
        }

        /**
         * Convert current value to HSL
         * @returns {this | undefined}
         */
        toHSL() {
            if (!this._value) {
                return;
            }
            this._value = toHSL(this._value);
            return this;
        }

        /**
         * Getter. Get value as HSL
         * @returns {HSL | undefined}
         */
        get hsl() {
            return this._value ? toHSL(this._value) : undefined;
        }

        /**
         * Convert current value to HSV
         * @param alpha
         * @returns {this | undefined}
         */
        toHSLA(alpha) {
            if (!this._value) {
                return;
            }
            if (isHSLA(this._value)) {
                if (alpha) {
                    this._value = toHSLA(this._value, alpha);
                }
            } else {
                this._value = toHSLA(this._value, alpha);
            }
            return this;
        }

        /**
         * Getter. Get value as HSLA. For alpha used options.alpha
         * @returns {HSLA | undefined}
         */
        get hsla() {
            return this._value
                ? isHSLA(this._value)
                    ? this._value
                    : toHSLA(this._value, this._options.alpha)
                : undefined;
        }

        /**
         * Convert current value to CMYK
         * @returns {this | undefined}
         */
        toCMYK() {
            if (!this._value) {
                return;
            }
            this._value = toCMYK(this._value);
            return this;
        }

        /**
         * Getter. Get value as CMYK
         * @returns {CMYK | undefined}
         */
        get cmyk() {
            return this._value ? toCMYK(this._value) : undefined;
        }

        /**
         * Convert color value to websafe value
         * @returns {this | undefined}
         */
        toWebsafe() {
            if (!this._value) {
                return;
            }
            this._value = websafe(this._value);
            return this;
        }

        /**
         * Getter. Get value as websafe.
         * @returns {HSLA | undefined}
         */
        get websafe() {
            return this._value ? websafe(this._value) : undefined;
        }

        /**
         * Get stringify color value
         * @returns {string} This function return string presentation of color. Example: for RGB will return rgb(x, y, z)
         */
        toString() {
            return this._value ? colorToString(this._value) : undefined;
        }

        /**
         * Darken color for requested percent value
         * @param {int} amount - Value must between 0 and 100. Default value is 10
         * @returns {this | undefined}
         */
        darken(amount = 10) {
            if (!this._value) {
                return;
            }
            this._value = darken(this._value, amount);
            return this;
        }

        /**
         * Darken color for requested percent value
         * @param {int} amount - Value must between 0 and 100. Default value is 10
         * @returns {this | undefined}
         */
        lighten(amount = 10) {
            if (!this._value) {
                return;
            }
            this._value = lighten(this._value, amount);
            return this;
        }

        /**
         * Return true, if current color id dark
         * @returns {boolean|undefined}
         */
        isDark() {
            return this._value ? isDark(this._value) : undefined;
        }

        /**
         * Return true, if current color id light
         * @returns {boolean|undefined}
         */
        isLight() {
            return this._value ? isLight(this._value) : undefined;
        }

        /**
         * Change value on wheel with specified angle
         * @param {int} angle - Value between -360 and 360
         */
        hueShift(angle) {
            if (!this._value) {
                return;
            }
            this._value = hueShift(this._value, angle);
            return this;
        }

        /**
         * Convert color value to grayscale value
         * @returns {this | undefined}
         */
        grayscale() {
            if (!this._value || this.type === colorTypes.UNKNOWN) {
                return;
            }
            this._value = grayscale(
                this._value,
                ("" + this.type).toLowerCase()
            );
            return this;
        }

        /**
         * Getter. Get color type
         * @returns {string}
         */
        get type() {
            return colorType(this._value);
        }

        /**
         * Create specified  color scheme for current color value
         * @param {string} name - Scheme name
         * @param {string} format - Format for returned values
         * @param {Object} options - Options for generated schema, will override default options
         * @returns {Array | undefined}
         */
        getScheme(name, format, options) {
            return this._value
                ? createColorScheme(this._value, name, format, options)
                : undefined;
        }

        /**
         * Check if color is equal to comparison color
         * @param {*} color
         * @returns {boolean}
         */
        equal(color) {
            return equal(this._value, color);
        }

        random(colorType, alpha){
            this._value = randomColor(colorType, alpha);
        }

        static isColor(val){
            const color = parseColor(val);
            return isColor(color)
        }

        static randomColor(colorType, alpha){
            return randomColor(colorType, alpha)
        }
    }

    globalThis.Color = Color;
    globalThis.color = c => new Color(c);

    globalThis.Color.Routines = Routines;
    globalThis.Color.Palette = Palette;
    globalThis.Color.StandardColors = StandardColorPalette;
    globalThis.Color.MetroColors = MetroColorPalette;

})();
