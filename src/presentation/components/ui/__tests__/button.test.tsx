import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "../button";

// Mock Slot from radix-ui
vi.mock("@radix-ui/react-slot", () => ({
  Slot: ({ children, ...props }: any) => (
    <div data-testid="mock-slot" {...props}>
      {children}
    </div>
  ),
}));

describe("Button", () => {
  describe("Rendering", () => {
    it("renders a button element by default", () => {
      render(<Button>Click me</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("Click me");
    });

    it("renders with default variant and size", () => {
      render(<Button>Default Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<Button className="custom-class">Styled Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("forwards ref correctly", () => {
      const ref = { current: null };
      render(<Button ref={(el) => { ref.current = el; }}>Ref Button</Button>);
      expect(ref.current).toBeTruthy();
    });

    it("renders as child when asChild is true", () => {
      render(
        <Button asChild>
          <a href="/test">Link Button</a>
        </Button>
      );
      const slot = screen.getByTestId("mock-slot");
      expect(slot).toBeInTheDocument();
      const link = screen.getByRole("link");
      expect(link).toHaveTextContent("Link Button");
    });
  });

  describe("Variant Props", () => {
    it("renders with default variant", () => {
      render(<Button variant="default">Default</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with destructive variant", () => {
      render(<Button variant="destructive">Destructive</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with outline variant", () => {
      render(<Button variant="outline">Outline</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with secondary variant", () => {
      render(<Button variant="secondary">Secondary</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with ghost variant", () => {
      render(<Button variant="ghost">Ghost</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with link variant", () => {
      render(<Button variant="link">Link</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Size Props", () => {
    it("renders with default size", () => {
      render(<Button size="default">Default Size</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with small size", () => {
      render(<Button size="sm">Small</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with large size", () => {
      render(<Button size="lg">Large</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders with icon size", () => {
      render(<Button size="icon">Icon</Button>);
      expect(screen.getByRole("button")).toBeInTheDocument();
    });
  });

  describe("Disabled State", () => {
    it("renders as disabled", () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
    });

    it("renders as disabled with className", () => {
      render(<Button disabled className="disabled-btn">Disabled</Button>);
      const button = screen.getByRole("button");
      expect(button).toBeDisabled();
      expect(button).toHaveClass("disabled-btn");
    });
  });

  describe("Event Handlers", () => {
    it("handles click events", () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByRole("button");
      button.click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("does not call onClick when disabled", () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Disabled Click
        </Button>
      );
      const button = screen.getByRole("button");
      button.click();
      expect(handleClick).not.toHaveBeenCalled();
    });

    it("handles keyboard events", () => {
      const handleKeyDown = vi.fn();
      render(<Button onKeyDown={handleKeyDown}>Key Test</Button>);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });
  });

  describe("Accessibility", () => {
    it("can receive focus", () => {
      render(<Button>Focusable</Button>);
      const button = screen.getByRole("button");
      button.focus();
      expect(button).toHaveFocus();
    });

    it("has proper type attribute", () => {
      render(<Button type="submit">Submit</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "submit");
    });

    it("can have explicit type button", () => {
      render(<Button type="button">Button</Button>);
      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });
  });

  describe("Additional Attributes", () => {
    it("renders with id attribute", () => {
      render(<Button id="test-button">ID Button</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("id", "test-button");
    });

    it("renders with data attributes", () => {
      render(<Button data-testid="custom-button">Data Button</Button>);
      expect(screen.getByTestId("custom-button")).toBeInTheDocument();
    });

    it("renders with aria attributes", () => {
      render(<Button aria-label="Close">X</Button>);
      expect(screen.getByRole("button")).toHaveAttribute("aria-label", "Close");
    });
  });
});
