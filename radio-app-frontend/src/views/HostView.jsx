import { useEffect, useRef, useState } from "react";
import { getLiveFeedback } from "@api/feedback";
import { useAppContext } from "@context/AppContext";
import { HOST_FEEDBACK_POLL_INTERVAL_MS, UI_TEXT } from "@config";
import { HeaderCard, HeaderTagTextCard } from "@components/BasicCard";
import { ContentWrapper, FlexCol, FlexRow } from "@components/Wrapper";
import { Headline2, Headline3, HeaderInfo } from "@components/TextElements";
import { LoadingFail, LoadingSpinner } from "@components/LoadingSpinner";

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

        extractPlaylistAndRatings(data, setCurrentPlaylist, setPlaylistRatings);
        mergeNewReviews(data, lastTimestampRef, seenKeysRef, setItems);
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
      <>
        <h1 className="sr-only">feedback</h1>
        <LoadingSpinner text={UI_TEXT.host.loading} />
      </>
    );
  }

  if (error && items.length === 0 && !currentPlaylist) {
    return (
      <>
        <h1 className="sr-only">feedback</h1>
        <LoadingFail text={error} />
      </>
    );
  }

  return (
    <ContentWrapper fixedHeader>
      <h1 className="sr-only">feedback</h1>
      <HeaderCard>
        <FlexRow>
          <RatingCell type="positive" align="left" ratings={playlistRatings} />
          <HeaderInfo className="text-center">
            {UI_TEXT.host.currentPlaylistLabel}
          </HeaderInfo>
          <RatingCell type="negative" align="right" ratings={playlistRatings} />
        </FlexRow>
        <Headline2 className="text-center">
          {currentPlaylist?.name || UI_TEXT.common.unknown}
        </Headline2>
      </HeaderCard>
      <FlexCol>
        <Headline3>{UI_TEXT.host.userFeedbackHeadline}</Headline3>
        {items.length === 0 ? (
          <p className="text-sm text-base-content/70">
            {/* TODO: in text element */}
            {UI_TEXT.host.noReviews}
          </p>
        ) : (
          <UserFeedbackList items={items} />
        )}
      </FlexCol>
    </ContentWrapper>
  );
}

function RatingCell({ align = "left", type, ratings }) {
  const isPositive = type === "positive";
  const colorClass = isPositive ? "text-success" : "text-error";
  const icon = isPositive ? UI_TEXT.common.thumbsUp : UI_TEXT.common.thumbsDown;
  const placeholder = isPositive
    ? UI_TEXT.host.ratingPlaceholderPositive
    : UI_TEXT.host.ratingPlaceholderNegative;
  const value = isPositive ? ratings?.positive : ratings?.negative;
  const alignClass =
    align === "left"
      ? "text-left"
      : align === "right"
        ? "text-right"
        : "text-center";

  return (
    <div className={`flex-1 ${alignClass} text-lg`}>
      <span className={colorClass}>
        {ratings ? (
          <>
            {icon} {value}
          </>
        ) : (
          placeholder
        )}
      </span>
    </div>
  );
}

function UserFeedbackList({ items }) {
  return (
    <>
      {items.map((item) => {
        const isPositive = item.rating === "positive";
        const ratingClass = isPositive ? "text-success" : "text-error";
        const ratingLabel = isPositive
          ? UI_TEXT.host.ratingPositive
          : UI_TEXT.host.ratingNegative;
        const reviewId = `review-${item.id}`;

        return (
          <HeaderTagTextCard
            key={reviewId}
            id={reviewId}
            header={item.email}
            tag={ratingLabel}
            tagStyle={ratingClass}
            text={item.text}
          />
        );
      })}
    </>
  );
}

function extractPlaylistAndRatings(
  data,
  setCurrentPlaylist,
  setPlaylistRatings,
) {
  if (data?.playlist && typeof data.playlist === "object") {
    setCurrentPlaylist(data.playlist);
  }

  const pos = data?.ratings?.positive;
  const neg = data?.ratings?.negative;
  if (typeof pos === "number" && typeof neg === "number") {
    setPlaylistRatings({ positive: pos, negative: neg });
  }
}

function mergeNewReviews(data, lastTimestampRef, seenKeysRef, setItems) {
  let nextMaxTimestamp = lastTimestampRef.current;

  if (typeof data?.updatedAt === "number") {
    nextMaxTimestamp = Math.max(nextMaxTimestamp, data.updatedAt);
  }

  const reviews = Array.isArray(data?.reviews) ? data.reviews : [];
  const newItems = [];

  for (const item of reviews) {
    if (typeof item?.timestamp === "number") {
      nextMaxTimestamp = Math.max(nextMaxTimestamp, item.timestamp);
    }
    const key = `review-${item?.id ?? "unknown"}`;
    if (!seenKeysRef.current.has(key)) {
      seenKeysRef.current.add(key);
      newItems.push(item);
    }
  }

  if (newItems.length > 0) {
    setItems((prev) => {
      const merged = [...prev, ...newItems];
      merged.sort((a, b) => b.timestamp - a.timestamp);
      return merged;
    });
  }

  lastTimestampRef.current = nextMaxTimestamp;
}
