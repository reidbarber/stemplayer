import {
  useOverlay,
  usePreventScroll,
  useModal,
  useDialog,
  FocusScope,
} from "react-aria";
import { useRef } from "react";

export default function Modal(props: any) {
  let { title, closeButtonProps, isDismissable, children, size = 'small' } = props;

  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  let ref = useRef(null);
  let { overlayProps, underlayProps } = useOverlay(props, ref);

  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll();
  let { modalProps } = useModal();

  // Get props for the dialog and its title
  let { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <div className="modal" {...underlayProps}>
      <FocusScope contain>
        <div
          style={{ outline: "none" }}
          className={`modal-container modal-container--${size}`}
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={ref}
        >
          {isDismissable && (
            <div className="close-button-container">
              <div {...closeButtonProps} className="close-button" />
            </div>
          )}
          <h1 className="modal-title" {...titleProps}>
            {title}
          </h1>

          <div className="modal-content">{children}</div>
        </div>
      </FocusScope>
    </div>
  );
}
