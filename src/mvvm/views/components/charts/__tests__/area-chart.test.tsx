import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { AreaChart } from "../area-chart";

// Mock recharts
vi.mock("recharts", () => ({
  AreaChart: ({ children, data, ...props }: any) => (
    <div data-testid="recharts-area-chart" data-props={JSON.stringify(props)}>
      {children}
      <div data-testid="chart-data">{JSON.stringify(data)}</div>
    </div>
  ),
  Area: ({ dataKey, stroke, fill, fillOpacity, name, type, ...props }: any) => (
    <div
      data-testid="recharts-area"
      data-datakey={dataKey}
      data-stroke={stroke}
      data-fill={fill}
      data-fillopacity={fillOpacity}
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

describe("AreaChart", () => {
  const sampleData = [
    { name: "1月", uv: 8200, pv: 5400 },
    { name: "2月", uv: 12100, pv: 7800 },
    { name: "3月", uv: 15800, pv: 9600 },
    { name: "4月", uv: 18200, pv: 11200 },
  ];

  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<AreaChart />);

      expect(
        screen.getByTestId("recharts-responsive-container")
      ).toBeInTheDocument();
      expect(screen.getByTestId("recharts-area-chart")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-x-axis")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-y-axis")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-cartesian-grid")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-tooltip")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-legend")).toBeInTheDocument();
    });

    it("renders with custom data", () => {
      render(<AreaChart data={sampleData} />);

      const chartDataElement = screen.getByTestId("chart-data");
      expect(chartDataElement).toBeInTheDocument();
      expect(chartDataElement.textContent).toContain("1月");
      expect(chartDataElement.textContent).toContain("8200");
    });

    it("renders with title", () => {
      const title = "Traffic Analysis";
      render(<AreaChart title={title} />);

      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it("renders with custom dimensions", () => {
      render(<AreaChart width={700} height={450} />);

      const container = screen.getByTestId("recharts-responsive-container");
      expect(container).toHaveAttribute("data-width", "100%");
      expect(container).toHaveAttribute("data-height", "450");
    });

    it("renders with custom xAxisKey", () => {
      render(<AreaChart data={sampleData} xAxisKey="month" />);

      const xAxis = screen.getByTestId("recharts-x-axis");
      expect(xAxis).toHaveAttribute("data-datakey", "month");
    });

    it("renders UV and PV areas", () => {
      render(<AreaChart data={sampleData} />);

      const areas = screen.getAllByTestId("recharts-area");
      expect(areas).toHaveLength(2);

      expect(areas[0]).toHaveAttribute("data-datakey", "uv");
      expect(areas[0]).toHaveAttribute("data-stroke", "#8884d8");
      expect(areas[0]).toHaveAttribute("data-fill", "url(#colorUv)");
      expect(areas[0]).toHaveAttribute("data-name", "UV");
      expect(areas[0]).toHaveAttribute("data-type", "monotone");

      expect(areas[1]).toHaveAttribute("data-datakey", "pv");
      expect(areas[1]).toHaveAttribute("data-stroke", "#82ca9d");
      expect(areas[1]).toHaveAttribute("data-fill", "url(#colorPv)");
      expect(areas[1]).toHaveAttribute("data-name", "PV");
      expect(areas[1]).toHaveAttribute("data-type", "monotone");
    });
  });

  describe("Data Handling", () => {
    it("uses default data when no data provided", () => {
      render(<AreaChart />);

      const chartDataElement = screen.getByTestId("chart-data");
      expect(chartDataElement.textContent).toContain("1月");
      expect(chartDataElement.textContent).toContain("7月");
    });

    it("uses default data when empty array provided", () => {
      render(<AreaChart data={[]} />);

      const chartDataElement = screen.getByTestId("chart-data");
      expect(chartDataElement.textContent).toContain("1月");
      expect(chartDataElement.textContent).toContain("7月");
    });

    it("uses provided data when valid data given", () => {
      render(<AreaChart data={sampleData} />);

      const chartDataElement = screen.getByTestId("chart-data");
      expect(chartDataElement.textContent).toContain("1月");
      expect(chartDataElement.textContent).toContain("4月");
      expect(chartDataElement.textContent).not.toContain("7月");
    });
  });

  describe("Gradient Configuration", () => {
    it("contains gradient definitions in the chart", () => {
      render(<AreaChart data={sampleData} />);

      // Check that the chart contains defs section (would contain gradients)
      const chartElement = screen.getByTestId("recharts-area-chart");
      expect(chartElement).toBeInTheDocument();

      // The areas should reference the gradient fills
      const areas = screen.getAllByTestId("recharts-area");
      expect(areas[0]).toHaveAttribute("data-fill", "url(#colorUv)");
      expect(areas[1]).toHaveAttribute("data-fill", "url(#colorPv)");
    });

    it("applies correct fill opacity", () => {
      render(<AreaChart data={sampleData} />);

      const areas = screen.getAllByTestId("recharts-area");
      areas.forEach((area) => {
        expect(area).toHaveAttribute("data-fillopacity", "1");
      });
    });
  });

  describe("Props Configuration", () => {
    it("applies correct chart margins", () => {
      render(<AreaChart data={sampleData} />);

      const chartElement = screen.getByTestId("recharts-area-chart");
      const props = JSON.parse(chartElement.getAttribute("data-props") || "{}");

      expect(props.margin).toEqual({
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      });
    });

    it("sets correct default dimensions", () => {
      render(<AreaChart />);

      const container = screen.getByTestId("recharts-responsive-container");
      expect(container).toHaveAttribute("data-width", "100%");
      expect(container).toHaveAttribute("data-height", "300");
    });

    it("uses default xAxisKey when not provided", () => {
      render(<AreaChart data={sampleData} />);

      const xAxis = screen.getByTestId("recharts-x-axis");
      expect(xAxis).toHaveAttribute("data-datakey", "name");
    });
  });

  describe("Area Styling", () => {
    it("applies correct area stroke styles", () => {
      render(<AreaChart data={sampleData} />);

      const areas = screen.getAllByTestId("recharts-area");

      // Check that areas have proper stroke colors
      expect(areas[0]).toHaveAttribute("data-stroke", "#8884d8");
      expect(areas[1]).toHaveAttribute("data-stroke", "#82ca9d");
    });

    it("applies monotone curve type", () => {
      render(<AreaChart data={sampleData} />);

      const areas = screen.getAllByTestId("recharts-area");

      areas.forEach((area) => {
        expect(area).toHaveAttribute("data-type", "monotone");
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure when title is provided", () => {
      const title = "Monthly Traffic Analysis";
      render(<AreaChart title={title} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent(title);
    });

    it("does not render heading when no title provided", () => {
      render(<AreaChart />);

      const heading = screen.queryByRole("heading");
      expect(heading).not.toBeInTheDocument();
    });
  });

  describe("Snapshot Tests", () => {
    it("matches snapshot with default props", () => {
      const { container } = render(<AreaChart />);
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with custom data and title", () => {
      const { container } = render(
        <AreaChart
          data={sampleData}
          title="Custom Area Chart"
          width={600}
          height={400}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with all props", () => {
      const { container } = render(
        <AreaChart
          data={sampleData}
          width={800}
          height={500}
          xAxisKey="name"
          title="Complete Area Chart"
        />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
