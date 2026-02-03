import { SongCoverImage } from "@components/Image";

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

export function HeaderTagTextCard({
  header = null,
  tag = null,
  tagStyle = "",
  text = null,
  className = "",
  children,
}) {
  return (
    <BasicCard className={className}>
      <div className="flex items-center justify-between">
        {header && <p className="text-sm font-semibold truncate">{header}</p>}
        {tag && (
          <span className={`text-xs font-semibold ${tagStyle}`}>{tag}</span>
        )}
      </div>
      {text && <p className="mt-2 text-sm text-base-content/80">{text}</p>}
      {children}
    </BasicCard>
  );
}

export function SongCard({
  title = "no title found",
  artist = "no artist found",
  coverUrl = null,
  coverAlt = "",
}) {
  return (
    <BasicCard flex>
      <SongCoverImage src={coverUrl} alt={coverAlt} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-base-content truncate">
          {title}
        </p>
        <p className="text-xs text-base-content/60 truncate">{artist}</p>
      </div>
    </BasicCard>
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
