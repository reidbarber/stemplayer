import {
  useFocusRing,
  VisuallyHidden,
  mergeProps,
  useSliderThumb,
  usePress,
} from "react-aria";
import { RefObject, useRef } from "react";
import { SliderState } from "react-stately";
import { Orientation, Variant } from "../Slider/Slider";
import { StemType, usePlayer } from "../Player/Player";

type ThumbProps = {
  index: number;
  state: SliderState;
  orientation: Orientation;
  trackRef: RefObject<HTMLElement>;
  variant: Variant;
  stem: StemType;
};

export function Thumb(props: ThumbProps) {
  let { state, trackRef, index, orientation, variant, stem } = props;
  let inputRef = useRef(null);
  let { thumbProps, inputProps } = useSliderThumb(
    {
      orientation,
      index,
      trackRef,
      inputRef,
    },
    state
  );
  let { focusProps } = useFocusRing();
  let { startIsolateStem, endIsolateStem } = usePlayer();

  let timeRef = useRef<NodeJS.Timer | null>(null);

  let isVertical = orientation === "vertical";
  let isReversed = variant === "bottom" || variant === "left";
  let translateDirection = isVertical ? "Y" : "X";
  let translateDistance = isReversed ? "50" : "-50";
  let value = isReversed
    ? 3 - state.getThumbValue(index)
    : state.getThumbValue(index);

  let { pressProps } = usePress({
    onPressStart: () => {
      // If pressed for 350ms, isolate stem.
      timeRef.current = setTimeout(() => {
        if (value === 3) {
          startIsolateStem(stem);
        }
        timeRef.current = null;
      }, 350);
    },
    onPressEnd: () => {
      if (timeRef.current) {
        // Clear timer if press ends before 500ms
        clearTimeout(timeRef.current);
      } else {
        // If timer doesn't exist, we can end isolation
        endIsolateStem(stem);
      }
    },
  });

  return (
    <div
      {...mergeProps(pressProps, thumbProps)}
      className="thumb"
      style={{
        transform: `translate${translateDirection}(${translateDistance}%)`,
        [isReversed ? "right" : "left"]: isVertical
          ? 18
          : `${((1 + value) / 5) * 100}%`,
        [isReversed ? "bottom" : "top"]: isVertical
          ? `${(1 - (1 + value) / 5) * 100}%`
          : 18,
      }}
    >
      <VisuallyHidden>
        <input ref={inputRef} {...mergeProps(inputProps, focusProps)} />
      </VisuallyHidden>
    </div>
  );
}
