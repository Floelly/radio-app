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
