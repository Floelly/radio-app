export function LoadingSpinner({
  text = null,
  className = "",
  children,
  ...props
}) {
  return (
    <div className="flex flex-col items-center justify-center pt-6 pb-8">
      <span className="loading loading-spinner loading-md text-primary" />
      {text && (
        <p
          className={`mt-4 text-sm text-base-content/70 ${className}`}
          {...props}
        >
          {text}
        </p>
      )}
      {children}
    </div>
  );
}

export function LoadingFail({
  text = null,
  className = "",
  children,
  ...props
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center pt-6 pb-8 ${className}`}
      {...props}
    >
      {text && <p className="text-sm text-error">{text}</p>}
      {children}
    </div>
  );
}
