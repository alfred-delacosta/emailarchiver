import { MarketingHeader } from "@/components/MarketingHeader";
import { MarketingFooter } from "@/components/MarketingFooter";
import styles from "./marketing.module.css";

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EmailArchiver",
  url: "https://emailarchiver.app",
  logo: "https://emailarchiver.app/icon.svg",
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "EmailArchiver",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "Upload .eml and .mbox files, parse into a library, and export emails to PDF.",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <MarketingHeader />
      <main className={styles.main}>{children}</main>
      <MarketingFooter />
    </>
  );
}
