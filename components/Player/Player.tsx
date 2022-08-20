import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Players, start, Transport, DCMeter as Meter, Clock, Time } from "tone";
import Slider from "../Slider/Slider";
import CenterButton from "../CenterButton/CenterButton";
import SettingsModal from "../SettingsModal/SettingsModal";
import WelcomeModal, { Track } from "../WelcomeModal/WelcomeModal";
import { defaultBlue, defaultRed } from "../../utils/colors";
import { Color } from "@react-types/color";
import { useSettings } from "../../pages";

export type StemType = "vocals" | "bass" | "drums" | "other";

const STEMS: Array<StemType> = ["vocals", "bass", "drums", "other"];

export type StemTracks = {
  vocals: string;
  other: string;
  drums: string;
  bass: string;
};

type Position = "top" | "right" | "bottom" | "left";

type LightState = {
  color: Color;
  intensity: number;
};

type SliderState = [LightState, LightState, LightState, LightState];

type LightsState = {
  [k in Position]: SliderState;
};

let defaultLight: LightState = {
  color: defaultBlue,
  intensity: 0,
};

let defaultSlider: SliderState = [
  defaultLight,
  defaultLight,
  defaultLight,
  defaultLight,
];

let defaultLights: LightsState = {
  top: defaultSlider,
  right: defaultSlider,
  bottom: defaultSlider,
  left: defaultSlider,
};

interface PlayerContextType {
  isPlaying: boolean;
  isolated: StemType[];
  play: () => void;
  pause: () => void;
  toggle: () => void;
  setStemVolume: (stem: StemType, value: number) => void;
  startIsolateStem: (stem: StemType) => void;
  endIsolateStem: (stem: StemType) => void;
  playSong: (track: Track) => void;
  lights: LightsState;
  setLights: React.Dispatch<React.SetStateAction<LightsState>>;
  colors: [Color, Color];
  setColors: React.Dispatch<React.SetStateAction<[Color, Color]>>;
  startLoop: () => void;
  endLoop: () => void;
}

export const PlayerContext = createContext<PlayerContextType>({
  isPlaying: false,
  isolated: [],
  play: () => {},
  pause: () => {},
  toggle: () => {},
  setStemVolume: () => {},
  startIsolateStem: () => {},
  endIsolateStem: () => {},
  playSong: () => {},
  lights: defaultLights,
  setLights: () => {},
  colors: [defaultRed, defaultBlue],
  setColors: () => {},
  startLoop: () => {},
  endLoop: () => {},
});

export const usePlayer = () => useContext<PlayerContextType>(PlayerContext);

type PlayerProps = {
  isSettingsModalOpen: boolean;
  onCloseSettingsModal: () => void;
  closeSettingsButtonProps: any;
  isWelcomeModalOpen: boolean;
  onCloseWelcomeModal: () => void;
};

export default function Player(props: PlayerProps) {
  const {
    isSettingsModalOpen,
    onCloseSettingsModal,
    closeSettingsButtonProps,
    isWelcomeModalOpen,
    onCloseWelcomeModal,
  } = props;
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isolated, setIsolated] = useState<StemType[]>([]);
  let { dynamicLights } = useSettings();

  // TODO: Can we initialize as empty new Tone.players() instead of null?
  const stemsRef = useRef<Players | null>(null);
  const [meters] = useState<{
    vocals: Meter;
    bass: Meter;
    drums: Meter;
    other: Meter;
  }>({
    vocals: typeof window !== "undefined" && new Meter(),
    bass: typeof window !== "undefined" && new Meter(),
    drums: typeof window !== "undefined" && new Meter(),
    other: typeof window !== "undefined" && new Meter(),
  });

  let [levels, setLevels] = useState({
    vocals: 0,
    bass: 0,
    drums: 0,
    other: 0,
  });

  let clockRef = useRef(
    typeof window !== "undefined" && new Clock(() => {}, 1)
  );
  let loopClock = useRef(
    typeof window !== "undefined" && new Clock(() => {}, 1)
  );

  const getVal = (val: number[] | number): number => {
    // From https://github.com/Tonejs/ui/blob/master/src/gui/vis/meter.ts
    val = Array.isArray(val) ? val[0] : val;
    return Math.pow(val, 0.2) * 100 || 0;
  };

  useEffect(() => {
    // TODO: Reduce the delay and smooth out lights

    const updateLevels = () => {
      setLevels({
        vocals: getVal(meters.vocals.getValue()),
        bass: getVal(meters.bass.getValue()),
        drums: getVal(meters.drums.getValue()),
        other: getVal(meters.other.getValue()),
      });
    };

    updateLevels();
    const interval = setInterval(() => {
      if (isPlaying && dynamicLights) {
        updateLevels();
      }
    }, 200);
    return () => clearInterval(interval);
  }, [
    dynamicLights,
    isPlaying,
    meters.bass,
    meters.drums,
    meters.other,
    meters.vocals,
  ]);

  const setupAudio = useCallback(
    async (track: Track) => {
      // Clear current player if one exists
      stemsRef.current?.dispose();

      await start();

      stemsRef.current = new Players({
        urls: {
          vocals: track.stems.vocals,
          bass: track.stems.bass,
          drums: track.stems.drums,
          other: track.stems.other,
        },
        onload: () => {
          STEMS.forEach((stem) => {
            stemsRef.current
              ?.player(stem)
              .sync()
              .connect(meters[stem])
              .start(0);
          });

          if (track.metadata.bpm) {
            Transport.bpm.value = track.metadata.bpm;
          }

          // TODO: reset Transport to beginning if already started
          Transport.start();
          clockRef.current.start();
          setIsInitialized(true);
          setIsPlaying(true);
        },
      }).toDestination();
    },
    [meters]
  );

  /**
   * Resume audio
   */
  let play = () => {
    Transport.start();
    clockRef.current?.start();
    setIsPlaying(true);
  };

  /**
   * Pause audio
   */
  let pause = useCallback(() => {
    if (isInitialized) {
      Transport.pause();
      clockRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isInitialized]);

  /**
   * Play if paused. Pause if playing.
   */
  let toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  /**
   * Set volume of a specific stem
   *
   * @param stem specific stem you want to set the volume for
   * @param volume desired volume (decimal value between 0 and 100)
   */
  let setStemVolume = useCallback(
    (stem: StemType, volume: number) => {
      // Estimate of discrete linear steps to logarithmic decibal values
      // https://www.dr-lex.be/info-stuff/volumecontrols.html#dB
      if (volume === 100) {
        volume = 0;
      } else if (volume > 66) {
        volume = -5;
      } else if (volume > 33) {
        volume = -12;
      } else {
        volume = Number.NEGATIVE_INFINITY;
      }

      if (stemsRef.current && isInitialized) {
        stemsRef.current.player(stem).volume.value = volume;
      }
    },
    [isInitialized]
  );

  /**
   * Isolate a specific stem (mute non-isolated stems).
   */
  let startIsolateStem = useCallback(
    (stem: StemType) => {
      let nextIsolated: StemType[] = [];
      setIsolated((prevIsolated) => {
        nextIsolated = [...prevIsolated, stem];
        return nextIsolated;
      });

      STEMS.forEach((s) => {
        // Set 0 volume for all non-isolated stems
        if (!nextIsolated.includes(s)) {
          setStemVolume(s, 0);
        } else {
          setStemVolume(s, 100);
        }
      });
    },
    [setStemVolume]
  );

  /**
   * End isolation of a stem.
   */
  let endIsolateStem = useCallback(
    (stem: StemType) => {
      let nextIsolated: StemType[] = [];
      setIsolated((prevIsolated) => {
        nextIsolated = prevIsolated.filter((toRemove) => toRemove !== stem);
        return nextIsolated;
      });

      // Restore volume for all stems, unless something is still isolated.
      // In that case, just mute stem who's isolation is being ended.
      if (nextIsolated.length > 0) {
        setStemVolume(stem, 0);
      } else {
        STEMS.forEach((s) => {
          setStemVolume(s, 100);
        });
      }
    },
    [setStemVolume]
  );

  /**
   * Play song or change song currently being played
   */
  let playSong = useCallback(
    (track: Track) => {
      setupAudio(track);
    },
    [setupAudio]
  );

  /**
   * Start loop from current position
   */
  let startLoop = useCallback(() => {
    // using clockRef because transport clock wasn't pausing for some reason.
    let startTime = clockRef.current.seconds - Time("1:0").toSeconds();
    let endTime = startTime + Time("1:0").toSeconds();
    clockRef.current.pause().seconds = startTime;
    loopClock.current.start();

    STEMS.forEach((stem) => {
      if (stemsRef.current) {
        Transport.setLoopPoints(startTime, endTime).loop = true;
        stemsRef.current.player(stem).setLoopPoints(startTime, endTime).loop =
          true;
      }
    });
  }, []);

  /**
   * End loop
   */
  let endLoop = useCallback(() => {
    // Get hold duration. Divide by 2.5.
    // Remainder is how long into the loop they are when released.
    // Add that offset to the new time, so that clock is in sync.
    let loopHoldDuration = loopClock.current.seconds;
    loopClock.current.pause().seconds = 0;
    let endOffset = loopHoldDuration % Time("1:0").toSeconds();
    let newTime = clockRef.current.seconds + endOffset;
    clockRef.current.start().seconds = newTime;
    STEMS.forEach((stem) => {
      if (stemsRef.current) {
        Transport.loop = false;
        stemsRef.current.player(stem).loop = false;
      }
      // TODO: Resume where we were
    });
  }, []);

  let [lights, setLights] = useState(defaultLights);
  let [colors, setColors] = useState<[Color, Color]>([defaultRed, defaultBlue]);

  const contextValue = {
    isPlaying,
    isolated,
    play,
    pause,
    toggle,
    setStemVolume,
    startIsolateStem,
    endIsolateStem,
    playSong,
    lights,
    setLights,
    colors,
    setColors,
    startLoop,
    endLoop,
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      <div className="player">
        <div className="top">
          <Slider variant="top" stem="vocals" level={levels.vocals} />
        </div>
        <div className="center">
          <Slider variant="left" stem="bass" level={levels.bass} />
          <CenterButton />
          <Slider variant="right" stem="other" level={levels.other} />
        </div>
        <div className="bottom">
          <Slider variant="bottom" stem="drums" level={levels.drums} />
        </div>
      </div>
      {isSettingsModalOpen && (
        <SettingsModal
          onClose={onCloseSettingsModal}
          closeButtonProps={closeSettingsButtonProps}
        />
      )}
      {isWelcomeModalOpen && <WelcomeModal onClose={onCloseWelcomeModal} />}
    </PlayerContext.Provider>
  );
}
