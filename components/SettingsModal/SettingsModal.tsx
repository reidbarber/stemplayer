import { Color } from "@react-types/color";
import { Item } from "react-stately";
import { useSettings } from "../../pages";
import Button from "../Button/Button";
import ColorWheel from "../ColorWheel/ColorWheel";
import Modal from "../Modal/Modal";
import { usePlayer } from "../Player/Player";
import { Tabs } from "../Tabs/Tabs";
import SelectTracks from "../WelcomeModal/SelectTracks";

export default function SettingsModal(props: any) {
  let { onClose, closeButtonProps } = props;

  let { colors, setColors } = usePlayer();
  let { theme, toggleTheme, dynamicLights, toggleDynamicLights } =
    useSettings();

  let onChangeColor1 = (val: Color) => setColors((prev) => [val, prev[1]]);
  let onChangeColor2 = (val: Color) => setColors((prev) => [prev[0], val]);

  return (
    <Modal
      title="Options"
      isOpen
      onClose={onClose}
      isDismissable
      closeButtonProps={closeButtonProps}
    >
      <Tabs aria-label="History of Ancient Rome">
        <Item key="tracks" title="Tracks">
          <SelectTracks onClose={onClose} />
        </Item>
        <Item key="settings" title="Settings">
          <Button onPress={() => window.location.reload()}>
            Restart Player
          </Button>
          <Button onPress={() => toggleTheme()}>
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </Button>
          <Button onPress={() => toggleDynamicLights()}>
            {dynamicLights ? "Disable" : "Enable"} Dynamic Lights
          </Button>
          <p>Dynamic lights may cause audio performance issues.</p>
          <div style={{ marginBottom: 30 }}>
            <div style={{ margin: 10 }}>Color 1 (Inside)</div>
            <ColorWheel
              value={colors[0].toString("hsl")}
              onChange={onChangeColor1}
              showPreview
            />
          </div>
          <div>
            <div style={{ margin: 10 }}>Color 2 (Outside)</div>
            <ColorWheel
              value={colors[1].toString("hsl")}
              onChange={onChangeColor2}
              showPreview
            />
            <p>More Coming Soon.</p>
            <p>Not affiliated with YEEZY Tech or Kano.</p>
            <p>Add to your home screen for an app-like experience.</p>
          </div>
        </Item>
      </Tabs>
    </Modal>
  );
}
