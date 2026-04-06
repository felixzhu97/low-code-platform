import "@emotion/react";

declare module "react" {
  interface DOMAttributes<T> {
    css?: import("@emotion/react").Interpolation<Theme>;
  }
}
