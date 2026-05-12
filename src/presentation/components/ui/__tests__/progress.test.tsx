import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Progress } from "../progress";

describe("Progress", () => {
  describe("Rendering", () => {
    it("renders progress element", () => {
      const { container } = render(<Progress />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      const { container } = render(<Progress className="custom-progress" />);
      expect(container.firstChild).toHaveClass("custom-progress");
    });
  });

  describe("Value Props", () => {
    it("renders with value prop", () => {
      const { container } = render(<Progress value={50} />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders without value (indeterminate)", () => {
      const { container } = render(<Progress />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Indicator Rendering", () => {
    it("renders indicator child element", () => {
      const { container } = render(<Progress value={50} />);
      const indicator = container.querySelector('[class*="bg-primary"]');
      expect(indicator).toBeInTheDocument();
    });

    it("indicator has correct transform for 50% value", () => {
      const { container } = render(<Progress value={50} />);
      const indicator = container.querySelector('[class*="bg-primary"]');
      expect(indicator).toHaveStyle({ transform: "translateX(-50%)" });
    });

    it("indicator has correct transform for 0% value", () => {
      const { container } = render(<Progress value={0} />);
      const indicator = container.querySelector('[class*="bg-primary"]');
      expect(indicator).toHaveStyle({ transform: "translateX(-100%)" });
    });
  });

  describe("Accessibility", () => {
    it("has progressbar role", () => {
      const { container } = render(<Progress />);
      expect(container.firstChild).toHaveAttribute("role", "progressbar");
    });

    it("supports aria-label", () => {
      const { container } = render(<Progress aria-label="Upload progress" />);
      expect(container.firstChild).toHaveAttribute("aria-label", "Upload progress");
    });
  });

  describe("Attributes", () => {
    it("renders with id attribute", () => {
      const { container } = render(<Progress id="progress-1" />);
      expect(container.firstChild).toHaveAttribute("id", "progress-1");
    });

    it("renders with data-testid", () => {
      const { container } = render(<Progress data-testid="test-progress" />);
      expect(container.firstChild).toHaveAttribute("data-testid", "test-progress");
    });
  });

  describe("Edge Cases", () => {
    it("handles null/undefined value gracefully", () => {
      const { container } = render(<Progress value={undefined as any} />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
