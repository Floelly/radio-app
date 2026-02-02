import { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAuth must be inside AppContextProvider");
  return context;
};

export const AppContextProvider = ({ children }) => {
  const [currentView, setCurrentView] = useState("home");
  const [returnToView, setReturnToView] = useState(null);
  const [loginToken, setLoginToken] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Funktionen stabilisieren (useCallback vs. stale closures)
  const goToLogin = useCallback((fromView = "home") => {
    setReturnToView(fromView);
    setCurrentView("login");
  }, []);

  const handleLoggedIn = useCallback(() => {
    setCurrentView(returnToView || "home");
    setReturnToView(null);
  }, [returnToView]);

  const handleLogout = useCallback(() => {
    setLoginToken(null);
    setUserEmail(null);
    setUserRole(null);
    setReturnToView(null);
    setCurrentView("login");
  }, []);

  const isLoggedIn = !!loginToken;
  const isHost = isLoggedIn && userRole === "Host";

  return (
    <AppContext.Provider
      value={{
        currentView,
        loginToken,
        userEmail,
        userRole,
        returnToView,
        isLoggedIn,
        isHost,
        setLoginToken,
        setUserEmail,
        setUserRole,
        setCurrentView,
        goToLogin,
        handleLoggedIn,
        handleLogout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
