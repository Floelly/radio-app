import { useEffect, useRef, useState } from "react";
import { BACKEND_BASE_URL, getCurrentTrack } from "../api/auth";

export function HomeView() {
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const initialLoadRef = useRef(true);

  useEffect(() => {
    let isCancelled = false;

    async function loadTrack() {
      const isInitialLoad = initialLoadRef.current;
      try {
        if (isInitialLoad) {
          setLoading(true);
          setError(null);
        }
        const data = await getCurrentTrack();
        if (!isCancelled && data) setTrack(data);
      } catch (err) {
        if (!isCancelled) {
          setError("Aktueller Titel konnte nicht geladen werden.");
          console.error(err);
        }
      } finally {
        if (!isCancelled && isInitialLoad) {
          setLoading(false);
          initialLoadRef.current = false;
        }
      }
    }

    loadTrack();
    const interval = setInterval(loadTrack, 10_000);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, []);

  if (loading) {
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
    : null;

  return (
    <div className="flex flex-col items-center pt-6 pb-8">
      <div className="w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-2xl bg-base-300 mb-6">
        {coverSrc ? (
          <img
            src={coverSrc}
            alt={`${track.title} Cover`}
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
    </div>
  );
}
