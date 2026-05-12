import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "../avatar";

describe("Avatar", () => {
  describe("Avatar Rendering", () => {
    it("renders avatar element", () => {
      const { container } = render(<Avatar />);
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders with custom className", () => {
      const { container } = render(<Avatar className="custom-avatar" />);
      expect(container.firstChild).toHaveClass("custom-avatar");
    });

    it("renders with default styling classes", () => {
      const { container } = render(<Avatar />);
      const avatar = container.firstChild;
      expect(avatar).toHaveClass("relative", "flex", "h-10", "w-10", "shrink-0", "overflow-hidden", "rounded-full");
    });
  });

  describe("Composition", () => {
    it("renders complete avatar with image and fallback", () => {
      const { container } = render(
        <Avatar>
          <AvatarImage />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders avatar with only fallback", () => {
      const { container } = render(
        <Avatar>
          <AvatarFallback>JS</AvatarFallback>
        </Avatar>
      );
      expect(container.firstChild).toBeInTheDocument();
    });

    it("renders multiple avatars", () => {
      const { container } = render(
        <>
          <Avatar><AvatarFallback>U1</AvatarFallback></Avatar>
          <Avatar><AvatarFallback>U2</AvatarFallback></Avatar>
        </>
      );
      const avatars = container.querySelectorAll(".rounded-full");
      expect(avatars.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe("Styling", () => {
    it("applies custom classes to root", () => {
      const { container } = render(<Avatar className="w-12 h-12 border-2" />);
      expect(container.firstChild).toHaveClass("w-12", "h-12", "border-2");
    });
  });
});
