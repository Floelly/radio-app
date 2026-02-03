import { test, expect } from "@playwright/test";
import { UI_TEXT } from "@/config/config.js";
import { API_ENDPOINT } from "@/config/api-config.js";

test("user can login and rate playlist", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: UI_TEXT.app.nav.login }).click();

  await page.locator('input[type="email"]').fill("user@someemail.com");
  await page.locator('input[type="password"]').fill("user123");

  const loginResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes(API_ENDPOINT.postLogin) &&
      response.request().method() === "POST"
    );
  });

  await page.getByRole("button", { name: UI_TEXT.login.loginButton }).click();
  await loginResponsePromise;

  await expect(
    page.getByRole("button", { name: UI_TEXT.app.nav.user }),
  ).toBeVisible();

  await page.getByRole("button", { name: UI_TEXT.app.nav.playlist }).click();
  await expect(
    page.getByText(UI_TEXT.playlist.currentPlaylistTitle),
  ).toBeVisible();

  const feedbackResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes(API_ENDPOINT.postPlaylistFeedback) &&
      response.request().method() === "POST"
    );
  });

  await page.getByRole("button", { name: UI_TEXT.common.thumbsUp }).click();

  const feedbackResponse = await feedbackResponsePromise;
  expect(feedbackResponse.ok()).toBe(true);
  const feedbackBody = await feedbackResponse.json();
  expect(feedbackBody).toEqual({ success: true });
});
