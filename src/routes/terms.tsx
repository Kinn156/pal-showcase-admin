import { createFileRoute } from "@tanstack/react-router";

import { Block, PageShell } from "@/components/site/PageShell";

const title = "Terms & Policy | Pal Inc";
const description =
  "Pal Inc terms of service, privacy policy, acceptable use rules and data processing commitments.";

export const Route = createFileRoute("/terms")({
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
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell
      eyebrow="Terms & Policy"
      title="The rules, in plain language"
      intro="These summaries describe how the Pal Inc platform may be used and how we handle your data. They are written to be read, not skipped."
    >
      <Block heading="Terms of Service">
        <p>
          By using the Pal Inc platform you agree to pay for the resources you consume, to keep your
          account credentials secure, and to not resell raw capacity without a partner agreement. We
          commit to 30 days notice before any material change to these terms.
        </p>
      </Block>
      <Block id="privacy" heading="Privacy Policy">
        <p>
          We collect the minimum data required to operate your account: identity, billing, and
          operational telemetry. We do not sell personal data, and we do not train models on your
          workloads or customer data.
        </p>
      </Block>
      <Block id="acceptable-use" heading="Acceptable Use">
        <p>
          No unlawful content, no unsolicited bulk messaging, no attacks against third parties, and
          no attempts to bypass tenant isolation. Violations are handled with notice unless there is
          active harm.
        </p>
      </Block>
      <Block id="dpa" heading="Data Processing Addendum">
        <p>
          Pal Inc acts as a processor for customer data, with sub-processors listed publicly, EU and
          US regions available, and full export on request within 72 hours.
        </p>
      </Block>
    </PageShell>
  );
}