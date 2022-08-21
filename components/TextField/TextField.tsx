import { useRef } from "react";
import {
  useTextField,
  AriaTextFieldProps,
} from "react-aria";


export default function TextField(props: AriaTextFieldProps) {
  let { label } = props;
  let ref = useRef();
  let { labelProps, inputProps } = useTextField(props, ref);

  return (
    <div className="textfield">
      <label {...labelProps}>{label}</label>
      <input {...inputProps} ref={ref} />
    </div>
  );
}
