import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@/test/utils";
import Page, { generateMetadata, generateStaticParams } from "./page";

const { generateParams, getPage, notFound } = vi.hoisted(() => ({
  generateParams: vi.fn(() => [{ slug: [] }, { slug: ["getting-started"] }]),
  getPage: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/navigation", async () => {
  const actual = await vi.importActual("next/navigation");

  return {
    ...actual,
    notFound,
  };
});

vi.mock("@/lib/source", () => ({
  source: {
    getPage,
    generateParams,
  },
}));

vi.mock("fumadocs-ui/page", () => ({
  DocsPage: ({ children }: { children: React.ReactNode }) => (
    <article data-testid="docs-page">{children}</article>
  ),
  DocsTitle: ({ children }: { children: React.ReactNode }) => (
    <h1>{children}</h1>
  ),
  DocsDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DocsBody: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("Docs catch-all page", () => {
  it("renders MDX content for the requested slug", async () => {
    getPage.mockReturnValueOnce({
      data: {
        body: () => <div>Welcome to the documentation</div>,
        description: "Learn how the docs experience works.",
        title: "Getting Started",
        toc: [],
      },
    });

    const element = await Page({
      params: Promise.resolve({ slug: ["getting-started"] }),
    });

    render(element);

    expect(
      screen.getByRole("heading", { name: "Getting Started" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Learn how the docs experience works."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Welcome to the documentation"),
    ).toBeInTheDocument();
    expect(getPage).toHaveBeenCalledWith(["getting-started"]);
  });

  it("delegates to Next.js notFound when a page does not exist", async () => {
    getPage.mockReturnValueOnce(undefined);

    await expect(
      Page({
        params: Promise.resolve({ slug: ["missing-page"] }),
      }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(notFound).toHaveBeenCalled();
  });

  it("exposes static params from the generated Fumadocs source", async () => {
    await expect(generateStaticParams()).resolves.toEqual([
      { slug: [] },
      { slug: ["getting-started"] },
    ]);
    expect(generateParams).toHaveBeenCalled();
  });

  it("generates metadata from the current documentation page", async () => {
    getPage.mockReturnValueOnce({
      data: {
        description: "Platform setup and onboarding guides.",
        title: "Getting Started",
      },
    });

    await expect(
      generateMetadata({
        params: Promise.resolve({ slug: ["getting-started"] }),
      }),
    ).resolves.toEqual({
      description: "Platform setup and onboarding guides.",
      title: "Getting Started | JS Community Docs",
    });
  });
});
