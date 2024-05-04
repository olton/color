export default class HSLA {
    constructor(h = 0, s = 0, l = 0, a = 0) {
        this.h = h;
        this.s = s;
        this.l = l;
        this.a = a;
    }

    toString(){
        return "hsla(" + [Math.round(this.h), Math.round(this.s*100)+"%", Math.round(this.l*100)+"%", parseFloat(this.a).toFixed(2)].join(", ") + ")";
    }
}