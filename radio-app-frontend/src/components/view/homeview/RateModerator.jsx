import { useState } from "react";
import { postFeedbackHost } from "@api/feedback";
import {
  useErrorFeedback,
  useSuccessFeedback,
} from "@context/ToastFeedbackContext";

export function RateModerator({
  loginToken,
  goToLogin,
  setIsHostCardOpen,
  hostImageSrc,
  hostName,
}) {
  const [hostRating, setHostRating] = useState(null);
  const [hostComment, setHostComment] = useState("");
  const errorFeedback = useErrorFeedback();
  const successFeedback = useSuccessFeedback();

  const handleSubmitHostRating = async () => {
    if (!loginToken) {
      goToLogin();
      return;
    }
    if (hostRating != "up" && hostRating != "down") {
      errorFeedback("Daumen hoch oder Daumen runter?");
      return;
    }
    if (hostComment == "") {
      errorFeedback("Huch? sieht aus als hättest du noch nichts geschrieben.");
      return;
    }
    try {
      await postFeedbackHost({
        data: {
          rating: hostRating == "up" ? "positive" : "negative",
          text: hostComment,
        },
        token: loginToken,
      });
      setHostRating(null);
      setHostComment("");
      setIsHostCardOpen(false);
      successFeedback("Danke für deine Nachricht!");
    } catch (error) {
      errorFeedback("Fehler beim Senden deines Feedbacks.");
      console.error(error);
    }
  };

  return (
    <>
      <div className="w-full max-w-sm flex-1 flex flex-col justify-center items-center gap-6">
        <div className="mx-auto h-32 w-32 rounded-full overflow-hidden bg-base-200">
          {hostImageSrc ? (
            <img src={hostImageSrc} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>
        <p className="text-sm text-base-content/70 text-center">
          Wie gefällt dir unser Moderator {hostName}?
          <br />
          Schreib ihm doch ne Nachricht.
        </p>
        <textarea
          rows={3}
          placeholder="Bewertung..."
          className="w-full min-h-[7rem] textarea textarea-bordered resize-none text-base"
          value={hostComment}
          onChange={(event) => setHostComment(event.target.value)}
        />
        <div className="flex gap-4">
          <button
            type="button"
            className={`btn btn-circle text-xl ${
              hostRating === "up"
                ? "bg-success text-white border-success"
                : "bg-white text-base-content border-black hover:bg-white"
            }`}
            onClick={() => setHostRating("up")}
          >
            👍
          </button>
          <button
            type="button"
            className={`btn btn-circle text-xl ${
              hostRating === "down"
                ? "bg-error text-white border-error"
                : "bg-white text-base-content border-black hover:bg-white"
            }`}
            onClick={() => setHostRating("down")}
          >
            👎
          </button>
        </div>

        <div className="w-full flex gap-2">
          <button
            type="button"
            className="btn btn-primary flex-1"
            onClick={() => handleSubmitHostRating()}
          >
            Bewerten
          </button>
        </div>
      </div>
    </>
  );
}
