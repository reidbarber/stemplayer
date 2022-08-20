import { useButton, OverlayProvider, usePreventScroll } from "react-aria";
import { useOverlayTriggerState } from "react-stately";
import { createContext, useContext, useRef, useState, useEffect } from "react";
import Player from "../components/Player/Player";
import SettingsButton from "../components/SettingsButton/SettingsButton";

type Theme = "light" | "dark";

type SettingsContextType = {
  theme: Theme;
  toggleTheme: () => void;
  dynamicLights: boolean;
  toggleDynamicLights: () => void;
};

export const SettingsContext = createContext<SettingsContextType>({
  theme: "light",
  toggleTheme: () => {},
  dynamicLights: true,
  toggleDynamicLights: () => {},
});

export const useSettings = () =>
  useContext<SettingsContextType>(SettingsContext);

export default function Home() {
  let [theme, setTheme] = useState<Theme>("light");
  let [dynamicLights, setDynamicLights] = useState<boolean>(JSON.parse("true"));
  let settingsState = useOverlayTriggerState({});
  let settingsOpenButtonRef = useRef(null);
  let settingsCloseButtonRef = useRef(null);

  let welcomeState = useOverlayTriggerState({ defaultOpen: true });

  let { buttonProps: openButtonProps } = useButton(
    {
      onPress: () => settingsState.open(),
    },
    settingsOpenButtonRef
  );

  let { buttonProps: settingsCloseButtonProps } = useButton(
    {
      onPress: () => settingsState.close(),
    },
    settingsCloseButtonRef
  );

  const toggleTheme = () => {
    let newTheme = theme === "dark" ? "light" : ("dark" as Theme);
    setTheme(newTheme);
    if (typeof window !== "undefined" && localStorage) {
      localStorage.setItem("theme", newTheme);
    }
  };

  const toggleDynamicLights = () => {
    let newSetting = !dynamicLights;
    setDynamicLights(newSetting);
    if (typeof window !== "undefined" && localStorage) {
      localStorage.setItem("dynamicLights", newSetting.toString());
    }
  };

  // Don't allow scrolling on document body. Better UX for touch.
  usePreventScroll();

  return (
    <SettingsContext.Provider
      value={{ theme, toggleTheme, dynamicLights, toggleDynamicLights }}
    >
      <OverlayProvider>
        <div className="App" data-theme={theme}>
          <SettingsButton {...openButtonProps} ref={settingsOpenButtonRef} />
          <Player
            isSettingsModalOpen={settingsState.isOpen}
            onCloseSettingsModal={settingsState.close}
            closeSettingsButtonProps={settingsCloseButtonProps}
            isWelcomeModalOpen={welcomeState.isOpen}
            onCloseWelcomeModal={welcomeState.close}
          />
        </div>
      </OverlayProvider>
    </SettingsContext.Provider>
  );
}
