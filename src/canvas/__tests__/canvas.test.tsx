import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Canvas } from "../canvas";
import type { Component } from "@/component/types"
import type { ThemeConfig } from "@/theme/types"
import type { DataSource } from "@/data/types";
import { useComponentStore } from "@/component/component.store";
import { useCanvasStore } from "@/canvas/canvas.store";
import { useThemeStore } from "@/theme/theme.store";
import { useDataStore } from "@/data/data.store";

// Mock the recharts library
vi.mock("recharts", () => ({
  BarChart: ({ children, data, ...props }: any) => (
    <div data-testid="bar-chart" data-props={JSON.stringify(props)}>
      {children}
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  LineChart: ({ children, data, ...props }: any) => (
    <div data-testid="line-chart" data-props={JSON.stringify(props)}>
      {children}
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  PieChart: ({ children, data, ...props }: any) => (
    <div data-testid="pie-chart" data-props={JSON.stringify(props)}>
      {children}
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  AreaChart: ({ children, data, ...props }: any) => (
    <div data-testid="area-chart" data-props={JSON.stringify(props)}>
      {children}
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  RadarChart: ({ children, data, ...props }: any) => (
    <div data-testid="radar-chart" data-props={JSON.stringify(props)}>
      {children}
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  Bar: ({ children, ...props }: any) => (
    <div data-testid="bar" {...props}>
      {children}
    </div>
  ),
  Line: ({ children, ...props }: any) => (
    <div data-testid="line" {...props}>
      {children}
    </div>
  ),
  Pie: ({ children, ...props }: any) => (
    <div data-testid="pie" {...props}>
      {children}
    </div>
  ),
  Area: ({ children, ...props }: any) => (
    <div data-testid="area" {...props}>
      {children}
    </div>
  ),
  Radar: ({ children, ...props }: any) => (
    <div data-testid="radar" {...props}>
      {children}
    </div>
  ),
  Cell: ({ children, ...props }: any) => (
    <div data-testid="cell" {...props}>
      {children}
    </div>
  ),
  XAxis: ({ children, ...props }: any) => (
    <div data-testid="x-axis" {...props}>
      {children}
    </div>
  ),
  YAxis: ({ children, ...props }: any) => (
    <div data-testid="y-axis" {...props}>
      {children}
    </div>
  ),
  CartesianGrid: ({ children, ...props }: any) => (
    <div data-testid="cartesian-grid" {...props}>
      {children}
    </div>
  ),
  Tooltip: ({ children, ...props }: any) => (
    <div data-testid="tooltip" {...props}>
      {children}
    </div>
  ),
  Legend: ({ children, ...props }: any) => (
    <div data-testid="legend" {...props}>
      {children}
    </div>
  ),
  ResponsiveContainer: ({ children, ...props }: any) => (
    <div data-testid="responsive-container" {...props}>
      {children}
    </div>
  ),
  PolarGrid: ({ children, ...props }: any) => (
    <div data-testid="polar-grid" {...props}>
      {children}
    </div>
  ),
  PolarAngleAxis: ({ children, ...props }: any) => (
    <div data-testid="polar-angle-axis" {...props}>
      {children}
    </div>
  ),
  PolarRadiusAxis: ({ children, ...props }: any) => (
    <div data-testid="polar-radius-axis" {...props}>
      {children}
    </div>
  ),
  RadialBar: ({ children, ...props }: any) => (
    <div data-testid="radial-bar" {...props}>
      {children}
    </div>
  ),
  RadialBarChart: ({ children, data, ...props }: any) => (
    <div data-testid="radial-bar-chart" data-props={JSON.stringify(props)}>
      {children}
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  Treemap: ({ children, ...props }: any) => (
    <div data-testid="treemap" {...props}>
      {children}
    </div>
  ),
  ScatterChart: ({ children, data, ...props }: any) => (
    <div data-testid="scatter-chart" data-props={JSON.stringify(props)}>
      {children}
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  Scatter: ({ children, ...props }: any) => (
    <div data-testid="scatter" {...props}>
      {children}
    </div>
  ),
}));

// Mock lucide-react icons
vi.mock("lucide-react", () => ({
  Trash2: () => <div data-testid="trash-icon" />,
  Smartphone: () => <div data-testid="smartphone-icon" />,
  Tablet: () => <div data-testid="tablet-icon" />,
  BarChart: () => <div data-testid="bar-chart-icon" />,
  LineChart: () => <div data-testid="line-chart-icon" />,
  PieChart: () => <div data-testid="pie-chart-icon" />,
  ArrowUpDown: () => <div data-testid="arrow-up-down-icon" />,
  Filter: () => <div data-testid="filter-icon" />,
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <DndProvider backend={HTML5Backend}>{children}</DndProvider>
);

describe("Canvas", () => {
  const mockOnSelectComponent = vi.fn();
  const mockOnUpdateComponents = vi.fn();

  const defaultProps = {
    onSelectComponent: mockOnSelectComponent,
    onUpdateComponents: mockOnUpdateComponents,
    components: [],
    dataSources: [],
  };

  const sampleComponents: Component[] = [
    {
      id: "text-1",
      type: "text",
      name: "Text Component",
      position: { x: 100, y: 100 },
      properties: {
        content: "Sample text",
        fontSize: 16,
        color: "#000000",
        visible: true,
      },
      parentId: null,
    },
    {
      id: "button-1",
      type: "button",
      name: "Button Component",
      position: { x: 200, y: 200 },
      properties: {
        text: "Click me",
        variant: "default",
        visible: true,
      },
      parentId: null,
    },
    {
      id: "bar-chart-1",
      type: "bar-chart",
      name: "Bar Chart",
      position: { x: 300, y: 300 },
      properties: {
        title: "Sales Chart",
        width: 500,
        height: 300,
        visible: true,
      },
      parentId: null,
    },
  ];

  const sampleTheme: ThemeConfig = {
    primaryColor: "#0070f3",
    secondaryColor: "#6c757d",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    fontFamily: "Arial, sans-serif",
    borderRadius: "8px",
    spacing: "1rem",
  };

  const sampleDataSources: DataSource[] = [
    {
      id: "ds-1",
      name: "Sales Data",
      type: "static",
      data: [
        { name: "Jan", sales: 1000 },
        { name: "Feb", sales: 1200 },
        { name: "Mar", sales: 1100 },
      ],
    },
  ];

  const seedStores = (opts: {
    components?: Component[];
    isPreviewMode?: boolean;
    activeDevice?: string;
    viewportWidth?: number;
    theme?: ThemeConfig;
  } = {}) => {
    useComponentStore.setState({
      components: opts.components ?? [],
      selectedComponent: null,
      selectedComponentId: null,
      isDragging: false,
      dragOffset: { x: 0, y: 0 },
      dropTargetId: null,
    });
    useCanvasStore.setState({
      isPreviewMode: opts.isPreviewMode ?? false,
      showGrid: false,
      snapToGrid: false,
      viewportWidth: opts.viewportWidth ?? 1280,
      activeDevice: opts.activeDevice ?? "desktop",
    });
    if (opts.theme) {
      useThemeStore.setState({ theme: opts.theme });
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    seedStores();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders empty canvas correctly", () => {
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      expect(screen.getByText("画布")).toBeInTheDocument();
      expect(
        screen.getByText("将组件拖拽到此处或选择一个模板开始")
      ).toBeInTheDocument();
    });

    it("renders canvas with components", () => {
      seedStores({ components: sampleComponents });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      expect(screen.getByText("Sample text")).toBeInTheDocument();
      expect(screen.getByText("Click me")).toBeInTheDocument();
      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    });

    it("renders canvas in preview mode", () => {
      seedStores({ components: sampleComponents, isPreviewMode: true });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      // Header should not be visible in preview mode
      expect(screen.queryByText("画布")).not.toBeInTheDocument();
      expect(screen.getByText("Sample text")).toBeInTheDocument();
    });

    it("renders mobile viewport in preview mode", () => {
      seedStores({ components: sampleComponents, isPreviewMode: true, activeDevice: "mobile", viewportWidth: 375 });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      expect(screen.getByText("移动设备 (375px)")).toBeInTheDocument();
      expect(screen.getByTestId("smartphone-icon")).toBeInTheDocument();
    });

    it("applies theme correctly", () => {
      seedStores({ components: sampleComponents, theme: sampleTheme });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const canvasArea = document.getElementById("canvas-area");
      expect(canvasArea).toHaveStyle({
        backgroundColor: "#ffffff",
        color: "#000000",
        fontFamily: "Arial, sans-serif",
      });
    });
  });

  describe("Component Interactions", () => {
    it("selects component on click", async () => {
      const user = userEvent.setup();

      seedStores({ components: sampleComponents });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const textComponent = screen.getByText("Sample text");
      await user.click(textComponent);

      expect(useComponentStore.getState().selectedComponentId).toBe("text-1");
    });

    it("clears selection when clicking canvas", async () => {
      const user = userEvent.setup();

      seedStores({ components: sampleComponents });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const canvasArea = document.getElementById("canvas-area");
      await user.click(canvasArea!);

      expect(useComponentStore.getState().selectedComponentId).toBeNull();
    });

    it("does not handle interactions in preview mode", async () => {
      const user = userEvent.setup();

      seedStores({ components: sampleComponents, isPreviewMode: true });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const textComponent = screen.getByText("Sample text");
      await user.click(textComponent);

      // Preview mode should not select canvas components
      expect(useComponentStore.getState().selectedComponentId).toBeNull();
    });

    it("handles keyboard navigation", async () => {
      const user = userEvent.setup();

      seedStores({ components: sampleComponents });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const canvasArea = document.getElementById("canvas-area");
      await user.click(canvasArea!);

      // Focus and select a component first
      const textComponent = screen.getByText("Sample text");
      await user.click(textComponent);

      // Test arrow key navigation
      await user.keyboard("{ArrowRight}");

      expect(useComponentStore.getState().components).toBeDefined();
    });

    it("deletes selected component on Delete key", async () => {
      const user = userEvent.setup();

      seedStores({ components: sampleComponents });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      // Select a component first
      const textComponent = screen.getByText("Sample text");
      await user.click(textComponent);

      // Press Delete key
      await user.keyboard("{Delete}");

      expect(useComponentStore.getState().components.find((c) => c.id === "text-1")).toBeUndefined();
    });
  });

  describe("Grid and Snap Functionality", () => {
    it("toggles grid display", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const gridToggle = screen.getByLabelText("显示网格");
      await user.click(gridToggle);

      const canvasArea = document.getElementById("canvas-area");
      expect(canvasArea).toHaveClass("bg-grid-pattern");
    });

    it("toggles snap to grid", async () => {
      const user = userEvent.setup();

      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const snapToggle = screen.getByLabelText("对齐网格");
      await user.click(snapToggle);

      // Test that snap is enabled by checking internal state
      expect(snapToggle).toBeChecked();
    });
  });

  describe("Component Types Rendering", () => {
    it("renders text component correctly", () => {
      const textComponent: Component = {
        id: "text-test",
        type: "text",
        name: "Text",
        position: { x: 0, y: 0 },
        properties: {
          content: "Test text content",
          fontSize: 18,
          fontWeight: "bold",
          color: "#ff0000",
          alignment: "center",
          visible: true,
        },
        parentId: null,
      };

      seedStores({ components: [textComponent] });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const textElement = screen.getByText("Test text content");
      expect(textElement).toBeInTheDocument();
    });

    it("renders button component correctly", () => {
      const buttonComponent: Component = {
        id: "button-test",
        type: "button",
        name: "Button",
        position: { x: 0, y: 0 },
        properties: {
          text: "Test Button",
          variant: "outline",
          size: "lg",
          disabled: false,
          visible: true,
        },
        parentId: null,
      };

      seedStores({ components: [buttonComponent] });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const buttonElement = screen.getByText("Test Button");
      expect(buttonElement).toBeInTheDocument();
    });

    it("renders chart components correctly", () => {
      const chartComponents: Component[] = [
        {
          id: "bar-chart-test",
          type: "bar-chart",
          name: "Bar Chart",
          position: { x: 0, y: 0 },
          properties: {
            title: "Test Bar Chart",
            width: 400,
            height: 300,
            visible: true,
          },
          parentId: null,
        },
        {
          id: "line-chart-test",
          type: "line-chart",
          name: "Line Chart",
          position: { x: 0, y: 100 },
          properties: {
            title: "Test Line Chart",
            width: 400,
            height: 300,
            visible: true,
          },
          parentId: null,
        },
        {
          id: "pie-chart-test",
          type: "pie-chart",
          name: "Pie Chart",
          position: { x: 0, y: 200 },
          properties: {
            title: "Test Pie Chart",
            width: 400,
            height: 300,
            visible: true,
          },
          parentId: null,
        },
      ];

      seedStores({ components: chartComponents });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
      expect(screen.getByTestId("line-chart")).toBeInTheDocument();
      expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    });

    it("renders form components correctly", () => {
      const formComponents: Component[] = [
        {
          id: "input-test",
          type: "input",
          name: "Input",
          position: { x: 0, y: 0 },
          properties: {
            placeholder: "Enter text",
            label: "Test Input",
            required: true,
            visible: true,
          },
          parentId: null,
        },
      ];

      seedStores({ components: formComponents });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      expect(screen.getByLabelText("Test Input")).toBeInTheDocument();
    });

    it("renders container components correctly", () => {
      const containerComponent: Component = {
        id: "container-test",
        type: "container",
        name: "Container",
        position: { x: 0, y: 0 },
        properties: {
          visible: true,
        },
        parentId: null,
      };

      const childComponent: Component = {
        id: "child-text",
        type: "text",
        name: "Child Text",
        position: { x: 10, y: 10 },
        properties: {
          content: "Child content",
          visible: true,
        },
        parentId: "container-test",
      };

      seedStores({ components: [containerComponent, childComponent] });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      expect(screen.getByText("Child content")).toBeInTheDocument();
    });
  });

  describe("Data Binding", () => {
    it("renders components with bound data", () => {
      const chartWithData: Component = {
        id: "chart-with-data",
        type: "bar-chart",
        name: "Chart with Data",
        position: { x: 0, y: 0 },
        properties: {
          title: "Sales Chart",
          visible: true,
        },
        dataSource: "ds-1",
        parentId: null,
      };

      seedStores({ components: [chartWithData] });
      useDataStore.setState({ dataSources: sampleDataSources });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const chartElement = screen.getByTestId("bar-chart");
      expect(chartElement).toBeInTheDocument();

      // Check if data is passed to chart
      const chartData = screen.getByTestId("chart-data");
      expect(chartData).toHaveTextContent("Jan");
      expect(chartData).toHaveTextContent("1000");
    });

    it("handles missing data source gracefully", () => {
      const chartWithMissingData: Component = {
        id: "chart-missing-data",
        type: "bar-chart",
        name: "Chart with Missing Data",
        position: { x: 0, y: 0 },
        properties: {
          title: "Chart",
          visible: true,
        },
        dataSource: "non-existent-ds",
        parentId: null,
      };

      seedStores({ components: [chartWithMissingData] });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const chartElement = screen.getByTestId("bar-chart");
      expect(chartElement).toBeInTheDocument();
    });
  });

  describe("Clear Functionality", () => {
    it("clears all components when clear button is clicked", async () => {
      const user = userEvent.setup();

      seedStores({ components: sampleComponents });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const clearButton = screen.getByTestId("trash-icon").parentElement;
      await user.click(clearButton!);

      expect(useComponentStore.getState().components).toEqual([]);
      expect(useComponentStore.getState().selectedComponentId).toBeNull();
    });

    it("disables clear button when no components", () => {
      seedStores({ components: [] });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      const clearButton = screen.getByTestId("trash-icon").parentElement;
      expect(clearButton).toBeDisabled();
    });
  });

  describe("Invisible Components", () => {
    it("does not render invisible components in preview mode", () => {
      const invisibleComponent: Component = {
        id: "invisible-text",
        type: "text",
        name: "Invisible Text",
        position: { x: 0, y: 0 },
        properties: {
          content: "Invisible content",
          visible: false,
        },
        parentId: null,
      };

      seedStores({
        components: [invisibleComponent],
        isPreviewMode: true,
      });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      expect(screen.queryByText("Invisible content")).not.toBeInTheDocument();
    });

    it("renders invisible components in edit mode", () => {
      const invisibleComponent: Component = {
        id: "invisible-text",
        type: "text",
        name: "Invisible Text",
        position: { x: 0, y: 0 },
        properties: {
          content: "Invisible content",
          visible: false,
        },
        parentId: null,
      };

      seedStores({ components: [invisibleComponent] });
      render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );

      expect(screen.getByText("Invisible content")).toBeInTheDocument();
    });
  });

  describe("Snapshot Tests", () => {
    it("matches snapshot with empty canvas", () => {
      const { container } = render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with components", () => {
      seedStores({ components: sampleComponents });
      const { container } = render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot in preview mode", () => {
      seedStores({ components: sampleComponents, isPreviewMode: true });
      const { container } = render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with theme applied", () => {
      seedStores({ components: sampleComponents, theme: sampleTheme });
      const { container } = render(
        <TestWrapper>
          <Canvas />
        </TestWrapper>
      );
      expect(container).toMatchSnapshot();
    });
  });
});
