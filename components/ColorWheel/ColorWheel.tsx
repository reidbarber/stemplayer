import { useColorWheel } from "@react-aria/color";
import { useColorWheelState } from "@react-stately/color";
import { VisuallyHidden, useFocusRing } from "react-aria";
import { useRef } from "react";
import { AriaColorWheelProps } from "@react-types/color";
import Logo from "../Logo/Logo";
import { usePlayer } from "../Player/Player";

const RADIUS = 100;
const TRACK_THICKNESS = 28;
const THUMB_SIZE = 20;

interface ColorWheelProps extends AriaColorWheelProps {
  showPreview?: boolean;
}

export default function ColorWheel(props: ColorWheelProps) {
  let state = useColorWheelState(props);
  let inputRef = useRef(null);
  let { trackProps, inputProps, thumbProps } = useColorWheel(
    {
      ...props,
      outerRadius: RADIUS,
      innerRadius: RADIUS - TRACK_THICKNESS,
    },
    state,
    inputRef
  );

  let { focusProps, isFocusVisible } = useFocusRing();
  let { colors } = usePlayer();

  return (
    <div className="colorWheel">
      {props.showPreview && (
        <Logo
          style={{ position: "absolute", left: 50, top: 50 }}
          height={100}
          width={100}
          colors={colors}
        />
      )}

      <div {...trackProps} />
      <div
        {...thumbProps}
        className="colorWheel-thumb"
        style={{
          ...thumbProps.style,
          width: isFocusVisible ? TRACK_THICKNESS + 4 : THUMB_SIZE,
          height: isFocusVisible ? TRACK_THICKNESS + 4 : THUMB_SIZE,
        }}
      >
        <VisuallyHidden>
          <input {...inputProps} {...focusProps} ref={inputRef} />
        </VisuallyHidden>
      </div>
    </div>
  );
}
