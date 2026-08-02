import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../input";

describe("Input", () => {
  describe("Rendering", () => {
    it("renders input element", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("renders with placeholder text", () => {
      render(<Input placeholder="Enter text..." />);
      const input = screen.getByPlaceholderText("Enter text...");
      expect(input).toBeInTheDocument();
    });

    it("renders with default value", () => {
      render(<Input defaultValue="Initial value" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("Initial value");
    });

    it("renders with custom className", () => {
      render(<Input className="custom-input" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("custom-input");
    });

    it("renders as correct input type", () => {
      render(<Input type="email" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "email");
    });
  });

  describe("Type Props", () => {
    it("renders text type input", () => {
      render(<Input type="text" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "text");
    });

    it("renders email type input", () => {
      render(<Input type="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
    });

    it("renders number type input", () => {
      render(<Input type="number" />);
      const input = screen.getByRole("spinbutton");
      expect(input).toBeInTheDocument();
    });

    it("renders tel type input", () => {
      render(<Input type="tel" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "tel");
    });

    it("renders url type input", () => {
      render(<Input type="url" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("type", "url");
    });
  });

  describe("Disabled State", () => {
    it("renders as disabled", () => {
      render(<Input disabled />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
    });

    it("renders disabled with placeholder", () => {
      render(<Input disabled placeholder="Disabled input" />);
      const input = screen.getByPlaceholderText("Disabled input");
      expect(input).toBeDisabled();
    });

    it("renders disabled with custom className", () => {
      render(<Input disabled className="disabled-input" />);
      const input = screen.getByRole("textbox");
      expect(input).toBeDisabled();
      expect(input).toHaveClass("disabled-input");
    });
  });

  describe("Read Only State", () => {
    it("renders as readOnly", () => {
      render(<Input readOnly value="Read only text" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("readonly");
    });
  });

  describe("Event Handlers", () => {
    it("handles onChange events", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole("textbox");
      
      await user.type(input, "test");
      expect(handleChange).toHaveBeenCalled();
    });

    it("handles onFocus events", () => {
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} />);
      const input = screen.getByRole("textbox");
      input.focus();
      expect(handleFocus).toHaveBeenCalledTimes(1);
      expect(input).toHaveFocus();
    });

    it("handles onBlur events", () => {
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} />);
      const input = screen.getByRole("textbox");
      input.focus();
      input.blur();
      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("handles onKeyDown events", async () => {
      const user = userEvent.setup();
      const handleKeyDown = vi.fn();
      render(<Input onKeyDown={handleKeyDown} />);
      const input = screen.getByRole("textbox");
      
      await user.type(input, "a");
      expect(handleKeyDown).toHaveBeenCalled();
    });
  });

  describe("Accessibility", () => {
    it("can receive focus", () => {
      render(<Input />);
      const input = screen.getByRole("textbox");
      input.focus();
      expect(input).toHaveFocus();
    });

    it("has proper id attribute", () => {
      render(<Input id="username-input" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("id", "username-input");
    });

    it("supports aria-label", () => {
      render(<Input aria-label="Username field" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-label", "Username field");
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <Input aria-describedby="description" />
          <span id="description">Enter your username</span>
        </>
      );
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-describedby", "description");
    });

    it("supports aria-required", () => {
      render(<Input required aria-required="true" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("aria-required", "true");
    });
  });

  describe("Attributes", () => {
    it("renders with name attribute", () => {
      render(<Input name="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("name", "email");
    });

    it("renders with maxLength attribute", () => {
      render(<Input maxLength={50} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "50");
    });

    it("renders with minLength attribute", () => {
      render(<Input minLength={3} />);
      expect(screen.getByRole("textbox")).toHaveAttribute("minlength", "3");
    });

    it("renders with autoComplete attribute", () => {
      render(<Input autoComplete="email" />);
      expect(screen.getByRole("textbox")).toHaveAttribute("autocomplete", "email");
    });

    it("renders with data attributes", () => {
      render(<Input data-testid="test-input" />);
      expect(screen.getByTestId("test-input")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty value", () => {
      render(<Input value="" />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("");
    });

    it("handles very long input", () => {
      const longText = "a".repeat(1000);
      render(<Input defaultValue={longText} />);
      const input = screen.getByRole("textbox");
      expect(input).toHaveValue(longText);
    });

    it("handles special characters", () => {
      render(<Input defaultValue="<script>alert('xss')</script>" />);
      expect(screen.getByRole("textbox")).toHaveValue("<script>alert('xss')</script>");
    });

    it("handles unicode characters", () => {
      render(<Input defaultValue="こんにちは世界 🌍" />);
      expect(screen.getByRole("textbox")).toHaveValue("こんにちは世界 🌍");
    });
  });
});
