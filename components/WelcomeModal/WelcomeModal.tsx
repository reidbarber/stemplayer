import Modal from "../Modal/Modal";
import SelectTracks from "./SelectTracks";

export default function WelcomeModal(props: any) {
  const { onClose } = props;

  return (
    <Modal title="Virtual Stem Player" isOpen onClose={onClose}>
      <SelectTracks onClose={onClose} />
    </Modal>
  );
}
