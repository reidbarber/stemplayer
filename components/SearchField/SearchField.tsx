import { useSearchField } from "react-aria";
import { useSearchFieldState } from "react-stately";
import { SearchFieldProps } from "@react-types/searchfield";
import { useRef } from "react";

export default function SearchField(props: SearchFieldProps) {
  let { label } = props;
  let state = useSearchFieldState(props);
  let ref = useRef(null);
  let { labelProps, inputProps } = useSearchField(props, state, ref);

  // let clearButtonRef = useRef(null);

  // let { buttonProps } = useButton(clearButtonProps, clearButtonRef);

  return (
    <div className="searchfield">
      <label {...labelProps}>{label}</label>
      <div className="searchfield-inputcontainer">
        <input {...inputProps} ref={ref} />
      </div>
    </div>
  );
}
