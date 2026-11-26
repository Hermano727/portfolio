import type { Metadata } from "next";
import Link from "next/link";
import styles from "./coupld.module.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hermanhundsberger.com"),
  title: { default: "Coupl'd — A space for the two of you", template: "%s | Coupl'd" },
  description: "Coupl'd is a private couples scrapbook for shared memories, photos, dates, plans and little notes.",
  icons: { icon: "/coupld/icon.png", shortcut: "/coupld/icon.png", apple: "/coupld/icon.png" },
  openGraph: {
    title: "Coupl'd — A space for the two of you",
    description: "Keep your memories, plans and everyday moments together in a private couples scrapbook.",
    images: [{ url: "/coupld/icon.png", width: 1024, height: 1024, alt: "Coupl'd app icon" }],
    type: "website",
  },
};

export default function CoupldLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.site}>
      <a className={styles.skip} href="#coupld-main">Skip to content</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/coupld">
          <img src="/coupld/icon.png" width="40" height="40" alt="" />
          <span>Coupl&apos;d</span>
        </Link>
        <nav aria-label="Coupl'd navigation" className={styles.nav}>
          <Link href="/coupld/privacy">Privacy</Link>
          <Link href="/coupld/terms">Terms</Link>
          <a href="mailto:coupldappsupport@gmail.com">Support</a>
        </nav>
      </header>
      <main id="coupld-main" className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <div><strong>Coupl&apos;d</strong><p>A private scrapbook, made for two.</p></div>
        <div className={styles.footerLinks}>
          <Link href="/coupld/privacy">Privacy policy</Link>
          <Link href="/coupld/terms">Terms of service</Link>
          <a href="mailto:coupldappsupport@gmail.com">coupldappsupport@gmail.com</a>
        </div>
        <p className={styles.credit}>Created and operated by Herman Hundsberger.</p>
      </footer>
    </div>
  );
}