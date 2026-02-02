import { useState } from "react";
import { postFeedbackHost } from "@api/feedback";
import { useAppContext } from "@context/AppContext";
import { useFeedbackContext } from "@context/ToastFeedbackContext";
import { TEXTAREA_ROWS_DEFAULT, UI_TEXT } from "@config";

export function RateModerator({ setIsHostCardOpen, hostImageSrc, hostName }) {
  const [hostRating, setHostRating] = useState(null);
  const [hostComment, setHostComment] = useState("");
  const { showError, showSuccess } = useFeedbackContext();
  const { isLoggedIn, goToLogin, loginToken } = useAppContext();

  const handleSubmitHostRating = async () => {
    if (!isLoggedIn) {
      goToLogin("home");
      return;
    }
    if (hostRating != "up" && hostRating != "down") {
      showError(UI_TEXT.rateModerator.ratingRequired);
      return;
    }
    if (hostComment == "") {
      showError(UI_TEXT.rateModerator.commentRequired);
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
      showSuccess(UI_TEXT.rateModerator.submitSuccess);
    } catch (error) {
      showError(UI_TEXT.rateModerator.submitError);
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
          {UI_TEXT.rateModerator.prompt(hostName)}
          <br />
          {UI_TEXT.rateModerator.promptFollowup}
        </p>
        <textarea
          rows={TEXTAREA_ROWS_DEFAULT}
          placeholder={UI_TEXT.rateModerator.textareaPlaceholder}
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
            {UI_TEXT.common.thumbsUp}
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
            {UI_TEXT.common.thumbsDown}
          </button>
        </div>

        <div className="w-full flex gap-2">
          <button
            type="button"
            className="btn btn-primary flex-1"
            onClick={() => handleSubmitHostRating()}
          >
            {UI_TEXT.rateModerator.submitButton}
          </button>
        </div>
      </div>
    </>
  );
}
