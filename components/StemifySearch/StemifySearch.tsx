import { usePlayer } from "../Player/Player";
import Button from "../Button/Button";
import { useEffect, useState } from "react";
import { parseColor } from "@react-stately/color";
import SearchField from "../SearchField/SearchField";
import playIcon from "./playIcon.svg";
import Loader from "../Loader/Loader";

export type Tempo = {
  tempo_bpm: number;
  time_ms?: number;
};

export type Track = {
  id: string;
  metadata: {
    color: string[];
    title: string;
    tempos: Tempo[];
  };
};

export type StemifyTrack = {
  _id: string;
  timeSubmitted: number;
  songSlug: string;
  title: string;
  colors: [string, string];
  metadata: {
    trackId: string;
    trackNum: number;
    albumId: string;
    albumTitle: string;
    albumArt: string;
    albumName: string;
    artist: string;
    artistId: string;
    previewUrl: string;
  };
  bpm: number;
  vocals: string;
  bass: string;
  drums: string;
  other: string;
  extension: string;
  complete: boolean;
  ticketId: string;
};

export type StemifyResponse = StemifyTrack[];

export default function StemifySearch(props: any) {
  const { onClose } = props;
  let { setColors, playStemifySong } = usePlayer();
  let [searchValue, setSearchValue] = useState("");
  let [noResults, setNoResults] = useState(false);
  let [isLoading, setIsLoading] = useState(true);
  let [stemifyTracks, setStemifyTracks] = useState<StemifyTrack[]>([]);

  let selectStemifySong = (track: StemifyTrack) => {
    onClose();
    setColors([
      parseColor(track.colors[0]).toFormat("hsl"),
      parseColor(track.colors[1]).toFormat("hsl"),
    ]);
    playStemifySong(track);
  };

  let fetchResults = (query: string) => {
    setStemifyTracks([]);
    setIsLoading(true);
    fetch("https://api.stemify.io/songs/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((response) => response.json())
      .then((data: StemifyResponse) => {
        setIsLoading(false);
        setStemifyTracks(data);
        if (data.length === 0) {
          setNoResults(true);
        } else {
          setNoResults(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
        alert("There was an error loading stems.");
        // window.location.reload();
      });
  };

  useEffect(() => {
    let params = new URLSearchParams(document.location.search);
    let stemifySearch = params.get("stemifySearch");
    if (stemifySearch) {
      setSearchValue(stemifySearch);
      fetchResults(stemifySearch);
      return;
    }

    fetch("https://api.stemify.io/songs", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data: StemifyResponse) => {
        setIsLoading(false);
        setStemifyTracks(data);
      })
      .catch(() => {
        setIsLoading(false);
        alert("There was an error loading stems.");
        // window.location.reload();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="stemify-search-container">
      <div className="stemify-search-input-container">
        <SearchField
          aria-label="Search for songs"
          onChange={setSearchValue}
          value={searchValue}
          onSubmit={(val) => fetchResults(val)}
          placeholder="SEARCH STEMIFY"
        />
      </div>
      {isLoading && (
        <div className="loading-container">
          <Loader />
        </div>
      )}
      {noResults && (
        <div className="no-results">
          <p>No results for this search. </p>
        </div>
      )}
      <ol className="track-list">
        {stemifyTracks.map((track) => (
          <li className="track-item" key={track._id}>
            <div className="track-artwork">
              <img
                src={track.metadata.albumArt}
                alt={`Artwork for ${track.title}`}
              />
            </div>
            <div className="track-info">
              <div className="track-title">{track.title}</div>
              <div className="track-artist-album">
                <span className="track-artist">{track.metadata.artist}</span>
                {track.metadata.albumName && (
                  <>
                    <span> • </span>
                    <span className="track-album">
                      {track.metadata.albumName}
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="play">
              {track.complete ? (
                <Button
                  aria-label={`Play ${track.title}`}
                  key={track._id}
                  onPress={() => selectStemifySong(track)}
                  UNSAFE_className="playButton"
                  variant="circle"
                >
                  <img src={playIcon} alt="Play" height={15} width={15} />
                </Button>
              ) : (
                <>
                  Coming <br />
                  Soon
                </>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className="request">
        <p>
          Click{" "}
          <a href="https://stemify.io" target="_blank" rel="noreferrer">
            here
          </a>{" "}
          to request a song to be added to Stemify.
        </p>
      </div>
    </div>
  );
}
