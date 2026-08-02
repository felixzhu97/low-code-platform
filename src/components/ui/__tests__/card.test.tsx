import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../card";

describe("Card", () => {
  describe("Card Rendering", () => {
    it("renders card with default props", () => {
      render(<Card>Card Content</Card>);
      const card = screen.getByText("Card Content");
      expect(card).toBeInTheDocument();
    });

    it("renders as div element", () => {
      render(<Card>Div Card</Card>);
      const card = screen.getByText("Div Card");
      expect(card.tagName).toBe("DIV");
    });

    it("renders with custom className", () => {
      render(<Card className="custom-card">Custom Card</Card>);
      const card = screen.getByText("Custom Card");
      expect(card).toHaveClass("custom-card");
    });

    it("renders with id attribute", () => {
      render(<Card id="card-1">ID Card</Card>);
      expect(screen.getByText("ID Card")).toHaveAttribute("id", "card-1");
    });

    it("renders with data attributes", () => {
      render(<Card data-testid="test-card">Data Card</Card>);
      expect(screen.getByTestId("test-card")).toBeInTheDocument();
    });
  });

  describe("CardHeader Rendering", () => {
    it("renders card header", () => {
      render(<CardHeader>Header Content</CardHeader>);
      expect(screen.getByText("Header Content")).toBeInTheDocument();
    });

    it("renders with default className", () => {
      const { container } = render(<CardHeader>Header</CardHeader>);
      expect(container.firstChild).toHaveClass("flex", "flex-col", "space-y-1.5", "p-6");
    });

    it("renders with custom className", () => {
      render(<CardHeader className="custom-header">Header</CardHeader>);
      expect(screen.getByText("Header")).toHaveClass("custom-header");
    });
  });

  describe("CardTitle Rendering", () => {
    it("renders card title", () => {
      render(<CardTitle>My Title</CardTitle>);
      const title = screen.getByText("My Title");
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe("DIV");
    });

    it("renders with default styling classes", () => {
      const { container } = render(<CardTitle>Title</CardTitle>);
      expect(container.firstChild).toHaveClass(
        "text-2xl",
        "font-semibold",
        "leading-none",
        "tracking-tight"
      );
    });

    it("renders with custom className", () => {
      render(<CardTitle className="custom-title">Custom Title</CardTitle>);
      expect(screen.getByText("Custom Title")).toHaveClass("custom-title");
    });
  });

  describe("CardDescription Rendering", () => {
    it("renders card description", () => {
      render(<CardDescription>Description text</CardDescription>);
      expect(screen.getByText("Description text")).toBeInTheDocument();
    });

    it("renders with default styling classes", () => {
      const { container } = render(<CardDescription>Desc</CardDescription>);
      expect(container.firstChild).toHaveClass("text-sm", "text-muted-foreground");
    });

    it("renders with custom className", () => {
      render(<CardDescription className="custom-desc">Custom</CardDescription>);
      expect(screen.getByText("Custom")).toHaveClass("custom-desc");
    });
  });

  describe("CardContent Rendering", () => {
    it("renders card content", () => {
      render(<CardContent>Content goes here</CardContent>);
      expect(screen.getByText("Content goes here")).toBeInTheDocument();
    });

    it("renders with default styling classes", () => {
      const { container } = render(<CardContent>Content</CardContent>);
      expect(container.firstChild).toHaveClass("p-6", "pt-0");
    });

    it("renders with custom className", () => {
      render(<CardContent className="custom-content">Content</CardContent>);
      expect(screen.getByText("Content")).toHaveClass("custom-content");
    });

    it("renders with nested elements", () => {
      render(
        <CardContent>
          <p>Paragraph 1</p>
          <p>Paragraph 2</p>
        </CardContent>
      );
      expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
    });
  });

  describe("CardFooter Rendering", () => {
    it("renders card footer", () => {
      render(<CardFooter>Footer Content</CardFooter>);
      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });

    it("renders with default styling classes", () => {
      const { container } = render(<CardFooter>Footer</CardFooter>);
      expect(container.firstChild).toHaveClass("flex", "items-center", "p-6", "pt-0");
    });

    it("renders with custom className", () => {
      render(<CardFooter className="custom-footer">Footer</CardFooter>);
      expect(screen.getByText("Footer")).toHaveClass("custom-footer");
    });

    it("renders action buttons in footer", () => {
      render(
        <CardFooter>
          <button>Save</button>
          <button>Cancel</button>
        </CardFooter>
      );
      expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    });
  });

  describe("Complete Card Composition", () => {
    it("renders full card structure", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
          <CardContent>Card body content</CardContent>
          <CardFooter>Card footer actions</CardFooter>
        </Card>
      );

      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card description text")).toBeInTheDocument();
      expect(screen.getByText("Card body content")).toBeInTheDocument();
      expect(screen.getByText("Card footer actions")).toBeInTheDocument();
    });

    it("handles nested card structure", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Outer Card</CardTitle>
          </CardHeader>
          <CardContent>
            <Card>
              <CardContent>Inner Card Content</CardContent>
            </Card>
          </CardContent>
        </Card>
      );

      expect(screen.getByText("Outer Card")).toBeInTheDocument();
      expect(screen.getByText("Inner Card Content")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("renders with proper semantic structure", () => {
      render(<Card data-testid="accessible-card">Accessible</Card>);
      const card = screen.getByTestId("accessible-card");
      expect(card.tagName).toBe("DIV");
    });

    it("supports aria attributes", () => {
      render(<Card aria-label="Main card">Aria Card</Card>);
      expect(screen.getByText("Aria Card")).toHaveAttribute("aria-label", "Main card");
    });
  });

  describe("Styling", () => {
    it("applies multiple custom classes", () => {
      render(<Card className="p-4 m-2 border rounded">Styled</Card>);
      expect(screen.getByText("Styled")).toHaveClass("p-4", "m-2", "border", "rounded");
    });
  });
});
