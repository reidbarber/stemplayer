import { StemTracks, usePlayer } from "../Player/Player";
import Button from "../Button/Button";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Image from "next/image";
import playIcon from "./playIcon.svg";
import removeIcon from "./removeIcon.svg";
import TextField from "../TextField/TextField";
import { defaultFavorites } from "./defaultFavorites";

export type Track = {
  id: string;
  metadata: {
    album: string | null;
    title: string;
    artist: string;
    bpm: number;
    duration: number;
  };
  status: "ready" | "pending";
  stems: StemTracks;
  stem_variants: {
    codec: string;
    splitting_source: string;
    stems: StemTracks;
  }[];
  youtube_id: string;
};

const YOUTUBE_LINK_PREFIX = "https://www.youtube.com/watch?v=";
const REGEX_VALID_YOUTUBE_LINK = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;
const REGEX_YOUTUBE_ID = /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/;

export default function WelcomeModal(props: any) {
  const { onClose } = props;
  let { playTrack } = usePlayer();
  let [isLoading, setIsLoading] = useState(false);
  let [youtubeLink, setYoutubeLink] = useState("");
  let [favorites, setFavorites] = useState<Track[]>([]);

  let isValidYoutubeLink =
    youtubeLink.length > 5 && youtubeLink.match(REGEX_VALID_YOUTUBE_LINK);

  let checkForReadyTracks = () => {
    let notReadyTracks = favorites.filter(
      (track) => track.status === "pending"
    );
    notReadyTracks.forEach(async (track) => {
      let updatedTrack = await fetchTrack(
        `${YOUTUBE_LINK_PREFIX}${track.youtube_id}`
      );
      if (updatedTrack.status === "ready") {
        updatedTrack.youtube_id = track.youtube_id;
        addToFavorites(updatedTrack);
      }
    });
  };

  // If a track isn't ready status, recheck it
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage) {
      let favoritesString = localStorage.getItem("favorites");
      if (!favoritesString) {
        setFavorites(defaultFavorites);
        addToFavorites(...defaultFavorites);
      } else {
        setFavorites(JSON.parse(favoritesString));
        checkForReadyTracks();
      }
    }
  }, []);

  let fetchTrack: (link: string) => Promise<Track> = async (link: string) => {
    let track: Track;
    await fetch("/api/tracks", {
      method: "POST",
      body: JSON.stringify({ link }),
    } as any)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        track = data.data;
        let youtube_id = youtubeLink.match(REGEX_YOUTUBE_ID);
        if (youtube_id !== null) {
          track.youtube_id = youtube_id[1];
        }
      });
    return track;
  };

  let addToFavorites = (...tracks: Track[]) => {
    if (typeof window !== "undefined" && localStorage) {
      let newFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      ) as Track[];
      newFavorites = newFavorites.filter(
        (favorite) => tracks.findIndex((track) => track.id === favorite.id) < 0
      );
      newFavorites = [...tracks, ...newFavorites];
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  let playYoutubeLink = async () => {
    setIsLoading(true);
    let track = await fetchTrack(youtubeLink);
    if (track.status === "ready") {
      playTrack(track);
      onClose();
    }
    addToFavorites(track);
  };

  let removeTrackFromFavorites = (track: Track) => {
    if (typeof window !== "undefined" && localStorage) {
      let favoritesString = localStorage.getItem("favorites") || "[]";
      let newFavorites = (JSON.parse(favoritesString) as Track[]).filter(
        (favorite) => favorite.id !== track.id
      );
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <TextField
        placeholder="https://www.youtube.com/watch?v="
        label="Paste a youtube link"
        id="link-field"
        onChange={setYoutubeLink}
        value={youtubeLink}
      />
      {isValidYoutubeLink && (
        <Button onPress={() => playYoutubeLink()}>Play</Button>
      )}
      {favorites.length > 0 && <p style={{ padding: 10 }}>or select a track</p>}
      <ol className="track-list">
        {favorites.map((track) => (
          <li className="track-item" key={track.id}>
            <div className="track-artwork">
              <Image
                src={`https://img.youtube.com/vi/${track.youtube_id}/hqdefault.jpg`}
                alt={`Artwork for ${track.metadata?.title || "album"}`}
                width={64}
                height={36}
                objectFit="cover"
              />
            </div>
            <div className="track-info">
              <div className="track-title">
                {track.metadata?.title || "Currently splitting..."}
              </div>
              <div className="track-artist-album">
                <span className="track-artist">
                  {track.metadata?.artist || "Come back soon"}
                </span>
                {track.metadata?.album && (
                  <>
                    <span> • </span>
                    <span className="track-album">
                      {track.metadata?.album || "album"}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="play">
              {track.status === "ready" && (
                <Button
                  aria-label={`Play ${track.metadata.title}`}
                  key={track.id}
                  onPress={() => {
                    playTrack(track);
                    onClose();
                  }}
                  UNSAFE_className="playButton"
                  variant="circle"
                >
                  <Image src={playIcon} alt="Play" height={15} width={15} />
                </Button>
              )}
            </div>
            <Button
              variant="secondary"
              onPress={() => removeTrackFromFavorites(track)}
              UNSAFE_className="removeButton"
            >
              <Image src={removeIcon} alt="Remove" height={15} width={15} />
            </Button>
          </li>
        ))}
      </ol>
    </>
  );
}
