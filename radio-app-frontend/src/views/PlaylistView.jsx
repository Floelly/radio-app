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
import { HeaderCard, BasicCard, SongCard } from "@components/BasicCard";
import { Button, ThumbsButton } from "@components/Button";
import { PlaylistImage } from "@components/Image";
import { ContentWrapper, FlexCol, FlexRow } from "@components/Wrapper";
import { HeaderInfo, Headline2, Headline3, P } from "@components/TextElements";

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
    const payload = {
      playlist: playlistInfo?.name || "standard",
      rating: liked ? "positive" : "negative",
    };
    try {
      await postFeedbackPlaylist({ data: payload, token: loginToken });
      showSuccess(UI_TEXT.playlist.feedbackSuccess(liked));
    } catch (error) {
      showError(error?.detail || UI_TEXT.playlist.feedbackError);
    }
  };

  return (
    <ContentWrapper>
      {/* Playlist-Info */}
      <FlexCol gap={4}>
        <HeaderCard>
          <FlexCol>
            <HeaderInfo>{UI_TEXT.playlist.currentPlaylistTitle}</HeaderInfo>
            <Headline2>
              {playlistInfo?.name || UI_TEXT.playlist.loadingName}
            </Headline2>
            <PlaylistImage
              src={parseBackendUrl(playlistInfo?.coverUrl)}
              alt={UI_TEXT.playlist.currentPlaylistTitle}
            />
            <P small>
              {playlistInfo?.infotext || UI_TEXT.playlist.loadingInfoText}
            </P>
          </FlexCol>
        </HeaderCard>

        {/* Nächste Hits */}
        <FlexCol>
          <Headline3>{UI_TEXT.playlist.nowPlayingLabel}</Headline3>
          {queue?.current ? (
            <SongCard
              title={queue.current.title}
              artist={queue.current.artist}
              coverUrl={parseBackendUrl(queue.current.coverUrl)}
              coverAlt={UI_TEXT.home.trackCoverAlt(queue.current.title)}
            />
          ) : (
            <BasicCard isLoadingDummy />
          )}
        </FlexCol>

        <FlexCol>
          <Headline3>{UI_TEXT.playlist.nextHitsLabel}</Headline3>
          {(queue?.next || []).slice(0, QUEUE_NEXT_SLICE_SIZE).map((track) => (
            <SongCard
              key={track.id}
              title={track.title}
              artist={track.artist}
              coverUrl={parseBackendUrl(track.coverUrl)}
              coverAlt={UI_TEXT.home.trackCoverAlt(track.title)}
            />
          ))}

          {(!queue?.next || queue.next.length === 0) && (
            <BasicCard isLoadingDummy />
          )}
        </FlexCol>

        {/* Feedback-Bereich */}
        <FlexCol className="mt-4 items-center">
          <P>{UI_TEXT.playlist.feedbackPrompt}</P>
          {isLoggedIn ? (
            <FlexRow gap={4}>
              <ThumbsButton up onClick={() => handleFeedback(true)} />
              <ThumbsButton down onClick={() => handleFeedback(false)} />
            </FlexRow>
          ) : (
            <Button
              small
              text={UI_TEXT.playlist.loginForPlaylistFeedbackButton}
              onClick={() => goToLogin("playlist")}
            />
          )}
        </FlexCol>
      </FlexCol>
    </ContentWrapper>
  );
}

const parseBackendUrl = (backendUrl) => {
    if (!backendUrl) return null;
    return new URL(backendUrl, BACKEND_BASE_URL).toString();
};
