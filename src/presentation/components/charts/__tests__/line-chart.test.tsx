import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LineChart } from "../line-chart";

// Mock recharts
vi.mock("recharts", () => ({
  LineChart: ({ children, data, ...props }: any) => (
    <div data-testid="recharts-line-chart" data-props={JSON.stringify(props)}>
      {children}
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  Line: ({ dataKey, stroke, name, type, ...props }: any) => (
    <div
      data-testid="recharts-line"
      data-datakey={dataKey}
      data-stroke={stroke}
      data-name={name}
      data-type={type}
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

describe("LineChart", () => {
  const sampleData = [
    { name: "1月", visits: 12500, sales: 8400 },
    { name: "2月", visits: 18900, sales: 12600 },
    { name: "3月", visits: 25600, sales: 16800 },
    { name: "4月", visits: 28400, sales: 19200 },
  ];

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<LineChart />);

      expect(
        screen.getByTestId("recharts-responsive-container")
      ).toBeInTheDocument();
      expect(screen.getByTestId("recharts-line-chart")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-x-axis")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-y-axis")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-cartesian-grid")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-tooltip")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-legend")).toBeInTheDocument();
    });

    it("renders with custom data", () => {
      render(<LineChart data={sampleData} />);

      const chartDataElement = screen.getByTestId("chart-data");
      expect(chartDataElement).toBeInTheDocument();
      expect(chartDataElement.textContent).toContain("1月");
      expect(chartDataElement.textContent).toContain("12500");
    });

    it("renders with title", () => {
      const title = "Visits and Sales Trend";
      render(<LineChart title={title} />);

      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it("renders with custom dimensions", () => {
      render(<LineChart width={700} height={450} />);

      const container = screen.getByTestId("recharts-responsive-container");
      expect(container).toHaveAttribute("data-width", "100%");
      expect(container).toHaveAttribute("data-height", "450");
    });

    it("renders with custom xAxisKey", () => {
      render(<LineChart data={sampleData} xAxisKey="month" />);

      const xAxis = screen.getByTestId("recharts-x-axis");
      expect(xAxis).toHaveAttribute("data-datakey", "month");
    });

    it("renders visits and sales lines", () => {
      render(<LineChart data={sampleData} />);

      const lines = screen.getAllByTestId("recharts-line");
      expect(lines).toHaveLength(2);

      expect(lines[0]).toHaveAttribute("data-datakey", "visits");
      expect(lines[0]).toHaveAttribute("data-stroke", "#8884d8");
      expect(lines[0]).toHaveAttribute("data-name", "访问量");
      expect(lines[0]).toHaveAttribute("data-type", "monotone");

      expect(lines[1]).toHaveAttribute("data-datakey", "sales");
      expect(lines[1]).toHaveAttribute("data-stroke", "#82ca9d");
      expect(lines[1]).toHaveAttribute("data-name", "销售");
      expect(lines[1]).toHaveAttribute("data-type", "monotone");
    });
  });

  describe("Data Handling", () => {
    it("uses default data when no data provided", () => {
      render(<LineChart />);

      const chartDataElement = screen.getByTestId("chart-data");
      expect(chartDataElement.textContent).toContain("1月");
      expect(chartDataElement.textContent).toContain("7月");
    });

    it("uses default data when empty array provided", () => {
      render(<LineChart data={[]} />);

      const chartDataElement = screen.getByTestId("chart-data");
      expect(chartDataElement.textContent).toContain("1月");
      expect(chartDataElement.textContent).toContain("7月");
    });

    it("uses provided data when valid data given", () => {
      render(<LineChart data={sampleData} />);

      const chartDataElement = screen.getByTestId("chart-data");
      expect(chartDataElement.textContent).toContain("1月");
      expect(chartDataElement.textContent).toContain("4月");
      expect(chartDataElement.textContent).not.toContain("7月");
    });
  });

  describe("Props Configuration", () => {
    it("applies correct chart margins", () => {
      render(<LineChart data={sampleData} />);

      const chartElement = screen.getByTestId("recharts-line-chart");
      const props = JSON.parse(chartElement.getAttribute("data-props") || "{}");

      expect(props.margin).toEqual({
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      });
    });

    it("sets correct default dimensions", () => {
      render(<LineChart />);

      const container = screen.getByTestId("recharts-responsive-container");
      expect(container).toHaveAttribute("data-width", "100%");
      expect(container).toHaveAttribute("data-height", "300");
    });

    it("uses default xAxisKey when not provided", () => {
      render(<LineChart data={sampleData} />);

      const xAxis = screen.getByTestId("recharts-x-axis");
      expect(xAxis).toHaveAttribute("data-datakey", "name");
    });
  });

  describe("Line Styling", () => {
    it("applies correct line styles", () => {
      render(<LineChart data={sampleData} />);

      const lines = screen.getAllByTestId("recharts-line");

      // Check line types are monotone
      lines.forEach((line) => {
        expect(line).toHaveAttribute("data-type", "monotone");
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure when title is provided", () => {
      const title = "Monthly Traffic Report";
      render(<LineChart title={title} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent(title);
    });

    it("does not render heading when no title provided", () => {
      render(<LineChart />);

      const heading = screen.queryByRole("heading");
      expect(heading).not.toBeInTheDocument();
    });
  });

  describe("Snapshot Tests", () => {
    it("matches snapshot with default props", () => {
      const { container } = render(<LineChart />);
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with custom data and title", () => {
      const { container } = render(
        <LineChart
          data={sampleData}
          title="Custom Line Chart"
          width={600}
          height={400}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with all props", () => {
      const { container } = render(
        <LineChart
          data={sampleData}
          width={800}
          height={500}
          xAxisKey="name"
          title="Complete Line Chart"
        />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
