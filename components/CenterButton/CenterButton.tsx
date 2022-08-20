import { useRef } from "react";
import { useButton, useFocusRing, mergeProps } from "react-aria";
import { usePlayer } from "../Player/Player";
import { Time } from "tone";

export default function CenterButton() {
  let ref = useRef(null);
  let { toggle, isPlaying, startLoop, endLoop } = usePlayer();

  let timeRef = useRef<NodeJS.Timer | null>(null);

  let { buttonProps, isPressed } = useButton(
    {
      elementType: "div",
      onPress: () => timeRef.current && toggle(),
      "aria-label": `${isPlaying ? "Pause" : "Play"} track`,
      onPressStart: () => {
        // If pressed for 2500ms, start loop
        if (isPlaying) {
          timeRef.current = setTimeout(() => {
            if (isPlaying) {
              startLoop();
            }
            timeRef.current = null;
          }, Time("1:0").toSeconds() * 1000);
        }
      },
      onPressEnd: () => {
        if (isPlaying) {
          if (timeRef.current) {
            // Clear timer if press ends before 500ms
            clearTimeout(timeRef.current);
          } else {
            // If timer doesn't exist, we can end loop
            endLoop();
          }
        }
      },
    },
    ref
  );
  let { isFocusVisible, focusProps } = useFocusRing();
  return (
    <div
      {...mergeProps(focusProps, buttonProps)}
      ref={ref}
      className="centerButton"
      style={{
        outline: isFocusVisible ? "4px solid lightblue" : "none",
        width: isPressed ? 60 : 61,
        height: isPressed ? 60 : 61,
        boxShadow: isPressed
          ? "rgba(0, 0, 0, 0.05) 2px 2px 4px 0px, rgba(0, 0, 0, 0.05) -2px -3px 4px 0px"
          : "rgba(0, 0, 0, 0.05) 2px 2px 6px 0px, rgba(0, 0, 0, 0.05) -2px -3px 6px 0px",
      }}
    />
  );
}
