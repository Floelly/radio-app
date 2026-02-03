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
  return <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>;
}
