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
    <div className="relative flex flex-col items-center pt-6 pb-8">
      {/* Playlist-Info */}
      <div className="w-full max-w-sm rounded-3xl shadow-lg bg-base-300 px-6 py-4 text-center">
        <p className="text-xs uppercase font-semibold tracking-wide">
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
      </div>

      {/* Nächste Hits */}
      <div className="w-full max-w-sm mt-4">
        <div className="mb-3">
          <p className="text-xs uppercase tracking-wide text-base-content/50 mb-2">
            {UI_TEXT.playlist.nowPlayingLabel}
          </p>
          {queue?.current ? (
            <div className="rounded-2xl bg-base-300/80 px-4 py-3 shadow-sm flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-2xl bg-base-200 flex-shrink-0 bg-cover bg-center"
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
            </div>
          ) : (
            <div className="rounded-2xl bg-base-200/80 px-4 py-3 shadow-inner border border-dashed border-base-300">
              <div className="flex flex-col gap-1">
                <span className="w-24 h-2 rounded-full bg-base-300/80" />
                <span className="w-32 h-2 rounded-full bg-base-300/60" />
              </div>
            </div>
          )}
        </div>
        <p className="text-xs uppercase tracking-wide text-base-content/50 mb-2">
          {UI_TEXT.playlist.nextHitsLabel}
        </p>

        <div className="space-y-3">
          {(queue?.next || []).slice(0, QUEUE_NEXT_SLICE_SIZE).map((track) => (
            <div
              key={track.id}
              className="rounded-2xl bg-base-300/80 px-4 py-3 shadow-sm flex items-center gap-3"
            >
              <div
                className="h-10 w-10 rounded-2xl bg-base-200 flex-shrink-0 bg-cover bg-center"
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
            </div>
          ))}

          {(!queue?.next || queue.next.length === 0) && (
            <div className="rounded-2xl bg-base-200/80 px-4 py-3 shadow-inner border border-dashed border-base-300">
              <div className="flex flex-col gap-1">
                <span className="w-24 h-2 rounded-full bg-base-300/80" />
                <span className="w-32 h-2 rounded-full bg-base-300/60" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Feedback-Bereich */}
      <div className="w-full max-w-sm mt-10 flex flex-col items-center">
        <p className="text-sm text-base-content/70 mb-3">
          {UI_TEXT.playlist.feedbackPrompt}
        </p>
        { isLoggedIn ? (
          <div className="flex gap-4">
            <button
              type="button"
              className="btn btn-circle btn-success text-xl"
              onClick={() => handleFeedback(true)}
            >
              {UI_TEXT.common.thumbsUp}
            </button>
            <button
              type="button"
              className="btn btn-circle btn-error text-xl"
              onClick={() => handleFeedback(false)}
            >
              {UI_TEXT.common.thumbsDown}
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-outline btn-primary btn-sm mt-1"
            onClick={() => goToLogin("playlist")}
          >
            {UI_TEXT.playlist.loginForPlaylistFeedbackButton}
          </button>
        )}
        
      </div>
    </div>
  );
}
