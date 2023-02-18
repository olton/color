export default class CMYK {
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