import { NavButton } from "./components/Button";
import { HomeView } from "./views/HomeView";
import { LoginView } from "./views/LoginView";
import { HostView } from "./views/HostView";
import { WishASongView } from "./views/WishASongView";
import { PlaylistView } from "./views/PlaylistView";
import { UserView } from "./views/UserView";
import { useAppContext } from "@context/AppContext";
import { useFeedbackContext } from "@context/ToastFeedbackContext";
import { LOGIN_REQUIRED_TOAST_MESSAGE, UI_TEXT } from "@config";

function App() {
  const { currentView, isLoggedIn, goToLogin, userRole, setCurrentView } =
    useAppContext();
  const { showSuccess } = useFeedbackContext();

  const notifyLoginRequired = () => {
    goToLogin("feedback");
    showSuccess(LOGIN_REQUIRED_TOAST_MESSAGE);
  };

  const renderView = (currentView, userRole) => {
    switch (currentView) {
      case "home":
        return <HomeView />;
      case "playlist":
        return <PlaylistView />;
      case "feedback":
        return userRole === "Host" ? <HostView /> : <WishASongView />;
      case "login":
        return <LoginView />;
      case "user":
        return <UserView />;
      default:
        return <HomeView />;
    }
  };

  const getViewAnnouncement = (view) => {
    switch (view) {
      case "home":
      case "playlist":
      case "feedback":
      case "login":
      case "user":
        return view;
      default:
        return "home";
    }
  };

  return (
    <div className="h-dvh flex flex-col bg-base-100 text-base-content overflow-hidden">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {getViewAnnouncement(currentView)}
      </div>

      {/* fixer Header */}
      <header className="h-14 flex items-center justify-center bg-base-200 shadow sticky top-0 z-20">
        <h1 className="text-lg font-semibold">{UI_TEXT.app.title}</h1>
      </header>

      {/* scrollbarer Mittelteil, strikt begrenzt */}
      <main className="flex-1 overflow-y-auto px-4">
        {renderView(currentView, userRole)}
      </main>

      {/* fixe Bottom-Navigation */}
      <nav className="h-16 bg-base-200 border-t border-base-300 flex sticky bottom-0 z-20">
        <NavButton
          label={UI_TEXT.app.nav.home}
          active={currentView === "home"}
          onClick={() => setCurrentView("home")}
        />
        <NavButton
          label={UI_TEXT.app.nav.playlist}
          active={currentView === "playlist"}
          onClick={() => setCurrentView("playlist")}
        />
        <NavButton
          label={
            isLoggedIn && userRole === "Host"
              ? UI_TEXT.app.nav.feedback
              : UI_TEXT.app.nav.songWish
          }
          active={currentView === "feedback"}
          onClick={() =>
            isLoggedIn ? setCurrentView("feedback") : notifyLoginRequired()
          }
        />
        <NavButton
          label={isLoggedIn ? UI_TEXT.app.nav.user : UI_TEXT.app.nav.login}
          active={isLoggedIn ? currentView === "user" : currentView === "login"}
          onClick={() =>
            isLoggedIn ? setCurrentView("user") : goToLogin(currentView)
          }
        />
      </nav>
    </div>
  );
}

export default App;
