import { useEffect, useState } from "react";
import { postSongWish } from "../api/auth";

export function WishASongView({ loginToken }) {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [comment, setComment] = useState("");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleSubmitWish = async () => {
    if (!song.trim() && !artist.trim() && !comment.trim()) {
      setToast({ type: "error", text: "Bitte mindestens ein Feld ausfüllen." });
      return;
    }
    try {
      await postSongWish({
        data: { song, artist, comment },
        token: loginToken,
      });
      setSong("");
      setArtist("");
      setComment("");
      setToast({ type: "success", text: "Wunsch wurde gesendet!" });
    } catch (error) {
      setToast({
        type: "error",
        text: error?.detail || "An Error occured while sending request!",
      });
    }
  };

  return (
    <div className="relative flex flex-col items-center pt-6 pb-8">
      <div className="w-full max-w-sm rounded-3xl shadow-lg bg-base-300 px-6 py-4 text-center">
        <p className="text-sm text-base-content/70">
          Wünsche dir jetzt einen Song und mache unsere Playlist zu deiner
          Playlist!
        </p>
      </div>

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

      <div className="w-full max-w-sm flex-1 flex flex-col justify-center mt-12">
        <input
          placeholder="Lied"
          className="input input-bordered w-full"
          value={song}
          onChange={(event) => setSong(event.target.value)}
        />
        <input
          placeholder="Interpret"
          className="input input-bordered w-full mt-2"
          value={artist}
          onChange={(event) => setArtist(event.target.value)}
        />
        <textarea
          placeholder="Zusatzinfo ..."
          className="textarea textarea-bordered w-full mt-2 resize-none"
          rows={3}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />

        <div className="w-full flex gap-2 mt-4">
          <button
            type="button"
            className="btn btn-primary flex-1"
            onClick={handleSubmitWish}
          >
            Wunsch abschicken
          </button>
        </div>
      </div>
    </div>
  );
}
