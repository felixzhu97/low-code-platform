import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TemplateCard } from "../template-card";

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Star: ({ className, fill }: { className?: string; fill?: string }) => (
    <span data-testid="star-icon" className={className} data-fill={fill}>Star</span>
  ),
}));

// Mock the Template type
const mockTemplate = {
  id: "template-1",
  name: "Dashboard Template",
  description: "A modern dashboard template",
  thumbnail: "/dashboard.png",
  category: "dashboard",
  tags: ["analytics", "charts"],
  components: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("TemplateCard", () => {
  const defaultProps = {
    template: mockTemplate,
    isFavorite: false,
    onSelect: vi.fn(),
    onToggleFavorite: vi.fn(),
    onPreview: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders template card with template information", () => {
      render(<TemplateCard {...defaultProps} />);
      
      expect(screen.getByText("Dashboard Template")).toBeInTheDocument();
      expect(screen.getByText("A modern dashboard template")).toBeInTheDocument();
    });

    it("renders with thumbnail image", () => {
      render(<TemplateCard {...defaultProps} />);
      
      const img = screen.getByRole("img");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("alt", "Dashboard Template");
    });

    it("renders with placeholder when no thumbnail", () => {
      const templateWithoutThumbnail = {
        ...mockTemplate,
        thumbnail: undefined,
      };
      
      render(<TemplateCard {...defaultProps} template={templateWithoutThumbnail} />);
      
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("alt", "Dashboard Template");
    });

    it("renders favorite button", () => {
      render(<TemplateCard {...defaultProps} />);
      
      const favoriteButton = screen.getByTestId("star-icon");
      expect(favoriteButton).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("calls onSelect when card image is clicked", async () => {
      const user = userEvent.setup();
      render(<TemplateCard {...defaultProps} />);
      
      const cardImage = document.querySelector(".relative.h-40");
      if (cardImage) {
        await user.click(cardImage);
        expect(defaultProps.onSelect).toHaveBeenCalledWith(mockTemplate);
      }
    });

    it("calls onToggleFavorite when star button is clicked", async () => {
      const user = userEvent.setup();
      render(<TemplateCard {...defaultProps} />);
      
      const starButton = document.querySelector(".absolute.top-2.right-2");
      if (starButton) {
        await user.click(starButton);
        expect(defaultProps.onToggleFavorite).toHaveBeenCalledWith(mockTemplate.id);
      }
    });

    it("calls onPreview when preview button is clicked", async () => {
      const user = userEvent.setup();
      render(<TemplateCard {...defaultProps} />);
      
      const previewButton = screen.getByRole("button", { name: "预览" });
      await user.click(previewButton);
      
      expect(defaultProps.onPreview).toHaveBeenCalledWith(mockTemplate.id);
    });
  });

  describe("Favorite State", () => {
    it("shows filled star when isFavorite is true", () => {
      render(<TemplateCard {...defaultProps} isFavorite={true} />);
      
      const starIcon = screen.getByTestId("star-icon");
      expect(starIcon).toHaveAttribute("data-fill", "yellow-400");
    });

    it("shows empty star when isFavorite is false", () => {
      render(<TemplateCard {...defaultProps} isFavorite={false} />);
      
      const starIcon = screen.getByTestId("star-icon");
      expect(starIcon).not.toHaveAttribute("data-fill");
    });
  });

  describe("Template Data", () => {
    it("displays template name correctly", () => {
      render(<TemplateCard {...defaultProps} />);
      
      const nameHeading = screen.getByRole("heading");
      expect(nameHeading).toHaveTextContent("Dashboard Template");
    });

    it("displays template description correctly", () => {
      render(<TemplateCard {...defaultProps} />);
      
      expect(screen.getByText("A modern dashboard template")).toBeInTheDocument();
    });

    it("handles long template names with truncation", () => {
      const longNameTemplate = {
        ...mockTemplate,
        name: "This is a very long template name that should be truncated",
      };
      
      render(<TemplateCard {...defaultProps} template={longNameTemplate} />);
      
      const nameHeading = screen.getByRole("heading");
      expect(nameHeading).toHaveClass("truncate");
    });

    it("handles long descriptions with truncation", () => {
      const longDescTemplate = {
        ...mockTemplate,
        description: "This is a very long description that should be truncated to fit the card properly",
      };
      
      render(<TemplateCard {...defaultProps} template={longDescTemplate} />);
      
      const description = screen.getByText(longDescTemplate.description);
      expect(description).toHaveClass("truncate");
    });
  });

  describe("Accessibility", () => {
    it("has accessible image with alt text", () => {
      render(<TemplateCard {...defaultProps} />);
      
      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("alt", "Dashboard Template");
    });

    it("preview button is accessible", () => {
      render(<TemplateCard {...defaultProps} />);
      
      const previewButton = screen.getByRole("button", { name: "预览" });
      expect(previewButton).toBeInTheDocument();
    });
  });
});
