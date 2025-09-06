import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PieChart } from "../pie-chart";

// Mock recharts
vi.mock("recharts", () => ({
  PieChart: ({ children, ...props }: any) => (
    <div data-testid="recharts-pie-chart" data-props={JSON.stringify(props)}>
      {children}
    </div>
  ),
  Pie: ({
    data,
    dataKey,
    cx,
    cy,
    outerRadius,
    innerRadius,
    fill,
    paddingAngle,
    label,
    labelLine,
    children,
    ...props
  }: any) => (
    <div
      data-testid="recharts-pie"
      data-datakey={dataKey}
      data-cx={cx}
      data-cy={cy}
      data-outerradius={outerRadius}
      data-innerradius={innerRadius}
      data-fill={fill}
      data-paddingangle={paddingAngle}
      data-label={typeof label === "function" ? "function" : label}
      data-labelline={labelLine}
    >
      <div data-testid="pie-data">{JSON.stringify(data)}</div>
      {children}
    </div>
  ),
  Cell: ({ fill, ...props }: any) => (
    <div data-testid="recharts-cell" data-fill={fill} {...props} />
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

describe("PieChart", () => {
  const sampleData = [
    { category: "移动端", value: 45 },
    { category: "桌面端", value: 32 },
    { category: "平板端", value: 18 },
    { category: "其他", value: 5 },
  ];

  const requiredProps = {
    data: sampleData,
    nameField: "category",
    valueField: "value",
  };

  describe("Rendering", () => {
    it("renders with required props", () => {
      render(<PieChart {...requiredProps} />);

      expect(
        screen.getByTestId("recharts-responsive-container")
      ).toBeInTheDocument();
      expect(screen.getByTestId("recharts-pie-chart")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-pie")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-tooltip")).toBeInTheDocument();
      expect(screen.getByTestId("recharts-legend")).toBeInTheDocument();
    });

    it("renders with title", () => {
      const title = "Device Usage Distribution";
      render(<PieChart {...requiredProps} title={title} />);

      expect(screen.getByText(title)).toBeInTheDocument();
    });

    it("renders with custom dimensions", () => {
      render(<PieChart {...requiredProps} width={600} height={400} />);

      const container = screen.getByTestId("recharts-responsive-container");
      expect(container).toHaveAttribute("data-width", "100%");
      expect(container).toHaveAttribute("data-height", "100%");
    });

    it("renders with custom colors", () => {
      const customColors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00"];
      render(<PieChart {...requiredProps} colors={customColors} />);

      const cells = screen.getAllByTestId("recharts-cell");
      expect(cells).toHaveLength(sampleData.length);

      cells.forEach((cell, index) => {
        expect(cell).toHaveAttribute(
          "data-fill",
          customColors[index % customColors.length]
        );
      });
    });

    it("hides legend when showLegend is false", () => {
      render(<PieChart {...requiredProps} showLegend={false} />);

      expect(screen.queryByTestId("recharts-legend")).not.toBeInTheDocument();
    });

    it("hides tooltip when showTooltip is false", () => {
      render(<PieChart {...requiredProps} showTooltip={false} />);

      expect(screen.queryByTestId("recharts-tooltip")).not.toBeInTheDocument();
    });
  });

  describe("Data Handling", () => {
    it("processes data correctly with default nameField and valueField", () => {
      const defaultData = [
        { category: "A", value: 10 },
        { category: "B", value: 20 },
      ];

      render(
        <PieChart data={defaultData} nameField="category" valueField="value" />
      );

      const pieDataElement = screen.getByTestId("pie-data");
      const processedData = JSON.parse(pieDataElement.textContent || "[]");

      expect(processedData).toEqual([
        { name: "A", value: 10 },
        { name: "B", value: 20 },
      ]);
    });

    it("uses default data when no data provided", () => {
      render(<PieChart data={[]} nameField="category" valueField="value" />);

      const pieDataElement = screen.getByTestId("pie-data");
      const processedData = JSON.parse(pieDataElement.textContent || "[]");

      expect(processedData).toEqual([
        { name: "移动端", value: 45 },
        { name: "桌面端", value: 32 },
        { name: "平板端", value: 18 },
        { name: "其他", value: 5 },
      ]);
    });

    it("handles custom field names", () => {
      const customData = [
        { type: "TypeA", count: 100 },
        { type: "TypeB", count: 200 },
      ];

      render(
        <PieChart data={customData} nameField="type" valueField="count" />
      );

      const pieDataElement = screen.getByTestId("pie-data");
      const processedData = JSON.parse(pieDataElement.textContent || "[]");

      expect(processedData).toEqual([
        { name: "TypeA", value: 100 },
        { name: "TypeB", value: 200 },
      ]);
    });
  });

  describe("Pie Configuration", () => {
    it("applies correct pie positioning", () => {
      render(<PieChart {...requiredProps} />);

      const pie = screen.getByTestId("recharts-pie");
      expect(pie).toHaveAttribute("data-cx", "50%");
      expect(pie).toHaveAttribute("data-cy", "50%");
    });

    it("applies custom radius values", () => {
      render(
        <PieChart {...requiredProps} innerRadius={40} outerRadius={120} />
      );

      const pie = screen.getByTestId("recharts-pie");
      expect(pie).toHaveAttribute("data-innerradius", "40");
      expect(pie).toHaveAttribute("data-outerradius", "120");
    });

    it("applies custom padding angle", () => {
      render(<PieChart {...requiredProps} paddingAngle={5} />);

      const pie = screen.getByTestId("recharts-pie");
      expect(pie).toHaveAttribute("data-paddingangle", "5");
    });

    it("sets correct default radius values", () => {
      render(<PieChart {...requiredProps} />);

      const pie = screen.getByTestId("recharts-pie");
      expect(pie).toHaveAttribute("data-innerradius", "0");
      expect(pie).toHaveAttribute("data-outerradius", "80");
    });

    it("has label function by default", () => {
      render(<PieChart {...requiredProps} />);

      const pie = screen.getByTestId("recharts-pie");
      expect(pie).toHaveAttribute("data-label", "function");
    });
  });

  describe("Color Configuration", () => {
    it("uses default colors when none provided", () => {
      render(<PieChart {...requiredProps} />);

      const cells = screen.getAllByTestId("recharts-cell");
      const defaultColors = [
        "#0088FE",
        "#00C49F",
        "#FFBB28",
        "#FF8042",
        "#8884D8",
      ];

      cells.forEach((cell, index) => {
        expect(cell).toHaveAttribute(
          "data-fill",
          defaultColors[index % defaultColors.length]
        );
      });
    });

    it("cycles through colors when data exceeds color array length", () => {
      const manyDataPoints = [
        { category: "A", value: 10 },
        { category: "B", value: 20 },
        { category: "C", value: 30 },
        { category: "D", value: 40 },
        { category: "E", value: 50 },
        { category: "F", value: 60 }, // Should cycle back to first color
      ];

      const customColors = ["#red", "#green", "#blue"];

      render(
        <PieChart
          data={manyDataPoints}
          nameField="category"
          valueField="value"
          colors={customColors}
        />
      );

      const cells = screen.getAllByTestId("recharts-cell");
      expect(cells[0]).toHaveAttribute("data-fill", "#red");
      expect(cells[1]).toHaveAttribute("data-fill", "#green");
      expect(cells[2]).toHaveAttribute("data-fill", "#blue");
      expect(cells[3]).toHaveAttribute("data-fill", "#red"); // Cycles back
      expect(cells[4]).toHaveAttribute("data-fill", "#green");
      expect(cells[5]).toHaveAttribute("data-fill", "#blue");
    });
  });

  describe("Accessibility", () => {
    it("has proper heading structure when title is provided", () => {
      const title = "Sales Distribution by Region";
      render(<PieChart {...requiredProps} title={title} />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent(title);
    });

    it("does not render heading when no title provided", () => {
      render(<PieChart {...requiredProps} />);

      const heading = screen.queryByRole("heading");
      expect(heading).not.toBeInTheDocument();
    });
  });

  describe("Snapshot Tests", () => {
    it("matches snapshot with required props", () => {
      const { container } = render(<PieChart {...requiredProps} />);
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with all props", () => {
      const { container } = render(
        <PieChart
          {...requiredProps}
          title="Complete Pie Chart"
          width={600}
          height={400}
          colors={["#ff0000", "#00ff00", "#0000ff"]}
          showLegend={true}
          showTooltip={true}
          innerRadius={30}
          outerRadius={100}
          paddingAngle={2}
        />
      );
      expect(container).toMatchSnapshot();
    });

    it("matches snapshot with minimal configuration", () => {
      const { container } = render(
        <PieChart {...requiredProps} showLegend={false} showTooltip={false} />
      );
      expect(container).toMatchSnapshot();
    });
  });
});
