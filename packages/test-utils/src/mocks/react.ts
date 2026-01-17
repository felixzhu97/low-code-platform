/**
 * Mock React-related components and libraries
 * @param vi Vitest mock function (from 'vitest' or 'vitest/globals')
 */
export function mockReactIcons(vi: any) {
  // Mock lucide-react icons
  vi.mock("lucide-react", () => {
    const React = require("react");
    const MockIcon = (props: any) => {
      return React.createElement("div", {
        "data-testid": `${String(props.name || "icon").toLowerCase()}-icon`,
        className: props.className || "",
        ...props,
      });
    };

    // Explicitly define common icons
    const icons = {
      ChevronDown: MockIcon,
      Trash2: MockIcon,
      Smartphone: MockIcon,
      Tablet: MockIcon,
      BarChart: MockIcon,
      LineChart: MockIcon,
      PieChart: MockIcon,
      ArrowUpDown: MockIcon,
      Filter: MockIcon,
      // Add any other icons that might be used
    };

    // Use Proxy to handle dynamic icon imports
    return new Proxy(icons, {
      get: (target, prop) => {
        if (typeof prop === "string" && prop in target) {
          return (props: any) => MockIcon({ ...props, name: prop.toLowerCase() });
        }
        return MockIcon;
      },
    });
  });
}
