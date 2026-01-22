import { describe, it, expect } from "vitest";
import { ComponentValidator } from "../../validators";
import { ValidationError } from "../../types";

describe("ComponentValidator", () => {
  describe("validate()", () => {
    it("should pass validation for valid component", () => {
      // Given
      const validator = new ComponentValidator();
      const component = {
        id: "comp_123",
        type: "button",
        name: "Test Button",
      };

      // When/Then - should not throw
      expect(() => validator.validate(component)).not.toThrow();
    });

    it("should throw ValidationError for missing id", () => {
      // Given
      const validator = new ComponentValidator();
      const component = {
        type: "button",
        name: "Test Button",
      };

      // When/Then
      expect(() => validator.validate(component)).toThrow(ValidationError);
    });

    it("should throw ValidationError for missing type", () => {
      // Given
      const validator = new ComponentValidator();
      const component = {
        id: "comp_123",
        name: "Test Button",
      };

      // When/Then
      expect(() => validator.validate(component)).toThrow(ValidationError);
    });

    it("should throw ValidationError for missing name", () => {
      // Given
      const validator = new ComponentValidator();
      const component = {
        id: "comp_123",
        type: "button",
      };

      // When/Then
      expect(() => validator.validate(component)).toThrow(ValidationError);
    });

    it("should throw ValidationError for invalid position", () => {
      // Given
      const validator = new ComponentValidator();
      const component = {
        id: "comp_123",
        type: "button",
        name: "Test Button",
        position: { x: "invalid" }, // invalid position
      };

      // When/Then
      expect(() => validator.validate(component)).toThrow(ValidationError);
    });
  });

  describe("validateArray()", () => {
    it("should pass validation for valid component array", () => {
      // Given
      const validator = new ComponentValidator();
      const components = [
        { id: "comp_1", type: "button", name: "Button 1" },
        { id: "comp_2", type: "text", name: "Text 1" },
      ];

      // When/Then
      expect(() => validator.validateArray(components)).not.toThrow();
    });

    it("should throw ValidationError for non-array input", () => {
      // Given
      const validator = new ComponentValidator();
      const notArray = { id: "comp_1", type: "button", name: "Button" };

      // When/Then
      expect(() => validator.validateArray(notArray as any)).toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError when array contains invalid component", () => {
      // Given
      const validator = new ComponentValidator();
      const components = [
        { id: "comp_1", type: "button", name: "Button 1" },
        { type: "text", name: "Text 1" }, // missing id
      ];

      // When/Then
      expect(() => validator.validateArray(components)).toThrow(ValidationError);
    });
  });
});
