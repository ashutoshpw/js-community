import { describe, expect, it } from "vitest";
import { render } from "@/test/utils";
import Home from "./page";

describe("Home Page theme", () => {
  it("removes blue/purple gradients for a neutral palette", () => {
    const { container } = render(<Home />);

    expect(container.querySelector('[class*="bg-gradient"]')).toBeNull();
    expect(container.querySelector('[class*="blue-"]')).toBeNull();
    expect(container.querySelector('[class*="purple-"]')).toBeNull();
  });
});
