import { useEffect, useRef, useState } from "react";
import { getLive } from "../api/auth";

export function HostView({ loginToken, pollIntervalMs = 5000 }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastTimestampRef = useRef(0);
  const seenKeysRef = useRef(new Set());

  useEffect(() => {
    if (!loginToken) return;
    let isCancelled = false;
    lastTimestampRef.current = 0;
    seenKeysRef.current = new Set();
    setItems([]);
    setIsLoading(true);

    const loadLive = async () => {
      try {
        setError(null);
        const data = await getLive({
          since: lastTimestampRef.current,
          token: loginToken,
        });
        if (!isCancelled && Array.isArray(data) && data.length > 0) {
          let nextMaxTimestamp = lastTimestampRef.current;
          const newItems = [];
          for (const item of data) {
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

  if (isLoading && items.length === 0 && !error) {
    return (
      <div className="flex flex-col items-center justify-center pt-6 pb-8">
        <span className="loading loading-spinner loading-md text-primary" />
        <p className="mt-4 text-sm text-base-content/70">
          Lade Live-Updates...
        </p>
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-6 pb-8">
        <p className="text-sm text-error">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-6 pb-8">
        <p className="text-sm text-base-content/70">Noch keine Live-Updates.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 pt-4 pb-8">
      {items.map((item, index) => {
        const ratingClass =
          item.rating === "positive" ? "text-success" : "text-error";
        const ratingLabel = item.rating === "positive" ? "Positiv" : "Negativ";
        return (
          <div
            key={`review-${item.id ?? item.timestamp}-${index}`}
            className="rounded-2xl bg-base-200 px-4 py-3 shadow"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold truncate">{item.email}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${ratingClass}`}>
                  {ratingLabel}
                </span>
              </div>
            </div>
            <p className="mt-2 text-sm text-base-content/80">{item.text}</p>
          </div>
        );
      })}
    </div>
  );
}
