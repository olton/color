import * as Routines from "./routines";
import { Palette, MetroColorPalette, StandardColorPalette } from "./palette.js";
import { Color } from "./color.js";

const Primitives = {
    ...Routines.Primitives
}

const version = "1.0.3"
const build_time = "12.05.2024, 20:14:19"

const info = () => {
    console.info(`%c Color Library %c v${version} %c ${build_time} `, "color: #ffffff; font-weight: bold; background: #ff00ff", "color: white; background: darkgreen", "color: white; background: #0080fe;")
}

export {
    Routines,
    Palette,
    MetroColorPalette,
    StandardColorPalette,
    Primitives,
    Color,
    info
}

