import HSV from "./colors/hsv";
import HSL from "./colors/hsl";
import HSLA from "./colors/hsla";
import RGB from "./colors/rgb";
import RGBA from "./colors/rgba";
import CMYK from "./colors/cmyk";

export const colorTypes = {
    HEX: "hex",
    RGB: "rgb",
    RGBA: "rgba",
    HSV: "hsv",
    HSL: "hsl",
    HSLA: "hsla",
    CMYK: "cmyk",
    UNKNOWN: "unknown",
};

export const colorDefaultProps = {
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
export const createColor = (colorType = "hex", from = "#000000") => {
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
export const expandHexColor = function (hex) {
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
export const isDark = color => {
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
export const isLight = color => {
    return !isDark(color);
};

/**
 * Check if specified color is HSV color
 * @param {*} color
 * @returns {boolean|undefined}
 */
export const isHSV = color => {
    return color instanceof HSV;
};

/**
 * Check if specified color is HSL color
 * @param {*} color
 * @returns {boolean|undefined}
 */
export const isHSL = color => {
    return color instanceof HSL;
};

/**
 * Check if specified color is HSLA color
 * @param {*} color
 * @returns {boolean|undefined}
 */
export const isHSLA = color => {
    return color instanceof HSLA;
};

/**
 * Check if specified color is RGB color
 * @param {*} color
 * @returns {boolean|undefined}
 */
export const isRGB = color => {
    return color instanceof RGB;
};

/**
 * Check if specified color is RGBA color
 * @param {*} color
 * @returns {boolean|undefined}
 */
export const isRGBA = color => {
    return color instanceof RGBA;
};

/**
 * Check if specified color is CMYK color
 * @param {*} color
 * @returns {boolean|undefined}
 */
export const isCMYK = color => {
    return color instanceof CMYK;
};

/**
 * Check if specified color is HEX color
 * @param {*} color
 * @returns {boolean|undefined}
 */
export const isHEX = color => {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);
};

/**
 * Check if value is a supported color
 * @param {*} color
 * @returns {boolean|undefined}
 */
export const isColor = color => {
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
export const colorType = color => {
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
export const equal = (color1, color2) => {
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
export const colorToString = color => {
    return color.toString();
};

/**
 * @param {string} hex
 * @returns {RGB} Value returned as RGB object
 */
export const hex2rgb = hex => {
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
export const rgb2hex = rgb => {
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
export const rgb2hsv = rgb => {
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
export const hsv2rgb = hsv => {
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
export const hsv2hex = hsv => {
    return rgb2hex(hsv2rgb(hsv));
};

/**
 *
 * @param {string} hex
 * @returns {HSV}
 */
export const hex2hsv = hex => {
    return rgb2hsv(hex2rgb(hex));
};

/**
 *
 * @param {RGB} rgb
 * @returns {CMYK}
 */
export const rgb2cmyk = rgb => {
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
export const cmyk2rgb = cmyk => {
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
export const hsv2hsl = hsv => {
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
export const hsl2hsv = hsl => {
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
export const rgb2websafe = rgb => {
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
export const rgba2websafe = rgba => {
    const rgbWebSafe = rgb2websafe(rgba);
    return new RGBA(rgbWebSafe.r, rgbWebSafe.g, rgbWebSafe.b, rgba.a);
};

/**
 *
 * @param {string} hex
 * @returns {string}
 */
export const hex2websafe = hex => {
    return rgb2hex(rgb2websafe(hex2rgb(hex)));
};

/**
 *
 * @param hsv
 * @returns {HSV}
 */
export const hsv2websafe = hsv => {
    return rgb2hsv(rgb2websafe(toRGB(hsv)));
};

export const hsl2websafe = hsl => {
    return hsv2hsl(rgb2hsv(rgb2websafe(toRGB(hsl))));
};

export const cmyk2websafe = cmyk => {
    return rgb2cmyk(rgb2websafe(cmyk2rgb(cmyk)));
};

export const websafe = color => {
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
export const toColor = (color, mode = "rgb", alpha = 1) => {
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
export const toHEX = color => {
    return typeof color === "string"
        ? expandHexColor(color)
        : rgb2hex(toRGB(color));
};

/**
 * Convert color to RGB
 * @param color
 * @returns {RGB|*}
 */
export const toRGB = color => {
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
export const toRGBA = (color, alpha) => {
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
export const toHSV = color => {
    return rgb2hsv(toRGB(color));
};

/**
 * Convert color to HSL
 * @param color
 * @returns {HSL}
 */
export const toHSL = color => {
    return hsv2hsl(rgb2hsv(toRGB(color)));
};

/**
 * Convert color to HSLA
 * @param color
 * @param alpha
 * @returns {HSLA|*}
 */
export const toHSLA = (color, alpha = 1) => {
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
export const toCMYK = color => {
    return rgb2cmyk(toRGB(color));
};

/**
 * Convert color to grayscale
 * @param color
 * @returns {*}
 */
export const grayscale = color => {
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
export const darken = (color, amount = 10) => {
    return lighten(color, -1 * Math.abs(amount));
};

/**
 * lighten color to specified percent
 * @param color
 * @param amount
 * @returns {*}
 */
export const lighten = (color, amount = 10) => {
    let type,
        res,
        alpha = 1,
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
        alpha = color.a;
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
export const hueShift = (color, angle, alpha = 1) => {
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
export const createColorScheme = (color, name, format, options) => {
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
export const parseColor = function (color) {
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
export const randomColor = (colorType = "hex", alpha = 1) => {
    const rnd = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));
    let hex, r, g, b;

    r = rnd(0, 255);
    g = rnd(0, 255);
    b = rnd(0, 255);

    hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);

    return colorType === "hex" ? hex : toColor(hex, colorType, alpha);
};