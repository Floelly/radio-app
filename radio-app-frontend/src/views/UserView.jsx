import { useAppContext } from "@context/AppContext";
import { UI_TEXT } from "@config";

export function UserView() {
  const { userEmail, handleLogout } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-center h-full py-8">
      <div className="w-full max-w-sm rounded-3xl shadow-lg bg-base-300 px-6 py-6 text-center">
        <p className="text-sm text-base-content/70">
          {UI_TEXT.user.loggedInAs}
        </p>
        <p className="mt-2 text-base font-semibold break-all">
          {userEmail || UI_TEXT.common.unknown}
        </p>
        <button
          type="button"
          className="btn btn-outline w-full mt-6"
          onClick={() => handleLogout()}
        >
          {UI_TEXT.user.logoutButton}
        </button>
      </div>
    </div>
  );
}
