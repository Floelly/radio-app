import { useState, useEffect } from "react";
import { postPlaylistRating } from "../api/auth";

export function PlaylistView({ loginToken, goToLogin }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleFeedback = async (liked) => {
    if (!loginToken) {
      goToLogin();
      return;
    }

    try {
      const payload = {
        playlist: "standard",
        rating: liked ? "positive" : "negative",
      };
      await postPlaylistRating({ data: payload, token: loginToken });
      setToast({
        type: "success",
        text: "Danke für dein Feedback! " + (liked ? "👍" : "👎"),
      });
    } catch (error) {
      setToast({
        type: "error",
        text: error?.detail || "Fehler beim Senden deines Feedbacks.",
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center pt-6 pb-8">
      {/* Toast */}
      {toast && (
        <div className="absolute top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 px-4 pointer-events-none z-30">
          <div
            className={
              "text-white text-sm rounded-lg px-3 py-2 shadow text-center whitespace-pre-line " +
              (toast.type === "error" ? "bg-red-500/90" : "bg-green-500/90")
            }
          >
            {toast.text}
          </div>
        </div>
      )}

      {/* Playlist-Info */}
      <div className="w-full max-w-sm rounded-3xl shadow-lg bg-base-300 px-6 py-4 text-center">
        <p className="text-xs uppercase tracking-wide text-base-content/50">
          Unsere aktuelle Dummy Playlist
        </p>
        <h2 className="mt-1 text-lg font-semibold text-base-content">
          Energy Hits am Nachmittag
        </h2>
        <p className="mt-2 text-sm text-base-content/70 line-clamp-3">
          Bla bla bla hier muss noch ein toller, kurzer Infotext hin... oder was
          auch immer wir für playlist infos haben wollen
        </p>
      </div>
      <div>
        <p>unsere nächsten Hits:</p>
      </div>

      {/* Feedback-Bereich */}
      <div className="w-full max-w-sm mt-10 flex flex-col items-center">
        <p className="text-sm text-base-content/70 mb-3">
          Gefällt dir unsere Playlist?
        </p>

        <div className="flex gap-4">
          <button
            type="button"
            className="btn btn-circle btn-success text-xl"
            onClick={() => handleFeedback(true)}
          >
            👍
          </button>
          <button
            type="button"
            className="btn btn-circle btn-error text-xl"
            onClick={() => handleFeedback(false)}
          >
            👎
          </button>
        </div>
      </div>
    </div>
  );
}
