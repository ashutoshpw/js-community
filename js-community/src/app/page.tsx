import Features from "./components/Features";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "JS Community",
  description:
    "A discussion platform for JavaScript developers — ask questions, share knowledge, and connect with other engineers.",
  url: "https://jscommunity.dev",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://jscommunity.dev/forum/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "JS Community",
  url: "https://jscommunity.dev",
  description: "A community forum for JavaScript developers.",
  sameAs: [],
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe static content
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD structured data is safe static content
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Hero />
      <Features />
      <Stats />
      <Testimonials />
      <Footer />
    </div>
  );
}
