# Setup & Deployment

## Local development

```bash
npm install
npm run dev
```

This project runs on Postgres (via Supabase) both locally and in production —
`DATABASE_URL`/`DIRECT_URL` in `.env` point at the same database either way,
so there's no separate local-only database to keep in sync.

Your admin login (see `.env` — change these before this goes fully public):

- URL: `http://localhost:3000/admin/login`
- Email: `admin@example.com`
- Password: `12345678`

To change them: edit `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `.env`, then re-run
`npm run db:seed` (it now upserts the password too, so it's safe to run again).

There's no signup page anywhere — the only way in is that one login form. It's
linked from the site footer ("Admin login"); remove that link in
`components/Footer.tsx` if you'd rather it stayed unlisted.

## Comments

Readers can comment on any published post without creating an account — just
a name, a required email (used for the mailing-list sync below, never shown
publicly), and the comment. Comments go **live immediately** — there's no
moderation queue blocking them. Two safety nets instead:

- **You** can un-approve or delete any comment from `/admin/comments`.
- **Readers** can delete their own comment directly on the post — the site
  remembers a private per-comment token in their browser (`localStorage`) so
  only the person who posted it sees a delete option for it. Nobody else
  (including other readers) can delete someone else's comment.

## Newsletter signups

There's a simple email capture form in the site footer (`components/
NewsletterSignup.tsx`) posting to `/api/subscribe`. Every signup:

- Saves to the database (`Subscriber` model) — visible/exportable-as-CSV from
  `/admin/subscribers`, so this works even if you never touch Google Sheets.
- Optionally also syncs to a Google Sheet, same mechanism as comments below.

Duplicate emails are handled gracefully (the visitor just sees "you're already
on the list", no error).

## Syncing to a Google Sheet (comments + newsletter signups)

Optional — both comments and signups work fine without this; it just also
appends each one as a row to a Google Sheet you control (comments go to one
tab, signups to another, in the same spreadsheet).

1. Go to [console.cloud.google.com](https://console.cloud.google.com), create
   a project (or use an existing one).
2. **APIs & Services → Library** → search "Google Sheets API" → **Enable**.
3. **APIs & Services → Credentials** → **Create Credentials → Service account**.
   Give it any name, skip the optional permission/role steps.
4. Open the new service account → **Keys** tab → **Add Key → Create new key →
   JSON**. This downloads a `.json` file — keep it private, don't commit it.
5. From that JSON file, copy:
   - `client_email` → this is your `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `private_key` → this is your `GOOGLE_PRIVATE_KEY` (keep the `\n`
     characters in it literally as text when you paste it into an env var —
     the code un-escapes them at runtime)
6. Create (or open) the Google Sheet you want data to land in. Add two tabs:
   - One named `Sheet1` (or whatever you set `GOOGLE_SHEET_NAME` to) with
     header row `Name, Email, Comment, Post, Date` — for comments.
   - One named `Subscribers` (or whatever you set
     `GOOGLE_SUBSCRIBERS_SHEET_NAME` to) with header row `Email, Source, Date`
     — for newsletter signups.
7. Click **Share** on that sheet and share it with the `client_email` address
   from step 5, as **Editor**.
8. Copy the sheet's ID from its URL — the long string between `/d/` and
   `/edit`: `https://docs.google.com/spreadsheets/d/THIS_PART/edit`.
9. Set `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`,
   `GOOGLE_SHEET_NAME`, and `GOOGLE_SUBSCRIBERS_SHEET_NAME` in your environment.

## Going live: what you need

### 1. Postgres (already set up)

Already using Supabase — if you ever need to point this at a different
Postgres instance (e.g. replicating for a client, see below), get its pooled
and direct connection strings (Supabase's "Connect" dialog → ORM → Prisma
gives you both, pre-formatted) and set them as `DATABASE_URL`/`DIRECT_URL`,
then run `npx prisma migrate deploy` and `npm run db:seed` against it.

### 2. Cloudinary for images/PDFs (free tier)

1. Create a free account at [cloudinary.com](https://cloudinary.com).
2. From the dashboard, copy either the single **API Environment variable**
   (`CLOUDINARY_URL=cloudinary://key:secret@cloud_name`), or the three
   separate **Cloud name** / **API Key** / **API Secret** values — either
   form works, `lib/storage.ts` picks up whichever is set.
3. **This is required before uploads work on Vercel** — its filesystem is
   read-only, so without Cloudinary configured, image/PDF uploads fail there
   (with a clear error message pointing back here) even though they work
   fine on your own machine via local disk.

### 3. Video

Nothing to set up — paste a YouTube or Vimeo link into the post editor's "Video
link" field and it embeds automatically.

### 4. Deploy to Vercel

1. Push this repo to GitHub (already connected).
2. In Vercel → Project → Settings → Environment Variables, add everything from
   `.env.example`: `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`,
   `NEXTAUTH_URL` (your real Vercel URL), `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   `ADMIN_NAME`, the Cloudinary vars, and the Google Sheets vars if you're
   using that.
3. Deploy. Vercel runs `npm run build`, which runs `prisma generate` automatically.
4. **Important:** clicking "Redeploy" on an existing deployment reruns that
   exact old commit — it does **not** pick up new pushes or new env vars
   retroactively applied to old code. After pushing new code, or after adding
   new env vars, trigger a genuinely fresh deployment (the newest entry in the
   Deployments tab, not "Redeploy" on an old one).

## Replicating this for a client

This repo is a **generic template** — every piece of content specific to one
person (site name, tagline, bio, seed data) lives in one config file or the
database, never hardcoded into components. Cloning it for a new client:

1. Duplicate the repo (or use it as a GitHub template).
2. Edit `lib/site-config.ts` — site name, tagline, description, author name/
   bio/title, and the starting category list. This is the **only** file you
   need to touch to re-brand the whole site.
3. Set up a fresh Supabase (or Neon) database and Cloudinary account for the
   client (steps 1–2 above) and put their credentials in a new `.env`.
4. Pick their admin email/password, run `npx prisma migrate deploy` then
   `npm run db:seed`.
5. (Optional) Set up their own Google Sheet for comment/signup syncing —
   each client gets their own spreadsheet, not a shared one.
6. Deploy as a new Vercel project (step 4 above) on their domain.

Everything else — the editor, categories, video embeds, PDF attachments,
comments, newsletter capture, the whole visual design — carries over
unchanged. Nothing in the codebase itself needs editing beyond `site-config.ts`.

## Design system reference

The visual language (colors, the serif/sans font pairing, spacing) lives in
`app/globals.css` as CSS variables and a handful of utility classes:

- `--ink`, `--paper`, `--accent`, `--border`, `--paper-card` — the whole
  color palette; change these to re-theme the entire site at once.
- `.font-display` — the serif headline font (Merriweather) used for every
  title/heading on the public site.
- `.paper-card` — the base card style (hairline border, no shadow).
- `.btn-primary` / `.btn-outline` — the two button styles used everywhere.
- `.prose-notebook` — article body typography, including `.prose-big` (the
  editor's "Emphasize" button, for heading-weight words inline in a sentence)
  and pastel `mark` highlight colors.

The design deliberately avoids illustration/decoration — restrained,
whitespace-heavy, and typography-led, matching how the personal-blog sites
this was modeled on (Gates Notes, Seth Godin, Scott Galloway, and similar)
are actually built.

## Why pages are marked "force-dynamic"

Several pages (`app/(public)/layout.tsx`, `app/admin/(dashboard)/layout.tsx`,
`app/sitemap.ts`) export `dynamic = "force-dynamic"`. Without it, Next.js
would bake a page's HTML in once at build time if it has no dynamic inputs —
which is wrong for a CMS where content changes constantly between deploys.
Leave these in place; removing them will make new posts/comments/resources/
subscribers stop showing up until the next deployment.
