import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { predictLaya, clearLayaCache, getLayaCacheSize } from "./client";
import { SHOT_FRAMING_SCHEMA } from "./schemas";
import { auditPromptWithLaya, auditPromptText } from "@/lib/compiler/prompt-auditor";
import { inferStoryFormat } from "@/lib/compiler/story-format";

describe("Laya Client & Engine Integration", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    clearLayaCache();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe("predictLaya client wrapper", () => {
    it("returns null on empty text or empty schema", async () => {
      expect(await predictLaya("", SHOT_FRAMING_SCHEMA)).toBeNull();
      expect(await predictLaya("   ", SHOT_FRAMING_SCHEMA)).toBeNull();
      expect(await predictLaya("hello", {})).toBeNull();
    });

    it("returns parsed json on successful response", async () => {
      const mockResult = {
        answers: {
          framing: { choice: "CU", confidence: 0.95 },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResult,
      });

      const res = await predictLaya("Tears well up in her eyes in an emotional close-up.", SHOT_FRAMING_SCHEMA);
      expect(res).toEqual(mockResult);
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it("serves subsequent identical calls from in-memory cache", async () => {
      const mockResult = {
        answers: {
          framing: { choice: "WS", confidence: 0.9 },
        },
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResult,
      });

      const text = "A wide mountain landscape with sunset";
      const res1 = await predictLaya(text, SHOT_FRAMING_SCHEMA);
      const res2 = await predictLaya(text, SHOT_FRAMING_SCHEMA);

      expect(res1).toEqual(mockResult);
      expect(res2).toEqual(mockResult);
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(getLayaCacheSize()).toBe(1);
    });

    it("returns null gracefully on network failure without throwing", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network connection refused"));

      const res = await predictLaya("Some prompt", SHOT_FRAMING_SCHEMA);
      expect(res).toBeNull();
    });

    it("returns null gracefully when server responds with 500 error", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const res = await predictLaya("Some prompt", SHOT_FRAMING_SCHEMA);
      expect(res).toBeNull();
    });

    it("handles timeout abort cleanly", async () => {
      global.fetch = vi.fn().mockImplementation((_url, options) => {
        return new Promise((_, reject) => {
          options?.signal?.addEventListener("abort", () => {
            reject(new DOMException("The operation was aborted.", "AbortError"));
          });
        });
      });

      const res = await predictLaya("Test timeout", SHOT_FRAMING_SCHEMA);
      expect(res).toBeNull();
    });
  });

  describe("auditPromptWithLaya", () => {
    it("falls back to sync audit when Laya is offline / returns null", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Server offline"));

      const prompt = "The character walks slowly into the dimly lit room.";
      const syncIssues = auditPromptText(prompt, "veo");
      const layaIssues = await auditPromptWithLaya(prompt, "veo");

      expect(layaIssues).toEqual(syncIssues);
      expect(layaIssues.some((i) => i.id === "generic_identity")).toBe(true);
    });

    it("flags critical wardrobe_transition when Laya noul > 0.65", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          answers: {
            wardrobe_transition: { noul: 0.88 },
            generic_identity: { noul: 0.1 },
          },
        }),
      });

      const prompt = "Priya enters wearing a coat and transforms into a red gala dress.";
      const issues = await auditPromptWithLaya(prompt, "runway_gen4");

      const wardrobeIssue = issues.find((i) => i.id === "wardrobe_transition");
      expect(wardrobeIssue).toBeDefined();
      expect(wardrobeIssue?.severity).toBe("critical");
    });

    it("flags generic_identity when Laya noul > 0.70 and deduplicates", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          answers: {
            wardrobe_transition: { noul: 0.1 },
            generic_identity: { noul: 0.92 },
          },
        }),
      });

      const prompt = "The woman glances nervously at the clock.";
      const issues = await auditPromptWithLaya(prompt, "google_flow");

      const genericIssues = issues.filter((i) => i.id === "generic_identity");
      expect(genericIssues.length).toBe(1);
      expect(genericIssues[0].severity).toBe("warning");
    });

    it("returns empty_prompt issue without invoking Laya if prompt is empty", async () => {
      global.fetch = vi.fn();
      const issues = await auditPromptWithLaya("   ", "veo");

      expect(issues.length).toBe(1);
      expect(issues[0].id).toBe("empty_prompt");
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe("inferStoryFormat", () => {
    it("returns predicted mode when Laya returns slice_of_life", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          answers: {
            mode: { choice: "slice_of_life" },
          },
        }),
      });

      const result = await inferStoryFormat("Making chai on a quiet rainy morning.");
      expect(result).toEqual({ mode: "slice_of_life" });
    });

    it("returns predicted mode when Laya returns cinematic", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          answers: {
            mode: { choice: "cinematic" },
          },
        }),
      });

      const result = await inferStoryFormat("High-stakes rooftop chase during an eclipse.");
      expect(result).toEqual({ mode: "cinematic" });
    });

    it("falls back gracefully when Laya is offline", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Connection refused"));

      const routineResult = await inferStoryFormat("Morning coffee and commute routine");
      expect(routineResult).toEqual({ mode: "slice_of_life" });

      const dramaticResult = await inferStoryFormat("Explosive space dogfight");
      expect(dramaticResult).toEqual({ mode: "cinematic" });
    });
  });
});
