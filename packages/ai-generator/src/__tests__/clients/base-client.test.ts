import { describe, it, expect, vi, beforeEach } from "vitest";
import { BaseAIClient } from "../../clients/base-client";
import { AIClientConfig, AIClientError } from "../../types";

// Create a concrete implementation for testing
class TestAIClient extends BaseAIClient {
  async generate(): Promise<string> {
    return "test response";
  }

  async *stream(): AsyncGenerator<string> {
    yield "test";
  }
}

describe("BaseAIClient", () => {
  describe("constructor", () => {
    it("should initialize with default config", () => {
      // Given/When
      const client = new TestAIClient({
        apiKey: "test-key",
      });

      // Then
      expect(client).toBeDefined();
    });

    it("should use provided config values", () => {
      // Given/When
      const client = new TestAIClient({
        apiKey: "test-key",
        timeout: 60000,
        maxRetries: 5,
      });

      // Then
      expect(client).toBeDefined();
    });
  });

  describe("generateJSON()", () => {
    it("should generate and parse JSON response", async () => {
      // Given
      const client = new TestAIClient({
        apiKey: "test-key",
      });
      const mockGenerate = vi
        .spyOn(client, "generate")
        .mockResolvedValue('{"id": "123", "type": "button"}');

      // When
      const result = await client.generateJSON(
        [{ role: "user", content: "test" }],
        {
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string" },
          },
        }
      );

      // Then
      expect(result).toEqual({ id: "123", type: "button" });
      mockGenerate.mockRestore();
    });

    it("should handle JSON in markdown code block", async () => {
      // Given
      const client = new TestAIClient({
        apiKey: "test-key",
      });
      const mockGenerate = vi
        .spyOn(client, "generate")
        .mockResolvedValue(
          '```json\n{"id": "123", "type": "button"}\n```'
        );

      // When
      const result = await client.generateJSON([{ role: "user", content: "test" }]);

      // Then
      expect(result).toEqual({ id: "123", type: "button" });
      mockGenerate.mockRestore();
    });
  });

  describe("generateJSON()", () => {
    it("should retry on retryable errors", async () => {
      // Given
      const client = new TestAIClient({
        apiKey: "test-key",
        maxRetries: 2,
        retryDelay: 10,
      });
      let attemptCount = 0;
      vi.spyOn(client, "generate").mockImplementation(async () => {
        attemptCount++;
        if (attemptCount < 2) {
          throw new AIClientError("Rate limited", 429);
        }
        return '{"id": "123"}';
      });

      // When
      const result = await client.generateJSON([]);

      // Then
      expect(result).toEqual({ id: "123" });
      expect(attemptCount).toBe(2);
    });
  });
});
