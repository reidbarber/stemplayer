import { SliderState } from "react-stately";
import { Orientation, Variant } from "../Slider/Slider";
import { StemType, usePlayer } from "../Player/Player";
import { getColors } from "../../utils/colors";

type LightProps = {
  index: number;
  state: SliderState;
  orientation: Orientation;
  variant: Variant;
  stem: StemType;
  level: number;
};

export function Light(props: LightProps) {
  let { state, index, orientation, variant, stem, level } = props;
  let isReversed = variant === "bottom" || variant === "left";

  let { isPlaying, isolated, colors } = usePlayer();

  let isVisible =
    (isolated.length === 0 || isolated.includes(stem)) &&
    (isReversed
      ? state.getThumbValue(0) <= index
      : state.getThumbValue(0) >= index);
  let isVertical = orientation === "vertical";
  let translateDirection = isVertical ? "Y" : "X";
  let position = isReversed ? 3 - index : index;

  level = isPlaying ? level : 0;

  // Meter level calculation from https://github.com/Tonejs/ui/blob/master/src/gui/vis/meter.ts

  let defaultLights = getColors(colors[0], colors[1]);
  let background = defaultLights[position]
    .withChannelValue("alpha", 0.7 + level / 333.333)
    .toString("rgba");
  let boxShadow = `0px 0px 8px ${2 + level / 20}px ${defaultLights[
    position
  ].toString("rgb")}`;

  return (
    <div
      className="light"
      style={{
        transform: `translate${translateDirection}(-50%)`,
        left: isVertical ? 26 : `${((1 + index) / 5) * 100}%`,
        top: isVertical ? `${(1 - (1 + index) / 5) * 100}%` : 26,
        background,
        boxShadow,
        opacity: isVisible ? (0.75 + level / 400).toFixed(2) : 0,
      }}
    />
  );
}
