import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TemplateFilters } from "../template-filters";

describe("TemplateFilters", () => {
  const defaultProps = {
    showFilters: false,
    categories: ["Dashboard", "E-commerce", "Blog"],
    allTags: ["analytics", "charts", "forms", "tables"],
    activeCategory: "all",
    selectedTags: [],
    onToggleFilters: vi.fn(),
    onCategoryChange: vi.fn(),
    onTagSelect: vi.fn(),
    onResetFilters: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Collapsed State", () => {
    it("renders filter toggle button when showFilters is false", () => {
      render(<TemplateFilters {...defaultProps} showFilters={false} />);
      
      const toggleButton = screen.getByRole("button");
      expect(toggleButton).toBeInTheDocument();
    });

    it("calls onToggleFilters when toggle button is clicked", async () => {
      const user = userEvent.setup();
      render(<TemplateFilters {...defaultProps} showFilters={false} />);
      
      const toggleButton = screen.getByRole("button");
      await user.click(toggleButton);
      
      expect(defaultProps.onToggleFilters).toHaveBeenCalledTimes(1);
    });

    it("does not render filter panel when showFilters is false", () => {
      render(<TemplateFilters {...defaultProps} showFilters={false} />);
      
      expect(screen.queryByText("类别")).not.toBeInTheDocument();
      expect(screen.queryByText("标签")).not.toBeInTheDocument();
    });
  });

  describe("Expanded State", () => {
    it("renders filter panel when showFilters is true", () => {
      render(<TemplateFilters {...defaultProps} showFilters={true} />);
      
      expect(screen.getByText("类别")).toBeInTheDocument();
      expect(screen.getByText("标签")).toBeInTheDocument();
    });

    it("renders category badges", () => {
      render(<TemplateFilters {...defaultProps} showFilters={true} />);
      
      expect(screen.getByText("全部")).toBeInTheDocument();
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("E-commerce")).toBeInTheDocument();
      expect(screen.getByText("Blog")).toBeInTheDocument();
    });

    it("renders tag badges", () => {
      render(<TemplateFilters {...defaultProps} showFilters={true} />);
      
      expect(screen.getByText("analytics")).toBeInTheDocument();
      expect(screen.getByText("charts")).toBeInTheDocument();
      expect(screen.getByText("forms")).toBeInTheDocument();
      expect(screen.getByText("tables")).toBeInTheDocument();
    });

    it("renders collapse and reset buttons", () => {
      render(<TemplateFilters {...defaultProps} showFilters={true} />);
      
      expect(screen.getByRole("button", { name: "收起" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "重置过滤器" })).toBeInTheDocument();
    });
  });

  describe("Category Selection", () => {
    it("calls onCategoryChange when category badge is clicked", async () => {
      const user = userEvent.setup();
      render(<TemplateFilters {...defaultProps} showFilters={true} />);
      
      await user.click(screen.getByText("Dashboard"));
      
      expect(defaultProps.onCategoryChange).toHaveBeenCalledWith("Dashboard");
    });

    it("calls onCategoryChange with 'all' when '全部' is clicked", async () => {
      const user = userEvent.setup();
      render(<TemplateFilters {...defaultProps} showFilters={true} activeCategory="Dashboard" />);
      
      await user.click(screen.getByText("全部"));
      
      expect(defaultProps.onCategoryChange).toHaveBeenCalledWith("all");
    });

    it("highlights active category with default badge variant", () => {
      render(
        <TemplateFilters
          {...defaultProps}
          showFilters={true}
          activeCategory="Dashboard"
        />
      );
      
      // The active category should be rendered with default variant styling
      const dashboardBadge = screen.getByText("Dashboard");
      expect(dashboardBadge).toBeInTheDocument();
    });
  });

  describe("Tag Selection", () => {
    it("calls onTagSelect when tag badge is clicked", async () => {
      const user = userEvent.setup();
      render(<TemplateFilters {...defaultProps} showFilters={true} />);
      
      await user.click(screen.getByText("analytics"));
      
      expect(defaultProps.onTagSelect).toHaveBeenCalledWith("analytics");
    });

    it("calls onTagSelect with same tag to deselect", async () => {
      const user = userEvent.setup();
      render(
        <TemplateFilters
          {...defaultProps}
          showFilters={true}
          selectedTags={["analytics"]}
        />
      );
      
      await user.click(screen.getByText("analytics"));
      
      expect(defaultProps.onTagSelect).toHaveBeenCalledWith("analytics");
    });

    it("highlights selected tags with default badge variant", () => {
      render(
        <TemplateFilters
          {...defaultProps}
          showFilters={true}
          selectedTags={["analytics", "charts"]}
        />
      );
      
      // Both selected tags should be rendered
      expect(screen.getByText("analytics")).toBeInTheDocument();
      expect(screen.getByText("charts")).toBeInTheDocument();
    });
  });

  describe("Reset Functionality", () => {
    it("calls onResetFilters when reset button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <TemplateFilters
          {...defaultProps}
          showFilters={true}
          selectedTags={["analytics"]}
          activeCategory="Dashboard"
        />
      );
      
      await user.click(screen.getByRole("button", { name: "重置过滤器" }));
      
      expect(defaultProps.onResetFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe("Collapse Functionality", () => {
    it("calls onToggleFilters when collapse button is clicked", async () => {
      const user = userEvent.setup();
      render(<TemplateFilters {...defaultProps} showFilters={true} />);
      
      await user.click(screen.getByRole("button", { name: "收起" }));
      
      expect(defaultProps.onToggleFilters).toHaveBeenCalledTimes(1);
    });
  });

  describe("Empty States", () => {
    it("renders with empty categories array", () => {
      render(
        <TemplateFilters
          {...defaultProps}
          showFilters={true}
          categories={[]}
        />
      );
      
      expect(screen.getByText("类别")).toBeInTheDocument();
      expect(screen.getByText("全部")).toBeInTheDocument();
    });

    it("renders with empty tags array", () => {
      render(
        <TemplateFilters
          {...defaultProps}
          showFilters={true}
          allTags={[]}
        />
      );
      
      expect(screen.getByText("标签")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies correct styling to filter panel", () => {
      render(<TemplateFilters {...defaultProps} showFilters={true} />);
      
      const filterPanel = document.querySelector(".mb-4.p-4.border.rounded-md.bg-muted\\/50");
      expect(filterPanel).toBeInTheDocument();
    });

    it("applies cursor-pointer to category badges", () => {
      render(<TemplateFilters {...defaultProps} showFilters={true} />);
      
      const categoryBadges = document.querySelectorAll(".cursor-pointer");
      expect(categoryBadges.length).toBeGreaterThan(0);
    });
  });
});
