import Modal from "../Modal/Modal";
import SelectTracks from "./SelectTracks";

export default function WelcomeModal(props: any) {
  const { onClose } = props;

  return (
    <Modal title="Select a Track" isOpen onClose={onClose}>
     <SelectTracks onClose={onClose} />
    </Modal>
  );
}
