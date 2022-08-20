import { parseColor } from "@react-stately/color";
import { Color } from "@react-types/color";

export type RGB = {
  r: number;
  g: number;
  b: number;
};

export type HSL = {
  h: number;
  s: number;
  l: number;
};

export let defaultBlack = parseColor("hsl(0, 0%, 0%)");

export let defaultBlue = parseColor("hsl(240, 100%, 50%)");

export let defaultRed = parseColor("hsl(0, 100%, 50%)");

export let defaultWhite = parseColor("hsl(41.5, 14.9%, 82.9%)");

export function getColors(start: Color, end: Color) {
  let color1 = HSLtoRGB({
    h: start.getChannelValue("hue"),
    s: start.getChannelValue("saturation"),
    l: start.getChannelValue("lightness"),
  });
  let color2 = HSLtoRGB({
    h: end.getChannelValue("hue"),
    s: end.getChannelValue("saturation"),
    l: end.getChannelValue("lightness"),
  });
  let colors = [color1, { r: 0, g: 0, b: 0 }, { r: 0, g: 0, b: 0 }, color2];

  let step = {
    r: (colors[3].r - colors[0].r) / 3,
    g: (colors[3].g - colors[0].g) / 3,
    b: (colors[3].b - colors[0].b) / 3,
  };

  colors[1] = {
    r: colors[0].r + step.r * 1,
    g: colors[0].g + step.g * 1,
    b: colors[0].b + step.b * 1,
  };

  colors[2] = {
    r: colors[0].r + step.r * 2,
    g: colors[0].g + step.g * 2,
    b: colors[0].b + step.b * 2,
  };

  return colors.map((color) =>
    parseColor(`rgb(${color.r}, ${color.g}, ${color.b})`)
  );
}

export function getRGBtoCSS({ r, g, b }: RGB) {
  return `rgb(${r}, ${g}, ${b})`;
}

export function getRGBAtoCSS({ r, g, b }: RGB, a: number) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function HSLtoRGB({ h, s, l }: HSL): RGB {
  h = h / 360;
  s = s / 100;
  l = l / 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    let hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function HSLtoString({ h, s, l }: HSL): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export function RGBtoString({ r, g, b }: RGB): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function RGBtoHSL({ r, g, b }: RGB): HSL {
  r = r / 255;
  g = g / 255;
  b = b / 255;
  let max = Math.max(r, g, b);
  let min = Math.min(r, g, b);
  let l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    let c = max - min; // chroma
    s = c / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = ((g - b) / c) % 6;
        break;
      case g:
        h = (b - r) / c + 2;
        break;
      case b:
        h = (r - g) / c + 4;
        break;
    }
  }
  h = Math.round(h * 60);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  return { h, s, l };
}
