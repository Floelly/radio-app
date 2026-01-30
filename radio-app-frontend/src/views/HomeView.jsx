import { useEffect, useState } from "react";
import { BACKEND_BASE_URL, getCurrentHost, getCurrentTrack } from "../api/auth";

const fallbackCoverUrl = "src/assets/fallback-cover.png";

export function HomeView() {
  const [track, setTrack] = useState(null);
  const [host, setHost] = useState(null);
  const [error, setError] = useState(null);
  const [isHostCardOpen, setIsHostCardOpen] = useState(false);
  const [hostRating, setHostRating] = useState(null);

  useEffect(() => {
    let isCancelled = false;

    async function loadHost() {
      try {
        const data = await getCurrentHost();
        if (!isCancelled) setHost(data);
      } catch (err) {
        if (!isCancelled) {
          console.error(err);
          setHost(null);
        }
      }
    }

    async function loadTrack() {
      try {
        setError(null);
        const data = await getCurrentTrack();
        if (!isCancelled) setTrack(data);
      } catch (err) {
        if (!isCancelled) {
          setError("Aktueller Titel konnte nicht geladen werden.");
          console.error(err);
          setTrack(null);
        }
      }
    }

    loadHost();
    loadTrack();
    const hostInterval = setInterval(loadHost, 30_000);
    const interval = setInterval(loadTrack, 10_000);

    return () => {
      isCancelled = true;
      clearInterval(hostInterval);
      clearInterval(interval);
    };
  }, []);

  if (!track && !error) {
    return (
      <div className="flex flex-col items-center justify-center pt-6 pb-8">
        <span className="loading loading-spinner loading-md text-primary" />
        <p className="mt-4 text-sm text-base-content/70">
          Lade aktuellen Titel...
        </p>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="flex flex-col items-center justify-center pt-6 pb-8">
        <p className="text-sm text-error">
          {error ?? "Kein aktueller Titel verfügbar."}
        </p>
      </div>
    );
  }

  const yearText = track.year ? ` (${track.year})` : "";
  const commentText = track.comment ? `· Playlist: ${track.comment}` : "";
  const coverSrc = track.coverUrl
    ? new URL(track.coverUrl, BACKEND_BASE_URL).toString()
    : fallbackCoverUrl;
  const hostImageSrc =
    host?.imageUrl && host.imageUrl.length > 0
      ? new URL(host.imageUrl, BACKEND_BASE_URL).toString()
      : null;

  return (
    <div className="relative flex flex-col items-center pt-6 pb-8 min-h-full">
      <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl bg-base-300 mb-6">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={`${track.title} Cover`}
            onError={(e) => {
              if (e.currentTarget.src.endsWith(fallbackCoverUrl)) return;
              e.currentTarget.src = fallbackCoverUrl;
            }}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-base-content/60">
            Kein Cover
          </div>
        )}
      </div>

      <div className="w-full max-w-sm text-center space-y-1 mb-6">
        <h2 className="text-xl font-semibold truncate">{track.title}</h2>
        <p className="text-sm text-base-content/80 truncate">
          {track.artist} · {track.album}
          {yearText}
        </p>
        <p className="text-xs text-base-content/60 truncate">
          {commentText || "Live im Radio"}
        </p>
      </div>

      {host && (
        <button
          type="button"
          onClick={() => setIsHostCardOpen(true)}
          className="absolute left-2 bottom-4 flex items-center gap-3 rounded-full bg-base-300/95 px-5 py-3 shadow-lg border border-base-300"
        >
          <div className="h-12 w-12 rounded-full overflow-hidden bg-base-300">
            {hostImageSrc ? (
              <img
                src={hostImageSrc}
                alt={`${host.name} Portrait`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full" />
            )}
          </div>
          <div className="flex flex-col items-center leading-tight">
            <span className="badge badge-success badge-sm uppercase tracking-wide">
              Live-Moderator
            </span>
            <span className="text-lg font-semibold truncate max-w-[12rem]">
              {host.name}
            </span>
          </div>
        </button>
      )}

      {isHostCardOpen && (
        <div
          onClick={() => setIsHostCardOpen(false)}
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm min-h-[18rem] rounded-2xl bg-base-100 shadow-xl px-6 pt-6 pb-10 flex flex-col"
          >
            <div className="mx-auto h-32 w-32 rounded-full overflow-hidden bg-base-200">
              {hostImageSrc ? (
                <img
                  src={hostImageSrc}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full" />
              )}
            </div>
            <div className="mt-6 w-full flex flex-col items-center">
              <p className="text-sm text-base-content/70 mb-3">
                Wie gefällt dir der Moderator?
                <br />
                Schreib ihm doch ne Nachricht.
              </p>
              <textarea
                rows={3}
                placeholder="Bewertung..."
                className="w-full min-h-[7rem] textarea textarea-bordered resize-none text-base"
              />
            </div>
            <div className="mt-4 w-full flex flex-col items-center">
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`btn btn-circle text-xl ${
                    hostRating === "up"
                      ? "bg-success text-white border-success"
                      : "bg-white text-base-content border-black hover:bg-white"
                  }`}
                  onClick={() => setHostRating("up")}
                >
                  👍
                </button>
                <button
                  type="button"
                  className={`btn btn-circle text-xl ${
                    hostRating === "down"
                      ? "bg-error text-white border-error"
                      : "bg-white text-base-content border-black hover:bg-white"
                  }`}
                  onClick={() => setHostRating("down")}
                >
                  👎
                </button>
              </div>
            </div>
            <button
              type="button"
              className="mt-6 btn btn-primary btn-lg w-full self-center rounded-full"
            >
              Bewerten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
