import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { GaugeChart } from "../gauge-chart";

// Mock recharts
vi.mock("recharts", () => ({
  PieChart: ({ children, ...props }: any) => (
    <div data-testid="recharts-pie-chart" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
  Pie: ({
    data,
    cx,
    cy,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    children,
    ...props
  }: any) => (
    <div
      data-testid="recharts-pie"
      data-cx={cx}
      data-cy={cy}
      data-startangle={startAngle}
      data-endangle={endAngle}
      data-innerradius={innerRadius}
      data-outerradius={outerRadius}
    >
      <div data-testid="gauge-data">{JSON.stringify(data)}</div>
      {children}
    </div>
  ),
  Cell: ({ fill, ...props }: any) => (
    <div data-testid="recharts-cell" data-fill={fill} {...props} />
  ),
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

describe("GaugeChart", () => {
  describe("Rendering", () => {
    it("renders with default props", () => {
      render(<GaugeChart />);

      expect(
        screen.getByTestId("recharts-responsive-container")
      ).toBeInTheDocument();
      expect(screen.getByTestId("recharts-pie-chart")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-pie")).toBeInTheDocument();
    });

    it("renders with custom value", () => {
      render(<GaugeChart value={75} />);

      const gaugeDataElement = screen.getByTestId("gauge-data");
      const data = JSON.parse(gaugeDataElement.textContent || "[]");

      // First segment should be the value (0.75 as percentage)
      expect(data[0].value).toBe(0.75);
      // Second segment should be the remaining (0.25 as percentage)
      expect(data[1].value).toBe(0.25);
    });

    it("renders with title", () => {
      const title = "Performance Gauge";
      render(<GaugeChart title={title} />);

      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it("renders with custom dimensions", () => {
      render(<GaugeChart width={400} height={300} />);

      const container = screen.getByTestId("recharts-responsive-container");
      expect(container).toHaveAttribute("data-width", "100%");
      expect(container).toHaveAttribute("data-height", "100%");
    });

    it("displays value text when showValue is true", () => {
      render(<GaugeChart value={85} showValue={true} />);

      expect(screen.getByText("85")).toBeInTheDocument();
    });

    it("displays value with unit when unit is provided", () => {
      render(<GaugeChart value={75} showValue={true} unit="%" />);

      expect(screen.getByText("75")).toBeInTheDocument();
      expect(screen.getByText("%")).toBeInTheDocument();
    });

    it("hides value text when showValue is false", () => {
      render(<GaugeChart value={75} showValue={false} />);

      expect(screen.queryByText("75")).not.toBeInTheDocument();
    });
  });

  describe("Value Calculation", () => {
    it("handles value as percentage (0-100)", () => {
      render(<GaugeChart value={60} />);

      const gaugeDataElement = screen.getByTestId("gauge-data");
      const data = JSON.parse(gaugeDataElement.textContent || "[]");

      expect(data[0].value).toBe(0.6);
      expect(data[1].value).toBe(0.4);
    });

    it("handles 0% value", () => {
      render(<GaugeChart value={0} />);

      const gaugeDataElement = screen.getByTestId("gauge-data");
      const data = JSON.parse(gaugeDataElement.textContent || "[]");

      expect(data[0].value).toBe(0);
      expect(data[1].value).toBe(1);
    });

    it("handles 100% value", () => {
      render(<GaugeChart value={100} />);

      const gaugeDataElement = screen.getByTestId("gauge-data");
      const data = JSON.parse(gaugeDataElement.textContent || "[]");

      expect(data[0].value).toBe(1);
      expect(data[1].value).toBe(0);
    });

    it("clamps values above 100 to 100", () => {
      render(<GaugeChart value={150} />);

      const gaugeDataElement = screen.getByTestId("gauge-data");
      const data = JSON.parse(gaugeDataElement.textContent || "[]");

      expect(data[0].value).toBe(1);
      expect(data[1].value).toBe(0);
    });

    it("clamps negative values to 0", () => {
      render(<GaugeChart value={-20} />);

      const gaugeDataElement = screen.getByTestId("gauge-data");
      const data = JSON.parse(gaugeDataElement.textContent || "[]");

      expect(data[0].value).toBe(0);
      expect(data[1].value).toBe(1);
    });
  });

  describe("Gauge Configuration", () => {
    it("applies correct pie positioning", () => {
      render(<GaugeChart />);

      const pie = screen.getByTestId("recharts-pie");
      expect(pie).toHaveAttribute("data-cx", "50%");
      expect(pie).toHaveAttribute("data-cy", "50%");
    });

    it("applies correct angles for half-circle gauge", () => {
      render(<GaugeChart />);

      const pie = screen.getByTestId("recharts-pie");
      expect(pie).toHaveAttribute("data-startangle", "180");
      expect(pie).toHaveAttribute("data-endangle", "0");
    });

    it("applies correct default radius values", () => {
      render(<GaugeChart />);

      const pie = screen.getByTestId("recharts-pie");
      expect(pie).toHaveAttribute("data-innerradius", "60%");
      expect(pie).toHaveAttribute("data-outerradius", "80%");
    });
  });

  describe("Color Configuration", () => {
    it("applies correct colors to gauge segments", () => {
      render(<GaugeChart value={75} />);

      const cells = screen.getAllByTestId("recharts-cell");
      expect(cells).toHaveLength(2);

      // Active segment color (75% should use colors[3] = "#FF8042")
      expect(cells[0]).toHaveAttribute("data-fill", "#FF8042");
      // Inactive segment color
      expect(cells[1]).toHaveAttribute("data-fill", "#EEEEEE");
    });

    it("applies different colors based on value ranges", () => {
      // Test low value (0-20%)
      const { rerender } = render(<GaugeChart value={10} />);
      let cells = screen.getAllByTestId("recharts-cell");
      expect(cells[0]).toHaveAttribute("data-fill", "#0088FE");

      // Test medium value (40-60%)
      rerender(<GaugeChart value={50} />);
      cells = screen.getAllByTestId("recharts-cell");
      expect(cells[0]).toHaveAttribute("data-fill", "#FFBB28");

      // Test high value (80-100%)
      rerender(<GaugeChart value={90} />);
      cells = screen.getAllByTestId("recharts-cell");
      expect(cells[0]).toHaveAttribute("data-fill", "#FF0000");
    });

    it("applies custom color palette", () => {
      const customColors = ["#red", "#green", "#blue", "#yellow", "#purple"];
      render(<GaugeChart value={50} colors={customColors} />);

      const cells = screen.getAllByTestId("recharts-cell");
      expect(cells[0]).toHaveAttribute("data-fill", "#blue"); // 50% should use index 2
    });
  });

  describe("Data Structure", () => {
    it("creates correct data structure for recharts", () => {
      render(<GaugeChart value={30} />);

      const gaugeDataElement = screen.getByTestId("gauge-data");
      const data = JSON.parse(gaugeDataElement.textContent || "[]");

      expect(data).toEqual([
        { name: "value", value: 0.3 },
        { name: "empty", value: 0.7 },
      ]);
    });

    it("ensures total always equals 100", () => {
      const testValues = [0, 25, 50, 75, 100, 120, -10];

      testValues.forEach((value) => {
        const { rerender } = render(<GaugeChart value={value} />);

        const gaugeDataElement = screen.getByTestId("gauge-data");
        const data = JSON.parse(gaugeDataElement.textContent || "[]");

        const total = data.reduce(
          (sum: number, item: any) => sum + item.value,
          0
        );
        expect(total).toBe(1);

        rerender(<div />);
      });
    });
  });

  describe("Value Display", () => {
    it("shows integer values without decimals", () => {
      render(<GaugeChart value={85} showValue={true} />);

      expect(screen.getByText("85")).toBeInTheDocument();
    });

    it("shows decimal values correctly", () => {
      render(<GaugeChart value={85.5} showValue={true} />);

      expect(screen.getByText("85.5")).toBeInTheDocument();
    });

    it("displays title and value together", () => {
      render(
        <GaugeChart value={92} title="CPU Usage" showValue={true} unit="%" />
      );

      expect(screen.getByText("CPU Usage")).toBeInTheDocument();
      expect(screen.getByText("92")).toBeInTheDocument();
      expect(screen.getByText("%")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure when title is provided", () => {
      const title = "System Performance";
      render(<GaugeChart title={title} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent(title);
    });

    it("does not render heading when no title provided", () => {
      render(<GaugeChart />);

      const heading = screen.queryByRole("heading");
      expect(heading).not.toBeInTheDocument();
    });
  });

  describe("Snapshot Tests", () => {
    it("matches snapshot with default props", () => {
      const { container } = render(<GaugeChart />);
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with all props", () => {
      const { container } = render(
        <GaugeChart
          value={78}
          title="Performance Gauge"
          width={350}
          height={250}
          showValue={true}
          unit="%"
          colors={["#FF6B6B", "#00C49F", "#FFBB28", "#FF8042", "#E9ECEF"]}
          min={0}
          max={100}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with minimal configuration", () => {
      const { container } = render(<GaugeChart value={45} showValue={false} />);
      expect(container).toMatchSnapshot();
    });
  });
});
