import { useEffect, useRef, useState } from "react";
import { getLiveFeedback } from "@api/feedback";
import { useAppContext } from "@context/AppContext";
import { HOST_FEEDBACK_POLL_INTERVAL_MS, UI_TEXT } from "@config";
import { BasicCard, HeaderCard } from "@components/BasicCard";
import { ContentWrapper } from "@components/Wrapper";

export function HostView({ pollIntervalMs = HOST_FEEDBACK_POLL_INTERVAL_MS }) {
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
          setError(UI_TEXT.host.loadError);
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
          {UI_TEXT.host.loading}
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
    <ContentWrapper fixedHeader>
      <HeaderCard>
        <p className="text-center text-xs uppercase tracking-wide text-base-content/60">
          {UI_TEXT.host.currentPlaylistLabel}
        </p>
        <div className="flex mt-2 text-lg">
          <div className="flex-1 text-left">
            {playlistRatings ? (
              <span className="text-success">
                {UI_TEXT.common.thumbsUp} {playlistRatings.positive}
              </span>
            ) : (
              <span className="text-success">
                {UI_TEXT.host.ratingPlaceholderPositive}
              </span>
            )}
          </div>
          <p className="text-center font-semibold">
            {currentPlaylist?.name || UI_TEXT.common.unknown}
          </p>
          <div className="flex-1 text-right">
            {playlistRatings ? (
              <span className="text-error">
                {UI_TEXT.common.thumbsDown} {playlistRatings.negative}
              </span>
            ) : (
              <span className="text-error">
                {UI_TEXT.host.ratingPlaceholderNegative}
              </span>
            )}
          </div>
        </div>
      </HeaderCard>
        {(items.length === 0) ? (
          <p className="text-sm text-base-content/70 text-center">
            {UI_TEXT.host.noReviews}
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((item) => {
              const ratingClass =
                item.rating === "positive" ? "text-success" : "text-error";
              const ratingLabel =
                item.rating === "positive"
                  ? UI_TEXT.host.ratingPositive
                  : UI_TEXT.host.ratingNegative;
              const reviewId = `review-${item.id}`;
              return (
                <BasicCard id={reviewId} key={reviewId}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold truncate">{item.email}</p>
                    <span className={`text-xs font-semibold ${ratingClass}`}>
                      {ratingLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-base-content/80">{item.text}</p>
                </BasicCard>
              );
            })}
          </div>
      )}
    </ContentWrapper>
  );
}
