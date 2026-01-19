import { beforeEach, describe, expect, it, vi } from "vitest";
import { auth } from "./auth";
import {
  getClientSession,
  getServerSession,
  isAuthenticated,
  isAuthenticatedClient,
} from "./session";

vi.mock("./auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

describe("Session Utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getServerSession", () => {
    it("should return session when user is authenticated", async () => {
      const mockSession = {
        user: { id: "1", email: "test@example.com" },
      };
      (auth.api.getSession as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        mockSession,
      );

      const headers = new Headers();
      const session = await getServerSession(headers);

      expect(session).toEqual(mockSession);
      expect(auth.api.getSession).toHaveBeenCalledWith({ headers });
    });

    it("should return null when user is not authenticated", async () => {
      (auth.api.getSession as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        null,
      );

      const headers = new Headers();
      const session = await getServerSession(headers);

      expect(session).toBeNull();
    });

    it("should return null and log error on exception", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (auth.api.getSession as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Session error"),
      );

      const headers = new Headers();
      const session = await getServerSession(headers);

      expect(session).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting server session:",
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("getClientSession", () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it("should return session when API call succeeds", async () => {
      const mockSession = {
        user: { id: "1", email: "test@example.com" },
      };
      const mockResponse = {
        ok: true,
        json: async () => mockSession,
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        mockResponse,
      );

      const session = await getClientSession();

      expect(session).toEqual(mockSession);
      expect(global.fetch).toHaveBeenCalledWith("/api/auth/session");
    });

    it("should return null when API call fails", async () => {
      const mockResponse = {
        ok: false,
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        mockResponse,
      );

      const session = await getClientSession();

      expect(session).toBeNull();
    });

    it("should return null and log error on network error", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Network error"),
      );

      const session = await getClientSession();

      expect(session).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Error getting client session:",
        expect.any(Error),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("isAuthenticated", () => {
    it("should return true when user is authenticated", async () => {
      const mockSession = {
        user: { id: "1", email: "test@example.com" },
      };
      (auth.api.getSession as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        mockSession,
      );

      const headers = new Headers();
      const result = await isAuthenticated(headers);

      expect(result).toBe(true);
    });

    it("should return false when user is not authenticated", async () => {
      (auth.api.getSession as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        null,
      );

      const headers = new Headers();
      const result = await isAuthenticated(headers);

      expect(result).toBe(false);
    });

    it("should return false when session has no user", async () => {
      (auth.api.getSession as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        {},
      );

      const headers = new Headers();
      const result = await isAuthenticated(headers);

      expect(result).toBe(false);
    });

    it("should return false on error", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (auth.api.getSession as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Session error"),
      );

      const headers = new Headers();
      const result = await isAuthenticated(headers);

      expect(result).toBe(false);

      consoleErrorSpy.mockRestore();
    });
  });

  describe("isAuthenticatedClient", () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it("should return true when user is authenticated", async () => {
      const mockSession = {
        user: { id: "1", email: "test@example.com" },
      };
      const mockResponse = {
        ok: true,
        json: async () => mockSession,
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await isAuthenticatedClient();

      expect(result).toBe(true);
    });

    it("should return false when user is not authenticated", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({ user: null }),
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await isAuthenticatedClient();

      expect(result).toBe(false);
    });

    it("should return false when API call fails", async () => {
      const mockResponse = {
        ok: false,
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await isAuthenticatedClient();

      expect(result).toBe(false);
    });

    it("should return false on network error", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error("Network error"),
      );

      const result = await isAuthenticatedClient();

      expect(result).toBe(false);

      consoleErrorSpy.mockRestore();
    });

    it("should return false when session has no user", async () => {
      const mockResponse = {
        ok: true,
        json: async () => ({}),
      };
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await isAuthenticatedClient();

      expect(result).toBe(false);
    });
  });
});
