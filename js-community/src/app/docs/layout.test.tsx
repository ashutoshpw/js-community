import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/utils";
import Layout from "./layout";

const { docsLayoutMock } = vi.hoisted(() => ({
  docsLayoutMock: vi.fn(
    ({
      children,
      tree,
      nav,
    }: {
      children: React.ReactNode;
      tree: unknown;
      nav?: { title?: React.ReactNode };
    }) => (
      <div data-testid="docs-layout">
        <span data-testid="docs-layout-title">{nav?.title}</span>
        <span data-testid="docs-layout-tree">{JSON.stringify(tree)}</span>
        {children}
      </div>
    ),
  ),
}));

vi.mock("fumadocs-ui/layouts/docs", () => ({
  DocsLayout: docsLayoutMock,
}));

vi.mock("@/lib/source", () => ({
  source: {
    pageTree: {
      children: [{ name: "Getting Started" }],
      name: "Docs",
    },
  },
}));

describe("Docs layout", () => {
  it("wires the shared Fumadocs layout configuration", () => {
    render(
      <Layout>
        <div>Documentation content</div>
      </Layout>,
    );

    expect(screen.getByTestId("docs-layout")).toBeInTheDocument();
    expect(screen.getByTestId("docs-layout-title")).toHaveTextContent(
      "JS Community Docs",
    );
    expect(screen.getByText("Documentation content")).toBeInTheDocument();
    expect(screen.getByTestId("docs-layout-tree")).toHaveTextContent(
      "Getting Started",
    );
  });
});
