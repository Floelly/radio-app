import { useState } from "react";
import { login, register } from "@api/auth";
import { useAppContext } from "@context/AppContext";
import { useFeedbackContext } from "@context/ToastFeedbackContext";
import { UI_TEXT } from "@config";
import { HeaderCard } from "@components/BasicCard";
import { Button } from "@components/Button";
import { ContentWrapper } from "@components/Wrapper";

export function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { showError } = useFeedbackContext();
  const { setLoginToken, setUserEmail, setUserRole, handleLoggedIn } =
    useAppContext();

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
      showError(error?.detail || UI_TEXT.common.genericError);
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
        handleLoggedIn();
      }
    } catch (error) {
      showError(error?.detail || UI_TEXT.common.genericError);
    }
  };

  return (
    <ContentWrapper>
      <h1 className="sr-only">login</h1>
      <HeaderCard>
        <p className="text-sm text-base-content/70">
          {UI_TEXT.login.instruction}
        </p>
      </HeaderCard>

      <div className="w-full max-w-sm flex-1 flex flex-col mt-12 gap-2">
        <input
          type="email"
          placeholder={UI_TEXT.login.emailPlaceholder}
          className="input input-bordered w-full"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder={UI_TEXT.login.passwordPlaceholder}
          className="input input-bordered w-full"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />

        <div className="flex gap-2 mt-2">
          <Button
            subtle
            text={UI_TEXT.login.registerButton}
            className="flex-1"
            onClick={handleRegisterClick}
          />
          <Button
            highlighted
            text={UI_TEXT.login.loginButton}
            className="flex-1"
            onClick={handleLoginClick}
          />
        </div>
      </div>
    </ContentWrapper>
  );
}
