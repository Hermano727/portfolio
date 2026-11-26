import type { Metadata } from "next";
import Link from "next/link";
import styles from "./coupld.module.css";

export const metadata: Metadata = { alternates: { canonical: "/coupld" } };

export default function CoupldHome() {
  return (
    <>
      <section className={styles.hero} aria-labelledby="coupld-title">
        <div>
          <p className={styles.eyebrow}>A private couples scrapbook</p>
          <h1 id="coupld-title">A space for<br />the two of you.</h1>
          <p className={styles.intro}>Coupl&apos;d brings your memories, plans and everyday moments together. Save the dates you loved, collect your photos and leave a note for your person.</p>
          <p className={styles.beta}>Currently in private beta.</p>
          <a className={styles.button} href="mailto:coupldappsupport@gmail.com">Get in touch</a>
        </div>
        <div className={styles.art}>
          <img className={styles.appIcon} src="/coupld/icon.png" width="280" height="280" alt="Coupl'd icon: two hands forming a heart" />
          <span className={styles.artCaption}>Your story, together.</span>
        </div>
      </section>
      <section className={styles.features} aria-label="What you can do in Coupl'd">
        <article><span className={styles.motif} aria-hidden="true">♡</span><h2>Keep the good days.</h2><p>Build a shared scrapbook of dates and memories, with the photos, places and captions that make them yours.</p></article>
        <article><span className={styles.motif} aria-hidden="true">✳</span><h2>Make room for more.</h2><p>Plan your next date and keep upcoming moments together in your shared calendar.</p></article>
        <article><span className={styles.motif} aria-hidden="true">✉</span><h2>Stay closer.</h2><p>Answer daily questions, send partner notes and make your space feel like you with avatars and themes.</p></article>
      </section>
      <section className={styles.privacyNote} aria-labelledby="privacy-title">
        <div><p className={styles.eyebrow}>Made for your private space</p><h2 id="privacy-title">Your moments deserve care.</h2></div>
        <div><p>You choose the photos and details you share with your partner. Coupl&apos;d uses private storage and server authorization, with tools to report content, block a partner and delete your account.</p><p>Google sign-in is optional. If you choose it, Coupl&apos;d uses your Google account identifier, email and available profile information to sign you in and maintain your account. We do not request access to Gmail, Google Drive or your Google contacts.</p><Link className={styles.textLink} href="/coupld/privacy">Read our privacy policy</Link></div>
      </section>
    </>
  );
}