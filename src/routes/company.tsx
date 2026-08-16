import { createFileRoute } from "@tanstack/react-router";

import { Block, PageShell } from "@/components/site/PageShell";

const title = "Company & Investors | Pal Inc";
const description =
  "Who Pal Inc is, how we are funded, and where the open infrastructure company is heading next.";

export const Route = createFileRoute("/company")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompanyPage,
});

function CompanyPage() {
  return (
    <PageShell
      eyebrow="Company & Investors"
      title="Building the neutral layer of the internet"
      intro="Pal Inc is an infrastructure company. We sell compute, data and delivery primitives — and we sell them without hostages."
    >
      <Block heading="Our thesis">
        <p>
          Every decade of computing consolidates, then breaks open again. We believe the current
          consolidation around closed platforms is temporary, and that the teams who win the next
          decade will run on portable primitives they can inspect, benchmark and replace.
        </p>
      </Block>
      <Block id="changelog" heading="Milestones">
        <ul className="space-y-2">
          <li>2023 — Pal Cloud enters private beta across 12 regions.</li>
          <li>2024 — Pal Data launches with database branching and PITR.</li>
          <li>2025 — Pal Observe and Pal Shield ship; 40 regions live.</li>
          <li>2026 — Platform 2.0 generally available.</li>
        </ul>
      </Block>
      <Block heading="Investors">
        <p>
          Pal Inc is backed by long-horizon infrastructure investors who support open standards and
          a documented exit path for every customer. Investor relations enquiries are handled by our
          team directly.
        </p>
      </Block>
      <Block id="careers" heading="Careers">
        <p>
          We hire systems engineers, distributed-database people and designers who care about
          latency. Remote-first across Europe, Africa and North America.
        </p>
      </Block>
    </PageShell>
  );
}