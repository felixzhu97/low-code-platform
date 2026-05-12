import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "../textarea";

describe("Textarea", () => {
  describe("Rendering", () => {
    it("renders textarea element", () => {
      render(<Textarea />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeInTheDocument();
      expect(textarea.tagName).toBe("TEXTAREA");
    });

    it("renders with placeholder text", () => {
      render(<Textarea placeholder="Enter description..." />);
      const textarea = screen.getByPlaceholderText("Enter description...");
      expect(textarea).toBeInTheDocument();
    });

    it("renders with default value", () => {
      render(<Textarea defaultValue="Initial content" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("Initial content");
    });

    it("renders with custom className", () => {
      render(<Textarea className="custom-textarea" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("custom-textarea");
    });
  });

  describe("Value Management", () => {
    it("handles controlled value", () => {
      render(<Textarea value="Controlled value" onChange={() => {}} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("Controlled value");
    });

    it("handles uncontrolled value with defaultValue", () => {
      render(<Textarea defaultValue="Uncontrolled value" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("Uncontrolled value");
    });
  });

  describe("Rows and Columns", () => {
    it("renders with default rows", () => {
      const { container } = render(<Textarea />);
      const textarea = container.querySelector("textarea");
      expect(textarea).toBeInTheDocument();
    });

    it("renders with custom rows", () => {
      render(<Textarea rows={10} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("rows", "10");
    });

    it("renders with custom cols", () => {
      render(<Textarea cols={50} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("cols", "50");
    });
  });

  describe("Disabled State", () => {
    it("renders as disabled", () => {
      render(<Textarea disabled />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeDisabled();
    });

    it("renders disabled with placeholder", () => {
      render(<Textarea disabled placeholder="Disabled textarea" />);
      const textarea = screen.getByPlaceholderText("Disabled textarea");
      expect(textarea).toBeDisabled();
    });

    it("renders disabled with value", () => {
      render(<Textarea disabled defaultValue="Disabled value" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toBeDisabled();
      expect(textarea).toHaveValue("Disabled value");
    });
  });

  describe("Read Only State", () => {
    it("renders as readOnly", () => {
      render(<Textarea readOnly value="Read only content" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute("readonly");
    });
  });

  describe("Event Handlers", () => {
    it("handles onChange events", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Textarea onChange={handleChange} />);
      const textarea = screen.getByRole("textbox");
      
      await user.type(textarea, "Hello world");
      expect(handleChange).toHaveBeenCalled();
    });

    it("handles onFocus events", () => {
      const handleFocus = vi.fn();
      render(<Textarea onFocus={handleFocus} />);
      const textarea = screen.getByRole("textbox");
      textarea.focus();
      expect(handleFocus).toHaveBeenCalledTimes(1);
      expect(textarea).toHaveFocus();
    });

    it("handles onBlur events", () => {
      const handleBlur = vi.fn();
      render(<Textarea onBlur={handleBlur} />);
      const textarea = screen.getByRole("textbox");
      textarea.focus();
      textarea.blur();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("can receive focus", () => {
      render(<Textarea />);
      const textarea = screen.getByRole("textbox");
      textarea.focus();
      expect(textarea).toHaveFocus();
    });

    it("has proper id attribute", () => {
      render(<Textarea id="description-input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("id", "description-input");
    });

    it("supports aria-label", () => {
      render(<Textarea aria-label="Description field" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-label", "Description field");
    });
  });

  describe("Attributes", () => {
    it("renders with name attribute", () => {
      render(<Textarea name="description" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("name", "description");
    });

    it("renders with maxLength attribute", () => {
      render(<Textarea maxLength={500} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "500");
    });

    it("renders with minLength attribute", () => {
      render(<Textarea minLength={10} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("minlength", "10");
    });

    it("renders with wrap attribute", () => {
      render(<Textarea wrap="hard" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("wrap", "hard");
    });

    it("renders with data attributes", () => {
      render(<Textarea data-testid="custom-textarea" />);
      expect(screen.getByTestId("custom-textarea")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies custom className alongside default classes", () => {
      render(<Textarea className="resize-none border-red-500" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("resize-none", "border-red-500");
    });
  });

  describe("Edge Cases", () => {
    it("handles empty value", () => {
      render(<Textarea value="" />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("");
    });

    it("handles very long content", () => {
      const longContent = "a".repeat(10000);
      render(<Textarea defaultValue={longContent} />);
      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue(longContent);
    });

    it("handles special characters", () => {
      render(<Textarea defaultValue="<script>alert('xss')</script>" />);
      expect(screen.getByRole("textbox")).toHaveValue("<script>alert('xss')</script>");
    });

    it("handles multiline text with newlines", () => {
      const multilineText = "Line 1\nLine 2\nLine 3";
      render(<Textarea defaultValue={multilineText} />);
      expect(screen.getByRole("textbox")).toHaveValue(multilineText);
    });
  });
});
