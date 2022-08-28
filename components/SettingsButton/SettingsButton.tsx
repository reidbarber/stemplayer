import { forwardRef, RefObject } from "react";
import { useFocusRing, mergeProps } from "react-aria";
import Logo from "../Logo/Logo";
import { useSettings } from "../../pages";
import { defaultBlack, defaultWhite } from "../../utils/colors";

const SettingsButton = forwardRef((props, ref) => {
  let { isFocusVisible, focusProps } = useFocusRing();
  let { theme } = useSettings();
  return (
    <div
      role="button"
      {...mergeProps(focusProps, props)}
      aria-label="Open Settings"
      ref={ref as RefObject<HTMLDivElement>}
      className="settingsButton"
      style={{
        outline: isFocusVisible ? "4px solid lightblue" : "none",
      }}
    >
      <Logo
        height={45}
        width={45}
        colors={theme === "dark" ? [defaultWhite] : [defaultBlack]}
      />
    </div>
  );
});

SettingsButton.displayName = "SettingsButton";
export default SettingsButton;
