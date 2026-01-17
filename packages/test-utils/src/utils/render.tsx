import React from "react";
import { render, RenderOptions } from "@testing-library/react";

/**
 * Custom render function with optional providers
 * Use this when you need to wrap components with providers (e.g., ThemeProvider, StoreProvider)
 */
export interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  /**
   * Wrapper component (e.g., providers)
   */
  wrapper?: React.ComponentType<{ children: React.ReactNode }>;
}

/**
 * Custom render function for React Testing Library
 * @param ui Component to render
 * @param options Render options including wrapper
 * @returns Render result
 */
export function customRender(
  ui: React.ReactElement,
  options: CustomRenderOptions = {}
) {
  const { wrapper: Wrapper, ...restOptions } = options;

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    if (Wrapper) {
      return <Wrapper>{children}</Wrapper>;
    }
    return <>{children}</>;
  };

  return render(ui, { wrapper: AllTheProviders, ...restOptions });
}

// Re-export everything from @testing-library/react
export * from "@testing-library/react";

// Override render with custom implementation
export { customRender as render };
