import { StemTracks, usePlayer } from "../Player/Player";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
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
  status: string;
  stems: StemTracks;
  stem_variants: {
    codec: string;
    splitting_source: string;
    stems: StemTracks;
  }[];
  youtube_id: string;
};

const REGEX_VALID_YOUTUBE_LINK = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;

export default function WelcomeModal(props: any) {
  const { onClose } = props;
  let { playSong } = usePlayer();
  let [isLoading, setIsLoading] = useState(false);
  let [youtubeLink, setYoutubeLink] = useState("");
  let [favorites, setFavorites] = useState<Track[]>([]);

  let isValidYoutubeLink =
    youtubeLink.length > 5 && youtubeLink.match(REGEX_VALID_YOUTUBE_LINK);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage) {
      let favoritesString = localStorage.getItem("favorites");
      if (!favoritesString) {
        setFavorites(defaultFavorites);
      } else {
        setFavorites(JSON.parse(favoritesString));
      }
    }
  }, []);

  let fetchTrack = () => {
    setIsLoading(true);
    fetch("/api/tracks", {
      method: "POST",
      body: JSON.stringify({ link: youtubeLink }),
    } as any)
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        let track: Track = data.data;
        let youtube_id = youtubeLink.match(
          /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
        );
        if (youtube_id !== null) {
          track.youtube_id = youtube_id[1];
        }

        if (track.status === "ready") {
          onClose();
          playSong(track);
        }

        // Add new track to favorites
        if (typeof window !== "undefined" && localStorage) {
          let favoritesString = localStorage.getItem("favorites") || "[]";
          let newFavorites = [track, ...JSON.parse(favoritesString)] as Track[];
          setFavorites(newFavorites);
          localStorage.setItem("favorites", JSON.stringify(newFavorites));
        }
      });
  };

  let removeFavorite = (id) => {
    if (typeof window !== "undefined" && localStorage) {
      let favoritesString = localStorage.getItem("favorites") || "[]";
      let newFavorites = (JSON.parse(favoritesString) as Track[]).filter(
        (fav) => fav.id !== id
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
      {isValidYoutubeLink && <Button onPress={() => fetchTrack()}>Play</Button>}
      <p style={{ padding: 10 }}>or select a track</p>
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
                    playSong(track);
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
              onPress={() => removeFavorite(track.id)}
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
