import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "../label";

describe("Label", () => {
  describe("Rendering", () => {
    it("renders label element", () => {
      render(<Label>Label Text</Label>);
      const label = screen.getByText("Label Text");
      expect(label).toBeInTheDocument();
      expect(label.tagName).toBe("LABEL");
    });

    it("renders with custom className", () => {
      render(<Label className="custom-label">Custom Label</Label>);
      const label = screen.getByText("Custom Label");
      expect(label).toHaveClass("custom-label");
    });

    it("renders with htmlFor attribute", () => {
      render(<Label htmlFor="input-id">Email Address</Label>);
      const label = screen.getByText("Email Address");
      expect(label).toHaveAttribute("for", "input-id");
    });
  });

  describe("Association with Form Elements", () => {
    it("associates with input element", () => {
      render(
        <>
          <Label htmlFor="name-input">Name</Label>
          <input id="name-input" type="text" />
        </>
      );

      const label = screen.getByText("Name");
      const input = screen.getByRole("textbox");

      expect(label).toHaveAttribute("for", "name-input");
      expect(input).toHaveAttribute("id", "name-input");
    });

    it("associates with checkbox", () => {
      render(
        <>
          <Label htmlFor="agree-checkbox">I agree</Label>
          <input id="agree-checkbox" type="checkbox" />
        </>
      );

      expect(screen.getByText("I agree")).toHaveAttribute("for", "agree-checkbox");
      expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("associates with select element", () => {
      render(
        <>
          <Label htmlFor="country-select">Country</Label>
          <select id="country-select">
            <option value="us">United States</option>
          </select>
        </>
      );

      expect(screen.getByText("Country")).toHaveAttribute("for", "country-select");
    });
  });

  describe("Styling", () => {
    it("applies default styling classes", () => {
      const { container } = render(<Label>Styled Label</Label>);
      expect(container.firstChild).toHaveClass("text-sm", "font-medium", "leading-none", "peer-disabled:cursor-not-allowed", "peer-disabled:opacity-70");
    });

    it("applies multiple custom classes", () => {
      render(<Label className="mt-2 mb-1 text-lg">Multiple Classes</Label>);
      const label = screen.getByText("Multiple Classes");
      expect(label).toHaveClass("mt-2", "mb-1", "text-lg");
    });
  });

  describe("Accessibility", () => {
    it("renders as a label element", () => {
      render(<Label>Accessible Label</Label>);
      expect(screen.getByText("Accessible Label").tagName).toBe("LABEL");
    });

    it("supports aria-label", () => {
      render(<Label aria-label="Form label for name input">Name</Label>);
      expect(screen.getByText("Name")).toHaveAttribute("aria-label", "Form label for name input");
    });

    it("can be nested with inputs", () => {
      render(
        <Label>
          <input type="checkbox" /> Accept terms
        </Label>
      );

      expect(screen.getByRole("checkbox")).toBeInTheDocument();
      expect(screen.getByText("Accept terms")).toBeInTheDocument();
    });
  });

  describe("Attributes", () => {
    it("renders with id attribute", () => {
      render(<Label id="label-id">ID Label</Label>);
      expect(screen.getByText("ID Label")).toHaveAttribute("id", "label-id");
    });

    it("renders with data attributes", () => {
      render(<Label data-testid="custom-label">Data Label</Label>);
      expect(screen.getByTestId("custom-label")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("renders empty label", () => {
      const { container } = render(<Label></Label>);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with special characters", () => {
      render(<Label>Email * (required)</Label>);
      expect(screen.getByText("Email * (required)")).toBeInTheDocument();
    });

    it("renders with nested elements", () => {
      render(
        <Label>
          <span>Nested</span> <strong>Text</strong>
        </Label>
      );
      expect(screen.getByText("Nested")).toBeInTheDocument();
      expect(screen.getByText("Text")).toBeInTheDocument();
    });

    it("renders multiple labels", () => {
      render(
        <>
          <Label htmlFor="input1">First</Label>
          <input id="input1" type="text" />
          <Label htmlFor="input2">Second</Label>
          <input id="input2" type="text" />
        </>
      );

      expect(screen.getByText("First")).toHaveAttribute("for", "input1");
      expect(screen.getByText("Second")).toHaveAttribute("for", "input2");
    });
  });

  describe("Form Context", () => {
    it("connects to required input", () => {
      render(
        <>
          <Label htmlFor="required-input">Required Field</Label>
          <input id="required-input" type="text" required />
        </>
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("required");
    });

    it("connects to disabled input", () => {
      render(
        <>
          <Label htmlFor="disabled-input">Disabled Field</Label>
          <input id="disabled-input" type="text" disabled />
        </>
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("connects to input with placeholder", () => {
      render(
        <>
          <Label htmlFor="placeholder-input">Placeholder Input</Label>
          <input id="placeholder-input" placeholder="Enter text" />
        </>
      );

      expect(screen.getByPlaceholderText("Enter text")).toHaveAttribute("id", "placeholder-input");
    });
  });
});
