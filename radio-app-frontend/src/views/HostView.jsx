import { useEffect, useRef, useState } from "react";
import { getLiveFeedback } from "@api/feedback";
import { useAppContext } from "@context/AppContext";

export function HostView({ pollIntervalMs = 5000 }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [playlistRatings, setPlaylistRatings] = useState(null);
  const lastTimestampRef = useRef(0);
  const seenKeysRef = useRef(new Set());
  const { loginToken, goToLogin, isLoggedIn } = useAppContext();

  useEffect(() => {
    if (!isLoggedIn) {
      goToLogin("feedback");
      return;
    }
  }, [goToLogin, isLoggedIn]);

  useEffect(() => {
    let isCancelled = false;
    lastTimestampRef.current = 0;
    seenKeysRef.current = new Set();
    setItems([]);
    setCurrentPlaylist(null);
    setPlaylistRatings(null);
    setIsLoading(true);

    const loadLive = async () => {
      try {
        setError(null);
        const data = await getLiveFeedback({
          since: lastTimestampRef.current,
          token: loginToken,
        });
        if (isCancelled || !data || typeof data !== "object") return;
        if (data.playlist && typeof data.playlist === "object") {
          setCurrentPlaylist(data.playlist);
        }
        if (
          typeof data.ratings?.positive === "number" &&
          typeof data.ratings?.negative === "number"
        ) {
          setPlaylistRatings({
            positive: data.ratings.positive,
            negative: data.ratings.negative,
          });
        }
        let nextMaxTimestamp = lastTimestampRef.current;
        if (typeof data.updatedAt === "number") {
          nextMaxTimestamp = Math.max(nextMaxTimestamp, data.updatedAt);
        }
        if (Array.isArray(data.reviews) && data.reviews.length > 0) {
          const newItems = [];
          for (const item of data.reviews) {
            if (typeof item?.timestamp === "number") {
              nextMaxTimestamp = Math.max(nextMaxTimestamp, item.timestamp);
            }
            const key = `review-${item?.id ?? "unknown"}`;
            if (!seenKeysRef.current.has(key)) {
              seenKeysRef.current.add(key);
              newItems.push(item);
            }
          }
          lastTimestampRef.current = nextMaxTimestamp;
          if (newItems.length > 0) {
            setItems((prev) => {
              const merged = [...prev, ...newItems];
              merged.sort((a, b) => b.timestamp - a.timestamp);
              return merged;
            });
          }
        }
        lastTimestampRef.current = nextMaxTimestamp;
      } catch (err) {
        if (!isCancelled) {
          setError("Live-Updates konnten nicht geladen werden.");
          console.error(err);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    };

    loadLive();
    const interval = setInterval(loadLive, pollIntervalMs);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [loginToken, pollIntervalMs]);

  if (isLoading && items.length === 0 && !error && !currentPlaylist) {
    return (
      <div className="flex items-center justify-center py-8">
        <span className="loading loading-spinner loading-md text-primary" />
        <p className="ml-4 text-sm text-base-content/70">
          Lade Live-Updates...
        </p>
      </div>
    );
  }

  if (error && items.length === 0 && !currentPlaylist) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4 overflow-hidden pt-4 pb-8">
      <div className="mb-4 rounded-2xl bg-base-300/80 p-4 shadow">
        <p className="text-center text-xs uppercase tracking-wide text-base-content/60">
          Aktuelle Playlist
        </p>
        <div className="relative mt-2">
          <div className="absolute left-1/10 top-1/2 -translate-y-1/2 text-lg">
            {playlistRatings ? (
              <span className="text-success">
                👍 {playlistRatings.positive}
              </span>
            ) : (
              <span className="text-success">👍 -</span>
            )}
          </div>
          <p className="text-center text-lg font-semibold">
            {currentPlaylist?.name || "Unbekannt"}
          </p>
          <div className="absolute right-1/10 top-1/2 -translate-y-1/2 text-lg">
            {playlistRatings ? (
              <span className="text-error">👎 {playlistRatings.negative}</span>
            ) : (
              <span className="text-error">👎 -</span>
            )}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-1 items-center justify-center py-4">
          <p className="text-sm text-base-content/70">Noch keine Reviews.</p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto">
          {items.map((item) => {
            const ratingClass =
              item.rating === "positive" ? "text-success" : "text-error";
            const ratingLabel =
              item.rating === "positive" ? "Positiv" : "Negativ";
            const reviewId = `review-${item.id}`;
            return (
              <div
                className="rounded-2xl bg-base-200 px-4 py-3 shadow"
                id={reviewId}
                key={reviewId}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold truncate">{item.email}</p>
                  <span className={`text-xs font-semibold ${ratingClass}`}>
                    {ratingLabel}
                  </span>
                </div>
                <p className="mt-2 text-sm text-base-content/80">{item.text}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
