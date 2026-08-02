import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "../alert";

describe("Alert", () => {
  describe("Alert Rendering", () => {
    it("renders alert element", () => {
      render(<Alert>Alert Content</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert).toBeInTheDocument();
    });

    it("renders with default variant", () => {
      const { container } = render(<Alert>Default Alert</Alert>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<Alert className="custom-alert">Custom Alert</Alert>);
      const alert = screen.getByRole("alert");
      expect(alert).toHaveClass("custom-alert");
    });

    it("renders with id attribute", () => {
      render(<Alert id="alert-1">ID Alert</Alert>);
      expect(screen.getByRole("alert")).toHaveAttribute("id", "alert-1");
    });

    it("renders with data attributes", () => {
      render(<Alert data-testid="test-alert">Data Alert</Alert>);
      expect(screen.getByTestId("test-alert")).toBeInTheDocument();
    });
  });

  describe("AlertTitle Rendering", () => {
    it("renders alert title", () => {
      render(<AlertTitle>Alert Title</AlertTitle>);
      const title = screen.getByText("Alert Title");
      expect(title).toBeInTheDocument();
    });

    it("renders as h5 element", () => {
      render(<AlertTitle>Title</AlertTitle>);
      const title = screen.getByText("Title");
      expect(title.tagName).toBe("H5");
    });

    it("renders with default styling classes", () => {
      const { container } = render(<AlertTitle>Styled Title</AlertTitle>);
      expect(container.firstChild).toHaveClass("mb-1", "font-medium", "leading-none", "tracking-tight");
    });

    it("renders with custom className", () => {
      render(<AlertTitle className="custom-title">Custom</AlertTitle>);
      expect(screen.getByText("Custom")).toHaveClass("custom-title");
    });
  });

  describe("AlertDescription Rendering", () => {
    it("renders alert description", () => {
      render(<AlertDescription>Description text</AlertDescription>);
      expect(screen.getByText("Description text")).toBeInTheDocument();
    });

    it("renders as div element", () => {
      render(<AlertDescription>Description</AlertDescription>);
      const desc = screen.getByText("Description");
      expect(desc.tagName).toBe("DIV");
    });

    it("renders with custom className", () => {
      render(<AlertDescription className="custom-desc">Custom</AlertDescription>);
      expect(screen.getByText("Custom")).toHaveClass("custom-desc");
    });

    it("renders paragraphs within description", () => {
      render(
        <AlertDescription>
          <p>First paragraph</p>
          <p>Second paragraph</p>
        </AlertDescription>
      );
      expect(screen.getByText("First paragraph")).toBeInTheDocument();
      expect(screen.getByText("Second paragraph")).toBeInTheDocument();
    });
  });

  describe("Variant Props", () => {
    it("renders with default variant", () => {
      const { container } = render(<Alert variant="default">Default</Alert>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with destructive variant", () => {
      const { container } = render(<Alert variant="destructive">Destructive</Alert>);
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Complete Alert Composition", () => {
    it("renders full alert structure", () => {
      render(
        <Alert>
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>This is a warning message.</AlertDescription>
        </Alert>
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Warning")).toBeInTheDocument();
      expect(screen.getByText("This is a warning message.")).toBeInTheDocument();
    });

    it("renders alert without title", () => {
      render(
        <Alert>
          <AlertDescription>Just a description alert</AlertDescription>
        </Alert>
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Just a description alert")).toBeInTheDocument();
    });

    it("renders alert without description", () => {
      render(
        <Alert>
          <AlertTitle>Title Only</AlertTitle>
        </Alert>
      );

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Title Only")).toBeInTheDocument();
    });

    it("renders multiple alerts", () => {
      render(
        <>
          <Alert>
            <AlertTitle>First Alert</AlertTitle>
          </Alert>
          <Alert>
            <AlertTitle>Second Alert</AlertTitle>
          </Alert>
        </>
      );

      const alerts = screen.getAllByRole("alert");
      expect(alerts).toHaveLength(2);
    });
  });

  describe("Accessibility", () => {
    it("has alert role", () => {
      render(<Alert>Accessible Alert</Alert>);
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });

    it("supports aria-label", () => {
      render(<Alert aria-label="Important notice">Notice</Alert>);
      expect(screen.getByRole("alert")).toHaveAttribute("aria-label", "Important notice");
    });
  });

  describe("Styling", () => {
    it("applies multiple custom classes", () => {
      render(<Alert className="p-4 m-2 rounded">Styled Alert</Alert>);
      expect(screen.getByRole("alert")).toHaveClass("p-4", "m-2", "rounded");
    });
  });

  describe("Edge Cases", () => {
    it("renders empty alert", () => {
      const { container } = render(<Alert></Alert>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders alert with long text", () => {
      const longText = "A very long warning message that might need to wrap to multiple lines depending on the container width";
      render(
        <Alert>
          <AlertDescription>{longText}</AlertDescription>
        </Alert>
      );
      expect(screen.getByText(longText)).toBeInTheDocument();
    });
  });
});
