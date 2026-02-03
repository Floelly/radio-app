import { describe, it, expect, vi, beforeEach } from "vitest";
import * as httpMod from "./http";

vi.mock("@config", () => ({
  BACKEND_BASE_URL: "https://api.radio.de",
  UI_TEXT: {
    common: { genericError: "Something went wrong" },
  },
}));

describe("HTTP Utilities", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    window.fetch = mockFetch;
  });

  describe("postJson", () => {
    it("resolves backend url", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await httpMod.postJson("/api/test", { data: 1 });

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.radio.de/api/test",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ data: 1 }),
        }),
      );
    });

    it("includes Authorization header when provided", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });

      await httpMod.postJson("/api/test", { data: 1 }, "Bearer token123");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.radio.de/api/test",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer token123",
          }),
        }),
      );
    });

    it("throws error on non-ok response with error data", async () => {
      const errorData = { error: "Server error", code: 400 };
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorData),
      });

      await expect(
        httpMod.postJson("/api/test", { data: 1 }),
      ).rejects.toThrow();
    });

    it("throws an error on json parse failure", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("JSON parse error")),
      });

      await expect(
        httpMod.postJson("/api/test", { data: 1 }),
      ).rejects.toThrowError();
    });

    it("handles empty error response gracefully", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      });

      await expect(
        httpMod.postJson("/api/test", { data: 1 }),
      ).rejects.toThrow();
    });

    it("returns parsed JSON data on successful response", async () => {
      const expectedData = { id: 123, message: "success" };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(expectedData),
      });

      const result = await httpMod.postJson("/api/test", { data: 1 });

      expect(result).toEqual(expectedData);
    });
  });

  describe("getJson", () => {
    it("resolves backend url without query when no payload is given", async () => {
      const mockResponseData = { foo: "bar" };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponseData),
      });

      const result = await httpMod.getJson("/api/test");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.radio.de/api/test",
        expect.objectContaining({
          method: "GET",
          headers: {},
        }),
      );
      expect(result).toEqual(mockResponseData);
    });

    it("appends query string when payload is provided", async () => {
      const mockResponseData = { foo: "bar" };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponseData),
      });

      const payload = { a: "1", b: "2" };
      await httpMod.getJson("/api/test", payload);

      const query = new URLSearchParams(payload).toString();
      expect(mockFetch).toHaveBeenCalledWith(
        `https://api.radio.de/api/test?${query}`,
        expect.objectContaining({
          method: "GET",
        }),
      );
    });

    it("includes Authorization header when provided", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ foo: "bar" }),
      });

      await httpMod.getJson("/api/test", null, "Bearer token123");

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.radio.de/api/test",
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Authorization: "Bearer token123",
          }),
        }),
      );
    });

    it("throws error on non-ok response with error data (except 304)", async () => {
      const errorData = { error: "Server error", code: 400 };
      mockFetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve(errorData),
      });

      await expect(httpMod.getJson("/api/test")).rejects.toThrow();
    });

    it("does not throw on 304 response and returns parsed data", async () => {
      const mockResponseData = {};
      mockFetch.mockResolvedValue({
        ok: false,
        status: 304,
        json: () => Promise.resolve(mockResponseData),
      });

      const result = await httpMod.getJson("/api/test");

      expect(result).toEqual(mockResponseData);
    });

    it("throws an error on json parse failure", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.reject(new Error("JSON parse error")),
      });

      await expect(httpMod.getJson("/api/test")).rejects.toThrowError();
    });

    it("handles empty error response gracefully", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      });

      await expect(httpMod.getJson("/api/test")).rejects.toThrow();
    });
  });
});
