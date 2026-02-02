import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "@config";
import { getCurrentHost, getCurrentTrack } from "@api/radio";
import Modal from "@components/Modal";
import { RateModerator } from "@components/view/homeview/RateModerator";
import { useAppContext } from "@context/AppContext";
import { useFeedbackContext } from "@context/ToastFeedbackContext";
import {
  LOGIN_REQUIRED_TOAST_MESSAGE,
  HOST_REFRESH_INTERVAL_MS,
  TRACK_REFRESH_INTERVAL_MS,
  UI_TEXT,
} from "@config";
import { HeaderCard, BasicCard } from "@components/BasicCard";
import { Button } from "@components/Button";

const fallbackCoverUrl = "src/assets/fallback-cover.png";

export function HomeView() {
  const [track, setTrack] = useState(null);
  const [host, setHost] = useState(null);
  const [error, setError] = useState(null);
  const [isHostCardOpen, setIsHostCardOpen] = useState(false);
  const { isLoggedIn, goToLogin } = useAppContext();
  const { showError } = useFeedbackContext();

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
          setError(UI_TEXT.home.loadTrackError);
          console.error(err);
          setTrack(null);
        }
      }
    }

    loadHost();
    loadTrack();
    const hostInterval = setInterval(loadHost, HOST_REFRESH_INTERVAL_MS);
    const interval = setInterval(loadTrack, TRACK_REFRESH_INTERVAL_MS);

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
          {UI_TEXT.home.loadingTrack}
        </p>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="flex flex-col items-center justify-center pt-6 pb-8">
        <p className="text-sm text-error">{error ?? UI_TEXT.home.noTrack}</p>
      </div>
    );
  }

  const yearText = track.year ? UI_TEXT.home.formatYear(track.year) : "";
  const commentText = track.comment
    ? `${UI_TEXT.home.playlistCommentPrefix}${track.comment}`
    : "";
  const coverSrc = track.coverUrl
    ? new URL(track.coverUrl, BACKEND_BASE_URL).toString()
    : fallbackCoverUrl;
  const hostDisplayName = host?.name || UI_TEXT.home.hostNameFallback;
  const hostImageSrc =
    host?.imageUrl && host.imageUrl.length > 0
      ? new URL(host.imageUrl, BACKEND_BASE_URL).toString()
      : null;
  const handleHostFeedbackClick = () => {
    if (!isLoggedIn) {
      showError(LOGIN_REQUIRED_TOAST_MESSAGE);
      return;
    }
    setIsHostCardOpen(true);
  };

  return (
    <div className="relative flex flex-col items-center pt-6 pb-8 min-h-full">
      {/* Oberer Block */}
      <div className="w-full max-w-sm flex-1 flex flex-col items-center gap-6">
        {/* Cover */}
        <HeaderCard
          noPadding
          className="w-full aspect-square overflow-hidden rounded-3xl"
        >
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={UI_TEXT.home.trackCoverAlt(track.title)}
              onError={(e) => {
                if (e.currentTarget.src.endsWith(fallbackCoverUrl)) return;
                e.currentTarget.src = fallbackCoverUrl;
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-base-content/60">
              {UI_TEXT.home.noCover}
            </div>
          )}
        </HeaderCard>
        {/* Track-Infos */}
        <div className="w-full max-w-sm text-center space-y-1 mb-6">
          <h2 className="text-xl font-semibold truncate">{track.title}</h2>
          <p className="text-sm text-base-content/80 truncate">
            {track.artist}
            {UI_TEXT.home.artistAlbumSeparator}
            {track.album}
            {yearText}
          </p>
          <p className="text-xs text-base-content/60 truncate">
            {commentText || UI_TEXT.home.liveRadio}
          </p>
        </div>
      </div>

      {/* Unterer Block */}
      {host && (
        <div className="w-full max-w-sm mt-4">
          {/* Moderator-Card */}
          <BasicCard flex>
            <div className="h-12 w-12 rounded-full overflow-hidden bg-base-200 flex-shrink-0">
              {hostImageSrc ? (
                <img
                  src={hostImageSrc}
                  alt={UI_TEXT.home.hostPortraitAlt(hostDisplayName)}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full" />
              )}
            </div>
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold truncate">
                  {host.name}
                </span>
                <span className="badge badge-success badge-sm uppercase tracking-wide ml-2">
                  {UI_TEXT.home.liveBadge}
                </span>
              </div>
              <span className="text-xs text-base-content/60 truncate">
                {UI_TEXT.home.hostSubtitle}
              </span>
            </div>
          </BasicCard>
          {/* Feedback-Bereich */}
          <div className="mt-7 flex flex-col items-center">
            <p className="text-sm text-base-content/70 mb-3 text-center">
              {UI_TEXT.home.hostMessagePrompt(hostDisplayName)}
            </p>
            {isLoggedIn ? (
              <Button
                small
                text={UI_TEXT.home.hostMessageButton(hostDisplayName)}
                onClick={handleHostFeedbackClick}
              />
            ) : (
              <Button
                small
                text={UI_TEXT.home.loginForHostMessageButton}
                onClick={() => goToLogin("home")}
              />
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {isHostCardOpen && (
        <Modal isOpen={isHostCardOpen} onClose={() => setIsHostCardOpen(false)}>
          <RateModerator
            hostName={hostDisplayName}
            hostImageSrc={hostImageSrc}
            setIsHostCardOpen={setIsHostCardOpen}
          />
        </Modal>
      )}
    </div>
  );
}
