export default class RGB {
    constructor(r = 0, g = 0, b = 0) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toString(){
        return `rgb(${this.r},${this.g},${this.b})`;
    }
}