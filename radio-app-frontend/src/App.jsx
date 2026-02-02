import { NavButton } from "./components/NavButton";
import { HomeView } from "./views/HomeView";
import { LoginView } from "./views/LoginView";
import { HostView } from "./views/HostView";
import { WishASongView } from "./views/WishASongView";
import { PlaylistView } from "./views/PlaylistView";
import { UserView } from "./views/UserView";
import { useAppContext } from "@context/AppContext";
import { useFeedbackContext } from "@context/ToastFeedbackContext";

function App() {
  const { currentView, isLoggedIn, goToLogin, userRole, setCurrentView } =
    useAppContext();
  const { showError } = useFeedbackContext();

  const notifyLoginRequired = () => {
    showError("Bitte zuerst einloggen.");
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

  return (
    <div className="h-dvh flex flex-col bg-base-100 text-base-content overflow-hidden">
      {/* fixer Header */}
      <header className="h-14 flex items-center justify-center bg-base-200 shadow sticky top-0 z-20">
        <h1 className="text-lg font-semibold">Radio App</h1>
      </header>

      {/* scrollbarer Mittelteil, strikt begrenzt */}
      <main className="flex-1 overflow-y-auto px-4">
        {renderView(currentView, userRole)}
      </main>

      {/* fixe Bottom-Navigation */}
      <nav className="h-16 bg-base-200 border-t border-base-300 flex sticky bottom-0 z-20">
        <NavButton
          label="Home"
          active={currentView === "home"}
          onClick={() => setCurrentView("home")}
        />
        <NavButton
          label="Playlist"
          active={currentView === "playlist"}
          onClick={() => setCurrentView("playlist")}
        />
        <NavButton
          label={isLoggedIn && userRole === "Host" ? "Feedback" : "Liedwunsch"}
          active={currentView === "feedback"}
          onClick={() =>
            isLoggedIn ? setCurrentView("feedback") : notifyLoginRequired()
          }
        />
        <NavButton
          label={isLoggedIn ? "User" : "Login"}
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
