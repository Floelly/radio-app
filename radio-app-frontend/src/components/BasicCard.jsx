export function BasicCard({
  flex = false,
  isLoadingDummy = false,
  className = "",
  children,
}) {
  const defaultClasses = "rounded-2xl bg-base-300 px-4 py-3 shadow-sm";
  const loadingClasses =
    "rounded-2xl bg-base-200/80 px-4 py-3 shadow-inner border border-dashed border-base-300/80";
  const flexClasses = "flex items-center gap-3";

  const addedClasses = [
    isLoadingDummy ? loadingClasses : defaultClasses,
    flex ? flexClasses : "",
    className,
  ].join(" ");

  return (
    <div className={addedClasses}>
      {children}
      {isLoadingDummy && (
        <div className="flex flex-col gap-1">
          <span className="w-24 h-2 rounded-full bg-base-300/80" />
          <span className="w-32 h-2 rounded-full bg-base-300/60" />
        </div>
      )}
    </div>
  );
}

export function HeaderCard({ noPadding = false, className = "", children }) {
  return (
    <div
      className={`w-full max-w-sm rounded-2xl shadow-lg bg-base-300 text-center ${noPadding ? className : "px-6 py-6 " + className}`}
    >
      {children}
    </div>
  );
}
