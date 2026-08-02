import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "../switch";

describe("Switch", () => {
  describe("Rendering", () => {
    it("renders switch element", () => {
      render(<Switch />);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      render(<Switch className="custom-switch" />);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveClass("custom-switch");
    });

    it("renders as unchecked by default", () => {
      render(<Switch />);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toHaveAttribute("data-state", "unchecked");
    });
  });

  describe("Checked State", () => {
    it("renders checked when defaultChecked is true", () => {
      render(<Switch defaultChecked />);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeChecked();
      expect(switchElement).toHaveAttribute("data-state", "checked");
    });

    it("renders checked when checked prop is true", () => {
      render(<Switch checked={true} onCheckedChange={() => {}} />);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeChecked();
    });

    it("renders unchecked when checked prop is false", () => {
      render(<Switch checked={false} onCheckedChange={() => {}} />);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).not.toBeChecked();
      expect(switchElement).toHaveAttribute("data-state", "unchecked");
    });

    it("toggles state on click", async () => {
      const user = userEvent.setup();
      render(<Switch />);
      const switchElement = screen.getByRole("switch");
      
      await user.click(switchElement);
      expect(switchElement).toBeChecked();
      
      await user.click(switchElement);
      expect(switchElement).not.toBeChecked();
    });
  });

  describe("Disabled State", () => {
    it("renders as disabled", () => {
      render(<Switch disabled />);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeDisabled();
    });

    it("renders disabled switch as checked", () => {
      render(<Switch disabled defaultChecked />);
      const switchElement = screen.getByRole("switch");
      expect(switchElement).toBeDisabled();
      expect(switchElement).toBeChecked();
    });

    it("does not toggle when disabled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch disabled onCheckedChange={handleChange} />);
      const switchElement = screen.getByRole("switch");
      
      await user.click(switchElement);
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe("Event Handlers", () => {
    it("calls onCheckedChange when toggled", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} />);
      const switchElement = screen.getByRole("switch");
      
      await user.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it("calls onCheckedChange with false on second click", async () => {
      const user = userEvent.setup();
      const handleChange = vi.fn();
      render(<Switch onCheckedChange={handleChange} />);
      const switchElement = screen.getByRole("switch");
      
      await user.click(switchElement);
      await user.click(switchElement);
      expect(handleChange).toHaveBeenCalledWith(true);
      expect(handleChange).toHaveBeenCalledWith(false);
    });
  });

  describe("Accessibility", () => {
    it("can receive focus", () => {
      render(<Switch />);
      const switchElement = screen.getByRole("switch");
      switchElement.focus();
      expect(switchElement).toHaveFocus();
    });

    it("supports aria-label", () => {
      render(<Switch aria-label="Enable notifications" />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-label", "Enable notifications");
    });

    it("supports aria-checked", () => {
      render(<Switch aria-checked="true" />);
      expect(screen.getByRole("switch")).toHaveAttribute("aria-checked", "true");
    });

    it("has proper role", () => {
      render(<Switch />);
      expect(screen.getByRole("switch")).toBeInTheDocument();
    });
  });

  describe("Attributes", () => {
    it("renders with id attribute", () => {
      render(<Switch id="dark-mode-switch" />);
      expect(screen.getByRole("switch")).toHaveAttribute("id", "dark-mode-switch");
    });

    it("renders with value attribute", () => {
      render(<Switch value="enabled" />);
      expect(screen.getByRole("switch")).toHaveAttribute("value", "enabled");
    });

    it("renders with data attributes", () => {
      render(<Switch data-testid="custom-switch" />);
      expect(screen.getByTestId("custom-switch")).toBeInTheDocument();
    });
  });

  describe("Thumb Element", () => {
    it("has thumb child element", () => {
      const { container } = render(<Switch />);
      const thumb = container.querySelector('[class*="translate-x"]');
      expect(thumb).toBeInTheDocument();
    });
  });
});
