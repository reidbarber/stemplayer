import { StemTracks, usePlayer } from "../Player/Player";
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import Image from "next/image";
import playIcon from "../StemifySearch/playIcon.svg";

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

const REGEX_VALID_YOUTUBE_LINK =
  /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/;

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
      let favoritesString = localStorage.getItem("favorites") || "[]";
      setFavorites(JSON.parse(favoritesString));
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

        onClose();
        playSong(track);

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

  return (
    <Modal title="Select a Track" isOpen onClose={onClose}>
      {isLoading && (
        <div className="loading-container">
          <Loader />
        </div>
      )}
      <ol className="track-list">
        {favorites.map((track) => (
          <li className="track-item" key={track.id}>
            <div className="track-artwork">
              <Image
                src={`https://img.youtube.com/vi/${track.youtube_id}/hqdefault.jpg`}
                alt={`Artwork for ${track.metadata.title}`}
                width={64}
                height={36}
                objectFit="cover"
              />
            </div>
            <div className="track-info">
              <div className="track-title">{track.metadata.title}</div>
              <div className="track-artist-album">
                <span className="track-artist">{track.metadata.artist}</span>
                {track.metadata.album && (
                  <>
                    <span> • </span>
                    <span className="track-album">{track.metadata.album}</span>
                  </>
                )}
              </div>
            </div>
            <div className="play">
              {track.status === "ready" ? (
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
              ) : (
                <>
                  Coming <br />
                  Soon
                </>
              )}
            </div>
            <Button
              variant="secondary"
              onPress={() => removeFavorite(track.id)}
            >
              x
            </Button>
          </li>
        ))}
      </ol>
      <p>or paste a youtube link</p>
      <input
        placeholder="https://www.youtube.com/watch?v="
        aria-label="Youtube link"
        id="link-field"
        onChange={(e) => setYoutubeLink(e.target.value)}
        value={youtubeLink}
      />
      {isValidYoutubeLink && <Button onPress={() => fetchTrack()}>Play</Button>}
    </Modal>
  );
}
