import { useRef } from "react";
import {
  useButton,
  useFocusRing,
  mergeProps,
  AriaButtonProps,
} from "react-aria";
import { StyleProps } from "@react-types/shared";

interface ButtonProps extends AriaButtonProps<"span">, StyleProps {
  variant?: "default" | "circle" | "secondary";
}

export default function Button(props: ButtonProps) {
  const { children, UNSAFE_className, variant } = props;
  let ref = useRef(null);

  let { buttonProps, isPressed } = useButton(
    {
      elementType: "div",
      ...props,
    },
    ref
  );
  let { isFocusVisible, focusProps } = useFocusRing();
  return (
    <div
      {...mergeProps(focusProps, buttonProps)}
      ref={ref}
      className={`button ${UNSAFE_className} ${variant}`}
      style={{
        outline: isFocusVisible ? "4px solid lightblue" : "none",
        backgroundColor: isPressed ? "#6a5a46" : undefined,
      }}
    >
      {children}
    </div>
  );
}
