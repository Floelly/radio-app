import { useState, useEffect } from "react";
import { BACKEND_BASE_URL } from "@config";
import { postFeedbackPlaylist } from "@api/feedback";
import { getCurrentPlaylist, getCurrentQueue } from "@api/radio";
import { useAppContext } from "@context/AppContext";
import { useFeedbackContext } from "@context/ToastFeedbackContext";
import {
  LOGIN_REQUIRED_TOAST_MESSAGE,
  PLAYLIST_REFRESH_INTERVAL_MS,
  QUEUE_NEXT_SLICE_SIZE,
  QUEUE_REFRESH_INTERVAL_MS,
  UI_TEXT,
} from "@config";
import { HeaderCard, BasicCard } from "@components/BasicCard";
import { Button, ThumbsButton } from "@components/Button";
import { ContentWrapper } from "@components/Wrapper";

export function PlaylistView() {
  const [playlistInfo, setPlaylistInfo] = useState(null);
  const [queue, setQueue] = useState(null);
  const { showError, showSuccess } = useFeedbackContext();
  const { isLoggedIn, loginToken, goToLogin } = useAppContext();

  useEffect(() => {
    let isCancelled = false;

    const loadPlaylist = async () => {
      try {
        const playlistData = await getCurrentPlaylist();
        if (!isCancelled) setPlaylistInfo(playlistData);
      } catch (error) {
        if (!isCancelled) {
          setPlaylistInfo(null);
          showError(error?.detail || UI_TEXT.playlist.loadError);
        }
      }
    };

    const loadQueue = async () => {
      try {
        const queueData = await getCurrentQueue();
        if (!isCancelled) setQueue(queueData);
      } catch (error) {
        if (!isCancelled) {
          setQueue(null);
          showError(error?.detail || UI_TEXT.playlist.queueLoadError);
        }
      }
    };

    loadPlaylist();
    loadQueue();
    const playlistInterval = setInterval(
      loadPlaylist,
      PLAYLIST_REFRESH_INTERVAL_MS,
    );
    const queueInterval = setInterval(loadQueue, QUEUE_REFRESH_INTERVAL_MS);
    return () => {
      isCancelled = true;
      clearInterval(playlistInterval);
      clearInterval(queueInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFeedback = async (liked) => {
    if (!isLoggedIn) {
      showError(LOGIN_REQUIRED_TOAST_MESSAGE);
      return;
    }
    try {
      const payload = {
        playlist: playlistInfo?.name || "standard",
        rating: liked ? "positive" : "negative",
      };
      await postFeedbackPlaylist({ data: payload, token: loginToken });
      showSuccess(UI_TEXT.playlist.feedbackSuccess(liked));
    } catch (error) {
      showError(error?.detail || UI_TEXT.playlist.feedbackError);
    }
  };

  return (
    <ContentWrapper>
      {/* Playlist-Info */}
      <HeaderCard>
        <p className="text-xs uppercase font-semibold tracking-wide text-base-content/50">
          {UI_TEXT.playlist.currentPlaylistTitle}
        </p>
        <h2 className="mt-1 text-lg font-semibold">
          {playlistInfo?.name || UI_TEXT.playlist.loadingName}
        </h2>
        <div
          className="mt-3 rounded-2xl overflow-hidden bg-base-200 h-40 bg-cover bg-center"
          style={
            playlistInfo?.coverUrl
              ? {
                  backgroundImage: `url(${new URL(
                    playlistInfo.coverUrl,
                    BACKEND_BASE_URL,
                  ).toString()})`,
                }
              : undefined
          }
        />
        <p className="mt-3 text-xs font-semibold line-clamp-4">
          {playlistInfo?.infotext || UI_TEXT.playlist.loadingInfoText}
        </p>
      </HeaderCard>

      {/* Nächste Hits */}
      <div className="w-full max-w-sm mt-4">
        <div className="mb-3">
          <p className="text-xs uppercase tracking-wide text-base-content/50 mb-2">
            {UI_TEXT.playlist.nowPlayingLabel}
          </p>
          {queue?.current ? (
            <BasicCard flex>
              <div
                className="h-10 w-10 rounded-xl bg-base-200 flex-shrink-0 bg-cover bg-center"
                style={
                  queue.current.coverUrl
                    ? {
                        backgroundImage: `url(${new URL(
                          queue.current.coverUrl,
                          BACKEND_BASE_URL,
                        ).toString()})`,
                      }
                    : undefined
                }
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-base-content truncate">
                  {queue.current.title}
                </p>
                <p className="text-xs text-base-content/60 truncate">
                  {queue.current.artist}
                </p>
              </div>
            </BasicCard>
          ) : (
            <BasicCard isLoadingDummy />
          )}
        </div>
        <p className="text-xs uppercase tracking-wide text-base-content/50 mb-2">
          {UI_TEXT.playlist.nextHitsLabel}
        </p>

        <div className="space-y-3">
          {(queue?.next || []).slice(0, QUEUE_NEXT_SLICE_SIZE).map((track) => (
            <BasicCard flex key={track.id}>
              <div
                className="h-10 w-10 rounded-xl bg-base-200 flex-shrink-0 bg-cover bg-center"
                style={
                  track.coverUrl
                    ? {
                        backgroundImage: `url(${new URL(
                          track.coverUrl,
                          BACKEND_BASE_URL,
                        ).toString()})`,
                      }
                    : undefined
                }
              />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-base-content truncate">
                  {track.title}
                </p>
                <p className="text-xs text-base-content/60 truncate">
                  {track.artist}
                </p>
              </div>
            </BasicCard>
          ))}

          {(!queue?.next || queue.next.length === 0) && (
            <BasicCard isLoadingDummy />
          )}
        </div>
      </div>

      {/* Feedback-Bereich */}
      <div className="w-full max-w-sm mt-10 flex flex-col items-center">
        <p className="text-sm text-base-content/70 mb-3">
          {UI_TEXT.playlist.feedbackPrompt}
        </p>
        {isLoggedIn ? (
          <div className="flex gap-4">
            <ThumbsButton up onClick={() => handleFeedback(true)} />
            <ThumbsButton down onClick={() => handleFeedback(false)} />
          </div>
        ) : (
          <Button
            small
            text={UI_TEXT.playlist.loginForPlaylistFeedbackButton}
            onClick={() => goToLogin("playlist")}
          />
        )}
      </div>
    </ContentWrapper>
  );
}
