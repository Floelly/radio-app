import { describe, it, expect, vi, beforeEach } from "vitest";
import * as http from "./http";

vi.mock("@/config/api-config", () => ({
  API_ENDPOINT: {
    postPlaylistFeedback: "/api/feedback/playlist",
    postHostFeedback: "/api/feedback/host",
    getLiveFeedback: "/api/feedback/live",
  },
}));
vi.mock("./auth", () => ({
  attachToken: vi.fn((token) => `waddehaddedudeda ${token}`),
}));

const postJsonSpy = vi.spyOn(http, "postJson");
const getJsonSpy = vi.spyOn(http, "getJson");

describe("Feedback API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    postJsonSpy.mockResolvedValue({ success: true });
    getJsonSpy.mockResolvedValue({ feedback: [] });
  });

  describe("postFeedbackPlaylist", () => {
    it("calls postJson with valid playlist rating and token", async () => {
      const { postFeedbackPlaylist } = await import("./feedback");
      const playlistData = { thumbsUp: true, comment: "Great mix!" };
      const userToken = "xyz789";

      await postFeedbackPlaylist({ data: playlistData, token: userToken });

      expect(postJsonSpy).toHaveBeenCalledWith(
        "/api/feedback/playlist",
        playlistData,
        "waddehaddedudeda xyz789",
      );
    });

    it("calls postJson without auth header when token omitted", async () => {
      const { postFeedbackPlaylist } = await import("./feedback");
      const playlistData = { rating: 3 };

      await postFeedbackPlaylist({ data: playlistData });

      const [, , authHeader] = postJsonSpy.mock.lastCall;
      expect(authHeader).toBeNull();
    });
  });

  describe("postFeedbackHost", () => {
    it("calls postJson with host feedback data and authorization", async () => {
      const { postFeedbackHost } = await import("./feedback");
      const hostData = { energy: "high", voice: "clear" };
      const sessionToken = "session-456";

      await postFeedbackHost({ data: hostData, token: sessionToken });

      expect(postJsonSpy).toHaveBeenCalledWith(
        "/api/feedback/host",
        hostData,
        "waddehaddedudeda session-456",
      );
    });

    it("calls postJson without authorization for anonymous host feedback", async () => {
      const { postFeedbackHost } = await import("./feedback");
      const hostData = { funny: true };

      await postFeedbackHost({ data: hostData });

      const [, , authHeader] = postJsonSpy.mock.lastCall;
      expect(authHeader).toBeNull();
    });
  });

  describe("getLiveFeedback", () => {
    it("calls getJson with timestamp since and auth token", async () => {
      const { getLiveFeedback } = await import("./feedback");
      const timestamp = Date.now() - 60000; // 1 min ago
      const listenerToken = "listener-999";

      await getLiveFeedback({ since: timestamp, token: listenerToken });

      expect(getJsonSpy).toHaveBeenCalledWith(
        "/api/feedback/live",
        { since: timestamp },
        "waddehaddedudeda listener-999",
      );
    });

    it("calls getJson with null payload when since omitted", async () => {
      const { getLiveFeedback } = await import("./feedback");
      const listenerToken = "listener-999";

      await getLiveFeedback({ token: listenerToken });

      expect(getJsonSpy.mock.calls[0][1]).toBeNull();
    });

    it("calls getJson without auth when token missing", async () => {
      const { getLiveFeedback } = await import("./feedback");
      const recentTimestamp = 1700000000;

      await getLiveFeedback({ since: recentTimestamp });

      const [, payload, authHeader] = getJsonSpy.mock.lastCall;
      expect(payload).toEqual({ since: recentTimestamp });
      expect(authHeader).toBeNull();
    });
  });
});
