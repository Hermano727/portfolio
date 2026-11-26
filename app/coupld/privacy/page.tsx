import type { Metadata } from "next";
import { legalPages, POLICY_VERSION } from "../legal-data";
import styles from "../coupld.module.css";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Coupl'd collects, uses, shares and deletes account information, Google sign-in data and private scrapbook content.",
  alternates: { canonical: "/coupld/privacy" },
};

export default function PrivacyPage() {
  return (
    <article className={styles.legal}>
      <p className={styles.eyebrow}>Coupl&apos;d</p>
      <h1>Privacy policy</h1>
      <p className={styles.updated}>Updated November 26, 2026 · App policy version {POLICY_VERSION}</p>
      <p className={styles.lead}>Coupl&apos;d is a private couples scrapbook operated by Herman Hundsberger. This policy explains what information we collect, why we use it, who can access it and the choices you have.</p>
      <section><h2>Google sign-in and account information</h2><p>If you choose Google sign-in, Google provides an account identifier, email address and available basic profile information, such as your name and profile picture. We use this information to authenticate you, link your chosen sign-in method to your Coupl&apos;d account and provide account functionality. Your selected display name and avatar can be visible to your partner.</p><p>We do not request access to your Gmail messages, Google Drive files, Google contacts or Google Calendar. We do not use Google account information for advertising, sell it or use it to track you across other apps. Necessary account information is processed by our authentication provider, Supabase, to operate sign-in. You can disconnect Coupl&apos;d through your Google Account connections and delete your Coupl&apos;d account in Settings. Disconnecting Google alone does not delete your scrapbook; use account deletion for that.</p></section>
      {legalPages.privacy.sections.map(section => <section key={section.title}><h2>{section.title}</h2><p>{section.body}</p></section>)}
      <section><h2>This public website</h2><p>These public information pages are hosted on Vercel and use the portfolio website&apos;s Vercel Analytics integration to understand website traffic. Vercel processes website request and usage data for hosting and analytics. This website analytics integration does not receive your private Coupl&apos;d scrapbook content.</p></section>
      <section><h2>Contacting support</h2><p>If you contact support or send a safety report, we process the email address, message, report details and any information you choose to provide to respond and investigate. Please send only what is needed to explain the issue. For privacy requests, contact <a href="mailto:coupldappsupport@gmail.com">coupldappsupport@gmail.com</a>.</p></section>
    </article>
  );
}