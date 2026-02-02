import { useState } from "react";
import { login, register } from "@api/auth";
import { useErrorFeedback } from "@/context/ToastFeedbackContext";

export function LoginView({
  setLoginToken,
  setUserEmail,
  setUserRole,
  onLoginSuccess,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const errorFeedback = useErrorFeedback();

  const parseJwtPayload = (token) => {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    try {
      const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(
        base64.length + ((4 - base64.length) % 4),
        "=",
      );
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  };

  const handleRegisterClick = async () => {
    try {
      await register({ email, password });
      await handleLoginClick();
    } catch (error) {
      errorFeedback(error?.detail || "An Error occured!");
    }
  };

  const handleLoginClick = async () => {
    try {
      const data = await login({ email, password });
      if (data?.token) {
        const parsed = parseJwtPayload(data.token);
        setLoginToken?.(data.token);
        setUserEmail?.(parsed.email);
        setUserRole?.(parsed.role);
        onLoginSuccess();
      }
    } catch (error) {
      errorFeedback(error?.detail || "An Error occured!");
    }
  };

  return (
    <div className="relative flex flex-col items-center pt-6 pb-8">
      <div className="w-full max-w-sm rounded-3xl shadow-lg bg-base-300 px-6 py-4 text-center">
        <p className="text-sm text-base-content/70">
          Bitte anmelden oder registrieren um fortzufahren.
        </p>
      </div>

      <div className="w-full max-w-sm flex-1 flex flex-col justify-center mt-12">
        <input
          type="email"
          placeholder="E-Mail"
          className="input input-bordered w-full"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Passwort"
          className="input input-bordered w-full mt-2"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="w-full flex gap-2 mt-4">
          <button
            type="button"
            className="btn btn-outline flex-1"
            onClick={handleRegisterClick}
          >
            Registrieren
          </button>
          <button
            type="button"
            className="btn btn-primary flex-1"
            onClick={handleLoginClick}
          >
            Einloggen
          </button>
        </div>
      </div>
    </div>
  );
}
