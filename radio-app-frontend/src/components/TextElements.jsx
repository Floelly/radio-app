export function HeaderInfo({ className = "", children }) {
  return (
    <p
      className={`text-xs uppercase font-semibold tracking-wide text-base-content/50 ${className}`}
    >
      {children}
    </p>
  );
}

export function Headline3({ className = "", children }) {
  return (
    <h3
      className={`text-xs uppercase tracking-wide text-base-content/50 ${className}`}
    >
      {children}
    </h3>
  );
}

export function Headline2({ className = "", children }) {
  return <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>;
}

export function P({ small = false, className = "", children }) {
  return (
    <p
      className={`${small ? "text-xs line-clamp-4" : "text-sm"} text-base-content/70 ${className}`}
    >
      {children}
    </p>
  );
}
