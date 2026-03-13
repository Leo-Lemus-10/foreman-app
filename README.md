# Foreman Construction Daily Reports

Next.js App Router app for managing construction projects and one daily field report per project per day.

## Environment

Create `.env.local` with:

```bash
NEXT_PUBLIC_APP_PASSCODE=your-shared-passcode
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
```

## Database setup

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor.

## Run locally (development)

```bash
npm run dev
```

## Run production server

`npm start` now runs a prestart build automatically (`next build`) before launching `next start`, so you no longer hit the missing `.next` build error when starting fresh.

```bash
npm start
```

## App routes

- `/login`: shared passcode login persisted in `localStorage`.
- `/dashboard`: projects grid from Supabase.
- `/project/[id]`: daily report form using upsert on `(project_id, report_date)`.
