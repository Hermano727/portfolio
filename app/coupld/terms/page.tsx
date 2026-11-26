import type { Metadata } from "next";
import Link from "next/link";
import { legalPages, POLICY_VERSION } from "../legal-data";
import styles from "../coupld.module.css";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The terms and safety rules for using Coupl'd, a private couples scrapbook.",
  alternates: { canonical: "/coupld/terms" },
};

export default function TermsPage() {
  return (
    <article className={styles.legal}>
      <p className={styles.eyebrow}>Coupl&apos;d</p>
      <h1>Terms of service</h1>
      <p className={styles.updated}>App policy version {POLICY_VERSION}</p>
      <p className={styles.lead}>These terms apply to Coupl&apos;d, operated by Herman Hundsberger. Please also read our <Link href="/coupld/privacy">privacy policy</Link> for details about your information and choices.</p>
      {legalPages.terms.sections.map(section => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}
    </article>
  );
}