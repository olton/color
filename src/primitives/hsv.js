export default class HSV {
    constructor(h = 0, s = 0, v = 0) {
        this.h = h;
        this.s = s;
        this.v = v;
    }

    toString(){
        return "hsv(" + [Math.round(this.h), Math.round(this.s*100)+"%", Math.round(this.v*100)+"%"].join(", ") + ")";
    }
}