import { Children } from "react";

export function ContentWrapper({
  className = "",
  fixedHeader = false,
  children,
}) {
  if (!fixedHeader) {
    return (
      <div
        className={`relative flex flex-col items-center pt-6 pb-8 ${className}`}
      >
        {children}
      </div>
    );
  }

  const allChildren = Children.toArray(children);
  const header = allChildren[0];
  const body = allChildren.slice(1);

  return (
    <div
      className={`relative flex flex-col items-center pt-6 h-full ${className}`}
    >
      {header}
      <div className="w-full max-w-sm flex-1 min-h-0 overflow-y-auto pb-8 mt-4">
        {body}
      </div>
    </div>
  );
}

export function FlexRow({ gap = 2, className = "", children }) {
  return <div className={`flex gap-${gap} ${className}`}>{children}</div>;
}

export function FlexCol({ gap = 2, className = "", children }) {
  return (
    <FlexRow gap={gap} className={`flex-col ${className}`}>
      {children}
    </FlexRow>
  );
}
