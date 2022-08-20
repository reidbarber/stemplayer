import { defaultBlue, defaultRed, getColors } from "../../utils/colors";
import { Color } from "@react-types/color";

type LogoProps = {
  height?: number;
  width?: number;
  colors?: [Color] | [Color, Color] | [Color, Color, Color, Color];
  style?: React.CSSProperties;
};

export default function Logo(props: LogoProps) {
  const {
    height = 500,
    width = 500,
    colors = [defaultRed, defaultBlue],
    style,
  } = props;
  let renderedColors = [];
  if (colors.length === 1) {
    renderedColors = Array(4).fill(colors[0].toString("rgb"));
  } else if (colors.length === 2) {
    renderedColors = getColors(colors[0], colors[1]).map((c) =>
      c.toString("rgb")
    );
  }
  return (
    <svg
      style={{ height, width, ...style }}
      width="500px"
      height="500px"
      viewBox={`0 0 500 500`}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <circle fill={renderedColors[0]} cx="250" cy="182" r="14"></circle>
        <circle fill={renderedColors[1]} cx="250" cy="131" r="14"></circle>
        <circle fill={renderedColors[2]} cx="250" cy="80" r="14"></circle>
        <circle fill={renderedColors[4]} cx="250" cy="29" r="14"></circle>
        <circle fill={renderedColors[0]} cx="181" cy="252" r="14"></circle>
        <circle fill={renderedColors[1]} cx="129" cy="252" r="14"></circle>
        <circle fill={renderedColors[2]} cx="77" cy="252" r="14"></circle>
        <circle fill={renderedColors[4]} cx="25" cy="252" r="14"></circle>
        <circle fill={renderedColors[0]} cx="320" cy="252" r="14"></circle>
        <circle fill={renderedColors[1]} cx="372" cy="252" r="14"></circle>
        <circle fill={renderedColors[2]} cx="424" cy="252" r="14"></circle>
        <circle fill={renderedColors[4]} cx="476" cy="252" r="14"></circle>
        <circle fill={renderedColors[0]} cx="250" cy="322" r="14"></circle>
        <circle fill={renderedColors[1]} cx="250" cy="373" r="14"></circle>
        <circle fill={renderedColors[2]} cx="250" cy="424" r="14"></circle>
        <circle fill={renderedColors[4]} cx="250" cy="475" r="14"></circle>
      </g>
    </svg>
  );
}
