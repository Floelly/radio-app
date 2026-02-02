import { useEffect, useState } from "react";
import { postSongWish } from "@api/wish";
import { useAppContext } from "@context/AppContext";
import { useFeedbackContext } from "@context/ToastFeedbackContext";
import { TEXTAREA_ROWS_DEFAULT, UI_TEXT } from "@config";
import { Button } from "@components/Button";
import { ContentWrapper } from "@components/Wrapper";

export function WishASongView() {
  const [song, setSong] = useState("");
  const [artist, setArtist] = useState("");
  const [comment, setComment] = useState("");
  const { showError, showSuccess } = useFeedbackContext();
  const { loginToken, goToLogin, isLoggedIn } = useAppContext();

  useEffect(() => {
    if (!isLoggedIn) {
      goToLogin("feedback");
    }
  }, [isLoggedIn, goToLogin]);

  const handleSubmitWish = async () => {
    if (!song.trim() && !artist.trim() && !comment.trim()) {
      showError(UI_TEXT.wish.emptyFieldsError);
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
      showSuccess(UI_TEXT.wish.success);
    } catch (error) {
      showError(error?.detail || UI_TEXT.wish.error);
      console.error(error);
    }
  };

  return (
    <ContentWrapper>
      <div className="w-full max-w-sm rounded-3xl shadow-lg bg-base-300 px-6 py-4 text-center">
        <p className="text-sm text-base-content/70">{UI_TEXT.wish.intro}</p>
      </div>

      <div className="w-full max-w-sm flex-1 flex flex-col justify-center mt-12">
        <input
          placeholder={UI_TEXT.wish.songPlaceholder}
          className="input input-bordered w-full"
          value={song}
          onChange={(event) => setSong(event.target.value)}
        />
        <input
          placeholder={UI_TEXT.wish.artistPlaceholder}
          className="input input-bordered w-full mt-2"
          value={artist}
          onChange={(event) => setArtist(event.target.value)}
        />
        <textarea
          placeholder={UI_TEXT.wish.commentPlaceholder}
          className="textarea textarea-bordered w-full mt-2 resize-none"
          rows={TEXTAREA_ROWS_DEFAULT}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />

        <div className="w-full flex gap-2 mt-4">
          <Button
            highlighted
            className="flex-1"
            text={UI_TEXT.wish.submitButton}
            onClick={handleSubmitWish}
          />
        </div>
      </div>
    </ContentWrapper>
  );
}
