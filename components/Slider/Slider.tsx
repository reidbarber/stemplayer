import { useSliderState } from "react-stately";
import {
  useNumberFormatter,
  useFocusRing,
  mergeProps,
  useSlider,
} from "react-aria";
import { useEffect, useRef } from "react";
import { Light } from "../Light/Light";
import { Thumb } from "../Thumb/Thumb";
import { StemType, usePlayer } from "../Player/Player";

export type Orientation = "horizontal" | "vertical" | undefined;

export type Variant = "top" | "right" | "bottom" | "left";

type SliderProps = {
  variant: Variant;
  stem: StemType;
  level: number;
};

export default function Slider(props: SliderProps) {
  let { variant, stem, level } = props;
  let orientation: Orientation =
    variant === "top" || variant === "bottom" ? "vertical" : "horizontal";
  let isReversed = variant === "bottom" || variant === "left";
  let settings = {
    maxValue: 3,
    defaultValue: isReversed ? [0] : [3],
    step: 1,
    "aria-label": `Set volume for ${stem} stem.`,
  };
  let trackRef = useRef(null);
  let numberFormatter = useNumberFormatter();
  let state = useSliderState({ ...settings, numberFormatter });
  let { groupProps, trackProps } = useSlider(
    {
      ...settings,
      orientation,
    },
    state,
    trackRef
  );
  let { isFocusVisible, focusProps } = useFocusRing({ within: true });

  let isVertical = orientation === "vertical";
  let SLIDER_WIDTH = 150;
  let SLIDER_HEIGHT = 72;

  let { setStemVolume } = usePlayer();

  let precentValue = isReversed
    ? 1 - state.getThumbPercent(0)
    : state.getThumbPercent(0);

  useEffect(() => {
    setStemVolume(stem, precentValue * 100);
  }, [stem, precentValue, setStemVolume]);

  return (
    <div
      {...mergeProps(focusProps, groupProps, trackProps)}
      ref={trackRef}
      className="slider"
      style={{
        flexDirection: isVertical ? "row" : "column",
        width: isVertical ? SLIDER_HEIGHT : SLIDER_WIDTH,
        height: isVertical ? SLIDER_WIDTH : SLIDER_HEIGHT,
        outline: isFocusVisible ? "4px solid lightblue" : "none",
      }}
    >
      <Thumb
        index={0}
        state={state}
        trackRef={trackRef}
        orientation={orientation}
        variant={variant}
        stem={stem}
      />
      {[0, 1, 2, 3].map((index) => (
        <Light
          key={index}
          index={index}
          state={state}
          orientation={orientation}
          variant={variant}
          stem={stem}
          level={level}
        />
      ))}
    </div>
  );
}
