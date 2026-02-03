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
import { ContentWrapper, FlexCol } from "@components/Wrapper";
import { Headline2, P } from "@components/TextElements";
import { LoadingFail, LoadingSpinner } from "@components/LoadingSpinner";

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
    return <LoadingSpinner text={UI_TEXT.home.loadingTrack} />;
  }

  if (error || !track) {
    return <LoadingFail text={error ?? UI_TEXT.home.noTrack} />;
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
    <ContentWrapper>
      <FlexCol gap={6}>
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
        <div className="w-full max-w-sm text-center space-y-1">
          <Headline2 className="truncate">{track.title}</Headline2>
          <P className="truncate">
            {track.artist}
            {UI_TEXT.home.artistAlbumSeparator}
            {track.album}
            {yearText}
          </P>
          <P small className="truncate">
            {commentText || UI_TEXT.home.liveRadio}
          </P>
        </div>

        {host && (
          <>
            {/* Moderator-Card & Feedback */}
            <ModeratorCard name={hostDisplayName} imageUrl={hostImageSrc} />
            <FlexCol className="items-center">
              <P>{UI_TEXT.home.hostMessagePrompt(hostDisplayName)}</P>
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
            </FlexCol>
          </>
        )}
      </FlexCol>

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
    </ContentWrapper>
  );
}

export function ModeratorCard({ name, imageUrl }) {
  return (
    <BasicCard flex className="mt-6">
      <div className="h-12 w-12 rounded-full overflow-hidden bg-base-200 flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={UI_TEXT.home.hostPortraitAlt(name)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full" />
        )}
      </div>
      <FlexCol gap={0} className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold truncate">{name}</span>
          <span className="badge badge-success badge-sm uppercase tracking-wide ml-2">
            {UI_TEXT.home.liveBadge}
          </span>
        </div>
        <P small className="truncate">
          {UI_TEXT.home.hostSubtitle}
        </P>
      </FlexCol>
    </BasicCard>
  );
}
