import { createFileRoute } from "@tanstack/react-router";

import { Block, PageShell } from "@/components/site/PageShell";

const title = "Support | Pal Inc";
const description =
  "Get help with Pal Cloud, Pal Data, Pal Observe and Pal Shield — docs, status, and direct access to engineers.";

export const Route = createFileRoute("/support")({
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
  component: SupportPage,
});

function SupportPage() {
  return (
    <PageShell
      eyebrow="Support"
      title="Talk to engineers, not scripts"
      intro="Every paid plan includes direct access to the people who build the platform. Response targets are published, not promised."
    >
      <Block id="docs" heading="Documentation">
        <p>
          Guides, API references and runnable examples for every product, versioned alongside the
          platform itself.
        </p>
      </Block>
      <Block id="status" heading="Status & incidents">
        <p>
          Live regional status with historical uptime and full post-incident reports published within
          five business days.
        </p>
      </Block>
      <Block heading="Contact">
        <p>
          Enterprise: dedicated Slack or Discord channel with a 15-minute severity-one target. Teams:
          email with a 4-hour business-day target. Community: public Discord.
        </p>
      </Block>
    </PageShell>
  );
}