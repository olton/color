export default class HSL {
    constructor(h = 0, s = 0, l = 0) {
        this.h = h;
        this.s = s;
        this.l = l;
    }

    toString(){
        return `hsl(${this.h},${this.s},${this.l})`;
    }
}