import { useState } from "react";
import { NavButton } from "./components/NavButton";
import { HomeView } from "./views/HomeView";
import { LoginView } from "./views/LoginView";
import { HostView } from "./views/HostView";
import { WishASongView } from "./views/WishASongView";
import { PlaylistView } from "./views/PlaylistView";
import { UserView } from "./views/UserView";

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [returnToView, setReturnToView] = useState(null);
  const [loginToken, setLoginToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const goToLogin = (fromView = "home") => {
    setReturnToView(fromView);
    setCurrentView("login");
  };

  const handleLoggedIn = () => {
    setCurrentView(returnToView || "home");
    setReturnToView(null);
  };

  const handleLogout = () => {
    setLoginToken(null);
    setUserEmail(null);
    setUserRole(null);
    setReturnToView(null);
    setCurrentView("login");
  };

  return (
    <div className="h-dvh flex flex-col bg-base-100 text-base-content overflow-hidden">
      {/* fixer Header */}
      <header className="h-14 flex items-center justify-center bg-base-200 shadow sticky top-0 z-20">
        <h1 className="text-lg font-semibold">Radio App</h1>
      </header>

      {/* scrollbarer Mittelteil, strikt begrenzt */}
      <main className="flex-1 overflow-y-auto px-4">
        {currentView === "home" && (
          <HomeView
            loginToken={loginToken}
            goToLogin={() => goToLogin("home")}
          />
        )}
        {currentView === "playlist" && (
          <PlaylistView
            loginToken={loginToken}
            goToLogin={() => goToLogin("playlist")}
          />
        )}
        {currentView === "wishes" &&
          (userRole === "Host" ? (
            <HostView
              loginToken={loginToken}
              goToLogin={() => goToLogin("wishes")}
            />
          ) : (
            <WishASongView
              loginToken={loginToken}
              goToLogin={() => goToLogin("wishes")}
            />
          ))}
        {currentView === "login" && (
          <LoginView
            setLoginToken={setLoginToken}
            setUserEmail={setUserEmail}
            setUserRole={setUserRole}
            onLoginSuccess={handleLoggedIn}
          />
        )}
        {currentView === "user" && (
          <UserView userEmail={userEmail} onLogout={handleLogout} />
        )}
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
          label="Wünsche"
          active={currentView === "wishes"}
          onClick={() => setCurrentView("wishes")}
        />
        <NavButton
          label={loginToken ? "User" : "Login"}
          active={loginToken ? currentView === "user" : currentView === "login"}
          onClick={() =>
            loginToken ? setCurrentView("user") : goToLogin(currentView)
          }
        />
      </nav>
    </div>
  );
}

export default App;
