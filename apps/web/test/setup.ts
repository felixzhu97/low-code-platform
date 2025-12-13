import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock scrollTo
window.scrollTo = vi.fn();

// Mock lucide-react icons
vi.mock("lucide-react", () => {
  const MockIcon = (props: any) => {
    const React = require("react");
    return React.createElement("div", {
      "data-testid": `${String(props.name || "icon").toLowerCase()}-icon`,
      className: props.className || "",
      ...props,
    });
  };

  // Explicitly define all icons that might be used
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

  return new Proxy(icons, {
    get: (target, prop) => {
      if (typeof prop === "string" && prop in target) {
        return (props: any) => MockIcon({ ...props, name: prop.toLowerCase() });
      }
      return MockIcon;
    },
  });
});
