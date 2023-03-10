import Color, {Routines, Palette, StandardColorPalette, MetroColorPalette} from "./index.js";

globalThis.Color = Color
globalThis.color = c => new Color(c)

globalThis.Color.Routines = Routines
globalThis.Color.Palette = Palette
globalThis.Color.StandardColors = StandardColorPalette
globalThis.Color.MetroColors = MetroColorPalette