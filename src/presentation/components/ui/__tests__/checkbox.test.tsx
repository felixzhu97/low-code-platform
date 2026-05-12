import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Checkbox } from "../checkbox";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Check: () => <div data-testid="check-icon">Check</div>,
}));

describe("Checkbox", () => {
  describe("Rendering", () => {
    it("renders checkbox element", () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeInTheDocument();
    });

    it("renders with default unchecked state", () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    it("renders with custom className", () => {
      render(<Checkbox className="custom-checkbox" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveClass("custom-checkbox");
    });
  });

  describe("Checked State", () => {
    it("renders checked when defaultChecked is true", () => {
      render(<Checkbox defaultChecked />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("renders checked when checked prop is true", () => {
      render(<Checkbox checked={true} onCheckedChange={() => {}} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeChecked();
    });

    it("renders unchecked when checked prop is false", () => {
      render(<Checkbox checked={false} onCheckedChange={() => {}} />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).not.toBeChecked();
    });

    it("updates checked state on click", async () => {
      const user = userEvent.setup();
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox");
      
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  describe("Disabled State", () => {
    it("renders as disabled", () => {
      render(<Checkbox disabled />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeDisabled();
    });

    it("renders disabled checkbox as checked", () => {
      render(<Checkbox disabled defaultChecked />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toBeDisabled();
      expect(checkbox).toBeChecked();
    });

    it("does not respond to clicks when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox disabled onCheckedChange={handleChange} />);
      const checkbox = screen.getByRole("checkbox");
      
      await user.click(checkbox);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Event Handlers", () => {
    it("calls onCheckedChange when clicked", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox onCheckedChange={handleChange} />);
      const checkbox = screen.getByRole("checkbox");
      
      await user.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("calls onCheckedChange with false on second click", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Checkbox onCheckedChange={handleChange} />);
      const checkbox = screen.getByRole("checkbox");
      
      await user.click(checkbox);
      await user.click(checkbox);
      expect(handleChange).toHaveBeenCalledWith(true);
      expect(handleChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Accessibility", () => {
    it("can receive focus", () => {
      render(<Checkbox />);
      const checkbox = screen.getByRole("checkbox");
      checkbox.focus();
      expect(checkbox).toHaveFocus();
    });

    it("supports aria-label", () => {
      render(<Checkbox aria-label="Accept terms" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("aria-label", "Accept terms");
    });

    it("supports aria-describedby", () => {
      render(
        <>
          <Checkbox aria-describedby="terms-description" />
          <span id="terms-description">Accept the terms and conditions</span>
        </>
      );
      expect(screen.getByRole("checkbox")).toHaveAttribute(
        "aria-describedby",
        "terms-description"
      );
    });
  });

  describe("Indeterminate State", () => {
    it("renders with indeterminate attribute when passed", () => {
      render(<Checkbox aria-checked="mixed" />);
      const checkbox = screen.getByRole("checkbox");
      expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    });
  });

  describe("Attributes", () => {
    it("renders with id attribute", () => {
      render(<Checkbox id="agree-checkbox" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("id", "agree-checkbox");
    });

    it("renders with value attribute", () => {
      render(<Checkbox value="on" />);
      expect(screen.getByRole("checkbox")).toHaveAttribute("value", "on");
    });

    it("renders with data attributes", () => {
      render(<Checkbox data-testid="custom-checkbox" />);
      expect(screen.getByTestId("custom-checkbox")).toBeInTheDocument();
    });
  });

  describe("Form Integration", () => {
    it("works in a form context", async () => {
      const user = userEvent.setup();
      let formData: FormData;
      
      render(
        <form
          onSubmit={(e) => {
            e.preventDefault();
            formData = new FormData(e.currentTarget);
          }}
        >
          <Checkbox name="subscribe" value="yes" />
          <button type="submit">Submit</button>
        </form>
      );
      
      const checkbox = screen.getByRole("checkbox");
      await user.click(checkbox);
      
      const submitButton = screen.getByRole("button", { name: "Submit" });
      await user.click(submitButton);
      
      expect(formData?.get("subscribe")).toBe("yes");
    });
  });
});
