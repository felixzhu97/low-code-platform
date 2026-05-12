import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "../badge";

describe("Badge", () => {
  describe("Rendering", () => {
    it("renders with default variant", () => {
      render(<Badge>Default Badge</Badge>);
      const badge = screen.getByText("Default Badge");
      expect(badge).toBeInTheDocument();
    });

    it("renders with default className", () => {
      render(<Badge>Styled Badge</Badge>);
      const badge = screen.getByText("Styled Badge");
      expect(badge).toBeInTheDocument();
      expect(badge.tagName).toBe("DIV");
    });

    it("renders with custom className", () => {
      render(<Badge className="custom-badge">Custom</Badge>);
      const badge = screen.getByText("Custom");
      expect(badge).toHaveClass("custom-badge");
    });

    it("renders as div element", () => {
      render(<Badge>Div Badge</Badge>);
      const badge = screen.getByText("Div Badge");
      expect(badge.tagName).toBe("DIV");
    });

    it("renders with children correctly", () => {
      render(
        <Badge>
          <span>Child Element</span>
        </Badge>
      );
      expect(screen.getByText("Child Element")).toBeInTheDocument();
    });
  });

  describe("Variant Props", () => {
    it("renders with default variant", () => {
      const { container } = render(<Badge variant="default">Default</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with secondary variant", () => {
      const { container } = render(<Badge variant="secondary">Secondary</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with destructive variant", () => {
      const { container } = render(<Badge variant="destructive">Destructive</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with outline variant", () => {
      const { container } = render(<Badge variant="outline">Outline</Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies custom className alongside variant classes", () => {
      render(<Badge className="mt-2">With Margin</Badge>);
      const badge = screen.getByText("With Margin");
      expect(badge).toHaveClass("mt-2");
    });

    it("applies multiple custom classes", () => {
      render(<Badge className="px-4 py-2 text-lg">Large</Badge>);
      const badge = screen.getByText("Large");
      expect(badge).toHaveClass("px-4", "py-2", "text-lg");
    });
  });

  describe("Accessibility", () => {
    it("renders as a semantic div element", () => {
      render(<Badge>Semantic Badge</Badge>);
      const badge = screen.getByText("Semantic Badge");
      expect(badge.tagName).toBe("DIV");
    });

    it("can have role attribute", () => {
      render(<Badge role="status">Status Badge</Badge>);
      expect(screen.getByRole("status")).toBeInTheDocument();
    });

    it("can have aria-label", () => {
      render(<Badge aria-label="Notification count">5</Badge>);
      const badge = screen.getByText("5");
      expect(badge).toHaveAttribute("aria-label", "Notification count");
    });
  });

  describe("Additional Attributes", () => {
    it("renders with id attribute", () => {
      render(<Badge id="badge-1">ID Badge</Badge>);
      expect(screen.getByText("ID Badge")).toHaveAttribute("id", "badge-1");
    });

    it("renders with data attributes", () => {
      render(<Badge data-testid="custom-badge">Data Badge</Badge>);
      expect(screen.getByTestId("custom-badge")).toBeInTheDocument();
    });

    it("renders with data-* attributes", () => {
      render(<Badge data-variant="outline">Data Badge</Badge>);
      expect(screen.getByText("Data Badge")).toHaveAttribute("data-variant", "outline");
    });
  });

  describe("Edge Cases", () => {
    it("renders empty badge", () => {
      const { container } = render(<Badge></Badge>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders badge with long text", () => {
      const longText = "A very long text that might wrap to multiple lines";
      render(<Badge>{longText}</Badge>);
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("renders multiple badges", () => {
      render(
        <>
          <Badge>Badge 1</Badge>
          <Badge>Badge 2</Badge>
          <Badge>Badge 3</Badge>
        </>
      );
      expect(screen.getByText("Badge 1")).toBeInTheDocument();
      expect(screen.getByText("Badge 2")).toBeInTheDocument();
      expect(screen.getByText("Badge 3")).toBeInTheDocument();
    });

    it("renders badge with icons or special characters", () => {
      render(<Badge>★ Featured</Badge>);
      expect(screen.getByText("★ Featured")).toBeInTheDocument();
    });
  });
});
