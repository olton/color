export default class HSV {
    constructor(h = 0, s = 0, v = 0) {
        this.h = h;
        this.s = s;
        this.v = v;
    }

    toString(){
        return `hsv(${this.h},${this.s},${this.v})`;
    }
}