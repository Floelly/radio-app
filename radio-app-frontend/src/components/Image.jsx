import { useEffect, useState } from "react";

export function Image({
  src = null,
  alt = "",
  fallbackSrc = null,
  fallback = null,
  className = "",
  onError,
  ...props
}) {
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    setErrorCount(0);
  }, [src, fallbackSrc]);

  const primarySrc = src || fallbackSrc;
  const hasFallbackSource = Boolean(src && fallbackSrc);
  const resolvedSrc =
    errorCount === 0
      ? primarySrc
      : errorCount === 1 && hasFallbackSource
        ? fallbackSrc
        : null;

  if (!resolvedSrc) {
    return fallback ?? null;
  }

  const handleError = (event) => {
    setErrorCount((count) => Math.min(count + 1, 2));
    if (onError) {
      onError(event);
    }
  };

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
}

export function TrackCoverImage({
  src = null,
  fallbackSrc = null,
  alt = "",
  fallbackText = "",
}) {
  const fallbackContent = fallbackText ? (
    <div className="w-full h-full flex items-center justify-center text-sm text-base-content/60">
      {fallbackText}
    </div>
  ) : (
    <div className="w-full h-full" />
  );

  return (
    <Image
      src={src}
      fallbackSrc={fallbackSrc}
      alt={alt}
      className="w-full h-full object-cover"
      fallback={fallbackContent}
    />
  );
}

export function HostAvatarImage({ src = null, alt = "" }) {
  return (
    <div className="h-12 w-12 rounded-full overflow-hidden bg-base-200 flex-shrink-0">
      <Image
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        fallback={<div className="h-full w-full" />}
      />
    </div>
  );
}

export function HostPortraitImage({ src = null, alt = "" }) {
  return (
    <div className="mx-auto h-32 w-32 rounded-full overflow-hidden bg-base-200">
      <Image
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        fallback={<div className="h-full w-full" />}
      />
    </div>
  );
}

export function SongCoverImage({ src = null, alt = "" }) {
  return (
    <div className="h-10 w-10 rounded-xl bg-base-200 flex-shrink-0 overflow-hidden">
      <Image
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        fallback={<div className="h-full w-full" />}
      />
    </div>
  );
}

export function PlaylistImage({ src = null, alt = "" }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-base-200 h-40 mt-2">
      <Image
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        fallback={<div className="w-full h-full" />}
      />
    </div>
  );
}
