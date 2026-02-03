import { describe, it, expect, vi, beforeEach } from "vitest";
import { postSongWish } from "./wish";
import * as http from "./http";

vi.mock("@/config/api-config", () => ({
  API_ENDPOINT: {
    wishASong: "/api/wishes/songs",
  },
}));

describe("postSongWish", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls postJson mit token", async () => {
    const postJsonSpy = vi
      .spyOn(http, "postJson")
      .mockResolvedValue({ success: true });

    const data = { song: "test" };
    const token = "abc123";

    const result = await postSongWish({ data, token });

    expect(postJsonSpy).toHaveBeenCalledWith(
      "/api/wishes/songs",
      data,
      "Bearer abc123",
    );
    expect(result).toEqual({ success: true });
  });

  it("calls postJson without token", async () => {
    const postJsonSpy = vi
      .spyOn(http, "postJson")
      .mockResolvedValue({ success: true });

    await postSongWish({ data: { song: "test" } });

    const [, , token] = postJsonSpy.mock.lastCall;
    expect(token).toBeNull();
  });
});
