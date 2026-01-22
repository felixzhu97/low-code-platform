import { describe, it, expect } from "vitest";
import { ComponentPromptBuilder } from "../../prompts";

describe("ComponentPromptBuilder", () => {
  describe("buildSystemPrompt()", () => {
    it("should return system prompt with component information", () => {
      // Given
      const builder = new ComponentPromptBuilder();

      // When
      const prompt = builder.buildSystemPrompt();

      // Then
      expect(prompt).toContain("AI assistant");
      expect(prompt).toContain("component");
      expect(typeof prompt).toBe("string");
      expect(prompt.length).toBeGreaterThan(0);
    });
  });

  describe("buildComponentPrompt()", () => {
    it("should build prompt with description", () => {
      // Given
      const builder = new ComponentPromptBuilder();
      const options = {
        description: "Create a blue button",
      };

      // When
      const prompt = builder.buildComponentPrompt(options);

      // Then
      expect(prompt).toContain("Create a blue button");
    });

    it("should include component type when provided", () => {
      // Given
      const builder = new ComponentPromptBuilder();
      const options = {
        description: "Create a button",
        type: "button",
      };

      // When
      const prompt = builder.buildComponentPrompt(options);

      // Then
      expect(prompt).toContain("button");
    });

    it("should include position when provided", () => {
      // Given
      const builder = new ComponentPromptBuilder();
      const options = {
        description: "Create a button",
        position: { x: 100, y: 200 },
      };

      // When
      const prompt = builder.buildComponentPrompt(options);

      // Then
      expect(prompt).toContain("100");
      expect(prompt).toContain("200");
    });

    it("should include context when provided", () => {
      // Given
      const builder = new ComponentPromptBuilder();
      const options = {
        description: "Create a button",
        context: {
          existingComponents: [
            { id: "comp_1", type: "button", name: "Button 1" },
          ],
        },
      };

      // When
      const prompt = builder.buildComponentPrompt(options);

      // Then
      expect(prompt).toContain("现有组件");
    });
  });

  describe("isValidComponentType()", () => {
    it("should return true for valid component types", () => {
      // Given
      const builder = new ComponentPromptBuilder();

      // When/Then
      expect(builder.isValidComponentType("button")).toBe(true);
      expect(builder.isValidComponentType("input")).toBe(true);
      expect(builder.isValidComponentType("form")).toBe(true);
    });

    it("should return false for invalid component types", () => {
      // Given
      const builder = new ComponentPromptBuilder();

      // When/Then
      expect(builder.isValidComponentType("invalid-type")).toBe(false);
      expect(builder.isValidComponentType("")).toBe(false);
    });
  });
});
