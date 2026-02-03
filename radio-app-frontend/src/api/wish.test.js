import { describe, it, expect, vi, beforeEach } from "vitest";
import * as http from "./http";

vi.mock("@/config/api-config", () => ({
  API_ENDPOINT: {
    wishASong: "/api/wishes/songs",
  },
}));
vi.mock("./auth", () => ({
  attachToken: vi.fn((token) => `WUFF ${token}`),
}));

const postJsonSpy = vi.spyOn(http, "postJson");

describe("postSongWish", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    postJsonSpy.mockResolvedValue({ success: true });
  });

  it("calls postJson mit token", async () => {
    const { postSongWish } = await import("./wish");
    const data = { song: "test" };
    const token = "abc123";

    const result = await postSongWish({ data, token });

    expect(postJsonSpy).toHaveBeenCalledWith(
      "/api/wishes/songs",
      data,
      "WUFF abc123",
    );
    expect(result).toEqual({ success: true });
  });

  it("calls postJson without token", async () => {
    const { postSongWish } = await import("./wish");
    await postSongWish({ data: { song: "test" } });

    const [, , tokenArg] = postJsonSpy.mock.lastCall;
    expect(tokenArg).toBeNull();
  });
});
