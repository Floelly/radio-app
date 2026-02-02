import { useAppContext } from "@context/AppContext";
import { UI_TEXT } from "@config";
import { HeaderCard } from "@components/BasicCard";
import { Button } from "@components/Button";

export function UserView() {
  const { userEmail, handleLogout } = useAppContext();

  return (
    <div className="flex flex-col items-center justify-center h-full py-8">
      <HeaderCard>
        <p className="text-sm text-base-content/70">
          {UI_TEXT.user.loggedInAs}
        </p>
        <p className="mt-2 text-base font-semibold break-all mb-6">
          {userEmail || UI_TEXT.common.unknown}
        </p>
        <Button
          subtle
          text={UI_TEXT.user.logoutButton}
          onClick={handleLogout}
        />
      </HeaderCard>
    </div>
  );
}
