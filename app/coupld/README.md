# Coupl'd public pages

Routes: `/coupld`, `/coupld/privacy`, `/coupld/terms`.

These server-rendered Next.js pages are public and require no application account.
The app logo lives at `public/coupld/icon.png`.

`legal-data.ts` is a snapshot of the app repository's
`supabase/functions/_shared/legal.ts` (policy version 2026-11-23).
When the app's policy changes, update this snapshot and the public policy's update
date together. The privacy page adds Google sign-in, support, website hosting and
website analytics disclosures to the app's policy sections.

Production uses this portfolio's existing Vercel project, deployed from GitHub
`main`. Verify all three public URLs after deployment before retrying Google
branding verification. Search Console domain ownership must also be verified
with the Google account authorized for the OAuth project; publishing these pages
does not verify domain ownership.