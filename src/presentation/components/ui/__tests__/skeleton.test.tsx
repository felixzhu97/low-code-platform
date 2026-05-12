import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Skeleton } from "../skeleton";

describe("Skeleton", () => {
  describe("Rendering", () => {
    it("renders skeleton element", () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders as div element", () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild?.tagName).toBe("DIV");
    });

    it("renders with custom className", () => {
      const { container } = render(<Skeleton className="custom-skeleton" />);
      expect(container.firstChild).toHaveClass("custom-skeleton");
    });
  });

  describe("Default Styling", () => {
    it("applies animate-pulse class", () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toHaveClass("animate-pulse");
    });

    it("applies rounded-md class", () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toHaveClass("rounded-md");
    });

    it("applies bg-muted class", () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toHaveClass("bg-muted");
    });
  });

  describe("Custom Styling", () => {
    it("applies custom width class", () => {
      const { container } = render(<Skeleton className="w-full" />);
      expect(container.firstChild).toHaveClass("w-full");
    });

    it("applies custom height class", () => {
      const { container } = render(<Skeleton className="h-4" />);
      expect(container.firstChild).toHaveClass("h-4");
    });

    it("applies rounded-full class", () => {
      const { container } = render(<Skeleton className="rounded-full" />);
      expect(container.firstChild).toHaveClass("rounded-full");
    });

    it("applies multiple custom classes", () => {
      const { container } = render(<Skeleton className="w-32 h-32 rounded-full" />);
      const skeleton = container.firstChild;
      expect(skeleton).toHaveClass("w-32", "h-32", "rounded-full");
    });
  });

  describe("Attributes", () => {
    it("renders with id attribute", () => {
      const { container } = render(<Skeleton id="skeleton-1" />);
      expect(container.firstChild).toHaveAttribute("id", "skeleton-1");
    });

    it("renders with data-testid attribute", () => {
      const { container } = render(<Skeleton data-testid="custom-skeleton" />);
      expect(container.firstChild).toHaveAttribute("data-testid", "custom-skeleton");
    });

    it("renders with style attribute", () => {
      const { container } = render(<Skeleton style={{ width: "100px", height: "20px" }} />);
      expect(container.firstChild).toHaveStyle({ width: "100px", height: "20px" });
    });
  });

  describe("Use Cases", () => {
    it("renders as text line placeholder", () => {
      const { container } = render(<Skeleton className="h-4 w-full" />);
      expect(container.firstChild).toHaveClass("h-4", "w-full");
    });

    it("renders as avatar placeholder", () => {
      const { container } = render(<Skeleton className="h-12 w-12 rounded-full" />);
      expect(container.firstChild).toHaveClass("h-12", "w-12", "rounded-full");
    });

    it("renders as card placeholder", () => {
      const { container } = render(<Skeleton className="h-32 w-full rounded-lg" />);
      expect(container.firstChild).toHaveClass("h-32", "w-full", "rounded-lg");
    });

    it("renders multiple skeletons for content list", () => {
      render(
        <>
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </>
      );

      const skeletons = document.querySelectorAll(".animate-pulse.rounded-md.bg-muted");
      expect(skeletons).toHaveLength(3);
    });
  });

  describe("Accessibility", () => {
    it("can have role attribute", () => {
      const { container } = render(<Skeleton role="status" />);
      expect(container.firstChild).toHaveAttribute("role", "status");
    });

    it("can have aria-label", () => {
      const { container } = render(<Skeleton aria-label="Loading content" />);
      expect(container.firstChild).toHaveAttribute("aria-label", "Loading content");
    });

    it("can be hidden from screen readers", () => {
      const { container } = render(<Skeleton aria-hidden="true" />);
      expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("Edge Cases", () => {
    it("renders with no className", () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with empty className", () => {
      const { container } = render(<Skeleton className="" />);
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
