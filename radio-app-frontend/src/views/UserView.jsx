export function UserView({ userEmail, onLogout }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-8">
      <div className="w-full max-w-sm rounded-3xl shadow-lg bg-base-300 px-6 py-6 text-center">
        <p className="text-sm text-base-content/70">Angemeldet als</p>
        <p className="mt-2 text-base font-semibold break-all">
          {userEmail || "Unbekannt"}
        </p>
        <button
          type="button"
          className="btn btn-outline w-full mt-6"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
