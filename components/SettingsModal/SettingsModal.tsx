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

  let clearTracks = () => {
    if (typeof window !== "undefined" && localStorage) {
      localStorage.removeItem("favorites");
    }
  };

  return (
    <Modal
      title="Options"
      isOpen
      onClose={onClose}
      isDismissable
      closeButtonProps={closeButtonProps}
      size="large"
    >
      <Tabs aria-label="History of Ancient Rome">
        <Item key="tracks" title="Tracks">
          <div style={{ maxWidth: 400, margin: "auto" }}>
            <SelectTracks onClose={onClose} />
          </div>
        </Item>
        <Item key="colors" title="Colors">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ margin: 10 }}>
              <div style={{ margin: 10 }}>Color 1 (Inside)</div>
              <ColorWheel
                value={colors[0].toString("hsl")}
                onChange={onChangeColor1}
                showPreview
              />
            </div>
            <div style={{ margin: 10 }}>
              <div style={{ margin: 10 }}>Color 2 (Outside)</div>
              <ColorWheel
                value={colors[1].toString("hsl")}
                onChange={onChangeColor2}
                showPreview
              />
            </div>
          </div>
        </Item>
        <Item key="controls" title="Settings">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              maxWidth: 300,
              margin: "auto",
            }}
          >
            <Button onPress={() => window.location.reload()}>
              Restart Player
            </Button>
            <Button onPress={() => toggleTheme()}>
              Switch to {theme === "dark" ? "light" : "dark"} mode
            </Button>
            <Button onPress={() => toggleDynamicLights()}>
              {dynamicLights ? "Disable" : "Enable"} Dynamic Lights
            </Button>
            <Button onPress={() => clearTracks()}>Clear Tracks</Button>
            <p>Dynamic lights may cause audio performance issues.</p>
          </div>
        </Item>
        <Item key="about" title="about">
          <div>
            <p>More Coming Soon.</p>
            <p>Not affiliated with YEEZY Tech or Kano.</p>
            <p>Add to your home screen for an app-like experience.</p>
          </div>
        </Item>
      </Tabs>
    </Modal>
  );
}
