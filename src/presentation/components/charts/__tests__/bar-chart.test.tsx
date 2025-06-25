import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BarChart } from "../bar-chart";

// Mock recharts
vi.mock("recharts", () => ({
  BarChart: ({ children, data, ...props }: any) => (
    <div data-testid="recharts-bar-chart" data-props={JSON.stringify(props)}>
      {children}
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  Bar: ({ dataKey, fill, name, ...props }: any) => (
    <div
      data-testid="recharts-bar"
      data-datakey={dataKey}
      data-fill={fill}
      data-name={name}
      {...props}
    />
  ),
  XAxis: ({ dataKey, ...props }: any) => (
    <div data-testid="recharts-x-axis" data-datakey={dataKey} {...props} />
  ),
  YAxis: (props: any) => <div data-testid="recharts-y-axis" {...props} />,
  CartesianGrid: (props: any) => (
    <div data-testid="recharts-cartesian-grid" {...props} />
  ),
  Tooltip: (props: any) => <div data-testid="recharts-tooltip" {...props} />,
  Legend: (props: any) => <div data-testid="recharts-legend" {...props} />,
  ResponsiveContainer: ({ children, width, height, ...props }: any) => (
    <div
      data-testid="recharts-responsive-container"
      data-width={width}
      data-height={height}
      {...props}
    >
      {children}
    </div>
  ),
}));

describe("BarChart", () => {
  const sampleData = [
    { name: "1月", sales: 8500, revenue: 6200 },
    { name: "2月", sales: 9200, revenue: 7300 },
    { name: "3月", sales: 10800, revenue: 8600 },
  ];

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<BarChart />);

      expect(
        screen.getByTestId("recharts-responsive-container")
      ).toBeInTheDocument();
      expect(screen.getByTestId("recharts-bar-chart")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-x-axis")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-y-axis")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-cartesian-grid")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-tooltip")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-legend")).toBeInTheDocument();
    });

    it("renders with custom data", () => {
      render(<BarChart data={sampleData} />);

      const chartDataElement = screen.getByTestId("chart-data");
      expect(chartDataElement).toBeInTheDocument();
      expect(chartDataElement.textContent).toContain("1月");
      expect(chartDataElement.textContent).toContain("8500");
    });

    it("renders with title", () => {
      const title = "Sales Chart";
      render(<BarChart title={title} />);

      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it("renders with custom dimensions", () => {
      render(<BarChart width={600} height={400} />);

      const container = screen.getByTestId("recharts-responsive-container");
      expect(container).toHaveAttribute("data-width", "100%");
      expect(container).toHaveAttribute("data-height", "400");
    });

    it("renders with custom xAxisKey", () => {
      render(<BarChart data={sampleData} xAxisKey="date" />);

      const xAxis = screen.getByTestId("recharts-x-axis");
      expect(xAxis).toHaveAttribute("data-datakey", "date");
    });

    it("renders sales and revenue bars", () => {
      render(<BarChart data={sampleData} />);

      const bars = screen.getAllByTestId("recharts-bar");
      expect(bars).toHaveLength(2);

      expect(bars[0]).toHaveAttribute("data-datakey", "sales");
      expect(bars[0]).toHaveAttribute("data-fill", "#8884d8");
      expect(bars[0]).toHaveAttribute("data-name", "销售额");

      expect(bars[1]).toHaveAttribute("data-datakey", "revenue");
      expect(bars[1]).toHaveAttribute("data-fill", "#82ca9d");
      expect(bars[1]).toHaveAttribute("data-name", "收入");
    });
  });

  describe("Data Handling", () => {
    it("uses default data when no data provided", () => {
      render(<BarChart />);

      const chartDataElement = screen.getByTestId("chart-data");
      expect(chartDataElement.textContent).toContain("1月");
      expect(chartDataElement.textContent).toContain("6月");
    });

    it("uses default data when empty array provided", () => {
      render(<BarChart data={[]} />);

      const chartDataElement = screen.getByTestId("chart-data");
      expect(chartDataElement.textContent).toContain("1月");
      expect(chartDataElement.textContent).toContain("6月");
    });

    it("uses provided data when valid data given", () => {
      render(<BarChart data={sampleData} />);

      const chartDataElement = screen.getByTestId("chart-data");
      expect(chartDataElement.textContent).toContain("1月");
      expect(chartDataElement.textContent).toContain("3月");
      expect(chartDataElement.textContent).not.toContain("6月");
    });
  });

  describe("Props Configuration", () => {
    it("applies correct chart margins", () => {
      render(<BarChart data={sampleData} />);

      const chartElement = screen.getByTestId("recharts-bar-chart");
      const props = JSON.parse(chartElement.getAttribute("data-props") || "{}");

      expect(props.margin).toEqual({
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      });
    });

    it("sets correct default dimensions", () => {
      render(<BarChart />);

      const container = screen.getByTestId("recharts-responsive-container");
      expect(container).toHaveAttribute("data-width", "100%");
      expect(container).toHaveAttribute("data-height", "300");
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure when title is provided", () => {
      const title = "Monthly Sales Report";
      render(<BarChart title={title} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent(title);
    });

    it("does not render heading when no title provided", () => {
      render(<BarChart />);

      const heading = screen.queryByRole("heading");
      expect(heading).not.toBeInTheDocument();
    });
  });

  describe("Snapshot Tests", () => {
    it("matches snapshot with default props", () => {
      const { container } = render(<BarChart />);
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with custom data and title", () => {
      const { container } = render(
        <BarChart
          data={sampleData}
          title="Custom Chart"
          width={500}
          height={350}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with all props", () => {
      const { container } = render(
        <BarChart
          data={sampleData}
          width={800}
          height={400}
          xAxisKey="name"
          title="Complete Bar Chart"
        />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
