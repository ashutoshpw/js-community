import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: "JS Community Docs",
      url: "/docs",
    },
    links: [
      {
        text: "Forum",
        url: "/forum",
        active: "nested-url",
      },
      {
        text: "About",
        url: "/about",
      },
      {
        text: "GitHub",
        url: "https://github.com/ashutoshpw/js-community",
        external: true,
      },
    ],
    searchToggle: {
      enabled: true,
    },
    themeSwitch: {
      enabled: true,
    },
  };
}
