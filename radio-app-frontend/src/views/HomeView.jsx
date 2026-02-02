import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "@api/config";
import { getCurrentHost, getCurrentTrack } from "@api/radio";
import Modal from "@components/Modal";
import { RateModerator } from "@components/view/homeview/RateModerator";

const fallbackCoverUrl = "src/assets/fallback-cover.png";

export function HomeView({ loginToken, goToLogin }) {
  const [track, setTrack] = useState(null);
  const [host, setHost] = useState(null);
  const [error, setError] = useState(null);
  const [isHostCardOpen, setIsHostCardOpen] = useState(false);

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
          setError("Aktueller Titel konnte nicht geladen werden.");
          console.error(err);
          setTrack(null);
        }
      }
    }

    loadHost();
    loadTrack();
    const hostInterval = setInterval(loadHost, 30_000);
    const interval = setInterval(loadTrack, 10_000);

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
    : fallbackCoverUrl;
  const hostImageSrc =
    host?.imageUrl && host.imageUrl.length > 0
      ? new URL(host.imageUrl, BACKEND_BASE_URL).toString()
      : null;

  return (
    <div className="relative flex flex-col items-center pt-6 pb-8 min-h-full">
      {/* Oberer Block */}
      <div className="w-full max-w-sm flex-1 flex flex-col items-center">
        {/* Cover */}
        <div className="w-full aspect-square rounded-3xl overflow-hidden shadow-2xl bg-base-300 mb-6">
          {coverSrc ? (
            <img
              src={coverSrc}
              alt={`${track.title} Cover`}
              onError={(e) => {
                if (e.currentTarget.src.endsWith(fallbackCoverUrl)) return;
                e.currentTarget.src = fallbackCoverUrl;
              }}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm text-base-content/60">
              Kein Cover
            </div>
          )}
        </div>
        {/* Track-Infos */}
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

      {/* Unterer Block */}
      {host && (
        <div className="w-full max-w-sm mt-4">
          {/* Moderator-Card */}
          <div className="rounded-3xl bg-base-300 px-4 py-3 shadow-lg flex items-center gap-3">
            <div className="h-12 w-12 rounded-full overflow-hidden bg-base-200 flex-shrink-0">
              {hostImageSrc ? (
                <img
                  src={hostImageSrc}
                  alt={`${host.name} Portrait`}
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
                  Live
                </span>
              </div>
              <span className="text-xs text-base-content/60 truncate">
                Begleitet dich durch die aktuelle Sendung
              </span>
            </div>
          </div>
          {/* Feedback-Bereich */}
          <div className="mt-7 flex flex-col items-center">
            <p className="text-sm text-base-content/70 mb-3 text-center">
              Willst du {host.name || "uns"} eine Nachricht schreiben?
            </p>

            {loginToken ? (
              <button
                type="button"
                className="btn btn-outline btn-primary btn-sm"
                onClick={() => setIsHostCardOpen(true)}
              >
                Hallo {host.name || "uns"} ...
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-outline btn-primary btn-sm"
                onClick={() => goToLogin()}
              >
                Zum Login, für Feedback
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal */}
      {isHostCardOpen && (
        <Modal isOpen={isHostCardOpen} onClose={() => setIsHostCardOpen(false)}>
          <RateModerator
            hostName={host.name}
            hostImageSrc={hostImageSrc}
            loginToken={loginToken}
            goToLogin={goToLogin}
            setIsHostCardOpen={setIsHostCardOpen}
          />
        </Modal>
      )}
    </div>
  );
}
