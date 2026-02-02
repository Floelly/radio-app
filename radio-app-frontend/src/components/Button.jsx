import { UI_TEXT } from "@config";

export function NavButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        "flex-1 flex flex-col items-center justify-center text-xs transition-colors " +
        (active
          ? "bg-primary text-primary-content font-semibold"
          : "text-base-content/60 hover:text-base-content hover:bg-base-300/60")
      }
    >
      <span>{label}</span>
    </button>
  );
}

export function Button({
  highlighted = false,
  subtle = false,
  small = false,
  text = "submit",
  onClick,
  className = "",
  children,
}) {
  const allClasses = [
    "btn",
    highlighted ? "" : "btn-outline",
    subtle ? "" : "btn-primary",
    small ? "btn-sm" : "",
    className,
  ].join(" ");

  return (
    <button type="button" className={allClasses} onClick={() => onClick()}>
      {children}
      {text}
    </button>
  );
}

export function ThumbsButton({
  up = true,
  down = !up,
  active = true,
  onClick,
  className = "",
}) {
  const buttonText = down ? UI_TEXT.common.thumbsDown : UI_TEXT.common.thumbsUp;
  const stateClasses = active
    ? ""
    : "bg-white border " +
      (down ? "border-error text-error" : "border-success text-success");
  const allClasses = [
    "btn btn-circle text-xl",
    down ? "btn-error" : "btn-success",
    stateClasses,
    className,
  ].join(" ");

  return (
    <button type="button" className={allClasses} onClick={() => onClick()}>
      {buttonText}
    </button>
  );
}
