import { useEffect, useState } from "react";
import { postSongWish } from "@api/wish";
import { useErrorFeedback, useSuccessFeedback } from "@/context/ToastFeedbackContext";

export function WishASongView({ loginToken, goToLogin }) {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [comment, setComment] = useState("");
  const errorFeedback = useErrorFeedback();
  const successFeedback = useSuccessFeedback();

  useEffect(() => {
    if (!loginToken) {
      goToLogin();
    }
  }, [loginToken, goToLogin]);

  if (!loginToken) {
    return null;
  }

  const handleSubmitWish = async () => {
    if (!song.trim() && !artist.trim() && !comment.trim()) {
      errorFeedback("Bitte mindestens ein Feld ausfüllen.");
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
      successFeedback("Wunsch wurde gesendet!");
    } catch (error) {
      errorFeedback(error?.detail || "An Error occured while sending request!");
      console.error(error);
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
