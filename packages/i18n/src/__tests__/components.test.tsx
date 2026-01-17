import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LanguageSwitcher } from "../components/language-switcher";
import i18n from "../config";

// Mock the hooks module
vi.mock("../hooks", () => {
  const mockUseLanguage = vi.fn(() => ({
    language: "zh" as const,
    changeLanguage: vi.fn(async (lang: string) => {
      await i18n.changeLanguage(lang);
    }),
    availableLanguages: ["zh", "en"] as const,
  }));

  return {
    useLanguage: mockUseLanguage,
  };
});

describe("LanguageSwitcher", () => {
  beforeEach(async () => {
    // Reset i18n to default state before each test
    await i18n.changeLanguage("zh");
  });

  describe("when component is rendered", () => {
    it("should render language switcher button", () => {
      // Given: LanguageSwitcher component
      // When: component is rendered
      render(<LanguageSwitcher />);

      // Then: should render button element
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("should display current language", () => {
      // Given: LanguageSwitcher component with current language
      // When: component is rendered
      render(<LanguageSwitcher />);

      // Then: should display current language text
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("简体中文");
    });

    it("should apply custom className to container", () => {
      // Given: LanguageSwitcher with custom className
      const className = "custom-container";

      // When: component is rendered with className
      const { container } = render(<LanguageSwitcher className={className} />);

      // Then: should apply className to container
      const wrapper = container.firstChild;
      expect(wrapper).toHaveClass(className);
    });
  });

  describe("when dropdown is toggled", () => {
    it("should show dropdown when button is clicked", async () => {
      // Given: LanguageSwitcher component
      render(<LanguageSwitcher />);

      // When: button is clicked
      const button = screen.getByRole("button");
      fireEvent.click(button);

      // Then: dropdown should be visible
      await waitFor(() => {
        const dropdown = screen.getByRole("listbox");
        expect(dropdown).toBeInTheDocument();
      });
    });

    it("should hide dropdown when clicking outside", async () => {
      // Given: LanguageSwitcher with open dropdown
      render(<LanguageSwitcher />);
      const button = screen.getByRole("button");
      fireEvent.click(button);

      // When: clicking outside
      fireEvent.mouseDown(document.body);

      // Then: dropdown should be hidden
      await waitFor(() => {
        const dropdown = screen.queryByRole("listbox");
        expect(dropdown).not.toBeInTheDocument();
      });
    });
  });

  describe("when language is changed", () => {
    it("should call changeLanguage when language item is clicked", async () => {
      // Given: LanguageSwitcher with open dropdown
      const { useLanguage } = await import("../hooks");
      const mockChangeLanguage = vi.fn(async () => {
        await i18n.changeLanguage("en");
      });

      vi.mocked(useLanguage).mockReturnValue({
        language: "zh",
        changeLanguage: mockChangeLanguage,
        availableLanguages: ["zh", "en"],
      });

      render(<LanguageSwitcher />);
      const button = screen.getByRole("button");
      fireEvent.click(button);

      // When: language item is clicked
      await waitFor(() => {
        const items = screen.getAllByRole("option");
        const enItem = items.find((item) => item.getAttribute("aria-selected") !== "true");
        if (enItem) {
          fireEvent.click(enItem);
        }
      });

      // Then: changeLanguage should be called
      await waitFor(() => {
        expect(mockChangeLanguage).toHaveBeenCalled();
      });
    });
  });

  describe("when displayFormat is specified", () => {
    it("should display full language name when displayFormat is full", () => {
      // Given: LanguageSwitcher with displayFormat="full"
      // When: component is rendered
      render(<LanguageSwitcher displayFormat="full" />);

      // Then: should display full language name
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Chinese");
    });

    it("should display language code when displayFormat is short", () => {
      // Given: LanguageSwitcher with displayFormat="short"
      // When: component is rendered
      render(<LanguageSwitcher displayFormat="short" />);

      // Then: should display language code
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("zh");
    });

    it("should display native name when displayFormat is native", () => {
      // Given: LanguageSwitcher with displayFormat="native"
      // When: component is rendered
      render(<LanguageSwitcher displayFormat="native" />);

      // Then: should display native name
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("简体中文");
    });
  });

  describe("when custom render functions are provided", () => {
    it("should use custom renderButton function", () => {
      // Given: LanguageSwitcher with custom renderButton
      const renderButton = vi.fn((language) => `Custom: ${language}`);

      // When: component is rendered
      render(<LanguageSwitcher renderButton={renderButton} />);

      // Then: should use custom render function
      expect(renderButton).toHaveBeenCalled();
      const button = screen.getByRole("button");
      expect(button).toHaveTextContent("Custom: zh");
    });

    it("should use custom renderItem function", async () => {
      // Given: LanguageSwitcher with custom renderItem
      const renderItem = vi.fn((language, isSelected) => (
        <span>{`Item: ${language} (${isSelected ? "selected" : "not selected"})`}</span>
      ));

      render(<LanguageSwitcher renderItem={renderItem} />);
      const button = screen.getByRole("button");
      fireEvent.click(button);

      // When: dropdown is opened
      // Then: should use custom render function
      await waitFor(() => {
        expect(renderItem).toHaveBeenCalled();
      });
    });
  });
});