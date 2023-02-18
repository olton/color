export default class RGBA {
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