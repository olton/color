import * as Routines from "./routines";
import {Palette, MetroColorPalette, StandardColorPalette} from "./palette.js";

export {
    Routines,
    Palette,
    MetroColorPalette,
    StandardColorPalette
}

export default class Color {
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
            color = Routines.parseColor(color);
        }
        if (color && Routines.isColor(color)) {
            this._value = color;
        } else {
            this._value = undefined
        }
    }

    /**
     * Private method for setting options
     * @param options
     * @private
     */
    _setOptions(options) {
        this._options = Object.assign({}, Routines.colorDefaultProps, options);
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
        this._value = Routines.toRGB(this._value);
        return this;
    }

    /**
     * Getter.  Get color in RGB format
     * @returns {RGB | undefined}
     */
    get rgb() {
        return this._value ? Routines.toRGB(this._value) : undefined;
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
        if (Routines.isRGBA(this._value)) {
            if (alpha) {
                this._value = Routines.toRGBA(this._value, alpha);
            }
        } else {
            this._value = Routines.toRGBA(
                this._value,
                alpha || Routines.colorDefaultProps.alpha
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
            ? Routines.isRGBA(this._value)
                ? this._value
                : Routines.toRGBA(this._value, this._options.alpha)
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
        this._value = Routines.toHEX(this._value);
        return this;
    }

    /**
     * Getter. Get value as HEX
     * @returns {string | undefined}
     */
    get hex() {
        return this._value ? Routines.toHEX(this._value) : undefined;
    }

    /**
     * Convert current value to HSV
     * @returns {this | undefined}
     */
    toHSV() {
        if (!this._value) {
            return;
        }
        this._value = Routines.toHSV(this._value);
        return this;
    }

    /**
     * Getter. Get value as HSV
     * @returns {HSV | undefined}
     */
    get hsv() {
        return this._value ? Routines.toHSV(this._value) : undefined;
    }

    /**
     * Convert current value to HSL
     * @returns {this | undefined}
     */
    toHSL() {
        if (!this._value) {
            return;
        }
        this._value = Routines.toHSL(this._value);
        return this;
    }

    /**
     * Getter. Get value as HSL
     * @returns {HSL | undefined}
     */
    get hsl() {
        return this._value ? Routines.toHSL(this._value) : undefined;
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
        if (Routines.isHSLA(this._value)) {
            if (alpha) {
                this._value = Routines.toHSLA(this._value, alpha);
            }
        } else {
            this._value = Routines.toHSLA(this._value, alpha);
        }
        return this;
    }

    /**
     * Getter. Get value as HSLA. For alpha used options.alpha
     * @returns {HSLA | undefined}
     */
    get hsla() {
        return this._value
            ? Routines.isHSLA(this._value)
                ? this._value
                : Routines.toHSLA(this._value, this._options.alpha)
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
        this._value = Routines.toCMYK(this._value);
        return this;
    }

    /**
     * Getter. Get value as CMYK
     * @returns {CMYK | undefined}
     */
    get cmyk() {
        return this._value ? Routines.toCMYK(this._value) : undefined;
    }

    /**
     * Convert color value to websafe value
     * @returns {this | undefined}
     */
    toWebsafe() {
        if (!this._value) {
            return;
        }
        this._value = Routines.websafe(this._value);
        return this;
    }

    /**
     * Getter. Get value as websafe.
     * @returns {HSLA | undefined}
     */
    get websafe() {
        return this._value ? Routines.websafe(this._value) : undefined;
    }

    /**
     * Get stringify color value
     * @returns {string} This function return string presentation of color. Example: for RGB will return rgb(x, y, z)
     */
    toString() {
        return this._value ? Routines.colorToString(this._value) : undefined;
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
        this._value = Routines.darken(this._value, amount);
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
        this._value = Routines.lighten(this._value, amount);
        return this;
    }

    /**
     * Return true, if current color id dark
     * @returns {boolean|undefined}
     */
    isDark() {
        return this._value ? Routines.isDark(this._value) : undefined;
    }

    /**
     * Return true, if current color id light
     * @returns {boolean|undefined}
     */
    isLight() {
        return this._value ? Routines.isLight(this._value) : undefined;
    }

    /**
     * Change value on wheel with specified angle
     * @param {int} angle - Value between -360 and 360
     */
    hueShift(angle) {
        if (!this._value) {
            return;
        }
        this._value = Routines.hueShift(this._value, angle);
        return this;
    }

    /**
     * Convert color value to grayscale value
     * @returns {this | undefined}
     */
    grayscale() {
        if (!this._value || this.type === Routines.colorTypes.UNKNOWN) {
            return;
        }
        this._value = Routines.grayscale(
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
        return Routines.colorType(this._value);
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
            ? Routines.createColorScheme(this._value, name, format, options)
            : undefined;
    }

    /**
     * Check if color is equal to comparison color
     * @param {*} color
     * @returns {boolean}
     */
    equal(color) {
        return Routines.equal(this._value, color);
    }

    random(colorType, alpha){
        this._value = Routines.randomColor(colorType, alpha)
    }

    static isColor(val){
        const color = Routines.parseColor(val)
        return Routines.isColor(color)
    }

    static randomColor(colorType, alpha){
        return Routines.randomColor(colorType, alpha)
    }
}